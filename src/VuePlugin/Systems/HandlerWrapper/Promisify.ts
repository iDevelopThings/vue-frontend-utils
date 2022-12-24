export interface IPromisified<T> extends Promise<T> {
	resolve(): Promise<void>;
	resolve<T>(value: T): Promise<Awaited<T>>;
	resolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>>;

	reject(reason: any): void;
	timeout(timeMs: number): void;
}

export class PromiseCancelledError extends Error {
	constructor(message?: string) {
		super(message ?? "Promise cancelled.");
	}
}

export class PromiseTimeoutError extends PromiseCancelledError {
	constructor(time: number) {
		super("Timed out after: " + time + "ms");
	}
}

export function promisify<T extends Promise<any>, TValue = T extends Awaited<T> ? Awaited<T> : T>(promise: T): IPromisified<TValue> {
	let _resolve, _reject;

	let wrap: Partial<IPromisified<TValue>> = new Promise(async (resolve, reject) => {
		_resolve   = resolve;
		_reject    = reject;
		let result = await promise;
		resolve(result as any);
	});

	wrap.resolve = _resolve;
	wrap.reject  = (reason) => _reject(new PromiseCancelledError(reason));
	wrap.timeout = (timeMs: number) => _reject(new PromiseTimeoutError(timeMs));

	return wrap as IPromisified<TValue>;
}
