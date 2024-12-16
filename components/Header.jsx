"use client";

import { Logout } from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react"; 
import { db } from "../firebase/config"; 
import { doc, getDoc } from "firebase/firestore"; 

const Header = ({ userId }) => {
  const [userName, setUserName] = useState(""); 
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      console.log("Fetching username for userId:", userId); 

      const fetchUserName = async () => {
        try {
          const userDocRef = doc(db, "users", userId); 
          const userDoc = await getDoc(userDocRef); 

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("Fetched user data:", userData); 
            setUserName(userData.username);
          } else {
            console.log("No such user document!");
            setUserName("User"); 
          }
        } catch (error) {
          console.error("Error fetching username:", error);
          setUserName("Error fetching username"); 
        } finally {
          setLoading(false); 
        }
      };

      fetchUserName();
    }
  }, [userId]);

  const handleLogout = async () => {
    
    localStorage.removeItem("userEmail");
    router.push("/");  
    console.log("User logged out");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      {/* Logo */}
      <div className="flex gap-4 text-[20px] items-center">
        <Link href="/chats">
          <img
            src="/assest/logo.png"
            alt="logo"
            className="h-12 cursor-pointer"
          />
        </Link>

        {loading ? (
          <h1>Loading...</h1> 
        ) : (
          <h1>Welcome, {userName}</h1>
        )}
      </div>

      {/* Menu */}
      <div className="flex items-center space-x-6">
        <Link
          href="/chats"
          className={`${
            pathname === "/chats" ? "text-red-600" : "text-gray-800"
          } text-lg font-semibold hover:text-red-600`}
        >
          Chats
        </Link>
        <Link
          href="/contacts"
          className={`${
            pathname === "/contacts" ? "text-red-600" : "text-gray-800"
          } text-lg font-semibold hover:text-red-600`}
        >
          Contacts
        </Link>

        {/* Logout Icon */}
        <Logout
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 color-#737373 cursor-pointer transition duration-200"
        />

        {/* Profile Image */}
        <Link href="/profile">
          <img
            src="/assest/profile-image.png"
            alt="profile"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;