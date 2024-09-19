import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/ui/ui';
import { Providers } from './shared/lib/providers';

import './app/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Providers>
            <App />
        </Providers>
    </React.StrictMode>
);