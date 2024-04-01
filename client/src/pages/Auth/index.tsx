import React from "react";
import AuthGuard from "@/shared/ui/AuthGuard";
import { routerList } from "@/shared/constants";
import { RouteObject } from "react-router-dom";
import { View } from "./model/view";
import { AuthProvider } from "./model/provider";

export const AuthPage: RouteObject = {
    path: routerList.AUTH,
    element: (
        <React.Suspense fallback={<div>Loading AUTH Page...</div>}>
            <AuthGuard>
                <AuthProvider>
                    <View />
                </AuthProvider>
            </AuthGuard>
        </React.Suspense>
    ),
};