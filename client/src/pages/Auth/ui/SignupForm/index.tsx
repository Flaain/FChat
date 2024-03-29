import React from "react";
import FirstStepSignUp from "../FirstStepSignUp";
import SecondStepSignUp from "../SecondStepSignUp";
import { FieldErrors, FieldPath, useForm } from "react-hook-form";
import { z } from "zod";
import { signupSchema } from "../../model/schema";
import { Form } from "@/shared/ui/Form";
import { Button } from "@/shared/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { setAuthForm } from "../../model/slice";
import { useAppDispatch } from "@/shared/model/hooks";

const steps: Array<{ fields: Array<FieldPath<z.infer<typeof signupSchema>>> }> = [
    { fields: ["email", "password", "confirmPassword", "birthDate"] }, 
    { fields: ["name"] }
];

const SignupForm = () => {
    const [step, setStep] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const dispatch = useAppDispatch();  

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            birthDate: "",
        },
        disabled: loading,
        mode: "all",
        shouldFocusError: true,
    });

    const { trigger, setError, handleSubmit, formState: { isSubmitting } } = form;

    const forms: Record<number, React.ReactNode> = {
        0: <FirstStepSignUp form={form} />,
        1: <SecondStepSignUp form={form} />,
    };

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        console.log(data);
    };

    const onNext = async () => {
        try {
            const valid = await trigger(steps[step].fields);
            
            if (!valid) return;
            
            setLoading(true);

            const actions = {
                0: async () => {
                    const res = await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve(1);
                        }, 5000);
                    })

                    setStep((prevState) => prevState + 1);
                },
                1: () => handleSubmit(onSubmit)()
            };

            await actions[step as keyof typeof actions]();
            
        } catch (error) {
            setLoading(false);
            error instanceof Error && console.error(error);
            if (!(error instanceof Error)) {
                Object.entries(error as FieldErrors<z.infer<typeof signupSchema>>).forEach(([key, value]) => {
                    setError(key as FieldPath<z.infer<typeof signupSchema>>, { message: value.message })
                });
            }
        }
    };

    const onBack = () => (step ? setStep((prevState) => prevState - 1) : dispatch(setAuthForm("welcome")));

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
                        onSubmit={handleSubmit(onSubmit)}
                        className='flex flex-col gap-4 h-full justify-center md:min-w-[560px] max-md:max-w-[500px] max-md:w-full'
                    >
                        <span className='text-white font-medium mb-5'>
                            Step {step + 1} of {steps.length}
                        </span>
                        {forms[step]}
                        <div className='flex w-full items-center justify-between mt-5'>
                            <Button
                                type='button'
                                variant='secondary'
                                className='w-24'
                                onClick={onBack}
                                disabled={isSubmitting || loading}
                            >
                                Back
                            </Button>
                            <Button
                                type='button'
                                onClick={onNext}
                                className='w-24'
                                disabled={isSubmitting || loading}
                            >
                                {step ? "Submit" : "Next"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Form>
        </div>
    );
};

export default SignupForm;