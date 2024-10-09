import { z } from "zod";
import { changePasswordSchema } from "./schema";

export enum ActionPasswordType {
    SET = 'set',
    CHECK = 'check'
}

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
export type UserPasswordParams =
    | { type: ActionPasswordType.SET; currentPassword: string; newPassword: string }
    | { type: ActionPasswordType.CHECK; currentPassword: string };