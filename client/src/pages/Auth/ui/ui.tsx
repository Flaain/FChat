import FormContainer from "./FormContainer";
import { Button } from "@/shared/ui/Button";
import { selectAuthForm, setAuthForm } from "../model/slice";
import { useAppDispatch, useAppSelector } from "@/shared/model/hooks";

const Auth = () => {
    const form = useAppSelector(selectAuthForm);

    const dispatch = useAppDispatch();

    return form === "welcome" ? (
        <section className='w-full h-screen flex flex-col gap-8 items-center justify-center bg-primary-dark-200'>
            <div className='flex flex-col gap-2 items-center'>
                <h1 className='dark:text-white text-white text-6xl font-bold'>FChat</h1>
                <p className='dark:text-slate-400 text-slate-400'>What's up?</p>
            </div>
            <div className='max-w-[320px] w-full flex flex-col gap-3'>
                <Button onClick={() => dispatch(setAuthForm("signUp"))}>Create new account</Button>
                <Button variant='secondary' onClick={() => dispatch(setAuthForm("signIn"))}>
                    Sign in
                </Button>
            </div>
        </section>
    ) : (
        <FormContainer />
    );
};

export default Auth;