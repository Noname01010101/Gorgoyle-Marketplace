import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/trpc/:path*",
        destination: "http://localhost:1092/trpc/:path*", // Docker exposed port
      },
    ];
  },
};

export default nextConfig;
