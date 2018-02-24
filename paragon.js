const html = String.raw;

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

    shadowRoot = shadowRoot === undefined ?  true : shadowRoot;

    const template = document.createElement('template');
    template.innerHTML = c.prototype.template();
    c.prototype.template = null;

    class ShadowRootCustomElement extends c {
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        template() {}
    }

    class InlineCustomElement extends c {
        constructor() {
            super();
            this.appendChild(template.content.cloneNode(true));
        }
    }

    if(shadowRoot) {
        customElements.define(buildTagName(c.name), ShadowRootCustomElement);
    }else {
        customElements.define(buildTagName(c.name), InlineCustomElement);
    }
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
    connectedCallback() {
        this._state = createStore({});
        this.state = this._state.getState();

        if(typeof this.stateChanged === 'function') {
            this._state.subscribe(this.stateChanged.bind(this));
        }

        this._state.subscribe(this._injectStateInToElement.bind(this));

        if(typeof this.connected === 'function') {
            this.connected();
        }

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

    _injectStateInToElement(state) {
        for(let prop in state) {
            let element = this.shadowRoot.querySelector(`.${prop}`);
            if (!!element) {
                element.innerHTML = state[prop];
            }
        }
    }

}



export {
    html,
    register,
    Paragon
}