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
  }
};

export default nextConfig;