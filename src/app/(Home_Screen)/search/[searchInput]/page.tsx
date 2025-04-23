"use client";

import Navbar from "@/app/components/Navbar";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";


const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
});

const SidebarFilters = () => {
  return (
    <div className="w-64 p-4 space-y-6 border border-gray-300 rounded">
      <div>
        <h2 className="text-lg font-semibold mb-2">Property Type</h2>
        <div className="grid grid-cols-2 gap-2 text-center text-sm">
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Rooms
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Tinyhouse
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Apartment
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Villa
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Townhouse
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Cottage
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Price Range</h2>
        <div className="flex justify-between text-sm mb-1">
          <span>$200</span>
          <span>$1200</span>
        </div>
        <input
          type="range"
          min="200"
          max="1200"
          className="w-full accent-black"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Conveniences</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Tv
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Disabled Access
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            In the woods
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Hot Tubs
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Views
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Lake & Rivers
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Pet Friendly
          </button>
          <button className="border rounded p-2 hover:bg-black hover:text-white">
            Wifi
          </button>
        </div>
      </div>

      <button className="w-full bg-black text-white py-2 rounded">APPLY</button>
    </div>
  );
};

const NavbarFilters = () => {

    const router = useRouter();
  
  const [query, setQuery] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search_button();
    }
  };

  const search_button = () => {
    if (query.trim()) {
      router.push(`search/${query}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center p-4 border border-gray-300 rounded">
      <button className="border rounded-full px-4 py-1 flex items-center gap-1 hover:bg-black hover:text-white">
        <span>Filter</span>
      </button>
      <input
        type="text"
        placeholder="Search"
        className="border rounded-full px-4 py-1 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="border rounded-full px-4 py-1 hover:bg-black hover:text-white">
        Price
      </button>
      <button className="border rounded-full px-4 py-1 hover:bg-black hover:text-white">
        Beds/Baths
      </button>
      <button className="border rounded-full px-4 py-1 hover:bg-black hover:text-white">
        Home Type
      </button>
      <button className="border rounded-full px-4 py-1 hover:bg-black hover:text-white">
        Specialty Housing
      </button>
      <button className="border rounded-full px-4 py-1 hover:bg-black hover:text-white">
        Move-In Date
      </button>
      <button className="border rounded-full px-4 py-1 flex items-center gap-1 hover:bg-black hover:text-white">
        <span>Sort</span>
      </button>
      <div className="flex gap-1">
        <button className="border rounded-full px-3 py-1 hover:bg-black hover:text-white">
          ▦
        </button>
        <button className="border rounded-full px-3 py-1 hover:bg-black hover:text-white">
          ☰
        </button>
      </div>
    </div>
  );
};

const Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  const params = useParams();
  const searchInput = decodeURIComponent(params.searchInput as string);

  useEffect(() => {
    handleSearch(searchInput);
    console.log(searchInput);
  }, [searchInput]);

  const handleSearch = async (query: string) => {
    try {
      const response = await axios.get("/api/geocode", {
        params: { query },
      });

      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSelectedLocation([parseFloat(lat), parseFloat(lon)]);

        //console.log(`Coordinates for ${query}: Latitude: ${lat}, Longitude: ${lon}`);
      } else {
        alert("Place not found");
      }
    } catch (error) {
      alert("Error fetching location");
    }
  };

  useEffect(() => {
    console.log(selectedLocation);
  }, [selectedLocation]);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col gap-4 p-4">
        <NavbarFilters />
        <div className="flex gap-4">
          <SidebarFilters />
          <div className="flex-1 border border-gray-300 rounded p-4">
            <h2 className="text-lg font-semibold mb-2 text-center"></h2>
            <div className="w-full h-full mt-4 rounded overflow-hidden">
              <MapView onLocationSelect={selectedLocation} />
            </div>{" "}
            {selectedLocation && (
              <div className="mt-4 text-center text-sm text-gray-700"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
