import {defineModal} from "../VuePlugin/Systems/Modals";
import TestModal from "./Modals/TestModal.vue";
import TestModalTwo from "./Modals/TestModalTwo.vue";
import {AnotherType} from "./Test";
import {defineEvent} from "../VuePlugin/Systems/EventBus";

type ExState = {
	foo: string,
}

export const modalOne   = defineModal<ExState>("testing-modal", TestModal);
export const modalTwo   = defineModal<{ message: string }>("testing-modal-two", TestModalTwo);
export const modalThree = defineModal<AnotherType>("testing-modal-three", TestModalTwo);

export const testEvent = defineEvent<{ isTest: boolean }>("test-event");


//export type ModalDefinitions = {
//	"testing-modal": {foo: string},
//	"testing-modal-two": { message: string },
//	"testing-modal-three": AnotherType,
//}
//
//export type ModalVars = {
//	modalOne: ModalDefinitions["testing-modal"],
//	modalTwo: ModalDefinitions["testing-modal-two"],
//	modalThree: ModalDefinitions["testing-modal-three"],
//}
//
