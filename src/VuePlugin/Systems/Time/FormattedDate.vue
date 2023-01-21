<template>
	<p class="text-sm">
		{{ dateFormatted }}
		<template v-if="!noDiff">
			(<span class="text-sm text-slate-500">{{ diff }}</span>)
		</template>
	</p>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import dayjs from "dayjs";
import {useTime, now} from "./index";


const props = withDefaults(defineProps<{
	date: string,
	format?: string,
	noDiff?: boolean,
}>(), {
	format : "DD MMM YY, hh:mm A",
	noDiff : false,
});

const date = useTime();

const diff          = computed(() => dayjs(now()).to(date));
const dateFormatted = computed(() => date.format(props.format));

</script>

