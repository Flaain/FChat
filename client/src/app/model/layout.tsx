import Layout from '@/shared/ui/Layout';
import GuestGuard from '@/shared/ui/GuestGuard';
import ScreenLoader from '@/shared/ui/ScreenLoader';
import { LayoutProvider } from '@/shared/lib/contexts/layout/provider';

export const baseLayout = (
    <GuestGuard fallback={<ScreenLoader />}>
        <LayoutProvider>
            <Layout />
        </LayoutProvider>
    </GuestGuard>
);
