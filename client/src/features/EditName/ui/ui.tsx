import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useEditName } from '../lib/useEditName';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { useModal } from '@/shared/lib/providers/modal';
import { useShallow } from 'zustand/shallow';

export const EditName = () => {
    const { isModalDisabled, onCloseModal } = useModal(useShallow((state) => ({
        onCloseModal: state.actions.onCloseModal,
        isModalDisabled: state.isModalDisabled
    })));
    const { form, onSubmit } = useEditName();

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-5'>
                <Typography as='h1' variant='primary' size='xl' weight='medium'>
                    Edit your name
                </Typography>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                    <FormField
                        name='name'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Enter your name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='text'
                                        placeholder='Enter your name'
                                        className='box-border focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='flex items-center gap-2 justify-end mt-2'>
                        <Button type='button' variant='secondary' onClick={onCloseModal} disabled={isModalDisabled}>
                            Cancel
                        </Button>
                        <Button type='submit' size='lg' disabled={isModalDisabled}>
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};