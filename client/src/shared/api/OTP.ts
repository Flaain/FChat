import { API } from './API';
import { OtpType } from '../model/types';

export class OTP extends API {
    create = async ({ email, type }: { email: string; type: OtpType }) => {
        const response = await fetch(this._baseUrl + '/auth/otp', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ email, type })
        });

        return this._checkResponse<{ retryDelay: number }>(response);
    };
}