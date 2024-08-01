export type MainMenu = 'main' | 'privacy';
export type SettingMenu = 'main' | PrivacyMenu;
export type PrivacyMenu = 'privacy' | 'sessions' | 'changePassword' | 'deleteAccount';

export interface SettingsContextProps {
    titles: Record<SettingMenu | PrivacyMenu, string>;
    currentMenu: SettingMenu;
    onMenuChange: (menu: SettingMenu) => void;
    onBack: () => void;
}