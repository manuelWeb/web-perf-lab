import type { NextConfig } from "next";

const isLocalBuild = process.env.BUILD_LOCAL === "true";

const nextConfig: NextConfig = {
  output: isLocalBuild ? undefined : "standalone",
  productionBrowserSourceMaps: isLocalBuild,
  images: {
    // Ask browsers to display optimized images inline instead of downloading them.
    contentDispositionType: "inline",
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
    qualities: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
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
