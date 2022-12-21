<template>
	<Dialog :open="modal.isOpen()" @close="modal.hide()">
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

		<div class="fixed inset-0 flex items-center justify-center p-4">
			<DialogPanel class="w-full max-w-sm rounded bg-white overflow-hidden shadow-lg">
				<DialogTitle>
					<template v-if="!hasSlot('title') && hasSlot('title-content')">
						<div class="px-6 font-semibold tracking-wide py-2.5 border-b border-slate-300">
							<slot name="title-content"></slot>
						</div>
					</template>
					<template v-else>
						<slot name="title"></slot>
					</template>
				</DialogTitle>
				<DialogDescription>
					<template v-if="!hasSlot('body') && hasSlot('body-content')">
						<div class="p-6">
							<slot name="body-content"></slot>
						</div>
					</template>
					<template v-else>
						<slot name="body"></slot>
					</template>
				</DialogDescription>

				<div>
					<slot name="footer">
						<template v-if="!hasSlot('footer')">
							<div class="bg-slate-200 border-t border-slate-300 px-8 py-3 flex flex-row items-center justify-end">

								<slot name="footer-content"/>

								<SpinnerButton
									class="bg-gray-600 text-white rounded shadow px-4 py-1"
									@click="modal.hide()"
								>
									Close
								</SpinnerButton>
							</div>
						</template>
						<template v-else>
							<slot name="footer"></slot>
						</template>
					</slot>
				</div>
			</DialogPanel>
		</div>
	</Dialog>
</template>

<script setup lang="ts">
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	DialogDescription,
} from "@headlessui/vue";

import {ModalRegistration} from "./ModalRegistration";
import SpinnerButton from "../../Components/SpinnerButton.vue";
import {useSlots} from "vue";

const props = defineProps<{
	modal: ModalRegistration,
	data?: { message: string }
}>();

const slots = useSlots();

const hasSlot = (name) => {
	return !!slots[name];
};

</script>

