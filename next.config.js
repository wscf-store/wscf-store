/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'WSCF Store',
    NEXT_PUBLIC_WHATSAPP_NUMBER: '+92XXXXXXXXXX',
  },
};

module.exports = nextConfig;
