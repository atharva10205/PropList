"use client";

import React, { useState, useEffect } from "react";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [applications, setApplications] = useState(null);
  const [fadingOutIds, setFadingOutIds] = useState([]);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch("/api/user_id", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
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

    const getApplications = async () => {
      try {
        const response = await fetch("/api/application_data_manager", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const fetchedData = await response.json();
        setApplications(fetchedData);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [userId]);

  const handleRemoveWithAnimation = (id) => {
    setFadingOutIds((prev) => [...prev, id]);
    setTimeout(() => {
      setApplications((prev) =>
        prev.filter((app) => app.applicationId !== id)
      );
      setFadingOutIds((prev) => prev.filter((fid) => fid !== id));
    }, 300);
  };

  const accept_button = async (id) => {
    await fetch("/api/accept_button", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id }),
    });
    handleRemoveWithAnimation(id);
  };

  const decline_button = async (id) => {
    await fetch("/api/decline_button", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id }),
    });
    handleRemoveWithAnimation(id);
  };

  const filteredApplications =
    applications?.filter((app) => app.status === "under_process") || [];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar_manager />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Applications</h1>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
              </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 mt-4">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <div
                    key={application.applicationId}
                    className={`rounded-2xl flex flex-col lg:flex-row shadow-lg border border-gray-300 w-full transition-all duration-300 ease-in-out transform ${
                      fadingOutIds.includes(application.applicationId)
                        ? "opacity-0 -translate-y-4 scale-95"
                        : "opacity-100"
                    }`}
                  >
                    {/* Property Card */}
                    <div className="w-full lg:w-80 rounded-2xl h-auto lg:h-[360px] overflow-hidden shadow-lg border cursor-pointer border-gray-200 m-4 lg:m-0">
                      <div className="relative">
                        <img
                          src={
                            application.property.imageURL ||
                            "https://via.placeholder.com/300"
                          }
                          alt={application.property.propertyName}
                          className="h-48 w-full object-cover"
                          onClick={() =>
                            router.push(`/property/${application.property.id}`)
                          }
                        />
                      </div>
                      <div
                        onClick={() =>
                          router.push(`/property/${application.property.id}`)
                        }
                        className="p-4"
                      >
                        <h2 className="text-lg font-bold">
                          {application.property.propertyName}
                        </h2>
                        <div className="flex items-center mb-4">
                          <span className="text-sm font-semibold ml-auto">
                            ${application.property.pricePerMonth}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <img
                              className="h-[15px] ml-2 w-[15px]"
                              src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                              alt="beds icon"
                            />
                            {application.property.beds} Bed
                          </div>
                          <div className="flex items-center gap-1">
                            <img
                              className="h-[15px] w-[15px]"
                              src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                              alt="baths icon"
                            />
                            {application.property.baths} Bath
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sender Info and Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 mr-4 ml-4 flex-grow">
                      <div className="flex-shrink-0 p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg w-full md:w-auto">
                        <h1 className="font-bold">From,</h1>
                        <div className="flex flex-row mt-5 items-center">
                          <img
                            className="h-[60px] w-[60px] mr-4 rounded-full"
                            src="https://imgs.search.brave.com/5UXUrwnw8J0ENnlCfKBvy2iT3ZiU9L2WC2CXtxFJfO0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvcGZw/LXBpY3R1cmVzLWsz/ZHF4bjNuMG5heGVm/bjIuanBn"
                            alt="profile"
                          />
                          <h1 className="break-all">
                            {application.sender.username}
                          </h1>
                        </div>
                        <div className="flex mt-5 flex-row items-center">
                          <h1 className="font-bold mr-2">Email:</h1>
                          <h1 className="break-all">
                            {application.sender.email}
                          </h1>
                        </div>
                        <div className="flex flex-row items-center mt-1">
                          <h1 className="font-bold mr-2">Contact:</h1>
                          <h1>{application.contact}</h1>
                        </div>
                        <div className="flex flex-col mt-10">
                          <button
                            onClick={() =>
                              accept_button(application.applicationId)
                            }
                            className="h-[30px] hover:bg-black hover:text-white rounded-[5px] border cursor-pointer border-gray-300 shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              decline_button(application.applicationId)
                            }
                            className="h-[30px] mt-5 hover:bg-black hover:text-white rounded-[5px] border cursor-pointer border-gray-300 shadow-lg"
                          >
                            Decline
                          </button>
                        </div>
                      </div>

                      {/* Message Box */}
                      <div className="flex-grow p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg min-w-[300px] max-w-full">
                        <h1 className="font-bold mb-2">Message,</h1>
                        <h2 className="break-words">{application.message}</h2>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No applications found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
