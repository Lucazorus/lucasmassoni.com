"use client";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "@/lib/language-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }) {
  console.log("[v0] ClientLayout rendering");
  return (
    <LanguageProvider>
      <Analytics />
      <Navbar />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
