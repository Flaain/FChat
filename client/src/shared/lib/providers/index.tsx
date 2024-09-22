import React from 'react';
import { EventsProvider } from './events';
import { SessionProvider } from '@/entities/session';
import { ProfileProvider } from '@/entities/profile';
import { ThemeProvider } from '@/entities/theme/model/provider';

export const Providers = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
        <SessionProvider>
            <ProfileProvider>
                <EventsProvider>{children}</EventsProvider>
            </ProfileProvider>
        </SessionProvider>
    </ThemeProvider>
);