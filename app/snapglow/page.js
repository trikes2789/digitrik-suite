'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { useDropzone } from 'react-dropzone';
import { 
  Monitor, Upload, Download, ArrowLeft, Palette, Layout, Maximize, 
  Image as ImageIcon, Loader2, Info, Mail, Heart, Coffee, CreditCard, 
  PlayCircle, X, Check, Smartphone, Laptop, Wand2, Sparkles, 
  HelpCircle, Layers, Fingerprint, BookOpen, Trash2, Plus, ImagePlus,
  FileImage, HardDrive
} from 'lucide-react';
import Link from 'next/link';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  it: {
    appName: "SNAPGLOW",
    workspace: "Galleria",
    files: "Gestione Immagini",
    background: "Sfondo & Mood",
    frame: "Device & Colore",
    layout: "Posizione & Export",
    dropTitle: "Carica Screenshot",
    dropDesc: "Trascina qui le tue immagini (JPG, PNG).",
    downloadOk: "Mockup salvato!",
    finalTrick: "Esporta & Ottimizza",
    chooseName: "Nome e Formato",
    confirm: "Scarica",
    donateCta: "Ti è utile? Offrici un caffè ❤️",
    uploadedImages: "Rullino",
    deviceColor: "Finitura Device",
    estSize: "Peso Stimato",
    calculating: "Calcolo...",
    seo: {
      title: "Generatore Mockup Istantaneo",
      intro: "SnapGlow trasforma i tuoi screenshot grezzi in presentazioni professionali. Ideale per Social Media, Portfolio e Pitch Deck, tutto direttamente nel browser.",
      h1: "Perché usare SnapGlow?",
      p1: "Presentare il tuo lavoro con cura aumenta il valore percepito. Un'app mostrata dentro un iPhone 15 o un sito web dentro un MacBook attirano il 40% di clic in più.",
      ul1: [
        "**Multi-Device:** iPhone 15, Pixel 8, MacBook, iMac e Browser.",
        "**Smart Fit:** Adattamento automatico di qualsiasi immagine (anche 16:9 su schermi verticali).",
        "**Privacy First:** Le immagini vengono elaborate in locale (WASM), nulla sale sui server."
      ],
      h2: "Performance & Export",
      p2: "Scegli tra PNG (massima qualità), JPEG (social media) o WEBP (siti web). Vedi il peso del file in tempo reale prima di scaricare.",
      h3: "Personalizzazione Avanzata",
      p3: "Cambia il colore della scocca del dispositivo (Titanio, Midnight, Silver) per adattarlo al tuo branding."
    },
    enc: {
      SNAP: { curiosity: "Il primo screenshot della storia è stato fatto nel 1960 su un computer PDP-1. Oggi ne facciamo milioni al giorno.", type: "Storia" }
    }
  },
  en: {
    appName: "SNAPGLOW",
    workspace: "Gallery",
    files: "Manage Images",
    background: "Background & Mood",
    frame: "Device & Color",
    layout: "Position & Export",
    dropTitle: "Upload Screenshot",
    dropDesc: "Drag & drop images (JPG, PNG).",
    downloadOk: "Mockup saved!",
    finalTrick: "Export & Optimize",
    chooseName: "Name & Format",
    confirm: "Download",
    donateCta: "Useful? Buy us a coffee ❤️",
    uploadedImages: "Camera Roll",
    deviceColor: "Device Finish",
    estSize: "Est. Size",
    calculating: "Calculating...",
    seo: {
      title: "Instant Mockup Generator",
      intro: "SnapGlow turns raw screenshots into professional presentations. Ideal for Social Media, Portfolios, and Pitch Decks, all directly in the browser.",
      h1: "Why use SnapGlow?",
      p1: "Presenting your work with care increases perceived value. An app shown inside an iPhone 15 or a website inside a MacBook attracts 40% more clicks.",
      ul1: [
        "**Multi-Device:** iPhone 15, Pixel 8, MacBook, iMac, and Browser.",
        "**Smart Fit:** Automatic adaptation of any image (even 16:9 on vertical screens).",
        "**Privacy First:** Images are processed locally (WASM), nothing goes to servers."
      ],
      h2: "Performance & Export",
      p2: "Choose between PNG (max quality), JPEG (social media), or WEBP (websites). See real-time file size before downloading.",
      h3: "Advanced Customization",
      p3: "Change the device body color (Titanium, Midnight, Silver) to match your branding."
    },
    enc: {
      SNAP: { curiosity: "The first screenshot in history was taken in 1960 on a PDP-1 computer. Today we take millions daily.", type: "History" }
    }
  }
};

// --- CONFIG DATA ---
const BACKGROUNDS = [
  { name: 'Cyber', class: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' },
  { name: 'Sunset', class: 'bg-gradient-to-br from-orange-400 to-rose-400' },
  { name: 'Ocean', class: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
  { name: 'Forest', class: 'bg-gradient-to-br from-emerald-400 to-cyan-500' },
  { name: 'Cotton', class: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400' },
  { name: 'Aurora', class: 'bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-slate-900' },
  { name: 'Hyper', class: 'bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900' },
  { name: 'Candy', class: 'bg-gradient-to-r from-yellow-200 via-pink-200 to-pink-400' },
  { name: 'Peach', class: 'bg-gradient-to-tr from-orange-100 to-orange-200' },
  { name: 'Mint', class: 'bg-gradient-to-bl from-teal-50 to-teal-200' },
  { name: 'Midnight', class: 'bg-zinc-950' },
  { name: 'Charcoal', class: 'bg-zinc-800' },
  { name: 'Clean', class: 'bg-white' },
  { name: 'Concrete', class: 'bg-gray-300' },
  { name: 'Electric', class: 'bg-gradient-to-r from-violet-600 to-indigo-600' },
  { name: 'Fire', class: 'bg-gradient-to-r from-red-500 to-orange-500' },
  { name: 'Transparent', class: 'bg-transparent-grid' }, 
];

const DEVICES = [
    { id: 'iphone15', label: 'iPhone 15', icon: Smartphone, type: 'mobile' },
    { id: 'pixel', label: 'Pixel 8', icon: Smartphone, type: 'mobile' },
    { id: 'macbook', label: 'MacBook', icon: Laptop, type: 'desktop' },
    { id: 'imac', label: 'iMac 24"', icon: Monitor, type: 'desktop' },
    { id: 'browser-dark', label: 'Chrome Dark', icon: Layers, type: 'browser' },
    { id: 'browser-light', label: 'Chrome Light', icon: Layers, type: 'browser' },
    { id: 'none', label: 'Solo Immagine', icon: X, type: 'none' },
];

const DEVICE_COLORS = [
    { id: 'midnight', hex: '#2b2b2b', border: '#404040', name: 'Midnight' },
    { id: 'silver', hex: '#e3e3e3', border: '#d1d1d1', name: 'Silver' },
    { id: 'titanium', hex: '#b5b0a3', border: '#9e988b', name: 'Natural' },
    { id: 'blue', hex: '#31405e', border: '#232e45', name: 'Deep Blue' },
    { id: 'gold', hex: '#fae7cf', border: '#dcc6ab', name: 'Gold' },
];

// --- COMPONENTS ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-zinc-400 uppercase tracking-widest text-[10px] font-bold px-2">
    <Icon size={14} className="text-pink-500" />
    {title}
  </div>
);

const SmartSlider = ({ label, value, min, max, step = 1, unit = "", onChange }) => (
  <div className="group">
    <div className="flex justify-between text-[11px] font-medium mb-2 text-zinc-400 group-hover:text-zinc-200 transition-colors">
      <span>{label}</span>
      <span className="text-pink-400 font-mono">{value}{unit}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={value} 
      onChange={(e) => onChange(Number(e.target.value))} 
      className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 transition-all focus:outline-none focus:ring-2 focus:ring-pink-500/20" 
    />
  </div>
);

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-bottom-5 fade-in duration-300 ${type === 'error' ? 'bg-red-950/80 border-red-500/30 text-red-200' : 'bg-zinc-900/90 border-pink-500/30 text-zinc-100'}`}>
    {type === 'error' ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-pink-500" />}
    <div className="text-sm font-medium">{message}</div>
    <button onClick={onClose}><X size={14} className="opacity-50 hover:opacity-100" /></button>
  </div>
);

// --- INTERNAL BROWSER ---
const InternalBrowser = ({ children }) => (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e]">
        <div className="h-5 md:h-6 bg-[#2d2d2d] border-b border-black/20 flex items-center px-3 gap-2 shrink-0">
            <div className="flex gap-1.5">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ff5f56]"></div>
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex-1 ml-2 mr-1 h-3 md:h-4 bg-[#1e1e1e] rounded flex items-center justify-center opacity-50">
                 <div className="w-1/3 h-1 bg-zinc-600 rounded-full"></div>
            </div>
        </div>
        <div className="flex-1 relative overflow-hidden">
            {children}
        </div>
    </div>
);

// --- SMART SCREEN ---
const SmartScreen = ({ image, className }) => {
    return (
        <div className={`relative overflow-hidden bg-black w-full h-full ${className}`}>
            <div className="absolute inset-0 bg-cover bg-center opacity-60 scale-125 blur-xl transition-all duration-500" style={{ backgroundImage: `url(${image})` }}></div>
            <div className="absolute inset-0 flex items-center justify-center p-[2px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} className="max-w-full max-h-full object-contain shadow-2xl drop-shadow-2xl" alt="smart-fit" />
            </div>
        </div>
    );
};

// --- DEVICE RENDERER ---
const DeviceRenderer = ({ device, image, color, shadow }) => {
    
    if (device === 'iphone15') {
        return (
            <div className={`relative rounded-[50px] p-[12px] ring-1 ring-white/10 shadow-2xl ${shadow}`} style={{ width: '300px', backgroundColor: color.hex }}>
                <div className="absolute inset-0 rounded-[50px] border-[6px] pointer-events-none opacity-40" style={{ borderColor: color.border }}></div>
                <div className="relative bg-black rounded-[38px] overflow-hidden aspect-[9/19.5] w-full border border-zinc-800">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-20 flex justify-center items-center"><div className="w-2 h-2 rounded-full bg-[#1a1a1a] mr-6"></div></div>
                    <SmartScreen image={image} />
                </div>
                <div className="absolute top-24 -left-[2px] w-[2px] h-8 rounded-l-md brightness-75" style={{ backgroundColor: color.hex }}></div>
                <div className="absolute top-40 -left-[2px] w-[2px] h-14 rounded-l-md brightness-75" style={{ backgroundColor: color.hex }}></div>
                <div className="absolute top-32 -right-[2px] w-[2px] h-20 rounded-r-md brightness-75" style={{ backgroundColor: color.hex }}></div>
            </div>
        );
    }

    if (device === 'pixel') {
        return (
            <div className={`relative rounded-[24px] p-[3px] shadow-2xl ${shadow}`} style={{ width: '290px', backgroundColor: color.hex }}>
                <div className="bg-black rounded-[21px] p-[8px] h-full">
                    <div className="relative bg-black rounded-[14px] overflow-hidden aspect-[9/20] w-full ring-1 ring-white/10">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20 border border-zinc-800"></div>
                        <SmartScreen image={image} />
                    </div>
                </div>
                <div className="absolute top-24 -right-[2px] w-[3px] h-10 rounded-r-md brightness-75" style={{ backgroundColor: color.hex }}></div>
                <div className="absolute top-40 -right-[2px] w-[3px] h-16 rounded-r-md brightness-75" style={{ backgroundColor: color.hex }}></div>
            </div>
        );
    }

    if (device === 'macbook') {
        return (
            <div className={`relative ${shadow}`} style={{ width: '600px' }}>
                <div className="rounded-t-2xl p-3 pb-0 relative ring-1 ring-white/10 transition-colors" style={{ backgroundColor: color.id === 'midnight' ? '#0d0d0d' : color.hex }}>
                    <div className="relative bg-black rounded-t-lg overflow-hidden aspect-[16/10]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-lg z-20" style={{ backgroundColor: color.id === 'midnight' ? '#0d0d0d' : color.hex }}></div>
                        <InternalBrowser><SmartScreen image={image} /></InternalBrowser>
                    </div>
                </div>
                <div className="h-4 rounded-b-xl relative flex items-center justify-center border-t border-black/20" style={{ backgroundColor: color.hex }}>
                    <div className="w-16 h-2 rounded-b-md absolute -top-[1px] brightness-75" style={{ backgroundColor: color.hex }}></div>
                </div>
            </div>
        );
    }

    if (device === 'imac') {
        return (
            <div className={`relative flex flex-col items-center ${shadow}`} style={{ width: '580px' }}>
                <div className="bg-white rounded-2xl p-3 pb-12 relative w-full shadow-lg ring-1 ring-black/5">
                    <div className="relative bg-black overflow-hidden aspect-[16/9] ring-1 ring-black/5">
                        <InternalBrowser><SmartScreen image={image} /></InternalBrowser>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 top-[calc(100%-48px)] rounded-b-xl" style={{ backgroundColor: color.hex }}>
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-black/10 rounded-full"></div>
                    </div>
                </div>
                <div className="w-24 h-16 -mt-2 z-[-1] relative brightness-90" style={{ backgroundColor: color.hex }}></div>
                <div className="w-32 h-2 rounded-full shadow-md brightness-90" style={{ backgroundColor: color.hex }}></div>
            </div>
        );
    }

    if (device.startsWith('browser')) {
        const isDark = device.includes('dark');
        const bg = isDark ? 'bg-[#1e1e1e] border-zinc-700' : 'bg-white border-zinc-200';
        const text = isDark ? 'text-zinc-500' : 'text-zinc-400';
        return (
            <div className={`${bg} rounded-xl overflow-hidden border shadow-2xl ${shadow}`} style={{ width: '600px' }}>
                <div className={`h-8 ${isDark ? 'bg-[#2d2d2d] border-b border-zinc-700' : 'bg-[#f0f0f0] border-b border-zinc-300'} flex items-center px-4 gap-2`}>
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div><div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div><div className="w-3 h-3 rounded-full bg-[#27c93f]"></div></div>
                    <div className={`flex-1 mx-4 h-5 rounded-md ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'} border border-black/5 flex items-center justify-center`}><span className={`text-[8px] font-sans ${text}`}>digitrik.com</span></div>
                </div>
                <div className="aspect-[16/10] relative w-full bg-black"><SmartScreen image={image} /></div>
            </div>
        );
    }

    return <div className={`overflow-hidden rounded-xl ${shadow}`}><img src={image} className="max-w-full h-auto block rounded-lg" alt="screen" /></div>;
};


export default function SnapGlow() {
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];
  
  const [images, setImages] = useState([]); 
  const [activeId, setActiveId] = useState(null); 
  const [activeTab, setActiveTab] = useState('files');
  const [toast, setToast] = useState(null);
  
  // STATES PER EXPORT
  const [exportFormat, setExportFormat] = useState('png'); // png, jpeg, webp
  const [estimatedSize, setEstimatedSize] = useState(null);
  const [canvasRef, setCanvasRef] = useState(null); // Reference al canvas generato

  const [config, setConfig] = useState({
    padding: 64,
    shadow: 'shadow-2xl',
    device: 'iphone15', 
    deviceColor: DEVICE_COLORS[0], 
    bg: BACKGROUNDS[0],
    scale: 0.8,
  });

  const [filename, setFilename] = useState('mockup');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const exportRef = useRef(null);
  const activeImage = images.find(img => img.id === activeId);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onDrop = useCallback(accepted => {
    const newImages = accepted.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name.split('.')[0]
    }));
    setImages(prev => [...prev, ...newImages]);
    if (newImages.length > 0 && !activeId) {
      setActiveId(newImages[0].id);
      setFilename(newImages[0].name + '-mockup');
      setActiveTab('frame');
    }
  }, [activeId]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ 
    onDrop, noClick: true, multiple: true, accept: {'image/*': []} 
  });

  // --- LOGICA EXPORT ---
  
  const handleOpenExportModal = async () => {
    if (!exportRef.current) return;
    setLoading(true);
    try {
        await new Promise(r => setTimeout(r, 100));
        const canvas = await html2canvas(exportRef.current, { scale: 2, backgroundColor: null, logging: false, useCORS: true });
        setCanvasRef(canvas); 
        
        canvas.toBlob(blob => {
            setEstimatedSize((blob.size / 1024 / 1024).toFixed(2) + ' MB');
            setLoading(false);
            setShowRenameModal(true);
        }, 'image/png');

    } catch (e) {
        console.error(e);
        setLoading(false);
        showToast("Errore Render", "error");
    }
  };

  useEffect(() => {
    if (canvasRef && showRenameModal) {
        setEstimatedSize(t.calculating);
        const mime = `image/${exportFormat}`;
        const quality = exportFormat === 'png' ? undefined : 0.9;
        
        canvasRef.toBlob(blob => {
            if(blob) {
                const sizeMB = blob.size / 1024 / 1024;
                setEstimatedSize(sizeMB < 1 ? (blob.size / 1024).toFixed(0) + ' KB' : sizeMB.toFixed(2) + ' MB');
            }
        }, mime, quality);
    }
  }, [exportFormat, canvasRef, showRenameModal, t.calculating]);

  const handleConfirmDownload = () => {
    if (!canvasRef) return;
    const mime = `image/${exportFormat}`;
    const quality = exportFormat === 'png' ? undefined : 0.9;
    
    const link = document.createElement('a');
    link.download = `${filename}.${exportFormat}`;
    link.href = canvasRef.toDataURL(mime, quality);
    link.click();
    
    setShowRenameModal(false);
    showToast(t.downloadOk);
  };

  const deleteImage = (id, e) => {
    e.stopPropagation();
    const rest = images.filter(i => i.id !== id);
    setImages(rest);
    if (id === activeId) setActiveId(rest[0]?.id || null);
  };

  // --- CONFIG PANEL ---
  const ConfigPanel = () => (
    <div className="space-y-8 pb-10">
       <div className="mb-8 border-b border-white/5 pb-8">
         <button onClick={handleOpenExportModal} disabled={!activeImage || loading} className="w-full py-4 bg-pink-600 text-white hover:bg-pink-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            {loading ? <Loader2 className="animate-spin" size={16}/> : <Check size={16}/>} {t.finalTrick}
          </button>
       </div>

       {activeTab === 'background' && (
         <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <SectionTitle icon={Palette} title={t.background} />
            <div className="grid grid-cols-4 gap-2">
               {BACKGROUNDS.map((b) => (
                  <button key={b.name} onClick={() => setConfig({...config, bg: b})} className={`h-10 rounded-xl transition-all border-2 overflow-hidden relative ${config.bg.name === b.name ? 'border-white scale-105 shadow-xl' : 'border-transparent opacity-70 hover:opacity-100 hover:border-white/20'}`} title={b.name}>
                     <div className={`absolute inset-0 ${b.class}`}></div>
                     {config.bg.name === b.name && <div className="absolute inset-0 flex items-center justify-center"><Check size={14} className="text-white drop-shadow-md"/></div>}
                  </button>
               ))}
            </div>
         </div>
       )}

       {activeTab === 'frame' && (
         <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
           <SectionTitle icon={Layout} title={t.frame} />
           <div className="grid grid-cols-2 gap-3">
              {DEVICES.map(d => (
                <button key={d.id} onClick={() => setConfig({...config, device: d.id})} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${config.device === d.id ? 'bg-zinc-800 border-pink-500 text-pink-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
                  <d.icon size={20} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase">{d.label}</span>
                </button>
              ))}
           </div>
           
           {!config.device.startsWith('browser') && config.device !== 'none' && (
               <div className="pt-4 border-t border-white/5 animate-in fade-in">
                  <SectionTitle icon={Palette} title={t.deviceColor} />
                  <div className="flex gap-2 justify-between">
                     {DEVICE_COLORS.map(c => (
                         <button 
                            key={c.id} 
                            onClick={() => setConfig({...config, deviceColor: c})}
                            className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${config.deviceColor.id === c.id ? 'border-pink-500 scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                         >
                            {config.deviceColor.id === c.id && <Check size={14} className={`drop-shadow-md ${c.id === 'silver' || c.id === 'gold' || c.id === 'titanium' ? 'text-black' : 'text-white'}`}/>}
                         </button>
                     ))}
                  </div>
               </div>
           )}
         </div>
       )}

       {activeTab === 'layout' && (
         <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
            <SectionTitle icon={Maximize} title={t.layout} />
            <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 space-y-6">
               <SmartSlider label="Padding" value={config.padding} min={0} max={200} onChange={v => setConfig({...config, padding: v})} unit="px" />
               <SmartSlider label="Zoom Mockup" value={Math.round(config.scale*100)} min={40} max={150} onChange={v => setConfig({...config, scale: v/100})} unit="%" />
               <div className="pt-4 border-t border-white/5">
                 <label className="text-[10px] font-bold text-zinc-400 mb-2 block uppercase">Ombra Device</label>
                 <div className="flex bg-zinc-950 p-1 rounded-lg">
                    {['shadow-none', 'shadow-lg', 'shadow-2xl'].map((s, i) => (
                        <button key={s} onClick={() => setConfig({...config, shadow: s})} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded ${config.shadow === s ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>Lvl {i}</button>
                    ))}
                 </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="min-h-screen lg:h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col lg:flex-row lg:overflow-hidden selection:bg-pink-500/30">
      
      {/* RENAME & EXPORT MODAL */}
      {showRenameModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#0a0a0a] border border-pink-600/30 rounded-[2rem] w-[90%] max-w-lg p-8 shadow-[0_0_50px_rgba(236,72,153,0.1)] relative animate-in fade-in zoom-in-95">
             <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-600/10 p-3 rounded-full text-pink-500"><Wand2 size={24} /></div>
                <div><h3 className="text-xl font-black italic text-white uppercase tracking-wider">{t.finalTrick}</h3><p className="text-[11px] text-gray-500 font-bold uppercase">{t.chooseName}</p></div>
                <button onClick={() => setShowRenameModal(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white"><X size={20} /></button>
             </div>
             
             {/* Filename Input */}
             <div className="space-y-4 mb-8">
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">{t.fileName}</label>
                    <div className="relative">
                        <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white font-medium outline-none focus:border-pink-600 transition-all shadow-inner" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold pointer-events-none">.{exportFormat.toUpperCase()}</span>
                    </div>
                </div>

                {/* Format Selector */}
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-2 mb-1 block">Formato & Peso</label>
                    <div className="flex bg-[#111] p-1 rounded-xl border border-white/10">
                        {['png', 'jpeg', 'webp'].map(fmt => (
                            <button 
                                key={fmt} 
                                onClick={() => setExportFormat(fmt)}
                                className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase transition-all ${exportFormat === fmt ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-2">
                        <span className="text-[10px] font-mono text-pink-400 flex items-center gap-1 bg-pink-500/10 px-2 py-1 rounded-md">
                            <HardDrive size={10}/> {t.estSize}: {estimatedSize || '...'}
                        </span>
                    </div>
                </div>
             </div>

             {/* Donation CTA */}
             <div className="mb-6 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-center group hover:bg-green-500/20 transition-all cursor-pointer" onClick={() => setShowSupportModal(true)}>
                <button className="text-sm uppercase font-black text-green-500 group-hover:text-green-400 flex items-center gap-3 transition-colors"><Heart size={18} className="animate-pulse" /> {t.donateCta}</button>
             </div>

             <div className="flex gap-3">
                <button onClick={() => setShowRenameModal(false)} className="flex-1 py-4 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest">{t.cancel}</button>
                <button onClick={handleConfirmDownload} className="flex-1 py-4 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"><Download size={16}/> {t.confirm}</button>
             </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 shrink-0">
        <div className="mb-8 px-2 flex items-center gap-2"><Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-pink-600/20 rounded-lg flex items-center justify-center transition-colors"><ArrowLeft size={18} className="text-zinc-400 hover:text-pink-400" /></Link><div className="flex flex-col"><h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1><span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] leading-none mt-1">{t.appName}</span></div></div>
        <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 border border-zinc-800"><button onClick={() => setLang('it')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'it' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>IT</button><button onClick={() => setLang('en')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>EN</button></div>
        <nav className="flex-1 flex flex-col gap-1">
          <NavItem id="files" icon={Upload} label={t.files} isActive={activeTab === 'files'} onClick={setActiveTab} />
          <div className="h-4"></div>
          <NavItem id="frame" icon={Smartphone} label={t.frame} isActive={activeTab === 'frame'} onClick={setActiveTab} disabled={!activeImage} />
          <NavItem id="background" icon={Palette} label={t.background} isActive={activeTab === 'background'} onClick={setActiveTab} disabled={!activeImage} />
          <NavItem id="layout" icon={Maximize} label={t.layout} isActive={activeTab === 'layout'} onClick={setActiveTab} disabled={!activeImage} />
        </nav>
      </aside>

      {/* CENTER AREA */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50 h-auto lg:h-full lg:overflow-hidden">
         <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 lg:px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
           <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{t[activeTab]}</h2>
         </header>

         <div className="flex-1 overflow-y-visible lg:overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-zinc-800 flex flex-col">
            <div {...getRootProps()} onClick={!activeImage ? open : undefined} className={`relative flex flex-col items-center justify-center transition-all min-h-[500px] ${!activeImage ? 'border-2 border-dashed border-zinc-800 rounded-3xl hover:bg-zinc-900/50 cursor-pointer' : ''}`}>
               <input {...getInputProps()} />
               
               {!activeImage ? (
                  <div className="text-center"><div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 mx-auto"><ImagePlus size={32} className="text-zinc-600" /></div><h3 className="text-lg font-bold text-zinc-300">{t.dropTitle}</h3><p className="text-sm text-zinc-500 mt-2">{t.dropDesc}</p></div>
               ) : (
                  <div className="w-full flex justify-center py-4 mb-8">
                      {/* --- CANVAS WRAPPER --- */}
                      <div className="shadow-2xl shadow-black/50 overflow-hidden max-w-full">
                          <div ref={exportRef} className={`transition-all duration-300 ${config.bg.class} flex items-center justify-center`} style={{ padding: `${config.padding}px`, minWidth: '300px' }}>
                             <div style={{ transform: `scale(${config.scale})` }}>
                                <DeviceRenderer device={config.device} image={activeImage.url} shadow={config.shadow} color={config.deviceColor} />
                             </div>
                          </div>
                      </div>
                  </div>
               )}
            </div>

            {/* FILMSTRIP */}
            {images.length > 0 && (
                <div className="mb-12">
                   <div className="flex items-center justify-between mb-4"><h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> {t.uploadedImages}</h3><button onClick={open} className="text-[10px] font-bold text-pink-500 hover:text-pink-400 flex items-center gap-1 uppercase bg-pink-500/10 px-2 py-1 rounded-full"><Plus size={10}/> Add New</button></div>
                   <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 snap-x">
                      {images.map(img => (
                         <div key={img.id} onClick={() => {setActiveId(img.id); setFilename(img.name + '-mockup')}} className={`snap-center shrink-0 w-24 h-24 rounded-xl border-2 cursor-pointer relative group overflow-hidden transition-all ${activeId === img.id ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-zinc-800 opacity-60 hover:opacity-100'}`}>
                            <img src={img.url} className="w-full h-full object-cover" />
                            <button onClick={(e) => deleteImage(img.id, e)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"><Trash2 size={12}/></button>
                         </div>
                      ))}
                   </div>
                </div>
            )}
            
            {/* MOBILE CONFIG */}
            <div className="lg:hidden w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-sm mt-4">
               <ConfigPanel />
            </div>

            {/* --- SEO CONTENT (RESTORED) --- */}
            <div className="mt-12 pt-12 border-t border-white/5 text-zinc-400">
                <div className="flex items-center gap-2 mb-6"><BookOpen size={20} className="text-pink-500"/><h2 className="text-2xl font-black text-white tracking-tight">{t.seo.title}</h2></div>
                <div className="prose prose-invert prose-sm max-w-none">
                    <p className="leading-relaxed mb-8 text-zinc-300">{t.seo.intro}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><HelpCircle size={18} className="text-pink-500"/> {t.seo.h1}</h3><p className="mb-4 text-xs leading-relaxed">{t.seo.p1}</p><ul className="space-y-3">{t.seo.ul1.map((item, idx) => (<li key={idx} className="flex items-start gap-2 text-xs leading-relaxed"><div className="min-w-[4px] h-[4px] mt-1.5 rounded-full bg-pink-500/50"></div><span>{item.includes('**') ? <><strong className="text-zinc-200">{item.split('**')[1]}</strong>{item.split('**')[2]}</> : item}</span></li>))}</ul></div>
                            <div className="space-y-6"><div className="bg-zinc-950/50 p-6 rounded-2xl border border-white/5"><h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Layers size={18} className="text-pink-500"/> {t.seo.h2}</h3><p className="text-xs leading-relaxed">{t.seo.p2}</p></div><div className="bg-pink-900/10 p-6 rounded-2xl border border-pink-500/10"><h3 className="text-lg font-bold text-pink-400 mb-2 flex items-center gap-2"><Fingerprint size={16}/> {t.seo.h3}</h3><p className="text-xs leading-relaxed text-pink-100/70">{t.seo.p3}</p></div></div>
                    </div>
                </div>
            </div>

         </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:flex w-80 border-l border-white/5 bg-zinc-950 p-6 flex-col overflow-y-auto shrink-0">
         <ConfigPanel />
      </aside>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* OTHER MODALS */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <div><div className="flex items-center gap-2 mb-2 text-pink-500 font-bold uppercase text-xs tracking-wider"><Heart size={14} /> {t.aboutTitle}</div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-pink-500/20 pl-4">{t.aboutText}</p></div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-pink-500/30 transition-colors"><div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold uppercase text-xs tracking-wider"><Mail size={14} /> {t.contactTitle}</div><a href="mailto:trichesir@gmail.com" className="text-pink-400 hover:text-pink-300 font-mono text-sm block">trichesir@gmail.com</a></div>
            </div>
          </div>
        </div>
      )}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.supportTitle}</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4"><h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.donateTitle}</h4><div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div></div><div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-pink-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> {t.adTitle}</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">{t.adButton}</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavItem = ({ id, icon: Icon, label, isActive, onClick, disabled }) => (
  <button onClick={() => !disabled && onClick(id)} disabled={disabled} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${isActive ? 'bg-pink-600 text-white shadow-lg' : disabled ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'}`}>
    <Icon size={18} />
    <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
  </button>
);