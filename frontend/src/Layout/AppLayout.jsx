import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AppLayout() {
    return (
        <div className="dark:bg-gray-800 sm:pl-10 dark:text-white flex min-h-screen">
            {/* Sidebar - Hidden on Mobile, Fixed on Larger Screens */}
            <Sidebar />

            {/* Main Content Wrapper */}
            <div className="flex flex-col flex-1 h-screen sm:ml-[20%] ml-0 w-full">
                {/* Navbar - Fixed */}
                <Navbar />

                {/* Main Content - Responsive Width */}
                <main className="flex-1 overflow-auto p-6 mt-[4rem]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
