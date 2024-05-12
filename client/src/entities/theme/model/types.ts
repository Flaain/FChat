import React from "react";

export type Theme = "light" | "dark";

export interface ThemeContextProps {
    theme: Theme;
    setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

export interface ThemeProviderProps {
    defaultTheme?: Theme;
    children: React.ReactNode;
}