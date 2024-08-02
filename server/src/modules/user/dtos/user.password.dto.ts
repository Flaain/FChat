import { createZodDto } from 'nestjs-zod';
import { passwordForSchema } from 'src/utils/constants';
import { z } from 'zod';

export class UserPasswordDto extends createZodDto(z.strictObject({
    currentPassword: passwordForSchema.optional(),
    newPassword: passwordForSchema.optional()
})) {}
