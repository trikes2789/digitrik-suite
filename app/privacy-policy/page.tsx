'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, Server, Cookie } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-white/5 bg-zinc-900/50 sticky top-0 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Torna alla Home
          </Link>
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Legal Center
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-zinc-500 text-sm mb-12">Ultimo aggiornamento: Gennaio 2025</p>

        <div className="space-y-12">
          
          {/* SEZIONE 1: FILOSOFIA */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><Server size={20} /></div>
              <h2 className="text-xl font-bold text-white">1. Elaborazione Locale (Client-Side)</h2>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
              <p className="leading-relaxed text-sm">
                A differenza della maggior parte dei servizi online, **Digitrik Pro** è progettato con un'architettura "Serverless Client-Side". 
                <br/><br/>
                Ciò significa che quando carichi un PDF, un'immagine o generi un QR Code, **il file non viene mai inviato ai nostri server**. 
                L'intero processo di elaborazione avviene localmente nella memoria del tuo dispositivo (browser) utilizzando tecnologie WebAssembly. 
                Nessuno, nemmeno noi, ha accesso ai tuoi file.
              </p>
            </div>
          </section>

          {/* SEZIONE 2: DATI RACCOLTI */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Eye size={20} /></div>
              <h2 className="text-xl font-bold text-white">2. Dati che raccogliamo</h2>
            </div>
            <p className="leading-relaxed text-sm mb-4">
              Noi non richiediamo registrazione e non salviamo i tuoi dati personali nei nostri database. Tuttavia, utilizziamo servizi di terze parti per mantenere il sito gratuito e funzionante:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-400">
              <li>**Log di Sistema:** Il server di hosting (Vercel) potrebbe registrare indirizzi IP anonimizzati per fini di sicurezza e prevenzione DDOS.</li>
              <li>**Local Storage:** Salviamo le tue preferenze (es. impostazioni lingua o tema) direttamente nel tuo browser. Questi dati non viaggiano in rete.</li>
            </ul>
          </section>

          {/* SEZIONE 3: ADSENSE E COOKIE */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Cookie size={20} /></div>
              <h2 className="text-xl font-bold text-white">3. Pubblicità e Cookie (Google AdSense)</h2>
            </div>
            <div className="prose prose-invert prose-sm text-zinc-400">
              <p>
                Per mantenere questo servizio gratuito, utilizziamo **Google AdSense** per mostrare annunci pubblicitari.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Google e i suoi partner utilizzano i cookie per pubblicare annunci basati sulle precedenti visite dell'utente a questo o ad altri siti web.</li>
                <li>L'uso dei cookie per la pubblicità consente a Google e ai suoi partner di pubblicare annunci per i tuoi utenti in base alla loro visita ai tuoi siti e/o ad altri siti Internet.</li>
                <li>Gli utenti possono scegliere di disattivare la pubblicità personalizzata visitando la pagina <a href="https://www.google.com/settings/ads" target="_blank" className="text-blue-400 underline">Impostazioni annunci</a>.</li>
              </ul>
            </div>
          </section>

          {/* SEZIONE 4: CONTATTI */}
          <section className="border-t border-white/5 pt-12">
            <h2 className="text-lg font-bold text-white mb-4">Contatti</h2>
            <p className="text-sm text-zinc-400">
              Per qualsiasi domanda riguardante questa privacy policy, puoi contattarci a:<br/>
              <a href="mailto:info@digitrikpro.com" className="text-blue-500 font-mono mt-2 block">info@digitrikpro.com</a>
            </p>
          </section>

        </div>
      </main>

      <footer className="py-8 text-center border-t border-white/5 mt-12">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest">© 2024 Digitrik Pro - Privacy Policy</p>
      </footer>
    </div>
  );
}