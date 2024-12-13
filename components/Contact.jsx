"use client";

import { useState, useEffect } from "react";
import { firestore } from "../firebase/config"; // Import firestore from your config
import { collection, getDocs } from "firebase/firestore"; // Import firestore functions

export default function Contact({ toggleSidebar }) {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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
          onClick={toggleSidebar} // Close sidebar when clicked
        />
        <h3 className="text-lg font-semibold text-gray-800">New Chat</h3>
      </div>

      {/* Search Bar */}
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

      {/* Contact List with Scroller */}
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

