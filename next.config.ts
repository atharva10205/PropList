import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "via.placeholder.com",
      "img.icons8.com",
      "atharva102050.s3.ap-south-1.amazonaws.com",
      "i.pinimg.com"
    ],
  },
  // Add these to ignore build errors
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors
  },
};

export default nextConfig;