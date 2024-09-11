import Guard from './Guard';
import { pages } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';
import { AuthPage } from '@/pages/Auth';
import { baseLayout } from './layout';

export const router = createBrowserRouter([
    { element: baseLayout, children: pages },
    { ...AuthPage, element: <Guard type='auth'>{AuthPage.element}</Guard> }
]);