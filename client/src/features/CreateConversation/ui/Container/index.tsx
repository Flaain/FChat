import SearchStage from '../SearchStage';
import SelectStage from '../SelectStage';
import SetupStage from '../SetupStage';
import { Form } from '@/shared/ui/Form';
import { useCreateConversation } from '../../lib/hooks/useCreateConversation';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { useCreateContext } from '../../lib/hooks/useCreateContext';
import { useModal } from '@/shared/lib/hooks/useModal';

const Container = () => {
    const { form, isNextButtonDisabled, handleSubmit, handleBack } = useCreateConversation();
    const { selectedUsers, step } = useCreateContext();
    const { isAsyncActionLoading } = useModal();

    const buttonConfig = {
        0: 'Search',
        1: selectedUsers.size >= 2 ? 'Create group conversation' : 'Create conversation',
        2: 'Create group conversation'
    };

    const stages: Record<number, React.ReactNode> = {
        0: <SearchStage form={form} />,
        1: <SelectStage />,
        2: <SetupStage form={form} />
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5 mt-5'>
                {stages[step]}
                <div className={cn('flex items-center gap-5 justify-between', { 'mt-5': step === 1 })}>
                    {!!step && (
                        <Button
                            type='button'
                            size='lg'
                            variant='secondary'
                            className='w-1/3'
                            onClick={handleBack}
                            disabled={isAsyncActionLoading}
                        >
                            Back
                        </Button>
                    )}
                    <Button
                        type='submit'
                        variant={step ? 'default' : 'secondary'}
                        className='w-full'
                        disabled={isNextButtonDisabled}
                    >
                        {isAsyncActionLoading ? (
                            <LoaderCircle className='w-5 h-5 animate-loading' />
                        ) : (
                            buttonConfig[step as keyof typeof buttonConfig]
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default Container;