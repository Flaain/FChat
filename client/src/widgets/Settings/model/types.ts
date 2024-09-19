export type MainMenu = 'main' | 'privacy';
export type SettingMenu = 'main' | PrivacyMenu | MyAccountMenu;
export type PrivacyMenu = 'privacy' | 'sessions' | 'changePassword' | 'deleteAccount';
export type MyAccountMenu = 'myAccount' | 'deleteAccount';

export interface SettingsStore {
    currentMenu: SettingMenu;
    onMenuChange: (menu: SettingMenu) => void;
    onBack: () => void;
}

export enum SettingsMenu {
    MAIN = 'main',
    PRIVACY = 'privacy',
    SESSIONS = 'sessions',
    CHANGE_PASSWORD = 'changePassword',
    DELETE_ACCOUNT = 'deleteAccount',
    MY_ACCOUNT = 'myAccount',
}