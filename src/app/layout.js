import { Geist, Geist_Mono } from "next/font/google";
import { Share_Tech_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// On ajoute Share Tech Mono :
const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech-mono",
});

export const metadata = {
  metadataBase: new URL("https://www.lucasmassoni.com"),
  title: {
    default: "Lucas Massoni · Expert Salesforce & Analytics Freelance",
    template: "%s · Lucas Massoni",
  },
  description:
    "Consultant Salesforce freelance expert en Sales Cloud, CPQ, Analytics, Apex/Flow/LWC et Data Migration. Basé en France — livraison rapide, documentée et orientée résultats.",
  keywords: [
    "Salesforce freelance",
    "consultant Salesforce",
    "CPQ Salesforce",
    "Salesforce Analytics",
    "CRM Analytics",
    "Apex developer",
    "LWC developer",
    "Data Migration Salesforce",
    "Tableau CRM",
    "Sales Cloud",
  ],
  authors: [{ name: "Lucas Massoni", url: "https://www.lucasmassoni.com" }],
  creator: "Lucas Massoni",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "https://www.lucasmassoni.com",
    siteName: "Lucas Massoni",
    title: "Lucas Massoni · Expert Salesforce & Analytics Freelance",
    description:
      "Consultant Salesforce freelance — Sales Cloud, CPQ, Analytics, Apex/Flow/LWC, Data Migration. Exécution rapide et orientée résultats.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lucas Massoni — Expert Salesforce & Analytics Freelance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Massoni · Expert Salesforce & Analytics Freelance",
    description:
      "Consultant Salesforce freelance — Sales Cloud, CPQ, Analytics, Apex/Flow/LWC, Data Migration.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "https://www.lucasmassoni.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Google Analytics 4 */}
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
        {/* End Google Analytics 4 */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${shareTechMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
