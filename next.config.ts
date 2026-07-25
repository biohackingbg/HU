import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma's engine out of the bundler so it loads as a native module.
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;
