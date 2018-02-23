import { html, Paragon, register } from './paragon';


class HotdogButton extends Paragon {
    template() {
        return html`
            <button>Hotdog</button>
        `;
    }
}

register(HotdogButton);