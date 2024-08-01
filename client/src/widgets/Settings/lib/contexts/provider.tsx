import React from 'react';
import { PrivacyMenu, SettingMenu } from '../../model/types';
import { SettingsContext } from './context';

export const SettingsProvider = ({ children }: any) => {
    const [currentMenu, setCurrentMenu] = React.useState<SettingMenu>('main');
    
    const prevMenuRef = React.useRef<SettingMenu | null>(null);

    const titles: Record<SettingMenu | PrivacyMenu, string> = {
        main: 'Settings',
        privacy: 'Privacy and Security',
        sessions: 'Active Sessions',
        changePassword: 'Change Password',
        deleteAccount: 'Delete Account'
    };

    const onBack = () => {
        setCurrentMenu(prevMenuRef.current!);
    };

    const onMenuChange = (menu: SettingMenu) => {
        setCurrentMenu(menu);
        prevMenuRef.current = currentMenu;
    };

    const value = React.useMemo(() => ({
        titles,
        currentMenu,
        prevMenuRef,
        onMenuChange,
        onBack
    }), [currentMenu, titles]);

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};