import FeedItem from '@/features/FeedItem/ui/ui';
import Typography from '@/shared/ui/Typography';
import FeedSkeleton from './Skeletons/FeedSkeleton';
import { UserSearch } from 'lucide-react';
import { FeedProps } from '../model/types';
import { feedMapper } from '../lib/utils/feedMapper';

const Feed = ({ isFeedEmpty, filteredLocalResults, filteredGlobalResults, searchLoading, searchValue }: FeedProps) => {
    if (isFeedEmpty) return <FeedSkeleton skeletonsCount={3} />;

    const trimmedSearchValue = searchValue.trim();

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
                    {feedMapper(filteredLocalResults).map((item) => <FeedItem key={item._id} {...item} />)}
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
                            {feedMapper(filteredGlobalResults).map((item) => <FeedItem key={item._id} {...item} />)}
                        </ul>
                    </div>
                )
            )}
        </>
    );
};

export default Feed;