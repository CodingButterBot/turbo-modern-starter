import { withFumadocs } from 'fumadocs-core/next/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui'],
};

export default withFumadocs(nextConfig);
