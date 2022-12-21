import {type Plugin} from "vue";
import {EventBusPlugin} from "./Systems/EventBus";
import {ModalPlugin} from "./Systems/Modals";

const plugin: Plugin = {
	install(app, options) {
		EventBusPlugin.install(app, options);
		ModalPlugin.install(app, options);
	}
};


export default plugin;
