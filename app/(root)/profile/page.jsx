'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';

export default function Page() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId); // Retrieve userId from localStorage
        } else {
            console.error("No userId found. Redirect to login.");
        }
    }, []);

    if (!userId) {
        return <div>Loading...</div>; // Optionally, redirect to login page
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <div>
            <Header userId={userId} />
            <section className="h-screen flex flex-col gap-6 justify-center items-center">
                {/* Profile Image */}
                <div className="text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                        {image ? (
                            <img src={image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="bg-gray-300 w-full h-full flex items-center justify-center text-white">
                                <span>Upload</span>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        id="file-upload"
                        name="file-upload"
                        className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={handleImageChange}
                    />
                </div>

                {/* Name Input */}
                <div className="mb-4 w-72">
                    <label htmlFor="name-input" className="block mb-2 text-sm font-medium text-gray-700">
                        Edit Your Name
                    </label>
                    <input
                        type="text"
                        id="name-input"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter your name..."
                    />
                </div>

                {/* Save Changes Button */}
                <div>
                    <button
                        className="w-72 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg font-semibold"
                    >
                        Save Changes
                    </button>
                </div>
            </section>
        </div>
    );
}

