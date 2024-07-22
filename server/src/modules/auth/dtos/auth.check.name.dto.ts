import { createZodDto } from 'nestjs-zod';
import { checkNameSchema } from '../schemas/auth.check.name.schema';

export class CheckNameDTO extends createZodDto(checkNameSchema) {}