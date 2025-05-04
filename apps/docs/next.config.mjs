import { withFumaDocs } from 'fumadocs-core/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
};

export default withFumaDocs()(nextConfig);