"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [username, setusername] = useState("");
  const [role, setrole] = useState("");
  const [userId, setUserId] = useState(null);


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
          console.log("Error from backend:");
        }
      } catch  {
        console.log("Fetch error:");
      }
    };
    getUserId();
  }, []);

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
        console.log("Failed to check auth", err);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getuserdata = async () => {
      try {
        const response = await fetch("/api/user_data" , {
           method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        console.log("niginginigginga", data);
        setusername(data);
      } catch (error) {
        console.log("Error while fetching getuserdata:", error);
      }
    };
    getuserdata();
  }, [userId]);

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
        console.log("Logout failed");
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <div className="flex stickey top-0">
      <div className="bg-black text-white h-[50px] w-full flex justify-between items-center">
        <div
          className="h-[35px] w-[35px] ml-2 rounded-full overflow-hidden cursor-pointer"
          onClick={() => router.push("/home")}
        >
          <img
            className="h-full w-full scale-150 object-cover"
            src="https://i.pinimg.com/736x/61/85/c2/6185c254877b80aa71dbe737971a753b.jpg"
            alt=""
          />
        </div>
        <div
          onClick={() => router.push("/home")}
          className="ml-4 border-l-4 border-gray-300 cursor-pointer pl-3 group"
        >
          <span className="text-white font-thin text-3xl tracking-tight relative">
            HOM<span className="font-bold">IFI</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
          </span>
        </div>{" "}
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
            <div
              className="flex flex-row gap-3 items-center relative"
              ref={dropdownRef}
            >
              {/* <div className="border border-white rounded-lg p-1 cursor-pointer group:">
                connect wallet
              </div> */}

              {/* <div className="relative h-[30px] w-[30px] cursor-pointer group">
                <img
                  src="https://img.icons8.com/?size=100&id=85491&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full hidden group-hover:block"
                  alt="hover icon"
                />
              </div> */}

              {/* <div
                onClick={() => {
                  setnotification_popup((prev) => !prev),
                    setShowDropdown(false);
                }}
                className="relative  h-[30px] w-[30px] cursor-pointer group"
              >
                <img
                  src="https://img.icons8.com/?size=100&id=82754&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full group-hover:hidden"
                  alt=""
                />
                <img
                  src="https://img.icons8.com/?size=100&id=83193&format=png&color=FFFFFF"
                  className="absolute top-0 left-0 h-full w-full hidden group-hover:block"
                  alt=""
                   src="https://cdn-icons-png.freepik.com/512/8861/8861091.png"
                />
              </div> */}

              <div
                onClick={() => {
                  setShowDropdown((prev) => !prev);
                }}
                className="flex flex-row items-center justify-center  cursor-pointer group relative px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                {/* Profile picture - always visible without hover effects */}
                <div className="relative mr-2">
                  <img
                    src={username.pfpUrl}
                    className="rounded-full h-[40px] w-[40px] border-2 border-white/30 object-cover"
                    alt="Profile"
                  />
                </div>

                {/* Username with animated underline */}
                <div className="font-bold text-white relative">
                  {username.username}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                </div>

                {/* Chevron icon */}
                <svg
                  className={`ml-2 h-4 w-4 text-white transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {showDropdown && (
                <div className="absolute top-12 mt-5 right-0 bg-black text-white shadow-md rounded-xl p-3 z-50 w-48 flex flex-col space-y-2">
                  <button
                    onClick={() => {
                      if (role === "tenant") {
                        router.push("/favorites");
                      } else {
                        router.push("/properties");
                      }
                    }}
                    className="relative overflow-hidden group text-left px-4 py-2 rounded cursor-pointer "
                  >
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-white origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                      Dashboard
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      if (role === "tenant") {
                        router.push("/settings");
                      } else {
                        router.push("/setting");
                      }
                    }}
                    className="relative overflow-hidden group text-left px-4 py-2 rounded cursor-pointer "
                  >
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-white origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                      Settings
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="relative overflow-hidden group text-left px-4 py-2 rounded cursor-pointer "
                  >
                    <span className="absolute bottom-0 left-0 w-full h-0 bg-white origin-bottom transition-all duration-300 ease-out group-hover:h-full"></span>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                      Logout
                    </span>
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
