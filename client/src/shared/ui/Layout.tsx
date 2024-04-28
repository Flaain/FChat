import ConversationsList from "@/widgets/ConversationsList/ui/ui";
import { Outlet } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./Resizable";
import { saveDataToLocalStorage } from "../lib/utils/saveDataToLocalStorage";
import { localStorageKeys } from "../constants";
import { getDataFromLocalStorage } from "../lib/utils/getDataFromLocalStorage";
import { Input } from "./Input";
import { Button } from "./Button";
import { useProfile } from "../lib/hooks/useProfile";
import { useSession } from "@/entities/session/lib/hooks/useSession";
import { SessionTypes } from "@/entities/session/model/types";

const Layout = () => {
    const { setProfile } = useProfile();
    const { dispatch } = useSession();

    const handleLogout = () => {
        setProfile(undefined!);
        dispatch({ type: SessionTypes.SET_ON_LOGOUT, payload: { isAuthorized: false } });
        localStorage.removeItem(localStorageKeys.TOKEN);
    };

    return (
            <ResizablePanelGroup direction='horizontal' style={{ overflow: "unset" }}>
                <main className='flex dark:bg-primary-dark-200 w-full'>
                    <ResizablePanel
                        defaultSize={getDataFromLocalStorage({
                            key: localStorageKeys.ASIDE_PANEL_SIZE,
                            defaultData: 20,
                        })}
                        minSize={20}
                        maxSize={30}
                        style={{ overflow: "unset" }}
                        onResize={(size) =>
                            saveDataToLocalStorage({ key: localStorageKeys.ASIDE_PANEL_SIZE, data: size })
                        }
                    >
                        <aside className='flex flex-col h-screen sticky top-0 p-5 gap-8 bg-dark-side-panel'>
                            <Input
                                placeholder='Find or start a conversation'
                                className='focus:placeholder:opacity-0 placeholder:transition-opacity placeholder:duration-300 placeholder:ease-in-out dark:ring-offset-0 dark:focus-visible:ring-primary-dark-50 dark:focus:bg-primary-dark-200 dark:bg-primary-dark-100 border-none text-white hover:ring-1 dark:placeholder:text-white placeholder:opacity-50 dark:hover:ring-primary-dark-50'
                            />
                            <ConversationsList />
                            <Button onClick={handleLogout} className='mt-auto' variant='secondary'>
                                Logout
                            </Button>
                        </aside>
                    </ResizablePanel>
                    <ResizableHandle className='w-1 dark:bg-primary-dark-50 dark:hover:bg-primary-50 transition-colors duration-200 ease-in-out' />
                    <ResizablePanel className='flex' style={{ overflow: "unset" }}>
                        <Outlet />
                    </ResizablePanel>
                </main>
            </ResizablePanelGroup>
    );
};

export default Layout;