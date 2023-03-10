# vue-frontend-utils

A collection of utility functions for use in Vue.js frontend applications.

## Description

`vue-frontend-utils` is a collection of utility functions designed to make it easier to develop Vue.js frontend applications.

With a simple event emitter and a powerful modal system, `vue-frontend-utils` can help you add powerful functionality to your projects with minimal code. The library is fully type-safe, thanks to the
use of the vite/ts compiler API.

## Features

### Event emitter:

Easily send and receive messages within your Vue.js application using the EventBus. 

Define events with strong typing using the `defineEvent` function and subscribe/invoke them using the returned event instance

### Modal system:

Create and manage modals in your Vue.js application with ease. 

Use the `defineModal` and `modal` functions to define and access modals, and use methods like `show`, `hide`, `isOpen`, and `isHidden` to control them. 
Set global event handlers for when modals are opened and closed using the `whenOpened` and `whenClosed` methods.

## Installation

To install vue-frontend-utils, you can use npm:

```shell
npm install vue-frontend-utils
```

Or, if you prefer yarn:

```shell
yarn add vue-frontend-utils
```

### Vue

```typescript
import {createApp} from "vue";
import App from "./App.vue";
import {VueFrontendUtils} from "vue-frontend-utils";

const app = createApp(App);
app.use(VueFrontendUtils);
app.mount("#app");
```

### Note:
It's recommended to create two additional files to hold Modals/Events, then importing these inside your main ts file, for example:

#### Modals.ts
```typescript
import {defineModal} from "vue-frontend-utils";

defineModal<{ message:string }>('success');
```
#### Events.ts
```typescript
import {defineEvent} from "vue-frontend-utils";

defineEvent<{ message: string }>("something:else");
```

#### Main.ts
```typescript
import {createApp} from "vue";
import App from "./App.vue";
import {VueFrontendUtils} from "vue-frontend-utils";
import "./Modals.ts";
import "./Events.ts";

const app = createApp(App);
app.use(VueFrontendUtils);
app.mount("#app");
```

#### Opting into type generation:

In your vite.config file, you need to add the following plugin:

```typescript
import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {VueFrontendUtils} from "vue-frontend-utils/dist/vite";

export default defineConfig({
	plugins : [
		VueFrontendUtils({srcPathFromRoot : "src"}),
		vue()
	]
});
```


## Usage

### Event Bus:

To use the EventBus feature in your Vue.js application, you will first need to import it:

```typescript 
import {defineEvent, event} from 'vue-frontend-utils';
```

Then, you can define an event:

```typescript 
const someEvent = defineEvent<string>('someEvent');
```

You can then use the event to emit and listen for events:

```typescript 
someEvent.subscribe((data) => {
	// handle the event
});

someEvent.invoke('some data');
```

### Modal System

To use the modal system, you will first need to import it:

```typescript 
import {defineModal, modal} from 'vue-frontend-utils';
```

Then, you can define a modal:

```typescript 
const myModal = defineModal<string>('myModal');
```

You can then use the modal to show, hide, and check the status of the modal:

```typescript 
myModal.show();
myModal.hide();
console.log(myModal.isOpen()); // true or false
console.log(myModal.isHidden()); // true or false
```

You can also use the whenOpened and whenClosed methods to set global event handlers for when the modal is opened and closed:

```typescript 
myModal.whenOpened(() => {
	console.log('modal opened');
});

myModal.whenClosed(() => {
	console.log('modal closed');
});
```

### useAsyncHandler

Fully type safe handler, which stores it's current state, handles timeouts/cancellation and much more. 

```typescript
async function getUserFromApi(id: string) {
	const req = await fetch("...");
	return await req.json();
}

const getUser = useAsyncHandler(getUserFromApi);

getUser.start("user id"); // Start the handler
getUser.stop(); // Cancels the active promise if running

getUser.isProcessing(); // true/false

getUser.hasResult(); // true when your function completes and returns a value(non error)
getUser.hasError(); // true when your function returns an error/times out or you call .stop()
getUser.wasCancelled(); // true when you call .stop() or timed out
getUser.wasTimeout(); // true when you use .withTimeout(x) and it hits the deadline

getUser.result(); // The return value of your function(non error)
getUser.error(); // The error(if any)

getUser.withTimeout(200); // Set a deadline in ms

```

## License

`vue-frontend-utils` is open-source software licensed under the MIT license.
