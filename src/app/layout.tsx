import type { Metadata } from "next";
import { Inter, Fraunces, Geist_Mono } from "next/font/google";
import { appConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: {
    default: `Website Uptime Monitoring Software | ${appConfig.name}`,
    template: `%s | ${appConfig.name}`,
  },
  description:
    "Monitor your website uptime 24/7 with AROLAGB Uptime. Track availability, detect downtime, monitor SSL certificates, and receive alerts from one powerful dashboard.",
  keywords: [
    "website uptime monitoring",
    "downtime alerts",
    "SSL monitoring",
    "status pages",
    "AROLAGB Uptime",
  ],
  authors: [{ name: "AROLAGB LIMITED" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: appConfig.url,
    siteName: appConfig.name,
    title: `Website Uptime Monitoring Software | ${appConfig.name}`,
    description:
      "Monitor your website uptime 24/7. Detect downtime, track performance, and receive timely alerts.",
  },
  twitter: {
    card: "summary_large_image",
    title: `Website Uptime Monitoring Software | ${appConfig.name}`,
    description:
      "Monitor your website uptime 24/7. Detect downtime, track performance, and receive timely alerts.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: appConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${inter.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
