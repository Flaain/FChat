import { API } from './API';
import { Profile, User } from '../lib/contexts/profile/model/types';
import { SigininSchemaType, SignupSchemaType } from '@/pages/Auth/model/types';
import { SearchUser, UserCheckParams } from '../model/types';
import { CreateGroupType } from '@/features/CreateGroup/model/types';

export class UserAPI extends API {
    check = async (body: UserCheckParams) => {
        const url = new URL(this._baseUrl + '/user/check');

        Object.entries(body).forEach(([key, value]) => {
            url.searchParams.append(key, value.trim());
        })

        const response = await fetch(url, { headers: this._headers });

        return this._checkResponse<{ status: number; message: string }>(response);
    }

    signup = async (body: Omit<SignupSchemaType, 'confirmPassword'>) => {
        const response = await fetch(this._baseUrl + '/auth/signup', {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        });

        return this._checkResponse<User>(response);
    };

    signin = async (body: SigininSchemaType) => {
        const response = await fetch(this._baseUrl + '/auth/signin', {
            method: 'POST',
            headers: this._headers,
            credentials: this._cretedentials,
            body: JSON.stringify(body)
        });

        return this._checkResponse<User>(response);
    };

    profile = async () => {
        const response = await fetch(this._baseUrl + '/auth/me', {
            headers: this._headers,
            credentials: this._cretedentials
        });

        return this._checkResponse<Profile>(response);
    };

    search = async ({ username }: Pick<CreateGroupType, 'username'>) => {
        const response = await fetch(this._baseUrl + `/user?name=${username}`, {
            headers: this._headers,
            credentials: this._cretedentials
        });

        return this._checkResponse<Array<SearchUser>>(response);
    };
}