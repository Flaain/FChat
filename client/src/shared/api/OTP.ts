import { API } from './API';
import { OtpType } from '../model/types';

export class OTP extends API {
    create = async (body: { email: string; type: OtpType }) => {
        const response = await fetch(this._baseUrl + '/auth/otp', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        });

        return this._checkResponse<{ retryDelay: number }>(response);
    };
}