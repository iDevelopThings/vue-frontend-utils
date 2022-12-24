import {describe, it, expect} from "vitest";
import {promisify} from "../src/VuePlugin/Systems/HandlerWrapper/Promisify";

describe("Promisify", () => {

	function something(): Promise<string> {
		return new Promise(resolve => setTimeout(() => resolve("Hello World!"), 1000));
	}

	it("Can create instance", async () => {
		const promise = promisify(something());

		const v = await promise;
		expect(promise).toBeInstanceOf(Promise);
		expect(promise.resolve).toBeInstanceOf(Function);
		expect(promise.reject).toBeInstanceOf(Function);
	});

	it("Can resolve", async () => {
		const promise = promisify(something());

		const v = await promise;

		expect(v).toBe("Hello World!");
	});

	it("Can reject", async () => {
		const promise = promisify(something());

		setTimeout(() => promise.reject("Failure."), 500);

		try {
			const v = await promise;
		} catch (e) {
			expect(e).toBe("Failure.");
		}
	});

});
