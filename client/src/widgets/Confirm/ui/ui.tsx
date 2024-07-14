import Typography from '@/shared/ui/Typography';
import { useModal } from '@/shared/lib/hooks/useModal';
import { Button } from '@/shared/ui/Button';
import { ConfirmationProps } from '../model/types';

const Confirm = ({
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

export default Confirm;