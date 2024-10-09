import { OutletContainer } from './OutletContainer';
import { Typography } from './Typography';

export const OutletError = ({
    title,
    description,
    callToAction
}: {
    callToAction?: React.ReactNode;
    title: string;
    description?: string;
}) => {
    return (
        <OutletContainer>
            <div className='mx-auto flex flex-col gap-2 my-auto'>
                <Typography as='h1' variant='primary' size='5xl' weight='bold' align='center' className='max-w-[400px]'>
                    {title}
                </Typography>
                {description && (
                    <Typography
                        as='p'
                        variant='secondary'
                        size='md'
                        weight='normal'
                        align='center'
                        className='max-w-[400px] mt-2'
                    >
                        {description}
                    </Typography>
                )}
                {callToAction}
            </div>
        </OutletContainer>
    );
};