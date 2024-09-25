import { Typography } from '@/shared/ui/Typography';
import { LucideMessagesSquare } from 'lucide-react';

const Home = () => {
    return (
        <div className='flex flex-col flex-1 gap-5 items-center justify-center dark:bg-primary-dark-200 bg-primary-white px-2'>
            <Typography as='h1' variant='primary' size='2xl' weight='bold' align='center' className='max-w-[400px]'>
                Select a chat to start messaging or create one!
            </Typography>
            <LucideMessagesSquare className='w-32 h-32 dark:text-primary-white text-primary-dark-200' />
        </div>
    );
};

export default Home;