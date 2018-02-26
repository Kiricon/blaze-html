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

    template(props, state) {
        return html`
            <button on-click=${this.increment}>
                Increment
            </button>
            <span> Count ${props.name}: ${state.count} </span>
        `;
    }
}

register(HotdogButton);