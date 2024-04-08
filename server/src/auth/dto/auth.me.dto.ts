import { createZodDto } from 'nestjs-zod';
import { meRequestSchema } from '../schemas/auth.me.schema';

export class MeDTO extends createZodDto(meRequestSchema) {}