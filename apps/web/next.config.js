/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;