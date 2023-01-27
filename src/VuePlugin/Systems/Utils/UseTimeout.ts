import {ref, getCurrentInstance, onBeforeUnmount} from "vue";
import {useSafeOnBeforeUnmount} from "./VueSafeHooks";


export function asyncTimeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function useTimeout(fn: Function, ms: number) {
	const timeout = ref<number>(null);

	function start() {
		if (timeout.value) {
			return;
		}
		timeout.value = setTimeout(fn, ms);
	}

	function setTime(newMs: number) {
		ms = newMs;
	}

	function stop() {
		if (!timeout.value) {
			return;
		}
		clearTimeout(timeout.value);
		timeout.value = null;
	}

	const comp = getCurrentInstance();
	if (comp) {
		onBeforeUnmount(stop, comp);
	}

	return {
		start,
		stop,
		setTime,
	};
}

export function useInterval(fn: Function, ms: number) {
	const interval = ref<number>(null);

	function start() {
		if (interval.value) {
			return;
		}
		interval.value = setInterval(fn, ms);
	}

	function setTime(newMs: number) {
		ms = newMs;
		if (interval.value) {
			stop();
			start();
		}
	}

	function stop() {
		if (!interval.value) {
			return;
		}
		clearInterval(interval.value);
		interval.value = null;
	}

	const comp = getCurrentInstance();
	if (comp) {
		onBeforeUnmount(stop, comp);
	}

	return {
		start,
		stop,
		setTime,
	};
}

export function useDebounce(fn: Function, ms: number) {
	const timeout = ref<number>(null);

	function start() {
		if (timeout.value) {
			clearTimeout(timeout.value);
		}
		timeout.value = setTimeout(fn, ms);
	}

	function stop() {
		if (!timeout.value) {
			return;
		}
		clearTimeout(timeout.value);
		timeout.value = null;
	}

	useSafeOnBeforeUnmount(stop);

	return {
		start,
		stop,
	};
}
