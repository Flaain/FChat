import { Navigate } from "react-router";
import { routerList } from "../constants";
import { useSession } from "@/entities/session/lib/hooks/useSession";

const AuthGuard = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
    const { state: { isAuthInProgress, isAuthorized } } = useSession();

    if (isAuthInProgress) return fallback

    return isAuthorized ? <Navigate to={routerList.HOME} replace /> : children;
};

export default AuthGuard;
