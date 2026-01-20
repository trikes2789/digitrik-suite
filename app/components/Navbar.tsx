'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO (Cliccabile per tornare alla Home) */}
        <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
          
          {/* CONTENITORE LOGO RETTANGOLARE 
              h-10 (40px) definisce l'altezza nella navbar.
              w-40 (160px) dà spazio orizzontale sufficiente per il formato 1200x630.
          */}
          <div className="relative h-10 w-40 overflow-hidden">
             <Image 
               src="/logo.jpg" 
               alt="Digitrik Pro Logo" 
               fill 
               className="object-contain object-left" // Mostra tutto il logo allineato a sx
               priority // Caricamento immediato per evitare scatti
             />
          </div>
          
        </Link>

        {/* Spazio vuoto a destra */}
        <div className="flex gap-4"></div>
      </div>
    </nav>
  );
}