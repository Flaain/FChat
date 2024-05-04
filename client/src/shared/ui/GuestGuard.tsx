import { Navigate } from "react-router";
import { routerList } from "../constants";
import { useSession } from "@/entities/session/lib/hooks/useSession";

const GuestGuard = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
    const { state: { isAuthInProgress, isAuthorized } } = useSession();

    if (isAuthInProgress) return fallback 

    return isAuthorized ? children : <Navigate to={routerList.AUTH} replace />;
};

export default GuestGuard;