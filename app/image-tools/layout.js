export const metadata = {
  // 1. BASE URL
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Unisce l'alto volume (Editor Foto) con la nicchia specifica (HEIC) e il vantaggio (Privacy)
  title: 'Editor Foto & Convertitore HEIC Gratis | Privacy Totale - DigitrikPro',

  // 3. DESCRIZIONE: Focus su azioni rapide (Ritaglia, Watermark) e sicurezza (No upload)
  description: 'Modifica, ritaglia e ridimensiona foto online direttamente nel browser. Convertitore HEIC in JPG istantaneo. Aggiungi Watermark e comprimi senza caricare nulla sui server.',

  // 4. CANONICAL: Aggiorna questo percorso se la cartella ha un nome diverso!
  alternates: {
    canonical: '/image-studio',
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

  // 6. OPEN GRAPH: Ottimizzato per condivisioni su social e chat
  openGraph: {
    title: 'Image Studio - Modifica Foto & Converti HEIC',
    description: 'Devi convertire un HEIC o ridimensionare una foto? Fallo in sicurezza nel browser. Niente cloud, 100% Privacy.',
    url: '/image-studio', // Aggiorna se necessario
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/image-studio-og.jpg', // Crea questa immagine in /public
        width: 1200,
        height: 630,
        alt: 'Anteprima Image Studio DigitrikPro',
      },
    ],
  },

  // 7. TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'Editor Foto & Convertitore HEIC Sicuro',
    description: 'Modifica immagini e converti HEIC localmente. I tuoi file non lasciano mai il tuo dispositivo.',
  },
};

export default function Layout({ children }) {
  return children;
}