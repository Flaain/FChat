import { API } from "@/shared/api/API";
import { OtpType } from "../model/types";

class OTP extends API {
    create = async (body: { email: string; type: OtpType }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        };

        return this._checkResponse<{ retryDelay: number }>(await fetch(this._baseUrl + '/auth/otp', request), request);
    };

    verify = async (body: { otp: string; email: string; type: OtpType }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        };

        return this._checkResponse<boolean>(await fetch(this._baseUrl + '/auth/otp/verify', request), request);
    };
}

export const otpAPI = new OTP();