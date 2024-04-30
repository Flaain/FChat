import React from "react";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { useProfile } from "./useProfile";
import { useModal } from "./useModal";
import { SessionTypes } from "@/entities/session/model/types";
import { localStorageKeys } from "@/shared/constants";

export const useLayout = () => {
    const { setProfile } = useProfile();
    const { dispatch } = useSession();
    const { openModal } = useModal();

    const [searchValue, setSearchValue] = React.useState("");

    const handleLogout = React.useCallback(() => {
        setProfile(undefined!);
        dispatch({ type: SessionTypes.SET_ON_LOGOUT, payload: { isAuthorized: false } });
        localStorage.removeItem(localStorageKeys.TOKEN);
    }, [])

    const handleSearch = React.useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(!value || !value.trim().length ? "" : value);
    }, []);

    return { searchValue, handleSearch, handleLogout, openModal };
}