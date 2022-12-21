import {ModalManager} from "./ModalManager";
import {defineEvent, type RegisteredEvent} from "../EventBus";
import {type Component} from "@vue/runtime-core";
import type {IModalRegistration, ModalProps, ModalDefinitions} from "./ModalTypes";


export class ModalRegistration<T = any> implements IModalRegistration<T> {

	private _isOpen: boolean;

	private _onOpenEvent: RegisteredEvent;
	private _onCloseEvent: RegisteredEvent;

	private trigger: any;

	private _componentResolver: () => Component;

	constructor(trigger: string, component: any) {
		this.trigger            = trigger;
		this._componentResolver = () => component;

		this._onOpenEvent  = defineEvent(`modal:${trigger}:open`);
		this._onCloseEvent = defineEvent(`modal:${trigger}:close`);

		this._isOpen = false;
	}

	public getTrigger(): string {
		return this.trigger;
	}

	show(data?: any): void {
		this._isOpen = true;

		ModalManager.opened(this.trigger, data);

		this._onOpenEvent.invoke(data, this);
	}

	hide(): void {
		this._isOpen = false;
		ModalManager.closed(this.trigger);

		this._onCloseEvent.invoke();
	}

	isOpen(): boolean {
		return ModalManager.isOpen(this.trigger);
	}

	isHidden(): boolean {
		return !this.isOpen();
	}

	isDefined(): boolean {
		return false;
	}

	/** Define a callback(event listener) to do some action when the modal is opened */
	whenOpened(callback: (data: any, modal: IModalRegistration) => void | Promise<void>): () => void {
		const sub = this._onOpenEvent.subscribe(
			(...args: any[]) => callback(args[0] ?? undefined, args[1] ?? undefined)
		);
		return () => sub.dispose();
	}

	/** Define a callback(event listener) to do some action when the modal is closed, after being open */
	whenClosed(callback: (data: any, modal: IModalRegistration) => void | Promise<void>): () => void {
		const sub = this._onCloseEvent.subscribe(
			(...args: any[]) => callback(args[0] ?? undefined, args[1] ?? undefined)
		);
		return () => sub.dispose();
	}

	unregister() {
		ModalManager.closed(this.trigger);

		this._onOpenEvent.revokeSubscriptions();
		this._onCloseEvent.revokeSubscriptions();
	}

	openAfterClosed(modalName: string): void {
		const onCloseCallback = (data: any, modal) => {
			const m = ModalManager.get(modalName as any);
			if (m) {
				m.show(data);
			}

			subscription.dispose();
		};

		const subscription = this._onCloseEvent.subscribe(onCloseCallback);
	}

	public component(): Component | any {
		return this._componentResolver();
	}

	public getProps(): ModalProps {
		return {
			name   : this.trigger,
			isOpen : this.isOpen(),
			data   : ModalManager.getData(this.trigger)
		};
	}
}
