'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useDropzone } from 'react-dropzone';
import { 
  QrCode, Link as LinkIcon, Wifi, UserSquare, Mail, Type, 
  Download, Settings, Image as ImageIcon, Palette, 
  ArrowLeft, Info, Heart, Check, X, CreditCard, PlayCircle, 
  RefreshCcw, Smartphone, ShieldCheck, Share2, Printer
} from 'lucide-react';
import Link from 'next/link';

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  it: {
    appName: "QR CREATOR",
    nav: {
      url: "Sito Web (URL)",
      wifi: "WiFi Access",
      vcard: "Biglietto Visita",
      email: "Invia Email",
      text: "Testo Libero"
    },
    labels: {
      enterUrl: "Inserisci Indirizzo Web",
      ssid: "Nome Rete (SSID)",
      password: "Password WiFi",
      encryption: "Sicurezza (WPA/WEP)",
      hidden: "Rete Nascosta",
      firstName: "Nome",
      lastName: "Cognome",
      phone: "Telefono",
      org: "Azienda",
      email: "Indirizzo Email",
      subject: "Oggetto",
      body: "Messaggio",
      textContent: "Scrivi il tuo testo qui..."
    },
    controls: {
      design: "Design & Colori",
      fgColor: "Colore QR",
      bgColor: "Sfondo",
      logo: "Logo Centrale",
      uploadLogo: "Carica Logo",
      removeLogo: "Rimuovi",
      errLevel: "Correzione Errore",
      errDesc: "Più è alto, più il QR è leggibile se danneggiato o con logo.",
      margin: "Margine (Bordo)"
    },
    actions: {
      download: "Scarica PNG",
      print: "Stampa"
    },
    infoBtn: "INFO & CONTATTI",
    supportBtn: "SUPPORTA IL PROGETTO",
    modals: {
      aboutTitle: "QR Code Privacy First",
      aboutText: "Genera QR Code professionali direttamente nel tuo browser. Nessun dato viene tracciato o salvato su server esterni.",
      donateTitle: "Offrici un caffè",
      adButton: "Coming Soon"
    }
  },
  en: {
    appName: "QR CREATOR",
    nav: {
      url: "Website (URL)",
      wifi: "WiFi Access",
      vcard: "vCard (Contact)",
      email: "Send Email",
      text: "Plain Text"
    },
    labels: {
      enterUrl: "Enter Website URL",
      ssid: "Network Name (SSID)",
      password: "WiFi Password",
      encryption: "Security (WPA/WEP)",
      hidden: "Hidden Network",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      org: "Company",
      email: "Email Address",
      subject: "Subject",
      body: "Message",
      textContent: "Type your text here..."
    },
    controls: {
      design: "Design & Colors",
      fgColor: "QR Color",
      bgColor: "Background",
      logo: "Center Logo",
      uploadLogo: "Upload Logo",
      removeLogo: "Remove",
      errLevel: "Error Correction",
      errDesc: "Higher levels allow the QR to be scanned even if damaged or covered by a logo.",
      margin: "Margin (Border)"
    },
    actions: {
      download: "Download PNG",
      print: "Print"
    },
    infoBtn: "INFO & CONTACTS",
    supportBtn: "SUPPORT PROJECT",
    modals: {
      aboutTitle: "Privacy First QR",
      aboutText: "Generate professional QR Codes directly in your browser. No data is tracked or saved on external servers.",
      donateTitle: "Buy us a coffee",
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

export default function QRCreator() {
  const [lang, setLang] = useState('it');
  const t = TRANSLATIONS[lang];
  
  // STATE: CONTENT
  const [activeType, setActiveType] = useState('url');
  const [content, setContent] = useState({
    url: 'https://digitrik-suite.vercel.app',
    ssid: '', password: '', encryption: 'WPA', hidden: false,
    firstName: '', lastName: '', phone: '', email: '', org: '',
    emailTo: '', emailSub: '', emailBody: '',
    text: ''
  });

  // STATE: DESIGN
  const [design, setDesign] = useState({
    fgColor: '#000000',
    bgColor: '#ffffff',
    margin: 2,
    errorCorrection: 'M', // L, M, Q, H
    logo: null,
    logoUrl: null
  });

  const [qrUrl, setQrUrl] = useState(null);
  
  // MODALS
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // --- LOGIC: GENERATE QR ---
  useEffect(() => {
    generateQR();
  }, [content, design, activeType]);

  const generateQR = async () => {
    let textToEncode = "";

    switch(activeType) {
        case 'url':
            textToEncode = content.url || "https://digitrik.com";
            break;
        case 'wifi':
            textToEncode = `WIFI:T:${content.encryption};S:${content.ssid};P:${content.password};H:${content.hidden};;`;
            break;
        case 'vcard':
            textToEncode = `BEGIN:VCARD\nVERSION:3.0\nN:${content.lastName};${content.firstName}\nFN:${content.firstName} ${content.lastName}\nORG:${content.org}\nTEL:${content.phone}\nEMAIL:${content.email}\nEND:VCARD`;
            break;
        case 'email':
            textToEncode = `mailto:${content.emailTo}?subject=${encodeURIComponent(content.emailSub)}&body=${encodeURIComponent(content.emailBody)}`;
            break;
        case 'text':
            textToEncode = content.text || "Digitrik Pro";
            break;
    }

    try {
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, textToEncode, {
            width: 1000,
            margin: design.margin,
            color: {
                dark: design.fgColor,
                light: design.bgColor
            },
            errorCorrectionLevel: design.errorCorrection
        });

        const ctx = canvas.getContext('2d');

        if (design.logoUrl) {
            const logo = new Image();
            logo.src = design.logoUrl;
            await new Promise(r => logo.onload = r);

            const size = canvas.width * 0.22;
            const x = (canvas.width - size) / 2;
            const y = (canvas.height - size) / 2;
            ctx.drawImage(logo, x, y, size, size);
        }

        setQrUrl(canvas.toDataURL('image/png'));

    } catch (err) {
        console.error(err);
    }
  };

  const handleDownload = () => {
      if (!qrUrl) return;
      const a = document.createElement('a');
      a.href = qrUrl;
      a.download = `digitrik_qr_${activeType}.png`;
      a.click();
  };

  const onLogoDrop = (accepted) => {
      if(accepted[0]) {
          setDesign({...design, logo: accepted[0], logoUrl: URL.createObjectURL(accepted[0]), errorCorrection: 'H'});
      }
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onLogoDrop, accept: {'image/*': []}, multiple: false });

  // --- RENDER INPUTS ---
  const renderInputs = () => {
      switch(activeType) {
          case 'url':
              return (
                  <div className="space-y-4">
                      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                          <label className="text-[10px] font-bold text-blue-400 uppercase mb-2 block">{t.labels.enterUrl}</label>
                          <input type="text" value={content.url} onChange={e => setContent({...content, url: e.target.value})} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white outline-none focus:border-blue-500 transition-colors" />
                      </div>
                  </div>
              );
          case 'wifi':
              return (
                  <div className="space-y-3">
                      <input type="text" placeholder={t.labels.ssid} value={content.ssid} onChange={e => setContent({...content, ssid: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      <input type="text" placeholder={t.labels.password} value={content.password} onChange={e => setContent({...content, password: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      <div className="flex gap-2">
                          <select value={content.encryption} onChange={e => setContent({...content, encryption: e.target.value})} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white flex-1">
                              <option value="WPA">WPA/WPA2</option>
                              <option value="WEP">WEP</option>
                              <option value="nopass">No Password</option>
                          </select>
                      </div>
                  </div>
              );
          case 'vcard':
              return (
                  <div className="space-y-3">
                      <div className="flex gap-2">
                          <input type="text" placeholder={t.labels.firstName} value={content.firstName} onChange={e => setContent({...content, firstName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                          <input type="text" placeholder={t.labels.lastName} value={content.lastName} onChange={e => setContent({...content, lastName: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      </div>
                      <input type="text" placeholder={t.labels.phone} value={content.phone} onChange={e => setContent({...content, phone: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      <input type="text" placeholder={t.labels.email} value={content.email} onChange={e => setContent({...content, email: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      <input type="text" placeholder={t.labels.org} value={content.org} onChange={e => setContent({...content, org: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                  </div>
              );
          case 'email':
              return (
                  <div className="space-y-3">
                      <input type="email" placeholder={t.labels.email} value={content.emailTo} onChange={e => setContent({...content, emailTo: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      <input type="text" placeholder={t.labels.subject} value={content.emailSub} onChange={e => setContent({...content, emailSub: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white" />
                      <textarea placeholder={t.labels.body} value={content.emailBody} onChange={e => setContent({...content, emailBody: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm text-white h-24 resize-none" />
                  </div>
              );
          case 'text':
              return (
                  <textarea placeholder={t.labels.textContent} value={content.text} onChange={e => setContent({...content, text: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-white h-40 resize-none font-mono" />
              );
      }
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
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] leading-none mt-1">{t.appName}</span>
          </div>
        </div>

        <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 border border-zinc-800">
          <button onClick={() => setLang('it')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'it' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>IT</button>
          <button onClick={() => setLang('en')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>EN</button>
        </div>

        <nav className="space-y-1 mb-6">
            <SectionTitle icon={QrCode} title="Type" />
            <NavItem active={activeType === 'url'} onClick={() => setActiveType('url')} icon={LinkIcon} label={t.nav.url} />
            <NavItem active={activeType === 'wifi'} onClick={() => setActiveType('wifi')} icon={Wifi} label={t.nav.wifi} />
            <NavItem active={activeType === 'vcard'} onClick={() => setActiveType('vcard')} icon={UserSquare} label={t.nav.vcard} />
            <NavItem active={activeType === 'email'} onClick={() => setActiveType('email')} icon={Mail} label={t.nav.email} />
            <NavItem active={activeType === 'text'} onClick={() => setActiveType('text')} icon={Type} label={t.nav.text} />
        </nav>

        <div className="mt-auto space-y-1">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group"><Info size={16} className="group-hover:text-blue-400"/> {t.infoBtn}</button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group"><Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.supportBtn}</button>
        </div>
      </aside>

      {/* CENTER WORKSPACE (FIXED LAYOUT: VERTICAL STACK) */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{t.appName} <span className="text-blue-500">/</span> {t.nav[activeType]}</h2>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-12">
                
                {/* 1. INPUT DATA AREA (TOP) */}
                <div className="w-full bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Smartphone size={20} className="text-blue-500"/> Input Data</h3>
                    {renderInputs()}
                </div>

                {/* 2. PREVIEW & DOWNLOAD AREA (BOTTOM) */}
                <div className="w-full flex flex-col items-center justify-center pt-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-zinc-800 relative group transition-transform duration-500 hover:scale-[1.02]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-800 rounded-b-xl flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                            <div className="w-10 h-1.5 rounded-full bg-zinc-700"></div>
                        </div>
                        {qrUrl ? (
                            <img src={qrUrl} className="w-full h-auto rounded-lg max-w-[280px]" alt="QR Code" />
                        ) : (
                            <div className="w-64 h-64 bg-zinc-100 flex items-center justify-center text-zinc-300"><RefreshCcw className="animate-spin" size={32}/></div>
                        )}
                    </div>
                    
                    <button onClick={handleDownload} className="mt-8 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-900/30 flex items-center gap-3 transition-all hover:-translate-y-1">
                        <Download size={18} /> {t.actions.download}
                    </button>
                </div>

            </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR (DESIGN) */}
      <aside className="w-80 border-l border-white/5 bg-zinc-950 p-6 flex flex-col overflow-y-auto">
        <SectionTitle icon={Palette} title={t.controls.design} />
        
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.fgColor}</label>
                    <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                        <input type="color" value={design.fgColor} onChange={e => setDesign({...design, fgColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"/>
                        <span className="text-xs font-mono text-zinc-400">{design.fgColor}</span>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.bgColor}</label>
                    <div className="flex items-center gap-2 bg-zinc-900 p-2 rounded-lg border border-zinc-800">
                        <input type="color" value={design.bgColor} onChange={e => setDesign({...design, bgColor: e.target.value})} className="h-8 w-8 rounded cursor-pointer bg-transparent border-none"/>
                        <span className="text-xs font-mono text-zinc-400">{design.bgColor}</span>
                    </div>
                </div>
            </div>

            {/* Error Correction */}
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.errLevel}</label>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    {['L', 'M', 'Q', 'H'].map(lvl => (
                        <button key={lvl} onClick={() => setDesign({...design, errorCorrection: lvl})} className={`flex-1 py-2 text-xs font-bold rounded ${design.errorCorrection === lvl ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>{lvl}</button>
                    ))}
                </div>
                <p className="text-[9px] text-zinc-600 mt-2 leading-relaxed">{t.controls.errDesc}</p>
            </div>

            <hr className="border-white/5" />

            {/* Logo Upload */}
            <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block">{t.controls.logo}</label>
                <div {...getRootProps()} className="border border-dashed border-zinc-800 rounded-xl p-6 text-center cursor-pointer hover:bg-zinc-900/50 transition-all">
                    <input {...getInputProps()} />
                    {design.logoUrl ? (
                        <div className="relative inline-block group">
                            <img src={design.logoUrl} className="h-16 w-16 object-contain" />
                            <button onClick={(e) => { e.stopPropagation(); setDesign({...design, logo: null, logoUrl: null, errorCorrection: 'M'}); }} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                            <ImageIcon size={24} />
                            <span className="text-[10px] font-bold uppercase">{t.controls.uploadLogo}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </aside>

      {/* MODALS */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <div><div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase text-xs tracking-wider"><Heart size={14} /> {t.modals.aboutTitle}</div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">{t.modals.aboutText}</p></div>
            </div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">{t.supportBtn}</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donateTitle}</h4>
                    <div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div>
                </div>
                <div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-blue-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> {t.modals.adTitle}</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">{t.modals.adButton}</button></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}