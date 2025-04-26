"use client"
import React from 'react'
import Sidebar_manager from '@/app/components/Sidebar_manager'
import Navbar from '@/app/components/Navbar'
import { useRouter } from 'next/navigation'
const page = () => {
    const router = useRouter();
  return (
    <div className="h-screen flex flex-col">
    <Navbar />

    <div className="flex flex-1">
      <Sidebar_manager />

      <div
        className="flex-1 p-6 bg-white cursor-pointer "
      >
        <h1 className="text-2xl font-bold">My Properties</h1>
        <h3 className='mb-4'>view and manage your properties listing</h3>
        <div>
          <div className="w-80 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <div className="relative">
              <img
                src="https://imgs.search.brave.com/JS9kEhj33fnlgUqD1eSweQIQErufQEZ5f24J3D2BmzQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9o/b3VzZS1pc29sYXRl/ZC1maWVsZF8xMzAz/LTIzNzczLmpwZz9z/ZW10PWFpc19oeWJy/aWQmdz03NDA"
                alt="Sunset Bungalows"
                className="h-48 w-full object-cover"
                onClick={() => {
                  router.push("/random_number");
                }}
              />
              <button className="absolute  bottom-2 right-2 bg-white rounded-full p-2">
                <img
                  src="https://img.icons8.com/?size=100&id=p7MI4JnqXYvv&format=png&color=000000"
                  className="h-[17px]  w-[17px] object-contain"
                />
              </button>
            </div>
            <div
              onClick={() => {
                router.push("/random_number");
              }}
             className="p-4">
              <h2 className="text-lg font-bold">Sunset Bungalows</h2>
              <p className="text-sm text-gray-600 mb-2">
                Villa Kuta Selatan, Bali, Indonesia
              </p>
              <div className="flex items-center mb-3">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm font-medium">4.8</span>
                <span className="text-sm text-gray-500 ml-1">
                  (347 Reviews)
                </span>
                <span className="text-sm font-semibold ml-auto">$530</span>
                <span className="text-sm text-gray-500">/night</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <div className="flex  items-center gap-1">
                  {" "}
                  <img
                    className="h-[15px] ml-2 w-[15px]"
                    src="https://img.icons8.com/?size=100&id=561&format=png&color=000000"
                    alt=""
                  />{" "}
                  2 Bed
                </div>
                <div className="flex items-center gap-1">
                  <img
                    className="h-[15px] w-[15px]"
                    src="https://img.icons8.com/?size=100&id=HiiMjneqmobf&format=png&color=000000"
                    alt=""
                  />{" "}
                  1 Bath
                </div>
                <div className="flex items-center gap-1">
                  <img
                    className="h-[16px] w-[16px]"
                    src="https://img.icons8.com/?size=100&id=912&format=png&color=000000"
                    alt=""
                  />{" "}
                  Pool
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default page
