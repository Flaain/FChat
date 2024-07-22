export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
}

export interface OtpDocument {
    email: string;
    otp: string;
    type: OtpType;
    expiresAt?: Date;
    createdAt?: Date;
}