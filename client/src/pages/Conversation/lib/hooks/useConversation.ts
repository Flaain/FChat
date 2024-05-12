import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { api } from "@/shared/api";
import { Conversation } from "@/shared/model/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ApiError } from "@/shared/api/error";

export const useConversation = () => {
    const { id } = useParams();
    const { state: { accessToken, userId } } = useSession();

    const [conversation, setConversation] = React.useState<Conversation>(null!);
    const [isLoading, setIsLoading] = React.useState(false);

    const filteredParticipants = React.useMemo(() => {
        return conversation ? conversation?.participants.filter((participant) => participant._id !== userId) : [];
    }, [conversation, userId]);
    const isGroup = filteredParticipants.length >= 2;
    const conversationName = React.useMemo(() => {
        return isGroup ? conversation?.name || filteredParticipants.map((participant) => participant.name).join(", ") : filteredParticipants[0]?.name;
    }, [conversation?.name, filteredParticipants, isGroup]);

    const navigate = useNavigate();

    React.useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                if (!id) return;

                setIsLoading(true);

                const { data } = await api.conversation.getConversation({
                    token: accessToken!,
                    signal: controller.signal,
                    body: { conversationId: id },
                });

                setConversation(data);
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error(error);
                    error instanceof ApiError && toast.error("Cannot get conversation", { position: "top-center", description: error.message });
                    navigate("/");
                }
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [accessToken, id, navigate]);

    return { conversation, setConversation, isLoading, info: { filteredParticipants, isGroup, conversationName } };
};