import Typography from '@/shared/ui/Typography';
import { useModal } from '@/shared/lib/hooks/useModal';
import { Button } from '@/shared/ui/Button';
import { ConfirmationProps } from '../model/types';
import { Loader2 } from 'lucide-react';

const Confirm = ({
    text,
    onConfirm,
    onCancel,
    onCancelText = 'Cancel',
    onConfirmText = 'Confirm',
    onConfirmButtonVariant = 'default'
}: ConfirmationProps) => {
    const { isAsyncActionLoading } = useModal();

    return (
        <div className='flex flex-col gap-5 items-start'>
            <Typography as='p' variant='primary'>
                {text}
            </Typography>
            <div className='flex justify-center gap-5 mt-2 self-end'>
                <Button onClick={onCancel} variant='secondary' disabled={isAsyncActionLoading}>
                    {onCancelText}
                </Button>
                <Button onClick={onConfirm} disabled={isAsyncActionLoading} className='min-w-[100px]' variant={onConfirmButtonVariant}>
                    {isAsyncActionLoading ? <Loader2 className='w-5 h-5 animate-spin' /> : onConfirmText}
                </Button>
            </div>
        </div>
    );
};

export default Confirm;