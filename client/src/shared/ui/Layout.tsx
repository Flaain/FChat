import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main>
            <aside>
                <div>Aside</div>
            </aside>
            <Outlet />
        </main>
    );
};

export default Layout;