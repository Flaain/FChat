import { create } from 'zustand';
import { OtpStore } from './types';
import { otpAPI } from '../api';
import { toast } from 'sonner';

export const useOtp = create<OtpStore>((set, get) => ({
    otp: null!,
    isResending: false,
    onResend: async () => {
        try {
            set({ isResending: true });

            const { otp } = get();
            const { data: { retryDelay } } = await otpAPI.create({ email: otp.targetEmail, type: otp.type });

            set({ otp: { ...otp, retryDelay } });
        } catch (error) {
            console.error(error);
            toast.error('Cannot resend OTP code');
        } finally {
            set({ isResending: false });
        }
    }
}));