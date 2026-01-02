'use client';

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calculator, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Globe, 
  Heart,
  Check as CheckIcon,
  Image as ImageIcon,
  QrCode
} from "lucide-react";

// --- DEFINIZIONE TIPI ---
type Language = 'en' | 'it';

// --- DIZIONARIO TRADUZIONI ---
const TRANSLATIONS = {
  en: {
    hero: {
      tag: "Privacy First Technology",
      subtitle: "The productivity suite that respects your data.",
      highlight: "No uploads, no servers, no cost.",
      desc: "All computing power happens directly in your browser.",
      ctaStart: "Start Now",
      ctaMission: "Discover Mission"
    },
    tools: {
      title: "Available Tools",
      preventivi: {
        title: "Smart Quotes",
        desc: "Create professional PDF quotes. Includes 'Penny-Perfect' reverse calculation for exact totals.",
        cta: "Open Tool"
      },
      pdf: {
        title: "PDF Master Suite",
        desc: "The Swiss Army knife for your documents. Merge, convert, watermark, and protect your PDFs.",
        cta: "Open Tool"
      },
      image: {
        title: "Image Studio",
        desc: "Compress, Resize, Convert, and Crop your images directly in browser. Supports HEIC.",
        cta: "Open Tool"
      },
      qr: {
        title: "QR Creator Pro",
        desc: "Generate professional QR Codes for WiFi, Links, and Contacts. Customize colors and logos. Forever free.",
        cta: "Open Tool"
      },
      comingSoon: {
        title: "Coming Soon",
        desc: "New tools arriving..."
      }
    },
    mission: {
      title: "Our Mission",
      text1: "Digitrik Pro was born from curiosity for programming and to simplify work for thousands dealing with digital documents daily.",
      text2: "My goal is to build a set of **free, accessible digital tools** for everyone, with no barriers.",
      privacyTitle: "Privacy First",
      privacyText: "I believe in total Privacy. Unlike other services, here your files **NEVER leave your browser**.",
      bullets: [
        "No upload to external servers",
        "No hidden databases",
        "100% Local processing"
      ]
    },
    footer: {
      subtitle: "Free Professional Suite",
      contact: "INFO & CONTACTS",
      privacy: "Privacy Policy",
      rights: "All rights reserved.",
      coffee: "SUPPORT PROJECT"
    }
  },
  it: {
    hero: {
      tag: "Tecnologia Privacy First",
      subtitle: "La suite di produttività che rispetta i tuoi dati.",
      highlight: "Nessun upload, nessun server, nessun costo.",
      desc: "Tutta la potenza di calcolo avviene direttamente nel tuo browser.",
      ctaStart: "Inizia Subito",
      ctaMission: "Scopri la Mission"
    },
    tools: {
      title: "Strumenti Disponibili",
      preventivi: {
        title: "Preventivi Smart",
        desc: "Crea preventivi professionali in PDF. Include il calcolo inverso 'Penny-Perfect' per totali esatti.",
        cta: "Apri Tool"
      },
      pdf: {
        title: "PDF Master Suite",
        desc: "Il coltellino svizzero per i tuoi documenti. Unisci, converti, aggiungi watermark e proteggi i tuoi PDF.",
        cta: "Apri Tool"
      },
      image: {
        title: "Image Studio",
        desc: "Comprimi, Ridimensiona, Converti e Ritaglia direttamente nel browser. Supporta HEIC.",
        cta: "Apri Tool"
      },
      qr: {
        title: "QR Creator Pro",
        desc: "Genera QR Code per WiFi, Link e Contatti. Personalizza colori e logo. Eterni e Gratuiti.",
        cta: "Apri Tool"
      },
      comingSoon: {
        title: "Coming Soon",
        desc: "Nuovi strumenti in arrivo..."
      }
    },
    mission: {
      title: "La nostra Mission",
      text1: "Digitrik Pro è nato dalla mia curiosità per la programmazione, e per semplificare il lavoro di migliaia di persone che trattano con i documenti digitali ogni giorno.",
      text2: "Il mio obiettivo è costruire una serie di **tool digitali gratuiti e accessibili a tutti**, senza barriere all'ingresso.",
      privacyTitle: "Privacy First",
      privacyText: "Credo nella Privacy totale. A differenza di altri servizi online, qui i tuoi file **non lasciano MAI il tuo browser**.",
      bullets: [
        "Nessun upload su server esterni",
        "Nessun database nascosto",
        "Elaborazione locale al 100%"
      ]
    },
    footer: {
      subtitle: "Suite Professionale Gratuita",
      contact: "INFO & CONTATTI",
      privacy: "Privacy Policy",
      rights: "Tutti i diritti riservati.",
      coffee: "SUPPORTA IL PROGETTO"
    }
  }
};

export default function Home() {
  // DEFAULT LANGUAGE: ENGLISH
  const [lang, setLang] = useState<Language>('en'); 
  const t = TRANSLATIONS[lang];

  return (
    <main className="flex flex-col min-h-screen relative bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* --- LANGUAGE TOGGLE (Top Right) --- */}
      <div className="absolute top-6 right-6 z-50">
        <div className="flex bg-zinc-900/80 backdrop-blur-md rounded-full p-1 border border-zinc-800">
          <button 
            onClick={() => setLang('en')} 
            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 transition-all ${lang === 'en' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
             <Globe size={10} /> EN
          </button>
          <button 
            onClick={() => setLang('it')} 
            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 transition-all ${lang === 'it' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
             <Globe size={10} /> IT
          </button>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-6xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ShieldCheck size={14} /> {t.hero.tag}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          DIGITRIK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">PRO</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {t.hero.subtitle} 
          <span className="text-zinc-200 font-medium"> {t.hero.highlight}</span> 
          {' ' + t.hero.desc}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <Link href="#tools" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2">
            {t.hero.ctaStart} <ArrowRight size={18} />
          </Link>
          <a href="#mission" className="px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-full font-bold transition-all">
            {t.hero.ctaMission}
          </a>
        </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section id="tools" className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
          <Layers size={16} /> {t.tools.title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARD 1: PREVENTIVI (BLUE) */}
          <Link href="/preventivi" className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 rounded-3xl p-8 transition-all hover:bg-zinc-900 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Calculator size={100} />
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
              <Calculator size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.tools.preventivi.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {t.tools.preventivi.desc}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider group-hover:text-blue-300">
              {t.tools.preventivi.cta} <ArrowRight size={14} />
            </div>
          </Link>

          {/* CARD 2: PDF SUITE (RED) */}
          <Link href="/pdf-tools" className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-red-500/50 rounded-3xl p-8 transition-all hover:bg-zinc-900 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText size={100} />
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.tools.pdf.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {t.tools.pdf.desc}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider group-hover:text-red-300">
              {t.tools.pdf.cta} <ArrowRight size={14} />
            </div>
          </Link>

          {/* CARD 3: IMAGE STUDIO (GREEN) */}
          <Link href="/image-tools" className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-green-500/50 rounded-3xl p-8 transition-all hover:bg-zinc-900 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <ImageIcon size={100} />
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.tools.image.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {t.tools.image.desc}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider group-hover:text-green-300">
              {t.tools.image.cta} <ArrowRight size={14} />
            </div>
          </Link>

          {/* CARD 4: QR CREATOR (PURPLE) */}
          <Link href="/qr-code" className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 rounded-3xl p-8 transition-all hover:bg-zinc-900 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <QrCode size={100} />
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
              <QrCode size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{t.tools.qr.title}</h3>
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {t.tools.qr.desc}
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider group-hover:text-purple-300">
              {t.tools.qr.cta} <ArrowRight size={14} />
            </div>
          </Link>

          {/* CARD 5: COMING SOON */}
          <div className="group relative bg-zinc-950/30 border border-zinc-800/50 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70 hover:opacity-100 transition-opacity">
             <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">{t.tools.comingSoon.title}</h3>
             <p className="text-xs text-zinc-600 mt-2">{t.tools.comingSoon.desc}</p>
          </div>

        </div>
      </section>

      {/* --- MISSION & STORY --- */}
      <section id="mission" className="bg-zinc-900/30 border-y border-white/5 py-24">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                <Globe size={24} className="text-green-500" /> {t.mission.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed text-sm mb-6">
                {t.mission.text1}
              </p>
              <p className="text-zinc-400 leading-relaxed text-sm">
                 {lang === 'en' ? (
                    <>My goal is to build a set of <strong className="text-zinc-200">free, accessible digital tools</strong> for everyone, with no barriers.</>
                 ) : (
                    <>Il mio obiettivo è costruire una serie di <strong className="text-zinc-200">tool digitali gratuiti e accessibili a tutti</strong>, senza barriere all'ingresso.</>
                 )}
              </p>
            </div>

            <div className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-blue-500" /> {t.mission.privacyTitle}
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed mb-4">
                 {lang === 'en' ? (
                    <>I believe in total Privacy. Unlike other services, here your files <strong className="text-white">NEVER leave your browser</strong>.</>
                 ) : (
                    <>Credo nella Privacy totale. A differenza di altri servizi online, qui i tuoi file <strong className="text-white">non lasciano MAI il tuo browser</strong>.</>
                 )}
              </p>
              <ul className="space-y-2 text-xs text-zinc-500">
                {t.mission.bullets.map((bullet: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2"><CheckIcon size={12} className="text-green-500"/> {bullet}</li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 text-center mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <h4 className="text-lg font-black text-white italic tracking-tighter">DIGITRIK</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.footer.subtitle}</p>
          </div>
          
          <div className="flex gap-6 text-xs font-bold text-zinc-500">
            <a href="mailto:trichesir@gmail.com" className="hover:text-white transition-colors">{t.footer.contact}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-600">© 2024 {t.footer.rights}</span>
          </div>

          <a href="https://www.paypal.me/triches89" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-green-500 hover:border-green-500 hover:text-green-400 transition-all">
            <Heart size={14} /> {t.footer.coffee}
          </a>
        </div>
      </footer>

    </main>
  );
}