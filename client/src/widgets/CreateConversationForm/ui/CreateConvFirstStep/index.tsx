import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { CreateConvFirstStepProps } from "../../model/types";
import { Button } from "@/shared/ui/Button";
import { LoaderCircle } from "lucide-react";

const CreateConvFirstStep = ({ form, loading, isButtonDisabled }: CreateConvFirstStepProps) => {
    return (
        <>
            <FormField
                name='username'
                control={form.control}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className='text-white'>user name</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder='Enter user name'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:ring-primary-dark-50'
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button variant='secondary' size='sm' disabled={isButtonDisabled}>
                {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : "Search"}
            </Button>
        </>
    );
};

export default CreateConvFirstStep;
