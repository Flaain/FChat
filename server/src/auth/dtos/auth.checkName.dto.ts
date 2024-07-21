import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { allowCyrillicRegExp, nameForSchema } from 'src/utils/constants';

export class CheckNameDTO extends createZodDto(z.object({ name: nameForSchema.regex(allowCyrillicRegExp) })) {}