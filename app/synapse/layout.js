export const metadata = {
  // 1. BASE URL: Fondamentale per risolvere i link delle immagini social e canonical
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Keyword "Azione" (Prompt Generator) + "Target" (Social/Midjourney) + USP (Gratis)
  title: 'Generatore Prompt IA Gratis | Testo, Immagini (Midjourney) & Video - Synapse',

  // 3. DESCRIZIONE: Sintesi della potenza multimodale e cross-platform
  description: "Il tuo centro di comando per l'IA. Genera prompt perfetti per ChatGPT, Midjourney e script video. Ottimizzato per 9 Social Network (LinkedIn, TikTok, Instagram). Zero data retention.",

  // 4. CANONICAL: Dice a Google che questa è la pagina originale
  // ATTENZIONE: Se la cartella del tool non si chiama "synapse", cambia questa riga!
  alternates: {
    canonical: '/synapse',
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

  // 6. OPEN GRAPH: Social SEO per attirare Creator e Marketer
  openGraph: {
    title: 'Synapse - Generatore Universale di Prompt IA',
    description: 'Smetti di lottare con i prompt. Crea contenuti virali per TikTok, immagini Midjourney e post LinkedIn in un click. Gratuito e Privacy-First.',
    url: '/synapse', // Aggiorna se necessario
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/synapse-og.jpg', // Ricorda di mettere l'immagine in public/
        width: 1200,
        height: 630,
        alt: 'Anteprima Synapse AI Prompt Generator',
      },
    ],
  },

  // 7. TWITTER: Card per X
  twitter: {
    card: 'summary_large_image',
    title: 'Prompt Engineering 2.0 | Testo, Foto & Video',
    description: 'Genera prompt professionali per qualsiasi IA. Ottimizzato per Creator.',
  },
};

export default function Layout({ children }) {
  return children;
}