"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        console.error("Failed to check auth", err);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        setIsAuthenticated(false);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="flex stickey top-0">
      <div className="bg-black text-white h-[50px] w-full flex justify-between items-center">
        <div className="text-white ml-4">I am a navbar</div>
        <div className="ml-auto mr-4">
          {!IsAuthenticated ? (
            <>
              <button
                onClick={() => router.push("/signup")}
                className="mr-2 h-[35px] text-[14px] w-[70px] border border-white  rounded-[9px] cursor-pointer hover:text-black hover:bg-white hover:font-bold"
              >
                SignUp
              </button>
              <button
                onClick={() => router.push("/login")}
                className="mr-[10px] h-[35px] text-[14px] border w-[70px] border-white  rounded-[9px] cursor-pointer hover:text-black hover:bg-white hover:font-bold"
              >
                Login
              </button>
            </>
          ) : (
            <div className="flex flex-row gap-3 items-center relative" ref={dropdownRef}>
              <div className="relative h-[30px] w-[30px] cursor-pointer group">
                <img
                  src="https://img.icons8.com/?size=100&id=85701&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full group-hover:hidden"
                  alt="default icon"
                />
                <img
                  src="https://img.icons8.com/?size=100&id=85491&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full hidden group-hover:block"
                  alt="hover icon"
                />
              </div>

              <div className="relative h-[30px] w-[30px] cursor-pointer group">
                <img
                  src="https://img.icons8.com/?size=100&id=82754&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full group-hover:hidden"
                  alt=""
                />
                <img
                  src="https://img.icons8.com/?size=100&id=83193&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full hidden group-hover:block"
                  alt=""
                />
              </div>

              <div
                onClick={() => setShowDropdown((prev) => !prev)}
                className="flex flex-row items-center justify-center cursor-pointer"
              >
                <img
                  src="https://cdn-icons-png.freepik.com/512/8861/8861091.png"
                  className="rounded-full mr-1 bg-white h-[35px] w-[35px]"
                  alt=""
                />
                <div className="font-bold">username123</div>
              </div>

              {showDropdown && (
                <div className="absolute top-12  right-0 bg-black text-white shadow-md rounded-xl p-3 z-50 w-48 flex flex-col space-y-2">
                  <button
                    onClick={() => router.push("/favorites")}
                    className="text-left hover:bg-white hover:text-black cursor-pointer px-4 py-2 rounded"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push("/settings")}
                    className="text-left hover:bg-white hover:text-black cursor-pointer px-4 py-2 rounded"
                  >
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-left hover:bg-white hover:text-black cursor-pointer px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
