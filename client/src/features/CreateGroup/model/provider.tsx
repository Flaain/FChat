import React from "react";
import { FieldPath, useForm } from "react-hook-form";
import { CreateGroupType, ICreateGroupContext } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema } from "./schemas";
import { debounce } from "@/shared/lib/utils/debounce";
import { MAX_GROUP_SIZE, steps } from "./constants";
import { useModal } from "@/shared/lib/providers/modal";
import { SearchUser } from "@/shared/model/types";
import { profileAPI } from "@/entities/profile";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { checkFormErrors } from "@/shared/lib/utils/checkFormErrors";
import { useNavigate } from "react-router-dom";
import { createGroupAPI } from "../api";
import { CreateGroupContext } from "./context";

export const CreateGroupProvider = ({ children }: { children: React.ReactNode }) => {
    const { isModalDisabled, onAsyncActionModal } = useModal();

    const [step, setStep] = React.useState(0);
    const [selectedUsers, setSelectedUsers] = React.useState<Map<string, SearchUser>>(new Map());
    const [searchedUsers, setSearchedUsers] = React.useState<Array<SearchUser>>([]);

    const form = useForm<CreateGroupType>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: '',
            username: '',
            login: ''
        },
        mode: 'onChange',
        shouldFocusError: true,
    })

    React.useEffect(() => {
        setTimeout(form.setFocus, 0, steps[step]?.fields[0]);
    }, [step]);

    const navigate = useNavigate();

    const isNextButtonDisabled = () => {
        const isFieldEmpty = step !== 1 && !form.getValues(steps[step]?.fields).every?.(Boolean);
        const isFieldHasErrors = !!Object.entries(form.formState.errors).some(([key]) => steps[step]?.fields.includes(key as FieldPath<CreateGroupType>));
        const fieldErrors = isFieldEmpty || isFieldHasErrors;

        return fieldErrors || isModalDisabled;
    }

    const handleBack = () => setStep(prevState => prevState - 1);
    
    const handleRemove = (id: string) => setSelectedUsers((prevState) => {
        const newState = new Map([...prevState]);

        newState.delete(id);

        return newState;
    })

    const handleSearchDelay = debounce(async (value: string) => {
        onAsyncActionModal(() => profileAPI.search({ query: value }), {
            onReject: () => setSearchedUsers([]),
            onResolve: ({ data }) => setSearchedUsers(data),
            closeOnError: false,
            closeOnSuccess: false
        });
    }, 500)

    const handleSearchUser = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = value.trim();

        if (!value || !trimmedValue.length) return setSearchedUsers([]);

        if (trimmedValue.length > MIN_USER_SEARCH_LENGTH) {
            handleSearchDelay(trimmedValue);
        }
    }

    const handleSelect = (user: SearchUser) => setSelectedUsers((prevState) => {
        const newState = new Map([...prevState]);
        const isNew = !newState.has(user._id);

        if (prevState.size + 1 === MAX_GROUP_SIZE && isNew) return prevState; // +1 cuz of initiator

        isNew ? newState.set(user._id, user) : newState.delete(user._id);

        return newState
    })

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValid = await form.trigger(steps[step].fields, { shouldFocus: true });

        if (!isValid) return;

        const { username, ...rest } = form.getValues();

        if (step === steps.length - 1) {
            onAsyncActionModal(() => createGroupAPI.create({ ...rest, participants: [...selectedUsers.keys()] }), {
                onReject: (error) => checkFormErrors({ error, fields: steps[step].fields, form }),
                onResolve: ({ data }) => navigate(`/group/${data._id}`)
            })
        } else {
            setStep((prevState) => prevState + 1);
        }
    }

    const value: ICreateGroupContext = {
        form,
        step,
        selectedUsers,
        searchedUsers,
        isNextButtonDisabled,
        onSubmit,
        handleSelect,
        handleRemove,
        handleSearchUser,
        handleBack
    }

    return (
        <CreateGroupContext.Provider value={value}>
            {children}
        </CreateGroupContext.Provider>
    )
}