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
    <div className="w-64 p-4 space-y-6 border border-gray-300 rounded">
      <div>
        <h2 className="text-lg font-semibold mb-2">Property Type</h2>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map((type) => (
            <FilterButton key={type} label={type} />
          ))}
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
        <div className="grid grid-cols-2 gap-2">
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
      <input
        type="text"
        placeholder="Search"
        className="border w-full rounded-full px-4 py-1 text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

const Page = () => {
  const [selectedLocation, setSelectedLocation] = useState<
    [number, number] | null
  >(null);
  const [add_data, setadd_data] = useState<{ markers: any[] }>({ markers: [] });
  const [filteredData, setFilteredData] = useState<any[]>([]);
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

    // if (Array.isArray(filtered)) {
    //   const latLngArray = filtered.map((marker) => [
    //     marker.latitude,
    //     marker.longitude,
    //   ]);
    //   setapprox_coordinates(latLngArray);
    // }
  };

  const Property_listings = ({ filteredData }) => {
    console.log("filterddata", filteredData);
    const router = useRouter();

    return (
      <div className="flex-1 p-2 bg-white cursor-pointer">
        {filteredData?.map((marker, index) => (
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
      </div>

      <div className="pt-16 pb-2 px-4 h-full flex flex-col gap-4 overflow-hidden">
        {isDesktop && <NavbarFilters />}
        <div className="flex gap-4 h-full overflow-hidden">
          {isDesktop && <SidebarFilters onFilterChange={handleFilterChange} />}
          <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-y-auto">
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

            <Property_listings filteredData={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
