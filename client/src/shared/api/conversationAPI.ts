import { APIMethodParams, Conversation, WithRequired } from "../model/types";
import { API } from "./API";

export class ConversationAPI extends API {
    create = async ({
        body,
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ participants: Array<string>; name?: string }>, "body" | "token">) => {
        const response = await fetch(this._baseUrl + "/conversation/create", {
            method: "POST",
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
            ...rest,
        });

        return this._checkResponse<Conversation>(response);
    };
}
