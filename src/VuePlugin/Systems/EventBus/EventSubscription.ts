import {nanoid} from "nanoid";
import {type EventSubscriptionContract} from "./Types";




export class EventSubscription implements EventSubscriptionContract {

	private readonly _callback: Function;

	private _onDisposed: Function = () => {
	};
	private _disposed: boolean    = false;

	public id: string;

	constructor(callback: Function) {
		this._callback = callback;
		this.id        = nanoid();
	}

	public invoke(...args: any[]): void {
		if (this._disposed) {
			return;
		}
		this._callback(...args);
	}

	/**
	 * @internal
	 * @param {Function} disposedHandler
	 * @returns {EventSubscriptionContract}
	 */
	public whenDisposed(disposedHandler: Function): EventSubscriptionContract {
		this._onDisposed = () => {
			disposedHandler();
			this._disposed = true;
		};

		return this;
	}

	public dispose(): void {
		if (this._disposed || !this._onDisposed) {
			return;
		}
		this._onDisposed();
	}

}
