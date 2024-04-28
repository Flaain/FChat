import { z } from "zod";
import { searchSchema } from "./schemas";

export type CreateConversationFormType = z.infer<typeof searchSchema>;