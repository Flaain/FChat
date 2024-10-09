import Group from './ui/ui';
import { OutletError } from '@/shared/ui/OutletError';
import { routerList } from '@/shared/constants';
import { RouteObject } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export const GroupPage: RouteObject = {
    path: routerList.GROUP,
    element: <Group />,
    errorElement: (
        <OutletError
            title='Failed to load group'
            description='Please try to refresh the page'
            callToAction={<Button className='mt-3' onClick={() => window.location.reload()}>Refresh page</Button>}
        />
    )
};