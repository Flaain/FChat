import { z } from "zod";
import { createConversationSchema } from "./schemas";

export type CreateConversationType = z.infer<typeof createConversationSchema>;