import Typography from '@/shared/ui/Typography';

const LeftBlock = ({ title, description }: { title: string; description: string }) => {
    return (
        <div className='flex flex-col gap-2 items-end max-md:hidden max-w-[450px] w-full'>
            <Typography variant='primary' as='h1' size='6xl' weight='bold' align='right' className='max-lg:text-6xl'>
                {title}
            </Typography>
            <Typography as='p' size='xl' variant='secondary' align='right' className='max-lg:text-xl'>
                {description}
            </Typography>
        </div>
    );
};

export default LeftBlock;