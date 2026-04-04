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
    "Consultant Salesforce freelance expert en Sales Cloud, CPQ, Analytics, Apex/Flow/LWC et Data Migration. 6+ ans d'expérience, 12+ projets livrés. Basé en France — livraison rapide, documentée et orientée résultats.",
  keywords: [
    "Salesforce freelance",
    "consultant Salesforce",
    "expert Salesforce",
    "Salesforce freelance France",
    "CPQ Salesforce",
    "Salesforce CPQ consultant",
    "Salesforce Analytics",
    "CRM Analytics",
    "Tableau CRM",
    "Apex developer",
    "Apex Salesforce",
    "LWC developer",
    "Lightning Web Components",
    "Flow Salesforce",
    "Data Migration Salesforce",
    "Sales Cloud",
    "Salesforce consultant Paris",
    "Salesforce developer freelance",
    "intégrateur Salesforce",
    "quote-to-cash Salesforce",
  ],
  authors: [{ name: "Lucas Massoni", url: "https://www.lucasmassoni.com" }],
  creator: "Lucas Massoni",
  publisher: "Lucas Massoni",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "https://www.lucasmassoni.com",
    siteName: "Lucas Massoni",
    title: "Lucas Massoni · Expert Salesforce & Analytics Freelance",
    description:
      "Consultant Salesforce freelance — Sales Cloud, CPQ, Analytics, Apex/Flow/LWC, Data Migration. 6+ ans d'expérience. Exécution rapide et orientée résultats.",
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
      "Consultant Salesforce freelance — Sales Cloud, CPQ, Analytics, Apex/Flow/LWC, Data Migration. 6+ ans d'expérience.",
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
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "https://www.lucasmassoni.com",
    languages: {
      "fr-FR": "https://www.lucasmassoni.com",
      "en-US": "https://www.lucasmassoni.com",
    },
  },
  verification: {
    google: "à_remplir_si_tu_as_un_code_Search_Console",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Lucas Massoni — Expert Salesforce & Analytics Freelance",
  url: "https://www.lucasmassoni.com",
  logo: "https://www.lucasmassoni.com/logo.png",
  image: "https://www.lucasmassoni.com/og-image.png",
  description:
    "Consultant Salesforce freelance expert en Sales Cloud, CPQ, Analytics, Apex/Flow/LWC et Data Migration. 6+ ans d'expérience, 12+ projets livrés.",
  priceRange: "$$",
  areaServed: { "@type": "Place", name: "France" },
  knowsAbout: [
    "Salesforce", "Salesforce CPQ", "Sales Cloud", "CRM Analytics",
    "Tableau", "Apex", "Lightning Web Components", "Flow",
    "Data Migration", "SQL", "API Integration", "JSON",
  ],
  sameAs: ["https://www.linkedin.com/in/lucas-massoni/"],
  founder: {
    "@type": "Person",
    name: "Lucas Massoni",
    jobTitle: "Expert Salesforce & Analytics Freelance",
    url: "https://www.lucasmassoni.com",
    sameAs: ["https://www.linkedin.com/in/lucas-massoni/"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
