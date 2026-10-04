import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vortex | Watch Free Movies, TV Shows & Anime Online",
    template: "%s | Vortex Free Streaming",
  },
  description: "Watch the latest movies, TV shows, K-dramas, and anime online for free in HD quality. Vortex is your ultimate free streaming platform with no registration required.",
  keywords: ["free streaming platform", "watch movies online free", "free movies", "free tv shows", "watch anime free", "watch kdrama free", "hd movies", "streaming site without ads", "Vortex streaming", "watchvortex"],
  authors: [{ name: "Vortex" }],
  creator: "Vortex",
  publisher: "Vortex",
  metadataBase: new URL('https://www.watchvortex.me'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.watchvortex.me",
    siteName: "Vortex Streaming",
    title: "Vortex | Watch Free Movies, TV Shows & Anime Online",
    description: "Watch the latest movies, TV shows, K-dramas, and anime online for free in HD quality on Vortex.",
    images: [
      {
        url: "/og-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Vortex Free Streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vortex | Watch Free Movies, TV Shows & Anime Online",
    description: "Watch the latest movies, TV shows, K-dramas, and anime online for free in HD quality on Vortex.",
    images: ["/og-banner.jpg"],
  },
  alternates: {
    canonical: "https://www.watchvortex.me",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { db } from "@/lib/db";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import MaintenanceWatcher from "@/components/MaintenanceWatcher";
import BannedScreen from "@/components/BannedScreen";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isMaintenance = false;
  let isBanned = false;
  let clientIp = "Unknown";
  
  try {
    // 1. Check Maintenance Mode
    const stmt = db.prepare("SELECT value FROM settings WHERE key = 'maintenance_mode'");
    const setting = stmt.get() as any;
    if (setting && setting.value === 'true') {
      isMaintenance = true;
    }

    // 2. Check if IP is banned
    const reqHeaders = await headers();
    // Vercel/Next.js uses x-forwarded-for for client IP
    let ip = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip");
    
    if (ip) {
      ip = ip.split(',')[0].trim();
      if (ip === "::1" || ip === "::ffff:127.0.0.1") ip = "127.0.0.1";
    }
    
    // Local development fallback
    if (!ip && process.env.NODE_ENV === 'development') {
      ip = "127.0.0.1";
    } else if (!ip) {
      ip = "Unknown";
    }
    
    if (ip !== "Unknown") {
      const banStmt = db.prepare("SELECT ip FROM banned_ips WHERE ip = ?");
      const banRecord = banStmt.get(ip);
      if (banRecord) {
        isBanned = true;
      }
    }
    
    if (ip) clientIp = ip;
  } catch (err) {
    console.error("Failed to fetch layout checks:", err);
  }

  if (isBanned) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`} suppressHydrationWarning>
        <body className="min-h-full flex items-center justify-center bg-black overflow-hidden font-sans">
          <MaintenanceWatcher />
          <BannedScreen ip={clientIp} />
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://player.videasy.net" />
        <link rel="preconnect" href="https://moon.peakstorm.top" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cedarorbit.top" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://player.videasy.net" />
        <link rel="dns-prefetch" href="https://moon.peakstorm.top" />
        <link rel="dns-prefetch" href="https://cedarorbit.top" />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        {isMaintenance ? (
          <MaintenanceScreen />
        ) : (
          <AuthProvider>
            <MaintenanceWatcher />
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        )}
        <Analytics />
      </body>
    </html>
  );
}
