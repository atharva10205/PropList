"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "@/app/components/Navbar";
import dynamic from "next/dynamic";
import axios from "axios";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function AddPropertyForm() {
  const router = useRouter();

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [showMap, setShowMap] = useState(false);
  const [my_location, setmy_location] = useState(false); // Default false
  const [search_location, setsearch_location] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dog, setdog] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [created_listing, setcreated_listing] = useState(false);
  const [creating_screen, setcreating_screen] = useState(false);
  const [errors, setErrors] = useState({});
  const [role, setrole] = useState("");
  const [Wallet_connected, setWallet_connected] = useState(false);
  const [Public_Id, setPublic_Id] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
     handleSearch(query)
    }
  };

  const Connectwallet = async () => {
    if (!window.ethereum) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          No metamask detected{" "}
        </div>
      ));
      return;
    }

    let metamaskProvider = null;

    if (Array.isArray(window.ethereum.providers)) {
      metamaskProvider = window.ethereum.providers.find((p) => p.isMetaMask);
    } else if (window.ethereum.isMetaMask) {
      metamaskProvider = window.ethereum;
    }

    if (!metamaskProvider) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          No metamask detected{" "}
        </div>
      ));
      return;
    }

    try {
      const accounts = (await metamaskProvider.request({
        method: "eth_requestAccounts",
      })) as string[];
      console.log("Connected MetaMask account:", accounts[0]);
      setPublic_Id(accounts[0]);
    } catch (error) {
      console.error("Connection rejected or failed:", error);
    }
  };

  useEffect(() => {
    const Connectwallet1 = async () => {
      if (!window.ethereum) {
        return;
      }

      let metamaskProvider = null;

      if (Array.isArray(window.ethereum.providers)) {
        metamaskProvider = window.ethereum.providers.find((p) => p.isMetaMask);
      } else if (window.ethereum.isMetaMask) {
        metamaskProvider = window.ethereum;
      }

      if (!metamaskProvider) {
        return;
      }

      try {
        const accounts = (await metamaskProvider.request({
          method: "eth_requestAccounts",
        })) as string[]; // 👈 explicitly cast to string array

        console.log("Connected MetaMask account:", accounts[0]);
        setPublic_Id(accounts[0]);
      } catch (error) {
        console.error("Connection rejected or failed:", error);
      }
    };
    Connectwallet1();
  }, []);

  useEffect(() => {
    if (Public_Id !== null && Public_Id !== "") {
      setWallet_connected(true);
    }
  }, [Public_Id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (data.user) {
          setrole(data.user.role);
        }
      } catch (err) {
        console.error("Failed to check auth", err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    console.log("role", role);
  }, [role]);

  const validateFields = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (!propertyName.trim()) newErrors.propertyName = true;
    if (!pricePerMonth) newErrors.pricePerMonth = true;
    if (!securityDeposit) newErrors.securityDeposit = true;
    if (!applicationFee) newErrors.applicationFee = true;
    if (!beds) newErrors.beds = true;
    if (!baths) newErrors.baths = true;
    if (!squareFeet) newErrors.squareFeet = true;
    if (!Public_Id) newErrors.Public_Id = true;
    if (!address.trim()) newErrors.address = true;
    if (!city.trim()) newErrors.city = true;
    if (!state.trim()) newErrors.state = true;
    if (!postalCode) newErrors.postalCode = true;
    if (!country) newErrors.country = true;
    if (!propertyType) newErrors.propertyType = true;
    if (files.length === 0) newErrors.files = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

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
          Error fetching location{" "}
        </div>
      ));
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

  const MapView3 = dynamic(() => import("@/app/components/MapView3"), {
    ssr: false,
  });

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
  const [Bathtub, setBathtub] = useState(false);
  const [Wifi, setWifi] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(previews);
    }
  };

  const handleUseMyLocation = () => {
    setdog(false);
    setmy_location(true);
    setsearch_location(false);
    setShowMap(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude }); // ✅ Now TypeScript understands this
        setShowMap(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
          >
            API down
          </div>
        ));
      }
    );
  };

  useEffect(() => {
    if (coords) {
      setlatitude(coords.lat.toString());
      setlongitude(coords.lng.toString());
    }
  }, [coords]);

  const create_button = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!validateFields()) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Please complete all fields!{" "}
        </div>
      ));
      return;
    }

    if (!Public_Id) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Connect wallet!{" "}
        </div>
      ));
      return;
    }

    e.preventDefault();

    const requiredFields = {
      propertyName,
      description,
      pricePerMonth,
      securityDeposit,
      applicationFee,
      beds,
      baths,
      squareFeet,
      propertyType,
      address,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
      Public_Id,
    };

    const emptyFields = Object.entries(requiredFields).filter(
      ([value]) => !value || value.toString().trim() === ""
    );

    if (files.length === 0 || emptyFields.length > 0) {
      if (files.length === 0) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
          >
            Please select at least one image.{" "}
          </div>
        ));
      }
      return;
    }

    setcreating_screen(true);

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
    formData.append("petsAllowed", petsAllowed.toString());
    formData.append("parkingIncluded", parkingIncluded.toString());
    formData.append("Bathtub", Bathtub.toString());
    formData.append("Wifi", Wifi.toString());
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
    formData.append("Public_Id", Public_Id);

    try {
      const response = await fetch("/api/create_listing", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setcreated_listing(true);
        setcreating_screen(false);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Create listing error:", error);
    }
  };

  const [selectedLocation1, setSelectedLocation1] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const memoizedMap = useMemo(() => {
    return (
      <div className="h-[403px] w-[340px] md:w-[973px] bg-gray-300 flex items-center justify-center">
        <MapView3
          markerCoords={selectedLocation}
          onLocationSelect={setSelectedLocation1}
        />
      </div>
    );
  }, [selectedLocation, MapView3]); 

 useEffect(() => {
  if (selectedLocation1) {
    setlatitude(selectedLocation1.lat.toString());
    setlongitude(selectedLocation1.lng.toString());
  }
}, [selectedLocation1]);


  if (creating_screen === true) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center gap-4">
        <div className="relative">
          {/* Animated circles */}
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          {/* Optional: Add a second rotating element inside */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-white border-b-transparent rounded-full animate-spin animation-delay-75"></div>
        </div>
        <div className="text-xl font-medium tracking-wide">
          Creating your listing<span className="animate-pulse">...</span>
        </div>
        <p className="text-gray-400 text-sm">This may take a few moments</p>
      </div>
    );
  }

  if (created_listing === true) {
    router.push("/properties");
    return (
      <div className="bg-black min-h-screen text-white flex flex-col justify-center items-center gap-6">
        {/* Checkmark animation */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pop-in">
          <svg
            className="w-12 h-12 text-white animate-checkmark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Success!
        </h2>
        <p className="text-gray-300">Your listing has been created</p>
        <div className="flex items-center gap-2 text-blue-400 animate-pulse">
          <span>Redirecting</span>
          <svg
            className="w-5 h-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "manager" ? (
        <div className="h-screen flex flex-col overflow-hidden">
          <Navbar />
          <Toaster />
          <div className="md:hidden p-4 bg-white shadow-md flex justify-between items-center">
            {/* Hamburger Menu on Left */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-black focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar */}
            <div
              className={`fixed md:static z-20 top-[50px]  left-0 h-full w-64  overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } md:translate-x-0`}
            >
              <Sidebar_manager />
            </div>

            {isSidebarOpen && (
              <div
                className="fixed inset-0  bg-opacity-50 z-10 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Form area - scrolls */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-5xl mx-auto p-6">
                <h1 className="text-2xl font-semibold mb-2">
                  Add New Property
                </h1>

                <p className="mb-6 text-gray-600">
                  Create a new property listing with detailed information
                </p>

                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-xl font-medium mb-4">
                      Basic Information
                    </h2>
                    <input
                      required
                      className={`w-full p-2 mb-4 border rounded ${
                        errors.propertyName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Property Name"
                      value={propertyName}
                      onChange={(e) => {
                        setPropertyName(e.target.value);
                        if (errors.propertyName)
                          setErrors((prev) => ({
                            ...prev,
                            propertyName: false,
                          }));
                      }}
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
                        className={`p-2 border rounded ${
                          errors.pricePerMonth
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Price per Month"
                        value={pricePerMonth}
                        type="number"
                        onChange={(e) => {
                          setPricePerMonth(e.target.value);
                          if (errors.pricePerMonth)
                            setErrors((prev) => ({
                              ...prev,
                              pricePerMonth: false,
                            }));
                        }}
                      />
                      <input
                        required
                        type="number"
                        className={`p-2 border rounded ${
                          errors.securityDeposit
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Security Deposit"
                        value={securityDeposit}
                        onChange={(e) => {
                          setSecurityDeposit(e.target.value);
                          if (errors.securityDeposit)
                            setErrors((prev) => ({
                              ...prev,
                              securityDeposit: false,
                            }));
                        }}
                      />
                      <input
                        required
                        type="number"
                        className={`p-2 border rounded ${
                          errors.applicationFee
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Application Fee"
                        value={applicationFee}
                        onChange={(e) => {
                          setApplicationFee(e.target.value);
                          if (errors.applicationFee)
                            setErrors((prev) => ({
                              ...prev,
                              applicationFee: false,
                            }));
                        }}
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div>
                    <h2 className="text-xl font-medium mb-4">
                      Property Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        required
                        type="number"
                        className={`p-2 border rounded ${
                          errors.beds ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Number of Beds"
                        value={beds}
                        onChange={(e) => {
                          setBeds(e.target.value);
                          if (errors.beds)
                            setErrors((prev) => ({ ...prev, beds: false }));
                        }}
                      />
                      <input
                        required
                        type="number"
                        className={`p-2 border rounded ${
                          errors.baths ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Number of Baths"
                        value={baths}
                        onChange={(e) => {
                          setBaths(e.target.value);
                          if (errors.baths)
                            setErrors((prev) => ({ ...prev, baths: false }));
                        }}
                      />
                      <input
                        required
                        type="number"
                        className={`p-2 border rounded ${
                          errors.squareFeet
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Square Feet"
                        value={squareFeet}
                        onChange={(e) => {
                          setSquareFeet(e.target.value);
                          if (errors.squareFeet)
                            setErrors((prev) => ({
                              ...prev,
                              squareFeet: false,
                            }));
                        }}
                      />
                    </div>
                    <div className="flex items-center mt-8 space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox accent-black"
                          checked={petsAllowed}
                          onChange={(e) => setPetsAllowed(e.target.checked)}
                        />
                        <span>Pets Allowed</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox accent-black"
                          checked={parkingIncluded}
                          onChange={(e) => setParkingIncluded(e.target.checked)}
                        />
                        <span>Parking Included</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox accent-black"
                          checked={Bathtub}
                          onChange={(e) => setBathtub(e.target.checked)}
                        />
                        <span>Bath Tub</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox accent-black"
                          checked={Wifi}
                          onChange={(e) => setWifi(e.target.checked)}
                        />
                        <span>Wifi</span>
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
                          className={`mt-4 w-full p-2 border rounded ${
                            errors.propertyType
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          value={propertyType}
                          onChange={(e) => {
                            setPropertyType(e.target.value);
                            if (errors.propertyType)
                              setErrors((prev) => ({
                                ...prev,
                                propertyType: false,
                              }));
                          }}
                        >
                          <option value="">Select Property Type</option>
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

                  <div>
                    <h2 className="text-xl font-medium mb-4">Photos</h2>
                    <label
                      htmlFor="photo-upload"
                      className={`block w-full border-2 border-dashed p-6 text-center rounded bg-gray-50 cursor-pointer hover:bg-gray-100 transition ${
                        errors.files ? "border-red-500" : "border-gray-400"
                      }`}
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
                        onChange={(e) => {
                          handleImageChange(e);
                          if (errors.files)
                            setErrors((prev) => ({ ...prev, files: false }));
                        }}
                      />
                    </label>

                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-6">
                        {previewUrls.map((url, index) => (
                          <Image
                            key={index}
                            src={url}
                            alt={`Preview ${index}`}
                            width={300}
                            height={128}
                            className="w-full h-32 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-medium mb-4">
                      Additional Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <input
                        required
                        className={`p-2 border rounded ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (errors.address)
                            setErrors((prev) => ({ ...prev, address: false }));
                        }}
                      />
                      <input
                        required
                        className={`p-2 border rounded ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="City"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city)
                            setErrors((prev) => ({ ...prev, city: false }));
                        }}
                      />
                      <input
                        required
                        className={`p-2 border rounded ${
                          errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="State"
                        value={state}
                        onChange={(e) => {
                          setState(e.target.value);
                          if (errors.state)
                            setErrors((prev) => ({ ...prev, state: false }));
                        }}
                      />
                      <input
                        required
                        className={`p-2 border rounded ${
                          errors.postalCode
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        type="number"
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          if (errors.postalCode)
                            setErrors((prev) => ({
                              ...prev,
                              postalCode: false,
                            }));
                        }}
                      />
                    </div>
                    <div>
                      <select
                        id="country"
                        className={`mt-4 w-full p-2 border rounded ${
                          errors.country ? "border-red-500" : "border-gray-300"
                        }`}
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          if (errors.country)
                            setErrors((prev) => ({ ...prev, country: false }));
                        }}
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
                      </select>
                    </div>

                    <div>
                      <div className="text-xl mt-8 font-medium mb-4">
                        Payment
                      </div>
                      {!Wallet_connected && (
                        <button
                          onClick={Connectwallet}
                          className="relative cursor-pointer group overflow-hidden px-4 py-2 border w-full border-black rounded text-black"
                        >
                          <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
                          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                            Connect wallet
                          </span>
                        </button>
                      )}

                      {Wallet_connected && (
                        <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <span className="font-din font-bold text-gray-700 min-w-[80px]">
                                Your ID:
                              </span>
                              <span className="text-gray-900 font-medium break-all">
                                {Public_Id}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location Options */}
                  <div className="my-6">
                    <h2 className="text-xl font-medium mb-2">Location</h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div>
                        <button
                          onClick={handleUseMyLocation}
                          className={`relative px-4 py-2 rounded cursor-pointer w-full md:w-fit overflow-hidden group border transition-all duration-300 ${
                            my_location
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-gray-200"
                          }`}
                        >
                          {!my_location && (
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full" />
                          )}

                          <span
                            className={`relative z-10 transition-colors duration-300 ${
                              my_location ? "" : "group-hover:text-white"
                            }`}
                          >
                            Use My Current Location
                          </span>
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
                          className={`relative px-4 py-2 rounded  w-full md:w-fit cursor-pointer overflow-hidden group border transition-all duration-300 ${
                            search_location
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-gray-200"
                          }`}
                        >
                          {!search_location && (
                            <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full" />
                          )}

                          <span
                            className={`relative z-10 transition-colors duration-300 ${
                              search_location ? "" : "group-hover:text-white"
                            }`}
                          >
                            Search On Map
                          </span>
                        </button>
                      </div>

                      <div>
                        {search_location && (
                          <div className="relative">
                            <input
                              value={query}
                              onKeyDown={handleKeyDown}
                              onChange={(e) => setQuery(e.target.value)}
                              type="text"
                              placeholder="Enter Location"
                              className="h-[40px] p-2 border border-gray-200 w-[300px] rounded"
                            />

                            {suggestions.length > 0 && (
                              <ul className="absolute top-[45px] w-[600px] z-20 bg-white border opacity-90 border-gray-300 rounded-lg max-h-60 overflow-y-auto shadow-md">
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
                    <div className="h-[403px] w-[340px] md:w-[973px] bg-gray-300 flex items-center justify-center">
                      <MapView1 markerCoords={coords} />
                    </div>
                  )}
                  {search_location && memoizedMap}

                  {dog && (
                    <div className="h-[403px]  w-[340px] md:w-[973px] bg-gray-300 flex items-center justify-center">
                      <MapView2 />
                    </div>
                  )}

                  {/* Submit */}
                  <div>
                    <button
                      onClick={(e) => {
                        create_button(e);
                      }}
                      className="relative w-full py-3 rounded cursor-pointer text-black overflow-hidden group border border-black"
                    >
                      <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>

                      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                        Create Property
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-black flex-col bg-white items-center justify-center min-h-screen flex w-full">
          Signup as Manager
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className="relative cursor-pointer group mt-5 h-[40px] w-[170px] border rounded-lg border-gray-300 overflow-hidden"
          >
            <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>

            <span className="relative z-10 text-black transition-colors duration-300 group-hover:text-white">
              Signup
            </span>
          </button>
        </div>
      )}
    </>
  );
}
