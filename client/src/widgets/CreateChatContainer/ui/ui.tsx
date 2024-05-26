import ChooseMode from '@/features/ChooseMode/ui/ui';
import CreateGroup from '@/features/CreateGroup/ui/ui';
import CreateConversation from '@/features/CreateConversation/ui/ui';
import { CreateChatType } from '../model/types';
import { useCreateChatContainer } from '../lib/hooks/useCreateChatContainer';

const forms: Record<CreateChatType, React.ReactNode> = {
    group: <CreateGroup />,
    choose: <ChooseMode />,
    private: <CreateConversation />
};

const CreateChatContainer = () => {
    const { type } = useCreateChatContainer();

    return forms[type];
};

export default CreateChatContainer;