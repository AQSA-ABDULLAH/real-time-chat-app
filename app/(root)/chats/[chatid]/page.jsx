"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChatDetails() {
  const searchParams = useSearchParams();
  const chatid = searchParams.get("chatid"); // Extract chatid from query params
  const [chat, setChat] = useState(null);

  useEffect(() => {
    if (!chatid) return;

    const fetchChatDetails = async () => {
      try {
        const response = await fetch(`/api/chats/${chatid}`);
        const data = await response.json();
        setChat(data);
      } catch (error) {
        console.error("Failed to fetch chat details:", error);
      }
    };

    fetchChatDetails();
  }, [chatid]);

  return (
    <div>
      <h1>Chat Details</h1>
      {chat ? (
        <p>{chat.message}</p>
      ) : (
        <p>Loading chat details...</p>
      )}
    </div>
  );
}






