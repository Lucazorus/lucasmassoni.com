import { Inter } from "next/font/google";
import { Share_Tech_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata = {
  title: "Lucas Massoni | Expert Salesforce Freelance",
  description:
    "Expert Salesforce freelance : CPQ, Analytics, Apex, Data Migration. Accompagnement complet de la strategie a l'implementation.",
  icons: {
    icon: "/favicon.png",
  },
};

export const viewport = {
  themeColor: "#0f1114",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${shareTechMono.variable} antialiased`}
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
