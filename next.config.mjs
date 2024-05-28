/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qhhxjfaxnglxgnzzzurt.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
    // loader: "custom",
    // loaderFile: "./my-loader.ts",
  },
  // output: "export",
};

export default nextConfig;
