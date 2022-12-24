import {describe, it, expect} from "vitest";
import {useAsyncHandler} from "../src/VuePlugin/Systems/HandlerWrapper/Handlers";
import {PromiseCancelledError, PromiseTimeoutError} from "../src/VuePlugin/Systems/HandlerWrapper/Promisify";

describe("AsyncHandlers", () => {

	it("Can run handler without args", async () => {
		const handler = useAsyncHandler(() => {
			return new Promise((resolve) => setTimeout(() => resolve("Hello World"), 200));
		});

		expect(await handler()).toBe("Hello World");
	});

	it("Can run handler with args", async () => {
		const handler = useAsyncHandler((name: string) => {
			return new Promise((resolve) => setTimeout(() => resolve(`Hello ${name}`), 200));
		});

		expect(await handler("World")).toBe("Hello World");
	});

	it("Can run handler with args and error", async () => {
		const handler = useAsyncHandler((name: string) => {
			return new Promise((resolve, reject) => {
				return setTimeout(() => {
					return reject(new Error("Error"));
				}, 200);
			});
		});

		expect(await handler("World")).toBe(undefined);
		expect(handler.error()).toBeInstanceOf(Error);
		expect(handler.hasError()).toBe(true);
	});

	it("Can run handler from start", async () => {
		const handler = useAsyncHandler((name: string) => {
			return new Promise((resolve) => setTimeout(() => resolve(`Hello ${name}`), 200));
		});
		const result  = await handler.start("World");

		expect(await handler.start("World")).toBe("Hello World");
		expect(handler.result()).toBe("Hello World");
	});

	it("Can stop handler", async () => {
		const handler = useAsyncHandler((name: string) => {
			return new Promise((resolve) => setTimeout(() => resolve(`Hello ${name}`), 200));
		});

		setTimeout(() => handler.stop("Stop running."), 100);

		expect(handler.isProcessing()).toBe(false);
		expect(await handler("World")).toBe(undefined);
		expect(handler.error()).toBeInstanceOf(PromiseCancelledError);
		expect(handler.hasError()).toBe(true);
		expect(handler.wasCancelled()).toBe(true);
	});

	it("Can use timeout", async () => {
		const handler = useAsyncHandler((name: string) => {
			return new Promise((resolve) => setTimeout(() => resolve(`Hello ${name}`), 200));
		});

		handler.withTimeout(100);

		const result = await handler("World");

		expect(handler.isProcessing()).toBe(false);
		expect(handler.error()).toBeInstanceOf(PromiseTimeoutError);
		expect(handler.hasError()).toBe(true);
		expect(handler.wasCancelled()).toBe(true);
	});

	it("Can use handler state", async () => {
		const handler = useAsyncHandler((name: string) => {
			return new Promise((resolve) => setTimeout(() => resolve(`Hello ${name}`), 200));
		});

		expect(handler.isProcessing()).toBe(false);
		expect(await handler("World")).toBe("Hello World");
		expect(handler.isProcessing()).toBe(false);
		expect(handler.result()).toBe("Hello World");
	});

	async function apiGetUserRequest(id: string) {

	}

	it("Example", async () => {

		const getUser = useAsyncHandler(apiGetUserRequest);

		getUser.start('user id');
		getUser.stop();

		getUser.isProcessing();

		getUser.hasResult();
		getUser.hasError();
		getUser.wasTimeout();

		getUser.hasResult();
		getUser.result();
		getUser.error();

		getUser.withTimeout(200);

	});

});
