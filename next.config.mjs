/** @type {import('next').NextConfig} */

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '';

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", port: "", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", port: "", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // --- THIS LINE IS THE FIX ---
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://apis.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://placehold.co https://images.unsplash.com",
              "font-src 'self' data:",
              `connect-src 'self' https://www.google.com https://*.googleapis.com https://*.firebaseapp.com ${supabaseHostname ? `https://${supabaseHostname}` : ''}`,
              "frame-src 'self' https://www.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;