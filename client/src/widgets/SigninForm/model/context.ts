import React from 'react';
import { ISigninContext } from './types';

export const SigninContext = React.createContext<ISigninContext>({
    stage: 'signin',
    setStage: () => {}
});

export const useSigninForm = () => React.useContext(SigninContext)