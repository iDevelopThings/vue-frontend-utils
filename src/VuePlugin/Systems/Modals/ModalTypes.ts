import {type ModalRegistration} from "./ModalRegistration";
import {type Component} from "@vue/runtime-core";

export interface ModalDefinitions {
}

export interface ModalVars {
}

export type ModalRegType<T extends keyof ModalDefinitions> = ModalRegistration<T extends keyof ModalDefinitions ? ModalDefinitions[T] : any>;

export interface ModalProps<T = any> {
	name: string,
	isOpen: boolean;
	data: ModalData<T>;
}

export type ModalData<T> = T extends keyof ModalDefinitions ? ModalDefinitions[T] : any;

export interface IModalRegistration<T = any> {
	show(data?: ModalData<T>): void;

	hide(): void;

	isOpen(): boolean;

	isHidden(): boolean;

	isDefined(): boolean;

	/** Define a callback(event listener) to do some action when the modal is opened */
	whenOpened(callback: (data: ModalData<T>, modal: IModalRegistration) => void | Promise<void>): () => void;

	/** Define a callback(event listener) to do some action when the modal is closed, after being open */
	whenClosed(callback: (data: ModalData<T>, modal: IModalRegistration) => void | Promise<void>): () => void;

	openAfterClosed(modalName: string | keyof ModalDefinitions): void;

	getTrigger(): string | T;

	getProps(): ModalProps<T>;

	component(): Component | any;
}

export interface IModalManager {
	readonly modals: Map<string, ModalRegistration>;
	readonly all: IterableIterator<ModalRegistration>;
	readonly open: Map<string, any>;
	register(name: string, component: Component): ModalRegistration;
	get<T extends keyof ModalDefinitions>(name: T | string): ModalRegType<T> | undefined;
	isRegistered<T extends keyof ModalDefinitions>(name: T | string): boolean;
	unregister<T extends keyof ModalDefinitions>(name: T | string): void;
	unregisterAll(): void;
	show<T extends keyof ModalDefinitions>(name: T | string, data?: Partial<ModalDefinitions[T]>): void;
	showOnly<T extends keyof ModalDefinitions>(name: T | string, data?: any): void;
	opened<T extends keyof ModalDefinitions>(name: T | string, data?: any): void;
	closed<T extends keyof ModalDefinitions>(name: T | string): void;
	isOpen<T extends keyof ModalDefinitions>(name: T | string): boolean;
	closeAll(): void;
	closeAllExcept<T extends keyof ModalDefinitions>(name: T | string): void;
	getData<T extends keyof ModalDefinitions>(name: T | string): Partial<ModalDefinitions[T]> | any;
}

//export function useModal(name:string) : ModalRegistration;
