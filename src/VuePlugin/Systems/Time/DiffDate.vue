<template>
	<p class="text-sm">
		{{ diff }}
	</p>
</template>

<script setup lang="ts">
import {computed} from "vue";
import dayjs from "dayjs";
import {useTime} from "./index";


const props = defineProps<{
	date: string | Date | dayjs.Dayjs,
}>();

const date = useTime();

const diff = computed(() => dayjs(date).to(props.date));

</script>

