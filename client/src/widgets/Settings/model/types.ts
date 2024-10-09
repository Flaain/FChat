export type MainMenu = 'main' | 'privacy';
export type SettingMenu = 'main' | PrivacyMenu | MyAccountMenu;
export type PrivacyMenu = 'privacy' | 'sessions' | 'changePassword' | 'deleteAccount';
export type MyAccountMenu = 'myAccount' | 'deleteAccount';

export interface SettingsStore {
    menu: SettingMenu;
    actions: {
        onMenuChange: (menu: SettingMenu) => void;
        onBack: () => void;
    }
}