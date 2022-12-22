import {type Plugin} from "vue";
import {ModalManager, type IModalManagerState, ModalManagerInstance} from "./ModalManager";
import type {ModalDefinitions, IModalManager, ModalVars, IModalRegistration} from "./ModalTypes";
import {type ModalRegistration} from "./ModalRegistration";
import ModalDrawer from "./ModalDrawer.vue";
import ModalWrapper from "./ModalWrapper.vue";

export {ModalDrawer, ModalWrapper};
export {ModalManager, type IModalManagerState, ModalManagerInstance};
export {ModalRegistration} from "./ModalRegistration";
export type {ModalDefinitions, IModalManager, ModalVars, IModalRegistration, ModalProps} from "./ModalTypes";

const ModalPlugin: Plugin = {
	install(app, options) {
		app.component("ModalDrawer", ModalDrawer);
		app.component("ModalWrapper", ModalWrapper);

		app.config.globalProperties.$modals = ModalManager;
	}
};

export function defineModal<T = any, V = any>(name: V, component: any): ModalRegistration<V> {
	return ModalManager.register(name as any, component);
}

export function modal<T extends keyof ModalDefinitions>(name: T): IModalRegistration<T extends keyof ModalDefinitions ? T : any> {
	return ModalManager.get(name);
}

export {ModalPlugin};
