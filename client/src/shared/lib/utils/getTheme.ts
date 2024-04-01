import { localStorageKeys } from "@/shared/constants";
import { Theme } from "../../../entities/theme/model/types";

export const getTheme = (): Theme => {
    try {
        const theme = localStorage.getItem(localStorageKeys.THEME);

        if (!theme || !["light", "dark"].includes(theme)) return "dark";

        return theme as Theme;
    } catch (error) {
        console.error(error);
        return "dark";
    }
};