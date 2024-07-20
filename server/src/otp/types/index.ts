export enum OTPType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}

export interface OTPDocument {
    email: string;
    otp: string;
    type: OTPType;
    expiresAt?: Date;
    createdAt?: Date;
}