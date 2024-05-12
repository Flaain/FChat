import React from "react";
import { toast } from "sonner";
import { api } from "@/shared/api";
import { IMessage } from "@/shared/model/types";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";
import { useConversationContainer } from "@/widgets/ConversationContainer/lib/hooks/useConversationContainer";
import { ContainerConversationTypes, MessageFormStatus } from "@/widgets/ConversationContainer/model/types";
import { useProfile } from "@/shared/lib/hooks/useProfile";

export const useSendMessage = () => {
    const { state: { accessToken, userId } } = useSession();
    const { profile } = useProfile();
    const { conversation, setConversation } = useConversationContext();
    const { state: { sendMessageFormStatus, messageInputValue, selectedMessageEdit }, dispatch } = useConversationContainer();

    const [isMessageInputFocused, setIsMessageInputFocused] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = "inherit";
        textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 50)}px`;
      }, [messageInputValue]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey && "form" in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    };

    const handleChange = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value } })
    }, [dispatch]);

    const onSendEditedMessage = async () => {
        if (messageInputValue.trim() === selectedMessageEdit?.text) {
            dispatch({ 
                type: ContainerConversationTypes.SET_CLOSE_EDIT_FORM, 
                payload: { selectedMessageEdit: null, sendMessageFormStatus: "send", value: "" } 
            });
            return;
        }
    };

    const onSendMessage = async () => {
        if (!messageInputValue.trim().length) return;
        
        const optimisticId = window.crypto.randomUUID();

        try {
            const optimisticdMessage: IMessage = {
                _id: optimisticId,
                text: messageInputValue,
                sender: {
                    _id: userId!,
                    email: profile.email,
                    name: profile.username,
                    lastSeen: new Date().toLocaleString(),
                },
                createdAt: new Date().toLocaleString(),
                hasBeenEdited: false,
                hasBeenRead: false,
                sendingInProgress: true,
            };
    
            setConversation((prev) => ({ ...prev, messages: [...prev.messages, optimisticdMessage] }));
            dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value: "" } });
    
            const { data } = await api.message.send({
                token: accessToken!,
                body: { message: messageInputValue, conversationId: conversation._id },
            });
            
            setConversation((prev) => ({ ...prev, messages: [...prev.messages, data].filter((message) => message._id !== optimisticId) }));
        } catch (error) {
            setConversation((prev) => ({ ...prev, messages: prev.messages.filter((message) => message._id !== optimisticId) }));
            error instanceof Error && toast.error(error.message, { position: "top-center" });
        }
    };

    const handleSubmitMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            
            setLoading(true);

            const actions: Record<MessageFormStatus, () => Promise<void>> = {
                send: onSendMessage,
                edit: onSendEditedMessage,
            };

            await actions[sendMessageFormStatus]();
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message, { position: "top-center" });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseEdit = React.useCallback(() => {
        dispatch({
            type: ContainerConversationTypes.SET_CLOSE_EDIT_FORM,
            payload: { value: "", selectedMessageEdit: null, sendMessageFormStatus: "send" },
        });
    }, [dispatch]);

    return {
        loading,
        onKeyDown,
        textareaRef,
        handleCloseEdit,
        handleSubmitMessage,
        handleChange,
        selectedMessageEdit,
        messageInputValue,
        isMessageInputFocused,
        sendMessageFormStatus,
        setIsMessageInputFocused,
    };
};