import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";
import { publicEnv } from "@/lib/env";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Characterful display serif for headings.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

// Handwriting for margin notes and proof-marks.
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "WriteMyWrongs — showcase and improve your writing",
    template: "%s · WriteMyWrongs",
  },
  description:
    "WriteMyWrongs is a social writing platform where young people showcase their work, trade honest feedback, and grow as writers.",
  openGraph: {
    title: "WriteMyWrongs",
    description:
      "Showcase your writing. Sharpen your voice. A community for young writers.",
    url: publicEnv.NEXT_PUBLIC_SITE_URL,
    siteName: "WriteMyWrongs",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#33406b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PostHogProvider>{children}</PostHogProvider>
        <Toaster />
      </body>
    </html>
  );
}
