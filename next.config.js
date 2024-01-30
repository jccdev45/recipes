/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "eebioglnufbnareanhqf.supabase.co",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "placehold.it",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "unsplash.it",
        port: ''
      },
      {
        protocol: 'https',
        hostname: "loremflickr.com",
        port: ''
      },
    ],
  },
};

module.exports = nextConfig;
