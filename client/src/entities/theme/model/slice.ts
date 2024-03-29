import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Theme } from "./types";
import { getTheme } from "../lib/getTheme";

export const themeSlice = createSlice({
    name: "theme",
    initialState: { theme: getTheme() },
    reducers: {
        setTheme: (state, { payload }: PayloadAction<Theme>) => {
            state.theme = payload;
        },
    },
    selectors: {
        selectCurrentTheme: (state) => state.theme
    }
});

export const { setTheme } = themeSlice.actions;
export const { selectCurrentTheme } = themeSlice.selectors