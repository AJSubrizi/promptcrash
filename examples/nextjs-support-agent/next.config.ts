import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
