import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pinimage.com" },
      { hostname: "cdn.dribble.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "images.pexels.com" },
      { hostname: "i.postimg.cc" },
    ],
  },
  /* config options here */
};

export default nextConfig;
