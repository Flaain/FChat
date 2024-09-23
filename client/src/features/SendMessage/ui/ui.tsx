import React from 'react';
import EmojiPickerFallback from '@emoji-mart/react';
import { MessageTopBar } from './MessageTopBar';
import { Button } from '@/shared/ui/Button';
import { ArrowDown, Edit2Icon, Paperclip, Reply, SendHorizonal, Smile } from 'lucide-react';
import { toast } from 'sonner';
import { useSendMessage } from '../lib/useSendMessage';
import { EmojiPicker } from '@/shared/model/view';
import { UseMessageParams } from '../model/types';
import { MessageFormState } from '@/shared/model/types';
import { useLayout } from '@/shared/lib/providers/layout/context';

export const SendMessage = ({ params, onChange, showAnchor, onAnchorClick }: UseMessageParams) => {
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
        value
    } = useSendMessage({ params, onChange });
    const { drafts, textareaRef } = useLayout();

    const currentDraft = drafts.get(params.id);

    const messageBars: Record<Exclude<MessageFormState, 'send'>, React.ReactNode> = {
        edit: (
            <MessageTopBar
                title='Edit message'
                mainIconSlot={<Edit2Icon className='dark:text-primary-white text-primary-gray min-w-5 h-5' />}
                onClose={setDefaultState}
                description={currentDraft?.selectedMessage?.text}
                preventClose={isLoading}
            />
        ),
        reply: (
            <MessageTopBar
                title={`Reply to ${currentDraft?.selectedMessage?.sender?.name}`}
                mainIconSlot={<Reply className='dark:text-primary-white text-primary-gray min-w-5 h-5' />}
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
                    className='px-5'
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
                {showAnchor && (
                    <Button
                        onClick={onAnchorClick}
                        disabled={!showAnchor}
                        variant='text'
                        type='button'
                        size='icon'
                        className='pl-4'
                    >
                        <ArrowDown className='w-6 h-6' />
                    </Button>
                )}
                <Button
                    variant='text'
                    type='button'
                    size='icon'
                    disabled={isLoading}
                    className='px-4'
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEmojiPickerOpen((prev) => !prev);
                    }}
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
                    type='submit'
                    disabled={!value.trim().length && currentDraft?.state !== 'edit' || isLoading}
                    className='pr-5'
                >
                    <SendHorizonal className='w-6 h-6' />
                </Button>
            </form>
        </div>
    );
};