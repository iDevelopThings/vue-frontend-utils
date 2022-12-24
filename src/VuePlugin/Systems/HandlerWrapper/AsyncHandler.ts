import {BaseHandler, IBaseHandler, type BaseState} from "./BaseHandler";
import {IPromisified, promisify, PromiseCancelledError, PromiseTimeoutError} from "./Promisify";
import {type Ref, ref, type UnwrapRef} from "vue";

export interface AsyncState<Result, Args extends unknown[]> extends BaseState<Result, Args> {
	currentPromise: IPromisified<Result>;
	timeoutMs: number;
	timeoutHandle: any;
	wasCancelled: UnwrapRef<boolean>;
	wasTimeout: UnwrapRef<boolean>;
}

export interface IAsyncHandler<Result, Args extends unknown[]> extends IBaseHandler<Result, Args> {
	wasCancelled(): boolean;

	withTimeout(timeout: number): void;

	wasTimeout(): boolean;

	getHandler(): IAsyncHandler<Result, Args>;

	getState(): AsyncState<Result, Args>;
}

export class AsyncHandler<Result, Args extends unknown[]> extends BaseHandler<Result, Args> implements IAsyncHandler<Result, Args> {

	private currentPromise: IPromisified<Result>;

	private _timeoutMs: number;
	private _timeoutHandle: any;

	protected _wasCancelled: Ref<boolean>;
	protected _wasTimeout: Ref<boolean>;

	constructor(cb: (...args: Args) => Result | Promise<Result>) {
		super(cb);

		this._wasCancelled = ref<boolean>(false);
		this._wasTimeout   = ref<boolean>(false);
	}

	public withTimeout(timeoutMs: number): void {
		this._timeoutMs = timeoutMs;
	}

	protected startHandler() {
		super.startHandler();
		this._wasCancelled.value = false;
		this._wasTimeout.value   = false;

		clearTimeout(this._timeoutHandle);
	}

	protected stopHandler() {
		super.stopHandler();
		clearTimeout(this._timeoutHandle);
	}

	protected handleError(error: Error) {
		this.setError(error);
		if (error instanceof PromiseTimeoutError) {
			this._wasCancelled.value = true;
			this._wasTimeout.value   = true;
		} else if (error instanceof PromiseCancelledError) {
			this._wasCancelled.value = true;
		}
		this.stopHandler();
	}

	async start(...args: Args): Promise<Result> {
		if (this.isProcessing()) {
			return;
		}

		return await this.run(...args);
	}

	stop(reason?: any): void | Promise<void> {
		if (!this.currentPromise) {
			throw new Error("No promise to stop.");
		}

		this.currentPromise.reject(reason);
	}

	public async run(...args: Args): Promise<Result> {
		try {
			this.startHandler();

			this.currentPromise = promisify(this._cb.value(...args) as any);

			if (this._timeoutMs !== undefined) {
				this._timeoutHandle = setTimeout(() => {
					if (this.currentPromise)
						this.currentPromise.timeout(this._timeoutMs);
				}, this._timeoutMs);
			}

			this.setResult(await this.currentPromise);

			this.handleCompletion();
		} catch (error) {
			this.handleError(error);
			return undefined;
		}
		return this._result.value;
	}

	wasCancelled(): boolean {
		return this._wasCancelled.value;
	}

	wasTimeout(): boolean {
		return this._wasCancelled.value;
	}

	getHandler(): IAsyncHandler<Result, Args> {
		return this;
	}

	getState(): AsyncState<Result, Args> {
		return {
			currentPromise : this.currentPromise,
			timeoutMs      : this._timeoutMs,
			timeoutHandle  : this._timeoutHandle,
			wasCancelled   : this._wasCancelled.value,
			wasTimeout     : this._wasTimeout.value,
			error          : this._error.value,
			result         : this._result.value as any,
			processing     : this._processing.value,
			cb             : this._cb.value,
		};
	}
}
