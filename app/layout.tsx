import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL
  || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "SpendLens — AI Spend Audit for Startups",
  description:
    "Find out in 3 minutes where your team is overspending on AI tools. Free, no login required. Powered by Credex.",
  openGraph: {
    title: "SpendLens — AI Spend Audit for Startups",
    description: "Most startups overspend 20-40% on AI subscriptions. Find out in 3 minutes — free, no login.",
    type: "website",
    url: defaultUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendLens — AI Spend Audit for Startups",
    description: "Most startups overspend 20-40% on AI subscriptions. Find out in 3 minutes — free, no login.",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#09090B] text-[#FAFAFA]`}
      >
        {children}
      </body>
    </html>
  );
}
