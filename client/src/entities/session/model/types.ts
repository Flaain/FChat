import { Profile } from "@/shared/model/types";

export interface SessionSliceState extends Profile {
    isAuthorized: boolean;
    isAuthInProgress: boolean;
    accessToken?: string;
}