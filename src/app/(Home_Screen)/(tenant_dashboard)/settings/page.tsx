"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

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
        console.log(response);

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

      {/* Mobile Topbar */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-black"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed md:static z-20 top-[50px] left-0 h-full w-56  overflow-y-auto transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-8 hidden md:block">Settings</h1>

          {Role === "tenant" && (
            <button
              onClick={tenanat_to_manager}
              className="relative cursor-pointer group md:w-fit w-full overflow-hidden px-4 py-2 border border-black rounded text-black mb-4"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 group-hover:h-full origin-bottom" />
              <span className="relative z-10 group-hover:text-white">
                Switch to Manager
              </span>
            </button>
          )}

          {Role === "manager" && (
            <button
              onClick={managet_to_tenant}
              className="relative group w-full md:w-fit  overflow-hidden cursor-pointer px-4 py-2 border border-black rounded text-black mb-4"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 group-hover:h-full origin-bottom" />
              <span className="relative z-10 group-hover:text-white">
                Switch to Tenant
              </span>
            </button>
          )}

          {/* Change name section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
            <button
              onClick={handel_name_change}
              className="relative group w-full sm:w-[170px] overflow-hidden cursor-pointer px-4 py-2 border border-black rounded text-black"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 group-hover:h-full origin-bottom" />
              <span className="relative z-10 group-hover:text-white">
                Change Name
              </span>
            </button>

            <input
              onChange={(e) => setInput(e.target.value)}
              className="border border-gray-300 w-full sm:w-[300px] rounded h-[42px] px-2"
              type="text"
              placeholder="Update name"
            />
          </div>

          {/* Change profile picture section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={handleSubmit}
              className="relative group overflow-hidden cursor-pointer w-full sm:w-[170px] px-4 py-2 border border-black rounded text-black"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 group-hover:h-full origin-bottom" />
              <span className="relative z-10 group-hover:text-white">
                Change PFP
              </span>
            </button>

            <div
              className="relative w-24 h-24 rounded-full border-2 border-black overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-500"
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
