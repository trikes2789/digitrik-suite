import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    url: 'https://digitrik-suite.vercel.app', // O il tuo dominio finale se lo hai
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
      <body className={`${inter.className} bg-grid min-h-screen`}>
        {children}
      </body>
    </html>
  );
}