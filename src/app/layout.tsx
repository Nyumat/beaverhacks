import ThemeProvider from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexProvider";
import "./globals.css";
import ogImage from "./og.png";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://beatbytes.vercel.app/"),
  title: "BeatBytes - Music Production Made Easy",
  description:
    "A music production platform that makes it easy to create and share music with friends.",
  openGraph: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        secureUrl: "https://beatbytes.vercel.app/og.png",
      },
    ],
  },
  twitter: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "BeatBytes - Music Production Made Easy",
        secureUrl: "https://beatbytes.vercel.app/og.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
