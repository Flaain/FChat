import Layout from "@/shared/ui/Layout";
import GuestGuard from "@/shared/ui/GuestGuard";
import { pages } from "@/pages";
import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "@/pages/Auth";

export const router = createBrowserRouter([
    {
        element: (
            <GuestGuard>
                <Layout />
            </GuestGuard>
        ),
        children: pages,
    },
    AuthPage,
]);