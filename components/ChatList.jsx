import React from 'react';

export default function ChatList() {
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

      {/* Chat List */}
      <div className="space-y-4">
        {Array(10).fill(null).map((_, index) => (
          <div
            key={index}
            className="flex items-center p-3 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-blue-300 flex-shrink-0"></div>
            <div className="ml-3">
              <p className="font-semibold text-gray-800">Chat {index + 1}</p>
              <p className="text-sm text-gray-500 truncate">This is a preview of the chat message...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

