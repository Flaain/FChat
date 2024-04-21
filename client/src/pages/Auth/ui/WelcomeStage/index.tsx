import { Button } from "@/shared/ui/Button";
import { useAuth } from "../../lib/hooks/useAuth";

const WelcomeStage = () => {
    const { setAuthStage } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center w-full gap-5">
            <div className='flex flex-col gap-2 items-center'>
                <h1 className='dark:text-white text-white text-6xl font-bold'>FChat</h1>
                <p className='dark:text-white opacity-50 text-slate-400'>What's up?</p>
            </div>
            <div className='max-w-[320px] w-full flex flex-col gap-3'>
                <Button onClick={() => setAuthStage("signUp")}>Create new account</Button>
                <Button variant='secondary' onClick={() => setAuthStage("signIn")}>
                    Sign in
                </Button>
            </div>
        </div>
    );
};

export default WelcomeStage;