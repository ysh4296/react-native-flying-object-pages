import createMDX from '@next/mdx';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  webpack: (config, { isServer }) => {
    config.resolve.alias['~'] = path.join('./src', '/');
    return config;
  },
};

const withMDX = createMDX({
  // mark down plugins
});

export default withMDX(nextConfig);
