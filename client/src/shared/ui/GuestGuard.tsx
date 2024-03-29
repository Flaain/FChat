import { Navigate } from "react-router";
import { routerList } from "../constants";
import { selectSessionSlice } from "@/entities/session/model/slice";
import { useAppSelector } from "../model/hooks";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthInProgress, isAuthorized } = useAppSelector(selectSessionSlice);

    if (isAuthInProgress) return <div>Loading...</div>;

    return isAuthorized ? children : <Navigate to={routerList.AUTH} replace />;
};

export default GuestGuard;
