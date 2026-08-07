import React from "react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import DotGrid from "@/components/DotGrid";
import FloatingMath from "@/components/FloatingMath";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ManimEditor — AI-Powered Manim Code Editor",
  description:
    "Write, animate, and export Manim animations with AI assistance. Free, open-source, no watermarks.",
  keywords: ["manim", "animation", "math", "3blue1brown", "code editor", "AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <DotGrid />
          <FloatingMath />
          <Navbar />
          <main className="flex-1 pt-16 relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
