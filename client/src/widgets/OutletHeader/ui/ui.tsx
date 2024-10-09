import { OutletHeaderProps } from '../model/types';
import { useChat } from '@/shared/lib/providers/chat/context';
import { ChatMode } from '@/shared/lib/providers/chat/types';
import { DefaultState } from './DefaultState';
import { SelectState } from './SelectState';

export const OutletHeader = (props: OutletHeaderProps) => {
    const chatMode = useChat((state) => state.mode);

    const components: Record<ChatMode, React.ReactNode> = {
        default: <DefaultState {...props} />,
        selecting: <SelectState />
    };

    return (
        <div className='flex items-center self-start w-full h-[70px] px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0 z-[999]'>
            {components[chatMode]}
        </div>
    );
};