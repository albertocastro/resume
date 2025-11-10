import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AwsRum, AwsRumConfig } from 'aws-rum-web';

try {
  const config: AwsRumConfig = {
    sessionSampleRate: 1 ,
    identityPoolId: "us-east-1:e1e4d41d-4f54-4fb0-b9c8-04bba0f1cd56" ,
    endpoint: "https://dataplane.rum.us-east-1.amazonaws.com" ,
    telemetries: ["errors","performance","http"] ,
    allowCookies: true ,
    enableXRay: false ,
    signing: true // If you have a public resource policy and wish to send unsigned requests please set this to false
  };

  const APPLICATION_ID: string = '684551e1-e1cc-4491-8979-395646dc903e';
  const APPLICATION_VERSION: string = '1.0.0';
  const APPLICATION_REGION: string = 'us-east-1';

  const awsRum: AwsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}
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
