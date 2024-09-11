export type Theme = "light" | "dark";

export interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}