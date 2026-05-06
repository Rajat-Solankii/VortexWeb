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
  title: "Vortex | Premium Streaming",
  description: "Watch the latest movies, TV shows, and anime on Vortex.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdsterraBanner728 from "@/components/AdsterraBanner728";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Adsterra Social Bar */}
        <script
          type='text/javascript'
          src='https://pl29341352.profitablecpmratenetwork.com/78/bc/89/78bc896d2b5f195d7bb698d8e24e8c18.js'
        />
        {/* Adsterra Popunder (Anti-Adblock) */}
        <script
          type='text/javascript'
          src='https://alarmpenguinmelt.com/e3/bc/8a/e3bc8aa4fc6bc69d495b3a09c55bbada.js'
        />
      </head>
      <body className="min-h-full flex flex-col bg-black">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <div className="px-4 sm:px-6 lg:px-10 xl:px-16">
          <AdsterraBanner728 />
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
