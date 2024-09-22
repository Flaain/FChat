import React from 'react';
import { ISessionContext } from './types';

export const SessionContext = React.createContext<ISessionContext>({
    state: {
        userId: null!,
        isAuthorized: false,
        isAuthInProgress: true
    },
    dispatch: () => {}
});

export const useSession = () => React.useContext(SessionContext);