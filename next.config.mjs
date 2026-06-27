/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
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
