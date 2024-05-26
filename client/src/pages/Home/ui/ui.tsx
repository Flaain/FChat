import Typography from '@/shared/ui/Typography';
import CreateChatContainer from '@/widgets/CreateChatContainer/ui/ui';
import { Button } from '@/shared/ui/Button';
import { useProfile } from '@/shared/lib/hooks/useProfile';
import { LucideMessagesSquare } from 'lucide-react';
import { useModal } from '@/shared/lib/hooks/useModal';
import { CreateChatContainerProvider } from '@/widgets/CreateChatContainer/model/provider';

const Home = () => {
    const {
        profile: { conversations }
    } = useProfile();
    const { openModal } = useModal();
    return (
        <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white px-2'>
            {conversations.length ? (
                <Typography as='h1' variant='primary' size='2xl' weight='bold'>
                    Select a chat to start messaging
                </Typography>
            ) : (
                <Typography as='h1' variant='primary' size='2xl' weight='bold' align='center' className='max-w-[500px]'>
                    You don't have any conversations yet.&nbsp;
                    <Button
                        onClick={() =>
                            openModal({
                                title: 'Select mode',
                                size: 'fitHeight',
                                content: (
                                    <CreateChatContainerProvider>
                                        <CreateChatContainer />
                                    </CreateChatContainerProvider>
                                )
                            })
                        }
                        variant='text'
                        size='text'
                        className='text-2xl font-bold underline uppercase'
                    >
                        create
                    </Button>
                    &nbsp; your first conversation!
                </Typography>
            )}
            <LucideMessagesSquare className='w-32 h-32 dark:text-primary-white text-primary-dark-200' />
        </div>
    );
};

export default Home;