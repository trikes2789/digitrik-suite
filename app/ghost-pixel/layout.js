export const metadata = {
  // 1. BASE URL
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Keyword "Azione" (Nascondi testo) + Keyword "Tecnica" (Steganografia LSB)
  title: 'Nascondi Testo in Immagini | Steganografia Online (LSB) - Ghost Pixel',

  // 3. DESCRIZIONE: Focus totale su Privacy (No server) e Formato (PNG)
  description: 'Strumento gratuito per nascondere messaggi segreti dentro foto (PNG). Steganografia LSB sicura: tutto avviene nel browser, le tue immagini non vengono mai caricate online.',

  // 4. CANONICAL: Aggiorna questo percorso se la cartella ha un nome diverso!
  alternates: {
    canonical: '/ghost-pixel',
  },

  // 5. ROBOTS
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

  // 6. OPEN GRAPH: Social SEO per massimizzare la curiosità
  openGraph: {
    title: 'Invia Messaggi Segreti Invisibili con Ghost Pixel',
    description: 'Sapevi che puoi nascondere del testo dentro una foto? Crea immagini criptate invisibili a occhio nudo. 100% Privacy-First.',
    url: '/ghost-pixel', // Aggiorna se necessario
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/ghost-pixel-og.jpg', // Crea questa immagine in /public
        width: 1200,
        height: 630,
        alt: 'Ghost Pixel Steganography Tool',
      },
    ],
  },

  // 7. TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'Ghost Pixel | Steganografia LSB Online',
    description: 'Nascondi segreti nei pixel delle immagini. Nessun upload server side.',
  },
};

export default function Layout({ children }) {
  return children;
}