import React from "react";
import { cn } from "@/shared/lib/utils/cn";
import { Button } from "@/shared/ui/Button";
import { Paperclip, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { api } from "@/shared/api";
import { isApiError } from "@/shared/lib/utils/isApiError";
import { Conversation } from "@/shared/model/types";

const SendMessage = ({
    conversationId,
    setConversation,
}: {
    conversationId: string;
    setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}) => {
    const {
        state: { accessToken },
    } = useSession();

    const [isMessageInputFocused, setIsMessageInputFocused] = React.useState(false);
    const [messageInputValue, setMessageInputValue] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey && "form" in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    };

    const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            if (!messageInputValue.trim().length) {
                setMessageInputValue("");
                return;
            }

            const { data } = await api.message.send({
                token: accessToken!,
                body: { message: messageInputValue, conversationId },
            });

            setConversation((prev) => ({...prev!, messages: [...prev!.messages, data]}));
            setMessageInputValue("");
        } catch (error) {
            console.error(error);
            isApiError(error) && toast.error(error.message, { position: "top-center" });
        }
    };

    return (
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
                    onChange={({ target: { value } }) => setMessageInputValue(value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => setIsMessageInputFocused(true)}
                    onBlur={() => setIsMessageInputFocused(false)}
                    placeholder='Write a message...'
                    className='h-[50px] flex py-3 pl-1 pr-11 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:focus:bg-primary-dark-150 dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                ></textarea>
                <Button
                    variant='text'
                    disabled={!messageInputValue.trim().length || loading}
                    className={cn(
                        "opacity-0 pointer-events-none invisible scale-50 transition-all duration-100 ease-in-out",
                        !!messageInputValue.trim().length && "opacity-100 visible scale-100 pointer-events-auto"
                    )}
                >
                    <SendHorizonal className='w-6 h-6' />
                </Button>
            </div>
        </form>
    );
};

export default SendMessage;