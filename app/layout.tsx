import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Digitrik Suite - Privacy First Tools",
  description: "Suite di strumenti professionali gratuiti che girano nel tuo browser. Privacy totale, zero server.",
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