"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch("/api/user_id", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await res.json();
        if (res.ok) {
          setUserId(data.userId);
        } else {
          console.error("Error from backend:", data.error);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setIsLoading(false);
      }
    };

    getUserId();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <div className="w-56 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar />
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
        </div>
      </div>
    </div>
  );
};

export default Page;
