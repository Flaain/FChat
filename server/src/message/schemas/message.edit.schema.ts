import { messageDeleteSchema } from './message.delete.schema';
import { messageForSchema } from 'src/utils/constants';

export const messageEditSchema = messageDeleteSchema.extend({
    message: messageForSchema,
});