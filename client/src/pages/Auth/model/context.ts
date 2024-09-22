import React from 'react';
import { IAuthContext } from './types';

export const AuthContext = React.createContext<IAuthContext>({
    authStage: 'welcome',
    changeAuthStage: () => {}
});

export const useAuth = () => React.useContext(AuthContext);