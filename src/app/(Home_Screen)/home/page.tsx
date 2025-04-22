"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const search_button = () => {
    if (query.trim()) {
      router.push(`search/${query}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search_button();
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        axios
          .get(`/api/location?q=${encodeURIComponent(query)}`)
          .then((res) => {
            setSuggestions(res.data);
          })
          .catch((err) => {
            console.error("API error:", err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

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
              Start your journey to find the
            </div>
            <div className="text-white text-center text-[30px] font-bold">
              Perfect place to call home
            </div>
            <div className="text-white text-center">
              explore our wide range of rental properties tailored to your lifestyle!
            </div>
          </div>

          <div className="flex flex-row ml-6 relative">
            <input
              className="w-[600px] rounded-[26px] h-[60px] px-4 bg-white opacity-55 shadow-lg"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by city, neighbourhood, or address"
            />
            {suggestions.length > 0 && (
              <ul className="absolute top-[65px] w-[600px] z-20 bg-white border opacity-80 border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((place, index) => (
               <li
               key={index}
               className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
               onClick={() => {
                 router.push(`/search/${encodeURIComponent(place.display_name)}`);
                 setSuggestions([]);
               }}
             >
               {place.display_name}
             </li>
             
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
