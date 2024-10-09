import { FieldPath } from "react-hook-form";
import { ChangePasswordSchemaType } from "./types";

export const steps: Array<{ fields: Array<FieldPath<ChangePasswordSchemaType>> }> = [
    { fields: ['currentPassword'] },
    { fields: ['newPassword'] }
];