import React from 'react';
import { LinkStage } from './LinkStage';
import { GroupNameStage } from './GroupNameStage';
import { SelectStage } from './SelectStage';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { Form } from '@/shared/ui/Form';
import { useModal } from '@/shared/lib/providers/modal';
import { useCreateGroup } from '../model/store';
import { steps } from '../model/constants';

const stages: Record<number, React.ReactNode> = {
    0: <GroupNameStage />,
    1: <SelectStage />,
    2: <LinkStage />
};

export const CreateGroup = () => {
    const { onCloseModal, isModalDisabled } = useModal((state) => ({
        onCloseModal: state.onCloseModal,
        isModalDisabled: state.isModalDisabled
    }));
    
    const { form, handleBack, onSubmit, step, isNextButtonDisabled } = useCreateGroup((state) => ({
        form: state.form,
        step: state.step,
        handleBack: state.handleBack,
        onSubmit: state.onSubmit,
        isNextButtonDisabled: state.isNextButtonDisabled
    }));

    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step]?.fields[0]);
    }, [step]);

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
                        onClick={!step ? onCloseModal : handleBack}
                        disabled={isModalDisabled}
                    >
                        {!step ? 'Cancel' : 'Back'}
                    </Button>
                    <Button type='submit' className='w-full' disabled={isNextButtonDisabled()}>
                        {isModalDisabled ? (
                            <LoaderCircle className='w-5 h-5 animate-loading' />
                        ) : (
                            step === steps.length - 1 ? 'Create' : 'Next'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};