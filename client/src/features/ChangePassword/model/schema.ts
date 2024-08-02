import { passwordForSchema } from "@/shared/constants";
import { z } from "zod";

export const changePasswordSchema = z.object({
    currentPassword: passwordForSchema,
    newPassword: passwordForSchema
})