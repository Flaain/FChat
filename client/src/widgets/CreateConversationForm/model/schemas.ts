import { nameForSchema } from "@/shared/constants";
import { z } from "zod";

export const createConversationSchema = z.object({ username: nameForSchema, conversationName: nameForSchema.optional() });