import { html, Paragon, register } from './src/paragon';


class HotdogButton extends Paragon {
    constructor() {
        super();
        this.setState({
            count: 0,
            count2: 0,
        });
        this.increment();
    }

    increment() {
        this.setState({
            count: this.state.count++
        });

        setTimeout(this.increment.bind(this), 1000);
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