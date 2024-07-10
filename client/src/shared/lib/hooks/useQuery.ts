import React from 'react';
import { UseQueryReducerAction, UseQueryOptions, UseQueryReducerState, UseQueryTypes, UseRunQueryAction, UseQueryReturn } from '@/shared/model/types';

const queryReducer = <T>(state: UseQueryReducerState<T>, action: UseQueryReducerAction<T>) => {
    switch (action.type) {
        case UseQueryTypes.LOADING:
            return { ...state, isLoading: action.payload.isLoading };
        case UseQueryTypes.SUCCESS:
            return { ...state, ...action.payload };
        case UseQueryTypes.REFETCH:
            return { ...state, isRefetching: action.payload.isRefething };
        case UseQueryTypes.ERROR:
            return { ...state, error: action.payload.error };
        case UseQueryTypes.RESET:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const useQuery = <T>(callback: () => Promise<T>, options?: UseQueryOptions<T>): UseQueryReturn<T> => {
    const [state, dispatch] = React.useReducer<React.Reducer<UseQueryReducerState<T>, UseQueryReducerAction<T>>>(queryReducer, {
        isError: false,
        isLoading: false,
        isSuccess: false,
        isRefetching: false,
        data: undefined,
        error: undefined
    });

    const actions: Record<UseRunQueryAction, UseQueryReducerAction<T>> = {
        init: { type: UseQueryTypes.LOADING, payload: { isLoading: true } },
        refetch: { type: UseQueryTypes.REFETCH, payload: { isRefething: true } }
    };

    const retryRef = React.useRef(Number(options?.retry) || 0);
    const config = React.useRef<Record<'interval' | 'timeout', NodeJS.Timeout | null>>({
        interval: null,
        timeout: null
    });

    const runQuery = React.useCallback(async (action: UseRunQueryAction) => {
        try {
            dispatch(actions[action]);

            const response = await callback();

            dispatch({
                type: UseQueryTypes.SUCCESS,
                payload: { data: response, isSuccess: true, isLoading: false, isRefetching: false }
            });

            options?.onSuccess?.(response);

            if (options?.refetchInterval) {
                const interval = setInterval(() => {
                    runQuery('refetch');
                    clearInterval(interval);
                }, options.refetchInterval);

                config.current.interval = interval;
            }
        } catch (error) {
            if (error instanceof Error) {
                if (retryRef.current > 0) {
                    retryRef.current -= 1;

                    const timeout = setTimeout(() => {
                        runQuery(action);
                        clearTimeout(timeout);
                    }, options?.refetchInterval ?? 1000);

                    config.current.timeout = timeout;
                }

                options?.onError?.(error);

                dispatch({ type: UseQueryTypes.ERROR, payload: { error, isError: true } });
            }
        }
    }, []);

    React.useEffect(() => {
        runQuery('init');

        return () => {
            config.current.interval && clearInterval(config.current.interval);
            config.current.timeout && clearTimeout(config.current.timeout);
        };
    }, options?.keys ?? []);

    return { ...state, refetch: () => runQuery('refetch') };
};