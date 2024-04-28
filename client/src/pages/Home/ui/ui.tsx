import Typography from "@/shared/ui/Typography";
import CreateConversationForm from "@/widgets/CreateConversationForm/ui/ui";
import { useModal } from "@/shared/lib/hooks/useModal";
import { getImageUrl } from "@/shared/lib/utils/getImageUrl";
import { Button } from "@/shared/ui/Button";

const Home = () => {
    const { openModal } = useModal();

    return (
        <div className='flex flex-col flex-1 items-center justify-center dark:bg-dark-conversation-panel bg-primary-white'>
            <Typography as="h1" variant='primary' size='2xl' weight='bold'>
                Select or&nbsp;
                <Button
                    onClick={() => openModal({ title: "New conversation", content: <CreateConversationForm /> })}
                    variant='text'
                    size='text'
                    className='text-2xl font-bold underline uppercase'
                >
                    create
                </Button>
                &nbsp;a conversation
            </Typography>
            <img src={getImageUrl("chat.svg")} alt='chat icon' />
        </div>
    );
};

export default Home;