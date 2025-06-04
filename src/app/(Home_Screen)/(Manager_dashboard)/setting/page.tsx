"use client";

import React, { useState, useEffect,useRef } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
   const router = useRouter();
   const [userId, setUserId] = useState("");
   const [isLoading, setIsLoading] = useState(true);
   const [Role, setRole] = useState("");
   const [Input, setInput] = useState("");
   const [previewImage, setPreviewImage] = useState(null);
   const [profilePicture, setProfilePicture] = useState(null);
   const fileInputRef = useRef(null);
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
              "PfP changed"
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
    <div className="h-screen flex flex-col">
      <Navbar />
      <Toaster />
      <div className="flex flex-1">
        <div className="w-56 flex-shrink-0 bg-gray-100 overflow-y-auto">
          <Sidebar_manager />
        </div>

        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-8">Settings</h1>

          {Role === "tenant" ? (
            <button
              onClick={tenanat_to_manager}
              className="relative cursor-pointer group overflow-hidden px-4 py-2 border border-black rounded text-black"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>

              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                switch to Manager
              </span>
            </button>
          ) : null}

          {Role === "manager" ? (
            <button
              onClick={managet_to_tenant}
              className="relative group overflow-hidden px-4 py-2 border border-black rounded text-black"
            >
              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>

              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                switch to Tenant
              </span>
            </button>
          ) : null}

          <div className=" flex gap-4 flex-row mt-15">
            <div>
              <button
                onClick={handel_name_change}
                className="relative group overflow-hidden px-4 w-[158px] cursor-pointer py-2 border border-black rounded text-black"
              >
                <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>

                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  Change name
                </span>
              </button>
            </div>

            <div>
              <input
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                className="border border-gray-300 w-[300px] rounded h-[42px]"
                type="update name"
              />
            </div>
          </div>
            <div className=" flex gap-4 items-center  flex-row mt-10">
            <div>
              <button
                onClick={handleSubmit}
                className="relative group overflow-hidden mr-10 cursor-pointer w-[160px] px-4 py-2 border border-black rounded text-black"
              >
                <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>

                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  Change pfp
                </span>
              </button>
            </div>

            <div
              className="relative w-24 h-24 rounded-full border-2 border-black mb-2 overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              {previewImage ? (
                <>
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  ></button>
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
