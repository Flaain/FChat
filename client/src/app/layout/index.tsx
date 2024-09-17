import { Guard } from '../model/Guard';
import { ScreenLoader } from '@/shared/ui/ScreenLoader';
import { Layout } from '@/shared/ui/Layout';

export const baseLayout = (
    <Guard type='guest' fallback={<ScreenLoader />}>
        <Layout />
    </Guard>
);