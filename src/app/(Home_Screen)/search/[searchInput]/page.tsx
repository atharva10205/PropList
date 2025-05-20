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
          {["Rooms", "Tinyhouse", "Apartment", "Villa", "Townhouse", "Cottage"].map((type) => (
            <button key={type} className="border rounded p-2 hover:bg-black hover:text-white">
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Price Range</h2>
        <div className="flex justify-between text-sm mb-1">
          <span>$200</span>
          <span>$1200</span>
        </div>
        <input type="range" min="200" max="1200" className="w-full accent-black" />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Conveniences</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            "Tv", "Disabled Access", "In the woods", "Hot Tubs",
            "Views", "Lake & Rivers", "Pet Friendly", "Wifi",
          ].map((item) => (
            <button key={item} className="border rounded p-2 hover:bg-black hover:text-white">
              {item}
            </button>
          ))}
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
      {["Price", "Beds/Baths", "Home Type", "Specialty Housing", "Move-In Date"].map((item) => (
        <button key={item} className="border rounded-full px-4 py-1 hover:bg-black hover:text-white">
          {item}
        </button>
      ))}
      <button className="border rounded-full px-4 py-1 flex items-center gap-1 hover:bg-black hover:text-white">
        <span>Sort</span>
      </button>
      <div className="flex gap-1">
        <button className="border rounded-full px-3 py-1 hover:bg-black hover:text-white">▦</button>
        <button className="border rounded-full px-3 py-1 hover:bg-black hover:text-white">☰</button>
      </div>
    </div>
  );
};

const Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [approx_coordinates, setapprox_coordinates] = useState([]);
  const [add_data, setadd_data] = useState([]);
  const params = useParams();
  const router = useRouter();
  const searchInput = decodeURIComponent(params.searchInput as string);

  useEffect(() => {
    handleSearch(searchInput);
  }, [searchInput]);

  const handleSearch = async (query: string) => {
    try {
      const response = await axios.get("/api/geocode", { params: { query } });
      if (response.data && response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSelectedLocation([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("Place not found");
      }
    } catch (error) {
      alert("Error fetching location");
    }
  };

  useEffect(() => {
    const send_coordinates = async () => {
      try {
        const response = await fetch("/api/searched_location_marker", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ location: selectedLocation }),
        });
        const data = await response.json();
        setadd_data(data);
        
        if (Array.isArray(data.markers)) {
          const latLngArray = data.markers.map((marker) => [
            marker.latitude,
            marker.longitude,
          ]);
          setapprox_coordinates(latLngArray);
          console.log("Extracted lat/lng array:", latLngArray);
        }
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };
    send_coordinates();
  }, [selectedLocation]);

  useEffect(() => {
    console.log("add_data", add_data);
  }, [add_data]);

  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="pt-16 pb-2 px-4 h-full flex flex-col gap-4 overflow-hidden">
        <NavbarFilters />
        <div className="flex gap-4 h-full overflow-hidden">
          <SidebarFilters />

          <div className="flex flex-row gap-4 h-full overflow-hidden">
            <div className="border border-gray-300 w-[850px] rounded-lg p-4 bg-white flex flex-col">
              <div className="w-full flex-grow rounded overflow-hidden">
                <MapView onLocationSelect={selectedLocation} markers={approx_coordinates} />
              </div>
            </div>

            <div className="border border-gray-300 w-[310px] h-full rounded-lg overflow-y-auto">
              <div className="flex-1 p-2 bg-white cursor-pointer">
                {add_data?.markers?.map((marker, index) => (
                  <div key={marker.id || index} className="border border-gray-300 rounded-lg mb-4">
                    <div className="flex-1 p-2 bg-white cursor-pointer">
                      <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                        <div className="relative">
                          <img
                            src={marker.imageURLs?.[0] || "https://via.placeholder.com/300"}
                            alt={marker.propertyName}
                            className="h-48 w-full object-cover"
                            onClick={() => router.push(`/property/${marker.id}`)}
                          />
                          <button className="absolute bottom-2 right-2 bg-white rounded-full p-2">
                            <img
                              src="https://img.icons8.com/?size=100&id=p7MI4JnqXYvv&format=png&color=000000"
                              className="h-[17px] w-[17px] object-contain"
                            />
                          </button>
                        </div>
                        <div onClick={() => router.push(`/property/${marker.id}`)} className="p-4">
                          <h2 className="text-lg font-bold">{marker.propertyName}</h2>
                          <p className="text-sm text-gray-600 mb-2">
                            {marker.city}, {marker.state}, {marker.country}
                          </p>
                          <div className="flex items-center mb-3">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-sm font-medium">4.8</span>
                            <span className="text-sm text-gray-500 ml-1">(347 Reviews)</span>
                            <span className="text-sm font-semibold ml-auto">
                              ${marker.pricePerMonth || "--"}
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                          </div>
                          <div className="flex justify-between text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                              <img
                                className="h-[15px] ml-2 w-[15px]"
                                src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                                alt=""
                              />
                              {marker.bedrooms} Beds
                            </div>
                            <div className="flex items-center gap-1">
                              <img
                                className="h-[15px] ml-2 w-[15px]"
                                src="https://img.icons8.com/?size=100&id=468&format=png&color=000000"
                                alt=""
                              />
                              {marker.bathrooms} Baths
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
