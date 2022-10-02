/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['static-content.aws42.tv2.no'],
  },
}

module.exports = nextConfig
