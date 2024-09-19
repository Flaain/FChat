import { createZustandContext } from "@/shared/lib/utils/createZustandContext";
import { CreateGroupStore, CreateGroupType } from "./types";
import { createStore } from "zustand";
import { FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema } from "./schemas";
import { MAX_GROUP_SIZE, steps } from "./constants";
import { useModal } from "@/shared/lib/providers/modal";
import { debounce } from "@/shared/lib/utils/debounce";
import { profileAPI } from "@/entities/profile";
import { MIN_USER_SEARCH_LENGTH } from "@/shared/constants";
import { SearchUser } from "@/shared/model/types";
import { createGroupAPI } from "../api";
import { checkFormErrors } from "@/shared/lib/utils/checkFormErrors";
import { redirect } from "react-router-dom";

export const { Provider: CreateGroupProvider, useContext: useCreateGroup } = createZustandContext<CreateGroupStore>(() => createStore((set, get) => ({
    searchedUsers: [],
    selectedUsers: new Map(),
    step: 0,
    form: useForm<CreateGroupType>({
        resolver: zodResolver(createGroupSchema),
        defaultValues: {
            name: '',
            username: '',
            login: ''
        },
        mode: 'onChange',
        shouldFocusError: true,
    }),
    isNextButtonDisabled: () => {
        const isFieldEmpty = get().step !== 1 && !get().form.getValues(steps[get().step]?.fields).every?.(Boolean);
        const isFieldHasErrors = !!Object.entries(get().form.formState.errors).some(([key]) => steps[get().step]?.fields.includes(key as FieldPath<CreateGroupType>));
        const fieldErrors = isFieldEmpty || isFieldHasErrors;

        return fieldErrors || !!useModal.getState().isModalDisabled;
    },
    handleBack: () => set((prevState) => ({ step: prevState.step - 1 })),
    handleRemove: (id: string) => set((prevState) => {
        const newState = new Map([...prevState.selectedUsers]);

        newState.delete(id);

        return { selectedUsers: newState };
    }),
    handleSearchDelay: debounce(async (value: string) => {
        useModal.getState().onAsyncActionModal(() => profileAPI.search({ query: value }), {
            onReject: () => set({ searchedUsers: [] }),
            onResolve: ({ data }) => set({ searchedUsers: data }),
            closeOnError: false,
            closeOnSuccess: false
        });
    }, 500),
    handleSearchUser: ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const trimmedValue = value.trim();

        if (!value || !trimmedValue.length) return set({ searchedUsers: [] });

        if (trimmedValue.length > MIN_USER_SEARCH_LENGTH) {
            useModal.setState({ isModalDisabled: true });
            get().handleSearchDelay(trimmedValue);
        }
    },
    handleSelect: (user: SearchUser) => set((prevState) => {
        const newState = new Map([...prevState.selectedUsers]);
        const isNew = !newState.has(user._id);

        if (prevState.selectedUsers.size + 1 === MAX_GROUP_SIZE && isNew) return prevState; // +1 cuz of initiator

        isNew ? newState.set(user._id, user) : newState.delete(user._id);

        return { selectedUsers: newState };
    }),
    onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isValid = await get().form.trigger(steps[get().step].fields, { shouldFocus: true });

        if (!isValid) return;

        const { username, ...rest } = get().form.getValues();

        if (get().step === steps.length - 1) {
            useModal.getState().onAsyncActionModal(() => createGroupAPI.create({ ...rest, participants: [...get().selectedUsers.keys()] }), {
                onReject: (error) => checkFormErrors({ error, form: get().form, step: get().step, steps }),
                onResolve: ({ data }) => {
                    get().form.reset();
                    set({ searchedUsers: [], selectedUsers: new Map(), step: 0 })
                    redirect(`/group/${data._id}`)
                }})
        } else {
            set((prevState) => ({ step: prevState.step + 1 }));
        }
    }
})))