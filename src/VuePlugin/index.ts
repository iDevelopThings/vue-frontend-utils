import {ModalManagerInstance} from "./Systems/Modals";
import {EventsManagerInstance} from "./Systems/EventBus";
import Spinner from "./Components/Spinner.vue";
import SpinnerButton from "./Components/SpinnerButton.vue";

export * from "./Systems/Modals";
export * from "./Systems/EventBus";
export * from "./Systems/HandlerWrapper";

export {default as VueFrontendUtils} from "./Plugin";
export {Spinner, SpinnerButton};

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$modals: ModalManagerInstance;
		$events : EventsManagerInstance;
	}
}
