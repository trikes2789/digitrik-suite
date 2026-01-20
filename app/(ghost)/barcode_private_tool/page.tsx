'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { 
  Mic, MicOff, Upload, Search, Plus, 
  ArrowLeft, Terminal, Activity, FileText 
} from 'lucide-react';

/* STILI CSS INLINE - DARK MODE DIGITRIK */
const styles = `
  :root { 
    --bg: #09090b; /* zinc-950 */
    --card: #18181b; /* zinc-900 */
    --border: #27272a; /* zinc-800 */
    --text: #e4e4e7; /* zinc-200 */
    --primary: #3b82f6; /* blue-500 */
    --accent: #06b6d4; /* cyan-500 */
    --success: #10b981; /* emerald-500 */
    --error: #ef4444; /* red-500 */
  }
  
  body { background-color: var(--bg); color: var(--text); }

  .top-section { 
    background: rgba(9, 9, 11, 0.8); 
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 15px; 
    z-index: 50; 
    position: relative; 
  }

  .control-card { 
    background: var(--card); 
    border: 1px solid var(--border); 
    border-radius: 16px; 
    padding: 16px; 
    margin-bottom: 12px;
    box-shadow: 0 4px 20px -10px rgba(0,0,0,0.5);
  }
  
  /* BOTTONE MICROFONO NEON */
  .btn-mic { 
    background: rgba(59, 130, 246, 0.1); 
    border: 1px solid rgba(59, 130, 246, 0.2); 
    color: var(--primary); 
    border-radius: 12px; 
    width: 100%; 
    min-height: 80px; 
    cursor: pointer; 
    transition: all 0.3s ease; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
  }
  .btn-mic:hover { background: rgba(59, 130, 246, 0.2); border-color: var(--primary); }
  .btn-mic.active { 
    background: rgba(16, 185, 129, 0.1); 
    border-color: var(--success); 
    color: var(--success);
    box-shadow: 0 0 20px -5px rgba(16, 185, 129, 0.3);
  }
  
  .visualizer-container { height: 4px; background: #27272a; border-radius: 10px; width: 100%; overflow: hidden; position: relative; margin-top: 10px; }
  .visualizer-bar { height: 100%; background: var(--success); transition: width 0.05s linear; box-shadow: 0 0 10px var(--success); }
  .visualizer-threshold { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--error); z-index: 5; }

  /* DROP ZONE DARK */
  .drop-zone { 
    border: 2px dashed var(--border); 
    background: rgba(255,255,255,0.02); 
    border-radius: 12px; 
    padding: 10px; 
    text-align: center; 
    min-height: 80px; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    cursor: pointer; 
    transition: 0.2s; 
  }
  .drop-zone.drag-active { background: rgba(59, 130, 246, 0.1); border-color: var(--primary); }
  .drop-zone:hover { border-color: var(--text); }

  .barcode-list { display: flex; flex-direction: column; align-items: center; padding-top: 20vh; padding-bottom: 50vh; }
  .list-container { flex-grow: 1; overflow-y: auto; background: var(--bg); scroll-behavior: smooth; position: relative; }

  /* CARD STYLES */
  .barcode-card { 
      background: var(--card); 
      border: 1px solid var(--border);
      border-radius: 16px; 
      display: grid; 
      grid-template-columns: 80px 1fr; 
      width: 90%; max-width: 600px; margin-bottom: 40px; 
      overflow: hidden; cursor: pointer; 
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); 
      opacity: 0.2; transform: scale(0.9); filter: blur(4px) grayscale(100%); 
  }
  
  /* CARD ATTIVA */
  .barcode-card.active-focus { 
      opacity: 1; transform: scale(1.1); filter: none; 
      border: 1px solid var(--primary); 
      box-shadow: 0 0 40px -10px rgba(59, 130, 246, 0.3); 
      margin: 60px 0; z-index: 10; 
  }
  
  .barcode-card.active-focus svg { height: 140px !important; width: 100% !important; filter: invert(1); opacity: 0.9; }
  .barcode-card.active-focus .human-readable { font-size: 1.8rem; color: var(--primary); font-weight: 900; letter-spacing: 2px; text-shadow: 0 0 20px rgba(59,130,246,0.5); }
  .barcode-card.active-focus .zone-box { background: var(--primary); color: black; }
  
  /* Stati */
  .barcode-card.scanned { display: none; }
  .barcode-card.hidden { display: none; }

  .zone-box { background: var(--border); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; transition: background 0.3s; font-family: monospace; }
  .human-readable { font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 800; letter-spacing: 2px; color: var(--text); margin-top: 10px; transition: font-size 0.3s; }
  .details { font-size: 0.8rem; color: #71717a; margin-top: 5px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: monospace; }

  /* ZONE COLORS (Adattati al Dark) */
  .border-A { border-left: 4px solid #ef4444; } 
  .border-B { border-left: 4px solid #3b82f6; }
  .border-C { border-left: 4px solid #eab308; } 
  .border-D { border-left: 4px solid #a855f7; }
  .border-E { border-left: 4px solid #22c55e; } 
  .border-F { border-left: 4px solid #f97316; }
  .border-G { border-left: 4px solid #06b6d4; }

  .status-led { width: 8px; height: 8px; border-radius: 50%; background: #52525b; box-shadow: 0 0 5px rgba(0,0,0,0.5); transition: 0.1s; }
  .status-led.flash { background: #10b981; box-shadow: 0 0 15px #10b981; transform: scale(1.5); }

  .styled-select { 
    width: 100%; padding: 10px; 
    background-color: var(--bg); 
    border: 1px solid var(--border); 
    color: var(--text); 
    border-radius: 8px; font-size: 0.85rem; font-weight: bold; 
    outline: none;
  }
  
  /* Input Search Dark */
  .search-input {
    background: var(--card);
    border: 1px solid var(--border);
    color: white;
  }
  .search-input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

export default function GLSReader() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [scannedCount, setScannedCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  
  // MODIFICA: Default filter impostato su 'NS'
  const [filterLogic, setFilterLogic] = useState('NS'); 
  
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  // Audio Config
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [threshold, setThreshold] = useState(85);
  const [targetFreq, setTargetFreq] = useState(3000);
  const [ledActive, setLedActive] = useState(false);

  // Manual Modal
  const [showModal, setShowModal] = useState(false);
  const [manualData, setManualData] = useState({ sede: '', sped: '', collo: '1', tipo: '0', dest: '' });

  // Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const cooldownRef = useRef(false);

  // --- FILTRO LISTA ---
  const filteredList = useMemo(() => {
    return dataList.filter(item => {
      // 1. Filtro Ricerca
      const searchMatch = item.human.toLowerCase().includes(filterQuery) || item.zona.toLowerCase().includes(filterQuery);
      if (!searchMatch) return false;

      // 2. Filtro Logico (NS default)
      if (filterLogic === 'ALL') return true;
      
      const regexMap: Record<string, RegExp> = {
        'NS': /\*\s+N\s+S/,
        'SN': /\*\s+S\s+N/,
        'NN': /\*\s+N\s+N/,
        'SS': /\*\s+S\s+S/
      };
      
      // Se è un item manuale (che non ha raw text complesso), lo mostriamo sempre se il filtro non è esclusivo
      if (item.details === 'MANUALE') return true;

      return regexMap[filterLogic] ? regexMap[filterLogic].test(item.raw || '') : true;
    });
  }, [dataList, filterQuery, filterLogic]);

  // --- FOCUS & SCROLL ---
  const updateFocus = useCallback(() => {
    const firstPending = filteredList.find(item => item.status !== 'scanned');

    if (firstPending) {
        setActiveId(firstPending.id);
        setTimeout(() => {
            const el = document.querySelector(`[data-id="${firstPending.id}"]`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 50);
    } else {
        setActiveId(null);
    }
  }, [filteredList]);

  useEffect(() => {
    const t = setTimeout(updateFocus, 150);
    return () => clearTimeout(t);
  }, [updateFocus]);

  // --- SHORTCUTS TASTIERA ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (showModal) return;
        if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            if (activeId !== null) markAsDone(activeId);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId, showModal]); 

  // --- DRAG & DROP HANDLERS ---
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true); };
  const onDragLeave = () => setIsDragActive(false);
  const onDrop = (e: React.DragEvent) => {
      e.preventDefault(); setIsDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) readFile(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
  };
  const readFile = (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => processText(ev.target?.result as string);
      reader.readAsText(file);
  };

  // --- AUDIO DETECTION ---
  const toggleAudio = async () => {
    if (isListening) {
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsListening(false);
      setAudioLevel(0);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);

      const filter1 = ctx.createBiquadFilter(); filter1.type = "highpass"; filter1.frequency.value = 3500;
      const filter2 = ctx.createBiquadFilter(); filter2.type = "highpass"; filter2.frequency.value = 3500;
      const bpFilter = ctx.createBiquadFilter(); bpFilter.type = "bandpass"; bpFilter.frequency.value = targetFreq; bpFilter.Q.value = 5;
      const gainNode = ctx.createGain(); gainNode.gain.value = 10.0;

      source.connect(filter1); filter1.connect(filter2); filter2.connect(bpFilter); bpFilter.connect(gainNode); gainNode.connect(analyser);

      analyser.fftSize = 256;
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      setIsListening(true);
      detectSound();
    } catch (e) {
      alert("Errore microfono: " + e);
    }
  };

  const detectSound = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    const average = sum / dataArray.length;
    let visualVal = (average / 100) * 100;
    if (visualVal > 100) visualVal = 100;
    if (visualVal < 5) visualVal = 0;
    setAudioLevel(visualVal);

    if (visualVal > threshold && !cooldownRef.current) {
        triggerAction();
        cooldownRef.current = true;
        setTimeout(() => { cooldownRef.current = false; }, 600);
    }
    animationRef.current = requestAnimationFrame(detectSound);
  };

  const triggerAction = () => {
      setLedActive(true);
      setTimeout(() => setLedActive(false), 200);
      if (activeId !== null) markAsDone(activeId);
  };

  // --- PARSING ---
  const processText = (text: string) => {
      const lines = text.split('\n');
      const newData: any[] = [];
      const rowRegex = /^([a-zA-Z0-9]{2})\s+(\d{6,12})\s+(\d+)\s+(\d+)\s+([a-zA-Z0-9]{2,4})/;
      
      lines.forEach((line, idx) => {
          const clean = line.trim();
          if (!clean || clean.includes('---') || clean.includes('Sig  N.')) return;

          const match = clean.match(rowRegex);
          if (match) {
              const sigla = match[1].toUpperCase();
              let sped = match[2];
              const collo = match[3].padStart(2, '0');
              const tipo = match[4];
              const zona = match[5];

              if (sigla === 'WW' && sped.length < 9) sped = sped.padStart(9, '0');

              let details = clean.substring(match[0].length).trim()
                  .replace(/^[A-Z\s']+\*\s[S]\s[N]\s+/, '')
                  .replace(/^[A-Z\s']+\*\s[N]\s[S]\s+/, '');

              const charZone = zona.charAt(0).toUpperCase();
              
              newData.push({
                  id: Date.now() + idx,
                  raw: clean,
                  zona, sigla, sped, collo, tipo, details,
                  barcode: `${sigla}${sped}${collo}${tipo}${zona}`,
                  human: `${sigla} ${sped} ${collo} ${tipo} ${zona}`,
                  colorClass: `border-${charZone}`,
                  status: 'pending'
              });
          }
      });
      setDataList(newData);
      setScannedCount(0);
  };

  const markAsDone = (id: number) => {
      setDataList(prev => prev.map(item => {
          if (item.id === id && item.status !== 'scanned') {
              setScannedCount(c => c + 1);
              return { ...item, status: 'scanned' };
          }
          return item;
      }));
  };

  const addManual = () => {
      const { sede, sped, collo, tipo, dest } = manualData;
      if (!sede || !sped) return alert("Sede e Spedizione obbligatori");

      const finalSped = (sede.toUpperCase() === 'WW' && sped.length < 9) ? sped.padStart(9, '0') : sped;
      const finalCollo = collo.padStart(2, '0');
      const finalDest = dest.toUpperCase() || '???';
      
      const newItem = {
          id: Date.now(),
          raw: "GENERATO MANUALMENTE",
          zona: finalDest,
          sigla: sede.toUpperCase(),
          sped: finalSped,
          collo: finalCollo,
          tipo,
          details: "MANUALE",
          barcode: `${sede.toUpperCase()}${finalSped}${finalCollo}${tipo}${finalDest}`,
          human: `${sede.toUpperCase()} ${finalSped} ${finalCollo} ${tipo} ${finalDest}`,
          colorClass: `border-${finalDest.charAt(0)}`,
          status: 'pending'
      };

      setDataList(prev => [newItem, ...prev]);
      setShowModal(false);
      setManualData({ sede: '', sped: '', collo: '1', tipo: '0', dest: '' });
  };

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js" 
        strategy="afterInteractive" 
        onLoad={() => setIsScriptLoaded(true)}
      />

      <style jsx global>{styles}</style>

      <div className="flex flex-col h-screen overflow-hidden bg-black text-white font-sans selection:bg-blue-500/30">
        
        {/* HEADER */}
        <div className="top-section">
          <header className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
               <Link href="/" className="text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={20}/></Link>
               {/* TITOLO AGGIORNATO */}
               <h1 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                 <Terminal size={18} className="text-blue-500"/> Lettore Incongruenze
               </h1>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setShowModal(true)} className="bg-zinc-800 border border-zinc-700 hover:border-blue-500 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                 <Plus size={14} /> Manuale
               </button>
               <div className={`status-led ${ledActive ? 'flash' : ''}`}></div>
            </div>
          </header>

          <div className="control-card">
             <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={toggleAudio} className={`btn-mic ${isListening ? 'active' : ''}`}>
                   {isListening ? <Activity size={24} className="animate-pulse"/> : <MicOff size={24}/>}
                   <span className="text-[10px] font-bold uppercase tracking-widest mt-2">{isListening ? 'Ascolto Attivo' : 'Attiva Microfono'}</span>
                   <div className="visualizer-container">
                      <div className="visualizer-bar" style={{ width: `${audioLevel}%` }}></div>
                      <div className="visualizer-threshold" style={{ left: `${threshold}%` }}></div>
                   </div>
                </button>

                {/* DROP ZONE & BUTTONS */}
                <div 
                    className={`drop-zone ${isDragActive ? 'drag-active' : ''}`} 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                   <p className="font-bold text-blue-500 text-xs uppercase mb-2 flex items-center gap-2"><Upload size={14}/> Carica Dati</p>
                   
                   <div className="flex gap-2 w-full px-2">
                       <input type="file" id="fileUpload" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
                       
                       <button onClick={() => document.getElementById('fileUpload')?.click()} className="flex-1 bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
                           Sfoglia PC
                       </button>

                       <a href="search-ms:displayname=Risultati%20ricerca%20in%20%5C%5C10.58.125.2%5Cpc&crumb=System.Generic.String%3Anatana&crumb=location:%5C%5C10.58.125.2%5Cpc" target="_blank" className="flex-1 bg-blue-900/30 border border-blue-500/30 px-2 py-1 rounded text-[10px] font-bold text-blue-400 text-center hover:bg-blue-500/20 hover:border-blue-500 transition-all flex items-center justify-center">
                           Apri Server
                       </a>
                   </div>
                   
                   <span className="text-[9px] text-zinc-600 mt-2">Trascina .txt o .csv qui</span>
                </div>
             </div>

             {/* FILTRI E STATISTICHE */}
             <div className="border-t border-zinc-800 pt-3 grid grid-cols-2 gap-4 items-center">
                <div>
                   <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Filtro Sequenza</label>
                   <select className="styled-select" value={filterLogic} onChange={e => setFilterLogic(e.target.value)}>
                      <option value="NS">✱ N S (Richiesto)</option>
                      <option value="SN">✱ S N (Standard)</option>
                      <option value="NN">✱ N N</option>
                      <option value="SS">✱ S S</option>
                      <option value="ALL">Mostra Tutto</option>
                   </select>
                </div>
                <div className="text-right text-xs text-zinc-500 font-mono">
                   <div>TOTALE: <b className="text-white">{dataList.length}</b></div>
                   <div className="text-emerald-500">FATTI: <b>{scannedCount}</b></div>
                </div>
             </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16}/>
            <input 
              type="text" 
              placeholder="Cerca spedizione..." 
              value={filterQuery}
              onChange={e => { setFilterQuery(e.target.value.toLowerCase()); }}
              className="search-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider outline-none transition-all"
            />
          </div>
        </div>

        {/* LISTA SCORREVOLE */}
        <div className="list-container" id="scrollContainer">
           <div className="barcode-list">
              {filteredList.length === 0 && (
                 <div className="flex flex-col items-center justify-center mt-20 opacity-30">
                    <FileText size={48} className="mb-4 text-zinc-600"/>
                    <p className="text-sm font-bold text-zinc-500">Nessun dato da mostrare</p>
                    <p className="text-[10px] text-zinc-600">Carica un file o cambia filtri</p>
                 </div>
              )}
              
              {filteredList.map(item => {
                 const isActive = activeId === item.id;
                 const classes = `barcode-card ${item.colorClass} ${item.status === 'scanned' ? 'scanned' : ''} ${isActive ? 'active-focus' : ''}`;

                 return (
                    <div key={item.id} data-id={item.id} className={classes} onClick={() => markAsDone(item.id)}>
                       <div className="zone-box">
                          <h2 className="text-4xl font-black m-0 leading-none text-white">{item.zona}</h2>
                          <span className="text-[10px] font-bold opacity-50 mt-1">ZONA</span>
                       </div>
                       <div className="p-4 text-center flex flex-col items-center justify-center bg-zinc-950">
                          <BarcodeCanvas text={item.barcode} ready={isScriptLoaded} />
                          <div className="human-readable">{item.human}</div>
                          <div className="details">{item.details}</div>
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>

        {/* MODALE MANUALE */}
        {showModal && (
           <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex justify-center items-center p-6">
              <div className="bg-zinc-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-200">
                 <h3 className="text-white font-black uppercase text-lg border-b border-zinc-800 pb-4 mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-blue-500"/> Nuovo Pacco
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Sede</label>
                       <input className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white uppercase focus:border-blue-500 outline-none" maxLength={4} placeholder="AB" value={manualData.sede} onChange={e => setManualData({...manualData, sede: e.target.value.toUpperCase()})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Spedizione</label>
                       <input className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white focus:border-blue-500 outline-none" maxLength={9} placeholder="123456789" value={manualData.sped} onChange={e => setManualData({...manualData, sped: e.target.value.replace(/\D/g,'')})} />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3 mb-4">
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Collo</label><input type="number" className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white text-center" value={manualData.collo} onChange={e => setManualData({...manualData, collo: e.target.value})} /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Tipo</label><input maxLength={1} className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white text-center" value={manualData.tipo} onChange={e => setManualData({...manualData, tipo: e.target.value})} /></div>
                    <div><label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Dest</label><input maxLength={4} className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white uppercase text-center" placeholder="V3" value={manualData.dest} onChange={e => setManualData({...manualData, dest: e.target.value.toUpperCase()})} /></div>
                 </div>

                 <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-6 h-24 overflow-hidden">
                    <BarcodeCanvas 
                        text={`
                            ${manualData.sede.toUpperCase()}
                            ${(manualData.sede.toUpperCase() === 'WW' && manualData.sped.length < 9) 
                                ? manualData.sped.padStart(9, '0') 
                                : manualData.sped.padEnd(9, '0')
                            }
                            ${manualData.collo.padStart(2,'0')}
                            ${manualData.tipo}
                            ${manualData.dest.toUpperCase()}
                        `.replace(/\s/g, '')} 
                        ready={isScriptLoaded} 
                    />
                 </div>

                 <div className="flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-zinc-800 font-bold text-zinc-400 rounded-xl text-xs uppercase hover:bg-zinc-700 transition-colors">Annulla</button>
                    <button onClick={addManual} className="flex-1 py-3 bg-blue-600 font-bold text-white rounded-xl text-xs uppercase shadow-lg shadow-blue-900/20 hover:bg-blue-500 transition-colors">Aggiungi</button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </>
  );
}

// Componente Barcode Sicuro (Invertito per Dark Mode)
const BarcodeCanvas = ({ text, ready }: { text: string, ready: boolean }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        const draw = () => {
            if ((window as any).JsBarcode && svgRef.current && text) {
                try {
                    (window as any).JsBarcode(svgRef.current, text, {
                        format: "CODE128", 
                        width: 4, 
                        height: 100, 
                        displayValue: false, 
                        margin: 0,
                        lineColor: "#000" // Il barcode resta nero perché sta su sfondo bianco (nella card e nel modale)
                    });
                } catch(e) {}
            }
        };

        if (ready) {
            draw();
        } else {
            const t = setTimeout(draw, 500);
            return () => clearTimeout(t);
        }
    }, [text, ready]);

    return <svg ref={svgRef} className="w-full h-full"></svg>;
};