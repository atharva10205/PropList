"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const PropertyDetails = () => {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);
  const [data, setData] = useState<any>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [userId, setUserId] = useState("");
  const [submit_popup, setsubmit_popup] = useState(false);
  const propertyId = id;

  useEffect(() => {
    if (submit_popup) {
      document.body.style.overflow = "hidden"; // Disable scroll
    } else {
      document.body.style.overflow = "auto"; // Enable scroll again
    }

    return () => {
      document.body.style.overflow = "auto"; // Clean up on unmount
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

  const handleLikeToggle = async () => {
    const response = await fetch("/api/like_button", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, userId }),
    });
    const result = await response.json();
    setLiked(result.like);
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
      }
    };

    fetchPropertyData();
  }, [id]);

  const info = data?.information;
  const MapView4 = dynamic(() => import("@/app/components/MapView4"), {
    ssr: false,
  });

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Enlarged"
            className="max-w-3xl max-h-[90vh] object-contain rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="max-w-6xl mt-[60px] mx-auto p-4 space-y-6">
        {info?.imageURLs && (
          <div className="grid grid-cols-3 cursor-pointer gap-2">
            {info.imageURLs.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Property image ${index + 1}`}
                className="h-48 w-full object-cover rounded"
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold">{info?.propertyName}</h1>
            <button onClick={handleLikeToggle} className="cursor-pointer">
              <img
                src={
                  liked
                    ? "https://img.icons8.com/?size=100&id=85138&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=p7MI4JnqXYvv&format=png&color=000000"
                }
                className="h-[20px] w-[20px] object-contain"
                alt="heart icon"
              />
            </button>
          </div>
          <p className="text-gray-600">
            {info?.address}, {info?.city}, {info?.state}, {info?.country},{" "}
            {info?.postalCode}
          </p>
          <div className="flex flex-wrap gap-4 text-sm border-t border-b py-2">
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

        <div>
          <h2 className="text-lg font-semibold mb-1">
            About {info?.propertyName}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {info?.description}
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Villa Features</h2>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="border p-2 rounded">
              Parking Included: {info?.parkingIncluded ? "Yes" : "No"}
            </div>
            <div className="border p-2 rounded">
              Pets Allowed: {info?.petsAllowed ? "Yes" : "No"}
            </div>
            <div className="border p-2 rounded">
              Application Fee: ${info?.applicationFee}
            </div>
            <div className="border p-2 rounded">
              Security Deposit: ${info?.securityDeposit}
            </div>
            <div className="border p-2 rounded">Latitude: {info?.latitude}</div>
            <div className="border p-2 rounded">
              Longitude: {info?.longitude}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Highlights</h2>
          <p className="text-sm text-gray-700">{info?.highlights}</p>
        </div>

        <div>
          <div
            onClick={() => {
              setsubmit_popup(true);
            }}
            className="w-full h-[40px] border cursor-pointer text-center items-center flex justify-center rounded border-gray-200   bg-black text-white"
          >
            Submit Application
          </div>
        </div>

        {submit_popup && (
          <div
            className="fixed h-full inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setsubmit_popup(false)}
          >
            <div
              className="bg-white border border-black-300 h-[500px] w-[700px] p-4 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Popup content here */}
            </div>
          </div>
        )}

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

      <div className="bg-gray-900 h-[166px] w-full">
        <h1 className="text-white flex items-center justify-center">Footer</h1>
      </div>
    </div>
  );
};

export default PropertyDetails;
