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
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    const { handleSubmitMessage, onKeyDown, handleCloseEdit, handleChange, isLoading } = useSendMessage();
    const { isOpen, onClickOutside, onEmojiSelect, openEmojiPicker } = useEmojiPicker(textareaRef);
    const { state: { value, selectedMessage, formState } } = useConversationContainer();

    const trimmedValue = value.trim().length;

    React.useEffect(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 50)}px`;
    }, [value]);

    const messageBars = {
        edit: (
            <MessageTopBar
                title='Edit message'
                onClose={handleCloseEdit}
                description={selectedMessage?.text}
                preventClose={isLoading}
            />
        )
    };

    return (
        <div className='flex flex-col sticky bottom-0 w-full'>
            {messageBars[formState as keyof typeof messageBars]}
            <form
                className='w-full max-h-[120px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'
                onSubmit={handleSubmitMessage}
            >
                <Button
                    variant='text'
                    type='button'
                    disabled={isLoading}
                    onClick={() => toast.info('Coming soon!', { position: 'top-center' })}
                >
                    <Paperclip className='w-6 h-6' />
                </Button>
                <textarea
                    rows={1}
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    disabled={isLoading}
                    onKeyDown={onKeyDown}
                    placeholder='Write a message...'
                    className='overscroll-contain py-[24px] disabled:opacity-50 leading-5 min-h-[70px] scrollbar-hide max-h-[120px] overflow-auto flex pr-11 box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                ></textarea>
                <Button
                    variant='text'
                    type='button'
                    disabled={isLoading}
                    className={cn('transition-transform duration-200 ease-in-out', {
                        'translate-x-14': !trimmedValue,
                        'translate-x-0': trimmedValue || formState === 'edit'
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
                    disabled={(!trimmedValue && formState === 'send') || isLoading}
                    className={cn(
                        'opacity-0 pointer-events-none invisible scale-50 transition-all duration-100 ease-in-out',
                        (!!trimmedValue || formState === 'edit') && 'opacity-100 visible scale-100 pointer-events-auto'
                    )}
                >
                    <SendHorizonal className='w-6 h-6' />
                </Button>
            </form>
        </div>
    );
};

export default SendMessage;