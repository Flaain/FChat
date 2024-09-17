import { Profile } from "@/shared/model/types";

export interface ProfileStore {
    profile: Profile;
    getProfile: () => Promise<void>;
    setProfile: (profile: Partial<Profile>) => void;
    destroy: () => void;
}