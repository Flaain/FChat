import React from 'react';
import { useTheme } from '..';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useTheme();

    React.useLayoutEffect(() => {
        const root = window.document.documentElement;

        root.classList.add(theme);

        return () => {
            root.classList.remove('light', 'dark');
        };
    }, [theme]);

    return children;
};