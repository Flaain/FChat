import React from 'react';
import EmojiPickerFallback from '@emoji-mart/react';
import MessageTopBar from './MessageTopBar';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/Button';
import { Paperclip, SendHorizonal, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { useSendMessage } from '../lib/hooks/useSendMessage';
import { EmojiPicker } from '@/shared/model/view';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { UseMessageParams } from '../model/types';

const SendMessage = ({ type, queryId }: UseMessageParams) => {
    const { drafts } = useLayoutContext();
    const {
        handleSubmitMessage,
        onKeyDown,
        onBlur,
        getDefaultState,
        handleChange,
        setIsEmojiPickerOpen,
        onEmojiSelect,
        isEmojiPickerOpen,
        isLoading,
        textareaRef,
        value
    } = useSendMessage({ type, queryId });

    const draft = drafts.get(queryId);
    const trimmedValue = value.trim().length;

    const messageBars = {
        edit: (
            <MessageTopBar
                title='Edit message'
                onClose={getDefaultState}
                description={draft?.selectedMessage?.text}
                preventClose={isLoading}
            />
        )
    };

    return (
        <div className='flex flex-col sticky bottom-0 w-full'>
            {messageBars[draft?.state as keyof typeof messageBars]}
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
                    onBlur={onBlur}
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
                        'translate-x-0': trimmedValue || draft?.state === 'edit'
                    })}
                    onClick={() => setIsEmojiPickerOpen((prevState) => !prevState)}
                >
                    <Smile className='w-6 h-6' />
                </Button>
                {isEmojiPickerOpen && (
                    <div className='absolute bottom-20 right-2'>
                        <React.Suspense fallback={<EmojiPickerFallback />}>
                            <EmojiPicker
                                onClickOutside={() => setIsEmojiPickerOpen(false)}
                                onEmojiSelect={onEmojiSelect}
                            />
                        </React.Suspense>
                    </div>
                )}
                <Button
                    variant='text'
                    disabled={(!trimmedValue && draft?.state === 'send') || isLoading}
                    className={cn(
                        'opacity-0 pointer-events-none invisible scale-50 transition-all duration-100 ease-in-out',
                        (!!trimmedValue || draft?.state === 'edit') &&
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