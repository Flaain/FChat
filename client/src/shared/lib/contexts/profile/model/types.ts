import { Conversation } from "@/shared/model/types";

export interface Profile {
    _id: string;
    username: string;
    email: string;
    conversations: Array<Conversation>;
    createdAt: string;
    updatedAt: string;
}

export interface ProfileContextProps {
    profile: Profile;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export interface ProfileProviderProps {
    defaultProfile?: Profile;
    children: React.ReactNode;
}