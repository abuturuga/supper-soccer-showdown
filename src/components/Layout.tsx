import { Outlet } from "react-router";

export const Layout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <div className="flex flex-col flex-1 h-screen overflow-hidden">
                <header className="bg-gray-800 text-white px-4 py-2 shrink-0">
                    <h1 className="text-lg font-bold">Epic Soccer</h1>
                </header>

                <main className="flex-1 max-w-300 mx-auto w-full p-2">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
