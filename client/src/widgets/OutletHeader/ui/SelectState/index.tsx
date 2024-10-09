import { messageAPI } from "@/entities/Message";
import { useChat } from "@/shared/lib/providers/chat/context";
import { useModal } from "@/shared/lib/providers/modal";
import { selectModalActions } from "@/shared/lib/providers/modal/store";
import { Button } from "@/shared/ui/Button";
import { Confirm } from "@/shared/ui/Confirm";
import { Typography } from "@/shared/ui/Typography";
import { Trash, X } from "lucide-react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export const SelectState = () => {
    const { onOpenModal, onAsyncActionModal, onCloseModal } = useModal(useShallow(selectModalActions));
    const { selectedMessages, params, setChatState } = useChat(useShallow((state) => ({
        params: state.params,
        selectedMessages: state.selectedMessages,
        setChatState: state.actions.setChatState
    })));

    const handleDelete = () => {
        onOpenModal({
            content: (
                <Confirm
                    text={`Do you want to delete ${selectedMessages.size > 1 ? `${selectedMessages.size} messages` : 'this message'}?`}
                    onCancel={onCloseModal}
                    onConfirmButtonVariant='destructive'
                    onConfirmText='Delete'
                    onConfirm={() => onAsyncActionModal(() => messageAPI.delete({
                        query: `${params.apiUrl}/delete`,
                        body: JSON.stringify({
                            ...params.query,
                            messageIds: [...selectedMessages.keys()]
                        })}), 
                    {
                        closeOnError: true,
                        onResolve: () => {
                            toast.success(`${selectedMessages.size} ${selectedMessages.size > 1 ? 'messages' : 'message'} was deleted`, { 
                                position: 'top-center' 
                            });
                            setChatState({ mode: 'default', selectedMessages: new Map() })
                        },
                        onReject: () => toast.error('Cannot delete messages')
                    })}
                />
            ),
            withHeader: false,
            bodyClassName: 'h-auto p-5'
        })
    }

    return (
        <div className='flex items-center w-full'>
            <Button variant='text' size='icon' className='mr-2' onClick={() => setChatState({ mode: 'default', selectedMessages: new Map() })}>
                <X className='w-6 h-6' />
            </Button>
            <Typography>{`${selectedMessages.size} ${selectedMessages.size > 1 ? 'messages' : 'message'}`}</Typography>
            <Button
                onClick={handleDelete}
                variant='ghost'
                className='dark:text-red-500 dark:hover:bg-red-500/20 gap-2 ml-auto'
            >
                <Trash className='w-6 h-6 text-red-500' />
                Delete
            </Button>
        </div>
    );
};
