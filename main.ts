import { html, Paragon, register, linkState } from './src/paragon';

interface IState {
    text: string;
}

class HotdogButton extends Paragon<IState> {
    constructor() {
        super();
        this.setState({
            text: "bored"
        });
    }

    template(props: any, state: IState) {
        return html`
            ${state.text} <br/>
            <input on-input=${linkState(this, 'text')} />
        `;
    }
}

register(<any>HotdogButton);