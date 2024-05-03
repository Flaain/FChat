import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { emailForSchema } from 'src/utils/constants';
import { signinRequestSchema } from '../schemas/auth.signin.schema';

export class SigninDTO extends createZodDto(signinRequestSchema) {}