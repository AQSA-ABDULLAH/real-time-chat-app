"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/config"; // Correct Firestore import
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // To store the logged-in user's data
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          username: user.displayName || user.email.split("@")[0], // Fallback to email if displayName is missing
        });
      } else {
        console.error("No user is logged in.");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const q = query(collection(firestore, "chats"), where("members", "array-contains", currentUser?.id)); // Fetch chats where the current user is a member
        const querySnapshot = await getDocs(q);
        const chatData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData);
      } catch (error) {
        console.error("Error fetching chats from Firestore:", error);
      }
    };

    if (currentUser) {
      fetchChats(); // Fetch chats only if the user is logged in
    }
  }, [currentUser]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = chats.filter((chat) => {
    const username = chat.username ? chat.username.toLowerCase() : ""; // Default to empty string if undefined
    const message = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text.toLowerCase() : ""; // Last message text
    return (
      username.includes(searchQuery.toLowerCase()) ||
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
                alt={`Avatar for ${chat.username}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{chat.username}</p>
              <p className="text-sm text-gray-500 truncate">{chat.messages[chat.messages.length - 1]?.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

