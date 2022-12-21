import {UnwrapNestedRefs} from "vue";
import {type RegisteredEvent} from "./RegisteredEvent";
import {type IEventsManagerState} from "./EventsManager";

export interface EventMap {

}

export type EventData<T extends keyof EventMap> = T extends keyof EventMap ? EventMap[T] : any;

export type EventArgs<T> = T extends keyof EventMap ? (EventData<T>[keyof EventData<T>])[] : any[];

export type EventCb<T> = (...args: EventArgs<T>) => void;

export interface EventSubscriptionContract<T = any> {
	id: string;

	invoke(...args: EventArgs<T>): void;

	dispose(): void;
}

export interface IRegisteredEvent<T = any> {
	_name: string;
	_subscriptions: EventSubscriptionContract[];
	subscribe(callback: EventCb<T>): EventSubscriptionContract<T>;
	invoke(...args: EventArgs<T>): void;
	revokeSubscriptions(): void;
	getName(): any;
	subscriptions(): EventSubscriptionContract<T>[];
}

export interface IEventsManager {
	state: UnwrapNestedRefs<IEventsManagerState>;
	readonly events: Map<string, RegisteredEvent>;
	get<T extends keyof EventMap>(name: T): RegisteredEvent<EventData<T>> | undefined;
	register(name: string): RegisteredEvent;
	unregister(name: string): void;
	removeRegistrations(): IEventsManager;
	all(): RegisteredEvent[];
}
