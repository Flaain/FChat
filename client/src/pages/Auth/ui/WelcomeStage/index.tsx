import { Button } from "@/shared/ui/Button";
import { useAuth } from "../../lib/hooks/useAuth";

const WelcomeStage = () => {
    const { setAuthStage } = useAuth();

    return (
        <section className='w-full h-screen flex flex-col gap-8 items-center justify-center bg-primary-dark-200'>
            <div className='flex flex-col gap-2 items-center'>
                <h1 className='dark:text-white text-white text-6xl font-bold'>FChat</h1>
                <p className='dark:text-slate-400 text-slate-400'>What's up?</p>
            </div>
            <div className='max-w-[320px] w-full flex flex-col gap-3'>
                <Button onClick={() => setAuthStage("signUp")}>Create new account</Button>
                <Button variant='secondary' onClick={() => setAuthStage("signIn")}>
                    Sign in
                </Button>
            </div>
        </section>
    );
};

export default WelcomeStage;