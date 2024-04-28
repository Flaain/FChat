import Layout from "@/shared/ui/Layout";
import GuestGuard from "@/shared/ui/GuestGuard";
import { Loader2Icon } from "lucide-react";
import { ModalProvider } from "@/shared/lib/contexts/modal/provider";

export const baseLayout = (
    <GuestGuard
        fallback={
            <div className='h-screen flex items-center justify-center dark:text-primary-white text-primary-dark-100 dark:bg-primary-dark-200 bg-white'>
                <Loader2Icon className='w-10 h-10 animate-loading' />
            </div>
        }
    >
        <ModalProvider>
            <Layout />
        </ModalProvider>
    </GuestGuard>
);