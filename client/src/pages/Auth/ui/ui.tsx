import { Toaster } from "sonner";
import { useAuth } from "../lib/hooks/useAuth";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import WelcomeStage from "./WelcomeStage";

const stages = {
    welcome: <WelcomeStage />,
    signIn: <SigninForm />,
    signUp: <SignupForm />,
};

const Auth = () => {
    const { authStage } = useAuth();

    return (
        <section className='w-full h-screen flex items-center justify-center bg-primary-dark-200'>
            <Toaster />
            {stages[authStage as keyof typeof stages]}
        </section>
    );
};

export default Auth;