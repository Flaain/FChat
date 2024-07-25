import { LoaderCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Form } from '@/shared/ui/Form';

const RightBlock = ({
    form,
    onSubmit,
    loading,
    onBack,
    isSubmitButtonDisabled,
    isSubmitButtonHidden,
    children
}: {
    children: React.ReactNode;
    form: any;
    onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
    loading?: boolean;
    isSubmitButtonDisabled?: boolean;
    isSubmitButtonHidden?: boolean;
}) => {
    return (
        <Form {...form}>
            <div className='flex max-md:justify-center flex-1 md:pl-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                <form
                    onSubmit={onSubmit}
                    className='flex flex-col gap-4 h-full justify-center md:min-w-[400px] max-w-[560px] w-full'
                >
                    {children}
                    <div className='flex w-full items-center justify-between mt-5'>
                        <Button type='button' variant='secondary' className='w-24' onClick={onBack} disabled={loading}>
                            Back
                        </Button>
                        {!isSubmitButtonHidden && (
                            <Button className='w-24' disabled={isSubmitButtonDisabled}>
                                {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : 'Submit'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </Form>
    );
};

export default RightBlock;