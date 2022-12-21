	
declare module "../VuePlugin/Systems/EventBus" {
	import {RegisteredEvent} from "../VuePlugin/Systems/EventBus";

	interface EventMap {
			"modal:testing-modal:open": { foo: string; },
			"modal:testing-modal:close": { foo: string; },
			"modal:testing-modal-two:open": { message: string; },
			"modal:testing-modal-two:close": { message: string; },
			"modal:testing-modal-three:open": { messageThing: string; bool: boolean; },
			"modal:testing-modal-three:close": { messageThing: string; bool: boolean; },

			"test-event": { isTest: boolean; },

	}

}

export {};
