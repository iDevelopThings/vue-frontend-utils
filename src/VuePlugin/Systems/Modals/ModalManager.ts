import {reactive, UnwrapNestedRefs} from "vue";
import {ModalRegistration} from "./ModalRegistration";
import {Component} from "@vue/runtime-core";
import {IModalManager, ModalDefinitions} from "./ModalTypes";

export interface IModalManagerState {
	modals: Map<string, ModalRegistration>;
	open: Map<string, any>;
}

export class ModalManagerInstance implements IModalManager {

	private state: UnwrapNestedRefs<IModalManagerState>;

	constructor() {
		this.state = reactive({
			modals : new Map(),
			open   : new Map()
		});
	}

	public register(name: string, component: Component): ModalRegistration {
		if (this.isRegistered(name)) {
			return;
		}

		const modal = new ModalRegistration(name, component);

		this.state.modals.set(name, modal);

		return this.state.modals.get(name);
	}

	public get(name: string): ModalRegistration | undefined {
		return this.state.modals.get(name);
	}

	public isRegistered(name: string): boolean {
		return this.state.modals.has(name);
	}

	public unregister(name: string): void {
		const modal = this.state.modals.get(name);
		if (!modal) {
			return;
		}

		modal.unregister();
		this.state.modals.delete(name);
	}

	public unregisterAll(): void {
		this.state.modals.forEach((modal) => {
			this.unregister(modal.getTrigger());
		});
		this.state.modals.clear();
	}

	public show(name: string, data?: any) {
		const modal = this.get(name);
		if (!modal) {
			console.warn(`Modal ${name} is not registered`);
			return;
		}

		modal.show(data);
	}

	public showOnly(name: string, data?: any) {
		const modal = this.get(name);
		if (!modal) {
			console.warn(`Modal ${name} is not registered`);
			return;
		}

		this.closeAll();

		modal.show(data);
	}

	public opened(name: string, data?: any) {
		const modal = this.get(name);
		if (!modal) {
			return;
		}

		this.state.open.set(name, data);
	}

	public closed(name: string) {
		const modal = this.get(name);
		if (!modal) {
			return;
		}

		this.state.open.delete(name);
	}

	public isOpen(name: string) {
		return this.state.open.has(name);
	}

	public get modals() {
		return this.state.modals;
	}

	public get all() {
		return this.state.modals.values();
	}

	public get open() {
		return this.state.open;
	}

	public closeAll() {
		this.state.open.forEach((data, modalName) => {
			this.get(modalName)?.hide();
		});
	}

	public closeAllExcept(name: string): void {
		this.state.open.forEach((data, modalName) => {
			if (modalName !== name) {
				this.get(modalName)?.hide();
			}
		});
	}

	public getData(name: string): any {
		return this.state.open.get(name);
	}
}

export const ModalManager = new ModalManagerInstance() as IModalManager;
