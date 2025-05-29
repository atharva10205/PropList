"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // NEW: loading state

  // Fetch userId
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

  // Fetch property data
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
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    get_data();
  }, [userId]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1">
      <div className="w-56 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar />
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Favorites</h1>


          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties.map((item) => (
                <div
                  key={item.id}
                  className="w-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-200"
                >
                  <div className="relative">
                    <img
                      src={item.imageURLs?.[0] || "/placeholder.jpg"}
                      alt={item.propertyName || "Property Image"}
                      className="h-48 w-full object-cover"
                      onClick={() => router.push(`/property/${item.id}`)}
                    />
                  </div>

                  <div
                    onClick={() => router.push(`/property/${item.id}`)}
                    className="p-4"
                  >
                    <h2 className="text-lg font-bold">
                      {item.propertyName || "Unnamed Property"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.city || "Unknown City"},{" "}
                      {item.state || "Unknown State"},{" "}
                      {item.country || "Unknown Country"}
                    </p>
                    <div className="flex items-center mb-3">
                      <span className="text-sm font-semibold ml-auto">
                        {item.pricePerMonth
                          ? `₹${item.pricePerMonth}`
                          : "Price N/A"}
                      </span>
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <img
                          className="h-[15px] ml-2 w-[15px]"
                          src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                          alt=""
                        />
                        {item.beds || 0} Bed
                      </div>
                      <div className="flex items-center gap-1">
                        <img
                          className="h-[15px] w-[15px]"
                          src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                          alt=""
                        />
                        {item.baths || 0} Bath
                      </div>
                      <div className="flex items-center gap-1">
                        <img
                          className="h-[16px] w-[16px]"
                          src="https://img.icons8.com/?size=100&id=912&format=png&color=000000"
                          alt=""
                        />
                        {item.amenities || "Amenities"}
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
