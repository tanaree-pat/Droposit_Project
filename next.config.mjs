/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.33"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "192.168.1.33", port: "8000" },
    ],
  },
};

export default nextConfig;
