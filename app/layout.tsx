import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // Importa il componente Script
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// INSERISCI QUI IL TUO ID ANALYTICS (quello che inizia con G-)
const GA_MEASUREMENT_ID = 'G-8PCSJNMV8E'; 

export const metadata = {
  title: {
    default: 'Digitrik Pro | Suite Produttività Gratuita Privacy-First',
    template: '%s | Digitrik Pro'
  },
  description: 'Suite di strumenti gratuiti per freelance e aziende: Preventivi PDF, Calcolo Inverso IVA, Editor PDF e Compressione Immagini. Tutto nel browser, zero server, 100% Privacy.',
  keywords: ['preventivi gratis', 'pdf editor', 'heic to jpg', 'privacy first', 'calcolo scorporo iva', 'unire pdf', 'watermark immagini'],
  authors: [{ name: 'Andrea Triches' }],
  creator: 'Digitrik Pro',
  icons: {
    icon: '/favicon.ico', 
  },
  openGraph: {
    title: 'Digitrik Pro - Il tuo ufficio digitale privacy-first',
    description: 'Nessun upload, nessun costo. Gestisci PDF, Immagini e Preventivi direttamente dal tuo browser.',
    url: 'https://digitrik-suite.vercel.app', 
    siteName: 'Digitrik Pro',
    locale: 'it_IT',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
        {/* --- 1. GOOGLE ADSENSE --- */}
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7585223971066548"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* --- 2. GOOGLE ANALYTICS (GA4) --- */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-grid min-h-screen`}>
        {children}
      </body>
    </html>
  );
}