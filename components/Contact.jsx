"use client";

import { useState, useEffect } from "react";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    // Fetch data from the contact.json file
    fetch("/data/contact.json")
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const name = contact?.name?.toLowerCase() || ""; // Safely access name and fallback to empty string
    const lastMessage = contact?.lastMessage?.toLowerCase() || ""; // Safely access lastMessage and fallback to empty string
    return (
      name.includes(searchQuery.toLowerCase()) ||
      lastMessage.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <section className="p-4 bg-gray-100 h-full">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery} // Bind search input value
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      {/* Contact List */}
      <ul className="space-y-4">
        {filteredContacts.map((contact) => (
          <li key={contact.id} className="p-4 border rounded-lg bg-white">
            <h3 className="font-bold">{contact.name}</h3>
            <p className="text-gray-600">{contact.lastMessage}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

