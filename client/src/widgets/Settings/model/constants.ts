import { PrivacyMenu, SettingMenu } from "./types";

export const prevMenu: Record<Exclude<SettingMenu | PrivacyMenu, 'main'>, SettingMenu | PrivacyMenu> = {
    privacy: 'main',
    sessions: 'privacy',
    changePassword: 'privacy',
    deleteAccount: 'privacy',
    myAccount: 'main'
}

export const titles: Record<SettingMenu | PrivacyMenu, string> = {
    main: 'Settings',
    privacy: 'Privacy and Security',
    sessions: 'Active Sessions',
    changePassword: 'Change Password',
    deleteAccount: 'Delete Account',
    myAccount: 'Info'
};