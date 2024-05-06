import { APIMethodParams, Message, WithRequired } from "../model/types";
import { API } from "./API";

export class MessageAPI extends API {
    send = async ({
        body,
        token,
        ...rest
    }: WithRequired<APIMethodParams<{ message: string; conversationId: string }>, "body" | "token">) => {
        const response = await fetch(this._baseUrl + `/message/send/${body.conversationId}`, {
            method: "POST",
            headers: { ...this._headers, Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
            ...rest,
        });

        return this._checkResponse<Message>(response);
    };
}