import { Navigate } from "react-router";
import { routerList } from "../constants";
import { useSession } from "@/entities/session/lib/hooks/useSession";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { state: { isAuthInProgress, isAuthorized } } = useSession();

    if (isAuthInProgress) return <div className="h-screen dark:text-primary-white text-primary-dark-100 dark:bg-primary-dark-200 bg-white">Loading...</div>;

    return isAuthorized ? <Navigate to={routerList.HOME} replace /> : children;
};

export default AuthGuard;