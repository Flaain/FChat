import { API } from "@/shared/api/API";
import { BasicAPIResponse } from "@/shared/model/types";

export class ForgotAPI extends API {
    forgot = async (body: { email: string }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        };

        return this._checkResponse<{ retryDelay: number }>(await fetch(`${this._baseUrl}/auth/password/forgot`, request), request);
    }

    reset = async (body: { email: string, otp: string, password: string }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        };
        
        return this._checkResponse<BasicAPIResponse>(await fetch(`${this._baseUrl}/auth/reset`, request), request);
    }
}

export const forgotAPI = new ForgotAPI();