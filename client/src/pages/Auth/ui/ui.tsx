import SignupForm from '@/widgets/SignupForm/ui/ui';
import { SigninForm } from '@/widgets/SigninForm/ui/ui';
import { Toaster } from 'sonner';
import { useAuth } from '../model/context';
import { Welcome } from './Welcome';
import { SigninFormProvider } from '@/widgets/SigninForm/model/context';

const stages = {
    welcome: <Welcome />,
    signIn: (
        <SigninFormProvider>
            <SigninForm />
        </SigninFormProvider>
    ),
    signUp: <SignupForm />
};

export const Auth = () => {
    const authStage = useAuth((state) => state.authStage);

    return (
        <section className='w-full h-screen flex items-center px-5 justify-center bg-primary-dark-200'>
            <Toaster />
            {stages[authStage as keyof typeof stages]}
        </section>
    );
};