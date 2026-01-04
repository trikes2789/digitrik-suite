'use client';

import React, { useState } from "react";
import Link from "next/link";
import { 
  Calculator, FileText, ShieldCheck, ArrowRight, Layers, 
  Globe, Heart, Check, Image as ImageIcon, QrCode, 
  ScanLine, Ghost, Cpu, Zap, MousePointerClick,
  Info, Mail, CreditCard, PlayCircle, Coffee, X,
  Monitor // <--- IMPORTANTE: Icona per SnapGlow
} from "lucide-react";

// --- CONFIGURAZIONE STRUMENTI ---
const TOOLS = [
  {
    id: 'pdf',
    title: { en: "PDF Master", it: "PDF Master" },
    desc: { en: "Merge, Convert, and Watermark documents.", it: "Unisci, Converti e proteggi documenti." },
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500", 
    glow: "hover:shadow-[0_0_50px_-12px_rgba(239,68,68,0.6)]", 
    icon: FileText,
    link: "/pdf-tools"
  },
  {
    id: 'snapglow',
    title: { en: "SnapGlow", it: "SnapGlow" },
    desc: { en: "Create beautiful screenshots for social media.", it: "Crea screenshot virali per i social." },
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500",
    glow: "hover:shadow-[0_0_50px_-12px_rgba(236,72,153,0.6)]",
    icon: Monitor,
    link: "/snapglow"
  },
  {
    id: 'quotes',
    title: { en: "Smart Quotes", it: "Preventivi Smart" },
    desc: { en: "Create invoices with penny-perfect reverse calc.", it: "Crea preventivi con calcolo inverso perfetto." },
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500",
    glow: "hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.6)]",
    icon: Calculator,
    link: "/preventivi"
  },
  {
    id: 'images',
    title: { en: "Image Studio", it: "Image Studio" },
    desc: { en: "Compress, Crop and Convert locally.", it: "Comprimi, Ritaglia e Converti in locale." },
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500",
    glow: "hover:shadow-[0_0_50px_-12px_rgba(34,197,94,0.6)]",
    icon: ImageIcon,
    link: "/image-tools"
  },
  {
    id: 'qr',
    title: { en: "QR Creator", it: "QR Creator" },
    desc: { en: "Generate WiFi, vCard and URL codes.", it: "Genera codici WiFi, vCard e Link eterni." },
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500",
    glow: "hover:shadow-[0_0_50px_-12px_rgba(168,85,247,0.6)]",
    icon: QrCode,
    link: "/qr-code"
  },
  {
    id: 'barcode',
    title: { en: "Barcode Pro", it: "Barcode Pro" },
    desc: { en: "EAN-13, UPC and Code128 generator.", it: "Generatore EAN-13, UPC e Code128." },
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500",
    glow: "hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.6)]",
    icon: ScanLine,
    link: "/barcode-generator"
  },
  {
    id: 'ghost',
    title: { en: "Ghost Pixel", it: "Ghost Pixel" },
    desc: { en: "Hide secrets inside images (Steganography).", it: "Nascondi segreti nelle foto (Steganografia)." },
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500",
    glow: "hover:shadow-[0_0_50px_-12px_rgba(245,158,11,0.6)]",
    icon: Ghost,
    link: "/ghost-pixel"
  }
];

// --- TRADUZIONI ---
type Language = 'en' | 'it';

const TRANS = {
  en: {
    hero: {
      tag: "Privacy First Suite",
      title: "DIGITRIK",
      subtitle: "The productivity suite that respects your data.",
      desc: "No uploads. No servers. 100% Local Processing.",
      cta: "Explore Tools"
    },
    toolsTitle: "Available Tools",
    seo: {
      title: "Why Digitrik Pro?",
      p1: "In a web full of paid services and ad-filled sites, Digitrik Pro stands out for a simple philosophy: **Your Browser is the Server**.",
      p2: "We use advanced WebAssembly technologies to process PDFs, Images, and Data directly on your device. This means your sensitive files never leave your computer, guaranteeing military-grade privacy.",
      h2: "Continuous Evolution",
      p3: "This project is not static. We are constantly adding new modules based on community feedback. From PDF management to Steganography, our goal is to create the ultimate Swiss Army Knife for digital workers.",
      list: [
        "**Zero-Knowledge Privacy:** What happens on your PC, stays on your PC.",
        "**Open to Feedback:** We listen to our users to build better tools.",
        "**Always Free:** Professional tools accessible to everyone."
      ]
    },
    footer: {
      subtitle: "Free Professional Suite",
      contact: "INFO & CONTACTS",
      privacy: "Privacy Policy",
      rights: "All rights reserved.",
      coffee: "SUPPORT PROJECT"
    },
    modals: {
      aboutTitle: "Info & Support",
      aboutText: "Digitrik Pro is a free, privacy-first suite. If you find these tools useful, consider supporting the development.",
      contactTitle: "Contact Us",
      donateTitle: "Buy us a coffee",
      adTitle: "Watch an Ad",
      adButton: "Coming Soon"
    }
  },
  it: {
    hero: {
      tag: "Suite Privacy First",
      title: "DIGITRIK",
      subtitle: "La suite di produttività che rispetta i tuoi dati.",
      desc: "Nessun upload. Nessun server. Elaborazione Locale al 100%.",
      cta: "Esplora Strumenti"
    },
    toolsTitle: "Strumenti Disponibili",
    seo: {
      title: "Perché scegliere Digitrik Pro?",
      p1: "In un web pieno di servizi a pagamento e siti pieni di pubblicità invasiva, Digitrik Pro si distingue per una filosofia semplice: **Il Tuo Browser è il Server**.",
      p2: "Utilizziamo tecnologie avanzate (WebAssembly) per elaborare PDF, Immagini e Dati direttamente sul tuo dispositivo. Questo significa che i tuoi file sensibili non lasciano mai il tuo computer, garantendo una privacy di livello militare.",
      h2: "Evoluzione Continua",
      p3: "Questo progetto non è statico. Aggiungiamo costantemente nuovi moduli basati sui feedback della community. Dalla gestione PDF alla Steganografia, il nostro obiettivo è creare il Coltellino Svizzero definitivo per i lavoratori digitali.",
      list: [
        "**Privacy Zero-Knowledge:** Quello che succede sul tuo PC, resta sul tuo PC.",
        "**Aperto ai Consigli:** Ascoltiamo i nostri utenti per costruire tool migliori.",
        "**Sempre Gratuito:** Strumenti professionali accessibili a tutti."
      ]
    },
    footer: {
      subtitle: "Suite Professionale Gratuita",
      contact: "INFO & CONTATTI",
      privacy: "Privacy Policy",
      rights: "Tutti i diritti riservati.",
      coffee: "SUPPORTA IL PROGETTO"
    },
    modals: {
      aboutTitle: "Info & Supporto",
      aboutText: "Digitrik Pro è una suite gratuita e privacy-first. Se trovi utili questi strumenti, considera di supportare lo sviluppo.",
      contactTitle: "Contattaci",
      donateTitle: "Offrici un caffè",
      adTitle: "Guarda uno Spot",
      adButton: "Presto Disponibile"
    }
  }
};

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const t = TRANS[lang];

  // MODAL STATE
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  return (
    <main className="flex flex-col min-h-screen relative bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      
      {/* LANGUAGE TOGGLE FIXED */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex bg-zinc-900/80 backdrop-blur-md rounded-full p-1 border border-zinc-800 shadow-xl">
          <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 transition-all ${lang === 'en' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}><Globe size={10} /> EN</button>
          <button onClick={() => setLang('it')} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-full flex items-center gap-1 transition-all ${lang === 'it' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}><Globe size={10} /> IT</button>
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck size={12} className="text-green-500" /> {t.hero.tag}
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {t.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">PRO</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {t.hero.subtitle} <br/>
          <span className="text-zinc-200 font-medium"> {t.hero.desc}</span>
        </p>

        <div className="flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Link href="#tools" className="px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center gap-2">
            {t.hero.cta} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* --- TOOLS GRID --- */}
      <section id="tools" className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-8 flex items-center gap-2">
          <Layers size={16} /> {t.toolsTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.link} className={`group relative bg-zinc-900/40 border rounded-3xl p-8 transition-all hover:bg-zinc-900 hover:-translate-y-1 ${tool.border} ${tool.glow}`}>
              <div className={`absolute top-6 right-6 p-2 rounded-xl ${tool.bg} ${tool.color} transition-transform group-hover:scale-110`}>
                <tool.icon size={24} />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-2">{tool.title[lang]}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6">{tool.desc[lang]}</p>
                <div className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${tool.color}`}>
                  OPEN TOOL <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          ))}
          
          {/* Card "Coming Soon" */}
          <div className="group relative bg-zinc-950/30 border border-zinc-800/50 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center opacity-70">
             <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest">Coming Soon</h3>
             <p className="text-xs text-zinc-600 mt-2">More tools arriving...</p>
          </div>
        </div>
      </section>

      {/* --- SEO / EVOLUTION CONTENT --- */}
      <section className="px-6 py-20 bg-zinc-900/30 border-t border-white/5">
         <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
                <MousePointerClick size={24} className="text-blue-500"/>
                <h2 className="text-2xl font-black text-white tracking-tight">{t.seo.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-zinc-400 text-sm leading-relaxed">
                <div className="space-y-6">
                    <p>{t.seo.p1}</p>
                    <div className="p-6 bg-zinc-950 rounded-2xl border border-white/5">
                        <Zap size={20} className="text-yellow-500 mb-3" />
                        <p className="text-xs text-zinc-300">{t.seo.p2}</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><Cpu size={18} className="text-purple-500"/> {t.seo.h2}</h3>
                    <p>{t.seo.p3}</p>
                    <ul className="space-y-3">
                        {t.seo.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="min-w-[4px] h-[4px] mt-2 rounded-full bg-blue-500"></div>
                                <span>{item.includes('**') ? <><strong className="text-white">{item.split('**')[1]}</strong>{item.split('**')[2]}</> : item}</span>
                            </li>
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
          <div className="flex gap-6 text-xs font-bold text-zinc-500 items-center">
            {/* Link Info (Modal) */}
            <button onClick={() => setShowInfoModal(true)} className="hover:text-white transition-colors">{t.footer.contact}</button>
            {/* Link Privacy (Page) */}
            <Link href="/privacy-policy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
            <span className="text-zinc-600">© 2024 {t.footer.rights}</span>
          </div>
          {/* Link Support (Modal) */}
          <button onClick={() => setShowSupportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-green-500 hover:border-green-500 transition-all">
            <Heart size={14} /> {t.footer.coffee}
          </button>
        </div>
      </footer>

      {/* --- INFO MODAL --- */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.modals.aboutTitle}</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-800 pl-4">"{t.modals.aboutText}"</p></div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/30 transition-colors"><div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold uppercase text-xs tracking-wider"><Mail size={14} /> {t.modals.contactTitle}</div><a href="mailto:trichesir@gmail.com" className="text-blue-400 hover:text-blue-300 font-mono text-sm block">trichesir@gmail.com</a></div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUPPORT MODAL --- */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.footer.coffee}</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donateTitle}</h4>
                    <div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div>
                </div>
                <div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-purple-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> {t.modals.adTitle}</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">{t.modals.adButton}</button></div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}