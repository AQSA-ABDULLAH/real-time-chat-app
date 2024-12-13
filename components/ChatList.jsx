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
    <div className="p-4 bg-gray-100 h-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)} // Handle click to redirect
            className="flex items-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
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
