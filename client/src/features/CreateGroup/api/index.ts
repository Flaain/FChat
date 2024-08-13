import { API } from '@/shared/api/API';
import { CreateGroupParams, ICreateGroupAPI } from '../model/types';

export class CreateGroupAPI extends API implements ICreateGroupAPI {
    create = async (params: CreateGroupParams) => {
        const request: RequestInit = {
            method: 'POST',
            credentials: this._cretedentials,
            headers: this._headers,
            body: JSON.stringify(params)
        };

        return this._checkResponse<{ _id: string }>(await fetch(`${this._baseUrl}/group/create`, request), request);
    };
}

export const createGroupAPI = new CreateGroupAPI();