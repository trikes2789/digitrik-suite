'use client';

import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 
import { 
  FileText, Plus, Trash2, RefreshCcw, 
  User, Building2, Download, Info, Heart, 
  ArrowLeft, CreditCard, PlayCircle, X, Check, Code2, Mail, ImagePlus,
  Coffee, Sparkles, Wand2, Globe, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

// --- 1. DIZIONARIO TRADUZIONI ---
const TRANSLATIONS = {
  en: {
    sidebar: {
      header: "Header",
      yourData: "Your Data",
      client: "Client",
      editor: "Editor",
      items: "Items & Prices",
      info: "INFO & CONTACTS", // Uniformato
      support: "SUPPORT PROJECT" // Uniformato
    },
    headers: {
      quoteComp: "Quote Composer",
      senderData: "Sender Details",
      clientData: "Client Details",
      rows: "Rows"
    },
    fields: {
      dragLogo: "Drag Logo or Click",
      dropLogo: "Drop file here",
      changeLogo: "Change Logo",
      companyName: "Company Name",
      address: "Address",
      city: "City / Zip",
      vat: "VAT ID / Tax Code",
      contacts: "Contacts (Phone/Email)",
      clientName: "Client Name / Company",
      date: "Date",
      validity: "Validity",
      desc: "Description...",
      qty: "Qty",
      price: "Price",
      vatRate: "VAT",
      actions: ""
    },
    buttons: {
      addRow: "Add Item",
      download: "Download PDF",
      cancel: "Cancel",
      downloadNow: "Download Now",
      calculating: "Penny-Perfect Calc"
    },
    totals: {
      subtotal: "Subtotal",
      net: "Net Total",
      vatTotal: "Total VAT",
      total: "Total",
      targetTotal: "Target Total €",
      targetDesc: "Enter final price: we auto-adjust the subtotal perfectly.",
      discount: "Discount",
      adjustment: "Adjustment"
    },
    modals: {
      ready: "Ready for Download",
      chooseName: "Choose your filename",
      fileName: "File Name",
      supportDev: "Support Development",
      supportDesc: "Digitrik is free and ad-free. A coffee helps us keep it that way!",
      
      // INFO MODAL TRANSLATIONS (STANDARD SUITE)
      aboutTitle: "Our Mission",
      aboutText: "Digitrik Pro was born from my curiosity for programming, to simplify work for thousands. I believe in total Privacy: your files NEVER leave your browser.",
      contactTitle: "Contact Us",
      privacyTitle: "Privacy First",
      privacyText: "No servers, no cloud, no tracking. Processing happens 100% on your device.",
      rights: "All rights reserved.",

      donate: "Donate",
      watchAd: "Watch Ad",
      comingSoon: "Coming Soon"
    },
    pdf: {
      title: "QUOTE",
      to: "To:",
      subtotal: "Gross Subtotal",
      net: "Net Subtotal",
      vat: "Total VAT",
      total: "TOTAL:",
      validity: "Offer valid for:",
      colDesc: "Description",
      colQty: "Qty",
      colPrice: "Price",
      colVat: "VAT",
      colTotal: "Total"
    },
    toasts: {
      logoOk: "Logo uploaded successfully",
      imgError: "Please upload image files only",
      pdfOk: "PDF Generated successfully!",
      pdfErr: "PDF Error: "
    }
  },
  it: {
    sidebar: {
      header: "Intestazione",
      yourData: "I Tuoi Dati",
      client: "Cliente",
      editor: "Editor",
      items: "Articoli & Prezzi",
      info: "INFO & CONTATTI", // Uniformato
      support: "SUPPORTA IL PROGETTO" // Uniformato
    },
    headers: {
      quoteComp: "Composizione Preventivo",
      senderData: "Dati Mittente",
      clientData: "Dati Destinatario",
      rows: "Righe"
    },
    fields: {
      dragLogo: "Trascina Logo o Clicca",
      dropLogo: "Rilascia qui il file",
      changeLogo: "Cambia Logo",
      companyName: "Nome Azienda",
      address: "Indirizzo",
      city: "Città / CAP",
      vat: "P.IVA / C.F.",
      contacts: "Contatti (Tel/Email)",
      clientName: "Ragione Sociale / Nome",
      date: "Data",
      validity: "Validità",
      desc: "Descrizione...",
      qty: "Q.tà",
      price: "Prezzo",
      vatRate: "IVA",
      actions: ""
    },
    buttons: {
      addRow: "Aggiungi Riga",
      download: "Scarica PDF",
      cancel: "Annulla",
      downloadNow: "Scarica Ora",
      calculating: "Calcolo Inverso"
    },
    totals: {
      subtotal: "Imponibile",
      net: "Netto",
      vatTotal: "IVA Totale",
      total: "Totale",
      targetTotal: "Totale Desiderato €",
      targetDesc: "Inserisci il totale finale: ricalcoleremo l'imponibile al centesimo.",
      discount: "Sconto",
      adjustment: "Aggiustamento"
    },
    modals: {
      ready: "Pronto per il Download",
      chooseName: "Scegli il nome del tuo file",
      fileName: "Nome File",
      supportDev: "Supporta lo Sviluppo",
      supportDesc: "Digitrik è gratis e senza pubblicità invasive. Un caffè ci aiuta a mantenerlo tale!",
      
      // INFO MODAL TRANSLATIONS (STANDARD SUITE)
      aboutTitle: "La nostra Mission",
      aboutText: "Digitrik Pro è nato dalla mia curiosità per la programmazione, e per semplificare il lavoro di migliaia di persone. Credo nella Privacy totale: i tuoi file non lasciano MAI il tuo browser.",
      contactTitle: "Contattaci",
      privacyTitle: "Privacy First",
      privacyText: "Nessun server, nessun cloud, nessun tracciamento. L'elaborazione avviene al 100% sul tuo dispositivo.",
      rights: "Tutti i diritti riservati.",

      donate: "Donazione",
      watchAd: "Guarda Spot",
      comingSoon: "Presto Disponibile"
    },
    pdf: {
      title: "PREVENTIVO",
      to: "Spett.le:",
      subtotal: "Imponibile Lordo",
      net: "Imponibile Netto",
      vat: "Totale IVA",
      total: "TOTALE:",
      validity: "Offerta valida per:",
      colDesc: "Descrizione",
      colQty: "Q.tà",
      colPrice: "Prezzo",
      colVat: "IVA",
      colTotal: "Totale"
    },
    toasts: {
      logoOk: "Logo caricato con successo",
      imgError: "Per favore carica solo file immagine",
      pdfOk: "PDF Generato con successo!",
      pdfErr: "Errore PDF: "
    }
  }
};

// --- STILI COMUNI STANDARD ---
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

const Toast = ({ message, type, onClose }) => (
  <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border animate-in slide-in-from-bottom-5 fade-in duration-300 ${type === 'error' ? 'bg-red-950/80 border-red-500/30 text-red-200' : 'bg-zinc-900/90 border-blue-500/30 text-zinc-100'}`}>
    {type === 'error' ? <X size={20} className="text-red-500" /> : <Check size={20} className="text-blue-500" />}
    <div className="text-sm font-medium">{message}</div>
    <button onClick={onClose}><X size={14} className="opacity-50 hover:opacity-100" /></button>
  </div>
);

// --- MOTORE DI CALCOLO ---
const calculateTotals = (items, forcedTotal = null, t) => {
  let subtotal = 0;
  let totalTax = 0;

  items.forEach(item => {
    const lineTotal = item.qty * item.price;
    subtotal += lineTotal;
    totalTax += (lineTotal * (item.taxRate / 100));
  });

  let finalSubtotal = subtotal;
  let finalTax = totalTax;
  let total = subtotal + totalTax;
  let adjustment = { value: 0, label: '' };

  if (forcedTotal !== null && forcedTotal > 0) {
    const averageTaxRate = subtotal > 0 ? (totalTax / subtotal) : 0.22;
    let targetSubtotal = forcedTotal / (1 + averageTaxRate);
    targetSubtotal = Math.round(targetSubtotal * 100) / 100;
    const diff = targetSubtotal - subtotal;
    if (Math.abs(diff) > 0.001) {
      adjustment.value = diff;
      adjustment.label = diff < 0 ? t.totals.discount : t.totals.adjustment;
      finalSubtotal = targetSubtotal;
      finalTax = forcedTotal - finalSubtotal;
      total = forcedTotal;
    }
  }

  return {
    subtotal: subtotal.toFixed(2),
    finalSubtotal: finalSubtotal.toFixed(2),
    tax: finalTax.toFixed(2),
    adjustment: adjustment,
    total: total.toFixed(2)
  };
};

export default function PreventiviTool() {
  // STATO
  const [lang, setLang] = useState('en'); // Default English
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('company'); 
  const [toast, setToast] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Variabile Helper per le traduzioni correnti
  const t = TRANSLATIONS[lang];

  // MODALS
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("");

  // DATI PREVENTIVO
  const [company, setCompany] = useState({ name: '', address: '', city: '', contact: '', vat: '', logo: null });
  const [client, setClient] = useState({ name: '', address: '', city: '', vat: '' });
  const [docInfo, setDocInfo] = useState({ date: new Date().toISOString().split('T')[0], validity: '30 Days' }); 
  const [items, setItems] = useState([{ id: 1, desc: '', qty: 1, price: 0, taxRate: 22 }]);
  const [forcedTotal, setForcedTotal] = useState('');
  const [results, setResults] = useState({ subtotal: "0.00", finalSubtotal: "0.00", tax: "0.00", total: "0.00", adjustment: { value: 0 } });

  const logoInputRef = useRef(null);

  // CARICAMENTO & SALVATAGGIO
  useEffect(() => {
    const saved = localStorage.getItem('digitrik_preventivi_profile');
    if (saved) {
      try { setCompany(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('digitrik_preventivi_profile', JSON.stringify({
        name: company.name, address: company.address, city: company.city,
        contact: company.contact, vat: company.vat, logo: company.logo
      }));
    }
  }, [company, loading]);

  // Ricalcolo con traduzioni aggiornate
  useEffect(() => {
    const fTotal = parseFloat(forcedTotal) || null;
    const res = calculateTotals(items, fTotal, t);
    setResults(res);
  }, [items, forcedTotal, lang]); 

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- LOGICA DRAG & DROP ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processLogoFile(file);
    else showToast(t.toasts.imgError, "error");
  };

  const processLogoFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany(prev => ({ ...prev, logo: reader.result }));
      showToast(t.toasts.logoOk);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) processLogoFile(file);
  };

  // HANDLERS EDITING
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { id: Date.now(), desc: '', qty: 1, price: 0, taxRate: 22 }]);
  
  const removeItem = (index) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
    else setItems([{ id: Date.now(), desc: '', qty: 1, price: 0, taxRate: 22 }]);
  };

  const handleDownloadClick = () => {
    const defaultName = `Quote_${(client.name || 'Digitrik').replace(/[^a-z0-9]/gi, '_')}`;
    setExportFilename(defaultName);
    setShowDownloadModal(true);
  };

  const confirmDownload = () => {
    setShowDownloadModal(false);
    try {
      const doc = new jsPDF();
      const blue = [37, 99, 235];
      const gray = [100, 100, 100];
      const green = [16, 185, 129];
      const red = [220, 38, 38];
      
      // LOGO
      if (company.logo) {
        try {
          const imgProps = doc.getImageProperties(company.logo);
          const maxWidth = 50; const maxHeight = 30;
          const ratio = imgProps.width / imgProps.height;
          let w = maxWidth; let h = w / ratio;
          if (h > maxHeight) { h = maxHeight; w = h * ratio; }
          doc.addImage(company.logo, imgProps.fileType, 15, 15, w, h);
        } catch (e) { console.error("Logo Error:", e); }
      }

      // INTESTAZIONE
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(...blue); 
      doc.text(t.pdf.title, 195, 25, { align: 'right' });

      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      let y = 35;
      [company.name, company.address, company.city, company.contact, company.vat].filter(Boolean).forEach(line => {
        doc.text(String(line), 195, y, { align: 'right' });
        y += 5;
      });

      let cy = 60;
      doc.setFontSize(10); doc.setTextColor(0, 0, 0);
      doc.text(t.pdf.to, 15, cy); cy += 6;
      doc.setFont("helvetica", "bold");
      doc.text(client.name || "Client", 15, cy); cy += 5;
      doc.setFont("helvetica", "normal");
      [client.address, client.city, client.vat].filter(Boolean).forEach(line => {
        doc.text(String(line), 15, cy); cy += 5;
      });

      // TABELLA CON HEADERS TRADOTTI
      autoTable(doc, {
        startY: Math.max(y, cy) + 15,
        head: [[t.pdf.colDesc, t.pdf.colQty, t.pdf.colPrice, t.pdf.colVat, t.pdf.colTotal]],
        body: items.map(i => [
          i.desc, i.qty, parseFloat(i.price).toFixed(2) + '€', i.taxRate + '%', (i.qty * i.price).toFixed(2) + '€'
        ]),
        theme: 'grid',
        headStyles: { fillColor: blue },
        columnStyles: { 0: { cellWidth: 'auto' }, 4: { halign: 'right' } }
      });

      let ty = (doc.lastAutoTable?.finalY || 150) + 12;
      const xL = 140, xV = 195;
      
      doc.setTextColor(...gray);
      doc.text(t.pdf.subtotal + ":", xL, ty);
      doc.text(results.subtotal + " €", xV, ty, { align: 'right' }); ty += 6;

      if (Math.abs(results.adjustment.value) > 0.009) {
        const adjColor = results.adjustment.value < 0 ? green : red;
        doc.setTextColor(...adjColor);
        doc.text(results.adjustment.label + ":", xL, ty);
        doc.text(`${parseFloat(results.adjustment.value).toFixed(2)} €`, xV, ty, { align: 'right' });
        ty += 6;
        
        doc.setTextColor(...gray);
        doc.text(t.pdf.net + ":", xL, ty);
        doc.text(results.finalSubtotal + " €", xV, ty, { align: 'right' }); ty += 6;
      }

      doc.setTextColor(...gray);
      doc.text(t.pdf.vat + ":", xL, ty);
      doc.text(results.tax + " €", xV, ty, { align: 'right' }); ty += 10;

      doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(...blue);
      doc.text(t.pdf.total, xL, ty);
      doc.text(results.total + " €", xV, ty, { align: 'right' });

      ty += 10;
      doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(...gray);
      doc.text(`${t.pdf.validity} ${docInfo.validity}`, 15, ty);

      const finalName = `${exportFilename || 'Quote'}.pdf`;
      doc.save(finalName);
      showToast(t.toasts.pdfOk);
      
    } catch (err) {
      console.error(err);
      showToast(t.toasts.pdfErr + err.message, "error");
    }
  };

  const inputClass = "w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-blue-500 transition-colors";

  if (loading) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>;

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex overflow-hidden selection:bg-blue-500/30">
      
      {/* INFO MODAL (STANDARD SUITE) */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            
            {/* Header */}
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3">
               <div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div>
               <div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div>
               <button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
                
                {/* About Section */}
                <div>
                    <div className="flex items-center gap-2 mb-2 text-blue-500 font-bold uppercase text-xs tracking-wider">
                        <Heart size={14} /> {t.modals.aboutTitle}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-blue-500/20 pl-4">
                        "{t.modals.aboutText}"
                    </p>
                </div>

                {/* Contact Section */}
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 hover:border-blue-500/30 transition-colors">
                     <div className="flex items-center gap-2 mb-2 text-zinc-300 font-bold uppercase text-xs tracking-wider">
                        <Mail size={14} /> {t.modals.contactTitle}
                    </div>
                    <a href="mailto:trichesir@gmail.com" className="text-blue-400 hover:text-blue-300 font-mono text-sm block">trichesir@gmail.com</a>
                </div>

                {/* Privacy Badge */}
                <div className="bg-green-900/10 rounded-xl p-4 border border-green-500/20 flex items-start gap-4">
                    <ShieldCheck size={24} className="text-green-500 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-green-500 font-bold uppercase text-xs tracking-wider mb-1">{t.modals.privacyTitle}</h4>
                        <p className="text-[11px] text-green-200/70 leading-relaxed">{t.modals.privacyText}</p>
                    </div>
                </div>

            </div>
            
            {/* Footer */}
            <div className="p-4 bg-zinc-950 text-center border-t border-white/5">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">© 2024 DigitrikPro Team. {t.modals.rights}</p>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3">
               <div className="bg-green-500/10 p-3 rounded-full text-green-500"><Heart size={24} /></div>
               <div><h3 className="text-xl font-black italic text-white uppercase">{t.sidebar.support}</h3></div>
               <button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4">
                    <h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> {t.modals.donate}</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}
                    </div>
                </div>
                <div className="p-8 space-y-4 bg-zinc-950/30">
                    <h4 className="text-blue-400 font-bold uppercase text-xs flex gap-2"><PlayCircle size={14}/> {t.modals.watchAd}</h4>
                    <button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">{t.modals.comingSoon}</button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD MASK */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#0a0a0a] border border-blue-600/30 rounded-[2rem] w-[90%] max-w-lg p-8 shadow-[0_0_50px_rgba(37,99,235,0.1)] relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600/10 p-3 rounded-full text-blue-500"><Wand2 size={24} /></div>
              <div>
                  <h3 className="text-xl font-black italic text-white uppercase tracking-wider">{t.modals.ready}</h3>
                  <p className="text-[11px] text-gray-500 font-bold uppercase">{t.modals.chooseName}</p>
              </div>
              <button onClick={() => setShowDownloadModal(false)} className="absolute top-6 right-6 text-gray-600 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            
            <div className="space-y-2 mb-8">
              <label className="text-xs font-bold text-gray-400 uppercase ml-2">{t.modals.fileName}</label>
              <div className="relative">
                <input 
                    type="text" 
                    value={exportFilename} 
                    onChange={(e) => setExportFilename(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && confirmDownload()} 
                    autoFocus 
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white font-medium outline-none focus:border-blue-600 transition-all shadow-inner" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-bold pointer-events-none">.PDF</span>
              </div>
            </div>

            {/* SEZIONE DONAZIONE */}
            <div className="mb-8 bg-green-900/10 border border-green-500/20 p-5 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <Sparkles className="text-green-500 shrink-0" size={18} />
                    <div>
                        <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block">{t.modals.supportDev}</span>
                        <p className="text-xs text-gray-400 leading-tight">{t.modals.supportDesc}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {['1', '2', '5'].map(amount => (
                        <a 
                            key={amount} 
                            href={`https://www.paypal.me/triches89/${amount}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-green-500 text-white font-bold text-center text-xs transition-all hover:text-green-400 hover:bg-green-900/20"
                        >
                            🍩 {amount}€
                        </a>
                    ))}
                </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 rounded-xl border border-white/5 hover:bg-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all">{t.buttons.cancel}</button>
              <button onClick={confirmDownload} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"><Check size={16} /> {t.buttons.downloadNow}</button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 font-sans">
        
        {/* --- LOGO STANDARD --- */}
        <div className="mb-8 px-2 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-blue-600/20 rounded-lg flex items-center justify-center transition-colors group">
            <ArrowLeft size={18} className="text-zinc-400 group-hover:text-blue-400 transition-colors" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] leading-none mt-1">TOOL PREVENTIVI</span>
          </div>
        </div>

        {/* --- LANGUAGE TOGGLE --- */}
        <div className="flex bg-zinc-900/50 rounded-lg p-1 mb-8 border border-zinc-800/50">
          <button onClick={() => setLang('en')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md flex items-center justify-center gap-1 transition-all ${lang === 'en' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
             <Globe size={10} /> EN
          </button>
          <button onClick={() => setLang('it')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md flex items-center justify-center gap-1 transition-all ${lang === 'it' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
             <Globe size={10} /> IT
          </button>
        </div>
        
        <nav className="flex-1 space-y-1">
          <SectionTitle icon={Building2} title={t.sidebar.header} />
          <NavItem active={activeTab === 'company'} onClick={() => setActiveTab('company')} icon={Building2} label={t.sidebar.yourData} />
          <NavItem active={activeTab === 'client'} onClick={() => setActiveTab('client')} icon={User} label={t.sidebar.client} />
          
          <div className="h-8" />

          <SectionTitle icon={FileText} title={t.sidebar.editor} />
          <NavItem active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} icon={FileText} label={t.sidebar.items} />
        </nav>

        <div className="mt-auto space-y-1">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group">
                <Info size={16} className="group-hover:text-blue-400 transition-colors"/> {t.sidebar.info}
            </button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group">
                <Heart size={16} className="group-hover:scale-110 transition-transform"/> {t.sidebar.support}
            </button>
        </div>
      </aside>

      {/* CENTER MAIN */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50 font-sans">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
            {activeTab === 'editor' ? t.headers.quoteComp : activeTab === 'company' ? t.headers.senderData : t.headers.clientData}
          </h2>
          <div className="text-[10px] font-bold text-zinc-500 uppercase px-3 py-1 bg-zinc-900 rounded-full border border-white/5">{items.length} {t.headers.rows}</div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* COMPANY TAB */}
          {activeTab === 'company' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
               <div 
                  onClick={() => logoInputRef.current.click()} 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl h-40 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                      isDragging 
                        ? 'border-blue-500 bg-blue-500/10 scale-[0.99]' 
                        : 'border-zinc-800 hover:border-blue-500 hover:bg-blue-500/5'
                  }`}
               >
                  <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={handleLogoUpload} />
                  {company.logo ? (
                      <div className="relative w-full h-full p-4 flex items-center justify-center group-hover:opacity-50 transition-opacity">
                         <img src={company.logo} alt="Logo" className="max-h-full object-contain" />
                         <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full">{t.fields.changeLogo}</span>
                         </div>
                      </div>
                  ) : (
                      <div className="text-center pointer-events-none">
                          <div className={`p-3 rounded-full inline-flex mb-3 transition-transform ${isDragging ? 'scale-110 bg-blue-500 text-white' : 'bg-zinc-900 text-zinc-500 group-hover:scale-110 group-hover:text-blue-500'}`}>
                             <ImagePlus size={24} />
                          </div>
                          <p className={`text-xs font-bold uppercase ${isDragging ? 'text-blue-400' : 'text-zinc-500'}`}>
                             {isDragging ? t.fields.dropLogo : t.fields.dragLogo}
                          </p>
                      </div>
                  )}
               </div>
               
               <div className="space-y-4">
                  <input type="text" placeholder={t.fields.companyName} value={company.name} onChange={e => setCompany({...company, name: e.target.value})} className={inputClass} />
                  <input type="text" placeholder={t.fields.address} value={company.address} onChange={e => setCompany({...company, address: e.target.value})} className={inputClass} />
                  <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder={t.fields.city} value={company.city} onChange={e => setCompany({...company, city: e.target.value})} className={inputClass} />
                      <input type="text" placeholder={t.fields.vat} value={company.vat} onChange={e => setCompany({...company, vat: e.target.value})} className={inputClass} />
                  </div>
                  <input type="text" placeholder={t.fields.contacts} value={company.contact} onChange={e => setCompany({...company, contact: e.target.value})} className={inputClass} />
               </div>
            </div>
          )}

          {/* CLIENT TAB */}
          {activeTab === 'client' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 max-w-2xl mx-auto">
                <div className="space-y-4 bg-zinc-950 p-6 rounded-2xl border border-white/5">
                   <h3 className="text-xs font-bold text-blue-500 uppercase mb-4">{t.headers.clientData}</h3>
                   <input type="text" placeholder={t.fields.clientName} value={client.name} onChange={e => setClient({...client, name: e.target.value})} className={inputClass} />
                   <input type="text" placeholder={t.fields.address} value={client.address} onChange={e => setClient({...client, address: e.target.value})} className={inputClass} />
                   <div className="grid grid-cols-2 gap-4">
                       <input type="text" placeholder={t.fields.city} value={client.city} onChange={e => setClient({...client, city: e.target.value})} className={inputClass} />
                       <input type="text" placeholder={t.fields.vat} value={client.vat} onChange={e => setClient({...client, vat: e.target.value})} className={inputClass} />
                   </div>
                </div>
                <div className="space-y-4 bg-zinc-950 p-6 rounded-2xl border border-white/5">
                   <h3 className="text-xs font-bold text-blue-500 uppercase mb-4">Document</h3>
                   <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">{t.fields.date}</label>
                            <input type="date" value={docInfo.date} onChange={e => setDocInfo({...docInfo, date: e.target.value})} className={inputClass} />
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">{t.fields.validity}</label>
                            <input type="text" value={docInfo.validity} onChange={e => setDocInfo({...docInfo, validity: e.target.value})} className={inputClass} />
                        </div>
                   </div>
                </div>
             </div>
          )}

          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
               {/* Tabella Righe */}
               <div className="bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-zinc-900/50 border-b border-white/5">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase w-5/12">{t.pdf.colDesc}</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase w-2/12 text-center">{t.pdf.colQty}</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase w-2/12">{t.pdf.colPrice}</th>
                            <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase w-2/12">{t.pdf.colVat}</th>
                            <th className="p-4 w-[50px]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.map((item, index) => (
                            <tr key={item.id} className="group hover:bg-blue-500/5 transition-colors">
                                <td className="p-3"><input type="text" className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-700" placeholder={t.fields.desc} value={item.desc} onChange={(e) => updateItem(index, 'desc', e.target.value)} /></td>
                                <td className="p-3"><input type="number" className="w-full bg-transparent text-sm text-zinc-200 outline-none text-center" value={item.qty} onChange={(e) => updateItem(index, 'qty', parseFloat(e.target.value) || 0)} /></td>
                                <td className="p-3"><input type="number" className="w-full bg-transparent text-sm text-zinc-200 outline-none" value={item.price} onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)} /></td>
                                <td className="p-3">
                                    <select className="bg-transparent text-sm text-zinc-400 outline-none cursor-pointer" value={item.taxRate} onChange={(e) => updateItem(index, 'taxRate', parseFloat(e.target.value))}>
                                        <option value="22" className="bg-zinc-900">22%</option>
                                        <option value="10" className="bg-zinc-900">10%</option>
                                        <option value="4" className="bg-zinc-900">4%</option>
                                        <option value="0" className="bg-zinc-900">0%</option>
                                    </select>
                                </td>
                                <td className="p-3 text-center">
                                    <button onClick={() => removeItem(index)} className="text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
               </div>
               <button onClick={addItem} className="w-full py-3 border border-dashed border-zinc-800 hover:border-blue-500 hover:bg-blue-500/5 rounded-xl text-zinc-500 hover:text-blue-500 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2"><Plus size={16}/> {t.buttons.addRow}</button>
            </div>
          )}
        </div>
        
        {/* SEO SECTION */}
        <div className="border-t border-white/5 p-8 text-zinc-500 max-w-4xl mx-auto space-y-4 font-sans">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2"><Code2 size={16} /> Privacy & Speed</h2>
            <p className="text-xs leading-relaxed text-zinc-600">
                Digitrik Pro Quote Generator works 100% in your browser. No data is sent to servers.
            </p>
        </div>

      </main>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 border-l border-white/5 bg-zinc-950 p-6 flex flex-col overflow-y-auto font-sans">
         <div className="mb-8 border-b border-white/5 pb-8">
            <button 
                onClick={handleDownloadClick} 
                className="w-full py-4 bg-blue-600 text-white hover:bg-blue-500 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
                <Download size={16} /> {t.buttons.download}
            </button>
         </div>

         {/* CALCOLATRICE */}
         <div className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <label className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs mb-3">
                    <RefreshCcw size={14}/> {t.buttons.calculating}
                </label>
                <input 
                    type="number" step="0.01" 
                    placeholder={t.totals.targetTotal} 
                    value={forcedTotal} 
                    onChange={e => setForcedTotal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-lg font-bold text-center text-green-400 focus:border-green-500 outline-none"
                />
                <p className="text-[10px] text-zinc-600 mt-2 leading-tight">{t.totals.targetDesc}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-zinc-400"><span>{t.totals.subtotal}</span> <span className="text-zinc-200">{results.subtotal} €</span></div>
                
                {Math.abs(results.adjustment.value) > 0.009 && (
                    <div className={`flex justify-between text-xs font-bold px-2 py-1 rounded ${results.adjustment.value < 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span>{results.adjustment.label}</span>
                        <span>{results.adjustment.value < 0 ? '' : '+'}{parseFloat(results.adjustment.value).toFixed(2)} €</span>
                    </div>
                )}
                
                {Math.abs(results.adjustment.value) > 0.009 && (
                    <div className="flex justify-between text-xs text-zinc-400"><span>{t.totals.net}</span> <span className="text-zinc-200">{results.finalSubtotal} €</span></div>
                )}

                <div className="flex justify-between text-xs text-zinc-400 pb-4 border-b border-white/5"><span>{t.totals.vatTotal}</span> <span className="text-zinc-200">{results.tax} €</span></div>

                <div className="flex justify-between items-end pt-2">
                    <span className="text-xs font-bold text-zinc-500 uppercase">{t.totals.total}</span>
                    <span className="text-2xl font-bold text-blue-500">{results.total} <span className="text-sm text-zinc-600">€</span></span>
                </div>
            </div>
         </div>
      </aside>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}