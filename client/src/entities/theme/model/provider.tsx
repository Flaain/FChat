import React from "react";
import { Theme, ThemeProviderProps } from "./types";
import { ThemeContext } from "./context";

export const ThemeProvider = ({ defaultTheme = "dark", children }: ThemeProviderProps) => {
    const [theme, setTheme] = React.useState<Theme>(defaultTheme);

    React.useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }, [theme]);

    const value = React.useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};