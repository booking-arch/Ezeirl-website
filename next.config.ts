import type { NextConfig } from "next";

// Google Analytics hosts are allowed only when NEXT_PUBLIC_GA_ID is set (see app/(universe)/layout.tsx).
const ga = process.env.NEXT_PUBLIC_GA_ID ? " https://www.googletagmanager.com" : "";
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline'${ga};
  frame-src https://open.spotify.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'self' https:;
  worker-src blob:;
`.replace(/\s{2,}/g, " ").trim();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 80] },
  async redirects() {
    // The merch page was folded into the EZE//FORM brand page (the live site's structure).
    return [{ source: "/merch", destination: "/eze-form", permanent: true }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: cspHeader },
        ],
      },
    ];
  },
};

export default nextConfig;
