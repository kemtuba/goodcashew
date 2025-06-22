/** @type {import('next').NextConfig} */

// Define a more secure and comprehensive Content Security Policy (CSP)
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
  style-src 'self' 'unsafe-inline';
  img-src * 'self' data:;
  font-src 'self';
  frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/;
  connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com;
`;

const nextConfig = {
  // By removing the typescript and eslint blocks below, we re-enable important safety checks
  // that will prevent you from deploying broken code.
  
  // By removing the `images: { unoptimized: true }` block, we re-enable
  // Vercel's powerful, automatic image optimization for better performance.

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // We remove extra whitespace from the CSP string for the header.
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;