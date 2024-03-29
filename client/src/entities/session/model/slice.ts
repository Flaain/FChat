import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { SessionSliceState } from "./types";

const initialState: SessionSliceState = {
    isAuthorized: false,
    isAuthInProgress: true,
    conversations: [],
    accessToken: undefined,
    createdAt: undefined!,
    updatedAt: undefined!,
    id: undefined!,
    username: undefined!,
    email: undefined!,
};

export const sessionSlice = createSlice({
    name: "session",
    initialState,
    reducers: {
        clearSession: (state) => {
            Object.assign(state, { ...initialState, isAuthInProgress: false });
        },
        createSession: (state, { payload }: PayloadAction<Omit<SessionSliceState, "isAuthorized" | "isAuthInProgress">>) => {
            Object.assign(state, { ...payload, isAuthInProgress: false, isAuthorized: true });
        },
    },
    selectors: {
        selectSessionSlice: (state) => state,
        selectIsAuthorized: (state) => state.isAuthorized,
        selectAccessToken: (state) => state.accessToken,
    },
});

export const { clearSession, createSession } = sessionSlice.actions;
export const { selectIsAuthorized, selectAccessToken, selectSessionSlice } = sessionSlice.selectors;
