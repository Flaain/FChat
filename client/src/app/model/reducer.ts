import { combineReducers } from "@reduxjs/toolkit";
import { themeSlice } from "../../entities/theme/model/slice";
import { sessionSlice } from "@/entities/session/model/slice";
import { authSlice } from "@/pages/Auth/model/slice";

export const rootReducer = combineReducers({
    [themeSlice.name]: themeSlice.reducer,
    [sessionSlice.name]: sessionSlice.reducer,
    [authSlice.name]: authSlice.reducer,
});