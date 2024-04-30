import Layout from "@/shared/ui/Layout";
import GuestGuard from "@/shared/ui/GuestGuard";
import ScreenLoader from "@/shared/ui/ScreenLoader";
import { ModalProvider } from "@/shared/lib/contexts/modal/provider";

export const baseLayout = (
    <GuestGuard fallback={<ScreenLoader />}>
        <ModalProvider>
            <Layout />
        </ModalProvider>
    </GuestGuard>
);