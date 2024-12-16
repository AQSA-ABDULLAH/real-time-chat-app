"use client";

import { useState, useEffect } from "react";
import { firestore } from "../firebase/config";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth

export default function Contact({ toggleSidebar }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null); // To store the logged-in user's data

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Save the current user data
        setCurrentUser({
          id: user.uid, // User ID
          username: user.displayName || user.email.split("@")[0], // Username or fallback
        });
      } else {
        console.error("No user is currently logged in.");
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const contactsCollection = collection(firestore, "users");
        const contactsSnapshot = await getDocs(contactsCollection);
        const contactsList = contactsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(contactsList);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleContactClick = async (contact) => {
    if (!currentUser) {
      console.error("No user is logged in. Cannot create chat.");
      return;
    }

    try {
      const chatsCollection = collection(firestore, "chats");
      const q = query(
        chatsCollection,
        where("members", "array-contains", currentUser.id)
      );
      const querySnapshot = await getDocs(q);

      const existingChat = querySnapshot.docs.find((doc) =>
        doc.data().members.includes(contact.id)
      );

      if (existingChat) {
        console.log("Chat already exists with this contact.");
        toggleSidebar();
      } else {
        // Define the chat schema
        const newChat = {
          members: [currentUser.id, contact.id],
          username: contact.username,
          avatar: contact.avatar || null,
          messages: [],
          createdAt: new Date(),
        };

        await addDoc(chatsCollection, newChat);
        console.log("New chat created:", newChat);
        toggleSidebar();
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const name = contact?.username?.toLowerCase() || "";
    const email = contact?.email?.toLowerCase() || "";
    return (
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section className="p-6 bg-white h-full">
      <div className="flex items-center gap-3 pb-4">
        <img
          src="/assest/back.png"
          alt="Go Back"
          className="cursor-pointer w-7 h-6"
          onClick={toggleSidebar}
        />
        <h3 className="text-lg font-semibold text-gray-800">New Chat</h3>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h1 className="font-bold py-1 mb-4 border-b-2">AVAILABLE CONTACTS</h1>

      <ul
        className="space-y-3 overflow-y-auto h-[calc(93vh-200px)] px-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#D1D5DB #F3F4F6",
        }}
      >
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => handleContactClick(contact)}
          >
            <div className="w-12 h-12 rounded-full bg-blue-300 flex-shrink-0">
              <img
                src={contact.avatar || "https://via.placeholder.com/150"}
                alt={`Avatar for ${contact.username}`}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">{contact.username}</p>
              <p className="text-sm text-gray-500 truncate">{contact.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
