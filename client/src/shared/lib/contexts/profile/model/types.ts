import { Conversation } from "@/shared/model/types";

export interface User {
    _id: string;
    name: string;
    email: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Profile extends User {
    conversations: Array<Conversation>;
}

export interface ProfileContextProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export interface ProfileProviderProps {
    defaultProfile?: Profile;
    children: React.ReactNode;
}