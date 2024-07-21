import React from 'react';
import { z } from 'zod';
import { signinSchema, signupSchema } from './schema';
import { OtpType } from '@/shared/model/types';
import { UseFormReturn } from 'react-hook-form';

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
    retryDelay: number;
    type: OtpType;
}

export interface OTPContextProps {
    otp: OtpState;
    setOtp: React.Dispatch<React.SetStateAction<OtpState>>
}

export interface ProviderProps {
    children: React.ReactNode;
    authStage?: AuthProviderProps;
}

export interface OtpProps {
    onComplete: () => void;
    loading?: boolean;
    form: UseFormReturn<SignupSchemaType>;
}