"use client";

import React, { useState, useEffect } from "react";
import Sidebar_manager from "@/app/components/Sidebar_manager";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Wallet_connected, setWallet_connected] = useState(false);
  const [Public_Id, setPublic_Id] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const changeWallet = async () => {
    if (!window.ethereum) {
      toast("Please install MetaMask");
      return;
    }

    let metamaskProvider = null;

    if (Array.isArray(window.ethereum.providers)) {
      metamaskProvider = window.ethereum.providers.find((p) => p.isMetaMask);
    } else if (window.ethereum.isMetaMask) {
      metamaskProvider = window.ethereum;
    }

    if (!metamaskProvider) {
      toast("MetaMask not found");
      return;
    }

    try {
      await metamaskProvider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await metamaskProvider.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setPublic_Id(accounts[0]);
        console.log("Connected to:", accounts[0]);
      }
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  };

  useEffect(() => {
    const Connectwallet = async () => {
      if (!window.ethereum) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
          >
            Please install MetaMask{" "}
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
            Please install MetaMask{" "}
          </div>
        ));
        return;
      }

      try {
        const accounts = await metamaskProvider.request({
          method: "eth_requestAccounts",
        });
        console.log("Connected MetaMask account:", accounts[0]);
        setPublic_Id(accounts[0]);
      } catch (error) {
        console.error("Connection rejected or failed:", error);
      }
    };

    Connectwallet();
  }, []);

  useEffect(() => {
    if (Public_Id !== null && Public_Id !== "") {
      setWallet_connected(true);
    }
  }, [Public_Id]);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const res = await fetch("/api/user_id", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const data = await res.json();
        if (res.ok) {
          setUserId(data.userId);
        } else {
          console.error("Error from backend:", data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    getUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const getApplications = async () => {
      try {
        const response = await fetch("/api/accepted_application_data", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const fetchedData = await response.json();
        setApplications(fetchedData);
        console.log(fetchedData);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };

    getApplications();
  }, [userId]);

  const filteredApplications =
    applications?.filter((app) => app.status === "accepted") || [];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />
      <Toaster />

      <div className="md:hidden flex justify-between items-center p-4 bg-white  z-30">
        <button
          aria-label="Toggle sidebar"
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
        <aside
          className={`
            fixed top-[50px] left-0 z-40 h-full w-64  overflow-y-auto transition-transform duration-300 ease-in-out
            md:static md:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar_manager />
        </aside>

        {/* Overlay behind sidebar on mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0  bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <h1 className="text-2xl font-bold mb-4 hidden md:block">
            Residences
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 mt-4">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <div
                    key={application.applicationId}
                    className={`rounded-2xl flex flex-col lg:flex-row shadow-lg border border-gray-300 w-full transition-all duration-300 ease-in-out transform`}
                  >
                    <div
                      className="w-[calc(100%-30px)]  lg:w-80 rounded-2xl h-auto lg:h-[360px] overflow-hidden shadow-lg border cursor-pointer border-gray-200 m-4 lg:m-0"
                      onClick={() =>
                        router.push(`/property/${application.property.id}`)
                      }
                    >
                      <div className="relative">
                        <div className="relative w-full h-48 rounded overflow-hidden">
                          <Image
                            src={
                              application.property.imageURL ||
                              "https://via.placeholder.com/300"
                            }
                            alt={application.property.propertyName}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-bold">
                          {application.property.propertyName}
                        </h2>
                        <div className="flex items-center mb-4">
                          <span className="text-sm font-semibold ml-auto">
                            ${application.property.pricePerMonth}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <Image
                              className="ml-2"
                              src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                              alt="beds icon"
                              width={15}
                              height={15}
                            />
                            {application.property.beds} Bed
                          </div>
                          <div className="flex items-center gap-1">
                            <Image
                              src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                              alt="baths icon"
                              width={15}
                              height={15}
                              className=""
                            />
                            {application.property.baths} Bath
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sender Info and Buttons */}
                    <div className="flex flex-col md:flex-row gap-4 mr-4 ml-4 flex-grow">
                      <div className="flex-shrink-0 p-4 border border-gray-300 items-center justify-center flex flex-col mt-2 mb-2 rounded-lg shadow-lg min-w-[200px] md:w-auto">
                        <h1 className="font-bold mb-2">Payment </h1>
                        {!Wallet_connected && (
                          <button
                            onClick={Connectwallet}
                            className="relative cursor-pointer group overflow-hidden px-4 py-2 border border-black rounded text-black"
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

                              <div className="flex items-center">
                                <span className="font-din font-bold text-gray-700 min-w-[80px]">
                                  Bill:
                                </span>
                                <span className="text-black font-semibold">
                                  ${application.property.pricePerMonth}
                                </span>
                              </div>

                              <div className="flex items-center">
                                <span className="font-din font-bold text-gray-700 min-w-[80px]">
                                  Due Date:
                                </span>
                                <span className="text-gray-900">10/02/25</span>
                              </div>
                            </div>

                            <div className="pt-2">
                              <button
                                onClick={changeWallet}
                                className="cursor-pointer w-full relative group overflow-hidden px-4 py-2 border border-black rounded text-black"
                              >
                                <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>

                                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                  Change wallet
                                </span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow p-4 border border-gray-300 mt-2 mb-2 rounded-lg shadow-lg max-w-full md:max-w-[400px] overflow-hidden">
                        <h1 className="font-bold mb-2">Billing History</h1>

                        <div className="overflow-y-auto max-h-64">
                          <table className="w-full table-fixed divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {application.property.date?.map((date, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 text-sm text-gray-700">
                                    {date}
                                  </td>
                                  <td className="px-4 py-2 text-sm text-gray-700">
                                    {application.property.amount[index]} eth
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No applications found.</p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Page;
