import React from "react";
import { routerList } from "@/shared/constants";
import { RouteObject } from "react-router-dom";
import { View } from "./model/view";

export const HomePage: RouteObject = {
    path: routerList.HOME,
    element: (
        <React.Suspense fallback={<div>Loading...</div>}>
            <View />
        </React.Suspense>
    ),
};