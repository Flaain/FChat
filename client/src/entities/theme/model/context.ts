import React from "react";
import { ThemeContextProps } from "./types";

export const ThemeContext = React.createContext<ThemeContextProps>({
    theme: "dark",
    setTheme: () => {},
});