/** @type {import('next').NextConfig} */
const nextConfig = {
  // We are keeping your existing ESLint/TypeScript settings for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  // NEW: This section adds the necessary security header
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // This policy now allows frames from your own site AND from google.com
            value: "frame-ancestors 'self' https://www.google.com/;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;