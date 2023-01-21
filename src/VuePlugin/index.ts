import {ModalManagerInstance} from "./Systems/Modals";
import {EventsManagerInstance} from "./Systems/EventBus";
import Spinner from "./Components/Spinner.vue";
import SpinnerButton from "./Components/SpinnerButton.vue";
import dayjs from "dayjs";
import {Ref} from "vue";

export * from "./Systems/Modals";
export * from "./Systems/EventBus";
export * from "./Systems/HandlerWrapper";
export * from "./Systems/Time";
export * from "./Systems/Copyable";

export {default as VueFrontendUtils} from "./Plugin";
export {Spinner, SpinnerButton};

declare module "@vue/runtime-core" {
	interface ComponentCustomProperties {
		$modals: ModalManagerInstance;
		$events : EventsManagerInstance;

		$nativeTime: Ref<Date>,
		$currentTime: Ref<dayjs.Dayjs>
	}
}
