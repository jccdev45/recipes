/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pyprjpalfbyoflzjdsmz.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "placehold.it",
        port: "",
      },
      {
        protocol: "https",
        hostname: "unsplash.it",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
        port: "",
      },
    ],
  },
}

module.exports = nextConfig
