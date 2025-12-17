import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/config/site";
import ConditionalLayout from "@/components/site/ConditionalLayout";

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["RuneScape", "browser game", "RPG", "pixel game", "Solana", "web3 game"],
  authors: [{ name: "SplitKit" }],
  creator: "SplitKit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://splitkit.fun",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    creator: "@SplitKitFun",
    images: ["/favicon.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://splitkit.fun"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-black text-white antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
