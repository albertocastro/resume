import type { Metadata } from "next";
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

const description =
  "Welcome to my personal resume, where I list all the interesting projects I have worked on.";

export const metadata: Metadata = {
  title: "Albert Castro | Resume.",
  description,
  openGraph: {
    title: "Albert Castro | Resume.",
    description,
    url: "https://albertocastro.me",
    siteName: "Albert Castro Resume",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albert Castro | Resume",
    description,
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
        {children}
      </body>
    </html>
  );
}
