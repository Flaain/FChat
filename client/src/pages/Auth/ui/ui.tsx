import SigninForm from '@/widgets/SigninForm/ui/ui';
import SignupForm from '@/widgets/SignupForm/ui/ui';
import WelcomeStage from '@/widgets/WelcomeStage/ui/ui';
import { useAuth } from '@/shared/lib/hooks/useAuth';
import { Toaster } from 'sonner';
import { SigninProvider } from '@/widgets/SigninForm/model/provider';

const stages = {
    welcome: <WelcomeStage />,
    signIn: (
        <SigninProvider>
            <SigninForm />
        </SigninProvider>
    ),
    signUp: <SignupForm />
};

const Auth = () => {
    const { authStage } = useAuth();

    return (
        <section className='w-full h-screen flex items-center px-5 justify-center bg-primary-dark-200'>
            <Toaster />
            {stages[authStage as keyof typeof stages]}
        </section>
    );
};

export default Auth;
