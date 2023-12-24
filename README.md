
# xsignals.js

A lightweight and minimalistic library that provides a simple implementation of the observer pattern, commonly known as signals, for React applications.
## Installation
only prerequisite is that you need to have Node.js installed.

```bash
npm install xsignals

```


## Usage 

**- Importing:**
```ts
import { Signal } from 'xsignals';
```

**- Creating a Signal**
```ts
const mySignal = new Signal();
```

**- Subscribing to a Signal**
```ts
const unsubscribe = mySignal.subscribe((data) => {
  console.log('Signal received:', data);
});
```

**- Emitting a Signal**
```ts
mySignal.emit('Hello, Signal!');
```

**- Unsubscribing from a Signal**

```ts
unsubscribe(); // The listener is now unsubscribed and won't receive future signals
```

## Examples

**- Simple Example**

```ts
import { Signal } from 'xsignals';

const mySignal = new Signal();

const unsubscribe = mySignal.subscribe((data) => {
  console.log('Signal received:', data);
});

mySignal.emit('Hello, Signal!');

unsubscribe(); // Unsubscribe after one signal
```



**- React Example**

```ts
import React, { useEffect } from 'react';
import { Signal } from 'xsignals';

const App = () => {
  useEffect(() => {
    const mySignal = new Signal();

    const unsubscribe = mySignal.subscribe((data) => {
      console.log('Signal received in React component:', data);
    });

    // Emit the signal on component mount
    mySignal.emit('Hello, Signal from React!');

    return unsubscribe; // Unsubscribe on component unmount
  }, []);

  return <div>Check the console for signal logs.</div>;
};

export default App;
```
## License

This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
