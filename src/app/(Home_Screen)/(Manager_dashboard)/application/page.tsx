"use client";

import React, { useState, useEffect } from "react";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [applications, setApplications] = useState(null);
  const [fadingOutIds, setFadingOutIds] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        console.log(fetchedData);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [userId]);

  const handleRemoveWithAnimation = (id : string) => {
    setFadingOutIds((prev) => [...prev, id]);
    setTimeout(() => {
      setApplications((prev) => prev.filter((app) => app.applicationId !== id));
      setFadingOutIds((prev) => prev.filter((fid) => fid !== id));
    }, 300);
  };

  const accept_button = async (id, add_id) => {
    const response = await fetch("/api/accept_button", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: id, userId, add_id: add_id }),
    });
    handleRemoveWithAnimation(id);
    if (response) {
      router.push("/residence");
    }
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

      <div className="md:hidden p-4  flex justify-between items-center">
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
        <div
          className={`fixed md:static top-[50px] left-0 h-[calc(100vh-40px)] w-64  overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar_manager />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={`flex-1 overflow-y-auto p-4 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-50 md:opacity-100" : "opacity-100"
          }`}
        >
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
                    <div className="w-[calc(100%-30px)] lg:w-80 rounded-2xl h-auto lg:h-[360px] overflow-hidden shadow-lg border cursor-pointer border-gray-200 m-4 lg:m-0">
                      <div className="relative ">
                        <Image
                          src={
                            application.property.imageURL ||
                            "https://via.placeholder.com/300"
                          }
                          alt={application.property.propertyName}
                          className="h-48 w-full object-cover"
                          width={300}
                          height={192}
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
                            <Image
                              className="h-[15px] ml-2 w-[15px]"
                              src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                              alt="beds icon"
                              width={15}
                              height={15}
                            />
                            {application.property.beds} Bed
                          </div>
                          <div className="flex items-center gap-1">
                            <Image
                              className="h-[15px] w-[15px]"
                              src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                              alt="baths icon"
                              width={15}
                              height={15}
                            />
                            {application.property.baths} Bath
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Applicant Info & Message */}
                    <div className="flex flex-col md:flex-row gap-4 mr-4 ml-4 flex-grow">
                      <div className="flex-shrink-0 p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg w-full md:w-auto">
                        <h1 className="font-bold">From,</h1>
                        <div className="flex flex-row mt-5 items-center">
                          <Image
                            className="h-[60px] w-[60px] mr-4 rounded-full"
                            src={application.sender.pfpUrl}
                            alt="profile"
                            width={60}
                            height={60}
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
                        <div className="flex flex-col mt-10 space-y-5">
                          <button
                            onClick={() =>
                              accept_button(
                                application.applicationId,
                                application.property.id
                              )
                            }
                            className="relative group h-[30px] border cursor-pointer border-gray-300 shadow-lg rounded-[5px] overflow-hidden"
                          >
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                            <span className="relative z-10 text-black transition-colors duration-300 group-hover:text-white">
                              Accept
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              decline_button(application.applicationId)
                            }
                            className="relative group h-[30px] border cursor-pointer border-gray-300 shadow-lg rounded-[5px] overflow-hidden"
                          >
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                            <span className="relative z-10 text-black transition-colors duration-300 group-hover:text-white">
                              Decline
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-grow p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg min-w-[300px] max-w-[600px]">
                        <h1 className="font-bold mb-2">Message</h1>
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