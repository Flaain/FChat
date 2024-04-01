import { Navigate } from "react-router";
import { routerList } from "../constants";
import { useSession } from "@/entities/session/lib/hooks/useSession";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthInProgress, isAuthorized } = useSession();

    if (isAuthInProgress) return <div>Loading...</div>;

    return isAuthorized ? <Navigate to={routerList.HOME} replace /> : children;
};

export default AuthGuard;