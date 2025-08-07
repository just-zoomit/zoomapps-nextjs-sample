import type { NextConfig } from 'next';

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const siteURL = process.env.SITE_URL ?? 'https://localhost:3000';
const siteHostname = new URL(siteURL).hostname;

const nextConfig: NextConfig = {
  reactStrictMode: false,
  allowedDevOrigins: [  siteHostname,
    `*.${siteHostname}`,'local-origin.dev', '*.local-origin.dev'],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: 'https', hostname: '*.zoom.us', pathname: '/p/v2/**' },
      { protocol: 'https', hostname: 'zoom.us',   pathname: '/**'    },
      {
        protocol: 'https',
        hostname: 'us06web.zoom.us',
        port: '',
        pathname: '/p/v2/**',
      }
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000;' },
          { key: 'X-Content-Type-Options',   value: 'nosniff'         },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              // allow Supabase + your WS origins
              `connect-src 'self' ${supabaseURL} ws://localhost:8081 wss://localhost:8081 ${siteURL.replace(/^https/, 'wss')}`,              "img-src 'self'",
              "font-src 'self'",
              "frame-src 'self'",
            ].join('; ')
          },
        ],
      },
    ];
  },
};

export default nextConfig;
