/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  transpilePackages: ['geist'],
};

export default nextConfig;
