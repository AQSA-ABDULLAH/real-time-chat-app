"use client";

import { Logout } from "@mui/icons-material";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    // Remove userEmail from localStorage
    localStorage.removeItem("userEmail");
    router.push("/");
    console.log("User logged out");
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      {/* Logo */}
      <Link href="/chats">
        <img
          src="/assest/logo.png"
          alt="logo"
          className="h-12 cursor-pointer"
        />
      </Link>

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
            src="/"
            alt="profile"
            className="w-10 h-10 rounded-full border border-gray-300 object-cover cursor-pointer"
          />
        </Link>
      </div>
    </div>
  );
};

export default Header;