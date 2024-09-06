import Typography from '@/shared/ui/Typography';
import FeedSkeleton from './Skeletons/FeedSkeleton';
import ConversationItem from './ConversationItem';
import UserItem from './UserItem';
import GroupItem from './GroupItem';
import { UserSearch } from 'lucide-react';
import { FeedProps } from '../model/types';
import { ConversationFeed, FeedItem, FeedTypes, GroupFeed, UserFeed } from '@/shared/model/types';

const Feed = ({ isFeedEmpty, filteredLocalResults, filteredGlobalResults, searchLoading, searchValue }: FeedProps) => {
    if (isFeedEmpty) return <FeedSkeleton skeletonsCount={3} />;

    const feedItems: Record<FeedTypes, (item: FeedItem) => React.ReactNode> = {
        Conversation: (item) => <ConversationItem key={item._id} conversation={item as ConversationFeed} />,
        User: (item) => <UserItem user={item as UserFeed} key={item._id} />,
        Group: (item) => <GroupItem group={item as GroupFeed} key={item._id} />
    }

    return !searchLoading && !filteredLocalResults.length && !filteredGlobalResults?.length ? (
        <>
            <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
            <Typography as='p' variant='secondary' className='line-clamp-3 break-words px-3 box-border text-center'>
                There were no results for "{searchValue}".
            </Typography>
        </>
    ) : (
        <>
            {!!filteredLocalResults.length && (
                <ul className='flex flex-col gap-1 px-3 overflow-auto'>
                    {filteredLocalResults.map((item) => feedItems[item.type](item))}
                </ul>
            )}
            {searchLoading ? (
                <FeedSkeleton skeletonsCount={3} animate />
            ) : (
                !!filteredGlobalResults?.length && (
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