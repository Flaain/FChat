import React from 'react';
import { PrivacyMenu, SettingMenu, SettingsMenu } from '../../model/types';
import { SettingsContext } from './context';

const prevMenu: Record<Exclude<SettingMenu | PrivacyMenu, 'main'>, SettingMenu | PrivacyMenu> = {
    privacy: SettingsMenu.MAIN,
    sessions: SettingsMenu.PRIVACY,
    changePassword: SettingsMenu.PRIVACY,
    deleteAccount: SettingsMenu.PRIVACY
}

export const titles: Record<SettingMenu | PrivacyMenu, string> = {
    main: 'Settings',
    privacy: 'Privacy and Security',
    sessions: 'Active Sessions',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account'
};

export const SettingsProvider = ({ children }: any) => {
    const [currentMenu, setCurrentMenu] = React.useState<SettingMenu>('main');

    const onBack = () => {
        setCurrentMenu(prevMenu[currentMenu as keyof typeof prevMenu]);
    };

    const onMenuChange = (menu: SettingMenu) => {
        setCurrentMenu(menu);
    };

    const value = React.useMemo(() => ({
        currentMenu,
        onMenuChange,
        onBack
    }), [currentMenu]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};