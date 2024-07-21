import { API } from './API';
import { APIMethodParams, OtpType, WithRequired } from '../model/types';

export class OTP extends API {
    create = async ({ body }: WithRequired<APIMethodParams<{ email: string; type: OtpType }>, 'body'>) => {
        const response = await fetch(this._baseUrl + '/auth/otp', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        });

        return this._checkResponse<{ retryDelay: number }>(response);
    };
}