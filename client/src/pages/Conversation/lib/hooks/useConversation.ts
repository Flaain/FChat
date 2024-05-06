import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { api } from "@/shared/api";
import { isApiError } from "@/shared/lib/utils/isApiError";
import { Conversation } from "@/shared/model/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const useConversation = () => {
    const { id } = useParams();
    const { state: { accessToken, userId } } = useSession();

    const [conversation, setConversation] = React.useState<Conversation | null>(null);
    const [status, setStatus] = React.useState<"idle" | "loading" | "error">("loading");

    const filteredParticipants = React.useMemo(() => {
        return conversation ? conversation?.participants.filter((participant) => participant._id !== userId) : [];
    }, [conversation, userId]);
    const isGroup = filteredParticipants.length >= 2;
    const conversationName = React.useMemo(() => {
        return isGroup ? (conversation?.name ?? filteredParticipants.map((participant) => participant.name).join(", ")) : filteredParticipants[0]?.name;
    }, [conversation?.name, filteredParticipants, isGroup]);

    const navigate = useNavigate();

    React.useEffect(() => {
        (async () => {
            try {
                if (!id) return;

                setStatus("loading");

                const { data } = await api.conversation.getConversation({
                    token: accessToken!,
                    body: { conversationId: id },
                });

                setConversation(data);
                setStatus("idle");
            } catch (error) {
                console.error(error);
                isApiError(error) && toast.error("Cannot get conversation", { position: "top-center", description: error.message });
                setStatus("error");
                navigate("/");
            }
        })();
    }, []);

    return { conversation, setConversation, status, info: { filteredParticipants, isGroup, conversationName } };
};