import { z } from "zod";

export const conversationSearchSchema = z.object({ name: z.string() })