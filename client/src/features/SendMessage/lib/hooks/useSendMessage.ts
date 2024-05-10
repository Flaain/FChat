import React from "react";
import { toast } from "sonner";
import { api } from "@/shared/api";
import { ApiError } from "@/shared/api/error";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";
import { useConversationContainer } from "@/widgets/ConversationContainer/lib/hooks/useConversationContainer";
import { ContainerConversationTypes, MessageFormStatus } from "@/widgets/ConversationContainer/model/types";

export const useSendMessage = () => {
    const { state: { accessToken } } = useSession();
    const { conversation, setConversation } = useConversationContext();
    const { state: { sendMessageFormStatus, messageInputValue, selectedMessageEdit }, dispatch } = useConversationContainer();

    const [isMessageInputFocused, setIsMessageInputFocused] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
        if (!textareaRef.current) return

        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = !messageInputValue.trim().length ? "50px" : scrollHeight + "px";  
    }, [messageInputValue])

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey && "form" in event.target) {
            event.preventDefault();
            (event.target.form as HTMLFormElement).requestSubmit();
        }
    };

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

        const { data } = await api.message.send({
            token: accessToken!,
            body: { message: messageInputValue, conversationId: conversation._id },
        });

        setConversation((prev) => ({ ...prev!, messages: [...prev!.messages, data] }));
        dispatch({ type: ContainerConversationTypes.SET_MESSAGE_INPUT_VALUE, payload: { value: "" } });
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
            error instanceof ApiError && toast.error(error.message, { position: "top-center" });
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
        dispatch,
        onKeyDown,
        textareaRef,
        handleCloseEdit,
        handleSubmitMessage,
        selectedMessageEdit,
        messageInputValue,
        isMessageInputFocused,
        sendMessageFormStatus,
        setIsMessageInputFocused,
    };
};