"use client";

import { Logout } from "@mui/icons-material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const MediumHeader = ({ username }) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        // Remove userEmail from localStorage
        localStorage.removeItem("userId");
        router.push("/");
        console.log("User logged out");
    };

    const logoSrc = "";
    const profileImgSrc = "";

    return (
        <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">
            {/* Logo */}
            <div className="flex gap-6 items-center">
                {logoSrc ? (
                    <img src={logoSrc} alt="img" />
                ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full" /> // Fallback if no logo image
                )}
                {/* Display username */}
                <h1>{username ? username : "Username"}</h1>
            </div>

            {/* Menu */}
            <div className="flex items-center space-x-6">

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

export default MediumHeader;
