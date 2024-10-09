import React from "react";
import { ScreenLoader } from "@/shared/ui/ScreenLoader";
import { routerList } from "@/shared/constants";
import { RouteObject } from "react-router-dom";
import { View } from "./model/view";

export const HomePage: RouteObject = {
    path: routerList.HOME,
    element: (
        <React.Suspense fallback={<ScreenLoader />}>
            <View />
        </React.Suspense>
    ),
};