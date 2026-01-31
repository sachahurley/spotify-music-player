import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Only use basePath in production (for GitHub Pages)
  // In development, use empty string so images work locally
  basePath: process.env.NODE_ENV === 'production' ? '/spotify-music-player' : '',
  images: {
    unoptimized: true,
  },
  // Ensure trailing slash for GitHub Pages compatibility (production only)
  trailingSlash: process.env.NODE_ENV === 'production',
};

export default nextConfig;
