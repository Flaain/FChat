import { Profile } from "@/shared/model/types";

export interface IProfileContext {
    profile: Profile;
    isUploadingAvatar: boolean;
    handleUploadAvatar: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetStatus: (status: string) => void;
    setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}