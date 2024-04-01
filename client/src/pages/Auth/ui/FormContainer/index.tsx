import SigninForm from "../SigninForm";
import SignupForm from "../SignupForm";
import { AuthStage } from "../../model/types";
import { useAuth } from "../../lib/hooks/useAuth";

const stages: Record<Exclude<AuthStage, "welcome">, React.ReactNode> = {
    signIn: <SigninForm />,
    signUp: <SignupForm />,
};

const FormContainer = () => {
    const { authStage } = useAuth();

    return (
        <section className='w-full h-screen flex items-center justify-center bg-primary-dark-200'>
            {stages[authStage as keyof typeof stages]}
        </section>
    );
};

export default FormContainer;