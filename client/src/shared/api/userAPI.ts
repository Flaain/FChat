import { API } from "./API";
import { Profile } from "../lib/contexts/profile/model/types";
import { SigininSchemaType, SignupSchemaType } from "@/pages/Auth/model/types";
import { APIMethodParams, AuthResponse, SearchUser, WithRequired } from "../model/types";
import { CreateGroupType } from "@/features/CreateGroup/model/types";

export class UserAPI extends API {
    checkEmailBeforeSignup = async ({ body }: WithRequired<APIMethodParams<Pick<SignupSchemaType, "email">>, "body">) => {
        const response = await fetch(this._baseUrl + "/auth/signup/check-email", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(body),
        });

        return this._checkResponse<"success">(response);
    };

    signup = async ({ body }: WithRequired<APIMethodParams<Omit<SignupSchemaType, "confirmPassword">>, "body">) => {
        const response = await fetch(this._baseUrl + "/auth/signup", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(body),
        });

        return this._checkResponse<AuthResponse>(response);
    };

    signin = async ({ body }: WithRequired<APIMethodParams<SigininSchemaType>, "body">) => {
        const response = await fetch(this._baseUrl + "/auth/signin", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(body),
        });

        return this._checkResponse<AuthResponse>(response);
    };

    profile = async ({ token, ...rest }: WithRequired<APIMethodParams, "token">) => {
        const response = await fetch(this._baseUrl + "/auth/me", {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest,
        });

        return this._checkResponse<Profile>(response);
    };

    search = async ({
        token,
        body: { username },
        ...rest
    }: WithRequired<APIMethodParams<Pick<CreateGroupType, "username">>, "token" | "body">) => {
        const response = await fetch(this._baseUrl + `/user?name=${username}`, {
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            ...rest,
        });

        return this._checkResponse<Array<SearchUser>>(response);
    };
}