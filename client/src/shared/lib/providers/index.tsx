import React from 'react';
import { EventsProvider } from './events';
import { ProfileProvider } from '@/entities/profile';
import { ThemeProvider } from '@/entities/theme/model/provider';

export const Providers = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
        <ProfileProvider>
            <EventsProvider>{children}</EventsProvider>
        </ProfileProvider>
    </ThemeProvider>
);