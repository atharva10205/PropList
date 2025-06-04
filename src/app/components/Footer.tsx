"use client";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <div className="bg-black w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center mb-6 md:mb-0">
          <div
            className="h-10 w-10 rounded-full overflow-hidden cursor-pointer"
            onClick={() => router.push("/home")}
          >
            <img
              className="h-full w-full scale-150 object-cover"
              src="https://i.pinimg.com/736x/61/85/c2/6185c254877b80aa71dbe737971a753b.jpg"
              alt="HOMIFI Logo"
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
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {[
            ["About", "/about"],
            ["Services", "/Services"],
            ["Contact", "/Contact"],
            ["Privacy Policy", "/privacy_policy"],
          ].map(([label, path]) => (
            <div key={label} className="group relative inline-block">
              <button
                onClick={() => router.push(path)}
                className="text-gray-300 cursor-pointer hover:text-white transition-colors px-1 py-0.5"
              >
                {label}
              </button>
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 items-center mt-6">
          <img
            onClick={() =>
              router.push("https://www.instagram.com/atharva_pandhare/")
            }
            className="h-7 w-7 bg-white cursor-pointer"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Y1eJXcUkhkRH9qnj68_PxtVUeEjbBtqPJRqzpnU-PtJD4IZy1G5Kp_tjnlsM2jrJkno&usqp=CAU"
            alt="Instagram"
          />
          <img
            onClick={() => router.push("https://github.com/atharva10205")}
            className="h-9 w-9 bg-white rounded-full cursor-pointer"
            src="https://img.icons8.com/?size=100&id=RHLuYrY4GjUv&format=png&color=000000"
            alt="GitHub"
          />
          <img
            onClick={() => router.push("https://x.com/AtharvaPandhar4")}
            className="h-9 w-9 cursor-pointer"
            src="https://img.freepik.com/free-vector/new-2023-twitter-logo-x-icon-design_1017-45418.jpg?semt=ais_items_boosted&w=740"
            alt="X (Twitter)"
          />
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} HOMIFI. All rights reserved.</p>
      </div>
    </div>
  );
}
