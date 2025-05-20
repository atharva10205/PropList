"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Favorites",
      path: "/favorites",
      icon:
        pathname === "/favorites"
          ? "https://img.icons8.com/?size=100&id=85138&format=png&color=000000" // active icon
          : "https://img.icons8.com/?size=100&id=85038&format=png&color=000000", // default icon
    },
    {
      name: "Applications",
      path: "/applications",
      icon: "https://img.icons8.com/?size=100&id=2bMQJZQif7nl&format=png&color=000000",
    },
    {
      name: "Residences",
      path: "/residences",
      icon: "https://img.icons8.com/?size=100&id=W4QfMayFv3KE&format=png&color=000000",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "https://img.icons8.com/?size=100&id=14099&format=png&color=000000",
    },
  ];

  return (
    <div className="w-[180px] h-[calc(100vh-50px)] bg-gray-100 p-4 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-6">Renter View</h2>
      <ul className="space-y-4">
        {menuItems.map(({ name, path, icon }) => (
          <li key={path}>
            <Link href={path} className="block">
              <div
                className={`flex items-center gap-3 p-1 rounded cursor-pointer hover:text-black ${
                  pathname === path ? "text-black font-bold" : "text-gray-800"
                }`}
              >
                <img className="h-[15px] w-[15px]" src={icon} alt={`${name} icon`} />
                <span>{name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
