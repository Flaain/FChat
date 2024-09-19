import { FieldPath } from "react-hook-form";
import { ForgotSchemaType } from "./types";

export const buttonTitles = {
    0: 'Send email',
    2: "Reset"
}

export const steps: Array<{ fields: Array<FieldPath<ForgotSchemaType>> }> = [
    { fields: ['email'] },
    { fields: ['otp'] },
    { fields: ['password', 'confirmPassword'] }
];