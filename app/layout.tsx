import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#3b82f6',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://instantcube.vercel.app'),
  title: "InstantCube - Rubik's Cube Solver",
  description: "Solve any Rubik's cube instantly - works offline! A progressive web app for speedcubers and puzzle enthusiasts. Fast, free, and installable.",
  keywords: [
    'rubiks cube',
    'cube solver',
    'rubik solver',
    'puzzle solver',
    'speedcubing',
    'cube algorithm',
    'offline cube solver',
    'pwa',
    'progressive web app',
  ],
  authors: [{ name: 'InstantCube' }],
  creator: 'InstantCube',
  publisher: 'InstantCube',
  manifest: '/manifest.json',

  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'InstantCube',
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-72.png', sizes: '72x72', type: 'image/png' },
      { url: '/icon-96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-144.png', sizes: '144x144', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://instantcube.app',
    title: "InstantCube - Rubik's Cube Solver",
    description: "Solve any Rubik's cube instantly - works offline! A progressive web app for speedcubers and puzzle enthusiasts.",
    siteName: 'InstantCube',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'InstantCube Logo',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary',
    title: "InstantCube - Rubik's Cube Solver",
    description: "Solve any Rubik's cube instantly - works offline!",
    images: ['/icon-512.png'],
  },

  // Other
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'utilities',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for better PWA support */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
