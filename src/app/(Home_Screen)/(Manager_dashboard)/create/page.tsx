"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar_manager from "@/app/components/Sidebar_manager";
export default function AddPropertyForm() {
  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [my_location, setmy_location] = useState(false); // Default false
  const [search_location, setsearch_location] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dog, setdog] = useState(true)
  
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [markerCoords, setMarkerCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const get_coordinate = (query: string) => {
    handleSearch(query);
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await axios.get("/api/geocode", {
        params: { query },
      });

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
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        axios
          .get(`/api/location?q=${query}`)
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

  const MapView1 = dynamic(() => import("@/app/components/MapView1"), {
    ssr: false,
  });

  const MapView2 = dynamic(() => import("@/app/components/MapView2"), {
    ssr: false,
  });

  const handleUseMyLocation = () => {
    setdog(false)
    setmy_location(true);
    setsearch_location(false);
    setShowMap(false);

    if (!coords) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setShowMap(false);
        },
        (err) => alert("Failed to get location.")
      );
    }
  };


  const [propertyName, setPropertyName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [applicationFee, setApplicationFee] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [parkingIncluded, setParkingIncluded] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [amenities, setAmenities] = useState("");
  const [highlights, setHighlights] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");


  return (
  <div className="h-screen flex flex-col overflow-hidden">
  {/* Navbar */}
  <Navbar />

  {/* Main content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar - stays fixed */}
    <div className="w-64 h-full overflow-y-auto border-r">
      <Sidebar_manager />
    </div>

    {/* Form area - scrolls */}
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Add New Property</h1>
        <p className="mb-6 text-gray-600">
          Create a new property listing with detailed information
        </p>

        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-medium mb-4">Basic Information</h2>
            <input className="w-full p-2 mb-4 border rounded" placeholder="Property Name" />
            <textarea className="w-full p-2 border rounded" rows={4} placeholder="Description" />
          </div>

          {/* Fees */}
          <div>
            <h2 className="text-xl font-medium mb-4">Fees</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input className="p-2 border rounded" placeholder="Price per Month" />
              <input className="p-2 border rounded" placeholder="Security Deposit" />
              <input className="p-2 border rounded" placeholder="Application Fee" />
            </div>
          </div>

          {/* Property Details */}
          <div>
            <h2 className="text-xl font-medium mb-4">Property Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input className="p-2 border rounded" placeholder="Number of Beds" />
              <input className="p-2 border rounded" placeholder="Number of Baths" />
              <input className="p-2 border rounded" placeholder="Square Feet" />
            </div>
            <div className="flex items-center mt-4 space-x-6">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Pets Allowed</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Parking Included</span>
              </label>
            </div>
            <input className="mt-4 w-full p-2 border rounded" placeholder="Property Type" />
          </div>

          {/* Amenities and Highlights */}
          <div>
            <h2 className="text-xl font-medium mb-4">Amenities and Highlights</h2>
            <input className="w-full p-2 mb-4 border rounded" placeholder="Amenities" />
            <input className="w-full p-2 border rounded" placeholder="Highlights" />
          </div>

          {/* Photos */}
          <div>
            <h2 className="text-xl font-medium mb-4">Photos</h2>
            <label
              htmlFor="photo-upload"
              className="block w-full border-2 border-dashed border-gray-400 p-6 text-center rounded bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
            >
              <p className="text-gray-700">
                Drag & Drop your images or{" "}
                <span className="text-black-600 font-bold underline">Browse</span>
              </p>
              <input id="photo-upload" type="file" accept="image/*" multiple className="hidden" />
            </label>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-medium mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <input className="p-2 border rounded" placeholder="Address" />
              <input className="p-2 border rounded" placeholder="City" />
              <input className="p-2 border rounded" placeholder="State" />
              <input className="p-2 border rounded" placeholder="Postal Code" />
            </div>
            <input className="mt-4 w-full p-2 border rounded" placeholder="Country" />
          </div>

          {/* Location Options */}
          <div className="my-6">
            <h2 className="text-xl font-medium mb-2">Location</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleUseMyLocation}
                className={`px-4 py-2 rounded border transition ${
                  my_location
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-200 hover:bg-black hover:text-white"
                }`}
              >
                Use My Current Location
              </button>

              <button
                onClick={() => {
                  setShowMap(!showMap);
                  setsearch_location(true);
                  setmy_location(false);
                }}
                className={`px-4 py-2 rounded border transition ${
                  search_location
                    ? "bg-black text-white"
                    : "bg-white text-black border-gray-200 hover:bg-black hover:text-white"
                }`}
              >
                Search On Map
              </button>

              {search_location && (
                <div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Enter Location"
                    className="h-[40px] p-2 border border-gray-200 w-[300px] rounded"
                  />
                  {suggestions.length > 0 && (
                    <ul className="top-[65px] w-[600px] z-20 bg-white border opacity-80 border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
                      {suggestions.map((place, index) => (
                        <li
                          key={index}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            get_coordinate(place.display_name);
                            setSuggestions([]);
                            handleSearch(place.display_name);
                          }}
                        >
                          {place.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          {my_location && coords && (
            <div className="h-[403px] w-[973px] bg-gray-300 flex items-center justify-center">
              <MapView1 markerCoords={coords} />
            </div>
          )}
          {search_location && (
            <div className="h-[403px] w-[973px] bg-gray-300 flex items-center justify-center">
              <MapView2
                markerCoords={selectedLocation}
                onLocationSelect={(coords) => setMarkerCoords(coords)}
              />
            </div>
          )}
          {dog && (
            <div className="h-[403px] w-[973px] bg-gray-300 flex items-center justify-center">
              <MapView2
                markerCoords={selectedLocation}
                onLocationSelect={(coords) => setMarkerCoords(coords)}
              />
            </div>
          )}

          {/* Submit */}
          <div>
            <button className="w-full bg-black text-white cursor-pointer py-3 rounded transition">
              Create Property
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
