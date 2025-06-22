/** @type {import('next').NextConfig} */

// A more secure and comprehensive Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com;
  style-src 'self' 'unsafe-inline';
  img-src * 'self' data:;
  font-src 'self' data:;
  frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/;
  connect-src 'self' https://*.googleapis.com https://*.firebaseapp.com;
`;

const nextConfig = {
  // We recommend re-enabling these safety checks once development is stable
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

