import LeftBlock from '../LeftBlock';
import RightBlock from '../RightBlock';
import FormContainer from '../FormContainer';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { useSignin } from '../../lib/hooks/useSignin';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/Form';
import { Input } from '@/shared/ui/Input';
import { Link } from 'react-router-dom';

const SigninForm = () => {
    const { form, isSubmitButtonDisabled, onSubmit, onBack, loading } = useSignin();

    return (
        <FormContainer>
            <LeftBlock title='Sign in' description='Enter your email or login and password' />
            <RightBlock
                form={form}
                onSubmit={form.handleSubmit(onSubmit)}
                onBack={onBack}
                isSubmitButtonDisabled={isSubmitButtonDisabled}
                loading={loading}
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Link
                    to='#'
                    className='p-0 -my-2 self-end dark:text-primary-white text-primary-dark-50 text-sm dark:hover:opacity-50 transition-opacity duration-200 ease-in-out'
                >
                    Forgot password?
                </Link>
            </RightBlock>
        </FormContainer>
    );
};

export default SigninForm;