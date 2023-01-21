import {Plugin, ref, computed} from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FormattedDate from "./FormattedDate.vue";
import DiffDate from "./DiffDate.vue";



dayjs.extend(relativeTime);

export interface TimePluginOptions {
	// Default is 5000ms
	updateInterval: number;
}

let nativeTime       = ref(new Date());
let currentDayJsTime = ref(now());

const TimePlugin: Plugin = {
	install(app, options: TimePluginOptions = {updateInterval : 5000}) {
		app.component("FormattedDate", FormattedDate);
		app.component("DiffDate", DiffDate);

		app.config.globalProperties.$nativeTime  = nativeTime;
		app.config.globalProperties.$currentTime = currentDayJsTime;

		setInterval(() => {
			nativeTime.value       = new Date();
			currentDayJsTime.value = now();

			app.config.globalProperties.$nativeTime  = nativeTime;
			app.config.globalProperties.$currentTime = currentDayJsTime;

		}, options.updateInterval);

	}
};

export function useNativeDate(): Date {
	return nativeTime.value;
}

export function useTime(): dayjs.Dayjs {
	return currentDayJsTime.value;
}

export function useDiff(date: string | Date | dayjs.Dayjs, vueComputed = true): string {
	if (typeof date === "string") {
		date = dayjs(date);
	}

	if (vueComputed) {
		return computed(() => currentDayJsTime.value.to(date)).value;
	}

	return now().to(date);
}

export function now() {
	return dayjs(new Date());
}

export {DiffDate, FormattedDate, TimePlugin}
