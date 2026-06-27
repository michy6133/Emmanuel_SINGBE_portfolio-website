/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/admin/emmanuel-admin-2026',
        destination: '/admin',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
