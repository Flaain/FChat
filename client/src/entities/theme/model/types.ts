export type Theme = "light" | "dark";

export interface ThemeProviderProps {
    theme?: Theme;
    children: React.ReactNode;
}