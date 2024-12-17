"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, onSnapshot, query, where, getDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/config";
import { getAuth } from "firebase/auth";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // Fetch the current user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          username: user.displayName || user.email.split("@")[0],
        });
      } else {
        console.error("No user is logged in.");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Real-time listener for chats
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(firestore, "chats"),
      where("members", "array-contains", currentUser.id)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatData = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          // Find the other user's ID (not the current user)
          const otherUserId = data.members.find((id) => id !== currentUser.id);

          // Fetch other user's details
          let otherUser = { username: "Unknown User" };
          if (otherUserId) {
            const userDoc = await getDoc(doc(firestore, "users", otherUserId));
            if (userDoc.exists()) {
              otherUser = userDoc.data();
            }
          }

          return {
            id: docSnapshot.id,
            ...data,
            otherUser, // Add other user details
          };
        })
      );
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = chats.filter((chat) => {
    const username = chat.otherUser?.username
      ? chat.otherUser.username.toLowerCase()
      : "";
    const message =
      chat.messages && chat.messages.length > 0
        ? chat.messages[chat.messages.length - 1]?.text.toLowerCase()
        : "";
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
                src="/assest/profile-image.png"
                alt={`Avatar for ${chat.otherUser?.username || "User"}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">
                {chat.otherUser?.username || "Unknown User"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {chat.messages?.[chat.messages.length - 1]?.text || "No messages yet"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}