"use client";

import Navbar from "@/app/components/Navbar";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
});

const SidebarFilters = ({ onFilterChange }) => {
  const [ActiveList, setActiveList] = useState([]);

  const toggleActive = (item) => {
    const newActiveList = ActiveList.includes(item)
      ? ActiveList.filter((i) => i !== item)
      : [...ActiveList, item];

    console.log(newActiveList);
    setActiveList(newActiveList);
    onFilterChange(newActiveList);
  };

  const FilterButton = ({ label }) => {
    const isActive = ActiveList.includes(label);
    return (
      <button
        onClick={() => toggleActive(label)}
        className={`relative cursor-pointer overflow-hidden group border rounded p-2 text-sm text-center ${
          isActive ? "bg-black text-white" : "text-black"
        }`}
      >
        <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
        <span
          className={`relative z-10 transition-colors duration-300 group-hover:text-white ${
            isActive ? "text-white" : ""
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  const propertyTypes = [
    "House",
    "Villa",
    "Apartment",
    "Room",
    "Studio",
    "Penthouse",
    "Duplex",
    "Townhouse",
  ];
  const conveniences = ["Pets", "Parking", "Hot Tubs", "Wifi"];

  return (
    <div className="w-64 p-4 space-y-16 border border-gray-300 rounded">
      <div>
        <h2 className="text-lg font-semibold mb-2">Property Type</h2>
        <div className="grid grid-cols-2 gap-4 p-2">
          {propertyTypes.map((type) => (
            <FilterButton key={type} label={type} />
          ))}
        </div>
      </div>

      {/* <div>
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
      </div> */}

      <div>
        <h2 className="text-lg font-semibold mb-2">Conveniences</h2>
        <div className="grid grid-cols-2 gap-4 p-2">
          {conveniences.map((item) => (
            <FilterButton key={item} label={item} />
          ))}
        </div>
      </div>

      <button
        className="w-full bg-black text-white py-2 rounded"
        onClick={() => onFilterChange(ActiveList)}
      >
        APPLY
      </button>
    </div>
  );
};

const NavbarFilters = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      router.push(`/search/${query}`);
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
    <div className="flex  flex-wrap gap-2 items-center p-4 border border-gray-300 rounded">
      <input
        type="text"
        placeholder="Search by city, neighbourhood, or address"
        className="border  h-[40px] w-full rounded-lg px-1 py-1 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {suggestions.length > 0 && (
        <ul className="absolute top-[50px]  sm:top-[65px] w-full z-20 bg-white border opacity-80 border-gray-300 rounded-lg mt-[60px] max-h-60 overflow-y-auto">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                router.push(
                  `/search/${encodeURIComponent(place.display_name)}`
                );
                setSuggestions([]);
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [add_data, setadd_data] = useState({ markers: [] });
  const [filteredData, setFilteredData] = useState([]);
  const params = useParams();
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
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
          >
            Place not found{" "}
          </div>
        ));
      }
    } catch {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Place not found{" "}
        </div>
      ));
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
        setFilteredData(data.markers || []);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };
    if (selectedLocation) {
      send_coordinates();
    }
  }, [selectedLocation]);

  const handleFilterChange = (filters) => {
    if (filters.length === 0) {
      setFilteredData(add_data.markers || []);
      return;
    }

    const filtered = (add_data.markers || []).filter((property) => {
      return filters.some((filter) => {
        // Property type filter
        if (
          [
            "House",
            "Villa",
            "Apartment",
            "Room",
            "Studio",
            "Penthouse",
            "Duplex",
            "Townhouse",
          ].includes(filter)
        ) {
          return property.propertyType?.toLowerCase() === filter.toLowerCase();
        }
        // Conveniences filter
        switch (filter) {
          case "Pets":
            return property.petsAllowed === true;
          case "Parking":
            return property.parkingIncluded === true;
          case "Hot Tubs":
            return property.Bathtub === true;
          case "Wifi":
            return property.Wifi === true;
          default:
            return false;
        }
      });
    });

    setFilteredData(filtered);
  };

  const Property_listings = ({ filteredData }) => {
    const router = useRouter();

    if (!filteredData || filteredData.length === 0) {
      return (
        <div className="flex items-center justify-center border border-gray-300 rounded-lg h-full">
          <h1 className="text-2xl font-semibold text-gray-500">
            No Property Found
          </h1>
        </div>
      );
    }

    return (
      <div className="flex-1 p-2 bg-white cursor-pointer">
        {filteredData.map((marker, index) => (
          <div
            key={marker.id || index}
            className="border border-gray-300 rounded-lg mb-4"
          >
            <div className="flex-1 p-2 bg-white cursor-pointer">
              <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <div className="relative">
                  <img
                    src={
                      marker.imageURLs?.[0] || "https://via.placeholder.com/300"
                    }
                    alt={marker.propertyName}
                    className="h-48 w-full object-cover"
                    onClick={() => router.push(`/property/${marker.id}`)}
                  />
                </div>
                <div
                  onClick={() => router.push(`/property/${marker.id}`)}
                  className="p-4"
                >
                  <h2 className="text-lg font-bold">{marker.propertyName}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {marker.city}, {marker.state}, {marker.country}
                  </p>
                  <div className="flex items-center mb-3">
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
                      {marker.beds} Beds
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        className="h-[15px] ml-2 w-[15px]"
                        src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                        alt=""
                      />
                      {marker.baths} Baths
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const useIsDesktop = () => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
      const checkScreenSize = () => setIsDesktop(window.innerWidth >= 768);
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    return isDesktop;
  };

  const isDesktop = useIsDesktop();

  return (
    <div className="h-screen overflow-hidden">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
        <Toaster />
      </div>

      <div className="pt-16 pb-2 px-4 h-full flex flex-col gap-4 overflow-hidden">
        {isDesktop && <NavbarFilters />}

        <div className="flex gap-4 h-full overflow-hidden">
          {isDesktop && <SidebarFilters onFilterChange={handleFilterChange} />}

          <div className="flex flex-1 gap-4 overflow-hidden">
            {isDesktop && (
              <div className="border border-gray-300 w-[850px] rounded-lg p-4 bg-white flex flex-col">
                <div className="w-full flex-grow rounded overflow-hidden">
                  <MapView
                    onLocationSelect={selectedLocation}
                    markers={filteredData}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <Property_listings filteredData={filteredData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
