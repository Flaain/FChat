import { ParsedSession } from "@/shared/model/types";

export interface SessionStore {
    userId: string;
    isAuthorized: boolean;
    isAuthInProgress: boolean;
    onAuth: (userId: string) => void;
    onLogout: () => void;
}

export interface Session {
    _id: string;
    userAgent: ParsedSession;
    createdAt: string;
    expiresAt: string;
}

export interface SessionProps {
    session: Session;
    withDropButton?: boolean;
    dropButtonDisabled?: boolean;
    onDrop?: (session: Session) => void;
}