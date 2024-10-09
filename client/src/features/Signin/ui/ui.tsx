import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Button } from '@/shared/ui/Button';
import { LoaderCircle } from 'lucide-react';
import { useSignin } from '../lib/useSignin';
import { Input } from '@/shared/ui/Input';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { useAuth } from '@/pages/Auth';
import { useSigninForm } from '@/widgets/SigninForm/model/store';

export const Signin = () => {
    const { form, isSubmitButtonDisabled, onSubmit, loading } = useSignin();
    
    const changeAuthStage = useAuth((state) => state.changeAuthStage);
    const changeSigninStage = useSigninForm((state) => state.changeSigninStage);

    return (
        <Form {...form}>
            <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                >
                    <FormField
                        name='login'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Login</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder='Enter your email address or login'
                                        className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name='password'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        placeholder='Enter your password'
                                        className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                                        value={field.value.replace(/\s/g, '')}
                                    />
                                </FormControl>
                                <div className='flex items-center justify-between'>
                                    <FormMessage />
                                    <Button
                                        type='button'
                                        variant='link'
                                        onClick={() => changeSigninStage('forgot')}
                                        className='ml-auto p-0 opacity-50 hover:opacity-100 transition-all ease-in-out duration-200'
                                    >
                                        Forgot password?
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className='flex w-full items-center justify-between'>
                        <Button
                            type='button'
                            variant='secondary'
                            className='w-24'
                            onClick={() => changeAuthStage('welcome')}
                            disabled={loading}
                        >
                            Back
                        </Button>
                        <Button className='w-24' disabled={isSubmitButtonDisabled}>
                            {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : 'Submit'}
                        </Button>
                    </div>
                </form>
            </div>
        </Form>
    );
};