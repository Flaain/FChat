export enum OtpType {
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset'
}

export interface OtpState {
    value: string;
    retryDelay: number;
    type: OtpType;
    error: string | null;
}

export interface OtpContextProps {
    otp: OtpState;
    isResending: boolean;
    setOtp: React.Dispatch<React.SetStateAction<OtpState>>;
    onResend: (params: OnResendParams) => void;
    onChange: (value: string) => void;
}

export interface OnResendParams {
    email: string;
    type?: OtpType;
}