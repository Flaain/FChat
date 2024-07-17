import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const defaultBody = {
            path: ctx.getRequest().url,
            timestamp: new Date().toISOString(),
        };

        if (exception instanceof AppException) {
            const responseBody = {
                ...defaultBody,
                message: exception.message,
                errorCode: exception.errorCode,
                statusCode: exception.statusCode,
            };

            return httpAdapter.reply(ctx.getResponse(), responseBody, exception.statusCode);
        }

        const responseBody = {
            ...defaultBody,
            message: typeof exception === 'object' && 'message' in exception ? exception.message : 'Internal server error',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
