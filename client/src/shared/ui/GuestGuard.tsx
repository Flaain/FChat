import { Navigate } from "react-router";
import { routerList } from "../constants";
import { useSession } from "@/entities/session/lib/hooks/useSession";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthInProgress, isAuthorized } = useSession();

    if (isAuthInProgress) return <div>Loading...</div>;

    return isAuthorized ? children : <Navigate to={routerList.AUTH} replace />;
};

export default GuestGuard;