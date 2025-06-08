"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [Role, setRole] = useState("");
  const [Input, setInput] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const fileInputRef = useRef(null);
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
          
        }
      } catch (error) {
        console.error("Fetch error:", error);
        
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    const get_role = async () => {
      try {
        const res = await fetch("/api/cheak_tenant_or_manager", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        setRole(data.role);
      } catch (error) {
        console.log(error);
      }
    };

    get_role();
  }, [userId]);

  const tenanat_to_manager = () => {
    const response = async () => {
      try {
        const res = await fetch("/api/tenanat_to_manager", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        setRole(data.role);

        if (data) {
          router.push("/home");
        }
      } catch (error) {
        console.log(error);
      }
    };

    response();
  };

  const managet_to_tenant = () => {
    const response = async () => {
      try {
        const res = await fetch("/api/managet_to_tenant", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();
        setRole(data.role);

        if (data) {
          router.push("/home");
        }
      } catch (error) {
        console.log(error);
      }
    };

    response();
  };

  const handel_name_change = async () => {
    const response = async () => {
      try {
        const res = await fetch("/api/name_update", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, Input }),
        });

        const data = await res.json();

        if (data) {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
            >
              Name changed{" "}
            </div>
          ));
          window.location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    };

    response();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setProfilePicture(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      formData.append("file", profilePicture);

      try {
        const res = await fetch("/api/upload3", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const pfpUrl = data.urls;

        const response = await fetch("/api/pfp_change", {
          method: "POST",
          body: JSON.stringify({ userId, pfpUrl }),
          credentials: "include",
        });

        if (response) {
          window.location.reload();

          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } fixed top-2 right-2 bg-white border border-black text-black mt-10 flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
            >
              PfP changed
            </div>
          ));
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    } catch (error) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-white border border-black text-black flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          {error.message || "Something went wrong!"}
        </div>
      ));
    }
  };
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <Toaster />

      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white flex justify-between items-center sticky top-0 z-30">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Toggle sidebar"
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
              d={
                isSidebarOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold mb-4 md:mb-8">Settings</h1>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Made responsive */}
        <div
       className={`
            fixed top-[50px] left-0 z-40 h-full w-64  overflow-y-auto transition-transform duration-300 ease-in-out
            md:static md:translate-x-0
            ${
              isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
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
          className={`flex-1 overflow-y-auto p-6 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-50 md:opacity-100" : "opacity-100"
          }`}
        >
          <div className="mb-8">
            {Role === "tenant" && (
              <button
                onClick={tenanat_to_manager}
                className="relative cursor-pointer group overflow-hidden px-4 py-2 border border-black rounded text-black"
              >
                <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  switch to Manager
                </span>
              </button>
            )}

            {Role === "manager" && (
              <button
                onClick={managet_to_tenant}
                className="relative group overflow-hidden px-4 py-2 border border-black rounded text-black"
              >
                <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  switch to Tenant
                </span>
              </button>
            )}
          </div>

          
          <div className="flex mt-15 flex-col md:flex-row gap-4 mb-8">
            <input
              onChange={(e) => setInput(e.target.value)}
              className="border border-gray-300 w-full md:w-[300px] rounded h-[42px] px-3"
              type="text"
              placeholder="Update name"
            />

            <button
              onClick={handel_name_change}
              className="relative group overflow-hidden px-4 w-full md:w-[158px] cursor-pointer py-2 border border-black rounded text-black"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Change name
              </span>
            </button>
          </div>

          {/* Profile Picture Section - Made responsive */}
          <div className="flex flex-col mt-15 md:flex-row gap-4 items-center">
            <div
              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-black overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              {previewImage ? (
                <>
                <div className="relative w-full h-full">
  <Image
    src={previewImage}
    alt="Profile preview"
    fill
    style={{ objectFit: "cover" }}
  />
</div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 md:h-10 md:w-10 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="relative group overflow-hidden w-full md:w-[160px] px-4 py-2 border border-black rounded text-black"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Change pfp
              </span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
