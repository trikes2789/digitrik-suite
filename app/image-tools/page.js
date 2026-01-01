'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Image as ImageIcon, Sliders, Layers, Download, Info, Heart, 
  ArrowLeft, UploadCloud, X, Check, Search, Smartphone, Monitor, 
  Maximize, Type, Grid3X3, Zap, ShieldCheck, Mail, Coffee, CreditCard, 
  PlayCircle, Globe, User, Code2, Sparkles, RefreshCcw, Lock
} from 'lucide-react';
import Link from 'next/link';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  it: {
    appName: "IMAGE STUDIO",
    nav: {
      compress: "Compressore",
      resize: "Ridimensiona",
      convert: "Convertitore",
      watermark: "Watermark"
    },
    actions: {
      upload: "Carica Immagini",
      drop: "Trascina qui le tue immagini",
      dropSub: "Supportiamo JPG, PNG, WEBP. Max 20MB.",
      download: "Scarica Immagine",
      downloadAll: "Scarica ZIP (Coming Soon)",
      compare: "Confronta",
      reset: "Reset"
    },
    controls: {
      quality: "Qualità Compressione",
      format: "Formato Output",
      width: "Larghezza (px)",
      height: "Altezza (px)",
      maintainRatio: "Mantieni Proporzioni",
      text: "Testo Watermark",
      opacity: "Opacità",
      color: "Colore Testo",
      tiled: "Ripeti a Mosaico",
      estimated: "Peso Stimato:"
    },
    info: "INFO & CONTATTI",
    support: "SUPPORTA IL PROGETTO",
    modals: {
      aboutTitle: "La nostra Mission",
      aboutText: "Digitrik Pro Image Studio porta la potenza di editing desktop nel tuo browser. Nessun upload, nessun server, privacy totale.",
      contactTitle: "Contattaci",
      privacyTitle: "Privacy First",
      privacyText: "Le immagini vengono elaborate pixel per pixel sul tuo dispositivo. Nulla viene salvato online.",
      rights: "Tutti i diritti riservati.",
      supportTitle: "Sostieni Digitrik",
      supportSub: "Aiutaci a mantenere i server spenti e il codice aperto.",
      donateTitle: "Offrici un caffè",
      donateDesc: "Sviluppare tool gratuiti richiede tempo e caffeina.",
      adTitle: "Guarda uno Spot",
      adDesc: "30 secondi per supportarci gratuitamente.",
      adButton: "Coming Soon"
    }
  },
  en: {
    appName: "IMAGE STUDIO",
    nav: {
      compress: "Compressor",
      resize: "Resize & Crop",
      convert: "Converter",
      watermark: "Watermark"
    },
    actions: {
      upload: "Upload Images",
      drop: "Drop images here",
      dropSub: "We support JPG, PNG, WEBP. Max 20MB.",
      download: "Download Image",
      downloadAll: "Download ZIP (Coming Soon)",
      compare: "Compare",
      reset: "Reset"
    },
    controls: {
      quality: "Compression Quality",
      format: "Output Format",
      width: "Width (px)",
      height: "Height (px)",
      maintainRatio: "Maintain Aspect Ratio",
      text: "Watermark Text",
      opacity: "Opacity",
      color: "Text Color",
      tiled: "Tiled Pattern",
      estimated: "Est. Size:"
    },
    info: "INFO & CONTACTS",
    support: "SUPPORT PROJECT",
    modals: {
      aboutTitle: "Our Mission",
      aboutText: "Digitrik Pro Image Studio brings desktop editing power to your browser. No uploads, no servers, total privacy.",
      contactTitle: "Contact Us",
      privacyTitle: "Privacy First",
      privacyText: "Images are processed pixel-by-pixel on your device. Nothing is saved online.",
      rights: "All rights reserved.",
      supportTitle: "Support Digitrik",
      supportSub: "Help us keep servers off and code open.",
      donateTitle: "Buy us a coffee",
      donateDesc: "Developing free tools requires time and caffeine.",
      adTitle: "Watch an Ad",
      adDesc: "30 seconds to support us for free.",
      adButton: "Coming Soon"
    }
  }
};

// --- COMPONENTS ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-zinc-500 uppercase tracking-widest text-[10px] font-bold px-2">
    <Icon size={14} className="text-blue-500" />
    {title}
  </div>
);

const NavItem = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 border ${active ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'border-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
  >
    <Icon size={18} />
    <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
  </button>
);

const Slider = ({ label, value, min, max, step=1, onChange, unit="" }) => (
  <div className="mb-4">
    <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-2">
      <span>{label}</span>
      <span className="text-blue-400">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
    />
  </div>
);

export default function ImageStudio() {
  const [lang, setLang] = useState('it');
  const t = TRANSLATIONS[lang];
  
  // STATE
  const [activeTab, setActiveTab] = useState('compress');
  const [originalFile, setOriginalFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // Processed image URL
  const [originalUrl, setOriginalUrl] = useState(null); // Original image URL for comparison
  const [fileStats, setFileStats] = useState({ original: 0, processed: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  
  // SETTINGS
  const [settings, setSettings] = useState({
    quality: 0.8,
    format: 'image/jpeg',
    width: 0,
    height: 0,
    maintainRatio: true,
    watermarkText: '',
    watermarkOpacity: 0.5,
    watermarkTiled: false,
    watermarkColor: '#ffffff'
  });

  // MODALS
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // UTILS
  const canvasRef = useRef(null);

  // --- IMAGE ENGINE (CANVAS) ---
  const processImage = useCallback(async () => {
    if (!originalFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = URL.createObjectURL(originalFile);
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 1. Resize Logic
    let newWidth = settings.width || img.width;
    let newHeight = settings.height || img.height;
    
    if (settings.maintainRatio && settings.width && !settings.height) {
        newHeight = (img.height / img.width) * settings.width;
    } else if (settings.maintainRatio && !settings.width && settings.height) {
        newWidth = (img.width / img.height) * settings.height;
    }

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw Base Image
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    // 2. Watermark Logic
    if (settings.watermarkText) {
        const fontSize = Math.max(20, newWidth * 0.05); // Responsive font size
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = settings.watermarkColor;
        ctx.globalAlpha = settings.watermarkOpacity;
        
        if (settings.watermarkTiled) {
            ctx.rotate(-Math.PI / 4);
            const diag = Math.sqrt(newWidth*newWidth + newHeight*newHeight);
            for (let y = -diag; y < diag * 2; y += fontSize * 4) {
                for (let x = -diag; x < diag * 2; x += ctx.measureText(settings.watermarkText).width + 100) {
                    ctx.fillText(settings.watermarkText, x, y);
                }
            }
            ctx.rotate(Math.PI / 4); // Reset rotation
        } else {
            // Center Watermark
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(settings.watermarkText, newWidth / 2, newHeight / 2);
        }
    }

    // 3. Export & Compress
    canvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setFileStats(prev => ({ ...prev, processed: blob.size }));
            setIsProcessing(false);
        }
    }, settings.format, settings.quality);

  }, [originalFile, settings]);

  // Trigger processing on settings change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
        if (originalFile) processImage();
    }, 300);
    return () => clearTimeout(timer);
  }, [settings, originalFile, processImage]);

  // File Drop Handler
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      
      const img = new Image();
      img.onload = () => {
          setSettings(prev => ({ ...prev, width: img.width, height: img.height }));
          setFileStats({ original: file.size, processed: file.size }); // Initial
      };
      img.src = url;
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []}, 
    multiple: false 
  });

  // Helpers
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    if (previewUrl) {
        const a = document.createElement('a');
        a.href = previewUrl;
        const ext = settings.format.split('/')[1];
        a.download = `digitrik_edit.${ext}`;
        a.click();
    }
  };

  // --- SPLIT VIEW COMPONENT ---
  const [splitPos, setSplitPos] = useState(50);
  const splitRef = useRef(null);

  const handleSplitMove = (e) => {
      if(!splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const w = rect.width;
      const pos = Math.max(0, Math.min(100, (x / w) * 100));
      setSplitPos(pos);
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex overflow-hidden selection:bg-blue-500/30">
      
      {/* --- SIDEBAR LEFT (NAVIGATION) --- */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20">
        <div className="mb-8 px-2 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-colors group">
            <ArrowLeft size={18} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] leading-none mt-1">IMAGE STUDIO</span>
          </div>
        </div>

        {/* Lang Switch */}
        <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 border border-zinc-800">
          <button onClick={() => setLang('it')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'it' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>IT</button>
          <button onClick={() => setLang('en')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>EN</button>
        </div>

        <nav className="flex-1 space-y-1">
            <SectionTitle icon={Sliders} title="Tools" />
            <NavItem active={activeTab === 'compress'} onClick={() => setActiveTab('compress')} icon={Zap} label={t.nav.compress} />
            <NavItem active={activeTab === 'resize'} onClick={() => setActiveTab('resize')} icon={Maximize} label={t.nav.resize} />
            <NavItem active={activeTab === 'convert'} onClick={() => setActiveTab('convert')} icon={RefreshCcw} label={t.nav.convert} />
            <NavItem active={activeTab === 'watermark'} onClick={() => setActiveTab('watermark')} icon={Type} label={t.nav.watermark} />
        </nav>

        {/* Footer Buttons */}
        <div className="mt-auto space-y-1">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group">
                <Info size={16} className="group-hover:text-blue-400 transition-colors"/> {t.info}
            </button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group">
                <Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.support}
            </button>
        </div>
      </aside>

      {/* --- CENTER MAIN (WORKSPACE) --- */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{t.appName} <span className="text-blue-500">/</span> {t.nav[activeTab]}</h2>
            {originalFile && (
                <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
                    <span>ORIGINAL: <span className="text-zinc-300">{formatSize(fileStats.original)}</span></span>
                    <span>NEW: <span className="text-green-400">{formatSize(fileStats.processed)}</span></span>
                    <span className="text-blue-500 font-bold">
                        {fileStats.original > 0 ? Math.round((1 - fileStats.processed/fileStats.original) * 100) : 0}% SAVED
                    </span>
                </div>
            )}
        </header>

        <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
            {!originalFile ? (
                <div {...getRootProps()} className={`w-full max-w-2xl h-96 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}`}>
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                        <UploadCloud size={40} className="text-blue-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.actions.drop}</h3>
                    <p className="text-sm text-zinc-500">{t.actions.dropSub}</p>
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col">
                    {/* SPLIT VIEW COMPARATOR */}
                    <div 
                        ref={splitRef}
                        onMouseMove={handleSplitMove}
                        className="relative w-full flex-1 bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden cursor-col-resize group shadow-2xl"
                    >
                        {/* 1. Base Image (Original) */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <img src={originalUrl} className="max-w-full max-h-full object-contain opacity-50 blur-sm grayscale" />
                            <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-white">ORIGINAL (Reference)</div>
                        </div>

                        {/* 2. Top Image (Processed) - Clipped */}
                        <div 
                            className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden"
                            style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}
                        >
                            <div className="w-full h-full flex items-center justify-center p-4 bg-[url('/transparent-grid.png')]"> 
                                {/* ^ Transparent grid background placeholder logic */}
                                <img src={previewUrl} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="absolute top-4 right-4 bg-blue-600 px-2 py-1 rounded text-[10px] font-bold text-white">PROCESSED</div>
                        </div>

                        {/* 3. Slider Handle */}
                        <div 
                            className="absolute top-0 bottom-0 w-1 bg-blue-500 cursor-col-resize z-20 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                            style={{ left: `${splitPos}%` }}
                        >
                            <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600">
                                <Code2 size={14} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="h-20 mt-6 flex items-center justify-between">
                        <button onClick={() => setOriginalFile(null)} className="px-6 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-xs uppercase transition-all">
                            {t.actions.reset}
                        </button>
                        <button onClick={downloadImage} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all">
                            <Download size={18} /> {t.actions.download}
                        </button>
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* --- SIDEBAR RIGHT (CONTROLS) --- */}
      <aside className="w-80 border-l border-white/5 bg-zinc-950 p-6 flex flex-col overflow-y-auto">
        {originalFile ? (
            <div className="animate-in slide-in-from-right-4 fade-in">
                <SectionTitle icon={Sliders} title={t.nav[activeTab]} />
                
                {/* GLOBAL: FORMAT SELECTOR */}
                <div className="mb-6">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.format}</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['jpeg', 'png', 'webp'].map(fmt => (
                            <button 
                                key={fmt}
                                onClick={() => setSettings({...settings, format: `image/${fmt}`})}
                                className={`py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${settings.format.includes(fmt) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* TAB: COMPRESS */}
                {activeTab === 'compress' && (
                    <div className="space-y-6">
                        <Slider 
                            label={t.controls.quality} 
                            value={Math.round(settings.quality * 100)} 
                            min={1} max={100} 
                            onChange={(v) => setSettings({...settings, quality: v/100})} 
                            unit="%" 
                        />
                        <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1">
                                <Zap size={14} /> Smart Compression
                            </div>
                            <p className="text-[10px] text-blue-200/60 leading-relaxed">
                                Automatically removes metadata (EXIF) to reduce size and protect privacy.
                            </p>
                        </div>
                    </div>
                )}

                {/* TAB: RESIZE */}
                {activeTab === 'resize' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">{t.controls.width}</label>
                            <input 
                                type="number" 
                                value={settings.width} 
                                onChange={(e) => setSettings({...settings, width: parseInt(e.target.value)})} 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">{t.controls.height}</label>
                            <input 
                                type="number" 
                                value={settings.height} 
                                onChange={(e) => setSettings({...settings, height: parseInt(e.target.value)})} 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={settings.maintainRatio} 
                                onChange={(e) => setSettings({...settings, maintainRatio: e.target.checked})}
                                className="accent-blue-500"
                            />
                            <span className="text-xs text-zinc-400">{t.controls.maintainRatio}</span>
                        </div>
                    </div>
                )}

                {/* TAB: WATERMARK */}
                {activeTab === 'watermark' && (
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            placeholder={t.controls.text}
                            value={settings.watermarkText} 
                            onChange={(e) => setSettings({...settings, watermarkText: e.target.value})} 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-white"
                        />
                        <Slider 
                            label={t.controls.opacity} 
                            value={Math.round(settings.watermarkOpacity * 100)} 
                            min={0} max={100} 
                            onChange={(v) => setSettings({...settings, watermarkOpacity: v/100})} 
                            unit="%" 
                        />
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={settings.watermarkColor} 
                                onChange={(e) => setSettings({...settings, watermarkColor: e.target.value})}
                                className="h-8 w-8 bg-transparent border-0 rounded cursor-pointer"
                            />
                            <span className="text-xs text-zinc-400">{t.controls.color}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox" 
                                checked={settings.watermarkTiled} 
                                onChange={(e) => setSettings({...settings, watermarkTiled: e.target.checked})}
                                className="accent-blue-500"
                            />
                            <span className="text-xs text-zinc-400">{t.controls.tiled}</span>
                        </div>
                    </div>
                )}

            </div>
        ) : (
            <div className="h-full flex items-center justify-center text-center p-6 opacity-30">
                <div>
                    <ImageIcon size={48} className="mx-auto mb-4 text-zinc-500" />
                    <p className="text-xs text-zinc-400">Select an image to activate controls</p>
                </div>
            </div>
        )}
      </aside>

      {/* --- INFO MODAL (STANDARD) --- */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3">
               <div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div>
               <div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div>
               <button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
                <div><div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase text-xs tracking-wider"><Heart size={14} /> {t.modals.aboutTitle}</div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">{t.modals.aboutText}</p></div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/30 transition-colors"><div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold uppercase text-xs tracking-wider"><Mail size={14} /> {t.modals.contactTitle}</div><a href="mailto:trichesir@gmail.com" className="text-blue-400 hover:text-blue-300 font-mono text-sm block">trichesir@gmail.com</a></div>
                <div className="bg-green-900/10 rounded-xl p-4 border border-green-500/20 flex items-start gap-4"><ShieldCheck size={24} className="text-green-500 shrink-0 mt-1" /><div><h4 className="text-green-500 font-bold uppercase text-xs tracking-wider mb-1">{t.modals.privacyTitle}</h4><p className="text-[11px] text-green-200/70 leading-relaxed">{t.modals.privacyText}</p></div></div>
            </div>
            <div className="p-4 bg-zinc-950 text-center border-t border-white/5"><p className="text-[10px] text-zinc-600 uppercase tracking-widest">© 2024 DigitrikPro Team. {t.modals.rights}</p></div>
          </div>
        </div>
      )}

      {/* --- SUPPORT MODAL (STANDARD) --- */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3">
               <div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div>
               <div><h3 className="text-xl font-black italic text-white uppercase">{t.support}</h3><p className="text-[11px] text-gray-500 font-bold uppercase">{t.modals.supportSub}</p></div>
               <button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donateTitle}</h4>
                    <div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div>
                </div>
                <div className="p-8 space-y-4 bg-zinc-950/30">
                    <h4 className="text-blue-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> {t.modals.adTitle}</h4>
                    <button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">{t.modals.adButton}</button>
                </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}