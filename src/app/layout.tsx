import "./globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseGPT - AI-Powered Course Authoring Platform",
  description:
    "Create, organize, and enhance educational content with AI assistance",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-512x512.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
