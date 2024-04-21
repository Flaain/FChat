import { SigininSchema, SignupSchema } from "@/pages/Auth/model/types";
import { Profile } from "../lib/contexts/profile/model/types";
import { APIMethodParams, AuthResponse, WithRequired } from "../model/types";
import { API } from "./API";

export class UserAPI extends API {
    checkEmailBeforeSignup = async ({ body }: WithRequired<APIMethodParams<Pick<SignupSchema, "email">>, "body">) => {
        const response = await fetch(this._baseUrl + "/auth/signup/check-email", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(body),
        });

        return this._checkResponse<"success">(response);
    };

    signup = async ({ body }: WithRequired<APIMethodParams<Omit<SignupSchema, "confirmPassword">>, "body">) => {
        const response = await fetch(this._baseUrl + "/auth/signup", {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(body),
        });

        return this._checkResponse<AuthResponse>(response);
    };

    signin = async ({ body }: WithRequired<APIMethodParams<SigininSchema>, "body">) => {
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
}