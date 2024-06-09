export interface User {
    _id: string;
    name: string;
    email: string;
    status?: string;
    isVerified?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DataWithCursor<T> {
    data: T,
    nextCursor: string | null;
}

export interface Profile extends User {
}

export interface ProfileContextProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export interface ProfileProviderProps {
    defaultProfile?: Profile;
    children: React.ReactNode;
}