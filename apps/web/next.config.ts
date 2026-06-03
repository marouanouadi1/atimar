import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Shared workspace packages are shipped as TypeScript source and compiled by
  // Next at build time. (ui-native is excluded: it imports react-native.)
  transpilePackages: [
    "@atimar/theme",
    "@atimar/types",
    "@atimar/data",
    "@atimar/utils",
    "@atimar/ui-core",
    "@atimar/ui-web",
  ],
};

export default nextConfig;
