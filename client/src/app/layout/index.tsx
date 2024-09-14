import Guard from "../model/Guard";
import Providers from "@/shared/lib/providers";
import ScreenLoader from "@/shared/ui/ScreenLoader";
import { Layout } from "lucide-react";
import { GUARD_TYPE } from "../model/types";

export const baseLayout = (
    <Guard type={GUARD_TYPE.GUEST} fallback={<ScreenLoader />}>
        <Providers>
            <Layout />
        </Providers>
    </Guard>
);