"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({
    username: false,
    email: false,
    password: false,
  });

  const validateFields = () => {
    const newErrors = {
      username: !username.trim(),
      email: !email.trim() || !/^\S+@\S+\.\S+$/.test(email),
      password: !password.trim() || password.length < 6,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
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
      setIsLoading(true);

      if (!validateFields()) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-white border border-black text-black flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
          >
            Please complete all fields!{" "}
          </div>
        ));
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", profilePicture);

      try {
        const res = await fetch("/api/upload2", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const pfpUrl = data.urls;

        const response = await fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify({ username, email, password, role, pfpUrl }),
          credentials: "include",
        });

        if (response) {
          router.push("/home");
        }
      } catch (err) {
        console.error("Upload failed:", err);
        setIsLoading(false);
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
      <Toaster />
      <div className="w-full max-w-md p-6 sm:p-8 border border-black rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="flex flex-row gap-10 sm:flex-row justify-center mb-6 sm:space-x-6 space-y-2 sm:space-y-0">
          <label className="flex items-center space-x-2 cursor-pointer justify-center">
            <input
              type="radio"
              name="role"
              value="tenant"
              checked={role === "tenant"}
              onChange={() => setRole("tenant")}
              className="accent-black"
            />
            <span className="text-black">Tenant</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer justify-center">
            <input
              type="radio"
              name="role"
              value="manager"
              checked={role === "manager"}
              onChange={() => setRole("manager")}
              className="accent-black"
            />
            <span className="text-black">Manager</span>
          </label>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-4">
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

          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((prev) => ({ ...prev, username: false }));
            }}
            placeholder="Username"
            className={`w-full px-4 py-2 border rounded-md bg-transparent placeholder-black ${
              errors.username ? "border-red-500" : "border-black"
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">Username is required</p>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: false }));
            }}
            placeholder="Email"
            className={`w-full px-4 py-2 border rounded-md bg-transparent placeholder-black ${
              errors.email ? "border-red-500" : "border-black"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {!email.trim() ? "Email is required" : "Please enter a valid email"}
            </p>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: false }));
            }}
            placeholder="Password (min 6 characters)"
            className={`w-full px-4 py-2 border rounded-md bg-transparent placeholder-black ${
              errors.password ? "border-red-500" : "border-black"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">
              {!password.trim()
                ? "Password is required"
                : "Password must be at least 6 characters"}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="relative w-full py-2 text-black overflow-hidden group border cursor-pointer border-black rounded-md flex items-center justify-center"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="font-medium">Processing...</span>
              </div>
            ) : (
              <>
                <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  Sign Up
                </span>
              </>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-black" />
          <span className="mx-4 text-black">or</span>
          <hr className="flex-grow border-black" />
        </div>

        <div className="flex flex-row items-center justify-center text-sm sm:text-base">
          <span className="mr-2">Already have an account?</span>
          <button
            onClick={() => router.push("/login")}
            className="text-black font-bold cursor-pointer hover:text-blue-500 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;