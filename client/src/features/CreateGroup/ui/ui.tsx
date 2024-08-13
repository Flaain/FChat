import LinkStage from './LinkStage';
import GroupNameStage from './GroupNameStage';
import SelectStage from './SelectStage';
import { useModal } from '@/shared/lib/hooks/useModal';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { Form } from '@/shared/ui/Form';
import { useCreateGroupContext } from '../lib/hooks/useCreateGroupContext';

const buttonConfig = {
    0: 'Next',
    1: 'Next',
    2: 'Create'
};

const stages: Record<number, React.ReactNode> = {
    0: <GroupNameStage />,
    1: <SelectStage />,
    2: <LinkStage />
};

const CreateGroup = () => {
    const { isAsyncActionLoading } = useModal();
    const { form, step, isNextButtonDisabled, handleBack, onSubmit } = useCreateGroupContext();


    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className='flex flex-col gap-5'>
                {stages[step]}
                <div className='flex items-center gap-5 justify-between'>
                    <Button
                        type='button'
                        size='lg'
                        variant='secondary'
                        className='w-1/3'
                        onClick={handleBack}
                        disabled={isAsyncActionLoading}
                    >
                        {!step ? 'Cancel' : 'Back'}
                    </Button>
                    <Button type='submit' className='w-full' disabled={isNextButtonDisabled}>
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

export default CreateGroup;