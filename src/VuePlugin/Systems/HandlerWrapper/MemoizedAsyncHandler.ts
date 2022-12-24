import {type IAsyncHandler, AsyncHandler, type AsyncState} from "./AsyncHandler";
import {reactive} from "vue";

export interface MemoizeAsyncState<Result, Args extends unknown[]> extends AsyncState<Result, Args> {
	args: Args;
	cache: MemoizeCache<string, Result>;
	options: MemoizedAsyncHandlerOptions<Result, Args>;
}

export interface MemoizeCache<Key, Result> {
	get(key: Key): Result | undefined;
	set(key: Key, value: Result): void;
	has(key: Key): boolean;
	delete(key: Key): void;
	clear(): void;
}

export interface IMemoizedAsyncHandler<Result, Args extends unknown[]> extends IAsyncHandler<Result, Args> {
	load(...args: Args): Promise<Result>;

	getHandler(): IMemoizedAsyncHandler<Result, Args>;
	getState(): MemoizeAsyncState<Result, Args>;

	createKey(cb: (...args: Args) => Promise<Result>, ...args: unknown[]): string;
	shouldCache(result: Result): boolean;

	get(...args: Args): Result | undefined;
	set(args: Args[], value: Result): void;
	has(...args: Args): boolean;
	delete(...args: Args): void;
	clear(): void;
}

export type KeyGeneratorType = "func_and_args_base64" | "args_only_json";

export type MemoizedAsyncHandlerOptions<Result, Args extends unknown[]> = {
	cache?: MemoizeCache<string, Result>

	keyGenerationType?: KeyGeneratorType;

	createKey?(cb: (...args: Args) => Promise<Result>, ...args: unknown[]): string;

	get?(key: string): Result | undefined;

	set?(key: string, result: Result): void;

	shouldCache?(result: Result): boolean;

	has?(key: string): boolean;

	delete?(key: string): void;

	clear?(): void;
}

export class MemoizedAsyncHandler<Result, Args extends unknown[]> extends AsyncHandler<Result, Args> implements IMemoizedAsyncHandler<Result, Args> {

	private options: MemoizedAsyncHandlerOptions<Result, Args>;

	protected cache: MemoizeCache<string, Result>;
	protected _args: Args = [] as Args;


	constructor(
		cb: (...args: Args) => Promise<Result>,
		options: MemoizedAsyncHandlerOptions<Result, Args> = {
			keyGenerationType : "args_only_json"
		}
	) {
		super(cb);

		this.options = options;

		let cache = options?.cache ?? new Map<string, Result>();

		if (options?.get) {
			cache.get = options?.get;
		}
		if (options?.set) {
			cache.set = options?.set;
		}
		if (options?.has) {
			cache.has = options?.has;
		}
		if (options?.delete) {
			cache.delete = options?.delete;
		}
		if (options?.clear) {
			cache.clear = options?.clear;
		}

		this.cache = reactive(cache);
	}

	createKey(cb: (...args: Args) => Promise<Result>, ...args: unknown[]): string {
		if (this.options?.createKey) {
			return this.options.createKey(cb, ...args);
		}

		if (this.options?.keyGenerationType === "args_only_json") {
			return JSON.stringify(args);
		}

		if (this.options?.keyGenerationType === "func_and_args_base64") {
			const buf = Buffer.from(cb.toString() + "|" + JSON.stringify(args));

			return buf.toString("base64url");
		}

		throw new Error("No key generation type specified");
	}

	get(...args: Args): Result | undefined {
		return this.cache.get(this.createKey(this._cb.value, ...args));
	}

	set(args: Args[], result: Result): void {
		this.cache.set(this.createKey(this._cb.value, ...args), result);
	}

	shouldCache(result: Result): boolean {
		if (this.options?.shouldCache) {
			return this.options.shouldCache(result);
		}

		return true;
	}

	has(...args: Args): boolean {
		return this.cache.has(this.createKey(this._cb.value, ...args));
	}

	delete(...args: Args): void {
		this.cache.delete(this.createKey(this._cb.value, ...args));
	}

	clear(): void {
		this.cache.clear();
	}

	protected setResult(value: Result): void {
		super.setResult(value);

		if (this.shouldCache(value)) {
			this.cache.set(this.getKey(), value);
		}
	}

	private getKey() {
		return this.createKey(this._cb.value, ...this._args);
	}

	private async invokeInternal(useCache: boolean, ...args: Args) {
		if (this.isProcessing()) {
			return;
		}

		this._args = args;

		const key = this.getKey();

		if (useCache) {
			if (this.cache.has(key)) {
				return this.cache.get(key);
			}
		}

		return await this.run(...args);
	}

	async load(...args: Args): Promise<Result> {
		return await this.invokeInternal(false, ...args);
	}

	async start(...args: Args): Promise<Result> {
		return await this.invokeInternal(true, ...args);
	}

	getHandler(): IMemoizedAsyncHandler<Result, Args> {
		return this;
	}

	getState(): MemoizeAsyncState<Result, Args> {
		const state = super.getState() as MemoizeAsyncState<Result, Args>;

		state.args    = this._args;
		state.cache   = this.cache;
		state.options = this.options;

		return state;
	}

}
