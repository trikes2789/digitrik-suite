'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { 
  ScanLine, ArrowLeft, Info, Heart, Download, Settings, 
  Palette, Check, X, CreditCard, PlayCircle, Coffee, 
  Sparkles, Wand2, ShieldCheck, Mail, Sliders, Type,
  Maximize, Minimize, Layout
} from 'lucide-react';
import Link from 'next/link';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appName: "BARCODE PRO",
    nav: {
      standard: "Standard (128)",
      retail: "Retail (EAN/UPC)",
      pharma: "Pharmacode"
    },
    labels: {
      content: "Barcode Content",
      format: "Barcode Format",
      width: "Bar Width",
      height: "Height",
      margin: "Margin",
      background: "Background",
      lineColor: "Line Color",
      showText: "Show Text Number",
      textAlign: "Text Align",
      fontSize: "Font Size"
    },
    formats: {
      CODE128: "Code 128 (Universal)",
      EAN13: "EAN-13 (Retail EU)",
      UPC: "UPC (Retail US)",
      CODE39: "Code 39 (Logistics)",
      ITF14: "ITF-14 (Shipping boxes)",
      MSI: "MSI (Warehouse)"
    },
    actions: {
      download: "Download PNG",
      downloadNow: "Download Now"
    },
    infoBtn: "INFO & CONTACTS",
    supportBtn: "SUPPORT PROJECT",
    modals: {
      ready: "Ready for Download",
      chooseName: "File Name",
      didYouKnow: "Did you know?",
      cancel: "Cancel",
      donateTitle: "Buy us a coffee",
      adTitle: "Support Us",
      adButton: "Coming Soon"
    },
    enc: {
      EAN: { text: "EAN-13 is the standard barcode for all retail products in Europe. The first digits indicate the country of origin.", key: "Retail" },
      LASER: { text: "Barcodes are read by measuring the reflection of laser light from black bars (absorb) and white spaces (reflect).", key: "Tech" },
      FIRST: { text: "The first product ever scanned was a packet of Wrigley's chewing gum in 1974.", key: "History" }
    }
  },
  it: {
    appName: "BARCODE PRO",
    nav: {
      standard: "Standard (128)",
      retail: "Retail (EAN/UPC)",
      pharma: "Farmaceutico"
    },
    labels: {
      content: "Contenuto Barcode",
      format: "Formato",
      width: "Larghezza Barre",
      height: "Altezza",
      margin: "Margine",
      background: "Sfondo",
      lineColor: "Colore Linee",
      showText: "Mostra Numeri",
      textAlign: "Allineamento Testo",
      fontSize: "Dimensione Testo"
    },
    formats: {
      CODE128: "Code 128 (Universale)",
      EAN13: "EAN-13 (Retail EU)",
      UPC: "UPC (Retail US)",
      CODE39: "Code 39 (Logistica)",
      ITF14: "ITF-14 (Scatole)",
      MSI: "MSI (Magazzino)"
    },
    actions: {
      download: "Scarica PNG",
      downloadNow: "Scarica Ora"
    },
    infoBtn: "INFO & CONTATTI",
    supportBtn: "SUPPORTA IL PROGETTO",
    modals: {
      ready: "Pronto per il Download",
      chooseName: "Nome File",
      didYouKnow: "Lo sapevi?",
      cancel: "Annulla",
      donateTitle: "Offrici un caffè",
      adTitle: "Supportaci",
      adButton: "Coming Soon"
    },
    enc: {
      EAN: { text: "L'EAN-13 è lo standard per i prodotti in Europa. Le prime cifre indicano spesso il paese di provenienza.", key: "Retail" },
      LASER: { text: "I barcode vengono letti misurando il riflesso del laser: le barre nere assorbono la luce, gli spazi bianchi la riflettono.", key: "Tech" },
      FIRST: { text: "Il primo prodotto scansionato nella storia fu un pacchetto di gomme Wrigley's nel 1974.", key: "Storia" }
    }
  }
};

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-zinc-500 uppercase tracking-widest text-[10px] font-bold px-2">
    <Icon size={14} className="text-cyan-500" />
    {title}
  </div>
);

export default function BarcodeGenerator() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];

  // STATE
  const [text, setText] = useState('DIGITRIK-PRO');
  const [format, setFormat] = useState('CODE128');
  const [isValid, setIsValid] = useState(true);
  
  // DESIGN STATE
  const [design, setDesign] = useState({
    width: 2,
    height: 100,
    displayValue: true,
    fontOptions: "bold",
    font: "monospace",
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: 20,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10
  });

  const canvasRef = useRef(null);
  const [barcodeUrl, setBarcodeUrl] = useState(null);

  // MODALS
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("");
  const [trickCuriosity, setTrickCuriosity] = useState({ key: '', text: '' });

  // GENERATE BARCODE
  useEffect(() => {
    try {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, text, {
            format: format,
            width: design.width,
            height: design.height,
            displayValue: design.displayValue,
            fontOptions: design.fontOptions,
            font: design.font,
            textAlign: design.textAlign,
            textPosition: design.textPosition,
            textMargin: design.textMargin,
            fontSize: design.fontSize,
            background: design.background,
            lineColor: design.lineColor,
            margin: design.margin,
            valid: (valid) => {
                setIsValid(valid);
                if(valid) {
                    setBarcodeUrl(canvas.toDataURL("image/png"));
                } else {
                    setBarcodeUrl(null);
                }
            }
        });
    } catch (e) {
        setIsValid(false);
        setBarcodeUrl(null);
    }
  }, [text, format, design]);


  const handleDownloadClick = () => {
    if (!barcodeUrl) return;
    setExportFilename(`barcode_${text}`.substring(0, 20));
    const keys = Object.keys(t.enc);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setTrickCuriosity({ key: t.enc[randomKey].key, text: t.enc[randomKey].text });
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    if (barcodeUrl) {
        const a = document.createElement('a');
        a.href = barcodeUrl;
        a.download = `${exportFilename}.png`;
        a.click();
    }
    setShowDownloadModal(false);
  };


  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex overflow-hidden selection:bg-cyan-500/30">
      
      {/* SIDEBAR LEFT */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 overflow-y-auto">
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

        <div className="space-y-6">
            <SectionTitle icon={ScanLine} title="Barcode Settings" />
            
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.labels.format}</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-white outline-none focus:border-cyan-500">
                    <option value="CODE128">{t.formats.CODE128}</option>
                    <option value="EAN13">{t.formats.EAN13}</option>
                    <option value="UPC">{t.formats.UPC}</option>
                    <option value="CODE39">{t.formats.CODE39}</option>
                    <option value="ITF14">{t.formats.ITF14}</option>
                    <option value="msi">{t.formats.MSI}</option>
                </select>
            </div>

            <div className="p-4 bg-cyan-900/10 rounded-xl border border-cyan-500/20">
                <p className="text-[10px] text-cyan-300 leading-relaxed italic">
                    {format === 'EAN13' ? "Requires 12 or 13 digits." : 
                     format === 'UPC' ? "Requires 11 or 12 digits." : 
                     "Supports text and numbers."}
                </p>
            </div>
        </div>

        <div className="mt-auto space-y-1">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group"><Info size={16} className="group-hover:text-cyan-400"/> {t.infoBtn}</button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group"><Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.supportBtn}</button>
        </div>
      </aside>

      {/* CENTER WORKSPACE */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{t.appName} <span className="text-cyan-500">/</span> {format}</h2>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
                
                {/* 1. INPUT */}
                <div className="w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Type size={20} className="text-cyan-500"/> {t.labels.content}</h3>
                    <input 
                        type="text" 
                        value={text} 
                        onChange={e => setText(e.target.value)} 
                        placeholder="12345678..." 
                        className={`w-full bg-zinc-900 border rounded-xl p-4 text-xl text-white font-mono tracking-wider outline-none transition-colors ${isValid ? 'border-zinc-800 focus:border-cyan-500' : 'border-red-500/50 text-red-400'}`}
                    />
                    {!isValid && <p className="text-red-500 text-xs mt-2 font-bold uppercase">Invalid content for {format}</p>}
                </div>

                {/* 2. PREVIEW */}
                <div className="w-full flex flex-col items-center justify-center pt-4">
                    <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border-4 border-zinc-800 relative group transition-transform duration-500 hover:scale-[1.01] min-h-[250px] flex items-center justify-center overflow-hidden">
                        {isValid && barcodeUrl ? (
                            <img src={barcodeUrl} className="max-w-full h-auto" />
                        ) : (
                            <div className="text-zinc-300 font-bold uppercase text-xs flex flex-col items-center gap-2">
                                <ScanLine size={32} />
                                Invalid Data
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleDownloadClick} 
                        disabled={!isValid}
                        className="mt-8 px-10 py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-cyan-900/30 flex items-center gap-3 transition-all hover:-translate-y-1"
                    >
                        <Download size={18} /> {t.actions.download}
                    </button>
                </div>

            </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR (DESIGN) */}
      <aside className="w-80 border-l border-white/5 bg-zinc-950 p-6 flex flex-col overflow-y-auto">
        <SectionTitle icon={Palette} title="Appearance" />
        
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            {/* Colors */}
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

            {/* Sliders */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-zinc-500 uppercase">{t.labels.width}</label><span className="text-[10px] text-cyan-500">{design.width}</span></div>
                    <input type="range" min="1" max="4" step="1" value={design.width} onChange={(e) => setDesign({...design, width: parseInt(e.target.value)})} className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-cyan-500"/>
                </div>
                <div>
                    <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-zinc-500 uppercase">{t.labels.height}</label><span className="text-[10px] text-cyan-500">{design.height}px</span></div>
                    <input type="range" min="30" max="200" step="10" value={design.height} onChange={(e) => setDesign({...design, height: parseInt(e.target.value)})} className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-cyan-500"/>
                </div>
                <div>
                    <div className="flex justify-between mb-1"><label className="text-[10px] font-bold text-zinc-500 uppercase">{t.labels.margin}</label><span className="text-[10px] text-cyan-500">{design.margin}px</span></div>
                    <input type="range" min="0" max="50" step="5" value={design.margin} onChange={(e) => setDesign({...design, margin: parseInt(e.target.value)})} className="w-full h-1 bg-zinc-800 rounded-full appearance-none accent-cyan-500"/>
                </div>
            </div>

            <hr className="border-white/5" />

            {/* Text Options */}
            <div>
                 <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase">{t.labels.showText}</label>
                    <input type="checkbox" checked={design.displayValue} onChange={(e) => setDesign({...design, displayValue: e.target.checked})} className="accent-cyan-500"/>
                 </div>
                 
                 {design.displayValue && (
                     <div className="space-y-4 animate-in fade-in">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.labels.textAlign}</label>
                            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                                {['left', 'center', 'right'].map(align => (
                                    <button key={align} onClick={() => setDesign({...design, textAlign: align})} className={`flex-1 py-1 text-[10px] uppercase rounded ${design.textAlign === align ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>{align}</button>
                                ))}
                            </div>
                        </div>
                     </div>
                 )}
            </div>
        </div>
      </aside>

      {/* MODAL DOWNLOAD */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#0a0a0a] border border-cyan-600/30 rounded-[2rem] w-[90%] max-w-lg p-8 shadow-[0_0_50px_rgba(6,182,212,0.1)] relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-600/10 p-3 rounded-full text-cyan-500"><Wand2 size={24} /></div>
              <div><h3 className="text-xl font-black italic text-white uppercase tracking-wider">{t.modals.ready}</h3><p className="text-[11px] text-gray-500 font-bold uppercase">{t.modals.chooseName}</p></div>
              <button onClick={() => setShowDownloadModal(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.modals.chooseName}</label>
              <div className="relative">
                <input type="text" value={exportFilename} onChange={(e) => setExportFilename(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmDownload()} autoFocus className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white font-medium outline-none focus:border-cyan-600 transition-all shadow-inner" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold pointer-events-none">.PNG</span>
              </div>
            </div>

            <div className="bg-cyan-900/10 border border-cyan-600/10 rounded-2xl p-5 mb-6 flex gap-4">
              <Sparkles className="text-cyan-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">{t.modals.didYouKnow} ({trickCuriosity.key})</span>
                <p className="text-xs text-gray-300 italic leading-relaxed">{trickCuriosity.text}</p>
              </div>
            </div>

            <div className="mb-8 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-center group hover:bg-green-500/20 transition-all cursor-pointer" onClick={() => setShowSupportModal(true)}>
              <button className="text-sm uppercase font-black text-green-500 group-hover:text-green-400 flex items-center gap-3 transition-colors"><Heart size={18} className="animate-pulse" /> {t.supportBtn}</button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all">{t.modals.cancel}</button>
              <button onClick={confirmDownload} className="flex-1 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-cyan-900/20 transition-all flex items-center justify-center gap-2"><Check size={16} /> {t.actions.downloadNow}</button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL (Same as others) */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.supportBtn}</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donateTitle}</h4>
                    <div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div>
                </div>
                <div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-cyan-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> {t.modals.adTitle}</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">{t.modals.adButton}</button></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}