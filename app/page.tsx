'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calculator, FileText, ShieldCheck, ArrowRight, Layers, 
  Globe, Heart, Check, Image as ImageIcon, QrCode, 
  ScanLine, Ghost, Cpu, Zap, MousePointerClick,
  Info, Mail, CreditCard, PlayCircle, Coffee, X,
  Monitor, Briefcase, Lock, Palette, LayoutGrid
} from "lucide-react";

// --- DATI DEI TOOL (DATABASE) ---
const TOOLS = [
  {
    id: 'synapse',
    title: { en: "Social Synapse", it: "Social Synapse" },
    desc: { en: "Create perfect posts for LinkedIn, IG & TikTok.", it: "Crea post perfetti per LinkedIn, IG & TikTok." },
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    barColor: "bg-indigo-500",
    border: "border-indigo-500/30", // Cornice colorata
    glow: "hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]",
    icon: Zap,
    link: "/synapse"
  },
  {
    id: 'pdf',
    title: { en: "PDF Master", it: "PDF Master" },
    desc: { en: "Merge, Convert, and Watermark documents.", it: "Unisci, Converti e proteggi documenti in locale." },
    color: "text-red-500",
    bg: "bg-red-500/10",
    barColor: "bg-red-500",
    border: "border-red-500/30", 
    glow: "hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.5)]", 
    icon: FileText,
    link: "/pdf-tools"
  },
  {
    id: 'snapglow',
    title: { en: "SnapGlow", it: "SnapGlow" },
    desc: { en: "Beautiful screenshots for social media.", it: "Crea screenshot virali per i social." },
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    barColor: "bg-pink-500",
    border: "border-pink-500/30",
    glow: "hover:shadow-[0_0_40px_-10px_rgba(236,72,153,0.5)]",
    icon: Monitor,
    link: "/snapglow"
  },
  {
    id: 'quotes',
    title: { en: "Smart Quotes", it: "Preventivi Smart" },
    desc: { en: "Invoices with reverse calculation.", it: "Preventivi con calcolo inverso perfetto." },
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    barColor: "bg-blue-500",
    border: "border-blue-500/30",
    glow: "hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)]",
    icon: Calculator,
    link: "/preventivi"
  },
  {
    id: 'images',
    title: { en: "Image Studio", it: "Image Studio" },
    desc: { en: "Compress, Crop and Convert locally.", it: "Comprimi, Ritaglia e Converti in locale." },
    color: "text-green-500",
    bg: "bg-green-500/10",
    barColor: "bg-green-500",
    border: "border-green-500/30",
    glow: "hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)]",
    icon: ImageIcon,
    link: "/image-tools"
  },
  {
    id: 'qr',
    title: { en: "QR Creator", it: "QR Creator" },
    desc: { en: "WiFi, vCard and URL codes.", it: "Genera codici WiFi, vCard e Link eterni." },
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    barColor: "bg-purple-500",
    border: "border-purple-500/30",
    glow: "hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.5)]",
    icon: QrCode,
    link: "/qr-code"
  },
  {
    id: 'barcode',
    title: { en: "Barcode Pro", it: "Barcode Pro" },
    desc: { en: "Professional EAN-13 & UPC generator.", it: "Generatore professionale EAN-13, UPC e Code128." },
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    barColor: "bg-cyan-500",
    border: "border-cyan-500/30",
    glow: "hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)]",
    icon: ScanLine,
    link: "/barcode-generator"
  },
  {
    id: 'ghost',
    title: { en: "Ghost Pixel", it: "Ghost Pixel" },
    desc: { en: "Hide secrets inside images.", it: "Nascondi segreti nelle foto con la Steganografia." },
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    barColor: "bg-amber-500",
    border: "border-amber-500/30",
    glow: "hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)]",
    icon: Ghost,
    link: "/ghost-pixel"
  }
];

// --- DEFINIZIONE CATEGORIE ---
const CATEGORIES = [
  {
    id: 'ai',
    title: { en: "AI & Prompt", it: "AI & Prompt" },
    icon: Zap,
    color: "text-indigo-500",
    items: ['synapse']
  },
  {
    id: 'business',
    title: { en: "Business & Docs", it: "Business & Documenti" },
    icon: Briefcase,
    color: "text-blue-500",
    items: ['pdf', 'quotes']
  },
  {
    id: 'creative',
    title: { en: "Media & Design", it: "Media & Design" },
    icon: Palette,
    color: "text-pink-500",
    items: ['snapglow', 'images']
  },
  {
    id: 'utils',
    title: { en: "Codes & Security", it: "Codici & Sicurezza" },
    icon: Lock,
    color: "text-purple-500",
    items: ['qr', 'barcode', 'ghost']
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

// --- SPOTLIGHT CAROUSEL ---
const ToolsCarousel = ({ lang }: { lang: Language }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(true); 
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TOOLS.length);
        setFade(false); 
      }, 300); 
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  const tool = TOOLS[index];
  const Icon = tool.icon;

  return (
    <div className="mt-16 w-full max-w-3xl mx-auto">
      <Link href={tool.link} className="block group">
        <div className={`relative overflow-hidden bg-zinc-900/50 backdrop-blur-md border rounded-2xl transition-all hover:bg-zinc-900/80 ${tool.border}`}>
          
          <div className="flex flex-col md:flex-row items-center p-6 gap-4 md:gap-6 text-center md:text-left">
            <div className={`p-4 rounded-xl shrink-0 transition-all duration-300 ${tool.bg} ${tool.color}`}>
               <Icon size={28} strokeWidth={1.5} />
            </div>

            <div className={`flex-1 min-w-0 flex flex-col justify-center transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}>
               <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-3 mb-2 md:mb-1">
                 <h3 className={`text-base md:text-lg font-bold uppercase tracking-wider ${tool.color}`}>
                   {tool.title[lang]}
                 </h3>
                 <span className="hidden md:inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 text-zinc-500 uppercase tracking-widest border border-white/5">
                   FEATURED
                 </span>
               </div>
               
               <p className="text-sm text-zinc-400 leading-relaxed md:truncate px-2 md:px-0">
                 {tool.desc[lang]}
               </p>
            </div>

            <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full border border-white/5 text-zinc-500 group-hover:text-white group-hover:border-white/20 transition-all group-hover:translate-x-1">
               <ArrowRight size={18} />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
             <div 
               key={index} 
               className={`h-full ${tool.barColor}`} 
               style={{ 
                 width: '0%',
                 animation: 'progress 4s linear forwards' 
               }}
             />
          </div>

        </div>
      </Link>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const t = TRANS[lang];

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
      <section className="relative px-6 pt-10 pb-32 md:pt-14 md:pb-40 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck size={12} className="text-green-500" /> {t.hero.tag}
        </div>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 leading-none">
          {t.hero.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">PRO</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {t.hero.subtitle} <span className="text-zinc-200 font-medium block mt-2">{t.hero.desc}</span>
        </p>

        {/* CONTAINER BOTTONE E CAROSELLO */}
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
          <Link href="#tools" className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-10px_rgba(37,99,235,0.7)] flex items-center gap-3 transform hover:-translate-y-1 ring-1 ring-white/10">
            {t.hero.cta} <ArrowRight size={18} />
          </Link>
          <ToolsCarousel lang={lang} />
        </div>

      </section>

      {/* --- TOOLS SECTION --- */}
      <section id="tools" className="px-6 py-24 max-w-7xl mx-auto w-full border-t border-white/5 bg-zinc-900/20">
        
        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-16 flex items-center gap-2 justify-center">
          <LayoutGrid size={16} /> {t.toolsTitle}
        </h2>

        <div className="space-y-20">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-2 rounded-lg bg-zinc-900 border border-white/5 ${cat.color}`}>
                  <cat.icon size={20} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">{cat.title[lang]}</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TOOLS.filter(tool => cat.items.includes(tool.id)).map((tool) => (
                  <Link key={tool.id} href={tool.link} className={`group relative bg-zinc-900/40 border rounded-[2rem] p-8 transition-all hover:bg-zinc-900 hover:-translate-y-1 ${tool.border} ${tool.glow}`}>
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
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* --- SEO --- */}
      <section className="px-6 py-24 bg-zinc-900/30 border-t border-white/5">
         <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-10">
                <MousePointerClick size={28} className="text-blue-500"/>
                <h2 className="text-3xl font-black text-white tracking-tight">{t.seo.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-400 text-base leading-relaxed">
                <div className="space-y-8">
                    <p>{t.seo.p1}</p>
                    <div className="p-8 bg-zinc-950 rounded-3xl border border-white/5 shadow-xl">
                        <Zap size={24} className="text-yellow-500 mb-4" />
                        <p className="text-sm text-zinc-300 font-medium">{t.seo.p2}</p>
                    </div>
                </div>
                <div className="space-y-8">
                    <h3 className="text-white font-bold text-xl flex items-center gap-3"><Cpu size={24} className="text-purple-500"/> {t.seo.h2}</h3>
                    <p>{t.seo.p3}</p>
                    <ul className="space-y-4">
                        {t.seo.list.map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="min-w-[6px] h-[6px] mt-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                                <span>{item.includes('**') ? <><strong className="text-white">{item.split('**')[1]}</strong>{item.split('**')[2]}</> : item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5 text-center mt-auto bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left">
            <h4 className="text-xl font-black text-white italic tracking-tighter">DIGITRIK PRO</h4>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{t.footer.subtitle}</p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-zinc-500 items-center">
            <button onClick={() => setShowInfoModal(true)} className="hover:text-white transition-colors">{t.footer.contact}</button>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">{t.footer.privacy}</Link>
            <span className="text-zinc-600">© 2024 {t.footer.rights}</span>
          </div>
          <button onClick={() => setShowSupportModal(true)} className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-green-500 hover:border-green-500 transition-all hover:bg-green-500/10">
            <Heart size={16} /> {t.footer.coffee}
          </button>
        </div>
      </footer>

      {/* MODALS */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.modals.aboutTitle}</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-800 pl-4">"{t.modals.aboutText}"</p></div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/30 transition-colors"><div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold uppercase text-xs tracking-wider"><Mail size={14} /> {t.modals.contactTitle}</div><a href="mailto:info@digitrikpro.com" className="text-blue-400 hover:text-blue-300 font-mono text-sm block">info@digitrikpro.com</a></div>
            </div>
          </div>
        </div>
      )}

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