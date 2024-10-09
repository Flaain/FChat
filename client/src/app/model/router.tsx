import { Guard } from './Guard';
import { pages } from '@/pages';
import { createBrowserRouter } from 'react-router-dom';
import { AuthPage } from '@/pages/Auth';
import { baseLayout } from '../layout';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';

export const router = createBrowserRouter([
    { element: baseLayout, children: pages },
    {
        ...AuthPage,
        element: (
            <Guard type='auth' fallback={<ScreenLoader />}>
                {AuthPage.element}
            </Guard>
        )
    }
]);