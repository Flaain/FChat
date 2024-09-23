import React from 'react';
import { SettingMenu } from './types';
import { prevMenu } from './constants';
import { SettingsContext } from './context';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [menu, setMenu] = React.useState<SettingMenu>('main');

    const onMenuChange = React.useCallback((menu: SettingMenu) => {
        setMenu(menu);
    }, []);

    const onBack = React.useCallback(() => {
        setMenu(prevMenu[menu as keyof typeof prevMenu]);
    }, []);

    return <SettingsContext.Provider value={{ menu, onMenuChange, onBack }}>{children}</SettingsContext.Provider>;
};