import Typography from './Typography';
import { ConfirmationProps } from '../model/types';
import { Button } from './Button';
import { useModal } from '../lib/hooks/useModal';

const Confirmation = ({
    text,
    onConfirm,
    onCancel,
    onCancelText = 'Cancel',
    onConfirmText = 'Confirm'
}: ConfirmationProps) => {
    const { isAsyncActionLoading } = useModal();

    return (
        <div className='flex flex-col gap-5 items-start'>
            <Typography as='p' variant='primary'>
                {text}
            </Typography>
            <div className='flex justify-center gap-5 mt-5 self-end'>
                <Button onClick={onCancel} variant='secondary' disabled={isAsyncActionLoading}>
                    {onCancelText}
                </Button>
                <Button onClick={onConfirm} variant='default' disabled={isAsyncActionLoading}>
                    {onConfirmText}
                </Button>
            </div>
        </div>
    );
};

export default Confirmation;