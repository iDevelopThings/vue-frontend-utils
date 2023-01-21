<template>
	<div class="w-full h-screen p-8">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<!-- We've used 3xl here, but feel free to try other max-widths based on your needs -->
			<div class="mx-auto max-w-3xl">
				<div class="flex flex-row items-center">
					<div
						@click="currentTab = tab"
						class="hover:bg-main-700 cursor-pointer flex flex-row items-center space-x-2 px-4 py-2"
						:class="{
					'bg-gray-300 font-semibold text-gray-900':tab.title === currentTab.title,
					'bg-white text-gray-700': tab.title !== currentTab.title
				}"
						v-for="tab in tabs"
					>
						<p>{{ tab.title }}</p>
					</div>
				</div>

				<div v-if="currentTab" class="py-8">
					<component :is="currentTab.component" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import {ref, shallowRef} from "vue";
import Modals from "./Modals/Modals.vue";
import Events from "./Events.vue";
import {type Component} from "@vue/runtime-core";
import Copyable from "./Copyable.vue";

type Tab = {
	title: string;
	component: Component
}

const tabs = shallowRef<Tab[]>([
	{
		title     : "Modals",
		component : Modals
	},
	{
		title     : "Events",
		component : Events
	},
	{
		title     : "Copyable",
		component : Copyable
	},
]);

const currentTab = shallowRef<Tab>(tabs.value[0]);

</script>

