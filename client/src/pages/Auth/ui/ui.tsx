import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import WelcomeStage from './WelcomeStage';
import { Toaster } from 'sonner';
import { useAuth } from '../lib/hooks/useAuth';

const stages = {
    welcome: <WelcomeStage />,
    signIn: <SigninForm />,
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