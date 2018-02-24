import { html, Paragon, register } from './paragon';


class HotdogButton extends Paragon {
    constructor() {
        super();
        this.setState({
            count: 0,
            count2: 0,
        });
    }

    connected() {
        this.increment();
        this.query('button').addEventListener('click', this.resetCount.bind(this));
    }

    increment() {
        this.setState({
            count: this.state.count + 1,
            count2: this.state.count + 2
        });

        setTimeout(this.increment.bind(this), 1000);
    }

    resetCount() {
        this.setState({
            count: 0,
            count2: 0
        });
    }

    template(state) {
        return html`
            <button>
                <span>${state.count}</span>
                <span>${state.count2}</span>
            </button>
        `;
    }
}

register(HotdogButton);