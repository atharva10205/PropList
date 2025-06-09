"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-white border border-black text-black flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[290px] text-sm`}
          >
            {data.error || "Something went wrong!"}
          </div>
        ));
        setIsLoading(false);
        return;
      }

      console.log("Login success!", data);
      router.push("/home");
    } catch {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-white border border-black text-black flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Something went wrong!
        </div>
      ));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-4">
      <Toaster />

      <div className="w-full max-w-md p-6 sm:p-8 border border-black rounded-2xl shadow-md">
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
            disabled={isLoading}
            className="relative w-full py-2 cursor-pointer text-black overflow-hidden group border border-black rounded-md flex items-center justify-center"
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
                  Login
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
          <span className="mr-2">Dont have an account?</span>
          <button
            onClick={() => router.push("/signup")}
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