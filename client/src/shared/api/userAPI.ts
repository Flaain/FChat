import { APIMethodParams, WithRequired } from "../model/types";
import { API } from "./API";

export class UserAPI extends API {
    constructor() {
        super({ baseUrl: import.meta.env.VITE_BASE_URL, headers: { "Content-Type": "application/json" } });
    }

    checkEmailBeforeSignup = async ({ body }: WithRequired<APIMethodParams, "body">) => {
        const response = await fetch(this._baseUrl + "/auth/signup/check-email", {
            method: "POST",
            headers: this._headers,
            body,
        });

        return this._checkResponse<"success">(response);
    };
}
