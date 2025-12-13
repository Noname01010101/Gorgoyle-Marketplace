import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
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
