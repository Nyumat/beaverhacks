import ThemeProvider from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BeatBytes - Music Production Made Easy",
  description:
    "A music production platform that makes it easy to create and share music with friends.",
  openGraph: {
    images: ["https://beatbytes.vercel.app/og.png"],
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
