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

module.exports = nextConfig;
