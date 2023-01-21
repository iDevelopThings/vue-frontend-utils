import {Plugin, ref, Ref, isRef} from "vue";
import Clipboard from "clipboard";
import {nanoid} from "nanoid";
import {tryOnMounted, unrefElement} from "@vueuse/core";
import CopyableSection from "./CopyableSection.vue";

export interface CopyablePluginOptions {
}

const CopyablePlugin: Plugin = {
	install(app, options: CopyablePluginOptions = {}) {
		app.component("CopyableSection", CopyableSection);
	}
};

export type UseCopyableOptions<T = any> = {
	valueGetter?: () => T;

	/**
	 * Allows you to change the content before it's copied
	 *
	 * @param {T} content
	 * @returns {string}
	 */
	processContent?: (content: T) => string;

	/**
	 * Called when the content has been copied
	 * @param {T} content
	 * @returns {void | Promise<void>}
	 */
	onCopied?: (content: T) => void | Promise<void>;

	/**
	 * Called when the content failed to be copied
	 * @returns {void | Promise<void>}
	 */
	onError?: (error) => void | Promise<void>;

	/**
	 * How long you'd show the typical "text copied" state
	 *
	 * @default 3500
	 */
	resetAfter?: number;

	/**
	 * Called when the "text copied" state is reset
	 *
	 * @returns {void | Promise<void>}
	 */
	onReset?: () => void | Promise<void>;

}

export type CopyableInstance<T = any> = {
	id: string;

	copied: Ref<boolean>;

	isCopied(): boolean;

	copy(content?: T): void;

	destroy(): void;

	reset(): void;
}

const instances = new Map<string, CopyableInstance>();

export function useCopyable<T = any>(
	element?: HTMLElement | Ref<HTMLElement>,
	options?: UseCopyableOptions<T>,
): CopyableInstance<T> {
	if (options?.resetAfter === undefined) {
		options.resetAfter = 3500;
	}

	let clipBoard: Clipboard;
	let el = isRef(element) ? element.value : element;

	const getter       = options?.valueGetter;
	const id           = nanoid();
	const copied       = ref(false);
	let copiedTimeout  = null;
	let tempValue: any = null;

	if (!element) {
		el = document.createElement("button");
	}

	function setup() {
		if (clipBoard) return;

		clipBoard = new Clipboard(el, {
			text : processContent,
		});

		clipBoard.on("success", (e) => {
			copied.value = true;

			if (options?.onCopied) {
				options.onCopied(e.text as any);
			}

			if (copiedTimeout) {
				clearTimeout(copiedTimeout);
				copiedTimeout = null;
			}

			setTimeout(() => {
				copied.value = false;

				if (options?.onReset) {
					options.onReset();
				}
			}, options.resetAfter);
		});

		clipBoard.on("error", (e) => {
			if (options?.onError) {
				options.onError(e);
			}
		});
	}

	if (isRef(element)) {
		function setRefEl() {
			el = unrefElement(element);
			setup();
		}

		!element.value
			? tryOnMounted(() => setRefEl())
			: setRefEl();
	} else {
		setup();
	}

	function processContent(elem): string {
		if (!tempValue) {
			throw new Error("No value provided and no valueGetter provided");
		}

		if (options?.processContent) {
			return options.processContent(tempValue);
		}
		return tempValue as string;
	}

	function setValue(value?: T) {
		if (!value && !getter) {
			throw new Error("No value provided and no valueGetter provided");
		}

		if (value) {
			tempValue = value;
			return;
		}

		if (getter) {
			tempValue = getter() as any;
			return;
		}

		throw new Error("i dont know, something is wrong");
	}

	function copy(content?: T) {
		setValue(content);

		el.click();
	}

	function reset() {
		copied.value = false;
		if (copiedTimeout) {
			clearTimeout(copiedTimeout);
			copiedTimeout = null;
		}
	}

	function destroy() {
		clipBoard.destroy();
		instances.delete(id);
	}

	function isCopied(): boolean {
		return copied.value;
	}

	const instance: CopyableInstance = {
		id,
		copied : copied,

		isCopied,
		reset,
		destroy,
		copy,
	};

	instances.set(id, instance);

	return instance;
}


export {CopyablePlugin, CopyableSection};
