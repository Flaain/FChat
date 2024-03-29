import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signinSchema } from "../../model/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/Form";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { PasswordInput } from "@/shared/ui/PasswordInput";
import { LoaderCircle } from "lucide-react";

const SigninForm = () => {
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        console.log(data);
    };

    return (
        <div onClick={() => setForm("welcome")}>signin</div>
    );
};

export default SigninForm;
