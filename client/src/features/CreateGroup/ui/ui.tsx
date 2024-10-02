import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { useModal } from '@/shared/lib/providers/modal';
import { steps } from '../model/constants';
import { useCreateGroup } from '../model/context';
import { Input } from '@/shared/ui/Input';
import { Select } from './Select';

export const CreateGroup = () => {
    const { onCloseModal, isModalDisabled } = useModal((state) => ({
        onCloseModal: state.actions.onCloseModal,
        isModalDisabled: state.isModalDisabled
    }));
    const { form, onSubmit, isNextButtonDisabled, step, handleBack } = useCreateGroup();

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className='flex flex-col gap-5'>
                {!step && (
                    <FormField
                        name='name'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Group name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Enter group name'
                                        className='box-border focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                {step === 1 && <Select />}
                {step === 2 && (
                    <FormField
                        name='login'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Unique login</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Enter unique login'
                                        className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
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
                        ) : step === steps.length - 1 ? (
                            'Create'
                        ) : (
                            'Next'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};