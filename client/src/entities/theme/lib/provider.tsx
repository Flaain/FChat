import React from "react";
import { ThemeProviderProps } from "../model/types";
import { selectCurrentTheme, setTheme } from "../model/slice";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";

export const ThemeProvider = ({ children, theme }: ThemeProviderProps) => {
    const currentTheme = useAppSelector(selectCurrentTheme);
    
    const dispatch = useAppDispatch();

    React.useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");

        if (theme && theme !== currentTheme) {
            dispatch(setTheme(theme));
            root.classList.add(theme);
            return;
        }

        root.classList.add(currentTheme);
    }, [currentTheme, dispatch, theme]);

    return children;
};