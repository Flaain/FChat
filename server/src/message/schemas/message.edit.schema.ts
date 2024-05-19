import { z } from 'zod';
import { messageForSchema } from 'src/utils/constants';

export const messageEditSchema = z.object({ message: messageForSchema });