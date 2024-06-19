import UserItem from './UserItem';
import Typography from '@/shared/ui/Typography';
import FeedSkeleton from './Skeletons/FeedSkeleton';
import ConversationItem from './ConversationItem';
import { useLayoutContext } from '@/shared/lib/hooks/useLayoutContext';
import { ConversationFeed, FeedItem, FeedTypes, GroupFeed, UserFeed } from '@/shared/model/types';
import { ReactNode } from 'react';
import { UserSearch } from 'lucide-react';

const Feed = () => {
    const { searchLoading, searchValue, globalResults, localResults } = useLayoutContext();

    if (!searchValue.trim().length && !globalResults.length && !localResults.length) return <FeedSkeleton skeletonsCount={3} />;

    const trimmedSearchValue = searchValue.trim().toLowerCase();

    const feedItems: Record<FeedTypes, (item: FeedItem) => ReactNode> = {
        conversation: (item: FeedItem) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
        user: (item: FeedItem) => <UserItem key={item._id} user={item as UserFeed} />,
        group: (item: FeedItem) => <div key={item._id}>{item._id}</div>
    };

    const localFilters: Record<Exclude<FeedTypes, 'user'>, (item: FeedItem) => boolean> = {
        conversation: (item: FeedItem) => (item as ConversationFeed).participants[0].name.toLowerCase().includes(trimmedSearchValue),
        group: (item: FeedItem) => (item as GroupFeed).name.toLowerCase().includes(trimmedSearchValue)
    };

    const globalFilters: Record<Exclude<FeedTypes, 'conversation'>, (item: FeedItem) => boolean> = {
        user: (item: FeedItem) => localResults.some((localItem) => localItem.type === FeedTypes.CONVERSATION && localItem.participants[0]._id === item._id),
        group: (item: FeedItem) => localResults.some((localItem) => localItem._id === item._id)
    };

    const filteredLocalResults = localResults.filter((item) => localFilters[item.type](item));
    const filteredGlobalResults = globalResults.filter((item) => !globalFilters[item.type](item));

    return !searchLoading && !filteredLocalResults.length && !filteredGlobalResults.length ? (
        <>
            <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
            <Typography as='p' variant='secondary' className='self-center text-center'>
                There were no results for "{searchValue.trim()}".
            </Typography>
        </>
    ) : (
        <>
            {!!filteredLocalResults.length && (
                <ul className='flex flex-col gap-5 px-3 overflow-auto'>
                    {filteredLocalResults.map((item) => feedItems[item.type](item))}
                </ul>
            )}
            {searchLoading ? (
                <FeedSkeleton skeletonsCount={3} />
            ) : (
                !!filteredGlobalResults.length && (
                    <div className='flex flex-col gap-2'>
                        <Typography as='h3' variant='secondary' className='px-3 py-2 rounded bg-primary-dark-200'>
                            Global results
                        </Typography>
                        <ul className='flex flex-col gap-5 overflow-auto px-3'>
                            {filteredGlobalResults.map((item) => feedItems[item.type](item))}
                        </ul>
                    </div>
                )
            )}
        </>
    );
};

export default Feed;
