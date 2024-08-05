import { z } from 'zod';
import { emailForSchema } from 'src/utils/constants';
import { OtpType } from '../types';

export const OtpCreateSchema = z.object({
    email: emailForSchema,
    type: z.enum([OtpType.EMAIL_VERIFICATION, OtpType.PASSWORD_RESET, OtpType.PASSWORD_CHANGE, OtpType.EMAIL_CHANGE]),
});