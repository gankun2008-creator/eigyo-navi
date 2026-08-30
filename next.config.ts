import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['127.0.0.1', 'vocabulary-thereof-previews-bizrate.trycloudflare.com'],
};

export default nextConfig;
