import React from 'react';
import EmojiPickerFallback from '@emoji-mart/react';
import MessageTopBar from './MessageTopBar';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/Button';
import { Edit2Icon, Paperclip, Reply, SendHorizonal, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { useSendMessage } from '../lib/hooks/useSendMessage';
import { EmojiPicker } from '@/shared/model/view';
import { UseMessageParams } from '../model/types';
import { MessageFormState } from '@/shared/model/types';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';

const SendMessage = ({ type, queryId, onChange }: UseMessageParams) => {
    const {
        handleSubmitMessage,
        onKeyDown,
        onBlur,
        setDefaultState,
        handleChange,
        setIsEmojiPickerOpen,
        onEmojiSelect,
        isEmojiPickerOpen,
        isLoading,
        currentDraft,
        value
    } = useSendMessage({ type, queryId, onChange });
    const { textareaRef } = useLayoutContext();

    const trimmedValueLength = value.trim().length;

    const messageBars: Record<Exclude<MessageFormState, "send">, React.ReactNode> = {
        edit: (
            <MessageTopBar
                title='Edit message'
                mainIconSlot={<Edit2Icon className='dark:text-primary-white text-primary-gray' />}
                onClose={setDefaultState}
                description={currentDraft?.selectedMessage?.text}
                preventClose={isLoading}
            />
        ),
        reply: (
            <MessageTopBar
                title={`Reply to ${currentDraft?.selectedMessage?.sender?.name}`}
                mainIconSlot={<Reply className='dark:text-primary-white text-primary-gray' />}
                onClose={setDefaultState}
                description={currentDraft?.selectedMessage?.text}
                preventClose={isLoading}
            />
        )
    };

    return (
        <div className='flex flex-col sticky bottom-0 w-full'>
            {messageBars[currentDraft?.state as keyof typeof messageBars]}
            <form
                className='w-full max-h-[120px] overflow-hidden flex items-center dark:bg-primary-dark-100 bg-primary-white transition-colors duration-200 ease-in-out box-border'
                onSubmit={handleSubmitMessage}
            >
                <Button
                    variant='text'
                    size='icon'
                    type='button'
                    className='px-4'
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
                    className='overscroll-contain disabled:opacity-50 leading-5 py-[25px] min-h-[70px] scrollbar-hide max-h-[120px] overflow-auto flex box-border w-full transition-colors duration-200 ease-in-out resize-none appearance-none ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none focus:placeholder:opacity-0 focus:placeholder:translate-x-2 outline-none ring-0 placeholder:transition-all placeholder:duration-300 placeholder:ease-in-out dark:bg-primary-dark-100 border-none text-white dark:placeholder:text-white placeholder:opacity-50'
                ></textarea>
                <Button
                    variant='text'
                    type='button'
                    size='icon'
                    disabled={isLoading}
                    className={cn('px-4 transition-transform duration-200 ease-in-out', {
                        'translate-x-10': !trimmedValueLength,
                        'translate-x-0': trimmedValueLength || currentDraft?.state === 'edit'
                    })}
                    onClick={(e) => {e.stopPropagation(); setIsEmojiPickerOpen((prev) => !prev)}}
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
                    size='icon'
                    disabled={(!trimmedValueLength && currentDraft?.state === 'send') || isLoading}
                    className={cn(
                        'px-4 opacity-0 pointer-events-none invisible scale-50 transition-all duration-100 ease-in-out',
                        (!!trimmedValueLength || currentDraft?.state === 'edit') &&
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