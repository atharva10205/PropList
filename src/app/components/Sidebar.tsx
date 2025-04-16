import React from "react";
import { FaHeart, FaFileAlt, FaHome, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-6">Renter View</h2>
      <ul className="space-y-4">
        <li className="flex items-center gap-3 text-gray-800 hover:text-black cursor-pointer">
          <img
            className="h-[15px] w-[15px]"
            src="https://img.icons8.com/?size=100&id=85038&format=png&color=000000"
            alt=""
          />
          <span>Favorites</span>
        </li>
        <li className="flex items-center gap-3 text-gray-800 hover:text-black cursor-pointer">
          <img
            className="h-[15px] w-[15px]"
            src="https://img.icons8.com/?size=100&id=2bMQJZQif7nl&format=png&color=000000"
            alt=""
          />
          <span>Applications</span>
        </li>
        <li className="flex items-center gap-3 text-gray-800 hover:text-black cursor-pointer">
          <img
            className="h-[15px] w-[15px]"
            src="https://img.icons8.com/?size=100&id=W4QfMayFv3KE&format=png&color=000000"
            alt=""
          />
          <span>Residences</span>
        </li>
        <li className="flex items-center gap-3 text-gray-800 hover:text-black cursor-pointer">
          <img
            className="h-[15px] w-[15px]"
            src="https://img.icons8.com/?size=100&id=14099&format=png&color=000000"
            alt=""
          />
          <span>Settings</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
