'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { 
  ScanLine, ArrowLeft, Download, Settings, 
  X, Heart, RefreshCcw, Type, Wand2, Printer, 
  Image as ImageIcon, FileCode, Dices,
  Info, CreditCard, PlayCircle, Coffee, Sparkles,
  Check, AlertCircle, BookOpen, HelpCircle, Layers
} from 'lucide-react';
import Link from 'next/link';

// --- HELPERS ---
const generateRandomData = (fmt) => {
    if (fmt === 'EAN13') {
        let res = ''; for(let i=0; i<12; i++) res += Math.floor(Math.random()*10); return res;
    }
    if (fmt === 'UPC') {
        let res = ''; for(let i=0; i<11; i++) res += Math.floor(Math.random()*10); return res;
    }
    if (fmt === 'ITF14') {
        let res = ''; for(let i=0; i<13; i++) res += Math.floor(Math.random()*10); return res;
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let res = ''; for(let i=0; i<8; i++) res += chars.charAt(Math.floor(Math.random()*chars.length));
    return res;
};

// --- COMPONENTS ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-zinc-500 uppercase tracking-widest text-[10px] font-bold px-2">
    <Icon size={14} className="text-cyan-500" />
    {title}
  </div>
);

const NavItem = ({ active, onClick, label }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border mb-1 flex items-center justify-between ${active ? 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}
  >
    {label}
    {active && <Check size={14} className="text-cyan-500"/>}
  </button>
);

const Slider = ({ label, value, min, max, step=1, onChange, unit="" }) => (
    <div className="mb-4">
      <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-2">
        <span>{label}</span>
        <span className="text-cyan-400 font-mono">{value}{unit}</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
      />
    </div>
);

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appName: "BARCODE STUDIO",
    nav: { format: "Barcode Format" },
    labels: { 
      content: "Barcode Data", 
      width: "Bar Width", 
      height: "Height", 
      margin: "Margin", 
      background: "Background",
      lineColor: "Bar Color",
      showText: "Show Numbers" 
    },
    rules: {
      CODE128: "Supports Letters (A-Z), Numbers (0-9) & symbols. Best for logistics, tracking & shipping labels.",
      EAN13: "Numeric only (0-9). Enter 12 digits. Standard for retail products worldwide (except USA/Canada).",
      UPC: "Numeric only (0-9). Enter 11 or 12 digits. Standard for retail products in USA & Canada.",
      CODE39: "Uppercase (A-Z), Numbers (0-9) & - . $ / + %. Used in automotive, defense & ID badges.",
      ITF14: "Numeric only. Exactly 13 or 14 digits. Specifically designed for printing on corrugated cardboard boxes.",
      MSI: "Numeric only. Variable length. Commonly used for warehouse shelves and inventory management."
    },
    actions: { 
      download: "Download", 
      print: "Print",
      random: "Randomize",
      svg: "Vector (SVG)",
      png: "Image (PNG)"
    },
    infoBtn: "INFO & CONTACTS",
    supportBtn: "SUPPORT PROJECT",
    modals: {
      ready: "Export Barcode",
      chooseName: "Filename",
      cancel: "Cancel",
      didYouKnow: "Did you know?",
      donateTitle: "Buy us a coffee"
    },
    enc: {
      EAN: { text: "EAN-13 is mandatory for retail in Europe. The first 3 digits represent the Country Code.", key: "Retail" },
      VECTOR: { text: "SVG format is infinite resolution. Use it for professional printing on packaging.", key: "Pro Tip" }
    },
    seo: {
      title: "The Ultimate Guide to Online Barcode Generation",
      intro: "Digitrik Pro Barcode Studio is a professional, privacy-first tool designed to generate high-quality barcodes directly in your browser. Whether you need an EAN-13 for a retail product, a Code128 for logistics, or a UPC for the American market, this suite covers all standards.",
      h1: "Which Barcode Format Should You Choose?",
      p1: "Choosing the right format is crucial for scannability. Here is a breakdown of the most common standards:",
      ul1: [
        "**EAN-13:** The global standard for retail products (Europe, Asia, South America). It requires exactly 12 digits (the 13th is calculated automatically).",
        "**UPC-A:** The standard for retail in the USA and Canada. It consists of 12 digits.",
        "**Code128:** A high-density format that can encode letters, numbers, and symbols. Perfect for shipping labels (Amazon, FedEx, DHL).",
        "**ITF-14:** Designed for printing on corrugated cardboard (outer cartons). It has a thick border to ensure readability on rough surfaces."
      ],
      h2: "Why Use Vector (SVG) for Barcodes?",
      p2: "If you plan to print your barcode on product packaging, **always use SVG**. Unlike PNG (which is made of pixels and can get blurry), SVG is a vector format. It remains perfectly sharp at any size, ensuring that barcode scanners can read it without errors.",
      h3: "Privacy & Security",
      p3: "Unlike other online generators, Digitrik Pro processes everything **locally** on your device using JavaScript. Your data and product codes are never uploaded to a server, ensuring 100% confidentiality."
    }
  },
  it: {
    appName: "BARCODE STUDIO",
    nav: { format: "Formato Barcode" },
    labels: { 
      content: "Contenuto Dati", 
      width: "Spessore Barre", 
      height: "Altezza", 
      margin: "Margine", 
      background: "Sfondo",
      lineColor: "Colore Barre",
      showText: "Mostra Numeri" 
    },
    rules: {
      CODE128: "Lettere (A-Z), Numeri (0-9) e simboli. Ideale per logistica, spedizioni e tracciamento pacchi.",
      EAN13: "Solo Numeri (0-9). Inserisci 12 cifre. Standard obbligatorio per la vendita al dettaglio (Mondo).",
      UPC: "Solo Numeri (0-9). Inserisci 11 o 12 cifre. Standard per la vendita al dettaglio in USA e Canada.",
      CODE39: "Maiuscole (A-Z), Numeri (0-9) e simboli. Usato nell'industria automobilistica e militare.",
      ITF14: "Solo Numeri. 13 o 14 cifre. Progettato specificamente per la stampa su scatole e imballaggi di cartone.",
      MSI: "Solo Numeri. Lunghezza variabile. Comune per etichette da scaffale e gestione inventario magazzino."
    },
    actions: { 
      download: "Scarica", 
      print: "Stampa",
      random: "Dati Casual",
      svg: "Vettoriale (SVG)",
      png: "Immagine (PNG)"
    },
    infoBtn: "INFO & CONTATTI",
    supportBtn: "SUPPORTA IL PROGETTO",
    modals: {
      ready: "Esporta Barcode",
      chooseName: "Nome File",
      cancel: "Annulla",
      didYouKnow: "Lo sapevi?",
      donateTitle: "Offrici un caffè"
    },
    enc: {
      EAN: { text: "L'EAN-13 è obbligatorio per la vendita in Europa. Le prime 3 cifre indicano il paese.", key: "Retail" },
      VECTOR: { text: "Il formato SVG ha risoluzione infinita. Usalo per la stampa professionale sui pacchi.", key: "Pro Tip" }
    },
    seo: {
      title: "Guida Completa alla Generazione di Codici a Barre",
      intro: "Digitrik Pro Barcode Studio è uno strumento professionale e sicuro per generare codici a barre di alta qualità direttamente nel browser. Che tu abbia bisogno di un EAN-13 per un prodotto da vendere, o un Code128 per la logistica, questa suite copre tutti gli standard industriali.",
      h1: "Quale formato di Barcode scegliere?",
      p1: "Scegliere il formato giusto è essenziale per garantire la leggibilità alla cassa o in magazzino. Ecco una panoramica degli standard più usati:",
      ul1: [
        "**EAN-13:** Lo standard globale per la vendita al dettaglio (Europa, Asia, Italia). Richiede 12 cifre in input (la 13ª è il codice di controllo calcolato automaticamente).",
        "**UPC-A:** Lo standard predominante per la vendita al dettaglio in USA e Canada.",
        "**Code128:** Un formato ad alta densità capace di codificare lettere, numeri e simboli. È lo standard per le etichette di spedizione (Amazon, corrieri).",
        "**ITF-14:** Progettato specificamente per la stampa su cartone ondulato (imballaggi esterni). Ha bordi spessi per tollerare la qualità di stampa inferiore."
      ],
      h2: "Perché usare il formato Vettoriale (SVG)?",
      p2: "Se devi stampare il codice a barre sul packaging del prodotto, **usa sempre SVG**. A differenza del PNG (fatto di pixel, che sgrana se ingrandito), l'SVG è un formato matematico vettoriale. Rimane perfettamente nitido a qualsiasi dimensione, garantendo che i lettori laser possano scansionarlo al primo colpo.",
      h3: "Privacy e Sicurezza Totale",
      p3: "A differenza di molti generatori online, Digitrik Pro elabora tutto **localmente** sul tuo dispositivo. I codici dei tuoi prodotti non vengono mai caricati su un server esterno, garantendo la massima riservatezza industriale."
    }
  }
};

export default function BarcodeGenerator() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  // CORE STATE
  const [text, setText] = useState('DIGITRIK-PRO');
  const [format, setFormat] = useState('CODE128');
  const [isValid, setIsValid] = useState(true);
  
  // UI STATE
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("barcode");
  const [exportType, setExportType] = useState('png'); 
  const [trickCuriosity, setTrickCuriosity] = useState({ key: '', text: '' });
  
  const barcodeRef = useRef(null);

  // DESIGN STATE
  const [design, setDesign] = useState({
    width: 2,
    height: 100,
    displayValue: true,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10,
    fontSize: 20
  });

  // --- GENERATION ENGINE ---
  useEffect(() => {
    if (barcodeRef.current && text) {
      try {
        JsBarcode(barcodeRef.current, text, {
          format: format,
          width: design.width,
          height: design.height,
          displayValue: design.displayValue,
          background: design.background,
          lineColor: design.lineColor,
          margin: design.margin,
          fontSize: design.fontSize,
          valid: (valid) => setIsValid(valid)
        });
      } catch (e) {
        setIsValid(false);
      }
    }
  }, [text, format, design]);

  // --- HANDLERS ---
  const handleRandomize = () => setText(generateRandomData(format));

  const openDownloadModal = (type) => {
      setExportType(type);
      setExportFilename(`barcode_${text}`.substring(0, 20));
      const keys = Object.keys(t.enc);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setTrickCuriosity({ key: t.enc[randomKey].key, text: t.enc[randomKey].text });
      setShowDownloadModal(true);
  };

  const handleExport = () => {
    if (exportType === 'svg') {
        const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
        const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportFilename}.svg`;
        a.click();
    } else {
        const svg = barcodeRef.current;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.fillStyle = design.background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = pngFile;
            a.download = `${exportFilename}.png`;
            a.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
    setShowDownloadModal(false);
  };

  const handlePrint = () => {
      const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
      const win = window.open('', '', 'width=600,height=400');
      win.document.write(`<html><body style="display:flex;justify-content:center;align-items:center;height:100vh;">${svgData}<script>window.print();window.close();</script></body></html>`);
      win.document.close();
  };

  const switchToSupport = () => {
      setShowDownloadModal(false);
      setShowSupportModal(true);
  };

  // --- REUSABLE DESIGN CONTROLS (JSX) ---
  const DesignControls = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.labels.lineColor}</label>
                <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <input type="color" value={design.lineColor} onChange={e => setDesign({...design, lineColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"/>
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.labels.background}</label>
                <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                    <input type="color" value={design.background} onChange={e => setDesign({...design, background: e.target.value})} className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"/>
                </div>
            </div>
        </div>

        <hr className="border-white/5" />

        <div className="space-y-6">
            <Slider label={t.labels.width} value={design.width} min={1} max={4} onChange={v => setDesign({...design, width: v})} />
            <Slider label={t.labels.height} value={design.height} min={30} max={200} step={10} onChange={v => setDesign({...design, height: v})} unit="px" />
            <Slider label={t.labels.margin} value={design.margin} min={0} max={50} step={5} onChange={v => setDesign({...design, margin: v})} unit="px" />
        </div>

        <hr className="border-white/5" />

        <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-cyan-500/30 transition-colors">
            <div className="flex items-center gap-3">
                <Type size={16} className="text-zinc-400" />
                <span className="text-xs font-bold text-zinc-300 uppercase">{t.labels.showText}</span>
            </div>
            <input type="checkbox" checked={design.displayValue} onChange={(e) => setDesign({...design, displayValue: e.target.checked})} className="w-5 h-5 accent-cyan-500 bg-zinc-800 border-zinc-700 rounded"/>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col lg:flex-row lg:overflow-hidden selection:bg-cyan-500/30">
      
      {/* --- LEFT SIDEBAR (FORMATS) --- */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 shrink-0">
        <div className="mb-6 px-2 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-cyan-600/20 rounded-lg flex items-center justify-center transition-colors group">
            <ArrowLeft size={18} className="text-zinc-400 group-hover:text-cyan-400" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] leading-none mt-1">{t.appName}</span>
          </div>
        </div>

        <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 border border-zinc-800">
          <button onClick={() => setLang('it')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'it' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>IT</button>
          <button onClick={() => setLang('en')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>EN</button>
        </div>

        <div className="space-y-1 lg:block grid grid-cols-2 gap-2 lg:gap-0">
            <div className="col-span-2 lg:col-span-1">
                 <SectionTitle icon={ScanLine} title={t.nav.format} />
            </div>
            {['CODE128', 'EAN13', 'UPC', 'CODE39', 'ITF14', 'MSI'].map((fmt) => (
                <NavItem key={fmt} active={format === fmt} onClick={() => setFormat(fmt)} label={fmt} />
            ))}
        </div>

        <div className="mt-6 lg:mt-auto space-y-1 grid grid-cols-2 lg:block gap-2 lg:gap-0">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group"><Info size={16} className="group-hover:text-cyan-400"/> {t.infoBtn}</button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group"><Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.supportBtn}</button>
        </div>
      </aside>

      {/* --- MAIN WORKSPACE --- */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50 h-auto lg:h-full lg:overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{t.appName} <span className="text-cyan-500">/</span> {format}</h2>
            <div className="flex items-center gap-3">
                 <button onClick={handleRandomize} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-white transition-all" title={t.actions.random}>
                    <Dices size={18} />
                 </button>
                 <button onClick={handlePrint} className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 text-zinc-400 hover:text-white transition-all" title={t.actions.print}>
                    <Printer size={18} />
                 </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-visible lg:overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
                
                {/* 1. INPUT CARD */}
                <div className="w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-sm relative group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Type size={20} className="text-cyan-500"/> {t.labels.content}</h3>
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${isValid ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {isValid ? 'VALID' : 'INVALID'}
                        </span>
                    </div>
                    <input 
                        type="text" 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        placeholder={format === 'EAN13' ? '123456789012' : 'DATA...'}
                        className={`w-full bg-zinc-900 border rounded-xl p-4 text-xl text-white font-mono tracking-wider outline-none transition-colors ${isValid ? 'border-zinc-800 focus:border-cyan-500' : 'border-red-500/50 text-red-400'}`}
                    />
                    <div className="mt-4 p-3 bg-cyan-900/10 border border-cyan-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-cyan-500 shrink-0 mt-0.5" size={16} />
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase block tracking-widest">{format} INFO</span>
                            <p className="text-xs text-cyan-200/70 leading-relaxed">{t.rules[format]}</p>
                        </div>
                    </div>
                </div>

                {/* 2. PREVIEW CARD */}
                <div className="w-full flex flex-col items-center justify-center pt-4">
                    <div className="bg-white p-4 lg:p-12 rounded-[2.5rem] shadow-2xl border-4 border-zinc-800 relative min-h-[200px] lg:min-h-[300px] w-full flex items-center justify-center transition-transform hover:scale-[1.01] overflow-hidden">
                         <div className={isValid ? "block w-full flex justify-center" : "hidden opacity-0"}>
                            <svg ref={barcodeRef} className="max-w-full h-auto"></svg>
                         </div>
                    </div>
                    <div className="flex gap-4 mt-8 w-full md:w-auto">
                        <button onClick={() => openDownloadModal('png')} disabled={!isValid} className="flex-1 md:flex-none px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-cyan-500 text-white rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"><ImageIcon size={16} /> {t.actions.png}</button>
                        <button onClick={() => openDownloadModal('svg')} disabled={!isValid} className="flex-1 md:flex-none px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"><FileCode size={16} /> {t.actions.svg}</button>
                    </div>
                </div>

                {/* 3. MOBILE ONLY DESIGN CONTROLS (NEW LOCATION) */}
                <div className="lg:hidden w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-sm mt-4">
                     <SectionTitle icon={Settings} title="Appearance" />
                     <DesignControls />
                </div>

                {/* 4. SEO CONTENT */}
                <div className="mt-12 pt-12 border-t border-white/5 text-zinc-400">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen size={20} className="text-cyan-500"/>
                        <h2 className="text-2xl font-black text-white tracking-tight">{t.seo.title}</h2>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="leading-relaxed mb-8 text-zinc-300">{t.seo.intro}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                             <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-cyan-500"/> {t.seo.h1}</h3>
                                <p className="mb-4 text-xs leading-relaxed">{t.seo.p1}</p>
                                <ul className="space-y-3">{t.seo.ul1.map((item, idx) => (<li key={idx} className="flex items-start gap-2 text-xs leading-relaxed"><div className="min-w-[4px] h-[4px] mt-1.5 rounded-full bg-cyan-500/50"></div><span>{item.includes('**') ? <><strong className="text-zinc-200">{item.split('**')[1]}</strong>{item.split('**')[2]}</> : item}</span></li>))}</ul>
                             </div>
                             <div className="space-y-6">
                                <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Layers size={18} className="text-cyan-500"/> {t.seo.h2}</h3><p className="text-xs leading-relaxed">{t.seo.p2}</p></div>
                                <div className="bg-cyan-900/10 p-6 rounded-2xl border border-cyan-500/10"><h3 className="text-lg font-bold text-cyan-400 mb-2">{t.seo.h3}</h3><p className="text-xs leading-relaxed text-cyan-100/70">{t.seo.p3}</p></div>
                             </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* --- RIGHT SIDEBAR (DESIGN - DESKTOP ONLY) --- */}
      <aside className="hidden lg:flex lg:w-80 border-l border-white/5 bg-zinc-950 p-6 flex-col shrink-0">
        <SectionTitle icon={Settings} title="Appearance" />
        <DesignControls />
      </aside>

      {/* --- MODALS --- */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-cyan-600/30 rounded-[2rem] w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-500"><Wand2 size={24}/></div>
                <div><h3 className="text-xl font-black text-white uppercase">{t.modals.ready}</h3><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{exportType.toUpperCase()} FORMAT</p></div>
                <button onClick={() => setShowDownloadModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            <input type="text" value={exportFilename} onChange={(e) => setExportFilename(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white mb-8 outline-none focus:border-cyan-500 font-bold shadow-inner" />
            <div className="bg-cyan-900/10 border border-cyan-600/10 rounded-2xl p-5 mb-6 flex gap-4"><Sparkles className="text-cyan-500 shrink-0 mt-0.5" size={18} /><div className="space-y-1"><span className="text-[10px] font-black text-cyan-400 uppercase block tracking-widest">{t.modals.didYouKnow} ({trickCuriosity.key})</span><p className="text-xs text-gray-300 italic leading-relaxed">{trickCuriosity.text}</p></div></div>
            <div className="mb-6 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-center group hover:bg-green-500/20 transition-all cursor-pointer" onClick={switchToSupport}><button className="text-sm uppercase font-black text-green-500 group-hover:text-green-400 flex items-center gap-3 transition-colors"><Heart size={18} className="animate-pulse" /> {t.supportBtn}</button></div>
            <div className="flex gap-3"><button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 text-zinc-500 font-bold uppercase text-xs hover:text-zinc-300 hover:bg-white/5 rounded-xl transition-colors">{t.modals.cancel}</button><button onClick={handleExport} className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black uppercase text-xs shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2"><Download size={16}/> {t.actions.download}</button></div>
          </div>
        </div>
      )}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-full max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6"><div><div className="flex items-center gap-2 mb-2 text-cyan-500 font-bold uppercase text-xs tracking-wider"><Heart size={14} /> Mission</div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-cyan-500/20 pl-4">Digitrik Pro Barcode Studio generates vector-quality barcodes directly in your browser. No server uploads.</p></div></div>
          </div>
        </div>
      )}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-full max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.supportBtn}</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2"><div className="p-8 border-r border-white/5 space-y-4"><h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donateTitle}</h4><div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div></div><div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-cyan-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> Support Us</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">Watch Ad (Soon)</button></div></div>
          </div>
        </div>
      )}
    </div>
  );
}