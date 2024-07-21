import { IAppException } from 'src/utils/types';

export const cannotCreateOtpError: Pick<IAppException, 'message'> = {
    message: 'Cannot create OTP',
};