import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config"; // Import Firestore instance
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"; // Correct imports for Firebase v9+

export default function ChatDetail({ chatId, currentUser }) {
  const [message, setMessage] = useState(""); // State to capture the message
  const [chatData, setChatData] = useState(null); // State to hold the chat data

  // Fetch chat data when component mounts or chatId changes
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chatDocRef = doc(firestore, "chats", chatId);
        const chatDocSnap = await getDoc(chatDocRef);

        if (chatDocSnap.exists()) {
          setChatData(chatDocSnap.data());
        } else {
          console.log("No such chat!");
        }
      } catch (error) {
        console.error("Error fetching chat data: ", error);
      }
    };

    if (chatId) fetchChatData();
  }, [chatId]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value); // Update the message state on input change
  };

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      try {
        // Create a new message object
        const newMessage = {
          text: message,
          userId: currentUser.uid, // Add current user UID
          timestamp: new Date(),
        };

        // Add the new message to the messages array of the specific chat
        const chatDocRef = doc(firestore, "chats", chatId);
        await updateDoc(chatDocRef, {
          messages: arrayUnion(newMessage), // Add to the messages array
        });

        // Clear the input after sending the message
        setMessage("");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Chat ID: {chatId}</h1>
      {/* Display specific currentUser properties */}
      <h1 className="text-2xl font-bold mb-4">
        User ID: {currentUser ? currentUser.uid : "Loading..."}
      </h1>

      {chatData && (
        <>
          <p className="text-gray-600 mb-6">Chat with {chatData.username}</p>
          <div className="flex-grow overflow-y-auto">
            {chatData.messages &&
              chatData.messages.map((msg, index) => (
                <div key={index} className="mb-3">
                  <div>
                    <span className="font-semibold">{msg.userId}</span>:{" "}
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      {/* Chat input section fixed at the bottom */}
      <div className="fixed bottom-0 w-[65%] flex gap-3 border-t-2 bg-white px-4 py-3">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Send Message..."
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage} // Trigger message send function
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}

