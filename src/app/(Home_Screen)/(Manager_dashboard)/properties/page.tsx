"use client";

import React, { useEffect, useState } from "react";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image"; // ✅ Import Image component

// Define a Property type
type Property = {
  id: string;
  imageURLs?: string[];
  propertyName: string;
  address: string;
  city: string;
  country: string;
  pricePerMonth: number;
  beds: number;
  baths: number;
  amenities?: string;
};

const Page = () => {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

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

        const data: Property[] = await response.json();
        setProperties(data);
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

      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white shadow-md flex justify-between items-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-black focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-20 top-[50px] left-0 h-full w-64 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar_manager />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div
          className={`flex-1 overflow-y-auto p-6 bg-white transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-50 md:opacity-100" : "opacity-100"
          }`}
        >
          <h1 className="text-2xl font-bold">My Properties</h1>
          <h3 className="mb-4 text-gray-600">
            View and manage your properties listing
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {properties.length === 0 ? (
                <p className="text-gray-500">No properties found.</p>
              ) : (
                properties.map((property) => (
                  <div
                    key={property.id}
                    className="w-full rounded-2xl overflow-hidden hover:shadow-xl border cursor-pointer border-gray-300"
                  >
                    <div
                      className="relative h-48 w-full"
                      onClick={() => router.push(`/property/${property.id}`)}
                    >
                      <Image
                        src={
                          property.imageURLs?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={property.propertyName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
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
                        {property.address}, {property.city}, {property.country}
                      </p>
                      <div className="flex items-center mb-4">
                        <span className="text-sm font-semibold ml-auto">
                          ₹{property.pricePerMonth}
                        </span>
                        <span className="text-sm text-gray-500">/month</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <Image
                            src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                            alt="bed"
                            width={15}
                            height={15}
                          />
                          {property.beds} Bed
                        </div>
                        <div className="flex items-center gap-1">
                          <Image
                            src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                            alt="bath"
                            width={15}
                            height={15}
                          />
                          {property.baths} Bath
                        </div>
                        <div className="flex items-center gap-1">
                          <Image
                            src="https://img.icons8.com/?size=100&id=912&format=png&color=000000"
                            alt="amenities"
                            width={16}
                            height={16}
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
