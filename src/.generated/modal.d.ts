	
declare module "../VuePlugin/Systems/Modals" {

	import type {IModalRegistration} from "../VuePlugin/Systems/Modals";

	interface ModalDefinitions {
			"testing-modal": { foo: string; },
			"testing-modal-two": { message: string; },
			"testing-modal-three": { messageThing: string; bool: boolean; },

	}

	interface ModalVars {
			modalOne: ModalDefinitions["testing-modal"],
			modalTwo: ModalDefinitions["testing-modal-two"],
			modalThree: ModalDefinitions["testing-modal-three"],

	}	

	interface IModalManager {
		get<T extends keyof ModalDefinitions>(name: T): IModalRegistration<T extends keyof ModalDefinitions ? T : any>;

		isRegistered<T extends keyof ModalDefinitions>(name: T): boolean;

		unregister<T extends keyof ModalDefinitions>(name: T): void;

		show<T extends keyof ModalDefinitions>(name: T, data?: T extends keyof ModalDefinitions ? ModalDefinitions[T] : any): void;

		showOnly<T extends keyof ModalDefinitions>(name: T, data?: any): void;

		opened<T extends keyof ModalDefinitions>(name: T, data?: any): void;

		closed<T extends keyof ModalDefinitions>(name: T): void;

		isOpen<T extends keyof ModalDefinitions>(name: T): boolean;

		closeAllExcept<T extends keyof ModalDefinitions>(name: T): void;

		getData<T extends keyof ModalDefinitions>(name: T): T extends keyof ModalDefinitions ? ModalDefinitions[T] : any | any;
	}

}

export {};
