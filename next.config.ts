import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/404',
        destination: '/not-found',
        permanent: false,
      },
    ];
  },
  middleware: ['lib/middleware.ts'],
};

export default nextConfig;