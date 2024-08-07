import Typography from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { useAuth } from "../../lib/hooks/useAuth";

const WelcomeStage = () => {
    const { setAuthStage } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center w-full gap-5 px-4">
            <div className='flex flex-col gap-2 items-center'>
                <Typography variant="primary" as="h1" size="6xl" weight="bold" className="max-lg:text-6xl max-md:text-6xl">FChat</Typography>
                <Typography variant="secondary" as="p" size="lg" className="max-lg:text-lg max-md:text-lg">What's up?</Typography>
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