import {type ModalRegistration} from "./ModalRegistration";
import {type Component} from "@vue/runtime-core";

export interface ModalDefinitions {
}

export interface ModalVars {
}

export type ModalRegType<T> = IModalRegistration<T extends keyof ModalDefinitions ? ModalDefinitions[T] : any>;
export type ModalData<T> = T extends keyof ModalDefinitions ? ModalDefinitions[T] : any;
export type ModalKey<T> = T extends keyof ModalDefinitions ? T : string;

export interface ModalProps<T = any> {
	name: string,
	isOpen: boolean;
	data: ModalData<T>;
}


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
	get<T>(name: ModalKey<T>): ModalRegType<ModalKey<T>> | undefined;
	isRegistered<T>(name: ModalKey<T> | string): boolean;
	unregister<T>(name: ModalKey<T> | string): void;
	unregisterAll(): void;
	show<T>(name: ModalKey<T>, data?: Partial<ModalData<T>>): void;
	showOnly<T>(name: ModalKey<T>, data?: any): void;
	opened<T>(name: ModalKey<T>, data?: any): void;
	closed<T>(name: ModalKey<T>): void;
	isOpen<T>(name: ModalKey<T>): boolean;
	closeAll(): void;
	closeAllExcept<T>(name: ModalKey<T>): void;
	getData<T>(name: ModalKey<T>): Partial<ModalData<T>> | any;
}

//export function useModal(name:string) : ModalRegistration;
