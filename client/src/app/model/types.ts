export enum GUARD_TYPE {
    AUTH = 'auth',
    GUEST = 'guest'
}

export interface GuardProps {
    type: GUARD_TYPE;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}