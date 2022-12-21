<template>

	<div class="bg-slate-700 opacity-50 absolute top-0 left-0 z-10 h-screen w-screen overflow-hidden"></div>

	<div class="flex flex-col w-full h-full items-center justify-center absolute z-20 top-0 left-0">
		<div class="max-w-2xl bg-white rounded shadow">
			<div class="p-8">
				<h1 class="text-2xl text-slate-800">
					This is example modal 2
				</h1>

				<p>Message: {{ data.message}}</p>
			</div>

			<div class="bg-slate-200 border-t border-slate-300 px-8 py-3 flex flex-row items-center justify-end">
				<SpinnerButton
					class="bg-gray-600 text-white rounded shadow px-4 py-1"
					@click="modal.hide()"
				>
					Close
				</SpinnerButton>
			</div>
		</div>
	</div>


</template>

<script setup lang="ts">
import {ModalRegistration} from "../../VuePlugin/Systems/Modals";
import SpinnerButton from "../../VuePlugin/Components/SpinnerButton.vue";

const props = defineProps<{
	isOpen?: boolean,
	modal: ModalRegistration,
	data?: { message: string }
}>();
</script>

