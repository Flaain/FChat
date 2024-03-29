import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "../model/router";
import { Profile } from "@/shared/model/types";
import { clearSession, createSession } from "@/entities/session/model/slice";
import { useAppDispatch } from "@/shared/model/hooks";

const App = () => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        (async () => {
           try {
                const profile = await new Promise<Profile>((resolve) => {
                    setTimeout(() => {
                        resolve({
                            id: window.crypto.randomUUID(),
                            username: "User",
                            email: "g7yJt@example.com",
                            conversations: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        });
                    }, 5000);
                })

                dispatch(clearSession());
           } catch (error) {
                console.error(error);
           } 
        })()
    }, []);

    return <RouterProvider router={router} />;
};

export default App;