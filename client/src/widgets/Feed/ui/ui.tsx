import UserItem from './UserItem';
import Typography from '@/shared/ui/Typography';
import FeedSkeleton from './Skeletons/FeedSkeleton';
import ConversationItem from './ConversationItem';
import { ConversationFeed, FeedItem, FeedTypes, UserFeed } from '@/shared/model/types';
import { ReactNode } from 'react';
import { UserSearch } from 'lucide-react';
import { FeedProps } from '../model/types';

const Feed = ({ isFeedEmpty, filteredLocalResults, filteredGlobalResults, searchLoading, searchValue }: FeedProps) => {
    if (isFeedEmpty) return <FeedSkeleton skeletonsCount={3} />;

    const trimmedSearchValue = searchValue.trim();

    const feedItems: Record<FeedTypes, (item: FeedItem) => ReactNode> = {
        conversation: (item: FeedItem) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
        user: (item: FeedItem) => <UserItem key={item._id} user={item as UserFeed} />,
        group: (item: FeedItem) => <div key={item._id}>{item._id}</div>
    };

    return !searchLoading && !filteredLocalResults.length && !filteredGlobalResults.length ? (
        <>
            <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
            <Typography as='p' variant='secondary' className='self-center text-center'>
                There were no results for "{trimmedSearchValue}".
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
                <FeedSkeleton skeletonsCount={3} animate />
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