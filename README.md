# Blaze-HTML
A 3kb micro framework for building custom elements

```Javascript
import { html, Blaze, register, linkState } from 'blaze-html';

class BlazeInput extends Blaze {
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

register(BlazeInput);
```
Is implemented as 
```HTML
<blaze-input></blaze-input>
```
