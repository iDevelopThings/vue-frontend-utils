import {type ModalRegistration} from "./ModalRegistration";
import {type Component} from "@vue/runtime-core";

export interface ModalDefinitions {
}

export interface ModalVars {
}


export interface ModalProps<T = any> {
	name: string,
	isOpen: boolean;
	data: T extends keyof ModalDefinitions ? ModalDefinitions[T] : any;
}


export interface IModalRegistration<T = any> {
	show(data?: T extends keyof ModalDefinitions ? ModalDefinitions[T] : any): void;

	toggle(data?: T extends keyof ModalDefinitions ? ModalDefinitions[T] : any): void;

	hide(): void;

	isOpen(): boolean;

	isHidden(): boolean;

	isDefined(): boolean;

	/** Define a callback(event listener) to do some action when the modal is opened */
	whenOpened(callback: (data: T extends keyof ModalDefinitions ? ModalDefinitions[T] : any, modal: IModalRegistration) => void | Promise<void>): () => void;

	/** Define a callback(event listener) to do some action when the modal is closed, after being open */
	whenClosed(callback: (data: T extends keyof ModalDefinitions ? ModalDefinitions[T] : any, modal: IModalRegistration) => void | Promise<void>): () => void;

	openAfterClosed(modalName: string | keyof ModalDefinitions): void;

	getTrigger(): string | T;

	getProps(): ModalProps<T>;

	component(): Component | any;
}


export interface IModalManager {
	readonly modals: Map<string, ModalRegistration>;
	readonly all: IterableIterator<ModalRegistration>;
	readonly open: Map<string, any>;
	register(name: string, component: Component): ModalRegistration<typeof name>;
	get<T>(name: keyof ModalDefinitions): IModalRegistration<T extends keyof ModalDefinitions ? ModalDefinitions[T] : any> | undefined;
	isRegistered(name: string): boolean;
	unregister(name: string): void;
	unregisterAll(): void;
	show<T>(name: keyof ModalDefinitions, data?: Partial<T extends keyof ModalDefinitions ? ModalDefinitions[T] : any>): void;
	showOnly<T>(name: keyof ModalDefinitions, data?: any): void;
	opened<T>(name: keyof ModalDefinitions, data?: any): void;
	closed<T>(name: keyof ModalDefinitions): void;
	isOpen<T>(name: keyof ModalDefinitions): boolean;
	closeAll(): void;
	closeAllExcept<T>(name: keyof ModalDefinitions): void;
	getData<T>(name: keyof ModalDefinitions): Partial<T extends keyof ModalDefinitions ? ModalDefinitions[T] : any> | any;
}

//export function useModal(name:string) : ModalRegistration;
