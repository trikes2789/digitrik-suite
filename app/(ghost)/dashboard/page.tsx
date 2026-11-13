'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, FileSpreadsheet, Ghost, ArrowLeft, Truck, ClipboardList, Package, Scale, Users, Smartphone, ListTodo } from 'lucide-react';

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
          
          {/* LINK ALL'INCONGRUENZE */}
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
             <h3 className="text-2xl font-bold text-white mb-2">Analisi Pack Master</h3>
             <p className="text-sm text-zinc-500">Analisi file XLSX per individuare duplicati e barcode errati.</p>
          </Link>

          {/* LINK AL FILTRO SPEDIZIONI */}
          <Link href="/filtro-spedizioni" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all">
             <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
               <Truck size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Filtro Spedizioni TEMPI DI RESA</h3>
             <p className="text-sm text-zinc-500">Monitoraggio e analisi dei tempi di resa delle spedizioni.</p>
          </Link>

          {/* LINK RECUPERO LETTURE AUTISTI */}
          <Link href="/recupero-letture-autista" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-purple-500/50 hover:bg-zinc-900/80 transition-all">
             <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
               <ClipboardList size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Recupero Letture Autisti</h3>
             <p className="text-sm text-zinc-500">Strumento per il recupero e la gestione dei dati delle letture.</p>
          </Link>

          {/* NUOVO LINK: ANALISI PALLET MASTER */}
          <Link href="/analisi_pallet" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-orange-500/50 hover:bg-zinc-900/80 transition-all">
             <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
               <Package size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Analisi Pallet Master</h3>
             <p className="text-sm text-zinc-500">Strumento per l'elaborazione e la fusione oraria dei dati Pallet Master.</p>
          </Link>

          {/* NUOVO LINK: CONTROLLO PESATURE COLLI PLUS */}
          <Link href="/controllo_pesature_colli_plus" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-pink-500/50 hover:bg-zinc-900/80 transition-all">
             <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500 mb-6 group-hover:scale-110 transition-transform">
               <Scale size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Controllo Pesature Plus</h3>
             <p className="text-sm text-zinc-500">Incrocio dati tra Borderò (TXT) e file CSV Packmaster.</p>
          </Link>

          {/* NUOVO LINK: PIANIFICATORE RISORSE (MOBILE APP) */}
          <Link href="/mobile-resource-planner" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-cyan-500/50 hover:bg-zinc-900/80 transition-all relative overflow-hidden">
             
             {/* Badge Mobile App nell'angolo */}
             <div className="absolute top-6 right-6 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 border border-zinc-700">
                <Smartphone size={12} />
                App Mobile
             </div>

             <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
               <Users size={28} />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2 pr-20">Pianificatore Risorse</h3>
             <p className="text-sm text-zinc-500">Calcolo live del fabbisogno di Picker e Mulettisti in base ai volumi (Case, Loose, PLT).</p>
          </Link>
          {/* NUOVO LINK: PIANIFICATORE SKYPOD INBOUND */}
<Link href="/pianificazione-skypod" className="group block p-8 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all relative overflow-hidden">
  {/* Badge App Mobile */}
  <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
    <Smartphone size={12} />
    Mobile
  </div>

  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
    <ListTodo size={28} />
  </div>
  <h3 className="text-2xl font-bold text-white mb-2">Pianificatore Skypod Inbound</h3>
  <p className="text-sm text-zinc-500 leading-relaxed">
    Gestione rapida operatori per slot orari. Calcolo live del KPI righe/ora con deduplicazione automatica dei tempi di pausa e pranzo.
  </p>
</Link>
        </div>
      </div>

    </div>
  );
}