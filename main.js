import { html, Paragon, register } from './paragon';


class HotdogButton extends Paragon {
    connected() {
        this.setState({
            count: 0,
            count2: 0
        });
        
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

    template() {
        return html`
            <button>
                <span class="count"></span>
                <span class="count2"></span>
            </button>
        `;
    }
}

register(HotdogButton);