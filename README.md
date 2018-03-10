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


# Custom Elements

To create a custom element you need to import `Blaze` & `html` from `blaze-html`

- `Blaze` is our custom element's base class that we will inherit all our syntax sugar from

- `html` is our template literal's tag, that will tell our text editor / IDE to identify the text as html

To register the custom element to the window you need to import `register` and pass the class in as an argument.

```Javascript
import {Blaze, html, register} from 'blaze-html';

class CoolButton extends Blaze {
    // Display a button that says "Click Me" in it
    template() {
        return html`
            <button on-click=${this.sayHello}>Click Me</button>
        `;
    }

    // Action that is fired when a user clicks the button
    sayHello() {
        alert('Hello World');
    }
}
// Register the element to the window as cool-button
register(CoolButton);
// or if you want to specify the name yourself
register(CoolButton, 'uncool-button');
```
## Properties and State

Our base class `Blaze` has the properties `props` & `state.

- `props`: an object containing the values of all custom element attributes
- `state`: a watched object, what when updated will re-render the custom element's template

Any time `state` is updated through the `setState` method or the attributes on the element are changed, the element will re-render the values in real time. 

```Javascript
import {Blaze, html, register} from 'blaze-html';

class UserDisplay extends Blaze {
    constructor() {
        super();
        this.setState({
            status: 'Active'
        });
    }
    
    template(props, state) {
        return html`
            ${props.firstName} ${props.lastName}<br/>
            ${state.status}
        `;
    }
}

register(UserDisplay);
```

```HTML
<user-display firstName="John" lastName="doe"></user-display>
```

This will display
```
John Doe
Active
```