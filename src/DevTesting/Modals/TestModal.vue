<template>

	<ModalWrapper v-bind="$props">

		<template #title-content>
			This is an example modal
		</template>

		<template #body-content>
			<p>
				This is the body of the modal.
			</p>
		</template>

	</ModalWrapper>

	<!--	<div class="bg-slate-700 opacity-50 absolute top-0 left-0 z-10 h-screen w-screen overflow-hidden"></div>

		<div class="flex flex-col w-full h-full items-center justify-center absolute z-20 top-0 left-0">
			<div class="max-w-2xl bg-white rounded shadow">
				<div class="p-8">
					<h1 class="text-2xl text-slate-800">
						This is an example modal
					</h1>
				</div>

				<div class="bg-slate-200 border-t border-slate-300 px-8 py-3 flex flex-row items-center justify-end">
					<SpinnerButton
						class="bg-gray-600 text-white rounded shadow px-4 py-1"
						@click="$modals.showOnly('testing-modal-two', {message : 'Hello World!'})"
					>
						Open Other
					</SpinnerButton>

					<SpinnerButton
						class="bg-gray-600 text-white rounded shadow px-4 py-1"
						@click="modal.hide()"
					>
						Close
					</SpinnerButton>
				</div>
			</div>
	</div>-->


</template>

<script setup lang="ts">
import {ModalRegistration} from "../../VuePlugin/Systems/Modals";
import ModalWrapper from "../../VuePlugin/Systems/Modals/ModalWrapper.vue";

const props = defineProps<{
	isOpen?: boolean,
	modal: ModalRegistration,
	data?: any
}>();
</script>

