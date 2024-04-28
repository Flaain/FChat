import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { useCreateConversation } from "../lib/hooks/useCreateConversation";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { LoaderCircle } from "lucide-react";
import Typography from "@/shared/ui/Typography";

const CreateConversationForm = () => {
    const { form, loading, searchedUsers, isButtonDisabled, onSubmit } = useCreateConversation();
    console.log(searchedUsers);
    return (
        <div className='flex flex-col'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <FormField
                        name='name'
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-white'>name</FormLabel>
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
                    <Button variant='default' size='sm' disabled={isButtonDisabled}>
                        {loading ? <LoaderCircle className='w-5 h-5 animate-loading' /> : "Search"}
                    </Button>
                </form>
            </Form>
            {!!searchedUsers.length && (
                <>
                    <Typography size="xl" weight='medium' as='h2' variant='primary' className="my-5">
                        Finded users
                    </Typography>
                    <ul className='flex flex-col gap-2'>
                        {searchedUsers.map((user) => (
                            <li key={user._id}>{user.name}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default CreateConversationForm;