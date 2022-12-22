import {ModalManagerInstance} from "./Systems/Modals";
import {EventsManagerInstance} from "./Systems/EventBus";

export * from "./Systems/Modals";
export * from "./Systems/EventBus";

export * as Spinner from "./Components/Spinner.vue";
export * as SpinnerButton from "./Components/SpinnerButton.vue";

export {default as VueFrontendUtils} from "./Plugin";

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$modals : ModalManagerInstance;
		$events : EventsManagerInstance;
	}
}
