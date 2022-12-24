import {reactive, ref, type Ref, type UnwrapRef} from "vue";

export interface BaseState<Result, Args extends unknown[]> {
	processing: UnwrapRef<boolean>;
	error: UnwrapRef<Error>;
	result: UnwrapRef<Result>;
	cb: UnwrapRef<(...args: Args) => Result | Promise<Result>>;
}

export interface IBaseHandler<Result, Args extends unknown[]> {

	isProcessing(): boolean;
	hasError(): boolean;
	hasResult(): boolean;
	result(): Result;
	error(): Error;

	start(...args: Args): Promise<Result>;

	stop(reason?:any): void | Promise<void>;

}

export class BaseHandler<Result, Args extends unknown[]> implements IBaseHandler<Result, Args> {

	protected _processing: Ref<boolean>;
	protected _error: Ref<Error>;
	protected _result: Ref<Result>;
	protected _cb: Ref<(...args: Args) => Result | Promise<Result>>;

	constructor(cb: (...args: Args) => Result | Promise<Result>) {
		this._processing = ref<boolean>(false);
		this._error      = ref<Error>(null);
		this._result     = ref<Result>(null) as Ref<Result>;
		this._cb         = ref<(...args: Args) => Result | Promise<Result>>(cb);
	}

	protected setProcessing(value: boolean) {
		this._processing.value = value;
	}

	protected setError(value: Error | string) {
		this._error.value = value instanceof Error ? value : new Error(value);
	}

	protected setResult(value: Result) {
		this._result.value = value;
	}

	protected startHandler() {
		this.setProcessing(true);
		this.setError(null);
		this.setResult(null);
	}

	protected stopHandler() {
		this.setProcessing(false);
	}

	protected handleCompletion() {
		this.stopHandler();
	}

	protected handleError(error: Error) {
		this.setError(error);
		this.stopHandler();
	}

	async start(...args: Args): Promise<Result> {
		if (this.isProcessing()) {
			return;
		}

		return await this.run(...args);
	}

	stop(): void | Promise<void> {
		throw new Error("Method not implemented on BaseHandler.");
	}


	public async run(...args: Args): Promise<Result> {
		try {
			this.startHandler();
			this.setResult(await this._cb.value(...args));
			this.handleCompletion();
		} catch (error) {
			this.handleError(error);
			return undefined;
		}
		return this._result.value;
	}

	isProcessing(): boolean {
		return this._processing.value;
	}

	hasError(): boolean {
		return !!this._error.value;
	}

	hasResult(): boolean {
		return !!this._result.value;
	}

	result(): Result {
		return this._result.value;
	}

	error(): Error {
		return this._error.value;
	}

}
