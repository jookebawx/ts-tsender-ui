import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  images: {
    unoptimized: true,
  },
  basePath: isProd ? "/ts-tsender-ui" : "",
  assetPrefix: isProd ? "/ts-tsender-ui/" : "./",
  trailingSlash: true,
};

export default nextConfig;
