import {html, render} from 'lit-html/lib/lit-extended';
import { TemplateResult, Template } from 'lit-html';

/* Register Element */
function buildTagName(name: string) {
    return name.split('').map( (x, i) => {
        if( x < 'a') {
            if(i !== 0) {
                return `-${x.toLowerCase()}`;
            }
            return x.toLowerCase();
        }
        return x;
    }).join('');
}

function register(CustomElementClass: { new(): any; [key: string]: any}, shadowRoot?: boolean) {

    const methods = Object.getOwnPropertyNames(CustomElementClass.prototype).filter((p) => {
        return typeof CustomElementClass.prototype[p] === 'function' && p !== 'constructor' && CustomElementClass.prototype[p].length === 0;
    });

    shadowRoot = shadowRoot || false;

    class RegisteredCustomElement extends CustomElementClass {
        constructor() {
            super();

            methods.forEach(p => {
                this[p] = this[p].bind(this);
            });

            if(shadowRoot) {
                this.attachShadow({mode: 'open'});
                if(this.shadowRoot) {
                    render(this.template(this.props, this.state), this.shadowRoot);
                }
            } else {
                render(this.template(this.props, this.state), <any>this);
            }
        }
    }

    window.customElements.define(buildTagName(CustomElementClass.name), RegisteredCustomElement);
}

/* State management */


class Store<S> {

    public state: S;
    private _subscriptions: { (state: S): void}[];

    constructor(state: S) {
        this.state = state || {};
        this._subscriptions = [];
    }

    getState(): S {
        return this.state;
    }

    subscribe(fn: {(state: S): void}) {
        this._subscriptions.push(fn);
    }

    setState(newState: S) {
        // Replace the two for loops with spread operator in the future
        let tempState: S = <S>{};
        for(let prop in this.state) {
            tempState[prop] = this.state[prop];
        }

        for(let prop in newState) {
            tempState[prop] = newState[prop];
        }

        this.state = tempState;
        this._callSubcriptions();
    }

    _callSubcriptions() {
        for(let i = 0; i < this._subscriptions.length; i++) {
            this._subscriptions[i](this.state);
        }
    }
}

function createStore<S>(defaultState: S) {
    return new Store(defaultState);
}

/* Inherit class */

interface Blaze<S> {
    connected?(): void;
}

abstract class Blaze<S> extends HTMLElement {
    public _state: Store<S>;
    public state: S;
    public props: any;

    abstract template(props: any, state: S): TemplateResult;

    constructor() {
        super();
        this._state = createStore(<S>{});
        this.state = this._state.getState();
        this.props = {};
        Array.prototype.slice.call(this.attributes).forEach((item: {name: string, value: any}) => {
            this.props[item.name] = item.value;
        });

        this._state.subscribe((state) => {
            this.state = state;
            this._render();
        });
    }

    _render() {
        if(this.shadowRoot) {
            render(this.template(this.props, this.state), this.shadowRoot);
        } else {
            render(this.template(this.props, this.state), this);
        }
    }

    connectedCallback() {
        if(typeof this.connected === 'function') {
            this.connected();
        }
        this._observeAttrChange();
    }

    setState(obj: S) {
        this._state.setState(obj);
        this.state = this._state.getState();
    }

    _observeAttrChange() {
        let observer = new MutationObserver((mutations: any[]) => {
          mutations.forEach((mutation: any) => {
            if (mutation.type === 'attributes') {
                let newVal = mutation.target.getAttribute(mutation.attributeName);
                if(!!mutation.attributeName) {
                    this._attributeChangedCallback(mutation.attributeName, newVal);
                }
            }
          });
        });
        observer.observe(this, {attributes: true});
        return observer;
    }

    _attributeChangedCallback(name:string, newValue:any) {
        this.props[name] = newValue;
        this._render();
    }


}

function linkState(element: any, stateProp: string) {
    return (e: any) => {
        element.setState({
            [stateProp]: e.currentTarget.value
        });
    }
}



export {
    html,
    register,
    Blaze,
    createStore,
    linkState,
    Store
}