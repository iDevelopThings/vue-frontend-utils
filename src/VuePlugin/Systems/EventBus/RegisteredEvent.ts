import {EventsManager} from "./EventsManager";
import {EventSubscription} from "./EventSubscription";
import {getCurrentScope, onScopeDispose} from "vue";
import {type IRegisteredEvent, type EventSubscriptionContract} from "./Types";


export class RegisteredEvent<T = any> implements IRegisteredEvent {

	public _name: string;
	public _subscriptions: EventSubscriptionContract[] = [];

	constructor(name: string) {
		this._name = name;
	}

	public subscribe(callback: Function): EventSubscriptionContract {
		const subscription = new EventSubscription(callback);
		subscription.whenDisposed(() => {
			this._subscriptions = this._subscriptions.filter(s => s.id !== subscription.id);
		});

		this._subscriptions.push(subscription);

		if (getCurrentScope()) {
			onScopeDispose(() => subscription.dispose());
		}

		return subscription;
	}

	public invoke(...args: any[]) {
		this._subscriptions.forEach(action => action.invoke(...args));
	}

	public revokeSubscriptions() {
		this._subscriptions.forEach(subscription => subscription.dispose());
		this._subscriptions = [];
	}

	public getName() {
		return this._name;
	}

	public subscriptions(): EventSubscriptionContract[] {
		return this._subscriptions;
	}

}

export function defineEvent<T = any>(name: string): RegisteredEvent<T> {
	return EventsManager.register(name);
}
