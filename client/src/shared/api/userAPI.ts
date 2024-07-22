import { API } from './API';
import { Profile, User } from '../lib/contexts/profile/model/types';
import { SigininSchemaType, SignupSchemaType } from '@/pages/Auth/model/types';
import { SearchUser } from '../model/types';
import { CreateGroupType } from '@/features/CreateGroup/model/types';

export class UserAPI extends API {
    checkEmail = async (body: Pick<SignupSchemaType, 'email'>) => {
        const response = await fetch(this._baseUrl + '/auth/signup/check-email', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        });

        return this._checkResponse<'success'>(response);
    };

    checkName = async (body: Pick<SignupSchemaType, 'name'>) => {
        const response = await fetch(this._baseUrl + '/auth/signup/check-name', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify(body)
        });

        return this._checkResponse<'success'>(response);
    };

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