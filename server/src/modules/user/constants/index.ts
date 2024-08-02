import { IAppException } from "src/utils/types";

export const incorrectPasswordError: Pick<IAppException, 'message' | 'errors'> = {
    message: 'Incorrect password',
    errors: [{ path: 'currentPassword', message: 'Incorrect password' }],
};