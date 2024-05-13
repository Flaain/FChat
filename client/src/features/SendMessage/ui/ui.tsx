import React from 'react';
import EmojiPickerFallback from '@emoji-mart/react';
import MessageTopBar from './MessageTopBar';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/Button';
import { Paperclip, SendHorizonal, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { useSendMessage } from '../lib/hooks/useSendMessage';
import { useEmojiPicker } from '../lib/hooks/useEmojiPicker';
import { useConversationContainer } from '@/widgets/ConversationContainer/lib/hooks/useConversationContainer';
import { EmojiPicker } from '@/shared/model/view';

const SendMessage = () => {
    const { handleSubmitMessage, onKeyDown, handleCloseEdit, handleChange } = useSendMessage();
    const { isOpen, onClickOutside, onEmojiSelect, openEmojiPicker } = useEmojiPicker();
    const {
        state: { messageInputValue, selectedMessageEdit, sendMessageFormStatus }
    } = useConversationContainer();

    const [isMessageInputFocused, setIsMessageInputFocused] = React.useState(false);

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const trimmedValue = messageInputValue.trim().length;

    React.useEffect(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 50)}px`;
    }, [messageInputValue]);

    const messageBars = {
        edit: <MessageTopBar title='Edit message' onClose={handleCloseEdit} description={selectedMessageEdit?.text} />
    };

    return (
        <div className='flex flex-col sticky bottom-0 w-full'>
            {messageBars[sendMessageFormStatus as keyof typeof messageBars]}
            <form
                className={cn(
                    'w-full max-h-[120px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border',
                    isMessageInputFocused && 'dark:bg-primary-dark-150 bg-primary-gray'
                )}
                onSubmit={handleSubmitMessage}
            >
                <Button
                    variant='text'
                    type='button'
                    onClick={() => toast.info('Coming soon!', { position: 'top-center' })}
                >
                    <Paperclip className='w-6 h-6' />
                </Button>
                <textarea
                    rows={1}
                    ref={textareaRef}
                    value={messageInputValue}
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    onFocus={() => setIsMessageInputFocused(true)}
                    onBlur={() => setIsMessageInputFocused(false)}
                    placeholder='Write a message...'
                    className='overscroll-contain py-[24px] leading-5 min-h-[70px] scrollbar-hide max-h-[120px] overflow-auto flex pr-11 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:focus:bg-primary-dark-150 dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                ></textarea>
                <Button
                    variant='text'
                    type='button'
                    className={cn('transition-transform duration-200 ease-in-out', {
                        'translate-x-14': !trimmedValue,
                        'translate-x-0': trimmedValue || sendMessageFormStatus === 'edit'
                    })}
                    onClick={openEmojiPicker}
                >
                    <Smile className='w-6 h-6' />
                </Button>
                {isOpen && (
                    <div className='absolute bottom-20 right-2'>
                        <React.Suspense fallback={<EmojiPickerFallback />}>
                            <EmojiPicker onClickOutside={onClickOutside} onEmojiSelect={onEmojiSelect} />
                        </React.Suspense>
                    </div>
                )}
                <Button
                    variant='text'
                    disabled={!trimmedValue && sendMessageFormStatus === 'send'}
                    className={cn(
                        'opacity-0 pointer-events-none invisible scale-50 transition-all duration-100 ease-in-out',
                        (!!trimmedValue || sendMessageFormStatus === 'edit') &&
                            'opacity-100 visible scale-100 pointer-events-auto'
                    )}
                >
                    <SendHorizonal className='w-6 h-6' />
                </Button>
            </form>
        </div>
    );
};

export default SendMessage;