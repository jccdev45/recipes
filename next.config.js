/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["eebioglnufbnareanhqf.supabase.co", "placehold.it"],
  },
};

module.exports = nextConfig;
