import NameStage from './NameStage';
import SelectStage from './SelectStage';
import SetupStage from './SetupStage';
import { useModal } from '@/shared/lib/hooks/useModal';
import { useCreateGroup } from '../lib/hooks/useCreateGroup';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { Form } from '@/shared/ui/Form';

const buttonConfig = {
    0: 'Next',
    1: 'Next',
    2: 'Create'
};

const CreateGroup = () => {
    const { isAsyncActionLoading } = useModal();
    const {
        form,
        step,
        selectedUsers,
        searchedUsers,
        isNextButtonDisabled,
        handleSearchUser,
        handleSelect,
        handleRemove,
        handleSubmit,
        handleBack
    } = useCreateGroup();

    const stages: Record<number, React.ReactNode> = {
        0: <NameStage form={form} />,
        1: (
            <SelectStage
                form={form}
                handleSearchUser={handleSearchUser}
                handleRemove={handleRemove}
                handleSelect={handleSelect}
                searchedUsers={searchedUsers}
                selectedUsers={selectedUsers}
            />
        ),
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