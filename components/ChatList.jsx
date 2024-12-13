"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter(); // Initialize router

  useEffect(() => {
    fetch("/data/chat.json")
      .then((response) => response.json())
      .then((data) => setChats(data))
      .catch((error) => console.error("Error fetching chat data:", error));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    router.push(`/chats/${chatId}`); // Redirect to ChatDetails with chatId
  };

  return (
    <div className="h-full">
      <div className="mb-4 mx-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full p-2 bg-gray-100 border rounded-lg focus:outline-none"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div
        className="overflow-y-auto px-2 h-[calc(93vh-70px)]" // Set height dynamically
        style={{
          scrollbarWidth: "thin", // For Firefox
          scrollbarColor: "#D1D5DB #F3F4F6", // Custom colors
        }}
      >
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)} // Handle click to redirect
            className="flex items-center p-3 bg-white border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-300 flex-shrink-0">
              <img
                src={chat.avatar}
                alt={`Avatar for ${chat.name}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{chat.name}</p>
              <p className="text-sm text-gray-500 truncate">{chat.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

