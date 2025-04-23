import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutContent from '@/components/LayoutContent';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Plato Web3 Browser",
  description: "Plato Web3 Browser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <LayoutContent 
        geistSans={geistSans.variable} 
        geistMono={geistMono.variable}
      >
        {children}
      </LayoutContent>
    </html>
  );
}
