<script lang="ts">

import {defineComponent, h} from "vue";
import {ModalManager} from "./ModalManager";

export default defineComponent({
	name : "ModalDrawer",

	render() {
		const modals = [];

		for (let modal of ModalManager.all) {
			if (!modal.isOpen()) continue;

			const modalComp  = modal.component();
			const extraProps = modal.getProps();

			if (modalComp?.props) {
				for (let prop of Object.keys(extraProps)) {
					if (modalComp.props[prop] === undefined) {
						delete extraProps[prop];
					}
				}
			}

			const comp = h(modalComp, {
				key   : modal.getTrigger(),
				modal : modal,
				...extraProps,
			});

			modals.push(comp);
		}

		return h("div", modals);
	}
});

</script>

