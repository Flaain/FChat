import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { Conversation } from "@/shared/model/types";
import Typography from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Container = ({ conversation }: { conversation: Conversation }) => {
    const {
        state: { userId },
    } = useSession();

    const filteredParticipants = React.useMemo(
        () => conversation.participants.filter((participant) => participant._id !== userId),
        [conversation, userId]
    );
    const isGroup = filteredParticipants.length >= 2;
    const conversationName = React.useMemo(
        () => (isGroup ? conversation.name : filteredParticipants.map((participant) => participant.name).join(", ")),
        [conversation.name, filteredParticipants, isGroup]
    );

    const navigate = useNavigate();

    return (
        <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white'>
            <div className='flex items-center mb-auto self-start w-full px-8 py-5 box-border dark:bg-primary-dark-100'>
                <Button variant='text' className='px-0 mr-5' onClick={() => navigate(-1)}>
                    <ArrowLeft className='w-5 h-5' />
                </Button>
                <div className='flex flex-col items-start'>
                    <Typography size='lg' weight='medium' variant='primary'>
                        {conversationName}
                    </Typography>
                    <Typography as='p' variant='secondary'>
                        last seen yesterday at 10:00
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default Container;
