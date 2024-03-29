import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import { rootReducer } from "./reducer";

export const makeStore = () => {
    enableMapSet();

    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    });
};

export const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;