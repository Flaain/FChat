import { Profile } from "@/shared/model/types";

export interface ProfileStore {
    profile: Profile;
    isUploadingAvatar: boolean;
    getProfile: () => Promise<void>;
    setProfile: (profile: Partial<Profile>) => void;
    handleUploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleChangeStatus: (value: string) => void;
    destroy: () => void;
}