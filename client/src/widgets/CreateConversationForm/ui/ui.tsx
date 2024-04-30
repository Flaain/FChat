import CreateConvFirstStep from "./CreateConvFirstStep";
import CreateConvSecondStep from "./CreateConvSecondStep";
import CreateConvThirdStep from "./CreateConvThirdStep";
import { Form } from "@/shared/ui/Form";
import { useCreateConversation } from "../lib/hooks/useCreateConversation";
import { Button } from "@/shared/ui/Button";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

const CreateConversationForm = () => {
    const {
        form,
        step,
        loading,
        searchedUsers,
        selectedUsers,
        isNextButtonDisabled,
        handleSelect,
        handleRemove,
        onSubmit,
        handleBack,
    } = useCreateConversation();

    const buttonConfig = {
        0: "Search",
        1: selectedUsers.size >= 2 ? "Create group conversation" : "Create conversation",
        2: "Create group conversation",
    };

    const components: Record<number, React.ReactNode> = {
        0: <CreateConvFirstStep form={form} />,
        1: (
            <CreateConvSecondStep
                searchedUsers={searchedUsers}
                selectedUsers={selectedUsers}
                handleSelect={handleSelect}
                handleRemove={handleRemove}
            />
        ),
        2: <CreateConvThirdStep form={form} />,
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5 mt-5'>
                {components[step]}
                <div className={cn("flex items-center gap-5 justify-between", { "mt-5": step === 1 })}>
                    {!!step && (
                        <Button type='button' size='lg' variant='secondary' className='w-1/3' onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    <Button
                        type='submit'
                        variant={step ? "default" : "secondary"}
                        className='w-full'
                        disabled={isNextButtonDisabled}
                    >
                        {loading ? (
                            <LoaderCircle className='w-5 h-5 animate-loading' />
                        ) : (
                            buttonConfig[step as keyof typeof buttonConfig]
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CreateConversationForm;
