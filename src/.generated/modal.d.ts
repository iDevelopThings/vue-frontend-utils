	
declare module "../VuePlugin/Systems/Modals" {
	
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
}
	
	
export {};