/** @type {import('next').NextConfig} */

// A secure and comprehensive Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://www.google.com https://www.gstatic.com;
  font-src 'self' data:;
  frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/ https://*.firebaseapp.com;
  connect-src 'self' https://www.google.com https://*.googleapis.com https://*.firebaseapp.com;
`;

const nextConfig = {
  // By removing the eslint and typescript blocks, you re-enable important safety checks
  // that prevent you from accidentally deploying code with bugs or type errors.

  // By removing the images block, you re-enable Vercel's powerful image optimization.

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

