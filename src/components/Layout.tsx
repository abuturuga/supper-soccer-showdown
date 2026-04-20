import { NavLink, Outlet } from "react-router";

export const Layout = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <nav className="w-[30px] h-full bg-gray-900 flex flex-col items-center gap-6 py-4 shrink-0">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                        `text-xs font-semibold tracking-widest [writing-mode:vertical-rl] rotate-180 hover:text-white transition-colors ${isActive ? "text-white" : "text-gray-400"}`
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/team-generation"
                    className={({ isActive }) =>
                        `text-xs font-semibold tracking-widest [writing-mode:vertical-rl] rotate-180 hover:text-white transition-colors ${isActive ? "text-white" : "text-gray-400"}`
                    }
                >
                    Teams
                </NavLink>
            </nav>

            {/* Main area */}
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                {/* Top bar */}
                <header className="bg-gray-800 text-white px-4 py-2 shrink-0">
                    <h1 className="text-lg font-bold">Epic Soccer</h1>
                </header>

                {/* Page content */}
                <main className="flex-1 max-w-300 mx-auto w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
