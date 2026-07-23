import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF is slower to encode on first request — webp is enough and much faster locally
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Serve Unsplash URLs directly (skip Next.js download+re-encode on every cold image)
    loader: "custom",
    loaderFile: "./src/lib/unsplash-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
