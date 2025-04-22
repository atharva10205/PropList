"use client";

import Navbar from "@/app/components/Navbar";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { MapContainer , TileLayer } from "react-leaflet";
import { useEffect } from "react";

const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
});





const SidebarFilters = () => {
  return (
    <div className="w-64 p-4 space-y-6 border border-gray-300 rounded">
      {/* ... all your existing filters unchanged ... */}
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
  return (
    <div className="flex flex-wrap gap-2 items-center p-4 border border-gray-300 rounded">
      <button className="border rounded-full px-4 py-1 flex items-center gap-1 hover:bg-black hover:text-white">
        <span>Filter</span>
      </button>
      <input
        type="text"
        placeholder="Culver City, CA"
        className="border rounded-full px-4 py-1 text-sm"
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
              <MapView onLocationSelect={setSelectedLocation} />
            </div>{" "}
            {selectedLocation && (
              <div className="mt-4 text-center text-sm text-gray-700">
                <p>Latitude: {selectedLocation.lat}</p>
                <p>Longitude: {selectedLocation.lng}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
