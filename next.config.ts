import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma's engine out of the bundler so it loads as a native module.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
  // Allow testing the dev server from a phone on the same local network.
  allowedDevOrigins: ["192.168.1.109"],
};

export default nextConfig;
