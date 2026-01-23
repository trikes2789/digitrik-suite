'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, FileSpreadsheet, Ghost, ArrowLeft } from 'lucide-react';

export default function GhostDashboard() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-8 font-sans flex flex-col items-center justify-center">
      
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-4 mb-12">
           <Link href="/" className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white">
             <ArrowLeft size={20} />
           </Link>
           <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
             <Ghost className="text-amber-500" /> Ghost Dashboard
           </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LINK CORRETTO ALLA CARTELLA 'barcode_private_tool' */}
          <Link href="/barcode_private_tool" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-amber-500/50 hover:bg-zinc-900/80 transition-all">
             <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
               <Terminal size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Lettore Incongruenze</h3>
             <p className="text-sm text-zinc-500">Scanner barcode avanzato con filtri e rilevamento audio.</p>
          </Link>

          {/* LINK AL FILTRO EXCEL */}
          <Link href="/filter-duplicates" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
               <FileSpreadsheet size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Filtro Excel</h3>
             <p className="text-sm text-zinc-500">Analisi file XLSX per individuare duplicati e barcode errati.</p>
          </Link>

        </div>
      </div>

    </div>
  );
}