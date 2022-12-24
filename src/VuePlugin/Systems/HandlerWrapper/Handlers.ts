import {AsyncHandler, type IAsyncHandler} from "./AsyncHandler";
import {type IMemoizedAsyncHandler, MemoizedAsyncHandler, type MemoizedAsyncHandlerOptions} from "./MemoizedAsyncHandler";


export interface IAsyncHandlerHook<Result, Args extends unknown[]> extends IAsyncHandler<Result, Args> {
	(...args: Args): Promise<Result>;
}

export function useAsyncHandler<Result, Args extends unknown[]>(
	cb: (...args: Args) => Promise<Result>
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


export interface IMemoizedAsyncHandlerHook<Result, Args extends unknown[]> extends IMemoizedAsyncHandler<Result, Args> {
	(...args: Args): Promise<Result>;
}

export function useMemoizedAsyncHandler<Result, Args extends unknown[]>(
	cb: (...args: Args) => Promise<Result>,
	options?: MemoizedAsyncHandlerOptions<Result, Args>
): IMemoizedAsyncHandlerHook<Result, Args> {
	const aHandler = new MemoizedAsyncHandler(cb, options);

	const handler: IMemoizedAsyncHandlerHook<Result, Args> = (...args: Args) => {
		return aHandler.start(...args);
	};

	handler.get          = aHandler.get.bind(aHandler);
	handler.set          = aHandler.set.bind(aHandler);
	handler.has          = aHandler.has.bind(aHandler);
	handler.delete       = aHandler.delete.bind(aHandler);
	handler.clear        = aHandler.clear.bind(aHandler);
	handler.createKey    = aHandler.createKey.bind(aHandler);
	handler.shouldCache  = aHandler.shouldCache.bind(aHandler);
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
	handler.load         = aHandler.load.bind(aHandler);
	handler.stop         = aHandler.stop.bind(aHandler);

	return handler;
}
