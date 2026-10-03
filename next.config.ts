import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === 'false' ? undefined : 'standalone',
  images: {
    remotePatterns: [],
    // Servir imagens em formatos modernos (melhora LCP e Core Web Vitals).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
