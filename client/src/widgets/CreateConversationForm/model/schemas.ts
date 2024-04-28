import { nameForSchema } from "@/shared/constants";
import { z } from "zod";

export const searchSchema = z.object({ name: nameForSchema });