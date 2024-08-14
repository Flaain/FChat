export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset'
}

export interface OtpState {
    retryDelay: number;
    type: OtpType;
}

export interface OtpContextProps {
    otp: OtpState;
    isResending: boolean;
    setOtp: React.Dispatch<React.SetStateAction<OtpState>>;
    onResend: (params: OnResendParams) => void;
}

export interface OnResendParams {
    email: string;
    type?: OtpType;
}