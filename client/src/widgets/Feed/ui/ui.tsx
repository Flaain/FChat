import FeedSkeleton from './Skeletons/FeedSkeleton';
import { Typography } from '@/shared/ui/Typography';
import { UserSearch } from 'lucide-react';
import { useSidebar } from '@/widgets/Sidebar/model/context';
import { useShallow } from 'zustand/shallow';
import { feedItems, globalFilters, localFilters } from '@/widgets/Sidebar/model/constants';
import { MIN_USER_SEARCH_LENGTH } from '@/shared/constants';

export const Feed = () => {
    const { isSearching, searchValue, localResults, globalResults } = useSidebar(useShallow((state) => ({
        isSearching: state.isSearching,
        searchValue: state.searchValue,
        localResults: state.localResults.feed,
        globalResults: state.globalResults?.items
    })));

    const filteredLocalResults = localResults.filter((item) => localFilters[item.type](item, searchValue));
    const filteredGlobalResults = globalResults?.filter((item) => !globalFilters[item.type](item, localResults));
    const isResultsEmpty = !filteredLocalResults.length && !filteredGlobalResults?.length;

    if (!isSearching && isResultsEmpty && searchValue.length <= MIN_USER_SEARCH_LENGTH) return <FeedSkeleton skeletonsCount={3} />;

    return !isSearching && isResultsEmpty && searchValue.length > MIN_USER_SEARCH_LENGTH ? (
        <>
            <UserSearch className='dark:text-primary-white w-10 h-10 self-center' />
            <Typography as='p' variant='secondary' className='line-clamp-3 break-words px-3 box-border text-center'>
                There were no results for "{searchValue}".
            </Typography>
        </>
    ) : (
        <>
            {!!filteredLocalResults.length && (
                <ul className='flex flex-col px-3 overflow-auto'>
                    {filteredLocalResults.map((item) => feedItems[item.type](item))}
                </ul>
            )}
            {(!!filteredGlobalResults?.length || isSearching) && (
                <div className='flex flex-col gap-2'>
                    <Typography as='h3' variant='secondary' className='px-3 py-2 rounded bg-primary-dark-200'>
                        Global results
                    </Typography>
                    {isSearching ? (
                        <FeedSkeleton skeletonsCount={3} animate />
                    ) : (
                        <ul className='flex flex-col overflow-auto px-3'>
                            {filteredGlobalResults?.map((item) => feedItems[item.type](item))}
                        </ul>
                    )}
                </div>
            )}
        </>
    );
};