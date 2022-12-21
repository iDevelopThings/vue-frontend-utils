import {RegisteredEvent} from "./RegisteredEvent";
import {UnwrapNestedRefs, reactive} from "vue";
import {IEventsManager} from "./Types";

export interface IEventsManagerState {
	events: Map<string, RegisteredEvent>;
}


export class EventsManagerInstance implements IEventsManager {

	public state: UnwrapNestedRefs<IEventsManagerState>;

	constructor() {
		this.state = reactive<IEventsManagerState>({
			events: new Map<string, RegisteredEvent>(),
		});
	}

	public get events() {
		return this.state.events;
	}

	public get(name: string): RegisteredEvent | undefined {
		return this.events.get(name);
	}

	public register(name: string): RegisteredEvent {
		if (this.events.has(name)) {
			throw new Error(`Event with name ${name} already exists. Event names must be unique.`);
		}

		const event = new RegisteredEvent(name);

		this.events.set(name, event);

		return event;
	}

	public unregister(name: string) {
		const event = this.events.get(name);
		if (!event) {
			return;
		}

		event.revokeSubscriptions();

		this.events.delete(name);
	}

	public removeRegistrations() {
		this.events.forEach(event => event.revokeSubscriptions());
		this.events.clear();

		return this;
	}

	public all(): RegisteredEvent[] {
		return Array.from(this.events.values());
	}

}

export const EventsManager = new EventsManagerInstance() as IEventsManager;
