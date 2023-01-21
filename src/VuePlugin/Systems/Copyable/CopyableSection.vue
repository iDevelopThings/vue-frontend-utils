<template>
	<div class="flex flex-row relative">
		<TransitionGroup mode="out-in">
			<slot key="initial" v-if="!copyable.isCopied()" name="initial" :copy="copyable.copy">
				<button ref="btnInitial" @click="copyable.copy()" class="absolute">
					Copy
				</button>
			</slot>
			<slot key="copied" v-if="copyable.isCopied()" name="copied" :reset="copyable.reset">
				<button ref="btnCopied" disabled class="absolute">
					Copied
				</button>
			</slot>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
import {CopyableInstance, UseCopyableOptions, useCopyable} from "./index";
import {ref} from "vue";

const props = withDefaults(defineProps<{
	copyableInstance?: CopyableInstance,
	content?: any

	valueGetter?: UseCopyableOptions["valueGetter"],
	processContent?: UseCopyableOptions["processContent"],
	onCopied?: UseCopyableOptions["onCopied"],
	onError?: UseCopyableOptions["onError"],
	resetAfter?: UseCopyableOptions["resetAfter"],
	onReset?: UseCopyableOptions["onReset"],
}>(), {
	copyableInstance : undefined,
});

const btnInitial = ref<HTMLButtonElement>(null);
const btnCopied  = ref<HTMLButtonElement>(null);

const emit = defineEmits<{
	(e: "copied", value: any): void,
	(e: "error", error: any): void,
	(e: "reset"): void,
}>();

const copyable = props.copyableInstance
	? props.copyableInstance
	: useCopyable(btnInitial, {
		valueGetter : props?.valueGetter ? props.valueGetter : (props.content ? () => props.content : undefined),
		resetAfter  : props?.resetAfter,

		onCopied       : (value) => {
			if (props?.onCopied) {
				props.onCopied(value);
			}

			emit("copied", value);
		},
		onError        : (error) => {
			if (props?.onError) {
				props.onError(error);
			}

			emit("error", error);
		},
		onReset        : () => {
			if (props?.onReset) {
				props.onReset();
			}

			emit("reset");
		},
		processContent : (value) => {
			if (props?.processContent) {
				return props.processContent(value);
			}
			return value;
		},
	});


</script>


<style>
.v-enter-active,
.v-leave-active {
	transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>
