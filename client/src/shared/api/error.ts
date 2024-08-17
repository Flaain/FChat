import { ExternalToast, toast } from 'sonner';
import { AppExceptionCode, IAppException } from '../model/types';

export class AppException extends Error implements IAppException {
    public url: string;
    public timestamp: Date;
    public errorCode?: AppExceptionCode;
    public headers: Record<string, string>;
    public statusCode: number;
    public errors?: Array<{ path: string; message: string }>;

    constructor(error: IAppException) {
        super(error.message);

        this.url = error.url;
        this.timestamp = error.timestamp;
        this.errorCode = error.errorCode;
        this.errors = error.errors;
        this.headers = error.headers;
        this.statusCode = error.statusCode;
    }

    toastError(message?: string, options: ExternalToast = { position: 'top-center' }) {
        toast.error(message || this.message || 'Something went wrong', options);
    }
}