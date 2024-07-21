import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/ui/ui";

import Providers, { ProvidersProps } from "./providers";
import { getTheme } from "./shared/lib/utils/getTheme";
import "./app/styles/index.css";

const providerProps: Omit<ProvidersProps, "children"> = {
    theme: { defaultTheme: getTheme() },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Providers {...providerProps}>
            <App />
        </Providers>
    </React.StrictMode>
);