import { Conversation } from "@/shared/model/types";

export interface Profile {
    id: string;
    username: string;
    email: string;
    conversations: Array<Conversation>;
    createdAt: string;
    updatedAt: string;
}

export interface ProfileContextProps {
    profile: Profile | undefined;
    setProfile: React.Dispatch<React.SetStateAction<Profile | undefined>>;
}

export interface ProfileProviderProps {
    defaultProfile?: Profile;
    children: React.ReactNode;
}