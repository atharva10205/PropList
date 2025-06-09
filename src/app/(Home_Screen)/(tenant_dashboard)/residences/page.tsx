"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";
import { BrowserProvider, parseEther } from "ethers";
import toast, { Toaster } from "react-hot-toast";


const Page = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Loading state
  const [Wallet_connected, setWallet_connected] = useState(false);
  const [Public_Id, setPublic_Id] = useState("");
  const [ethRate, setEthRate] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function getEthRate() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      setEthRate(1 / data.ethereum.usd);
    }
    getEthRate();
  }, []);

  const handleSend = async (addid, id, amount1) => {
    const receiverAddress = id;
    const amount = amount1;
    const addID = addid;

    if (!window.ethereum) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          MetaMask not detected
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
          No MetaMask detected
        </div>
      ));
      return;
    }

    if (!ethRate) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          ETH price not loaded
        </div>
      ));
      return;
    }

    try {
      // Request account access (opens MetaMask if not connected)
      await metamaskProvider.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(metamaskProvider);
      const signer = await provider.getSigner();

      const ethAmount = (parseFloat(amount) * ethRate).toFixed(6);

      const tx = await signer.sendTransaction({
        to: receiverAddress,
        value: parseEther(ethAmount),
      });

      if (tx) {
        const response = await fetch("/api/Billing_history", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ addID, ethAmount }),
        });

        if (response.ok) {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
            >
              Transaction successful!
            </div>
          ));
        }
      } else {
        throw new Error("Transaction not created");
      }
    } catch (err) {
      console.error("Transaction Error:", err);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } fixed top-2 right-2 bg-black border mt-[40px] border-black text-white flex items-center justify-center rounded-lg shadow-md font-bold h-[60px] w-[250px] text-sm`}
        >
          Something went wrong!
        </div>
      ));
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
            Please install MetaMask
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
            MetaMask wallet not found! Please install MetaMask
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

    const get_applications = async () => {
      try {
        const response = await fetch("/api/application_data_tenent", {
          method: "POST",
          credentials: "include",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        const data = await response.json();
        console.log("data", data);
        setdata(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    get_applications();
  }, [userId]);

 return (
  <div className="h-screen flex flex-col overflow-hidden">
    <Navbar />
    <Toaster />

    <div className="md:hidden p-4 bg-white flex justify-between items-center">
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <img
          src="https://img.icons8.com/ios-filled/50/000000/menu--v1.png"
          alt="menu"
          className="h-6 w-6"
        />
      </button>
      <h1 className="text-lg font-bold">Residences</h1>
    </div>

    <div className="flex flex-1 overflow-hidden">
      <div
        className={`
          ${isSidebarOpen ? "block" : "hidden"} md:block w-56 flex-shrink-0 overflow-y-auto fixed md:relative z-20 h-full md:h-auto
        `}
      >
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto p-4 ">
        <h1 className="text-2xl font-bold mb-4 hidden md:block">
          Residences
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {data?.applications?.filter(p => p.status === "accepted").length === 0 ? (
              <div className="text-center text-gray-500 mt-10 text-lg">
                No Residences found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-7 mt-4">
                {data.applications
                  .filter((property) => property.status === "accepted")
                  .map((property, index) => (
                    <div
                      key={index}
                      className="rounded-2xl flex flex-col lg:flex-row shadow-lg border border-gray-300 w-full"
                    >
                      <div className="w-full lg:w-100 rounded-2xl overflow-hidden shadow-lg border cursor-pointer border-gray-300">
                        <div className="relative">
                          <img
                            src={
                              property.propertyimage ||
                              "https://via.placeholder.com/300"
                            }
                            alt={property.propertyName}
                            className="h-48 w-full object-cover"
                            onClick={() =>
                              router.push(`/property/${property.addId}`)
                            }
                          />
                        </div>
                        <div
                          onClick={() =>
                            router.push(`/property/${property.addId}`)
                          }
                          className="p-4"
                        >
                          <h2 className="text-lg font-bold">
                            {property.propertyName}
                          </h2>
                          <p className="text-sm text-gray-600 mb-2">
                            {property.address || ""} {property.city || ""}{" "}
                            {property.country || ""}
                          </p>
                          <div className="flex items-center mb-4">
                            <span className="text-sm font-semibold ml-auto">
                              ${property.pricePerMonth}
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                          </div>
                          <div className="flex justify-between text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                              <img
                                className="h-[15px] ml-2 w-[15px]"
                                src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                                alt=""
                              />
                              {property.beds} Bed
                            </div>
                            <div className="flex items-center gap-1">
                              <img
                                className="h-[15px] w-[15px]"
                                src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                                alt=""
                              />
                              {property.baths} Bath
                            </div>
                            <div className="flex items-center gap-1">
                              {property.amenities || ""}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-4 p-4 w-full">
                        <div className="p-4 border border-gray-300 rounded-lg shadow-lg flex flex-col items-center lg:w-[600px] w-full ">
                          <h1 className="font-bold mb-2">Payment</h1>

                          {!Wallet_connected && (
                            <button
                              onClick={Connectwallet}
                              className="relative cursor-pointer group overflow-hidden px-4 py-2 border border-black rounded text-black w-full"
                            >
                              <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
                              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                Connect wallet
                              </span>
                            </button>
                          )}

                          {Wallet_connected && (
                            <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 w-full">
                              <div className="flex flex-col space-y-2 text-left">
                                <div className="flex items-center">
                                  <span className="font-bold text-gray-700 min-w-[80px]">
                                    Your ID:
                                  </span>
                                  <span className="text-gray-900 font-medium break-all">
                                    {Public_Id}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-bold text-gray-700 min-w-[80px]">
                                    Bill:
                                  </span>
                                  <span className="text-black font-semibold">
                                    ${property.pricePerMonth}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="font-bold text-gray-700 min-w-[80px]">
                                    Due:
                                  </span>
                                  <span className="text-gray-900">
                                    {property.date}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() =>
                                  handleSend(
                                    property.addId,
                                    property.Public_Id,
                                    property.pricePerMonth
                                  )
                                }
                                className="cursor-pointer w-full relative group overflow-hidden px-4 py-2 border border-black rounded text-black"
                              >
                                <span className="absolute bottom-0 left-0 w-full h-0 bg-black transition-all duration-300 ease-out group-hover:h-full origin-bottom"></span>
                                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                                  Pay Now
                                </span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Billing History */}
                        <div className="flex-grow p-4 border border-gray-300 rounded-lg md:w-[200px] shadow-lg w-full overflow-hidden">
                          <h1 className="font-bold mb-2">Billing History</h1>
                          <div className="overflow-y-auto max-h-64">
                            <table className="w-full table-fixed divide-y divide-gray-200 text-sm">
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
                                {property.date?.map((date, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-2 text-gray-700">
                                      {date}
                                    </td>
                                    <td className="text-gray-700">
                                      {property.amount[index]} eth
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
);
};

export default Page;
