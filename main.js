import { html, Paragon, register } from './src/paragon';


class HotdogButton extends Paragon {
    constructor() {
        super();
        this.setState({
            count: 0
        });
    }

    increment(){
        this.setState({
            count: this.state.count + 1
        });
    }

    template(state) {
        return html`
            <button on-click=${this.increment.bind(this)}>
                Increment
            </button>
            <span> Count: ${state.count} </span>
        `;
    }
}

register(HotdogButton);