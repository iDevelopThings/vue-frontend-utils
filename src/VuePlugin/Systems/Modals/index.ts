import {type Plugin} from "vue";
import {ModalManager, type IModalManagerState, ModalManagerInstance} from "./ModalManager";
import type {ModalDefinitions, IModalManager, ModalVars, IModalRegistration} from "./ModalTypes";
import {type ModalRegistration} from "./ModalRegistration";


export {ModalManager, type IModalManagerState, ModalManagerInstance};
export {ModalRegistration} from "./ModalRegistration";
export type {ModalDefinitions, IModalManager, ModalVars, IModalRegistration, ModalProps, ModalData, ModalRegType} from "./ModalTypes";

const ModalPlugin: Plugin = {
	install(app, options) {
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
