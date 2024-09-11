import { Navigate } from "react-router";
import { routerList } from "../../shared/constants";
import { useSession } from "@/entities/session/model/store";

const Guard = ({ type, children, fallback }: { type: 'auth' | 'guest'; children: React.ReactNode; fallback?: React.ReactNode }) => {
    const { isAuthInProgress, isAuthorized } = useSession();

    if (isAuthInProgress) return fallback;

    const guards: Record<typeof type, React.ReactNode> = {
        auth: isAuthorized ? <Navigate to={routerList.HOME} replace /> : children,
        guest: isAuthorized ? children : <Navigate to={routerList.AUTH} replace />
    }
    
    return guards[type];
};

export default Guard;