import React from 'react';
import { ISignupContext } from './types';

export const SignupContext = React.createContext<ISignupContext>({
    form: null!,
    isLastStep: false,
    loading: false,
    step: 0,
    isNextButtonDisabled: true,
    onBack: () => {},
    onSubmit: () => {}
});

export const useSignup = () => React.useContext(SignupContext);