"use client";

import React, { useState, useEffect } from "react";
import ChatList from "@/components/ChatList";
import Contact from "@/components/Contact";
import ChatDetail from "@/components/ChatDetail";
import { useParams } from "next/navigation";
import { getAuth } from "firebase/auth"; // Import Firebase auth module
import MediumHeader from "@/components/MediumHeader";

const ChatPage = () => {
  const { chatid } = useParams(); // Extract chatId from the URL
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State to store the current user

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  // Fetch the current user
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser; // Get the current authenticated user
    if (user) {
      setCurrentUser(user); // Set the current user if logged in
    }
  }, []);

  return (
    <div className="main-container flex flex-col md:flex-row h-full">
      {/* Sidebar ChatList */}
      <div className="w-full md:w-1/3 border-r border-gray-200 relative">
        <div className="mx-5 mt-8 mb-4 flex justify-between">
          <h1 className="text-[26px] font-semibold text-gray-800">Chats</h1>

          <img
            src="/assest/add.png"
            alt="Toggle Sidebar"
            onClick={toggleSidebar}
            className="h-[32px] cursor-pointer"
          />
        </div>
        <ChatList />
      </div>

      {/* Contact Sidebar */}
      <div
        className={`${isSidebarVisible ? "block" : "hidden"} fixed inset-0 md:w-1/3 md:left-0 bg-gray-800 bg-opacity-75 z-50`}
      >
        <div className="border-r border-gray-200 h-full">
          <Contact toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* Chat Detail Section */}
      <div className="w-full md:w-2/3">
        <MediumHeader />
        <ChatDetail chatId={chatid} currentUser={currentUser} />
      </div>
    </div>
  );
};

export default ChatPage;


