import { Geist, Geist_Mono } from "next/font/google";
import { Share_Tech_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata = {
  title: "Lucas Massoni | Expert Salesforce Freelance",
  description:
    "Accompagnement complet de la strategie a l'integration Salesforce. CPQ, Analytics, Apex, Data Migration.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${shareTechMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VNFLBXFQ88"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VNFLBXFQ88');
          `}
        </Script>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
