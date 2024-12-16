import React, { useState, useEffect } from "react";
import { firestore } from "../firebase/config"; // Import Firestore instance
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; // Correct imports for Firebase v9+

export default function ChatDetail({ chatId, currentUser }) {
  const [message, setMessage] = useState(""); // State to capture the message
  const [chatData, setChatData] = useState(null); // State to hold the chat data

  // Set up real-time listener for chat data
  useEffect(() => {
    const chatDocRef = doc(firestore, "chats", chatId);

    // Set up the real-time listener
    const unsubscribe = onSnapshot(chatDocRef, (chatDocSnap) => {
      if (chatDocSnap.exists()) {
        setChatData(chatDocSnap.data()); // Update state with the latest chat data
      } else {
        console.log("No such chat!");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
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
    <div className=" h-full flex flex-col">
      <div className="p-4">
      {chatData && (
        <>
          <p className="text-gray-600 mb-6">Chat with {chatData.username}</p>
          <div className="flex-grow overflow-y-auto">
            {chatData.messages &&
              chatData.messages.map((msg, index) => (
                <div key={index} className="mb-3 flex">
                  <div
                    className={`${
                      msg.userId === currentUser.uid
                        ? "ml-auto bg-blue-500 text-white"
                        : "mr-auto bg-gray-200 text-gray-800"
                    } p-3 rounded-lg max-w-[75%] break-words`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
      </div>

      {/* Chat input section fixed at the bottom */}
      <div className="fixed bottom-0 w-[66%] flex gap-3 bg-black bg-opacity-10 px-4 py-3">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Send Message..."
          className="flex-grow p-2 border border-black border-opacity-40 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleSendMessage} // Trigger message send function
          className="px-8 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Send
        </button>
      </div>
    </div>
  );
}



