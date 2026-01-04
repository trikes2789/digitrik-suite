'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Ghost, ArrowLeft, Lock, Unlock, Upload, Download, 
  Eye, EyeOff, X, Info, Heart, Coffee, ShieldCheck, 
  Zap, Image as ImageIcon, Check, AlertTriangle,
  CreditCard, PlayCircle, Wand2, Sparkles, BookOpen, 
  HelpCircle, Layers, Fingerprint
} from 'lucide-react';
import Link from 'next/link';

// --- HELPER: Convert Text to Binary ---
const textToBinary = (text) => {
  let binary = "";
  for (let i = 0; i < text.length; i++) {
    binary += text[i].charCodeAt(0).toString(2).padStart(8, "0");
  }
  return binary + "00000000"; // Null terminator
};

// --- HELPER: Convert Binary to Text ---
const binaryToText = (binary) => {
  let text = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte === "00000000") break;
    text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
};

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    appName: "GHOST PIXEL",
    modes: { encode: "Hide Message", decode: "Reveal Secret" },
    steps: {
        upload: "1. Upload an Image",
        write: "2. Write Secret Message",
        process: "3. Encrypt & Download",
        decodeUpload: "1. Upload Secret Image",
        decodeRead: "2. Read Hidden Message"
    },
    labels: {
        secretPlaceholder: "Enter top secret text here...",
        dropzone: "Drop image or Click to Upload",
        noMessageFound: "No hidden message found in this image.",
        messageFound: "SECRET MESSAGE DETECTED:",
        downloadBtn: "Save Ghost Image",
        processing: "Processing..."
    },
    info: {
        title: "How it works",
        desc: "We use LSB (Least Significant Bit) steganography. We tweak the last bit of the pixel colors to store your text. The image looks identical to the naked eye.",
        warning: "WARNING: Use only .PNG images. Compressing this image (sending via WhatsApp or saving as JPG) will destroy the secret message."
    },
    modals: {
        ready: "Ready to Export",
        chooseName: "File Name",
        cancel: "Cancel",
        downloadNow: "Download Now",
        didYouKnow: "Did you know?",
        donateTitle: "Fuel the Revolution",
        supportBtn: "SUPPORT PROJECT",
        successTitle: "GHOST PIXEL CREATED",
        successDesc: "Your image now contains the secret data. It looks exactly like the original."
    },
    enc: {
        HIST: { key: "History", text: "The first recorded use of steganography was by Histiaeus, who shaved a slave's head, tattooed a message, waited for hair to grow back, and sent him." },
        PRINTER: { key: "Surveillance", text: "Many color laser printers secretly print tiny yellow dots on every page to identify the printer and date. Ghost Pixel doesn't." },
        WIFI: { key: "Tech", text: "You can hide data not just in images, but in audio files (MP3) and even in the timing of network packets." }
    },
    seo: {
      title: "The Ultimate Guide to Image Steganography",
      intro: "Ghost Pixel is a professional, privacy-first steganography tool that allows you to hide secret text messages inside ordinary images. Unlike encryption, which scrambles data, steganography hides the existence of the data itself.",
      h1: "How Does LSB Steganography Work?",
      p1: "LSB stands for **Least Significant Bit**. Digital images are made of pixels, and each pixel is made of 3 colors (Red, Green, Blue). Each color is a number from 0 to 255 (binary 8-bit).",
      ul1: [
        "Ghost Pixel takes your secret text and converts it into binary (0s and 1s).",
        "It then replaces the very last bit of the pixel's color value with your message bit.",
        "Since the color change is so minimal (e.g., changing Red from 255 to 254), the human eye **cannot perceive the difference**.",
        "The resulting image looks exactly like the original, but it carries a hidden payload."
      ],
      h2: "Why Must I Use PNG Format?",
      p2: "Steganography is fragile. Formats like **JPG/JPEG** use 'lossy compression', meaning they delete some pixel data to save space. If you save a Ghost Pixel image as JPG, the compression will 'clean up' the noise, effectively **erasing your secret message**. PNG is a 'lossless' format, preserving every single bit exactly as it is.",
      h3: "Privacy & Security",
      p3: "Most online tools upload your images to a server to process them. Ghost Pixel runs 100% in your browser using JavaScript. Your photos and secrets never leave your device."
    }
  },
  it: {
    appName: "GHOST PIXEL",
    modes: { encode: "Nascondi Messaggio", decode: "Rivela Segreto" },
    steps: {
        upload: "1. Carica Immagine",
        write: "2. Scrivi Messaggio Segreto",
        process: "3. Cripta e Scarica",
        decodeUpload: "1. Carica Immagine Segreta",
        decodeRead: "2. Leggi Messaggio"
    },
    labels: {
        secretPlaceholder: "Scrivi qui il testo top secret...",
        dropzone: "Trascina immagine o Clicca",
        noMessageFound: "Nessun messaggio trovato in questa immagine.",
        messageFound: "MESSAGGIO SEGRETO RILEVATO:",
        downloadBtn: "Salva Immagine Ghost",
        processing: "Elaborazione..."
    },
    info: {
        title: "Come funziona",
        desc: "Usiamo la steganografia LSB. Modifichiamo l'ultimo bit del colore dei pixel per nascondere il testo. L'immagine appare identica all'occhio umano.",
        warning: "ATTENZIONE: Usa solo immagini .PNG. La compressione (es. invio su WhatsApp o salvataggio in JPG) distruggerà il messaggio segreto."
    },
    modals: {
        ready: "Pronto per l'Export",
        chooseName: "Nome File",
        cancel: "Annulla",
        downloadNow: "Scarica Ora",
        didYouKnow: "Lo sapevi?",
        donateTitle: "Finanzia la Rivoluzione",
        supportBtn: "SUPPORTA IL PROGETTO",
        successTitle: "GHOST PIXEL CREATED",
        successDesc: "La tua immagine ora contiene i dati segreti. Appare identica all'originale."
    },
    enc: {
        HIST: { key: "Storia", text: "Il primo uso registrato di steganografia fu di Istieo: rasò la testa di uno schiavo, tatuò un messaggio, aspettò che i capelli ricrescessero e lo inviò." },
        PRINTER: { key: "Sorveglianza", text: "Molte stampanti laser stampano microscopici punti gialli invisibili su ogni foglio per tracciare data e numero di serie. Ghost Pixel no." },
        WIFI: { key: "Tech", text: "Si possono nascondere dati non solo nelle immagini, ma anche nei file audio (MP3) e persino nel ritardo dei pacchetti di rete." }
    },
    seo: {
      title: "Guida Completa alla Steganografia Digitale",
      intro: "Ghost Pixel è uno strumento professionale per la steganografia che ti permette di nascondere messaggi di testo segreti all'interno di normali immagini. A differenza della crittografia, che rende i dati illeggibili, la steganografia nasconde l'esistenza stessa dei dati.",
      h1: "Come funziona la tecnica LSB?",
      p1: "LSB sta per **Least Significant Bit** (Bit Meno Significativo). Le immagini digitali sono composte da pixel, e ogni pixel è formato da 3 canali colore (Rosso, Verde, Blu). Ogni canale è un numero da 0 a 255.",
      ul1: [
        "Ghost Pixel converte il tuo messaggio segreto in codice binario (serie di 0 e 1).",
        "Sostituisce l'ultimo bit del valore numerico del colore del pixel con un bit del tuo messaggio.",
        "Poiché la variazione di colore è infinitesimale (es. il Rosso passa da 255 a 254), l'occhio umano **non può percepire la differenza**.",
        "L'immagine risultante appare identica all'originale, ma trasporta un carico nascosto."
      ],
      h2: "Perché è obbligatorio usare il formato PNG?",
      p2: "La steganografia è fragile. Formati come **JPG/JPEG** usano una 'compressione lossy', cioè eliminano alcuni dati dell'immagine per risparmiare spazio. Se salvi un'immagine Ghost Pixel in JPG, l'algoritmo di compressione cancellerà il rumore di fondo, **distruggendo il tuo messaggio segreto**. Il PNG è un formato 'lossless' (senza perdita), che conserva i bit esattamente come sono stati scritti.",
      h3: "Privacy e Sicurezza",
      p3: "Molti strumenti online caricano le tue foto su un server per elaborarle. Ghost Pixel funziona al 100% nel tuo browser usando JavaScript. Le tue foto e i tuoi segreti non lasciano mai il tuo dispositivo."
    }
  }
};

export default function GhostPixel() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState('encode'); 
  
  // STATE
  const [imageSrc, setImageSrc] = useState(null);
  const [secretText, setSecretText] = useState("");
  const [decodedText, setDecodedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // MODAL STATE
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("ghost_pixel");
  const [trickCuriosity, setTrickCuriosity] = useState({ key: '', text: '' });

  // REFS
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- CORE LOGIC ---
  const processFile = (file) => {
      if (!file) return;
      setProcessedImage(null);
      setDecodedText("");
      const reader = new FileReader();
      reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
              setImageSrc(img);
              const canvas = canvasRef.current;
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);
              if (mode === 'decode') decodeMessage(ctx, img.width, img.height);
          };
          img.src = event.target.result;
      };
      reader.readAsDataURL(file);
  };

  const handleInputUpload = (e) => processFile(e.target.files[0]);

  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const onDrop = (e) => {
      e.preventDefault(); setIsDragging(false);
      if (e.dataTransfer.files?.length > 0) processFile(e.dataTransfer.files[0]);
  };

  // --- STEGANOGRAPHY ---
  const encodeMessage = () => {
      if (!imageSrc || !secretText) return;
      setIsProcessing(true);
      setTimeout(() => {
        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            const binaryMessage = textToBinary(secretText);
            
            if (binaryMessage.length > data.length / 4) {
                alert("Text too long!");
                setIsProcessing(false);
                return;
            }

            let digitIndex = 0;
            for (let i = 0; i < data.length; i += 4) {
                if (digitIndex < binaryMessage.length) {
                    data[i] = (data[i] & 254) | parseInt(binaryMessage[digitIndex]);
                    digitIndex++;
                } else break;
            }
            ctx.putImageData(imgData, 0, 0);
            setProcessedImage(canvas.toDataURL("image/png"));
        } catch (e) { console.error(e); }
        setIsProcessing(false);
      }, 800);
  };

  const decodeMessage = (ctx, width, height) => {
      try {
          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;
          let binary = "";
          for (let i = 0; i < data.length; i += 4) binary += (data[i] & 1).toString();
          setDecodedText(binaryToText(binary));
      } catch (e) { setDecodedText(""); }
  };

  // --- MODAL HANDLERS ---
  const openDownloadModal = () => {
      setExportFilename(`ghost_${Date.now()}`);
      const keys = Object.keys(t.enc);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      setTrickCuriosity({ key: t.enc[randomKey].key, text: t.enc[randomKey].text });
      setShowDownloadModal(true);
  };

  const confirmDownload = () => {
      const link = document.createElement('a');
      link.download = `${exportFilename}.png`;
      link.href = processedImage;
      link.click();
      setShowDownloadModal(false);
      setProcessedImage(null);
  };

  const switchToSupport = () => {
      setShowDownloadModal(false);
      setShowSupportModal(true);
  };

  return (
    // LAYOUT HYBRID: min-h-screen for Mobile Scroll, lg:h-screen for Desktop Fixed
    <div className="min-h-screen lg:h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col lg:flex-row lg:overflow-hidden selection:bg-amber-500/30">
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* --- SIDEBAR (Mobile Top / Desktop Left) --- */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 shrink-0">
        <div className="mb-6 px-2 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-amber-600/20 rounded-lg flex items-center justify-center transition-colors group">
            <ArrowLeft size={18} className="text-zinc-400 group-hover:text-amber-400" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1>
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] leading-none mt-1">{t.appName}</span>
          </div>
        </div>

        <div className="flex bg-zinc-900 rounded-lg p-1 mb-8 border border-zinc-800">
          <button onClick={() => setLang('it')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'it' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>IT</button>
          <button onClick={() => setLang('en')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>EN</button>
        </div>

        <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3">
             <button onClick={() => { setMode('encode'); setProcessedImage(null); setImageSrc(null); }} className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${mode === 'encode' ? 'bg-amber-900/20 border-amber-500/50 text-amber-500' : 'border-zinc-800 text-zinc-500 hover:bg-zinc-900'}`}>
                <Lock size={20} /> <span className="block text-xs font-black uppercase tracking-wider">{t.modes.encode}</span>
             </button>
             <button onClick={() => { setMode('decode'); setDecodedText(""); setImageSrc(null); }} className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${mode === 'decode' ? 'bg-amber-900/20 border-amber-500/50 text-amber-500' : 'border-zinc-800 text-zinc-500 hover:bg-zinc-900'}`}>
                <Unlock size={20} /> <span className="block text-xs font-black uppercase tracking-wider">{t.modes.decode}</span>
             </button>
        </div>

        <div className="mt-6 lg:mt-auto space-y-1 hidden lg:block">
            <div className="p-4 rounded-xl bg-amber-900/10 border border-amber-500/20 mb-4">
                <h4 className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase mb-2"><AlertTriangle size={12}/> {t.info.warning.split(':')[0]}</h4>
                <p className="text-[10px] text-zinc-400 leading-tight">{t.info.warning.split(':')[1]}</p>
            </div>
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group"><Info size={16} className="group-hover:text-amber-400"/> INFO</button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group"><Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.modals.supportBtn}</button>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50 h-auto lg:h-full overflow-y-visible lg:overflow-y-auto">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Ghost size={18} className="text-amber-500"/> {t.appName} <span className="text-zinc-600">/</span> {mode === 'encode' ? 'ENCRYPTOR' : 'DECRYPTOR'}
            </h2>
            {/* Mobile Info Buttons (Only visible on small screens) */}
            <div className="lg:hidden flex gap-2">
                <button onClick={() => setShowInfoModal(true)} className="p-2 text-zinc-500 hover:text-amber-500"><Info size={18}/></button>
            </div>
        </header>

        <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full pb-20">
            
            {/* STEP 1: UPLOAD */}
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">{mode === 'encode' ? t.steps.upload : t.steps.decodeUpload}</h3>
                <div 
                    onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                    onClick={() => fileInputRef.current.click()}
                    className={`border-2 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group 
                        ${isDragging ? 'border-amber-500 bg-amber-900/20 scale-[1.02]' : ''}
                        ${imageSrc && !isDragging ? 'border-amber-500/50 bg-amber-900/10' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}
                    `}
                >
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleInputUpload}/>
                    {imageSrc ? (
                        <>
                            <img src={imageSrc.src} className="absolute inset-0 w-full h-full object-contain p-4 opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 shadow-xl">
                                <Check size={16} className="text-green-500" /> <span className="text-xs font-bold text-white uppercase">Image Loaded</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-zinc-500 pointer-events-none">
                            <Upload size={32} className={`transition-colors ${isDragging ? 'text-amber-500 animate-bounce' : 'group-hover:text-amber-500'}`}/>
                            <p className="text-xs font-bold uppercase">{t.labels.dropzone}</p>
                            <p className="text-[10px] opacity-50">PNG, JPG, WEBP</p>
                        </div>
                    )}
                </div>
            </div>

            {/* STEP 2: LOGIC */}
            {mode === 'encode' && (
                <div className={`mb-8 transition-all duration-500 ${imageSrc ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 blur-sm pointer-events-none'}`}>
                     <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">{t.steps.write}</h3>
                     <textarea 
                        value={secretText} onChange={(e) => setSecretText(e.target.value)} placeholder={t.labels.secretPlaceholder}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-zinc-300 font-mono text-sm h-32 outline-none focus:border-amber-500 transition-colors resize-none"
                     />
                     <div className="flex justify-end mt-4">
                        <button onClick={encodeMessage} disabled={!secretText || isProcessing} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95">
                           {isProcessing ? t.labels.processing : <><Zap size={16} fill="currentColor"/> {t.steps.process}</>} 
                        </button>
                     </div>
                </div>
            )}

            {mode === 'decode' && imageSrc && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">{t.steps.decodeRead}</h3>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 relative min-h-[100px] flex items-center justify-center">
                         {decodedText ? (
                             <div className="w-full">
                                <div className="flex items-center gap-2 text-green-500 text-xs font-bold uppercase mb-4 tracking-widest">
                                    <Unlock size={14} /> {t.labels.messageFound}
                                </div>
                                <p className="font-mono text-white text-lg break-all selection:bg-green-500/30">{decodedText}</p>
                             </div>
                         ) : (
                             <div className="text-zinc-500 flex flex-col items-center gap-2"><EyeOff size={24} /><p className="text-xs font-bold uppercase">{t.labels.noMessageFound}</p></div>
                         )}
                    </div>
                </div>
            )}

            {/* --- SEO CONTENT (ADSENSE BOOSTER) --- */}
            <div className="mt-16 pt-12 border-t border-white/5 text-zinc-400">
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen size={20} className="text-amber-500"/>
                    <h2 className="text-2xl font-black text-white tracking-tight">{t.seo.title}</h2>
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none">
                    <p className="leading-relaxed mb-8 text-zinc-300">{t.seo.intro}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <HelpCircle size={18} className="text-amber-500"/> {t.seo.h1}
                            </h3>
                            <p className="mb-4 text-xs leading-relaxed">{t.seo.p1}</p>
                            <ul className="space-y-3">
                                {t.seo.ul1.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                                        <div className="min-w-[4px] h-[4px] mt-1.5 rounded-full bg-amber-500/50"></div>
                                        <span>
                                            {item.includes('**') ? <><strong className="text-zinc-200">{item.split('**')[1]}</strong>{item.split('**')[2]}</> : item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            </div>

                            <div className="space-y-6">
                            <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Layers size={18} className="text-amber-500"/> {t.seo.h2}
                                </h3>
                                <p className="text-xs leading-relaxed">{t.seo.p2}</p>
                            </div>
                            <div className="bg-amber-900/10 p-6 rounded-2xl border border-amber-500/10">
                                <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2"><Fingerprint size={16}/> {t.seo.h3}</h3>
                                <p className="text-xs leading-relaxed text-amber-100/70">{t.seo.p3}</p>
                            </div>
                            </div>
                    </div>
                </div>
            </div>

        </div>
      </main>

      {/* --- STEP 3: SUCCESS POPUP (MODAL) --- */}
      {processedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-[2rem] w-full max-w-md p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.15)] relative">
                
                {/* Close Button */}
                <button onClick={() => setProcessedImage(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"><X size={20}/></button>

                {/* Icon */}
                <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                    <Ghost size={48} />
                </div>

                {/* Text */}
                <h3 className="text-2xl font-black italic text-white uppercase mb-2">{t.modals.successTitle}</h3>
                <p className="text-zinc-400 text-xs mb-8 max-w-xs mx-auto">{t.modals.successDesc}</p>
                
                {/* Trigger Export Modal */}
                <button 
                    onClick={openDownloadModal}
                    className="bg-white text-black hover:bg-zinc-200 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 flex items-center gap-3 mx-auto w-full justify-center"
                >
                    <Download size={20} /> {t.labels.downloadBtn}
                </button>
            </div>
        </div>
      )}

      {/* --- EXPORT MODAL --- */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-amber-600/30 rounded-[2rem] w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-full text-amber-500"><Wand2 size={24}/></div>
                <div><h3 className="text-xl font-black text-white uppercase">{t.modals.ready}</h3><p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">PNG FORMAT</p></div>
                <button onClick={() => setShowDownloadModal(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"><X size={20}/></button>
            </div>
            
            <input type="text" value={exportFilename} onChange={(e) => setExportFilename(e.target.value)} className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white mb-8 outline-none focus:border-amber-500 font-bold shadow-inner" />

            <div className="bg-amber-900/10 border border-amber-600/10 rounded-2xl p-5 mb-6 flex gap-4">
              <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <span className="text-[10px] font-black text-amber-400 uppercase block tracking-widest">{t.modals.didYouKnow} ({trickCuriosity.key})</span>
                <p className="text-xs text-gray-300 italic leading-relaxed">{trickCuriosity.text}</p>
              </div>
            </div>

            <div className="mb-6 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-center group hover:bg-green-500/20 transition-all cursor-pointer" onClick={switchToSupport}>
              <button className="text-sm uppercase font-black text-green-500 group-hover:text-green-400 flex items-center gap-3 transition-colors"><Heart size={18} className="animate-pulse" /> {t.modals.supportBtn}</button>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 text-zinc-500 font-bold uppercase text-xs hover:text-zinc-300 hover:bg-white/5 rounded-xl transition-colors">{t.modals.cancel}</button>
              <button onClick={confirmDownload} className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black uppercase text-xs shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2"><Download size={16}/> {t.modals.downloadNow}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- INFO MODAL --- */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-amber-500/30 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-amber-500/10 p-3 rounded-full text-amber-500"><ShieldCheck size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">GHOST PIXEL TECH</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <p className="text-sm text-zinc-300 leading-relaxed">{t.info.desc}</p>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <h4 className="text-xs font-bold text-white uppercase mb-2">Instructions:</h4>
                    <ul className="text-xs text-zinc-400 space-y-2 list-disc pl-4">
                        <li>Upload an image.</li>
                        <li>Type your secret message.</li>
                        <li>Download the resulting PNG.</li>
                        <li>To read it, switch to <strong>DECRYPTOR</strong> mode and upload the PNG.</li>
                    </ul>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUPPORT MODAL --- */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.modals.supportBtn}</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donateTitle}</h4>
                    <div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div>
                </div>
                <div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-amber-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> Support Us</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">Watch Ad (Soon)</button></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}