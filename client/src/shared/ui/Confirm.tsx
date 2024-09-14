import Typography from '@/shared/ui/Typography';
import { Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/shared/ui/Button';
import { useModal } from '@/shared/lib/providers/modal';

export const Confirm = ({
    text,
    onConfirm,
    onCancel,
    onCancelText = 'Cancel',
    onConfirmText = 'Confirm',
    onConfirmButtonVariant = 'default'
}: {
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
    text: string;
    onConfirmText?: string;
    onCancelText?: string;
    onConfirmButtonVariant?: ButtonProps['variant'];
}) => {
    const { isModalDisabled } = useModal();

    return (
        <div className='flex flex-col gap-5 items-start'>
            <Typography as='p' variant='primary'>
                {text}
            </Typography>
            <div className='flex justify-center gap-5 mt-2 self-end'>
                <Button onClick={onCancel} variant='secondary' disabled={isModalDisabled}>
                    {onCancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isModalDisabled}
                    className='min-w-[100px]'
                    variant={onConfirmButtonVariant}
                >
                    {isModalDisabled ? <Loader2 className='w-5 h-5 animate-spin' /> : onConfirmText}
                </Button>
            </div>
        </div>
    );
};
