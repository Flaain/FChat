import { Button } from '@/shared/ui/Button';
import { useChangePassword } from '../lib/useChangePassword';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';

export const ChangePassword = () => {
    const { form, onSubmit, step } = useChangePassword();

    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className='px-5 pt-5 flex flex-col gap-2'>
                <FormField
                    name='currentPassword'
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-white'>Current password</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    type='password'
                                    placeholder='Enter current password'
                                    className='box-border focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {!!step && (
                    <FormField
                        name='newPassword'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>New password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='password'
                                        placeholder='Enter new password'
                                        className='box-border focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <Button type='submit' className='sr-only'>
                    Submit
                </Button>
            </form>
        </Form>
    );
};