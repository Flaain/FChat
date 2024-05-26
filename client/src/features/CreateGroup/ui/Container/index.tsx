import NameStage from '../NameStage';
import SelectStage from '../SelectStage';
import SetupStage from '../SetupStage';
import { Form } from '@/shared/ui/Form';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useCreateGroup } from '../../lib/hooks/useCreateGroup';
import { useCreateGroupContext } from '../../lib/hooks/useCreateGroupContext';

const buttonConfig = {
    0: 'Next',
    1: 'Next',
    2: 'Create'
};

const Container = () => {
    const { step } = useCreateGroupContext();
    const { isAsyncActionLoading } = useModal();
    const { form, isNextButtonDisabled, handleSearchUser, handleSubmit, handleBack } = useCreateGroup();

    const stages: Record<number, React.ReactNode> = {
        0: <NameStage form={form} />,
        1: <SelectStage form={form} handleSearchUser={handleSearchUser} />,
        2: <SetupStage form={form} />
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
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
                        Back
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

export default Container;