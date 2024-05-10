import React from "react";
import { toast } from "sonner";
import { api } from "@/shared/api";
import { useParams } from "react-router-dom";
import { IMessage } from "@/shared/model/types";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useConversationContext } from "@/pages/Conversation/lib/hooks/useConversationContext";
import { useConversationContainer } from "@/widgets/ConversationContainer/lib/hooks/useConversationContainer";
import { ContainerConversationTypes } from "@/widgets/ConversationContainer/model/types";
import { useModal } from "@/shared/lib/hooks/useModal";

export const useMessage = (message: IMessage) => {
    const { closeModal } = useModal();
    const { dispatch } = useConversationContainer();
    const { setConversation } = useConversationContext();
    const { state: { accessToken, userId } } = useSession();
    const { id: conversationId } = useParams() as { id: string };
    const { _id, createdAt, sender, text } = message;

    const [isLoading, setIsLoading] = React.useState(false);

    const createTime = new Date(createdAt);
    const isMessageFromMe = sender._id === userId;

    const handleCopyToClipboard = React.useCallback(() => {
        navigator.clipboard.writeText(text);
        toast.success("Message copied to clipboard", { position: "top-center" });
    }, [text]);

    const handleMessageDelete = React.useCallback(async () => {
        // try {
        //     setIsLoading(true);

        //     await api.message.delete({ body: { conversationId, messageId: _id }, token: accessToken! });

        //     setConversation((prev) => ({
        //         ...prev!,
        //         messages: prev!.messages.filter((message) => message._id !== _id),
        //     }));
        //     closeModal();
        //     toast.success("Message deleted", { position: "top-center" });
        // } catch (error) {
        //     console.error(error);
        //     toast.error("Cannot delete message", { position: "top-center" });
        // } finally {
        //     setIsLoading(false);
        // }
        setIsLoading(true);
    }, [conversationId, _id, accessToken, setConversation, closeModal]);

    const handleMessageEdit = React.useCallback(async () => {
        dispatch({
            type: ContainerConversationTypes.SET_SELECTED_MESSAGE_EDIT,
            payload: { message, sendMessageFormStatus: "edit" },
        });
    }, [dispatch, message]);

    return { createTime, isMessageFromMe, isLoading, handleCopyToClipboard, handleMessageDelete, handleMessageEdit };
};