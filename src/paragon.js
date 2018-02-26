import {html, render} from 'lit-html/lib/lit-extended';

/* Register Element */

function buildTagName(name) {
    return [...name].map( (x, i) => {
        if( x < 'a') {
            if(i !== 0) {
                return `-${x.toLowerCase()}`;
            }
            return x.toLowerCase();
        }
        return x;
    }).join('');
}

const register = (c, shadowRoot) => {

    const methods = Object.getOwnPropertyNames(c.prototype).filter((p) => {
        return typeof c.prototype[p] === 'function' && p[0] !== '_' && p !== 'constructor' && c.prototype[p].length === 0;
    });

    shadowRoot = shadowRoot || false;

    class RegisteredCustomElement extends c {
        constructor() {
            super();
            
            methods.forEach(p => {
                this[p] = this[p].bind(this);
            });

            if(shadowRoot) {
                this.attachShadow({mode: 'open'});
                render(this.template(this.props, this.state), this.shadowRoot);
            } else {
                render(this.template(this.props, this.state), this);
            }
        }
    }

    window.customElements.define(buildTagName(c.name), RegisteredCustomElement);
}

/* State management */


class store {

    constructor(state) {
        this.state = state || {};
        this._subscriptions = [];
    }

    getState() {
        return this.state;
    }

    subscribe(fn) {
        this._subscriptions.push(fn);
    }

    setState(newState) {
        const oldState = this.state;

        // Replace the two for loops with spread operator in the future
        let tempState = {};
        for(let prop in this.state) {
            tempState[prop] = this.state[prop];
        }

        for(let prop in newState) {
            tempState[prop] = newState[prop];
        }

        this.state = tempState;
        this._callSubcriptions(oldState);
    }

    _callSubcriptions(oldState) {
        for(let i = 0; i < this._subscriptions.length; i++) {
            this._subscriptions[i](this.state, oldState);
        }
    }
}

const createStore = (defaultState) => {
    return new store(defaultState);
}

/* Inherit class */

class Paragon extends HTMLElement {

    constructor() {
        super();
        this._state = createStore({});
        this.state = this._state.getState();
        this.props = {};
        Array.prototype.slice.call(this.attributes).forEach((item) => {
            this.props[item.name] = item.value;
        });

        this._state.subscribe((state) => {
            this.state = state;
            this.render();
        });
    }

    render() {
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

    setState(obj) {
        this._state.setState(obj);
        this.state = this._state.getState();
    }

    query(queryString) {
        if(this.shadowRoot) {
            return this.shadowRoot.querySelector(queryString);
        } else {
            return this.querySelector(queryString);
        }
    }

    _observeAttrChange() {
        let observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
              let newVal = mutation.target.getAttribute(mutation.attributeName);
                this._attributeChangedCallback(mutation.attributeName, newVal);
            }
          });
        });
        observer.observe(this, {attributes: true});
        return observer;
    }

    _attributeChangedCallback(name, newValue) {
        this.props[name] = newValue;
        this.render();
    }


}



export {
    html,
    register,
    Paragon,
    createStore
}