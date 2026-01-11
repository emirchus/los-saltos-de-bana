import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    viewTransition: true,
    optimizePackageImports: ["@/components/ui/"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "kuynskxmgfjuveklharx.supabase.co",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
