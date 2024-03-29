import SigninForm from "../SigninForm";
import SignupForm from "../SignupForm";
import { AuthForm } from "../../model/types";
import { selectAuthForm } from "../../model/slice";
import { useAppSelector } from "@/shared/model/hooks";

const FormContainer = () => {
    const form = useAppSelector(selectAuthForm);
    
    const forms: Record<Exclude<AuthForm, "welcome">, React.ReactNode> = {
        signIn: <SigninForm />,
        signUp: <SignupForm />,
    };

    return (
        <section className='w-full h-screen flex items-center justify-center bg-primary-dark-200'>
            {forms[form as keyof typeof forms]}
        </section>
    );
};

export default FormContainer;