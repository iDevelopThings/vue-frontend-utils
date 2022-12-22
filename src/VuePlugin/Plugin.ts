import {type Plugin} from "vue";
import {EventBusPlugin} from "./Systems/EventBus";
import {ModalPlugin} from "./Systems/Modals";
import Spinner from "./Components/Spinner.vue";
import SpinnerButton from "./Components/SpinnerButton.vue";

const plugin: Plugin = {
	install(app, options) {
		EventBusPlugin.install(app, options);
		ModalPlugin.install(app, options);

		app.component("Spinner", Spinner);
		app.component("SpinnerButton", SpinnerButton);
	}
};


export default plugin;
