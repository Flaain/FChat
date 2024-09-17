export type GUARD_TYPE = 'auth' | 'guest';

export interface GuardProps {
    type: GUARD_TYPE;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}