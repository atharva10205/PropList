"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/app/components/Navbar";
import dynamic from "next/dynamic";
import axios from "axios";
import Sidebar_manager from "@/app/components/Sidebar_manager";


export default function AddPropertyForm() {
  const [coords, setCoords] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [my_location, setmy_location] = useState(false); // Default false
  const [search_location, setsearch_location] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dog, setdog] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [created_listing, setcreated_listing] = useState(false)
  const [creating_screen, setcreating_screen] = useState(false)

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
        setSelectedLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("Place not found");
      }
    } catch (error) {
      alert("Error fetching location");
    }
  };

  //thing that pulls suggestions
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

  const MapView3 = dynamic(() => import("@/app/components/MapView3"), {
    ssr: false,
  });

  const [email, setemail] = useState("");
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
  const [latitude, setlatitude] = useState("");
  const [longitude, setlongitude] = useState("");
  const [image, setImage] = useState(null);

  const [files, setFiles] = useState([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
    const files = Array.from(e.target.files);
    setImage(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleUseMyLocation = () => {
    setdog(false);
    setmy_location(true);
    setsearch_location(false);
    setShowMap(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setShowMap(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        alert("API down");
      }
    );
  };

  useEffect(() => {
    if (coords) {
      setlatitude(coords.lat);
      setlongitude(coords.lng);
    }
  }, [coords]);

  const [ImageURL, setImageURL] = useState([]);

  const create_button = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      console.error("No files selected for upload");
      return;
    }

    setcreating_screen(true)

    const uploadFormData = new FormData();

    files.forEach((file) => {
      uploadFormData.append("files", file);
    });

    let imageURLs = [];

    try {
      const uploadRes = await fetch("/api/upload1", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadRes.json();
      imageURLs = uploadData.urls; 
    } catch (error) {
      console.error("Upload error:", error);
      return;
    }

    // Step 2: Create Listing
    const formData = new FormData();
    formData.append("propertyName", propertyName);
    formData.append("description", description);
    formData.append("pricePerMonth", pricePerMonth);
    formData.append("securityDeposit", securityDeposit);
    formData.append("applicationFee", applicationFee);
    formData.append("beds", beds);
    formData.append("baths", baths);
    formData.append("squareFeet", squareFeet);
    formData.append("petsAllowed", petsAllowed);
    formData.append("parkingIncluded", parkingIncluded);
    formData.append("propertyType", propertyType);
    formData.append("amenities", amenities);
    formData.append("highlights", highlights);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("postalCode", postalCode);
    formData.append("country", country);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);

    formData.append("imageURLs", JSON.stringify(imageURLs));

    try {
      const response = await fetch("/api/create_listing", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setcreated_listing(true);
        setcreating_screen(false)
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Create listing error:", error);
    }
   
  };

  useEffect(() => {
    const get_email = async () => {
      try {
        const response = await fetch("/api/user_email");
        const data = await response.json();
        setemail(data.email);
      } catch (error) {}
    };
    get_email();
  }, []);

  const [selectedLocation1, setSelectedLocation1] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const memoizedMap = useMemo(() => {
    return (
      <div className="h-[403px] w-[973px] bg-gray-300 flex items-center justify-center">
        <MapView3
          markerCoords={selectedLocation}
          onLocationSelect={setSelectedLocation1}
        />
      </div>
    );
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocation1) {
      setlatitude(selectedLocation1.lat);
      setlongitude(selectedLocation1.lng);
    }
  }, [selectedLocation1]);

  if(creating_screen === true){
    return(
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        creating ....
      </div>
    )
  }

  if(created_listing === true){
    return(
      <div className="bg-black min-h-screen text-white flex justify-center items-center">
        created yay
      </div>
    )
  }


  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - stays fixed */}
        <div className="w-[190px] h-full overflow-y-auto border-r">
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
                <input
                  required
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Property Name"
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border rounded"
                  rows={4}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Fees */}
              <div>
                <h2 className="text-xl font-medium mb-4">Fees</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    className="p-2 border rounded"
                    placeholder="Price per Month"
                    value={pricePerMonth}
                    type="number"
                    onChange={(e) => setPricePerMonth(e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Security Deposit"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Application Fee"
                    value={applicationFee}
                    onChange={(e) => setApplicationFee(e.target.value)}
                  />
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h2 className="text-xl font-medium mb-4">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    required
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Number of Beds"
                    value={beds}
                    onChange={(e) => setBeds(e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Number of Baths"
                    value={baths}
                    onChange={(e) => setBaths(e.target.value)}
                  />
                  <input
                    required
                    type="number"
                    className="p-2 border rounded"
                    placeholder="Square Feet"
                    value={squareFeet}
                    onChange={(e) => setSquareFeet(e.target.value)}
                  />
                </div>
                <div className="flex items-center mt-4 space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={petsAllowed}
                      onChange={(e) => setPetsAllowed(e.target.checked)}
                    />
                    <span>Pets Allowed</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={parkingIncluded}
                      onChange={(e) => setParkingIncluded(e.target.checked)}
                    />
                    <span>Parking Included</span>
                  </label>
                </div>
                <div>
                  <div className="mt-4 p-2 w-full">
                    <label
                      htmlFor="property-type"
                      className="block text-xl font-medium "
                    >
                      Property Type
                    </label>
                    <select
                      id="property-type"
                      className="mt-4 w-full p-2 border rounded"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                    >
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="apartment">Apartment</option>
                      <option value="room">Room</option>
                      <option value="studio">Studio Apartment</option>
                      <option value="penthouse">Penthouse</option>
                      <option value="duplex">Duplex</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Amenities and Highlights */}
              <div>
                <h2 className="text-xl font-medium mb-4">
                  Amenities and Highlights
                </h2>
                <input
                  className="w-full p-2 mb-4 border rounded"
                  placeholder="Amenities"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="Highlights"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                />
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
                    <span className="text-black font-bold underline">
                      Browse
                    </span>
                  </p>
                  <input
                    required
                    name="image"
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    // onChange={(e) => setFiles(Array.from(e.target.files))}
                    onChange={handleImageChange}
                  />
                </label>

                {/* Image Previews */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {previewUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Additional Information */}
              <div>
                <h2 className="text-xl font-medium mb-4">
                  Additional Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <input
                    required
                    className="p-2 border rounded"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <input
                    required
                    className="p-2 border rounded"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    required
                    className="p-2 border rounded"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                  <input
                    required
                    className="p-2 border rounded"
                    type="number"
                    placeholder="Postal Code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <div>
                  <select
                    id="country"
                    className="mt-4 w-full p-2 border rounded"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Japan">Japan</option>
                    <option value="Brazil">Brazil</option>
                    <option value="SouthAfrica">South Africa</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
              </div>

              {/* Location Options */}
              <div className="my-6">
                <h2 className="text-xl font-medium mb-2">Location</h2>
                <div className="flex flex-col sm:flex-row gap-4">

                  <div>
                  <button
                    onClick={handleUseMyLocation}
                    className={`px-4 py-2 rounded cursor-pointer border transition ${
                      my_location
                        ? "bg-black text-white"
                        : "bg-white text-black border-gray-200 hover:bg-black hover:text-white"
                    }`}
                  >
                    Use My Current Location
                  </button>
                  </div>

                  <div>
                  <button
                    onClick={() => {
                      setShowMap(!showMap);
                      setsearch_location(true);
                      setdog(false);
                      setmy_location(false);
                    }}
                    className={`px-4 py-2 cursor-pointer rounded border transition ${
                      search_location
                        ? "bg-black text-white"
                        : "bg-white text-black border-gray-200 hover:bg-black hover:text-white"
                    }`}
                  >
                    Search On Map
                  </button>
                  </div>

                  <div>
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
              </div>

              {/* Map */}
              {my_location && coords && (
                <div className="h-[403px] w-[973px] bg-gray-300 flex items-center justify-center">
                  <MapView1 markerCoords={coords} />
                </div>
              )}
              {search_location && memoizedMap}

              {dog && (
                <div className="h-[403px] w-[973px] bg-gray-300 flex items-center justify-center">
                  <MapView2 />
                </div>
              )}

              {/* Submit */}
              <div>
                <button
                  onClick={(e) => {
                    create_button(e);
                  }}
                  className="w-full bg-black text-white cursor-pointer py-3 rounded transition"
                >
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
