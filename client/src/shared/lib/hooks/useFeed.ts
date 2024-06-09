import React from 'react';
import { toast } from 'sonner';
import { api } from '@/shared/api';
import { useSession } from '@/entities/session/lib/hooks/useSession';
import { Feed } from '@/shared/model/types';

export const useFeed = () => {
    const { state: { accessToken } } = useSession();

    const [feed, setFeed] = React.useState<Feed>([]);
    const [feedIsLoading, setFeedIsLoading] = React.useState(false);
    const [onScrollFeedLoading, setOnScrollFeedLoading] = React.useState(false);

    const cursors = React.useRef<Record<string, string | null> | null>(null);

    const handleLoadMore = React.useCallback(async () => {
        
    }, []);

    const handleFetchFeed = React.useCallback(async () => {
        try {
            setFeedIsLoading(true);

            const [
                { data: { conversations, nextCursor: nextConversationCursor } },
                // { data: { groups, nextCursor: nextGroupCursor } }
            ] = await Promise.all([
                api.conversation.getAll({ token: accessToken! }),
                // api.group.getAll({ token: accessToken! })
            ]);

            setFeed([...conversations].sort((a, b) => new Date(b.lastMessageSentAt).getTime() - new Date(a.lastMessageSentAt).getTime()));
            
            cursors.current = { nextConversationCursor };
        } catch (error) {
            console.error(error);
            error instanceof Error && toast.error(error.message);
        } finally {
            setFeedIsLoading(false);
        }
    }, [])

    React.useEffect(() => { handleFetchFeed() }, []);

    return { feed, setFeed, feedIsLoading, onScrollFeedLoading, handleLoadMore, handleFetchFeed };
};
