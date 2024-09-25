import { Navigate } from 'react-router';
import { routerList } from '../../shared/constants';
import { useSession } from '@/entities/session/model/context';
import { GUARD_TYPE, GuardProps } from './types';

export const Guard = ({ type, children, fallback }: GuardProps) => {
    const { state: { isAuthInProgress, isAuthorized } } = useSession();

    if (isAuthInProgress) return fallback;

    const guards: Record<GUARD_TYPE, React.ReactNode> = {
        auth: isAuthorized ? <Navigate to={routerList.HOME} replace /> : children,
        guest: isAuthorized ? children : <Navigate to={routerList.AUTH} replace />
    };

    return guards[type];
};