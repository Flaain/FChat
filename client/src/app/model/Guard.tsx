import { Navigate } from 'react-router';
import { routerList } from '../../shared/constants';
import { GUARD_TYPE, GuardProps } from './types';
import { useSession } from '@/entities/session';
import { useShallow } from 'zustand/shallow';

export const Guard = ({ type, children, fallback }: GuardProps) => {
    const { isAuthInProgress, isAuthorized } = useSession(useShallow((state) => ({
        isAuthInProgress: state.isAuthInProgress,
        isAuthorized: state.isAuthorized
    })));

    if (isAuthInProgress) return fallback;

    const guards: Record<GUARD_TYPE, React.ReactNode> = {
        auth: isAuthorized ? <Navigate to={routerList.HOME} replace /> : children,
        guest: isAuthorized ? children : <Navigate to={routerList.AUTH} replace />
    };

    return guards[type];
};