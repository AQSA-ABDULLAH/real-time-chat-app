"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    
    // Redirect based on the presence of userEmail
    if (!userEmail && router.asPath === "/push") {
      router.push("/");
    } else if (userEmail) {
      router.push("/chats");
    }
  }, [router]);

  return (
    <div>
      <Form type="login" />
    </div>
  );
}

