"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Footer from "@/app/components/Footer";

const PropertyDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = decodeURIComponent(params.id as string); //addID
  const [data, setData] = useState<any>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [userId, setUserId] = useState(""); //SenderID
  const [submit_popup, setsubmit_popup] = useState(false);
  const propertyId = id;
  const [user_data, setuser_data] = useState<string | null>(null);
  const [Contact, setContact] = useState(null); //contact
  const [reciver_id, setreciver_id] = useState(null); //reciverID
  const [Message, setMessage] = useState(null); //message
  const [loading, setLoading] = useState(true);
  const [role, setrole] = useState("");
  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
        if (data.user) {
          setrole(data.user.role);
        }
      } catch (err) {
        console.error("Failed to check auth", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const submit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/application_submit", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Contact, reciver_id, Message, id, userId }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/applications");
      } else if (response.status === 409) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
          >
            Application alredy exist{" "}
          </div>
        ));
        setLoading(false);
      } else {
        console.error("Error from server:", data.message);
        alert(`Error: ${data.message}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submit_popup) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [submit_popup]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch("/api/user_id", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await res.json();

        if (res.ok) {
          setUserId(data.userId);
        } else {
          console.error("Error from backend:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      const get_user_data = async () => {
        const response = await fetch("/api/user_data_full", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        setuser_data(data);
      };
      get_user_data();
    }
  }, [userId]);

  const handleLikeToggle = async () => {
    if (IsAuthenticated !== true) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-white border mt-[40px] border-black text-black flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          SignUp to like
        </div>
      ));
      return;
    }

    try {
      const response = await fetch("/api/like_button", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, userId }),
      });

      const result = await response.json();
      setLiked(result.like);
    } catch (error) {
      console.error("Like toggle failed:", error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    const fetchLikeStatus = async () => {
      const response = await fetch("/api/liked_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, userId }),
      });

      const result = await response.json();
      setLiked(result.liked);
    };

    if (propertyId && userId) {
      fetchLikeStatus();
    }
  }, [propertyId, userId, handleLikeToggle]);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch("/api/get_addd_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const result = await response.json();
        setData(result);
        setLatitude(result.information.latitude);
        setLongitude(result.information.longitude);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  useEffect(() => {
    if (id) {
      const get_reciver_id = async () => {
        const response = await fetch("/api/get_reciver_id", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        setreciver_id(data.userId);
      };
      get_reciver_id();
    }
  }, [id]);

  const info = data?.information;
  const MapView4 = dynamic(() => import("@/app/components/MapView4"), {
    ssr: false,
  });

  return (
    <div>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <Toaster />

      {loading ? (
        <div className="flex justify-center items-center h-[800px]">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                className="fixed inset-0 bg-black/80 flex items-center  justify-center z-50"
                onClick={() => setSelectedImage(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.img
                  src={selectedImage}
                  alt="Selected Property"
                  className="max-w-3xl max-h-[90vh] object-contain w-full rounded shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="max-w-6xl mt-[60px] mx-auto p-4 space-y-6">
            {/* Images Grid */}
            {info?.imageURLs && (
              <div>
                {/* Mobile view: horizontal scrollable slider */}
                <div className="flex gap-2 overflow-x-auto sm:hidden">
                  {info.imageURLs.map((url: string, index: number) => (
                    <motion.img
                      key={index}
                      src={url}
                      alt={`Property image ${index + 1}`}
                      className="h-48 min-w-[250px] object-cover rounded flex-shrink-0"
                      onClick={() => setSelectedImage(url)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>

                {/* Tablet/Desktop view: grid */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-2 cursor-pointer">
                  {info.imageURLs.map((url: string, index: number) => (
                    <motion.img
                      key={index}
                      src={url}
                      alt={`Property image ${index + 1}`}
                      className="h-48 w-full object-cover rounded"
                      onClick={() => setSelectedImage(url)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Property Info */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{info?.propertyName}</h1>
                <motion.button
                  onClick={handleLikeToggle}
                  className="cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                >
                  <img
                    src={
                      liked
                        ? "https://img.icons8.com/?size=100&id=85138&format=png&color=000000"
                        : "https://img.icons8.com/?size=100&id=p7MI4JnqXYvv&format=png&color=000000"
                    }
                    className="h-[20px] w-[20px] object-contain"
                    alt="Heart Icon"
                  />
                </motion.button>
              </div>

              <p className="text-gray-600">
                {info?.address}, {info?.city}, {info?.state}, {info?.country},{" "}
                {info?.postalCode}
              </p>

              <div className="flex flex-wrap gap-4 text-sm border-y py-2">
                <span>
                  Monthly Rent: <strong>${info?.pricePerMonth}</strong>
                </span>
                <span>
                  Bedrooms: <strong>{info?.beds} bd</strong>
                </span>
                <span>
                  Bathrooms: <strong>{info?.baths} ba</strong>
                </span>
                <span>
                  Square Feet: <strong>{info?.squareFeet} sq ft</strong>
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold mb-1">
                About {info?.propertyName}
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {info?.description}
              </p>
            </div>

            {/* Villa Features */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Villa Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-sm">
                {[
                  {
                    label: "Parking Included",
                    value: info?.parkingIncluded ? "Yes" : "No",
                  },
                  {
                    label: "Pets Allowed",
                    value: info?.petsAllowed ? "Yes" : "No",
                  },
                  {
                    label: "Application Fee",
                    value: `$${info?.applicationFee}`,
                  },
                  {
                    label: "Security Deposit",
                    value: `$${info?.securityDeposit}`,
                  },
                  { label: "Latitude", value: info?.latitude },
                  { label: "Longitude", value: info?.longitude },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="border p-2 rounded"
                    whileHover={{
                      y: -2,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}: <strong>{item.value}</strong>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Highlights</h2>
              <p className="text-sm text-gray-700">{info?.highlights}</p>
            </div>

            {/* Submit Application */}
            {role === "tenant" && (
              <motion.div
                onClick={() => setsubmit_popup(true)}
                className="relative w-full h-[40px] overflow-hidden group border border-gray-200 cursor-pointer flex items-center justify-center rounded text-center"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="absolute bottom-0 left-0 w-full h-0 bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  Submit Application
                </span>
              </motion.div>
            )}

            {/* Popup */}
            {submit_popup && (
              <AnimatePresence>
                <motion.div
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                  onClick={() => setsubmit_popup(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="bg-white border-2 border-black h-[550px] w-[700px] p-4 rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* User Info */}
                    <div className="mt-5 flex items-center gap-4">
                      <motion.img
                        className="h-[60px] w-[60px] rounded-full"
                        src="https://imgs.search.brave.com/5UXUrwnw8J0ENnlCfKBvy2iT3ZiU9L2WC2CXtxFJfO0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvcGZw/LXBpY3R1cmVzLWsz/ZHF4bjNuMG5heGVm/bjIuanBn"
                        alt="User Avatar"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                      <h1 className="break-all">
                        {user_data?.username || "xyz"}
                      </h1>
                    </div>

                    <div className="mt-4">
                      <div className="flex gap-2 items-center">
                        <strong>Email:</strong>
                        <span className="break-all">
                          {user_data?.email || "xyz"}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <strong>Contact:</strong>
                        <motion.input
                          className="border border-gray-300 shadow-lg rounded px-2"
                          type="number"
                          onChange={(e) => setContact(e.target.value)}
                          whileFocus={{
                            scale: 1.02,
                            boxShadow: "0 0 0 2px rgba(0, 0, 255, 0.2)",
                          }}
                        />
                      </div>
                    </div>

                    <motion.div
                      className="h-[300px] mt-4 w-full rounded-lg border border-gray-300 shadow-lg p-4 outline-none"
                      contentEditable
                      placeholder="Message"
                      onInput={(e) => setMessage(e.currentTarget.textContent)}
                      suppressContentEditableWarning
                      whileFocus={{
                        boxShadow: "0 0 0 2px rgba(0, 0, 255, 0.2)",
                      }}
                    ></motion.div>

                    <motion.button
                      onClick={submit}
                      className="relative group overflow-hidden w-full mt-2 rounded-lg h-[40px] border border-gray-300 shadow-lg"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="absolute h-0 bottom-0 left-0 w-full bg-black origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                        Submit
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Map */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Map</h2>
              <div className="h-[410px] w-full border border-gray-300">
                {latitude !== null && longitude !== null ? (
                  <MapView4 latitude={latitude} longitude={longitude} />
                ) : (
                  <p className="text-gray-400">loading map...</p>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
};

export default PropertyDetails;
