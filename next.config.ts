import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Allow iframes from our specific streaming servers
            key: "Content-Security-Policy",
            value: "frame-src 'self' https://nhdapi.com https://player.videasy.net https://vidvault.to https://vaplayer.ru https://cloudorchestranova.com https://ythd.org; connect-src *;"
          },
          {
            // Block popups & top-level navigation from embedded iframes.
            // Only allow our own origin and trusted embed sources.
            key: "Permissions-Policy",
            value: "popups=(), popups-to-escape-sandbox=()",
          },
          {
            // Prevent the site from being embedded in malicious iframes elsewhere
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            // Strict referrer to prevent ad trackers from reading full URLs
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
