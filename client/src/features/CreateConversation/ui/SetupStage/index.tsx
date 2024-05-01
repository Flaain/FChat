import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { CreateConvThirdStepProps } from "../../model/types";
import { Input } from "@/shared/ui/Input";

const SetupStage = ({ form }: CreateConvThirdStepProps) => {
    return (
        <FormField
            name='groupName'
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-white'>group name</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            value={field.value || ""}
                            placeholder='Enter group name'
                            className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default SetupStage;