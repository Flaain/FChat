import UserItem from './UserItem';
import Typography from '@/shared/ui/Typography';
import FeedSkeleton from './Skeletons/FeedSkeleton';
import ConversationItem from './ConversationItem';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { ConversationFeed, FeedItem, FeedTypes, UserFeed } from '@/shared/model/types';
import { ReactNode } from 'react';
import { UserSearch } from 'lucide-react';

const Feed = () => {
    const { searchLoading, searchValue, feed } = useLayoutContext();

    if (searchLoading || (!searchValue.trim().length && !feed.length)) return <FeedSkeleton />;

    const feedItems: Record<FeedTypes, (item: FeedItem) => ReactNode> = {
        conversation: (item: FeedItem) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
        user: (item: FeedItem) => <UserItem key={item._id} user={item as UserFeed} />,
        group: (item: FeedItem) => <div key={item._id}>{item._id}</div>
    };

    return feed.length ? (
        <ul className='flex flex-col gap-5 px-3 overflow-auto'>{feed.map((item) => feedItems[item.type](item))}</ul>
    ) : (
        <>
            <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
            <Typography as='p' variant='secondary' className='self-center text-center'>
                There were no results for "{searchValue.trim()}".
            </Typography>
        </>
    );
};

export default Feed;