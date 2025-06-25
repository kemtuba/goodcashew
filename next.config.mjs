/** @type {import('next').NextConfig} */

// Get the Supabase hostname from environment variables to use in the CSP.
// This check prevents an error during the build if the variable is not set.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '';

const nextConfig = {
  // --- PRESERVED: Your Existing Image Configuration ---
  // This is kept exactly as you had it to ensure images continue to work.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // --- ADDED: The Content Security Policy Headers ---
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // .join('; ') builds the final CSP string from the array of rules.
            value: [
              "default-src 'self'",
              // Allows scripts from your site, Google (for reCAPTCHA), and Gstatic.
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
              // Allows inline styles and stylesheets from your own domain.
              "style-src 'self' 'unsafe-inline'",
              // --- MERGED & UPDATED ---
              // Allows images from your own site, data URLs, and the hosts you defined above.
              "img-src 'self' data: https://placehold.co https://images.unsplash.com",
              "font-src 'self'",
              // --- CRITICAL FIX ---
              // Allows network connections to your own site, Google APIs, Firebase, and your Supabase project.
              // Note the check to ensure supabaseHostname is not empty before adding it.
              `connect-src 'self' https://www.google.com https://*.googleapis.com https://*.firebaseapp.com ${supabaseHostname ? `https://${supabaseHostname}` : ''}`,
              // Allows content to be framed from Google (for reCAPTCHA).
              "frame-src 'self' https://www.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
