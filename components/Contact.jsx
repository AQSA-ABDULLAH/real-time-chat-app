import React from 'react'

export default function Contact() {
    return (
        <div className="p-4 bg-gray-100 h-full">
            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search chats..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
    )
}
