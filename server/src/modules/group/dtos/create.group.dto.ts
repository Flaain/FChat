import { createZodDto } from "nestjs-zod";
import { createGroupSchema } from "../schemas/create.group.schema";

export class CreateGroupDTO extends createZodDto(createGroupSchema) {}