import { z } from 'zod';
import { signinSchema, signupSchema } from './schema';
import React from 'react';

export type AuthStage = 'welcome' | 'signIn' | 'signUp';
export type SignupSchemaType = z.infer<typeof signupSchema>;
export type SigininSchemaType = z.infer<typeof signinSchema>;

export interface AuthContextProps {
    authStage: AuthStage;
    setAuthStage: React.Dispatch<React.SetStateAction<AuthStage>>;
}

export interface AuthProviderProps {
    defaultStage?: AuthStage;
    children: React.ReactNode;
}

export interface OtpState {
    resource: 'signup' | 'signin';
    retryDelay: number;
    type: 'email_verification' | 'password_reset';
}

export interface OTPContextProps {
    otp: OtpState;
    setOtp: React.Dispatch<React.SetStateAction<OtpState>>
}

export interface ProviderProps {
    children: React.ReactNode;
    authStage?: AuthProviderProps;
}