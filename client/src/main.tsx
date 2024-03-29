import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/ui/ui";

import { Provider } from "react-redux";
import { store } from "./app/model/store";
import { ThemeProvider } from "./entities/theme/lib/provider";

import "./app/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);