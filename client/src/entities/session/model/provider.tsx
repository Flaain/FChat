import React from 'react';
import { SessionContext } from './context';
import { sessionReducer } from './reducer';
import { SessionAction, SessionState } from './types';

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = React.useReducer<React.Reducer<SessionState, SessionAction>>(sessionReducer, {
        isAuthInProgress: true,
        isAuthorized: false,
        userId: null!
    });

    return <SessionContext.Provider value={{ state, dispatch }}>{children}</SessionContext.Provider>;
};