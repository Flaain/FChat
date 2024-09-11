import Layout from '@/shared/ui/Layout';
import ScreenLoader from '@/shared/ui/ScreenLoader';
import Providers from '../providers';
import Guard from './Guard';

export const baseLayout = (
    <Guard type='guest' fallback={<ScreenLoader />}>
        <Providers>
            <Layout />
        </Providers>
    </Guard>
);