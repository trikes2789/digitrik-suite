'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Image as ImageIcon, Sliders, Layers, Download, Info, Heart, 
  ArrowLeft, UploadCloud, X, Check, Maximize, Type, 
  Zap, ShieldCheck, Mail, Coffee, CreditCard, PlayCircle, 
  Code2, Sparkles, RefreshCcw, Crop as CropIcon, 
  Trash2, FileImage, LayoutGrid, Wand2, 
  RotateCw, FlipHorizontal, FlipVertical, Square, RectangleHorizontal, RectangleVertical
} from 'lucide-react';
import Link from 'next/link';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  it: {
    appName: "IMAGE STUDIO",
    nav: {
      compress: "Compressore",
      crop: "Taglia & Ruota",
      resize: "Ridimensiona",
      watermark: "Watermark & Logo"
    },
    actions: {
      upload: "Carica Immagini",
      drop: "Trascina qui le tue immagini (Multi)",
      dropSub: "JPG, PNG, WEBP, HEIC. Max 20MB.",
      download: "Scarica",
      downloadNow: "Scarica Ora",
      resetEdits: "Resetta Modifiche",
      closeImage: "Chiudi Immagine",
      converting: "Converto HEIC...",
      applyCrop: "Applica Modifiche",
      cancelCrop: "Annulla"
    },
    controls: {
      quality: "Qualità Compressione",
      format: "Formato Output",
      width: "Larghezza (px)",
      height: "Altezza (px)",
      maintainRatio: "Mantieni Proporzioni",
      wmType: "Tipo Watermark",
      wmText: "Testo",
      wmImage: "Logo",
      text: "Scrivi testo...",
      dragLogo: "Trascina Logo Qui",
      opacity: "Opacità",
      color: "Colore Testo",
      size: "Dimensione",
      tiled: "Ripeti a Mosaico (Scacchiera)",
      cropInfo: "Ruota o seleziona un'area da ritagliare.",
      fileList: "File Caricati",
      ratios: "Proporzioni",
      transform: "Trasforma"
    },
    infoBtn: "INFO & CONTATTI",
    supportBtn: "SUPPORTA IL PROGETTO",
    modals: {
      ready: "Pronto per il Download",
      chooseName: "Scegli il nome del tuo file",
      fileName: "Nome File",
      didYouKnow: "Lo sapevi?",
      cancel: "Annulla",
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
    },
    enc: {
      JPG: { curiosity: "Il formato JPEG elimina le informazioni che l'occhio umano non percepisce per ridurre il peso. Si chiama compressione 'Lossy'.", type: "Immagine" },
      PNG: { curiosity: "Il PNG è l'unico formato web diffuso che supporta la trasparenza 'Alpha', permettendo ombre e contorni sfumati perfetti.", type: "Immagine" },
      WEBP: { curiosity: "Invented by Google, WebP è il 30% più leggero del JPEG a parità di qualità. È il futuro del web.", type: "Web" },
      PIXEL: { curiosity: "Un'immagine 4K contiene oltre 8 milioni di pixel. Ognuno di essi è composto da 3 canali: Rosso, Verde e Blu.", type: "Tech" },
      EXIF: { curiosity: "Le tue foto contengono dati nascosti (EXIF) come la fotocamera usata e a volte la posizione GPS. Digitrik li rimuove per la tua privacy.", type: "Privacy" }
    }
  },
  en: {
    appName: "IMAGE STUDIO",
    nav: {
      compress: "Compressor",
      crop: "Crop & Rotate",
      resize: "Resize",
      watermark: "Watermark & Logo"
    },
    actions: {
      upload: "Upload Images",
      drop: "Drop images here (Multi)",
      dropSub: "JPG, PNG, WEBP, HEIC. Max 20MB.",
      download: "Download",
      downloadNow: "Download Now",
      resetEdits: "Reset Edits",
      closeImage: "Close Image",
      converting: "Converting HEIC...",
      applyCrop: "Apply Edits",
      cancelCrop: "Cancel"
    },
    controls: {
      quality: "Compression Quality",
      format: "Output Format",
      width: "Width (px)",
      height: "Height (px)",
      maintainRatio: "Maintain Aspect Ratio",
      wmType: "Watermark Type",
      wmText: "Text",
      wmImage: "Logo",
      text: "Enter text...",
      dragLogo: "Drag Logo Here",
      opacity: "Opacity",
      color: "Text Color",
      size: "Size / Scale",
      tiled: "Tiled Pattern",
      cropInfo: "Rotate or select area to crop.",
      fileList: "Loaded Files",
      ratios: "Aspect Ratios",
      transform: "Transform"
    },
    infoBtn: "INFO & CONTACTS",
    supportBtn: "SUPPORT PROJECT",
    modals: {
      ready: "Ready for Download",
      chooseName: "Choose your filename",
      fileName: "File Name",
      didYouKnow: "Did you know?",
      cancel: "Cancel",
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
    },
    enc: {
      JPG: { curiosity: "JPEG format discards data invisible to the human eye to reduce file size. This is called 'Lossy' compression.", type: "Image" },
      PNG: { curiosity: "PNG is the only common web format supporting 'Alpha' transparency, allowing for perfect shadows and soft edges.", type: "Image" },
      WEBP: { curiosity: "Invented by Google, WebP is 30% smaller than JPEG at the same quality. It is the future of the web.", type: "Web" },
      PIXEL: { curiosity: "A 4K image contains over 8 million pixels. Each one consists of 3 channels: Red, Green, and Blue.", type: "Tech" },
      EXIF: { curiosity: "Your photos contain hidden data (EXIF) like the camera model and sometimes GPS location. Digitrik removes them for your privacy.", type: "Privacy" }
    }
  }
};

// --- PRESETS FOR CROP ---
const ASPECT_RATIOS = [
    { label: 'Free', value: undefined, icon: Maximize },
    { label: '1:1', value: 1, icon: Square },
    { label: '16:9', value: 16/9, icon: RectangleHorizontal },
    { label: '9:16', value: 9/16, icon: RectangleVertical },
    { label: '4:3', value: 4/3, icon: RectangleHorizontal },
    { label: '3:4', value: 3/4, icon: RectangleVertical },
    { label: '3:2', value: 3/2, icon: RectangleHorizontal },
    { label: '2:3', value: 2/3, icon: RectangleVertical },
    { label: '7:5', value: 7/5, icon: RectangleHorizontal },
    { label: '5:7', value: 5/7, icon: RectangleVertical },
    { label: '5:4', value: 5/4, icon: RectangleHorizontal },
    { label: '4:5', value: 4/5, icon: RectangleVertical },
];

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
  
  // FILES STATE
  const [files, setFiles] = useState([]); 
  const [activeFileIndex, setActiveFileIndex] = useState(null);
  const activeFileObj = activeFileIndex !== null ? files[activeFileIndex] : null;
  const [currentUrl, setCurrentUrl] = useState(null); 

  // PROCESSING STATE
  const [previewUrl, setPreviewUrl] = useState(null); 
  const [fileStats, setFileStats] = useState({ original: 0, processed: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [activeTab, setActiveTab] = useState('compress');

  // SETTINGS STATE
  const defaultSettings = {
    quality: 0.8,
    format: 'image/jpeg',
    width: 0,
    height: 0,
    aspectRatio: 1,
    maintainRatio: true,
    wmType: 'text', 
    wmText: '',
    wmLogoFile: null,
    wmLogoUrl: null,
    wmOpacity: 0.5,
    wmSize: 50, 
    wmTiled: false,
    wmColor: '#ffffff'
  };
  const [settings, setSettings] = useState(defaultSettings);

  // CROP & TRANSFORM STATE
  const [crop, setCrop] = useState(); 
  const [completedCrop, setCompletedCrop] = useState(null); 
  const [cropAspect, setCropAspect] = useState(undefined); 
  const imgRef = useRef(null);

  // MODALS
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("");
  const [trickCuriosity, setTrickCuriosity] = useState({ key: '', text: '' });

  // SPLIT VIEW STATE
  const [splitPos, setSplitPos] = useState(50);
  const splitRef = useRef(null);

  // --- LOGIC ---

  // 1. Initial Load
  useEffect(() => {
    if (activeFileObj) {
       setCurrentUrl(activeFileObj.url);
       const img = new Image();
       img.onload = () => {
           setSettings({ 
               ...defaultSettings, 
               width: img.width, 
               height: img.height,
               aspectRatio: img.width / img.height 
           });
           setFileStats({ original: activeFileObj.file.size, processed: activeFileObj.file.size });
           setCompletedCrop(null); 
           setCrop(undefined);
           setCropAspect(undefined);
       };
       img.src = activeFileObj.url;
    }
  }, [activeFileObj?.id]); 

  // 2. IMMEDIATE TRANSFORM (Rotate/Flip)
  const applyTransform = useCallback(async (type) => {
      if (!currentUrl) return;
      
      const img = new Image();
      img.src = currentUrl;
      await new Promise(r => img.onload = r);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (type === 'rotate90') {
          canvas.width = img.height;
          canvas.height = img.width;
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(90 * Math.PI / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
      } else if (type === 'flipH') {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.translate(img.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(img, 0, 0);
      } else if (type === 'flipV') {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.translate(0, img.height);
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, 0);
      }

      canvas.toBlob((blob) => {
          if (!blob) return;
          const newUrl = URL.createObjectURL(blob);
          setCurrentUrl(newUrl); // Update Base
          setSettings(prev => ({
              ...prev,
              width: canvas.width,
              height: canvas.height,
              aspectRatio: canvas.width / canvas.height
          }));
          // Reset crop
          setCompletedCrop(null);
          setCrop(undefined);
      }, 'image/jpeg', 1);

  }, [currentUrl]);

  // 3. APPLY CROP (Physical Cut)
  const applyCrop = useCallback(async () => {
    // If no crop selected but in crop tab, we might want to just exit
    if (!completedCrop || !imgRef.current) {
        setActiveTab('compress');
        return;
    }

    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    canvas.toBlob((blob) => {
        if (!blob) return;
        const newUrl = URL.createObjectURL(blob);
        setCurrentUrl(newUrl); // Update Base
        setSettings(prev => ({
            ...prev,
            width: canvas.width,
            height: canvas.height,
            aspectRatio: canvas.width / canvas.height
        }));
        setActiveTab('compress');
        setCompletedCrop(null);
        setCrop(undefined);
    }, 'image/jpeg', 1);

  }, [completedCrop]);

  // 4. PROCESS FINAL (Resize, Watermark, Export)
  const processImage = useCallback(async () => {
    if (!currentUrl) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = currentUrl;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let finalWidth = settings.width;
    let finalHeight = settings.height;
    if (!finalWidth || !finalHeight) { finalWidth = img.width; finalHeight = img.height; }

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Draw Base
    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

    // Watermark
    if (settings.wmType === 'text' && settings.wmText) {
        const fontSize = Math.max(12, settings.wmSize); 
        ctx.font = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle = settings.wmColor;
        ctx.globalAlpha = settings.wmOpacity;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        if (settings.wmTiled) {
            ctx.rotate(-Math.PI / 4);
            const diag = Math.sqrt(finalWidth*finalWidth + finalHeight*finalHeight);
            const spacing = ctx.measureText(settings.wmText).width + (fontSize * 3);
            for (let y = -diag; y < diag * 2; y += fontSize * 4) {
                for (let x = -diag; x < diag * 2; x += spacing) {
                    ctx.fillText(settings.wmText, x, y);
                }
            }
            ctx.rotate(Math.PI / 4);
        } else {
            ctx.fillText(settings.wmText, finalWidth / 2, finalHeight / 2);
        }
    } else if (settings.wmType === 'image' && settings.wmLogoUrl) {
        const logo = new Image();
        logo.src = settings.wmLogoUrl;
        await new Promise(r => logo.onload = r);
        
        ctx.globalAlpha = settings.wmOpacity;
        const scaleFactor = settings.wmSize / 100; 
        const logoW = finalWidth * scaleFactor;
        const logoH = logoW * (logo.naturalHeight / logo.naturalWidth);

        if (settings.wmTiled) {
            ctx.rotate(-Math.PI / 4);
            const diag = Math.sqrt(finalWidth*finalWidth + finalHeight*finalHeight);
            const gapX = logoW * 1.5;
            const gapY = logoH * 1.5;
            for (let y = -diag; y < diag * 2; y += gapY) {
                for (let x = -diag; x < diag * 2; x += gapX) {
                    ctx.drawImage(logo, x, y, logoW, logoH);
                }
            }
            ctx.rotate(Math.PI / 4);
        } else {
            const x = (finalWidth - logoW) / 2;
            const y = (finalHeight - logoH) / 2;
            ctx.drawImage(logo, x, y, logoW, logoH);
        }
    }

    canvas.toBlob((blob) => {
        if (blob) {
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
            setFileStats(prev => ({ ...prev, processed: blob.size }));
            setIsProcessing(false);
        }
    }, settings.format, settings.quality);

  }, [currentUrl, settings]);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (currentUrl && activeTab !== 'crop') processImage();
    }, 400);
    return () => clearTimeout(timer);
  }, [settings, currentUrl, processImage, activeTab]);


  // --- HANDLERS ---

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoadingMsg("Loading...");
    
    let heic2any;
    try {
        const module = await import("heic2any");
        heic2any = module.default;
    } catch (e) {
        console.error("HEIC module failed", e);
    }

    const newFiles = [];
    
    for (const file of acceptedFiles) {
        let finalFile = file;
        if ((file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') && heic2any) {
            setLoadingMsg(t.actions.converting);
            try {
                const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
                finalFile = new File([blob], file.name.replace('.heic', '.jpg'), { type: "image/jpeg" });
            } catch (e) {
                console.error("HEIC Error", e);
                continue; 
            }
        }
        newFiles.push({
            file: finalFile,
            url: URL.createObjectURL(finalFile),
            id: Math.random().toString(36).substr(2, 9)
        });
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    if (activeFileIndex === null && newFiles.length > 0) {
        setActiveFileIndex(files.length); 
    }
    setLoadingMsg("");
  }, [files, activeFileIndex, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']}, 
    multiple: true 
  });

  const onLogoDrop = useCallback(accepted => {
      const file = accepted[0];
      if (file) {
          setSettings(prev => ({ ...prev, wmLogoFile: file, wmLogoUrl: URL.createObjectURL(file) }));
      }
  }, []);
  const { getRootProps: getLogoProps, getInputProps: getLogoInput } = useDropzone({ onDrop: onLogoDrop, accept: {'image/*': []}, multiple: false });

  const resetEdits = () => {
      setCurrentUrl(activeFileObj.url);
      const img = new Image();
      img.onload = () => {
          setSettings({ 
              ...defaultSettings, 
              width: img.width, 
              height: img.height,
              aspectRatio: img.width / img.height 
          });
      };
      img.src = activeFileObj.url;
  };

  const closeActiveImage = () => {
      const newFiles = files.filter((_, i) => i !== activeFileIndex);
      setFiles(newFiles);
      setPreviewUrl(null);
      setCurrentUrl(null);
      if (newFiles.length > 0) setActiveFileIndex(0);
      else setActiveFileIndex(null);
  };

  const handleDownloadClick = () => {
    if (!previewUrl) return;
    const defaultName = activeFileObj.file.name.split('.')[0] + "_edited";
    setExportFilename(defaultName);
    const keys = Object.keys(t.enc);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setTrickCuriosity({ key: randomKey, text: t.enc[randomKey].curiosity });
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    if (previewUrl) {
        const a = document.createElement('a');
        a.href = previewUrl;
        const ext = settings.format.split('/')[1];
        a.download = `${exportFilename}.${ext}`;
        a.click();
    }
    setShowDownloadModal(false);
  };

  const handleSplitMove = (e) => {
      if(!splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setSplitPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  const handleResize = (dim, val) => {
    if (settings.maintainRatio) {
        if (dim === 'w') {
            setSettings(prev => ({ ...prev, width: val, height: Math.round(val / prev.aspectRatio) }));
        } else {
            setSettings(prev => ({ ...prev, height: val, width: Math.round(val * prev.aspectRatio) }));
        }
    } else {
        setSettings(prev => ({ ...prev, [dim === 'w' ? 'width' : 'height']: val }));
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex overflow-hidden selection:bg-blue-500/30">
      
      {/* SIDEBAR LEFT */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 overflow-y-auto">
        <div className="mb-6 px-2 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-colors group">
            <ArrowLeft size={18} className="text-zinc-400 group-hover:text-blue-400" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] leading-none mt-1">IMAGE STUDIO</span>
          </div>
        </div>

        <nav className="space-y-1 mb-6">
            <SectionTitle icon={Sliders} title="Tools" />
            <NavItem active={activeTab === 'compress'} onClick={() => setActiveTab('compress')} icon={Zap} label={t.nav.compress} />
            <NavItem active={activeTab === 'crop'} onClick={() => setActiveTab('crop')} icon={CropIcon} label={t.nav.crop} />
            <NavItem active={activeTab === 'resize'} onClick={() => setActiveTab('resize')} icon={Maximize} label={t.nav.resize} />
            <NavItem active={activeTab === 'watermark'} onClick={() => setActiveTab('watermark')} icon={Type} label={t.nav.watermark} />
        </nav>

        <div className="flex-1 overflow-y-auto mb-4">
            <SectionTitle icon={LayoutGrid} title={t.controls.fileList} />
            <div className="space-y-2">
                {files.map((f, i) => (
                    <div key={f.id} onClick={() => setActiveFileIndex(i)} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer border transition-all ${i === activeFileIndex ? 'bg-zinc-900 border-blue-500/50' : 'hover:bg-zinc-900/50 border-transparent'}`}>
                        <div className="w-10 h-10 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10"><img src={f.url} className="w-full h-full object-cover" /></div>
                        <div className="min-w-0"><p className={`text-xs font-bold truncate ${i === activeFileIndex ? 'text-white' : 'text-zinc-500'}`}>{f.file.name}</p><p className="text-[10px] text-zinc-600">{formatSize(f.file.size)}</p></div>
                    </div>
                ))}
                <div {...getRootProps()} className="border border-dashed border-zinc-800 rounded-xl p-3 text-center cursor-pointer hover:bg-zinc-900 transition-colors"><input {...getInputProps()} /><span className="text-[10px] text-zinc-500 font-bold uppercase">+ ADD FILES</span></div>
            </div>
        </div>

        <div className="mt-auto space-y-1">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group"><Info size={16} className="group-hover:text-blue-400"/> {t.infoBtn}</button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group"><Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.supportBtn}</button>
        </div>
      </aside>

      {/* CENTER WORKSPACE */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{t.appName} <span className="text-blue-500">/</span> {t.nav[activeTab]}</h2>
            {activeFileObj && (
                <div className="flex gap-4 text-[10px] font-mono text-zinc-500">
                    <span>ORIGINAL: <span className="text-zinc-300">{formatSize(fileStats.original)}</span></span>
                    <span>NEW: <span className="text-green-400">{formatSize(fileStats.processed)}</span></span>
                    <span className="text-blue-500 font-bold">{fileStats.original > 0 ? Math.round((1 - fileStats.processed/fileStats.original) * 100) : 0}% SAVED</span>
                </div>
            )}
        </header>

        <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
            {loadingMsg ? (
                <div className="text-center animate-pulse"><RefreshCcw className="animate-spin mx-auto mb-4 text-blue-500" size={40} /><p className="text-zinc-400 font-bold">{loadingMsg}</p></div>
            ) : !activeFileObj ? (
                <div {...getRootProps()} className={`w-full max-w-2xl h-96 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'}`}>
                    <input {...getInputProps()} />
                    <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-xl"><UploadCloud size={40} className="text-blue-500" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">{t.actions.drop}</h3>
                    <p className="text-sm text-zinc-500">{t.actions.dropSub}</p>
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col">
                    <div className="relative w-full flex-1 bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden shadow-2xl flex items-center justify-center p-4">
                        {activeTab === 'crop' ? (
                            <div className="max-h-full max-w-full overflow-auto flex items-center justify-center">
                                <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={cropAspect} style={{ maxHeight: '65vh' }}>
                                    <img ref={imgRef} src={currentUrl} style={{ maxHeight: '65vh', width: 'auto', objectFit: 'contain' }} />
                                </ReactCrop>
                            </div>
                        ) : (
                            /* SPLIT VIEW COMPARATOR */
                            <div ref={splitRef} onMouseMove={handleSplitMove} className="relative w-full h-full max-h-[80vh] flex items-center justify-center cursor-col-resize group">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <img src={currentUrl} className="max-w-full max-h-full object-contain" />
                                    <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-[10px] font-bold text-white pointer-events-none">ORIGINAL</div>
                                </div>
                                <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center overflow-hidden" style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}>
                                    <div className="w-full h-full flex items-center justify-center p-4 bg-[url('/transparent-grid.png')]"><img src={previewUrl} className="max-w-full max-h-full object-contain" /></div>
                                    <div className="absolute top-4 right-4 bg-blue-600 px-2 py-1 rounded text-[10px] font-bold text-white pointer-events-none">PROCESSED</div>
                                </div>
                                <div className="absolute top-0 bottom-0 w-1 bg-blue-500 z-20 shadow-[0_0_20px_rgba(37,99,235,0.5)]" style={{ left: `${splitPos}%` }}><div className="absolute top-1/2 -translate-y-1/2 -left-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg text-blue-600 pointer-events-none"><Code2 size={14} className="rotate-90" /></div></div>
                            </div>
                        )}
                    </div>

                    <div className="h-20 mt-6 flex items-center justify-between gap-4">
                        <div className="flex gap-2">
                            <button onClick={resetEdits} className="px-4 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold text-xs uppercase transition-all flex items-center gap-2"><RefreshCcw size={16} /> {t.actions.resetEdits}</button>
                            <button onClick={closeActiveImage} className="px-4 py-3 rounded-xl border border-red-900/30 text-red-500 hover:bg-red-900/20 font-bold text-xs uppercase transition-all flex items-center gap-2"><Trash2 size={16} /> {t.actions.closeImage}</button>
                        </div>
                        {activeTab === 'crop' ? (
                            <button onClick={() => { applyCrop(); }} className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all"><Check size={18} /> {t.actions.applyCrop}</button>
                        ) : (
                            <button onClick={handleDownloadClick} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"><Download size={18} /> {t.actions.download}</button>
                        )}
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 border-l border-white/5 bg-zinc-950 p-6 flex flex-col overflow-y-auto">
        {activeFileObj ? (
            <div className="animate-in slide-in-from-right-4 fade-in">
                <SectionTitle icon={Sliders} title={t.nav[activeTab]} />
                
                {activeTab === 'crop' && (
                    <div className="space-y-6">
                        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-center space-y-3">
                            <CropIcon size={32} className="mx-auto text-green-500" />
                            <p className="text-xs text-zinc-400 leading-relaxed">{t.controls.cropInfo}</p>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.transform}</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => applyTransform('rotate90')} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center justify-center"><RotateCw size={18}/></button>
                                <button onClick={() => applyTransform('flipH')} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center justify-center"><FlipHorizontal size={18}/></button>
                                <button onClick={() => applyTransform('flipV')} className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center justify-center"><FlipVertical size={18}/></button>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.ratios}</label>
                            <div className="grid grid-cols-3 gap-2">
                                {ASPECT_RATIOS.map((r, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setCropAspect(r.value)} 
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${cropAspect === r.value ? 'bg-blue-600 border-blue-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        <r.icon size={14} className="mb-1" />
                                        <span className="text-[9px] font-bold uppercase">{r.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab !== 'crop' && (
                    <div className="mb-6">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.format}</label>
                        <div className="grid grid-cols-3 gap-2">{['jpeg', 'png', 'webp'].map(fmt => (<button key={fmt} onClick={() => setSettings({...settings, format: `image/${fmt}`})} className={`py-2 rounded-lg text-[10px] font-bold uppercase border transition-all ${settings.format.includes(fmt) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>{fmt}</button>))}</div>
                    </div>
                )}

                {activeTab === 'compress' && (
                    <div className="space-y-6">
                        <Slider label={t.controls.quality} value={Math.round(settings.quality * 100)} min={1} max={100} onChange={(v) => setSettings({...settings, quality: v/100})} unit="%" />
                        <div className="p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl"><div className="flex items-center gap-2 text-blue-400 font-bold text-xs mb-1"><Zap size={14} /> Smart Compression</div><p className="text-[10px] text-blue-200/60 leading-relaxed">Metadata removed automatically.</p></div>
                    </div>
                )}

                {activeTab === 'resize' && (
                    <div className="space-y-4">
                        <div><label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">{t.controls.width}</label><input type="number" value={Math.round(settings.width)} onChange={(e) => handleResize('w', parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white" /></div>
                        <div><label className="text-[10px] font-bold text-zinc-500 uppercase mb-1 block">{t.controls.height}</label><input type="number" value={Math.round(settings.height)} onChange={(e) => handleResize('h', parseInt(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white" /></div>
                        <div className="flex items-center gap-2"><input type="checkbox" checked={settings.maintainRatio} onChange={(e) => setSettings({...settings, maintainRatio: e.target.checked})} className="accent-blue-500"/><span className="text-xs text-zinc-400">{t.controls.maintainRatio}</span></div>
                    </div>
                )}

                {activeTab === 'watermark' && (
                    <div className="space-y-6">
                        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                            <button onClick={() => setSettings({...settings, wmType: 'text'})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded ${settings.wmType === 'text' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>{t.controls.wmText}</button>
                            <button onClick={() => setSettings({...settings, wmType: 'image'})} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded ${settings.wmType === 'image' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>{t.controls.wmImage}</button>
                        </div>
                        {settings.wmType === 'text' ? (
                            <div className="space-y-4 animate-in fade-in">
                                <input type="text" placeholder={t.controls.text} value={settings.wmText} onChange={(e) => setSettings({...settings, wmText: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-white"/>
                                <div className="flex items-center gap-2"><input type="color" value={settings.wmColor} onChange={(e) => setSettings({...settings, wmColor: e.target.value})} className="h-8 w-8 bg-transparent border-0 rounded cursor-pointer"/><span className="text-xs text-zinc-400">{t.controls.color}</span></div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in">
                                <div {...getLogoProps()} className="border border-dashed border-zinc-700 rounded-xl p-6 text-center hover:bg-zinc-900/50 cursor-pointer">
                                    <input {...getLogoInput()} />
                                    {settings.wmLogoUrl ? (<div className="flex flex-col items-center"><img src={settings.wmLogoUrl} className="h-10 object-contain mb-2" /><span className="text-[10px] text-green-500">Logo Caricato</span></div>) : (<div className="flex flex-col items-center text-zinc-500"><FileImage size={24} className="mb-2" /><span className="text-[10px] font-bold uppercase">{t.controls.dragLogo}</span></div>)}
                                </div>
                            </div>
                        )}
                        <hr className="border-white/5" />
                        <Slider label={t.controls.size} value={settings.wmSize} min={5} max={200} onChange={(v) => setSettings({...settings, wmSize: v})} unit={settings.wmType === 'text' ? 'px' : '%'} />
                        <Slider label={t.controls.opacity} value={Math.round(settings.wmOpacity * 100)} min={0} max={100} onChange={(v) => setSettings({...settings, wmOpacity: v/100})} unit="%" />
                        <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-xl border border-zinc-800"><input type="checkbox" checked={settings.wmTiled} onChange={(e) => setSettings({...settings, wmTiled: e.target.checked})} className="accent-blue-500 w-4 h-4"/><span className="text-xs font-bold text-zinc-400">{t.controls.tiled}</span></div>
                    </div>
                )}
            </div>
        ) : (
            <div className="h-full flex items-center justify-center text-center p-6 opacity-30"><div><ImageIcon size={48} className="mx-auto mb-4 text-zinc-500" /><p className="text-xs text-zinc-400">Select an image to activate controls</p></div></div>
        )}
      </aside>

      {/* RENAME / DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#0a0a0a] border border-blue-600/30 rounded-[2rem] w-[90%] max-w-lg p-8 shadow-[0_0_50px_rgba(37,99,235,0.1)] relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600/10 p-3 rounded-full text-blue-500"><Wand2 size={24} /></div>
              <div><h3 className="text-xl font-black italic text-white uppercase tracking-wider">{t.modals.ready}</h3><p className="text-[11px] text-gray-500 font-bold uppercase">{t.modals.chooseName}</p></div>
              <button onClick={() => setShowDownloadModal(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.modals.fileName}</label>
              <div className="relative">
                <input type="text" value={exportFilename} onChange={(e) => setExportFilename(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmDownload()} autoFocus className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white font-medium outline-none focus:border-blue-600 transition-all shadow-inner" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold pointer-events-none">.{settings.format.split('/')[1].toUpperCase()}</span>
              </div>
            </div>
            <div className="bg-blue-900/10 border border-blue-600/10 rounded-2xl p-5 mb-6 flex gap-4">
              <Sparkles className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">{t.modals.didYouKnow} ({trickCuriosity.key})</span>
                <p className="text-xs text-gray-300 italic leading-relaxed">{trickCuriosity.text}</p>
              </div>
            </div>
            <div className="mb-8 bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-center group hover:bg-green-500/20 transition-all cursor-pointer" onClick={() => setShowSupportModal(true)}>
              <button className="text-sm uppercase font-black text-green-500 group-hover:text-green-400 flex items-center gap-3 transition-colors"><Heart size={18} className="animate-pulse" /> {t.supportBtn}</button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all">{t.modals.cancel}</button>
              <button onClick={confirmDownload} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"><Check size={16} /> {t.actions.downloadNow}</button>
            </div>
          </div>
        </div>
      )}

      {/* INFO & SUPPORT MODALS */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <div><div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase text-xs tracking-wider"><Heart size={14} /> {t.modals.aboutTitle}</div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">{t.modals.aboutText}</p></div>
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/30 transition-colors"><div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold uppercase text-xs tracking-wider"><Mail size={14} /> {t.modals.contactTitle}</div><a href="mailto:trichesir@gmail.com" className="text-blue-400 hover:text-blue-300 font-mono text-sm block">trichesir@gmail.com</a></div>
                <div className="bg-green-900/10 rounded-xl p-4 border border-green-500/20 flex items-start gap-4"><ShieldCheck size={24} className="text-green-500 shrink-0 mt-1" /><div><h4 className="text-green-500 font-bold uppercase text-xs tracking-wider mb-1">{t.modals.privacyTitle}</h4><p className="text-[11px] text-green-200/70 leading-relaxed">{t.modals.privacyText}</p></div></div>
            </div>
            <div className="p-4 bg-zinc-950 text-center border-t border-white/5"><p className="text-[10px] text-zinc-600 uppercase tracking-widest">© 2024 DigitrikPro Team. {t.modals.rights}</p></div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.supportBtn}</h3><p className="text-[11px] text-gray-500 font-bold uppercase">{t.modals.supportSub}</p></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
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