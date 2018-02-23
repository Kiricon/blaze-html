import { html, Paragon, register } from './paragon';


class HotdogButton extends Paragon {
    connected() {
        this.setState({
            count: 0
        });
        
        this.increment();
    }

    increment() {
        this.setState({
            count: this.state.count + 1
        });

        setTimeout(this.increment.bind(this), 1000);
    }

    template() {
        return html`
            <button class="count">Hotdog</button>
        `;
    }
}

register(HotdogButton);