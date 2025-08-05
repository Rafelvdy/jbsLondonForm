import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FormProvider } from "../contexts/FormProvider";
import OfflineIndicator from "../components/OfflineIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JBS London - PPM Survey & Costing Sheet",
  description: "Mechanical & Electrical - Commercial Building Survey Forms with Offline Capability",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JBS Forms",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "JBS Forms",
    "application-name": "JBS Forms",
    "msapplication-TileColor": "#1a73e8",
    "msapplication-config": "/browserconfig.xml",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    shrinkToFit: 'no',
    themeColor: '#1a73e8',
  };
}

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
        <FormProvider>
          {children}
          <OfflineIndicator />
        </FormProvider>
      </body>
    </html>
  );
}
