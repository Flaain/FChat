import React from "react";
import Message from "@/entities/Message/ui/ui";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";

const MessagesList = () => {
    const { conversation: { messages } } = useConversationContext();

    const messageRef = React.useRef<HTMLLIElement>(null);

    React.useEffect(() => {
        if (!messageRef.current) return;

        messageRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <ul className='flex flex-col overflow-auto h-full w-full px-5 gap-10'>
            {messages.map((message, index, array) => (
                <Message key={message._id} message={message} ref={index === array.length - 1 ? messageRef : null} />
            ))}
        </ul>
    );
};

export default MessagesList;