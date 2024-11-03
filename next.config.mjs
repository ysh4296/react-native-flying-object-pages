import createMDX from '@next/mdx';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@component': path.resolve('./src/component'),
      '@theme': path.resolve('./src/theme'),
      '@utils': path.resolve('./src/utils'),
      '@content': path.resolve('./src/content'),
    };
    return config;
  },
};

const withMDX = createMDX({
  // mark down plugins
});

export default withMDX(nextConfig);
