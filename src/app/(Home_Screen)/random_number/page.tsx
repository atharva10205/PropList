"use client"

import React from "react";
import Navbar from "@/app/components/Navbar";

const PropertyDetails = () => {
  return (
    <div>
        <Navbar/>
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Image Gallery */}
      <div className="grid grid-cols-3 gap-2">
        <img src="https://imgs.search.brave.com/JS9kEhj33fnlgUqD1eSweQIQErufQEZ5f24J3D2BmzQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9o/b3VzZS1pc29sYXRl/ZC1maWVsZF8xMzAz/LTIzNzczLmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDA" alt="Villa" className="h-48 w-full object-cover rounded" />
        <img src="https://imgs.search.brave.com/h4Ngzy6BeuakJFv1cBEFeT7XtQImrAfvKCX8up7GDyw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODI3/NzgyMzkvcGhvdG8v/cmVhbC1lc3RhdGUt/aW1hZ2VzLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OVnNF/alEtTDVtTkZJR2VV/cWlzRk4yNzR3azEy/Zk04SUQxZW5hcVR1/bkZZPQ" alt="Villa" className="h-48 w-full object-cover rounded" />
        <img src="https://imgs.search.brave.com/n-nmh_MI97XO9qKYKN-iQRu0DXaRXUHrrIv5Vkl3VHM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTA1/NDcxMDgwL3Bob3Rv/L2V4dGVyaW9yLW9m/LXZpbnRhZ2UtaG91/c2UuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPVMxSkpEUnA5/WHJsMUJLdDFndDBI/cnhuVFMwaFNwUlgy/THp6aEpEd3pfM3c9" alt="Villa" className="h-48 w-full object-cover rounded" />
        <img src="https://imgs.search.brave.com/F-BI6Qdc1yenyGLvo9uktjZYHdbVkB6e_XD16qZD-hw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvODQ4/NTQ5Mjg2L3Bob3Rv/L2RyZWFtLWhvbWUt/bHV4dXJ5LWhvdXNl/LXN1Y2Nlc3MuanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPWNq/aG9OcW9tTlR4Z1lX/eHVaOUV2NVB4Wmg2/V1k5NnZ2REdmM0hs/LTd4LVU9" alt="Villa" className="h-48 w-full object-cover rounded" />
        <img src="https://imgs.search.brave.com/uV2am6liyl8Sa6azcPFrNastvHutKmrq8kylEM3bWTo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI3/MjE2MzEwNi9waG90/by9sYXJnZS1ob3Vz/ZS13aXRoLXN0ZWVw/LXJvb2YtYW5kLXNp/ZGUtZW50cnktdGhy/ZWUtY2FyLWdhcmFn/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9ekNIeHppcWh1/aklUalIwSU1vQ1BG/eEZEUHlwSXM2Zk1n/cEtkWUhLV3phQT0" alt="Villa" className="h-48 w-full object-cover rounded" />
        <img src="https://imgs.search.brave.com/cl90LJiLCgrLIlrJYc7HgXiNSZOfhZyp3-S_mWiL5jQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTg0/ODU5Njk5L3Bob3Rv/L21vZGVybi1sdXh1/cnktd2hpdGUtaG91/c2Utd2l0aC1nYXJh/Z2UuanBnP3M9NjEy/eDYxMiZ3PTAmaz0y/MCZjPXViQUZIWUFp/WEkzaFR4TWxpc09N/blF0bjh1RE04eElW/V3dXbU1SbnBiY2M9" alt="Villa" className="h-48 w-full object-cover rounded" />
      </div>

      {/* Header and Basic Info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Sunset Private Villa in Kuta Bali</h1>
        <p className="text-gray-600">Kuta Selatan, Bali, Indonesia</p>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span className="text-yellow-400">★</span> 4.8 (347 Reviews)
          <span className="text-green-600 ml-4">Verified Listing</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm border-t border-b py-2">
          <span>Monthly Rent: <strong>$3,230 – $3,675</strong></span>
          <span>Bedrooms: <strong>2 bd</strong></span>
          <span>Bathrooms: <strong>2 ba</strong></span>
          <span>Square Feet: <strong>980 – 1,120 sq ft</strong></span>
        </div>
      </div>

      {/* About Section */}
      <div>
        <h2 className="text-lg font-semibold mb-1">About Sunset Private Villa</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Experience resort style luxury living where ocean and city seamlessly intertwine. Our newly built community features sophisticated two and three-bedroom residences, complete with high-end designer finishes, stainless appliances, office nooks, and full-size in-unit washers and dryers. Relax beside shimmering pools and unwind in private cabanas.
        </p>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Villa Features</h2>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="border p-2 rounded">Washer/Dryer</div>
          <div className="border p-2 rounded">Air Conditioning</div>
          <div className="border p-2 rounded">Dishwasher</div>
          <div className="border p-2 rounded">High Speed Internet</div>
          <div className="border p-2 rounded">Hardwood Floors</div>
          <div className="border p-2 rounded">Walk-in Closets</div>
          <div className="border p-2 rounded">Microwave</div>
          <div className="border p-2 rounded">Refrigerator</div>
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Highlights</h2>
        <ul className="grid grid-cols-2 gap-1 text-sm text-gray-700">
          <li>High Speed Internet Access</li>
          <li>Smoke Free</li>
          <li>Washer/Dryer</li>
          <li>Cable Ready</li>
          <li>Air Conditioning</li>
          <li>Satellite TV</li>
          <li>Heating</li>
          <li>Double Vanities</li>
        </ul>
      </div>

      {/* Fees and Policies */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Fees and Policies</h2>
        <p className="text-sm text-gray-700">One-Time Move-In Fees</p>
        <p className="text-sm">Application Fee: <strong>$30</strong></p>
      </div>

      {/* Map Section */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Map and Location</h2>
        <p className="text-sm mb-2">Property Address: Kuta Selatan, Bali, Indonesia, Post Code 90501</p>
        <img src="https://imgs.search.brave.com/S5OIym6ATyZlDAHfpIjV2COQguvxGuLkuRFs63NCT54/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly91czEu/ZGlzY291cnNlLWNk/bi5jb20vZmxleDAy/MC91cGxvYWRzL2Fk/YWxvL29wdGltaXpl/ZC8zWC9kLzcvZDcx/M2JkMjY0YWVkNWRh/ZWJhNmUzZGVhYThk/MDEwZjMwOTJjZDdl/MF8yXzQzM3g1MDAu/anBlZw" alt="Map" className="w-full h-64 object-cover rounded" />
      </div>
    </div>
    </div>
  );
};

export default PropertyDetails;
