import { z } from "zod";
import { forgotSchema } from "./schema";

export type ForgotSchemaType = z.infer<typeof forgotSchema>;