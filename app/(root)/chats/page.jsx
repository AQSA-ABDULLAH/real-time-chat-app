"use client";

import React, { useState, useEffect } from "react";
import ChatList from "@/components/ChatList";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import StartScreen from "@/components/StartScreen";

const Chats = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId); // Retrieve userId from localStorage
    } else {
      console.error("No userId found. Redirect to login.");
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  if (!userId) {
    return <div>Loading...</div>; // Optionally, redirect to login page
  }

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
        <ChatList /> {/* Pass userId */}
      </div>

      {/* Contact Sidebar (Toggleable) */}
      <div
        className={`${
          isSidebarVisible ? "block" : "hidden"
        } fixed inset-0 md:w-1/3 md:left-0 bg-gray-800 bg-opacity-75 z-50`}
      >
        <div className="border-r border-gray-200 h-full">
          <Contact userId={userId} toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* Chat Details Section */}
      <div className="w-full md:w-2/3">
        <Header userId={userId} /> {/* Pass userId */}
        <StartScreen /> {/* Pass userId */}
      </div>
    </div>
  );
};

export default Chats;


