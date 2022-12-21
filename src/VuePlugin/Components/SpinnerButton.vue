<template>
	<button :class="buttonClasses" :disabled="$attrs?.disabled || spin">
		<Spinner :class="['w-5 h-5']" class="absolute inline-flex self-center" v-if="spin" />
		<span class="transition ease-in-out flex flex-row items-center space-x-1" :class="{'opacity-40' : spin}"><slot></slot></span>
	</button>
</template>
<script lang="ts" setup>
import {useAttrs} from "vue";
import Spinner from "./Spinner.vue";

const props         = defineProps<{
	spin?: boolean | undefined,
}>();
const attrs         = useAttrs();
const buttonClasses = [
	"btn",
	"relative",
	"flex",
	"flex-row",
	"items-center",
	"justify-center",
	...(attrs?.class ? Array.isArray(attrs.class) ? attrs.class : [attrs.class] : []),
];
</script>
