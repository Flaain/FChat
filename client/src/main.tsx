import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/model/router';
import { Providers } from './app/model/providers';

import './app/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Providers>
            <RouterProvider router={router} />
        </Providers>
    </React.StrictMode>
);