import { SigninStages } from '@/features/Signin/model/types';

export const stageDescription: Record<SigninStages, { title: string; description: string }> = {
    signin: {
        title: 'Sign in',
        description: 'Enter your email or login and password'
    },
    forgot: {
        title: 'Forgot password',
        description: "Let's get your password reset!"
    }
};