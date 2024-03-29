import { PayloadAction, asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";
import { AuthForm, AuthInitialState } from "./types";

const initialState: AuthInitialState = {
    form: "welcome",
};

export const authSlice = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })({
    name: "auth",
    initialState,
    reducers: ({ reducer }) => ({
        setAuthForm: reducer((state, { payload }: PayloadAction<AuthForm>) => {
            state.form = payload;
        }),
    }),
    selectors: {
        selectAuthSlice: (state) => state,
        selectAuthForm: (state) => state.form,
    },
});

export const { setAuthForm } = authSlice.actions;
export const { selectAuthForm, selectAuthSlice } = authSlice.selectors;