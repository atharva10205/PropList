"use client";
import React, { useEffect, useState } from "react";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Spinner state

  // Get the logged-in user's ID
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
          console.log("User ID:", data.userId);
        } else {
          console.error("Error from backend:", data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getProperties = async () => {
      try {
        const response = await fetch("/api/users_properties", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        setProperties(data); // Store fetched properties
        console.log("Fetched properties:", data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, [userId]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar_manager />
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <h1 className="text-2xl font-bold">My Properties</h1>
          <h3 className="mb-4 text-gray-600">
            View and manage your properties listing
          </h3>

          {loading ? (
            <div className="flex justify-center  items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black  rounded-full animate-spin"></div>
              </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 mt-4">
              {properties.length === 0 ? (
                <p className="text-gray-500">No properties found.</p>
              ) : (
                properties.map((property, index) => (
                  <div
                    key={index}
                    className="w-80 rounded-2xl  overflow-hidden shadow-lg border cursor-pointer border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src={
                          property.imageURLs?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={property.propertyName}
                        className="h-48 w-full object-cover"
                        onClick={() => router.push(`/property/${property.id}`)}
                      />
                    </div>
                    <div
                      onClick={() => router.push(`/property/${property.id}`)}
                      className="p-4"
                    >
                      <h2 className="text-lg font-bold">
                        {property.propertyName}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {property.address}, {property.city},{" "}
                        {property.country}
                      </p>
                      <div className="flex  items-center mb-4">
                        <span className="text-sm font-semibold ml-auto">
                          ${property.pricePerMonth}
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
                          {property.beds} Bed
                        </div>
                        <div className="flex items-center gap-1">
                          <img
                            className="h-[15px] w-[15px]"
                            src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                            alt=""
                          />
                          {property.baths} Bath
                        </div>
                        <div className="flex items-center gap-1">
                          <img
                            className="h-[16px] w-[16px]"
                            src="https://img.icons8.com/?size=100&id=912&format=png&color=000000"
                            alt=""
                          />
                          {property.amenities || "Amenities"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
