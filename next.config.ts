import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['shikimori.one', 'cdn.hikka.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shikimori.one',
        pathname: '/uploads/poster/animes/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.hikka.io',
        pathname: '/content/anime/**',
      },
    ],
  },
};

export default nextConfig;
