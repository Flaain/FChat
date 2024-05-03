import React from "react";
import FirstStepSignUp from "../FirstStepSignUp";
import SecondStepSignUp from "../SecondStepSignUp";
import { Form } from "@/shared/ui/Form";
import { Button } from "@/shared/ui/Button";
import { useSignup } from "../../lib/hooks/useSignup";
import { LoaderCircle } from "lucide-react";
import Typography from "@/shared/ui/Typography";
import { AuthContainer } from "../AuthContainer";

const SignupForm = () => {
    const { form, loading, step, stepsLength, isLastStep, isNextButtonDisabled, onBack, onSubmit } = useSignup();

    const forms: Record<number, React.ReactNode> = {
        0: <FirstStepSignUp form={form} />,
        1: <SecondStepSignUp form={form} />,
    };

    return (
        <div className='flex items-center w-full h-full max-w-[1230px] mx-auto box-border'>
            <div className='flex flex-col gap-2 items-end pr-10 max-md:hidden'>
                <Typography variant='primary' as='h1' size='6xl' weight='bold' align='right'>
                    Create account
                </Typography>
                <Typography as='p' size='xl' variant='secondary' align='right'>
                    We're so excited to have you join us!
                </Typography>
            </div>
            <Form {...form}>
                <AuthContainer>
                    <form
                        onSubmit={onSubmit}
                        className='flex flex-col gap-4 h-full justify-center max-w-[560px] w-full'
                    >
                        <Typography variant='primary' weight='medium' className='mb-5'>
                            Step {step + 1} of {stepsLength}
                        </Typography>
                        {forms[step]}
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button
                                type='button'
                                variant='secondary'
                                className='w-24'
                                onClick={onBack}
                                disabled={loading}
                            >
                                Back
                            </Button>
                            <Button className='w-24' disabled={isNextButtonDisabled}>
                                {loading ? (
                                    <LoaderCircle className='w-5 h-5 animate-loading' />
                                ) : isLastStep ? (
                                    "Submit"
                                ) : (
                                    "Next"
                                )}
                            </Button>
                        </div>
                    </form>
                </AuthContainer>
            </Form>
        </div>
    );
};

export default SignupForm;