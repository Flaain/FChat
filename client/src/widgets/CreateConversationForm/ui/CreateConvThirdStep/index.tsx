import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { CreateConvThirdStepProps } from "../../model/types";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { LoaderCircle } from "lucide-react";

const CreateConvThirdStep = ({ form, loading, isButtonDisabled }: CreateConvThirdStepProps) => {
    return (
        <>
            <FormField
                name='conversationName'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>conversation name</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                value={field.value || ""}
                                placeholder='Enter conversation name'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button disabled={isButtonDisabled}>
                {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : "Create conversation"}
            </Button>
        </>
    );
};

export default CreateConvThirdStep;