import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Ensure static files are properly served
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
