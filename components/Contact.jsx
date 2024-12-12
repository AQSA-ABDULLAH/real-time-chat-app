"use client";

import React, { useState, useEffect } from "react";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

export default function Contact() {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const storage = getStorage();
                const listRef = ref(storage, "Users"); // Point to the Users folder
                const fileList = await listAll(listRef);

                const contactList = await Promise.all(
                    fileList.items.map(async (fileRef) => {
                        const url = await getDownloadURL(fileRef);
                        const response = await fetch(url);
                        return response.json(); // Parse JSON data
                    })
                );

                setContacts(contactList);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        fetchContacts();
    }, []);

    // Filter contacts based on the search term
    const filteredContacts = contacts.filter((contact) =>
        contact.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 bg-gray-100 h-full">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Contacts List */}
            <ul className="space-y-2">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                        <li
                            key={contact.id}
                            className="p-3 bg-white rounded-lg shadow hover:bg-gray-200 cursor-pointer"
                        >
                            {contact.name}
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">No contacts found</p>
                )}
            </ul>
        </div>
    );
}

