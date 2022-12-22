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
			const data       = modal.getProps();
			const extraProps = data.data || {};

			const comp = h(modalComp, {
				key    : modal.getTrigger(),
				modal  : modal,
				name   : data.name,
				isOpen : data.isOpen,
				...extraProps,
			});

			modals.push(comp);
		}

		return h("div", modals);
	}
});

</script>

