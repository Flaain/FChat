import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { SearchUser } from "@/shared/model/types";
import { createConversationSchema } from "./schemas";

export type CreateConversationFormType = z.infer<typeof createConversationSchema>;

export interface CreateConvFirstStepProps {
    form: UseFormReturn<CreateConversationFormType>;
}

export interface CreateConvSecondStepProps {
    searchedUsers: Array<SearchUser>;
    selectedUsers: Map<string, SearchUser>;
    handleSelect: (user: SearchUser) => void;
    handleRemove: (id: string) => void;
}

export interface CreateConvThirdStepProps extends CreateConvFirstStepProps {
}