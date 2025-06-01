"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState(null);
  const [fadingOutIds, setFadingOutIds] = useState([]);

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
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getApplications = async () => {
      const response = await fetch("/api/application_data_tenent", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      
      if (data?.applications?.length) {
        data.applications.reverse();
      }
      setData(data);
    };

    getApplications();
  }, [userId]);

  const handleDeleteClick = async (id) => {
    setFadingOutIds((prev) => [...prev, id]);
    
    await fetch("/api/application_delete", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ e: id }),
    });

      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Deleted{" "}
        </div>
      ));
    
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        applications: prev.applications.filter((app) => app.id !== id)
      }));
      setFadingOutIds((prev) => prev.filter((fid) => fid !== id));
    }, 300);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Toaster />
        <div className="w-56 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Application</h1>

          {!data ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-7 mt-4">
              {data?.applications?.map((property, index) => (
                <div
                  key={index}
                  className={`rounded-2xl flex flex-row shadow-lg border border-gray-300 w-[1200px] transition-all duration-300 ease-out ${
                    fadingOutIds.includes(property.id)
                      ? "opacity-0 -translate-y-4 scale-95"
                      : "opacity-100 translate-y-0 scale-100"
                  }`}
                  style={{
                    transitionProperty: 'opacity, transform',
                    willChange: 'opacity, transform'
                  }}
                >
                  <div>
                    <div className="w-80 rounded-2xl h-[330px] overflow-hidden shadow-lg border cursor-pointer border-gray-200">
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
                            {property.amenities || ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mr-4 ml-4">
                    <div className="flex-shrink-0 p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg min-w-[200px] md:w-auto">
                      <h1 className="font-bold">To,</h1>
                      <div className="flex flex-row mt-5 items-center">
                        <img
                          className="h-[60px] w-[60px] mr-4 rounded-full"
                          src="https://imgs.search.brave.com/5UXUrwnw8J0ENnlCfKBvy2iT3ZiU9L2WC2CXtxFJfO0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvcGZw/LXBpY3R1cmVzLWsz/ZHF4bjNuMG5heGVm/bjIuanBn"
                          alt=""
                        />
                        <h1 className="break-all">
                          {property.managerUsername || "Manager"}
                        </h1>
                      </div>
                      <div>
                        <h1 className="font-bold mt-10">
                          contact: {property.contact}
                        </h1>
                      </div>

                      <div className="flex flex-col mt-5">
                        <h1 className="font-bold">Status,</h1>
                        <div className="flex flex-row items-center justify-center gap-5">
                          <div
                            className={`mt-3 h-[30px] rounded-[5px] cursor-pointer shadow-lg flex items-center justify-center text-center border border-gray-300 w-[150px]
                            ${
                              property.status?.trim() === "accepted"
                                ? "bg-green-500 text-black"
                                : ""
                            }
                            ${
                              property.status?.trim() === "decline"
                                ? "bg-red-500 text-black"
                                : ""
                            }
                            ${
                              property.status?.trim() === "under_process"
                                ? "bg-black text-white"
                                : ""
                            }
                          `}
                          >
                            {property.status?.trim()}
                          </div>

                          <div>
                            <img
                              onClick={() => handleDeleteClick(property.id)}
                              className="h-[25px] mt-3 w-[25px] cursor-pointer"
                              src="https://img.icons8.com/?size=100&id=67884&format=png&color=000000"
                              alt="delete"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg w-[640px]">
                      <h1 className="font-bold mb-2">Message,</h1>
                      <h2 className="break-words">{property.message}</h2>
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

export default Page;