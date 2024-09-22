import { SignupForm, SignupProvider } from '@/widgets/SignupForm';
import { SigninForm, SigninProvider } from '@/widgets/SigninForm';
import { Toaster } from 'sonner';
import { Welcome } from './Welcome';
import { useAuth } from '../model/context';

const stages = {
    welcome: <Welcome />,
    signIn: (
        <SigninProvider>
            <SigninForm />
        </SigninProvider>
    ),
    signUp: (
        <SignupProvider>
            <SignupForm />
        </SignupProvider>
    )
};

export const Auth = () => {
    const { authStage } = useAuth();

    return (
        <section className='w-full h-screen flex items-center px-5 justify-center bg-primary-dark-200'>
            <Toaster />
            {stages[authStage as keyof typeof stages]}
        </section>
    );
};