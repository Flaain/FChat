import React from 'react';
import { IEventsContext } from './types';

export const EventsContext = React.createContext<IEventsContext>({
    listeners: new Map(),
    addEventListener: () => () => {}
});

export const useEvents = () => React.useContext(EventsContext)