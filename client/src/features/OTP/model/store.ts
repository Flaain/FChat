import { create } from 'zustand';
import { OtpStore } from './types';
import { toast } from 'sonner';
import { otpAPI } from '../api';

export const useOtp = create<OtpStore>((set, get) => ({
    otp: null!,
    isResending: false,
    onResend: async () => {
        try {
            set({ isResending: true });

            const { otp } = get();
            const { data: { retryDelay } } = await otpAPI.create({ email: otp.targetEmail, type: otp.type });

            set((prevState) => ({ otp: { ...prevState.otp, retryDelay } }));
        } catch (error) {
            console.error(error);
            toast.error('Cannot resend OTP code');
        } finally {
            set({ isResending: false });
        }
    },
    setOtp: (otp) => set((prevState) => ({ otp: { ...prevState.otp, ...otp } }))
}));