import React from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { Feed, FeedTypes } from '@/shared/model/types';

export const useFeed = () => {
    const {
        state: { accessToken }
    } = useSession();

    const [globalResults, setGlobalResults] = React.useState<Feed>([]);
    const [localResults, setLocalResults] = React.useState<Feed>([]);
    const [onScrollFeedLoading, setOnScrollFeedLoading] = React.useState(false);

    const cursors = React.useRef<Record<string, string | null> | null>(null);

    const handleLoadMore = React.useCallback(async () => {}, []);

    const handleFetchFeed = React.useCallback(async () => {
        try {
            const [
                {
                    data: { conversations, nextCursor: nextConversationCursor }
                }
                // { data: { groups, nextCursor: nextGroupCursor } }
            ] = await Promise.all([
                api.conversation.getAll({ token: accessToken! })
                // api.group.getAll({ token: accessToken! })
            ]);

            setLocalResults(
                conversations
                    .sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime())
                    .map((conversation) => ({
                        ...conversation,
                        type: FeedTypes.CONVERSATION
                    }))
            );

            cursors.current = { nextConversationCursor };
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message);
        }
    }, []);

    React.useEffect(() => {
        handleFetchFeed();
    }, []);

    return {
        globalResults,
        localResults,
        onScrollFeedLoading,
        handleLoadMore,
        handleFetchFeed,
        setGlobalResults,
        setLocalResults
    };
};
