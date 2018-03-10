# Blaze-HTML
A 3kb micro framework for building reactive custom elements, based on `lit-html`

# Installation
```
npm i blaze-html
```



# Quick Start
```Javascript
import { html, Blaze, register, linkState } from 'blaze-html';

// Extend the Blaze class to build a custom element
class BlazeInput extends Blaze {
    // Define our default state in the constructor
    constructor() {
        super();
        this.setState({
            text: "default text"
        });
    }
    
    // Defiine our html template using template literals
    template(props, state) {
        return html`
            ${state.text} <br/>
            <input on-input=${linkState(this, 'text')} />
        `;
    }
}

// Register our custom element to the window
register(BlazeInput);
```
Now you can use your custom elememnt anywhere in your web page.
```HTML
<blaze-input></blaze-input>
```
