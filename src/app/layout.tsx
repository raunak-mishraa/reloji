import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/components/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://reloji.com'),
  title: {
    default: 'Reloji - Rent Anything, Anytime',
    template: '%s | Reloji',
  },
  description: 'Reloji is a peer-to-peer rental marketplace where you can rent anything from anyone, or make money renting out your own items.',
  openGraph: {
    title: 'Reloji - Rent Anything, Anytime',
    description: 'The easiest way to rent items or earn money from your belongings.',
    url: '/',
    siteName: 'Reloji',
    images: [
      {
        url: '/og-image.png', // Must be an absolute URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reloji - Rent Anything, Anytime',
    description: 'The easiest way to rent items or earn money from your belongings.',
    images: ['/og-image.png'], // Must be an absolute URL
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider defaultTheme="system">
            <ReactQueryProvider>
              <AuthProvider>
                  {children}
                  <Toaster />
              </AuthProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
