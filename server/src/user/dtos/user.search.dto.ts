import { createZodDto } from "nestjs-zod";
import { userSearchSchema } from "../schemas/user.search.schema";

export class UserSearchDto extends createZodDto(userSearchSchema) {}