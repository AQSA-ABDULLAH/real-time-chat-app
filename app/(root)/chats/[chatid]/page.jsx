"use client";

import React, { useState } from "react";
import ChatDetails from "@/components/ChatDetail";
import ChatList from "@/components/ChatList";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import ChatDetail from "@/components/ChatDetail";

const Chats = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Initially set to false to hide the sidebar

    const toggleSidebar = () => {
        setIsSidebarVisible((prevState) => !prevState); // Toggle the sidebar visibility
    };

    return (
        <div className="main-container flex flex-col md:flex-row h-full">
            {/* Sidebar ChatList */}
            <div className="w-full md:w-1/3 border-r border-gray-200 relative">
                <div className="mx-5 mt-8 mb-4 flex justify-between">
                    <h1 className="text-[26px] font-semibold text-gray-800">
                        Chats
                    </h1>

                    <img
                        src="/assest/add.png"
                        alt="Toggle Sidebar"
                        onClick={toggleSidebar}
                        className="h-[32px] cursor-pointer"
                    />
                </div>
                <ChatList />
            </div>

            {/* Contact Sidebar (Toggleable) */}
            <div
                className={`${isSidebarVisible ? "block" : "hidden"
                    } fixed inset-0 md:w-1/3 md:left-0 bg-gray-800 bg-opacity-75 z-50`}
            >
                <div className="border-r border-gray-200 h-full">
                    <Contact toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar */}
                </div>
            </div>

            {/* Chat Details Section */}
            <div className="w-full md:w-2/3">
                <Header />
                <ChatDetail />
            </div>
        </div>
    );
};

export default Chats;
