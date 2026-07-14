import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 图片全部自托管（public/listings、public/awards、public/brand、public/tours）——无外域
    remotePatterns: [],
  },
};

export default nextConfig;
