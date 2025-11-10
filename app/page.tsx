import type { Metadata } from "next";
import Image from "next/image";

const description =
  "Welcome to my personal resume, where I list all the interesting projects I have worked on";

export const metadata: Metadata = {
  title: "Albert Castro | Resume",
  description,
  openGraph: {
    title: "Albert Castro | Resume",
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

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    Hello and welcome
    <br/>
    Hola y bienvenido
        </div>
  );
}
