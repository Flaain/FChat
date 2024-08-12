import { API } from "@/shared/api/API";
import { OtpType } from "@/shared/lib/contexts/otp/types";

export class OTP extends API {
    create = async (body: { email: string; type: OtpType }) => {
        const request: RequestInit = {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        };

        return this._checkResponse<{ retryDelay: number }>(await fetch(this._baseUrl + '/auth/otp', request), request);
    };
}