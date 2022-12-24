import {describe, it, expect, vitest, beforeEach} from "vitest";
import {useMemoizedAsyncHandler} from "../src/VuePlugin/Systems/HandlerWrapper/Handlers";

describe("MemoizedAsyncHandler", () => {
	const resolver = vitest.fn();

	beforeEach(() => {
		resolver.mockReset();
		resolver.mockImplementation((value: string) => {
			return `Hello ${value}`;
		});
	});

	describe("get", () => {

		it("should cache", async () => {
			const handler = useMemoizedAsyncHandler(resolver);

			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");

			resolver.mockClear();
			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(0);
		});

		it("should cache with different keys", async () => {
			const handler = useMemoizedAsyncHandler(resolver);

			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");

			resolver.mockClear();
			expect(await handler("World2")).toBe("Hello World2");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World2");
		});

		it("should cache without args", async () => {
			const _resolver = vitest.fn(() => "Hello World");

			const handler = useMemoizedAsyncHandler(_resolver as any);

			expect(await handler()).toBe("Hello World");
			expect(await handler()).toBe("Hello World");
			expect(_resolver).toHaveBeenCalledTimes(1);
		});

		it("load should repopulate cache and bypass memoized value", async () => {
			const handler = useMemoizedAsyncHandler(resolver);

			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");

			resolver.mockClear();
			expect(await handler.load("World")).toBe("Hello World");
			expect(await handler.load("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(2);
			expect(resolver).toHaveBeenCalledWith("World");
		})

	});

	describe("delete", () => {

		it("should delete", async () => {
			const handler = useMemoizedAsyncHandler(resolver);

			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");

			resolver.mockClear();
			handler.delete("World");
			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");
		});

		it("should delete without args", async () => {
			const _resolver = vitest.fn(() => "Hello World");

			const handler = useMemoizedAsyncHandler(_resolver as any);

			expect(await handler()).toBe("Hello World");
			expect(await handler()).toBe("Hello World");
			expect(_resolver).toHaveBeenCalledTimes(1);

			handler.delete();
			expect(await handler()).toBe("Hello World");
			expect(_resolver).toHaveBeenCalledTimes(2);
		});

	});

	describe("clear", () => {

		it("should clear", async () => {
			const handler = useMemoizedAsyncHandler(resolver);

			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");

			resolver.mockClear();
			handler.clear();
			expect(await handler("World")).toBe("Hello World");
			expect(resolver).toHaveBeenCalledTimes(1);
			expect(resolver).toHaveBeenCalledWith("World");
		});

	});


});
