"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

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
        return;
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password, role }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("Signup success!", data);
      router.push("/home");
    } catch (error) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-white border border-black text-black flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Something went wrong!
        </div>
      ));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <Toaster />
      <div className="w-full max-w-md p-8 border border-black rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="flex justify-center mb-6 space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
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

          <label className="flex items-center space-x-2 cursor-pointer">
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
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username)
                setErrors((prev) => ({ ...prev, username: false }));
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
              if (errors.email)
                setErrors((prev) => ({ ...prev, email: false }));
            }}
            placeholder="Email"
            className={`w-full px-4 py-2 border rounded-md bg-transparent placeholder-black ${
              errors.email ? "border-red-500" : "border-black"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {!email.trim()
                ? "Email is required"
                : "Please enter a valid email"}
            </p>
          )}

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: false }));
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
            className="relative w-full py-2 text-black overflow-hidden group border cursor-pointer border-black rounded-md"
          >
            <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Sign Up
            </span>
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-black" />
          <span className="mx-4 text-black">or</span>
          <hr className="flex-grow border-black" />
        </div>

        <div className="flex flex-row items-center justify-center">
          <div className="mr-2">Already have an account?</div>
          <button
            onClick={() => {
              router.push("/login");
            }}
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
