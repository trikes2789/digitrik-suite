export const metadata = {
  // 1. BASE URL: Imposta la radice del dominio per risolvere i link
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Include le keyword ad alto traffico (Gratis, EAN, UPC) e la nicchia tecnica (SVG, Code128)
  title: 'Generatore Codici a Barre Gratis | EAN, UPC, Code128 (SVG) - DigitrikPro',

  // 3. DESCRIZIONE: Punta su "Vettoriale" (qualità stampa) e "Privacy" (elaborazione locale)
  description: 'Crea codici a barre online professionali (EAN-13, UPC, Code128). Export vettoriale SVG alta qualità per packaging e stampa. Senza registrazione e 100% Privacy.',

  // 4. CANONICAL: Evita contenuti duplicati. 
  // IMPORTANTE: Se la tua cartella non si chiama "barcode-generator", cambia questo percorso!
  alternates: {
    canonical: '/barcode-generator',
  },

  // 5. ROBOTS: Istruzioni per i crawler di Google
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 6. OPEN GRAPH: Aspetto del link su Facebook/WhatsApp/LinkedIn
  openGraph: {
    title: 'Barcode Studio - Generatore Codici a Barre Vettoriali',
    description: 'Devi stampare un codice a barre? Genera EAN, UPC e Code128 in formato vettoriale (SVG) o PNG. Gratuito e sicuro.',
    // IMPORTANTE: Aggiorna anche qui se la cartella ha un nome diverso
    url: '/barcode-generator',
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        // Ricordati di caricare questa immagine nella cartella "public"
        url: '/barcode-og.jpg', 
        width: 1200,
        height: 630,
        alt: 'Anteprima Barcode Studio DigitrikPro',
      },
    ],
  },

  // 7. TWITTER: Aspetto su X
  twitter: {
    card: 'summary_large_image',
    title: 'Generatore Barcode EAN & UPC Gratis',
    description: 'Crea codici a barre perfetti per Amazon e vendita retail. Scarica in SVG.',
  },
};

export default function Layout({ children }) {
  return children;
}