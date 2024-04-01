import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/ui/ui";

import Providers, { ProvidersProps } from "./providers";
import { getTheme } from "./shared/lib/utils/getTheme";
import "./app/styles/index.css";

const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

(() => {
    const providerProps: Omit<ProvidersProps, "children"> = {
        theme: { defaultTheme: getTheme() },
        profile: { defaultProfile: undefined },
        session: { defaultIsAuthInProgress: true },
    };

    root.render(
        <React.StrictMode>
            <Providers {...providerProps}>
                <App />
            </Providers>
        </React.StrictMode>
    );
})();