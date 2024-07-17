import { HttpStatus } from '@nestjs/common';
import { AppExceptionCode } from '../types';

export class AppException extends Error {
    constructor(
        public message: string,
        public statusCode: HttpStatus,
        public errorCode?: AppExceptionCode,
    ) {
        super(message);
    }
}