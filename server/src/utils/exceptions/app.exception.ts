import { HttpStatus } from '@nestjs/common';
import { AppExceptionCode, IAppException } from '../types';

export class AppException extends Error implements IAppException {
    public url?: string;
    public timestamp?: Date;
    public errorCode?: AppExceptionCode;
    public errors?: Array<{ path: string; message: string }>;

    constructor(error: IAppException, public statusCode: HttpStatus) {
        super(error.message);
        
        Object.assign(this, error);
    }
}