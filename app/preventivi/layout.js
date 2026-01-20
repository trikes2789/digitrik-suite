export const metadata = {
  // 1. BASE URL: Fondamentale per risolvere i link delle immagini social e canonical
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO OTTIMIZZATO: Keyword principali subito all'inizio (Front-loading)
  // Struttura: [Servizio Principale] | [Funzione Specifica] - [Brand]
  title: 'Preventivi PDF Gratis | Calcolo Inverso e Scorporo IVA - DigitrikPro',

  // 3. DESCRIZIONE CTR: Focus su velocità, gratuità e target (Forfettari/Freelance)
  description: 'Generatore di preventivi gratuito senza registrazione. Calcolo inverso automatico, scorporo IVA e Ritenuta. Scarica il tuo PDF professionale in 1 click. Ideale per Forfettari.',

  // 4. CANONICAL: Dice a Google che questa è la versione ufficiale della pagina
  alternates: {
    canonical: '/preventivi',
  },

  // 5. ROBOTS: Controllo totale sull'indicizzazione
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

  // 6. OPEN GRAPH: Come appare il link su Facebook/LinkedIn/WhatsApp
  openGraph: {
    title: 'Crea Preventivi PDF Gratis con Calcolo Inverso',
    description: "Hai bisogno di scorporare l'IVA o fare un preventivo al volo? Usa il nostro tool gratuito. Nessuna registrazione richiesta.",
    url: '/preventivi',
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    // Assicurati di avere un'immagine in public/og-image.jpg per massimizzare i clic
    images: [
      {
        url: '/preventivi-og.jpg', // Percorso ipotetico, creane una 1200x630px
        width: 1200,
        height: 630,
        alt: 'Anteprima Generatore Preventivi DigitrikPro',
      },
    ],
  },

  // 7. TWITTER CARD: Ottimizzazione per X (Twitter)
  twitter: {
    card: 'summary_large_image',
    title: 'Preventivi PDF Gratis | Calcolo Inverso IVA',
    description: 'Generatore preventivi veloce per partite IVA. Provalo ora.',
  },
};

export default function Layout({ children }) {
  return children;
}