import React from "react";
import FirstStepSignUp from "../FirstStepSignUp";
import SecondStepSignUp from "../SecondStepSignUp";
import { Form } from "@/shared/ui/form";
import { Button } from "@/shared/ui/button";
import { useSignup } from "../../lib/hooks/useSignup";
import { LoaderCircle } from "lucide-react";

const SignupForm = () => {
    const { form, loading, step, stepsLength, isLastStep, isNextButtonDisabled, onBack, onNext, onSubmit } =
        useSignup();

    const forms: Record<number, React.ReactNode> = {
        0: <FirstStepSignUp form={form} />,
        1: <SecondStepSignUp form={form} />,
    };

    return (
        <div className='flex items-center w-full h-full max-w-[1230px] mx-auto px-3 box-border'>
            <div className='flex flex-col gap-2 items-end pr-10 max-md:hidden'>
                <h1 className='text-6xl max-lg:text-4xl font-bold text-white text-balance text-right'>
                    Create account
                </h1>
                <p className='text-xl max-lg:text-base text-white opacity-50 text-right'>
                    We're so excited to have you join us!
                </p>
            </div>
            <Form {...form}>
                <div className='flex max-md:justify-center flex-1 md:pl-10 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[560px] max-md:max-w-[500px] max-md:w-full'
                    >
                        <span className='text-white font-medium mb-5'>
                            Step {step + 1} of {stepsLength}
                        </span>
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
                            <Button type='button' onClick={onNext} className='w-24' disabled={isNextButtonDisabled}>
                                {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : isLastStep ? "Submit" : "Next"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Form>
        </div>
    );
};

export default SignupForm;