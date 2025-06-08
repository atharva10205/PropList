"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import Image from "next/image";


const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    const get_data = async () => {
      if (!userId) return;

      try {
        const response = await fetch("/api/liked_list", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const result = await response.json();
        setProperties(result);
        console.log("liked", result);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    get_data();
  }, [userId]);

 return (
  <div className="h-screen flex flex-col overflow-hidden">
    <Navbar />

    <div className="md:hidden p-4 bg-white flex justify-between items-center">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="text-black focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <h1 className="text-lg font-semibold">Favorites</h1>
    </div>

    {isSidebarOpen && (
      <div
        className="fixed inset-0 z-10 bg-opacity-50 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      ></div>
    )}

    <div className="flex flex-1 relative overflow-hidden">
      <div
        className={`fixed md:static z-20 top-[50px] left-0 h-full w-56 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto w-full">
        <h1 className="text-2xl font-bold mb-4 hidden md:block">Favorites</h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {properties.map((item) => (
              <div
                key={item.property.id}
                className="w-full rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-200"
              >
                <div className="relative">
                  <Image
                    src={item.property.imageURL || "/placeholder.jpg"}
                    alt={item.property.propertyName || "Property Image"}
                    width={400}
                    height={192}
                    className="h-48 w-full object-cover"
                    onClick={() =>
                      router.push(`/property/${item.property.id}`)
                    }
                  />
                </div>

                <div
                  onClick={() => router.push(`/property/${item.property.id}`)}
                  className="p-4"
                >
                  <h2 className="text-lg font-bold">
                    {item.property.propertyName || "Unnamed Property"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.property.city || "Unknown City"},{" "}
                    {item.property.state || "Unknown State"},{" "}
                    {item.property.country || "Unknown Country"}
                  </p>
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-semibold ml-auto">
                      {item.property.pricePerMonth
                        ? `₹${item.property.pricePerMonth}`
                        : "Price N/A"}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Image
                        src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                        alt="bed icon"
                        width={15}
                        height={15}
                        className="ml-2"
                      />
                      {item.property.beds || 0} Bed
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                        alt="bath icon"
                        width={15}
                        height={15}
                      />
                      {item.property.baths || 0} Bath
                    </div>
                    <div className="flex items-center gap-1">
                      <Image
                        src="https://img.icons8.com/?size=100&id=912&format=png&color=000000"
                        alt="amenities icon"
                        width={16}
                        height={16}
                      />
                      {item.property.amenities || "Amenities"}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {properties.length === 0 && !isLoading && (
              <p className="text-gray-500 text-center col-span-full">
                No favorites found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default Page;
