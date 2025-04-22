"use client";
import React, { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const search_button = () => {
    if (searchInput.trim()) {
      router.push(`search/${searchInput}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search_button();
    }
  };
  

  return (
    <div>
      <Navbar />
      <div
        className="relative bg-black"
        style={{ height: "calc(100vh - 50px)", width: "100vw" }}
      >
        <img
          className="h-full w-full object-cover absolute top-0 left-0 opacity-50 z-0"
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=3096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />

        <div className="absolute flex-col inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col p-2 mb-4 mr-7">
            <div className="text-white text-center text-[30px] font-sans font-bold">
              Start your journy to find the
            </div>
            <div className="text-white text-center text-[30px] font-bold">
              Perfect place to call home{" "}
            </div>
            <div className="text-white">
              explore our wide range of rental properties tailored to your
              lifestyle!
            </div>
          </div>

          <div className="flex flex-row ml-6">
            <input
              className="w-[600px] rounded-[26px] h-[60px] px-4 bg-white opacity-55 shadow-lg"
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search by city, neighbourhood, or address"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
