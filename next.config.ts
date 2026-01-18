import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    products: {
      stale: 60,
      revalidate: 60,
      expire: 60,
    },
  },
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
