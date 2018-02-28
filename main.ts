import { html, Paragon, register, linkState } from './src/paragon';


class HotdogButton extends Paragon {
    constructor() {
        super();
        this.setState({
            text: "bored"
        });
    }

    template(props, state) {
        return html`
            ${state.text} <br/>
            <input on-input=${linkState(this, 'text')} />
        `;
    }
}

register(HotdogButton);