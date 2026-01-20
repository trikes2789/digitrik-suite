export const metadata = {
  metadataBase: new URL('https://www.digitrikpro.com'),
  title: 'Digitrik Synapse | Generatore Prompt AI (ChatGPT, Midjourney)',
  description: 'Attiva la tua creatività. Synapse traduce le tue idee in prompt perfetti per IA. Controlla stile, atmosfera e dettagli con un click.',
  alternates: {
    canonical: '/ai-lab',
  },
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
  openGraph: {
    title: 'Digitrik Synapse - Il Motore per Prompt AI',
    description: 'Non sai cosa scrivere alle IA? Usa Synapse. Genera prompt professionali per Testo, Immagini e Audio in un istante.',
    url: '/ai-lab',
    siteName: 'DigitrikPro',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/synapse-og.jpg', // Ricordati di creare questa immagine in /public
        width: 1200,
        height: 630,
        alt: 'Digitrik Synapse Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digitrik Synapse | AI Prompt Engine',
    description: 'Il bridge tra la tua mente e l\'IA. Crea prompt perfetti ora.',
  },
};

export default function Layout({ children }) {
  return children;
}