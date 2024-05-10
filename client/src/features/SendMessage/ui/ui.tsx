import Typography from "@/shared/ui/Typography";
import { cn } from "@/shared/lib/utils/cn";
import { Button } from "@/shared/ui/Button";
import { Edit2Icon, Paperclip, SendHorizonal, X } from "lucide-react";
import { toast } from "sonner";
import { ContainerConversationTypes } from "@/widgets/ConversationContainer/model/types";
import { useSendMessage } from "../lib/hooks/useSendMessage";

const SendMessage = () => {
    const {
        handleSubmitMessage,
        onKeyDown,
        handleCloseEdit,
        setIsMessageInputFocused,
        dispatch,
        isMessageInputFocused,
        loading,
        messageInputValue,
        sendMessageFormStatus,
        selectedMessageEdit,
    } = useSendMessage();

    return (
        <div className='flex flex-col sticky bottom-0 w-full'>
            {sendMessageFormStatus === "edit" && (
                <div className='border-b border-solid dark:border-primary-dark-50 border-primary-gray w-full flex items-center h-full dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out py-3 px-4 gap-4 box-border'>
                    <Edit2Icon className='dark:text-primary-white text-primary-gray' />
                    <div className='flex flex-col'>
                        <Typography as='p' size='md' weight='medium' variant='primary'>
                            Edit message
                        </Typography>
                        <Typography as='p' variant='secondary'>
                            {selectedMessageEdit!.text}
                        </Typography>
                    </div>
                    <Button variant='text' className='ml-auto pr-0' onClick={handleCloseEdit}>
                        <X className='w-6 h-6' />
                    </Button>
                </div>
            )}
            <form className='w-full max-h-[70px] box-border' onSubmit={handleSubmitMessage}>
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
                        onChange={({ target: { value } }) => dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value } })}
                        onKeyDown={onKeyDown}
                        onFocus={() => setIsMessageInputFocused(true)}
                        onBlur={() => setIsMessageInputFocused(false)}
                        placeholder='Write a message...'
                        className='h-[50px] flex py-3 pl-1 pr-11 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:focus:bg-primary-dark-150 dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                    ></textarea>
                    <Button
                        variant='text'
                        disabled={(!messageInputValue.trim().length && sendMessageFormStatus === "send") || loading}
                        className={cn(
                            "opacity-0 pointer-events-none invisible scale-50 transition-all duration-100 ease-in-out",
                            (!!messageInputValue.trim().length || sendMessageFormStatus === "edit") && "opacity-100 visible scale-100 pointer-events-auto"
                        )}
                    >
                        <SendHorizonal className='w-6 h-6' />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SendMessage;