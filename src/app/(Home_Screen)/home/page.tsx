"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "@/app/components/Footer";

const Page = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [properties, setProperties] = useState([]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && query.trim() !== "") {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    const get_data = async () => {
      try {
        const response = await fetch("/api/3_random_property", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const result = await response.json();
        setProperties(result);
        console.log("result", result);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
      }
    };

    get_data();
  }, []);

  const handleCityClick = (city) => {
    const citySlug = city.toLowerCase().replace(/\s+/g, "-");
    router.push(`/search/${citySlug}`);
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

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  return (
  <div className="bg-black">
    <Navbar />

    {/* HERO SECTION */}
    <div className="relative bg-black h-[calc(100vh-50px)] w-full">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover absolute top-0 left-0 opacity-50 z-0"
        src="/Untitled design.mp4"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <motion.div
          className="flex flex-col mb-4 text-center space-y-2"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          <motion.div
            variants={fadeUp}
            className="text-white text-xl sm:text-2xl md:text-3xl font-sans font-bold"
          >
            Start your journey to find the
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="text-white text-xl sm:text-2xl md:text-3xl font-bold"
          >
            Perfect place to call home
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="text-white text-sm sm:text-base"
          >
            explore our wide range of rental properties tailored to your lifestyle!
          </motion.div>
        </motion.div>

        <div className="relative w-full max-w-lg">
          <input
            className="w-full h-12 sm:h-[60px] px-4 rounded-full bg-white opacity-55 shadow-lg text-sm sm:text-base"
            type="text"
            value={query}
            onKeyDown={handleKeyDown}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, neighbourhood, or address"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-[50px] sm:top-[65px] w-full z-20 bg-white border opacity-80 border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((place, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    router.push(`/search/${encodeURIComponent(place.display_name)}`);
                    setSuggestions([]);
                  }}
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>

    {/* MAIN SECTION */}
    <div className="min-h-screen">
      {/* Featured Properties */}
      <div className="relative bg-white py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h2
            className="text-black text-2xl sm:text-3xl font-bold text-center mb-12"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Featured Properties
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-4">
            {properties.map((property) => (
              <motion.div
                key={property.id}
                className="w-full sm:w-72 md:w-80 bg-white rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-gray-200"
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                onClick={() => router.push(`/property/${property.id}`)}
              >
                <div className="relative">
                  <img
                    src={property.imageURLs?.[0] || "/placeholder.jpg"}
                    alt={property.propertyName || "Property Image"}
                    className="h-48 w-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-bold">
                    {property.propertyName || "Unnamed Property"}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {property.city || "Unknown City"},{" "}
                    {property.state || "Unknown State"},{" "}
                    {property.country || "Unknown Country"}
                  </p>
                  <div className="flex items-center mb-3">
                    <span className="text-sm font-semibold ml-auto">
                      {property.pricePerMonth
                        ? `$${property.pricePerMonth}`
                        : "Price N/A"}
                    </span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <img
                        className="h-4 w-4 ml-2"
                        src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                        alt=""
                      />
                      {property.beds || 0} Bed
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        className="h-4 w-4"
                        src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                        alt=""
                      />
                      {property.baths || 0} Bath
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        className="h-4 w-4"
                        src="https://img.icons8.com/?size=100&id=912&format=png&color=000000"
                        alt=""
                      />
                      {property.amenities || "Amenities"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Popular Locations */}
      <div className="relative bg-white py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h2
            className="text-black text-2xl sm:text-3xl font-bold text-center mb-12"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Popular Locations
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {["New York", "Los Angeles", "Chicago", "Miami", "Austin"].map(
              (city) => (
                <button
                  key={city}
                  onClick={() => handleCityClick(city)}
                  className="relative shadow-lg group overflow-hidden px-6 py-2 sm:py-3 text-black font-medium rounded-full cursor-pointer backdrop-blur-sm bg-white bg-opacity-10 border border-gray-300"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {city}
                  </span>
                  <div className="absolute inset-0 bg-black origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100 z-0" />
                </button>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us */}
      <div className="relative bg-white py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h2
            className="text-black text-2xl sm:text-3xl font-bold text-center mb-12"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Why Choose Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏠",
                title: "Wide Selection",
                text: "Thousands of properties to choose from",
              },
              {
                icon: "🔍",
                title: "Easy Search",
                text: "Find your perfect home in minutes",
              },
              {
                icon: "💰",
                title: "Best Prices",
                text: "Competitive rates with no hidden fees",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="bg-white border border-gray-300 text-black cursor-pointer bg-opacity-5 p-6 rounded-xl backdrop-blur-sm"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-black text-lg sm:text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-black text-sm sm:text-base">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <div className="relative bg-white py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h2
            className="text-black text-2xl sm:text-3xl font-bold mb-6"
            initial={{ y: 20 }}
            whileInView={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Ready to Find Your Perfect Home?
          </motion.h2>

          <motion.p
            className="text-gray-500 mb-8 max-w-2xl mx-auto text-sm sm:text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join thousands of happy renters who found their ideal property with us.
          </motion.p>

          <motion.button
            className="relative group overflow-hidden cursor-pointer border border-gray-300 text-black px-8 py-3 rounded-full font-bold text-base sm:text-lg bg-white"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "#f3f4f6",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              Get Started Now
            </span>
            <div className="absolute inset-0 bg-black origin-bottom scale-y-0 transition-transform duration-300 group-hover:scale-y-100 z-0" />
          </motion.button>

          <motion.div
            className="mt-8 text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Pay with crypto • Cancel anytime
          </motion.div>
        </motion.div>
      </div>
    </div>

    <Footer />
  </div>
);

};

export default Page;
