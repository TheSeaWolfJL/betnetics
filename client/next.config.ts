/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // env: {
  //   NEXT_PUBLIC_BASE_URL: 'https://dummyjson.com/',
  // },
  sassOptions: {
    implementation: 'sass-embedded',
  },
};

module.exports = nextConfig;
