'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { 
  Mic, MicOff, Upload, FolderOpen, Search, 
  Plus, Settings, Check, X, Barcode as BarcodeIcon, FileText
} from 'lucide-react';

// --- TIPI DATI ---
type Shipment = {
  id: string;
  raw: string;
  sede: string;
  sped: string;
  collo: string;
  dest: string;
  status: 'pending' | 'scanned';
};

export default function GLSReader() {
  // --- STATO ---
  const [items, setItems] = useState<Shipment[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, done: 0 });
  
  // Audio Config
  const [listening, setListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [threshold, setThreshold] = useState(85);
  const [triggerActive, setTriggerActive] = useState(false);
  
  // Modale Manuale
  const [showModal, setShowModal] = useState(false);
  const [manual, setManual] = useState({ sede: '', sped: '', collo: '1', dest: '' });

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- LOGICA AUDIO (MIC) ---
  const toggleAudio = async () => {
    if (listening) {
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setListening(false);
      setAudioLevel(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        source.connect(analyser);
        
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        setListening(true);
        analyzeAudio();
      } catch (e) {
        alert("Impossibile accedere al microfono.");
      }
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calcola volume medio
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const average = sum / dataArray.length;
    
    // Normalizza su 0-100
    const level = Math.min(100, (average / 128) * 100);
    setAudioLevel(level);

    // Trigger Soglia
    if (level > threshold) {
       setTriggerActive(true);
       setTimeout(() => setTriggerActive(false), 200);
       // Qui potresti aggiungere logica extra (es. focus search)
       searchInputRef.current?.focus();
       searchInputRef.current?.select();
    }

    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  // --- LOGICA FILE ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      parseData(text);
    };
    reader.readAsText(file);
  };

  const parseData = (text: string) => {
    // Esempio parsing semplice (adatta al tuo formato reale)
    const lines = text.split(/\r\n|\n/);
    const newItems: Shipment[] = [];
    
    lines.forEach((line, idx) => {
      if(line.length < 5) return;
      // Simulazione parsing posizionale GLS (adatta gli indici)
      const sede = line.substring(0, 2) || "??";
      const sped = line.substring(2, 11) || "000000000";
      const dest = line.substring(line.length - 4) || "XX";
      
      newItems.push({
        id: `row-${idx}`,
        raw: line,
        sede, sped, collo: '1', dest,
        status: 'pending'
      });
    });

    setItems(newItems);
    setStats({ total: newItems.length, done: 0 });
  };

  // --- LOGICA RICERCA ---
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toUpperCase();
    setFilterQuery(query);

    // Se la query è lunga abbastanza, cerca corrispondenza esatta e segna come fatto
    if (query.length > 8) {
      const matchIndex = items.findIndex(i => i.raw.includes(query) || (i.sede + i.sped).includes(query));
      if (matchIndex >= 0) {
        const updated = [...items];
        if (updated[matchIndex].status !== 'scanned') {
            updated[matchIndex].status = 'scanned';
            setItems(updated);
            setStats(prev => ({ ...prev, done: prev.done + 1 }));
            // Effetto sonoro o visivo di conferma qui
        }
      }
    }
  };

  // --- RENDER COMPONENT ---
  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] text-gray-800 overflow-hidden">
      
      {/* SCRIPT ESTERNI */}
      <Script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js" strategy="lazyOnload" />

      {/* HEADER */}
      <div className="bg-[#f0f2f5] p-3 shadow-sm z-20 shrink-0">
        <header className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl hover:scale-110 transition-transform">🏠</Link>
            <h1 className="text-xl font-black text-[#0b2d51] uppercase tracking-wide">Lettore GLS</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowModal(true)} className="bg-[#fdb913] text-[#0b2d51] px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1">
              <Plus size={14}/> Manuale
            </button>
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-100 ${triggerActive ? 'bg-green-500 scale-125 shadow-[0_0_10px_#22c55e]' : 'bg-gray-300'}`}></div>
          </div>
        </header>

        {/* PANNELLO CONTROLLI */}
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-[#0b2d51] p-4">
           <div className="grid grid-cols-2 gap-4">
              
              {/* BOTTONE MIC */}
              <button 
                onClick={toggleAudio}
                className={`relative overflow-hidden rounded-lg p-3 flex flex-col items-center justify-center gap-2 text-white font-bold transition-all shadow-sm active:scale-95 ${listening ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-gray-500 to-gray-600'}`}
              >
                {listening ? <Mic size={24}/> : <MicOff size={24}/>}
                <span className="text-[10px] uppercase tracking-widest">{listening ? 'Ascolto Attivo' : 'Attiva Mic'}</span>
                
                {/* Visualizer Bar */}
                <div className="w-full h-1.5 bg-black/20 rounded-full mt-1 overflow-hidden relative">
                   <div 
                     className="h-full bg-yellow-400 transition-all duration-75 ease-linear" 
                     style={{ width: `${audioLevel}%` }}
                   />
                   {/* Threshold Marker */}
                   <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${threshold}%` }} />
                </div>
              </button>

              {/* DROP ZONE */}
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-2 flex flex-col items-center justify-center text-center relative group hover:bg-blue-50 hover:border-blue-300 transition-colors">
                 <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".txt,.csv" />
                 <p className="text-[10px] font-bold text-[#0b2d51] uppercase mb-2">📂 Area Caricamento</p>
                 <div className="flex gap-1 w-full">
                    <span className="flex-1 bg-white border border-gray-300 py-1 rounded text-[10px] font-bold text-gray-600 flex items-center justify-center gap-1">
                       <FolderOpen size={10}/> Sfoglia
                    </span>
                 </div>
              </div>
           </div>

           {/* CONTROLLI SLIDERS */}
           <div className="mt-4 pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-4 items-center">
              <div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                    <span>Soglia Audio</span>
                    <span className="text-blue-600">{threshold}%</span>
                 </div>
                 <input type="range" min="10" max="95" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b2d51]" />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                 <span>Totale: {stats.total}</span>
                 <span className="font-bold text-green-600">Fatti: {stats.done}</span>
              </div>
           </div>
        </div>

        {/* INPUT RICERCA */}
        <div className="mt-3 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
           <input 
             ref={searchInputRef}
             type="text" 
             value={filterQuery}
             onChange={handleSearch}
             placeholder="🔍 Scansiona o cerca..." 
             className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#0b2d51] focus:ring-2 focus:ring-[#0b2d51]/20 outline-none shadow-sm text-lg font-mono font-bold uppercase"
           />
        </div>
      </div>

      {/* LISTA RISULTATI (Scrollabile) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e2e6ea]">
         {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <FileText size={48} className="mb-4 opacity-20"/>
               <p className="text-sm italic">Nessun dato caricato</p>
            </div>
         ) : (
            items
              .filter(i => i.raw.includes(filterQuery))
              .map((item) => (
               <BarcodeCard key={item.id} item={item} />
            ))
         )}
      </div>

      {/* MODALE MANUALE */}
      {showModal && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border-t-4 border-[#fdb913]">
               <h3 className="text-lg font-black text-[#0b2d51] uppercase border-b pb-2 mb-4">Inserimento Manuale</h3>
               <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Sede</label>
                     <input type="text" value={manual.sede} onChange={e => setManual({...manual, sede: e.target.value.toUpperCase()})} className="w-full border p-2 rounded font-mono font-bold uppercase" placeholder="AB"/>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase">Spedizione</label>
                     <input type="text" value={manual.sped} onChange={e => setManual({...manual, sped: e.target.value})} className="w-full border p-2 rounded font-mono font-bold" placeholder="123456789"/>
                  </div>
               </div>
               
               <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300 min-h-[80px]">
                  <BarcodePreview text={manual.sede + manual.sped} />
               </div>

               <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 font-bold text-gray-600 rounded-lg text-xs uppercase">Annulla</button>
                  <button onClick={() => {
                     setItems([{ id: Date.now().toString(), raw: manual.sede+manual.sped, sede: manual.sede, sped: manual.sped, collo: '1', dest: 'MAN', status: 'pending' }, ...items]);
                     setShowModal(false);
                  }} className="flex-1 py-3 bg-[#0b2d51] font-bold text-white rounded-lg text-xs uppercase shadow-lg">Aggiungi</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

// --- SOTTO-COMPONENTI PER PERFORMANCE ---

const BarcodeCard = ({ item }: { item: Shipment }) => {
   const isScanned = item.status === 'scanned';
   
   return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden flex transition-all duration-500 ${isScanned ? 'opacity-50 scale-95 grayscale' : 'opacity-100 scale-100'}`}>
         {/* Zona Box */}
         <div className={`w-20 bg-[#0b2d51] flex flex-col items-center justify-center text-[#fdb913] p-2 shrink-0`}>
            <span className="text-2xl font-black leading-none">{item.dest.substring(0,2)}</span>
            <span className="text-[9px] font-bold uppercase opacity-80 mt-1">{item.sede}</span>
         </div>
         {/* Contenuto */}
         <div className="flex-1 p-3 flex flex-col items-center justify-center text-center relative">
            <BarcodePreview text={item.sede + item.sped} />
            <div className="mt-2 text-lg font-mono font-black text-[#0b2d51] tracking-widest">{item.sede} {item.sped}</div>
            {isScanned && (
               <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-[1px]">
                  <Check className="text-green-600 w-12 h-12 drop-shadow-md" strokeWidth={3} />
               </div>
            )}
         </div>
      </div>
   );
};

// Generatore Barcode che usa la libreria globale
const BarcodePreview = ({ text }: { text: string }) => {
   const svgRef = useRef<SVGSVGElement>(null);
   
   useEffect(() => {
      if (typeof window !== 'undefined' && (window as any).JsBarcode && svgRef.current && text) {
         try {
            (window as any).JsBarcode(svgRef.current, text, {
               format: "CODE128",
               width: 2,
               height: 40,
               displayValue: false,
               margin: 0
            });
         } catch(e) {}
      }
   }, [text]);

   return <svg ref={svgRef} className="w-full h-full max-h-[50px]"></svg>;
};