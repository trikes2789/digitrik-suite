export const metadata = {
  // 1. BASE URL
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Front-loading delle azioni massive (Unisci, Converti) + USP (Privacy/Ghost)
  title: 'Unisci PDF, Converti & Watermark Gratis | Privacy Editor - PDF Master',

  // 3. DESCRIZIONE: Sintesi delle funzioni core e rassicurazione sulla sicurezza
  description: 'Unisci file, converti immagini in PDF e proteggi documenti. Funzione "Ghost Mode" per rimuovere metadati e anonimizzare. Elaborazione locale al 100%: i tuoi file non vanno sul cloud.',

  // 4. CANONICAL: Aggiorna questo percorso se la cartella ha un nome diverso!
  alternates: {
    canonical: '/pdf-master',
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

  // 6. OPEN GRAPH: Social SEO per professionisti
  openGraph: {
    title: 'PDF Master - Unisci, Proteggi e Pulisci Metadati',
    description: 'Il toolkit PDF definitivo: Merge, Watermark e Pulizia Metadati (Ghost Mode). Tutto avviene nel browser per la massima privacy.',
    url: '/pdf-master', // Aggiorna se necessario
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/pdf-master-og.jpg', // Crea questa immagine in /public
        width: 1200,
        height: 630,
        alt: 'Anteprima PDF Master DigitrikPro',
      },
    ],
  },

  // 7. TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'Editor PDF Privacy-First (Unisci & Converti)',
    description: 'Gestisci PDF senza caricare file su server esterni. Prova la Ghost Mode.',
  },
};

export default function Layout({ children }) {
  return children;
}