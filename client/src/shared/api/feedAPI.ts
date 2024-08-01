import { ConversationFeed, GroupFeed } from '../model/types';
import { API } from './API';

export class FeedAPI extends API {
    get = async () => {
        const request: RequestInit = {
            headers: this._headers,
            credentials: this._cretedentials
        };

        return this._checkResponse<{ feed: Array<ConversationFeed | GroupFeed>; nextCursor: string | null }>(
            await fetch(this._baseUrl + '/feed', request),
            request
        );
    };
}