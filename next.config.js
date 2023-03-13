/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  env: {
    MONGODB_URI: "mongodb://admin:admin@localhost:27017/syscoin-bridge",
  },
  experimental: {
    output: 'standalone'
  },
  images: {
    domains: ['syscoin.github.io']
  }
};

module.exports = nextConfig;
