import Typography from "@/shared/ui/Typography";
import { useModal } from "@/shared/lib/hooks/useModal";
import { Button } from "@/shared/ui/Button";
import { useProfile } from "@/shared/lib/hooks/useProfile";
import { LucideMessagesSquare } from "lucide-react";
import CreateConversation from "@/features/CreateConversation/ui/ui";

const Home = () => {
    const { openModal } = useModal();
    const { profile: { conversations } } = useProfile();

    return (
        <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white'>
            {conversations.length ? (
                <Typography as='h1' variant='primary' size='2xl' weight='bold'>
                    Select or&nbsp;
                    <Button
                        onClick={() =>
                            openModal({
                                title: "New conversation",
                                content: <CreateConversation />,
                                size: "fitHeight",
                            })
                        }
                        variant='text'
                        size='text'
                        className='text-2xl font-bold underline uppercase'
                    >
                        create
                    </Button>
                    &nbsp;a conversation
                </Typography>
            ) : (
                <Typography as='h1' variant='primary' size='2xl' weight='bold' align='center' className='max-w-[600px]'>
                    Seems like you don't have any conversations yet.&nbsp;
                    <Button
                        onClick={() =>
                            openModal({
                                title: "New conversation",
                                content: <CreateConversation />,
                                size: "fitHeight",
                            })
                        }
                        variant='text'
                        size='text'
                        className='text-2xl font-bold underline uppercase'
                    >
                        create
                    </Button>
                    &nbsp;your first conversation!
                </Typography>
            )}
            <LucideMessagesSquare className='w-32 h-32 dark:text-primary-white text-primary-dark-200' />
        </div>
    );
};

export default Home;