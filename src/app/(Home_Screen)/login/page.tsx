"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      console.log("Login success!", data);
      router.push("/home");
    } catch (err) {
      alert("mau");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-black rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
            className="w-full py-2 cursor-pointer bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-black" />
          <span className="mx-4 text-black">or</span>
          <hr className="flex-grow border-black" />
        </div>

        <div className="flex flex-row items-center justify-center">
          <div className="mr-2">Don't have an account?</div>
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className="text-black font-bold cursor-pointer hover:text-blue-500 hover:underline"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
