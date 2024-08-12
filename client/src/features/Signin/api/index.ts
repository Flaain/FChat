import { API } from "@/shared/api/API";
import { ISigninAPI, SigininSchemaType } from "../model/types";
import { User } from "@/shared/lib/contexts/profile/types";

export class SigninAPI extends API implements ISigninAPI {
    signin = async (body: SigininSchemaType) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        };

        return this._checkResponse<User>(await fetch(this._baseUrl + '/auth/signin', request), request);
    };
}

export const api = new SigninAPI();