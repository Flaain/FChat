import React from 'react';
import { ISettingsContext } from './types';

export const SettingsContext = React.createContext<ISettingsContext>({
    menu: 'main',
    onBack: () => {},
    onMenuChange: () => {}
});

export const useSettings = () => React.useContext(SettingsContext);