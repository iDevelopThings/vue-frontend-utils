<template>

	<div>
		<div class="flex flex-row items-center space-x-4">

			<button ref="btn" @click="copyable.copy({data:'big yeet'})">
				{{ copyable.isCopied() === false ? 'Copy' : 'Copied' }}
			</button>

			<button ref="btn" @click="copyableTwo.copy()">
				{{ copyableTwo.isCopied() === false ? 'Copy' : 'Copied' }}
			</button>

			<CopyableSection content="yayeet" />

			<CopyableSection content="yayeet">
				<template #initial v-slot="slotProps">
					<a
						href="javascript:;"
						@click="slotProps.copy()"
						ref="btnInitial"
						class="px-3 py-2 transition flex flex-row items-center"
					>
						Copy custom
					</a>
				</template>
				<template #copied v-slot="slotProps">
					<a
						href="javascript:;"
						class="px-3 py-2 transition flex flex-row items-center"
					>
						Copied
					</a>
				</template>
			</CopyableSection>


		</div>
	</div>

</template>

<script setup lang="ts">

import {useCopyable} from "../VuePlugin/Systems/Copyable";
import {ref} from "vue";
import CopyableSection from "../VuePlugin/Systems/Copyable/CopyableSection.vue";

const btn = ref<HTMLElement | null>(null);

const copyable = useCopyable<string>(btn.value, {
	onCopied       : (value) => {
		console.log("Copied", value);
	},
	onError        : (error) => {
		console.log("Error", error);
	},
	onReset        : () => {
		console.log("Reset copied state");
	},
	processContent : (value) => {
		return JSON.stringify(value, null, 2);
	},
});

const copyableTwo = useCopyable(undefined, {
	onCopied       : (value) => {
		console.log("Copied", value);
	},
	onError        : (error) => {
		console.log("Error", error);
	},
	onReset        : () => {
		console.log("Reset copied state");
	},
	valueGetter: () => {
		return {data: 'yeet'};
	},
	processContent : (value) => {
		return JSON.stringify(value, null, 2);
	},
});

</script>

