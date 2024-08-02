import { z } from "zod";
import { changePasswordSchema } from "./schema";

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>