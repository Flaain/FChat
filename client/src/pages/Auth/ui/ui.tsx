import { useAuth } from "../lib/hooks/useAuth";
import FormContainer from "./FormContainer";
import WelcomeStage from "./WelcomeStage";

const Auth = () => {
    const { authStage } = useAuth();

    return authStage === "welcome" ? <WelcomeStage /> : <FormContainer />;
};

export default Auth;