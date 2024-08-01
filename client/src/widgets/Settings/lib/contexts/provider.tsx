import React from 'react';
import { PrivacyMenu, SettingMenu } from '../../model/types';
import { SettingsContext } from './context';

const prevMenu: Record<SettingMenu | PrivacyMenu, SettingMenu | PrivacyMenu> = {
    main: 'main',
    privacy: 'main',
    sessions: 'privacy',
    changePassword: 'privacy',
    deleteAccount: 'privacy'
}

export const SettingsProvider = ({ children }: any) => {
    const [currentMenu, setCurrentMenu] = React.useState<SettingMenu>('main');
    
    const titles: Record<SettingMenu | PrivacyMenu, string> = {
        main: 'Settings',
        privacy: 'Privacy and Security',
        sessions: 'Active Sessions',
        changePassword: 'Change Password',
        deleteAccount: 'Delete Account'
    };

    const onBack = () => {
        setCurrentMenu(prevMenu[currentMenu]);
    };

    const onMenuChange = (menu: SettingMenu) => {
        setCurrentMenu(menu);
    };

    const value = React.useMemo(() => ({
        titles,
        currentMenu,
        onMenuChange,
        onBack
    }), [currentMenu, titles]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};