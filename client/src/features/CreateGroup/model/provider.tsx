import { useCreateGroup } from '../lib/hooks/useCreateGroup';
import { CreateGroupContext } from './context';

export const CreateGroupProvider = ({ children }: { children: React.ReactNode }) => (
    <CreateGroupContext.Provider value={useCreateGroup()}>{children}</CreateGroupContext.Provider>
);