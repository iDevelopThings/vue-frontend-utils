import {AsyncHandler, type IAsyncHandler} from "./AsyncHandler";


export interface IAsyncHandlerHook<Result, Args extends unknown[]> extends IAsyncHandler<Result, Args> {
	(...args: Args): Promise<Result>;
}

export function useAsyncHandler<Result, Args extends unknown[]>(
	cb: (...args: Args) => Result | Promise<Result>
): IAsyncHandlerHook<Result, Args> {
	const aHandler = new AsyncHandler(cb);

	const handler: IAsyncHandlerHook<Result, Args> = (...args: Args) => {
		return aHandler.start(...args);
	};

	handler.getHandler   = aHandler.getHandler.bind(aHandler);
	handler.getState     = aHandler.getState.bind(aHandler);
	handler.wasTimeout   = aHandler.wasTimeout.bind(aHandler);
	handler.withTimeout  = aHandler.withTimeout.bind(aHandler);
	handler.wasCancelled = aHandler.wasCancelled.bind(aHandler);
	handler.error        = aHandler.error.bind(aHandler);
	handler.isProcessing = aHandler.isProcessing.bind(aHandler);
	handler.hasError     = aHandler.hasError.bind(aHandler);
	handler.hasResult    = aHandler.hasResult.bind(aHandler);
	handler.result       = aHandler.result.bind(aHandler);
	handler.start        = aHandler.start.bind(aHandler);
	handler.stop         = aHandler.stop.bind(aHandler);

	return handler;
}
