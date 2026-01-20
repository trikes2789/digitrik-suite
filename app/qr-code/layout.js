export const metadata = {
  // 1. BASE URL
  metadataBase: new URL('https://www.digitrikpro.com'),

  // 2. TITOLO: Punta sul dolore principale dell'utente (Scadenza) e sulle feature (Logo, WiFi)
  title: 'Generatore QR Code Gratis con Logo | Senza Scadenza (Statici) - DigitrikPro',

  // 3. DESCRIZIONE: Spiega perché è meglio degli altri (Eterni, Privacy, vCard)
  description: 'Crea QR Code personalizzati con Logo, Colori e WiFi. Generatore di codici Statici (non scadono mai) e 100% gratuiti. Ideale per Biglietti da Visita (vCard) e Menu. Privacy totale.',

  // 4. CANONICAL: Aggiorna questo percorso se la cartella ha un nome diverso!
  alternates: {
    canonical: '/qr-code-creator',
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

  // 6. OPEN GRAPH: Social SEO per attirare business e ristoratori
  openGraph: {
    title: 'Crea QR Code Gratis che Non Scadono Mai',
    description: 'Sapevi che molti QR code smettono di funzionare dopo un mese? I nostri sono Statici, Eterni e Gratuiti. Provalo ora per WiFi e Biglietti da Visita.',
    url: '/qr-code-creator', // Aggiorna se necessario
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/qr-code-og.jpg', // Crea questa immagine in /public
        width: 1200,
        height: 630,
        alt: 'Anteprima QR Code Creator DigitrikPro',
      },
    ],
  },

  // 7. TWITTER
  twitter: {
    card: 'summary_large_image',
    title: 'Generatore QR Code Statici (No Scadenza)',
    description: 'Crea QR per WiFi, URL e Contatti. Personalizza con Logo e scarica in HD.',
  },
};

export default function Layout({ children }) {
  return children;
}