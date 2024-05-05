import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { Conversation } from "@/shared/model/types";
import Typography from "@/shared/ui/Typography";
import { Button } from "@/shared/ui/Button";
import { ArrowLeft, Check, CheckCheck, Paperclip, SendHorizonal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/lib/utils/cn";
import AvatarByName from "@/shared/ui/AvatarByName";
import { toast } from "sonner";

const Container = ({ conversation }: { conversation: Conversation }) => {
    const {
        state: { userId },
    } = useSession();

    const listRef = React.useRef<HTMLUListElement>(null);

    const [isMessageInputFocused, setIsMessageInputFocused] = React.useState(false);
    const [messageInputValue, setMessageInputValue] = React.useState("");

    const filteredParticipants = React.useMemo(
        () => conversation.participants.filter((participant) => participant._id !== userId),
        [conversation, userId]
    );
    const isGroup = filteredParticipants.length >= 2;
    const conversationName = React.useMemo(
        () =>
            isGroup
                ? conversation.name ?? filteredParticipants.map((participant) => participant.name).join(", ")
                : filteredParticipants[0].name,
        [conversation.name, filteredParticipants, isGroup]
    );

    React.useEffect(() => {
        if (!listRef.current) return;

        listRef.current.scrollIntoView({ behavior: "instant", block: "end" });
    }, []);

    const navigate = useNavigate();

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey && "form" in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    };

    const onSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!messageInputValue.trim().length) {
            setMessageInputValue("");
            return
        }

        console.log(messageInputValue);
    };

    return (
        <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white'>
            <div className='flex items-center mb-auto self-start w-full px-5 py-3 box-border dark:bg-primary-dark-100 sticky top-0'>
                <Button variant='text' className='px-0 mr-5' onClick={() => navigate(-1)}>
                    <ArrowLeft className='w-5 h-5' />
                </Button>
                <div className='flex flex-col items-start'>
                    <Typography as='h2' size='lg' weight='medium' variant='primary'>
                        {conversationName}
                    </Typography>
                    <Typography as='p' variant='secondary'>
                        last seen yesterday at 10:00
                    </Typography>
                </div>
            </div>
            <ul className='flex flex-col overflow-auto h-full w-full px-5 gap-10' ref={listRef}>
                {conversation.messages.map((message) => {
                    const isMessageFromMe = message.sender._id === userId;

                    return (
                        <li
                            key={message._id}
                            className={cn("flex items-center gap-5", {
                                "self-end": isMessageFromMe,
                                "self-start": !isMessageFromMe,
                            })}
                        >
                            {!isMessageFromMe && <AvatarByName name={message.sender.name} className='self-end' />}
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-5'>
                                    {!isMessageFromMe && (
                                        <Typography as='h3' variant='primary' weight='medium'>
                                            {message.sender.name}
                                        </Typography>
                                    )}
                                    <Typography className='self-end ml-auto' variant='secondary'>
                                        {new Date(message.createdAt).toLocaleTimeString(navigator.language, {
                                            hour: "numeric",
                                            minute: "numeric",
                                        })}
                                    </Typography>
                                </div>
                                <Typography
                                    as='p'
                                    className={cn("px-5 py-1 rounded-xl mt-2 max-w-[500px] flex items-end gap-4", {
                                        "dark:bg-primary-dark-50 bg-primary-white dark:text-primary-white":
                                            !isMessageFromMe,
                                        "dark:bg-primary-white dark:text-primary-dark-200": isMessageFromMe,
                                    })}
                                >
                                    {message.text}
                                    <Typography>
                                        {message.hasBeenRead ? (
                                            <CheckCheck
                                                className={cn("w-4 h-4", {
                                                    "dark:text-primary-white text-primary-dark-200 w-4 h-4":
                                                        !isMessageFromMe,
                                                    "dark:text-primary-dark-200 text-primary-white w-4 h-4":
                                                        isMessageFromMe,
                                                })}
                                            />
                                        ) : (
                                            <Check
                                                className={cn("w-4 h-4", {
                                                    "dark:text-primary-white text-primary-dark-200 w-4 h-4":
                                                        !isMessageFromMe,
                                                    "dark:text-primary-dark-200 text-primary-white w-4 h-4":
                                                        isMessageFromMe,
                                                })}
                                            />
                                        )}
                                    </Typography>
                                </Typography>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <form className='w-full sticky bottom-0 max-h-[70px] box-border' onSubmit={onSendMessage}>
                <div
                    className={cn(
                        "flex items-center h-full dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out py-3 box-border",
                        isMessageInputFocused && "dark:bg-primary-dark-150 bg-primary-gray"
                    )}
                >
                    <Button
                        variant='text'
                        type='button'
                        onClick={() => toast.info("Coming soon!", { position: "top-center" })}
                    >
                        <Paperclip className='w-6 h-6' />
                    </Button>
                    <textarea
                        value={messageInputValue}
                        onChange={(e) => setMessageInputValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        onFocus={() => setIsMessageInputFocused(true)}
                        onBlur={() => setIsMessageInputFocused(false)}
                        placeholder='Write a message...'
                        className='h-[50px] flex py-3 pl-1 pr-11 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 outline-none ring-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:focus:bg-primary-dark-150 dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                    ></textarea>
                    {!!messageInputValue.trim().length && (
                        <Button variant='text'>
                            <SendHorizonal className='w-6 h-6' />
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Container;