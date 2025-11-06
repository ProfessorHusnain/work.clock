import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Use relative paths for assets in production (required for Electron)
  assetPrefix: "./",
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
