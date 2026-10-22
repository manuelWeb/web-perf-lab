import type { NextConfig } from "next";

const isLocalBuild = process.env.BUILD_LOCAL === "true";

const nextConfig: NextConfig = {
  output: isLocalBuild ? undefined : "standalone",
  productionBrowserSourceMaps: isLocalBuild,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/product-images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "dummyjson.com",
        pathname: "/image/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
