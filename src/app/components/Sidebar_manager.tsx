"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const Sidebar_manager = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Properties",
      path: "/properties", 
      icon: "https://img.icons8.com/?size=100&id=W4QfMayFv3KE&format=png&color=000000",
    },
    {
      name: "Add Properties",
      path: "/create", 
      icon: "https://img.icons8.com/?size=100&id=W4QfMayFv3KE&format=png&color=000000",
    },
    {
      name: "Applications",
      path: "/application",
      icon: "https://img.icons8.com/?size=100&id=2bMQJZQif7nl&format=png&color=000000",
    },
    {
      name: "Residences",
      path: "/residence",
      icon: "https://img.icons8.com/?size=100&id=W4QfMayFv3KE&format=png&color=000000",
    },
    {
      name: "Settings",
      path: "/setting",
      icon: "https://img.icons8.com/?size=100&id=14099&format=png&color=000000",
    },
  ];

  return (
    <div>
    <div className="w-[190px] h-[calc(100vh-50px)] bg-gray-100    p-4 border-r border-gray-300">
      <h2 className="text-lg font-semibold mb-6">Manager View</h2>
      <ul className="space-y-4">
        {menuItems.map(({ name, path, icon }) => (
          <li key={path}>
            <Link href={path} className="block">
              <div
                className={`flex items-center gap-3 p-1 rounded cursor-pointer hover:text-black ${
                  pathname === path
                    ? "text-black-600 font-bold"
                    : "text-gray-800"
                }`}
              >
                <img className="h-[15px] w-[15px]" src={icon} alt="" />
                <span>{name}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Sidebar_manager;
