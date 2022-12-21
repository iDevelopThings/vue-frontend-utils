import {EventsManager, type IEventsManagerState, EventsManagerInstance} from "./EventsManager";

export {EventsManager, IEventsManagerState, EventsManagerInstance};
export {EventSubscription} from "./EventSubscription";
export type {IRegisteredEvent, EventData, EventArgs, EventMap, EventCb, EventSubscriptionContract, IEventsManager} from './Types'
export {RegisteredEvent, defineEvent} from "./RegisteredEvent";


import {type Plugin} from "vue";
import {EventMap, EventData, type IRegisteredEvent} from "./Types";
import {type RegisteredEvent} from "./RegisteredEvent";

const EventBusPlugin: Plugin = {
	install(app, options) {
		app.config.globalProperties.$events = EventsManager;
	}
};

export function event<T extends keyof EventMap>(name: T): IRegisteredEvent<T> {
	return EventsManager.get(name);
}

export {EventBusPlugin};
