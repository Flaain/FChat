import React from "react";
import { SettingsContextProps } from "../../model/types";

export const SettingsContext = React.createContext<SettingsContextProps>({
    currentMenu: 'main',
    prevMenuRef: null,
    onBack: () => {},
    onMenuChange: () => {},
    titles: undefined!
})