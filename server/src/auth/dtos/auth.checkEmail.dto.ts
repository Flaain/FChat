import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { emailForSchema } from 'src/utils/constants';

export class CheckEmailDTO extends createZodDto(z.object({ email: emailForSchema })) {}