"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password, role }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    console.log("Signup success!", data);
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
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
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-black"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-black"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-black rounded-md bg-transparent placeholder-black"
          />
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            Sign Up
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
