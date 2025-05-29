"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Loading state

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

    const get_applications = async () => {
      try {
        const response = await fetch("/api/application_data_tenent", {
          method: "POST",
          credentials: "include",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        console.log("data", data);
        setdata(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false); // ✅ Stop loading after fetch
      }
    };

    get_applications();
  }, [userId]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Residences</h1>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-7 mt-4">
              {data?.applications
                ?.filter((property) => property.status === "accepted")
                .map((property, index) => (
                  <div
                    key={index}
                    className="rounded-2xl flex flex-row shadow-lg border border-gray-300 w-[1200px]"
                  >
                    <div>
                      <div className="w-80 rounded-2xl h-[330px] overflow-hidden shadow-lg border cursor-pointer border-gray-300">
                        <div className="relative">
                          <img
                            src={
                              property.propertyimage ||
                              "https://via.placeholder.com/300"
                            }
                            alt={property.propertyName}
                            className="h-48 w-full object-cover"
                            onClick={() =>
                              router.push(`/property/${property.addId}`)
                            }
                          />
                        </div>
                        <div
                          onClick={() =>
                            router.push(`/property/${property.addId}`)
                          }
                          className="p-4"
                        >
                          <h2 className="text-lg font-bold">
                            {property.propertyName}
                          </h2>
                          <p className="text-sm text-gray-600 mb-2">
                            {property.address || ""} {property.city || ""}{" "}
                            {property.country || ""}
                          </p>
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-semibold ml-auto">
                              ${property.pricePerMonth}
                            </span>
                            <span className="text-sm text-gray-500">
                              /month
                            </span>
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
                              {property.amenities || ""}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4  mr-4 ml-4">
                      <div className="flex-shrink-0 p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg min-w-[200px] md:w-auto">
                        <h1 className="font-bold mb-2">Payment Method</h1>
                      </div>

                      <div className="flex-grow p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg w-[640px]">
                        <h1 className="font-bold mb-2">Billing History</h1>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
