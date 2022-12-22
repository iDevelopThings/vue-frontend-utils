declare module "@vue/runtime-core" {
	import {ModalManagerInstance} from './Systems/Modals/ModalManager';
	import {EventsManagerInstance} from './Systems/EventBus/EventsManager';

	interface ComponentCustomProperties {
		$modals : ModalManagerInstance;
		$events : EventsManagerInstance;
	}
}
export {};
