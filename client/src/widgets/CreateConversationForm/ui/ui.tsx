import CreateConvFirstStep from "./CreateConvFirstStep";
import { Form } from "@/shared/ui/Form";
import { useCreateConversation } from "../lib/hooks/useCreateConversation";
import CreateConvSecondStep from "./CreateConvSecondStep";
import CreateConvThirdStep from "./CreateConvThirdStep";
import { Button } from "@/shared/ui/Button";
import { MoveLeft } from "lucide-react";

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

    const components: Record<number, React.ReactNode> = {
        0: <CreateConvFirstStep form={form} isButtonDisabled={isNextButtonDisabled} loading={loading} />,
        1: (
            <CreateConvSecondStep
                loading={loading}
                searchedUsers={searchedUsers}
                selectedUsers={selectedUsers}
                handleSelect={handleSelect}
                handleRemove={handleRemove}
            />
        ),
        2: <CreateConvThirdStep form={form} loading={loading} isButtonDisabled={isNextButtonDisabled} />,
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                {!!step && (
                    <Button type="button" variant='text' className='px-0 py-2 self-start gap-2' onClick={handleBack}>
                        <MoveLeft className='w-5 h-5  pointer-events-none' /> back
                    </Button>
                )}
                {components[step]}
            </form>
        </Form>
    );
};

export default CreateConversationForm;
