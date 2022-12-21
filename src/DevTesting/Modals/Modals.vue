<template>

	<div>

		<div class="flex flex-row items-center space-x-4">
			<ModalDrawer />

			<SpinnerButton
				class="bg-gray-600 text-white rounded shadow px-4 py-1"
				@click="$modals.get('testing-modal').show()"
			>
				Open Modal
			</SpinnerButton>

			<SpinnerButton
				class="bg-gray-600 text-white rounded shadow px-4 py-1"
				@click="$modals.get('testing-modal').hide()"
			>
				Close Modal
			</SpinnerButton>
		</div>

	</div>

</template>

<script setup lang="ts">


import {modal, ModalManager, IModalManager} from "../../VuePlugin/Systems/Modals";
import SpinnerButton from "../../VuePlugin/Components/SpinnerButton.vue";
import ModalDrawer from "../../VuePlugin/Systems/Modals/ModalDrawer.vue";

console.log(modal("testing-modal-two"));

const modalOne = modal("testing-modal");
const modalTwo = modal("testing-modal-two");

console.log(modalOne, modalTwo);

modalOne.whenOpened((data, modal) => {
	console.log("Opened Modal One", data, modal);
});

modalOne.whenClosed((data, modal) => {
	console.log("Closed Modal One", data, modal);
});

modalTwo.whenOpened((data, modal) => {
	console.log("Opened Modal Two", data, modal);
});

modalTwo.whenClosed((data, modal) => {
	console.log("Closed Modal Two", data, modal);
});

</script>

