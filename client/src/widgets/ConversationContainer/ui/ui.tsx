import SendMessage from "@/features/SendMessage/ui/ui";
import Typography from "@/shared/ui/Typography";
import MessagesList from "@/widgets/MessagesList/ui/ui";
import { Button } from "@/shared/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ConversationContainerProps } from "../model/types";

const ConversationContainer = ({ conversation, setConversation, info }: ConversationContainerProps) => {
    const navigate = useNavigate();

    return (
        <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white'>
            <div className='flex items-center mb-auto self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0'>
                <Button variant='text' className='px-0 mr-5' onClick={() => navigate(-1)}>
                    <ArrowLeft className='w-5 h-5' />
                </Button>
                <div className='flex flex-col items-start'>
                    <Typography as='h2' size='lg' weight='medium' variant='primary'>
                        {info.conversationName}
                    </Typography>
                    <Typography as='p' variant='secondary'>
                        last seen yesterday at 10:00
                    </Typography>
                </div>
            </div>
            <MessagesList messages={conversation.messages} />
            <SendMessage conversationId={conversation._id} setConversation={setConversation} />
        </div>
    );
};

export default ConversationContainer;