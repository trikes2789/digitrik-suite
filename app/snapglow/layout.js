export const metadata = {
  // 1. BASE URL
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Intercetta chi cerca mockup specifici (iPhone, Mac) e la funzione "Beautifier"
  title: 'Generatore Mockup Screenshot Gratis | iPhone 15, Mac & Browser - SnapGlow',

  // 3. DESCRIZIONE: Focus su velocità, qualità (4K/PNG) e Privacy (WASM)
  description: 'Trasforma screenshot grezzi in mockup professionali istantanei. Cornici realistiche (iPhone 15, Pixel 8, MacBook). Sfondi gradient e export HD senza watermark. 100% Privacy.',

  // 4. CANONICAL: Aggiorna questo percorso se la cartella ha un nome diverso!
  alternates: {
    canonical: '/snapglow',
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

  // 6. OPEN GRAPH: Ottimizzato per Social Media Manager e Developer
  openGraph: {
    title: 'Crea Screenshot Virali per Social e Portfolio',
    description: 'Devi presentare un\'app o un sito? Inserisci il tuo screenshot in un iPhone 15 o MacBook in un click. Niente upload, tutto nel browser.',
    url: '/snapglow', // Aggiorna se necessario
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/snapglow-og.jpg', // Crea questa immagine in /public
        width: 1200,
        height: 630,
        alt: 'Anteprima SnapGlow Mockup Generator',
      },
    ],
  },

  // 7. TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'Screenshot Beautifier & Mockup Generator',
    description: 'Rendi i tuoi screenshot presentabili in secondi. Cornici iPhone, Mac e Browser. Provalo gratis.',
  },
};

export default function SnapGlowLayout({ children }) {
  return (
    <section>
      {children}
    </section>
  );
}