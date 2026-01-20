'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { 
  Mic, MicOff, Upload, FolderOpen, Search, 
  Plus, X, Check, FileText 
} from 'lucide-react';

// --- TIPI DATI ---
type Shipment = {
  id: string;
  raw: string;
  sede: string;
  sped: string;
  collo: string;
  tipo: string;
  dest: string;
  status: 'pending' | 'scanned';
};

export default function GLSReader() {
  // --- STATO ---
  const [items, setItems] = useState<Shipment[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterLogic, setFilterLogic] = useState('ALL');
  const [stats, setStats] = useState({ total: 0, done: 0 });
  
  // Audio Config
  const [listening, setListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [targetFreq, setTargetFreq] = useState(3000); // Frequenza Beep Scanner
  const [threshold, setThreshold] = useState(85);
  const [triggerActive, setTriggerActive] = useState(false);
  
  // Modale Manuale
  const [showModal, setShowModal] = useState(false);
  const [manual, setManual] = useState({ sede: '', sped: '', collo: '1', tipo: '0', dest: '' });

  // Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- 1. LOGICA AUDIO (RILEVAMENTO BEEP) ---
  const toggleAudio = async () => {
    if (listening) {
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setListening(false);
      setAudioLevel(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        
        analyser.fftSize = 2048; // Alta risoluzione per frequenza
        source.connect(analyser);
        
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        setListening(true);
        analyzeAudio();
      } catch (e) {
        alert("Impossibile accedere al microfono. Verifica i permessi.");
      }
    }
  };

  const analyzeAudio = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Trova la frequenza dominante (semplificato)
    let maxVal = 0;
    let maxIndex = 0;
    for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
            maxVal = dataArray[i];
            maxIndex = i;
        }
    }

    // Calcola la frequenza in Hz del picco
    const nyquist = audioContextRef.current.sampleRate / 2;
    const dominantFreq = maxIndex * (nyquist / bufferLength);

    // Normalizza volume (0-100) per la barra
    const volume = Math.min(100, (maxVal / 255) * 100);
    setAudioLevel(volume);

    // TRIGGER: Se il volume è alto E la frequenza è vicina al target (+/- 500Hz)
    // Questo serve a distinguere il "BEEP" scanner dal rumore di fondo
    const freqMatch = Math.abs(dominantFreq - targetFreq) < 500;
    
    if (volume > threshold && freqMatch) {
       triggerAction();
    }

    animationRef.current = requestAnimationFrame(analyzeAudio);
  };

  const triggerAction = () => {
      if(triggerActive) return; // Evita doppi scatti
      setTriggerActive(true);
      
      // Feedback Visivo
      setTimeout(() => setTriggerActive(false), 300);
      
      // Azione: Focus e Seleziona campo ricerca
      if(searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.value = ''; // Pulisce per nuova scansione
      }
  };

  // --- 2. LOGICA FILE & PARSING ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      parseGLSFile(text);
    };
    reader.readAsText(file);
  };

  const parseGLSFile = (text: string) => {
    const lines = text.split(/\r\n|\n/);
    const newItems: Shipment[] = [];
    
    lines.forEach((line, idx) => {
      const cleanLine = line.trim();
      if(cleanLine.length < 5) return;

      // Parsing posizionale ipotetico (Adatta questi indici al tuo formato reale)
      // Esempio: AB12345678901V3
      // Sede: AB (0-2), Sped: 123456789 (2-11), Collo: 01 (11-13), Dest: V3 (13+)
      
      let sede = "XX";
      let sped = cleanLine;
      let dest = "LOC";

      // Tentativo di parsing più intelligente
      if (cleanLine.length >= 12) {
          sede = cleanLine.substring(0, 2).toUpperCase();
          sped = cleanLine.substring(2, 11);
          // Collo e Destinazione se presenti
          if(cleanLine.length > 11) dest = cleanLine.substring(cleanLine.length - 2);
      }

      newItems.push({
        id: `row-${Date.now()}-${idx}`,
        raw: cleanLine,
        sede, 
        sped, 
        collo: '1', 
        tipo: '0',
        dest,
        status: 'pending'
      });
    });

    setItems(newItems);
  };

  // --- 3. FILTRO E RICERCA ---
  const filteredItems = useMemo(() => {
     let res = items;
     
     // Filtro Logico (Esempio)
     if (filterLogic !== 'ALL') {
         // Qui puoi implementare la logica N S / S N se i dati hanno un campo "tipo"
         // Per ora mostriamo tutto
     }

     // Filtro Ricerca
     if (filterQuery) {
         res = res.filter(i => i.raw.includes(filterQuery) || (i.sede + i.sped).includes(filterQuery));
     }

     return res;
  }, [items, filterQuery, filterLogic]);

  // Aggiorna statistiche
  useEffect(() => {
      setStats({
          total: items.length,
          done: items.filter(i => i.status === 'scanned').length
      });
  }, [items]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toUpperCase().trim();
    setFilterQuery(query);

    // AUTO-CONFERMA: Se la query corrisponde esattamente a una spedizione, segnala come fatta
    if (query.length >= 9) {
      const matchIndex = items.findIndex(i => (i.sede + i.sped) === query || i.sped === query);
      
      if (matchIndex >= 0) {
        // Trovato!
        const newItems = [...items];
        if (newItems[matchIndex].status !== 'scanned') {
            newItems[matchIndex].status = 'scanned';
            setItems(newItems);
            // Pulisci campo dopo successo (opzionale)
            setTimeout(() => setFilterQuery(''), 500); 
        }
      }
    }
  };

  const addManual = () => {
      const newItem: Shipment = {
          id: Date.now().toString(),
          raw: manual.sede + manual.sped,
          sede: manual.sede,
          sped: manual.sped,
          collo: manual.collo,
          tipo: manual.tipo,
          dest: manual.dest || 'MAN',
          status: 'pending'
      };
      setItems([newItem, ...items]);
      setShowModal(false);
      setManual({ sede: '', sped: '', collo: '1', tipo: '0', dest: '' });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5] text-gray-800 overflow-hidden font-sans">
      
      {/* JsBarcode caricato globalmente */}
      <Script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js" strategy="lazyOnload" />

      {/* HEADER */}
      <div className="bg-[#f0f2f5] p-3 shadow-sm z-20 shrink-0">
        <header className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl hover:scale-110 transition-transform no-underline">🏠</Link>
            <h1 className="text-xl font-black text-[#0b2d51] uppercase tracking-wide m-0">Lettore GLS</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowModal(true)} className="bg-[#fdb913] text-[#0b2d51] border-none px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1 cursor-pointer">
              <Plus size={14}/> Manuale
            </button>
            {/* LED TRIGGER */}
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-100 ${triggerActive ? 'bg-green-500 scale-150 shadow-[0_0_15px_#22c55e]' : 'bg-gray-300'}`}></div>
          </div>
        </header>

        {/* PANNELLO CONTROLLI */}
        <div className="bg-white rounded-xl shadow-sm border-t-4 border-[#0b2d51] p-4">
           <div className="grid grid-cols-2 gap-4">
              
              {/* BOTTONE MIC */}
              <button 
                onClick={toggleAudio}
                className={`relative overflow-hidden border-none rounded-lg p-3 flex flex-col items-center justify-center gap-2 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer ${listening ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-gray-500 to-gray-600'}`}
              >
                {listening ? <Mic size={24}/> : <MicOff size={24}/>}
                <span className="text-[10px] uppercase tracking-widest">{listening ? 'Ascolto Attivo' : 'Attiva Mic'}</span>
                
                {/* Visualizer Bar */}
                <div className="w-full h-1.5 bg-black/20 rounded-full mt-1 overflow-hidden relative">
                   <div 
                     className="h-full bg-yellow-400 transition-all duration-75 ease-linear" 
                     style={{ width: `${audioLevel}%` }}
                   />
                   <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${threshold}%` }} />
                </div>
              </button>

              {/* DROP ZONE */}
              <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-2 flex flex-col items-center justify-center text-center relative group hover:bg-blue-50 hover:border-blue-300 transition-colors">
                 <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" accept=".txt,.csv" />
                 <p className="text-[10px] font-bold text-[#0b2d51] uppercase mb-2 m-0">📂 Area Caricamento</p>
                 <div className="flex gap-1 w-full justify-center">
                    <span className="bg-white border border-gray-300 py-1 px-3 rounded text-[10px] font-bold text-gray-600 flex items-center gap-1">
                       <FolderOpen size={10}/> Sfoglia
                    </span>
                 </div>
                 <span className="text-[9px] text-gray-400 mt-1">Trascina .txt o .csv</span>
              </div>
           </div>

           {/* CONTROLLI SLIDERS */}
           <div className="mt-4 pt-4 border-t border-dashed border-gray-200 grid grid-cols-2 gap-4 items-center">
              <div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                    <span>Freq: {targetFreq}Hz</span>
                    <span className="text-blue-600">Soglia: {threshold}%</span>
                 </div>
                 {/* Slider Frequenza */}
                 <input type="range" min="1000" max="5000" step="100" value={targetFreq} onChange={(e) => setTargetFreq(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b2d51] block mb-2" />
                 {/* Slider Soglia */}
                 <input type="range" min="10" max="95" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500 block" />
              </div>
              <div className="flex flex-col items-end text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                 <span>Totale: <b>{stats.total}</b></span>
                 <span className="text-green-600">Fatti: <b>{stats.done}</b></span>
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
             placeholder="🔍 Cerca spedizione..." 
             className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#0b2d51] focus:ring-2 focus:ring-[#0b2d51]/20 outline-none shadow-sm text-lg font-mono font-bold uppercase text-gray-800 bg-white"
           />
        </div>
      </div>

      {/* LISTA RISULTATI */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#e2e6ea]">
         {filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
               <FileText size={48} className="mb-4 opacity-20"/>
               <p className="text-sm italic">Nessun dato caricato</p>
            </div>
         ) : (
            filteredItems.map((item) => (
               <BarcodeCard key={item.id} item={item} />
            ))
         )}
         {/* Spacer finale per scroll comodo */}
         <div className="h-20"></div>
      </div>

      {/* MODALE MANUALE */}
      {showModal && (
         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 border-t-4 border-[#fdb913]">
               <h3 className="text-lg font-black text-[#0b2d51] uppercase border-b pb-2 mb-4 m-0">Inserimento Manuale</h3>
               <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Sede</label>
                     <input type="text" value={manual.sede} onChange={e => setManual({...manual, sede: e.target.value.toUpperCase()})} className="w-full border p-2 rounded font-mono font-bold uppercase text-gray-800" placeholder="AB"/>
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Spedizione</label>
                     <input type="text" value={manual.sped} onChange={e => setManual({...manual, sped: e.target.value})} className="w-full border p-2 rounded font-mono font-bold text-gray-800" placeholder="123456789"/>
                  </div>
               </div>
               
               <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300 min-h-[80px]">
                  <BarcodePreview text={manual.sede + manual.sped} />
               </div>

               <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 font-bold text-gray-600 rounded-lg text-xs uppercase border-none cursor-pointer">Annulla</button>
                  <button onClick={addManual} className="flex-1 py-3 bg-[#0b2d51] font-bold text-white rounded-lg text-xs uppercase shadow-lg border-none cursor-pointer">Aggiungi</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

// --- SOTTO-COMPONENTI ---

const BarcodeCard = ({ item }: { item: Shipment }) => {
   const isScanned = item.status === 'scanned';
   
   return (
      <div className={`bg-white rounded-lg shadow-sm overflow-hidden flex transition-all duration-500 ${isScanned ? 'opacity-50 scale-95 grayscale' : 'opacity-100 scale-100 border-l-4 border-[#fdb913]'}`}>
         {/* Zona Box */}
         <div className={`w-20 bg-[#0b2d51] flex flex-col items-center justify-center text-[#fdb913] p-2 shrink-0`}>
            <span className="text-2xl font-black leading-none">{item.dest.substring(0,2)}</span>
            <span className="text-[9px] font-bold uppercase opacity-80 mt-1">{item.sede}</span>
         </div>
         {/* Contenuto */}
         <div className="flex-1 p-3 flex flex-col items-center justify-center text-center relative">
            <div className="w-full h-12 flex justify-center items-center mb-1">
               <BarcodePreview text={item.sede + item.sped} />
            </div>
            <div className="text-lg font-mono font-black text-[#0b2d51] tracking-widest">{item.sede} {item.sped}</div>
            
            {/* Overlay Spuntato */}
            {isScanned && (
               <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                  <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <Check className="w-8 h-8" strokeWidth={4} />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

// Generatore Barcode (Wrapper per JsBarcode)
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
               margin: 0,
               background: "transparent"
            });
         } catch(e) {}
      }
   }, [text]);

   return <svg ref={svgRef} className="w-full h-full max-h-[50px]"></svg>;
};