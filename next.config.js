/** @type {import('next').NextConfig} */
import '@ungap/with-resolvers';
const nextConfig = {
  images: {
    domains: ['instant-storage.s3.amazonaws.com'],
  },
}

module.exports = nextConfig
