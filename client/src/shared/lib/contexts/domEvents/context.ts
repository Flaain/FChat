import React from 'react';
import { DomEventsContextProps } from './types';

export const DomEventsContext = React.createContext<DomEventsContextProps>({
    addEventListener: () => () => {},
    removeEventListener: () => {}
});