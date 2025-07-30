import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  basePath: "/ts-tsender-ui",         // <- required
  assetPrefix: "./",     // <- required
  trailingSlash: true,                // <- improves static routing on GH Pages
};

export default nextConfig;
