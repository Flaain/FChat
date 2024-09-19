import { PrivacyMenu, SettingMenu, SettingsMenu } from "./types";

export const prevMenu: Record<Exclude<SettingMenu | PrivacyMenu, 'main'>, SettingMenu | PrivacyMenu> = {
    privacy: SettingsMenu.MAIN,
    sessions: SettingsMenu.PRIVACY,
    changePassword: SettingsMenu.PRIVACY,
    deleteAccount: SettingsMenu.PRIVACY,
    myAccount: SettingsMenu.MAIN
}

export const titles: Record<SettingMenu | PrivacyMenu, string> = {
    main: 'Settings',
    privacy: 'Privacy and Security',
    sessions: 'Active Sessions',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    myAccount: 'Info'
};