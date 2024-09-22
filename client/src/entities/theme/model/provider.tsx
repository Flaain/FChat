import React from 'react';
import { getTheme } from '../lib/getTheme';
import { Theme } from './types';
import { ThemeContext } from './context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState<Theme>(getTheme());

    React.useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.add(theme);

        return () => {
            root.classList.remove('light', 'dark');
        };
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};