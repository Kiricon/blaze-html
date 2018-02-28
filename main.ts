import { html, Paragon, register, linkState } from './src/paragon';


class HotdogButton extends Paragon<{text: string}> {
    constructor() {
        super();
        this.setState({
            text: "bored"
        });
    }

    template(props: any, state: any) {
        return html`
            ${state.text} <br/>
            <input on-input=${linkState(this, 'text')} />
        `;
    }
}

register(HotdogButton);