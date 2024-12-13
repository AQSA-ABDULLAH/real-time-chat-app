"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/config"; // Correct Firestore import

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "chats")); // Use 'firestore' here
        const chatData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData);
      } catch (error) {
        console.error("Error fetching chats from Firestore:", error);
      }
    };

    fetchChats();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = chats.filter((chat) => {
    const name = chat.name ? chat.name.toLowerCase() : ""; // Default to empty string if undefined
    const message = chat.message ? chat.message.toLowerCase() : ""; // Default to empty string if undefined
    return (
      name.includes(searchQuery.toLowerCase()) ||
      message.includes(searchQuery.toLowerCase())
    );
  });

  const handleChatClick = (chatId) => {
    router.push(`/chats/${chatId}`);
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
        className="overflow-y-auto px-2 h-[calc(93vh-70px)]"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#D1D5DB #F3F4F6",
        }}
      >
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="flex items-center p-3 bg-white border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-300 flex-shrink-0">
              <img
                src={chat.avatar || "/default-avatar.png"} // Fallback avatar
                alt={`Avatar for ${chat.name}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{chat.username}</p>
              <p className="text-sm text-gray-500 truncate">{chat.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


