'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Script from 'next/script';
import Link from 'next/link';

/* STILI CSS INLINE */
const styles = `
  :root { --primary: #0b2d51; --accent: #fdb913; --bg: #f0f2f5; --success: #28a745; --error: #dc3545; --white: #fff; }
  
  .top-section { background: var(--bg); padding: 10px 15px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); z-index: 200; position: relative; }
  .control-card { background: var(--white); border-radius: 12px; padding: 15px; border-top: 4px solid var(--primary); box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 10px; }
  
  .btn-mic { background: linear-gradient(135deg, #6c757d, #495057); color: white; border: none; padding: 12px; border-radius: 8px; width: 100%; min-height: 80px; cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .btn-mic.active { background: linear-gradient(135deg, #28a745, #218838); box-shadow: 0 0 15px rgba(40,167,69,0.4); transform: translateY(-1px); }
  
  .visualizer-container { height: 6px; background: #e9ecef; border-radius: 10px; width: 100%; overflow: hidden; position: relative; margin-top: 8px; }
  .visualizer-bar { height: 100%; background: linear-gradient(90deg, var(--accent), var(--success)); transition: width 0.05s linear; }
  .visualizer-threshold { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--error); z-index: 5; }

  /* DROP ZONE AGGIORNATA */
  .drop-zone { border: 2px dashed #cbd5e0; background: #f8f9fa; border-radius: 8px; padding: 10px; text-align: center; min-height: 80px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; transition: 0.2s; }
  .drop-zone.drag-active { background: #e8f0fe; border-color: var(--primary); transform: scale(1.02); }
  .drop-zone:hover { border-color: var(--primary); }

  /* Lista con padding extra per centratura verticale perfetta */
  .barcode-list { display: flex; flex-direction: column; align-items: center; padding-top: 50vh; padding-bottom: 50vh; }
  .list-container { flex-grow: 1; overflow-y: auto; background: #e2e6ea; scroll-behavior: smooth; position: relative; height: 100%; }

  /* CARD STYLES - Molto sfocate quando inattive */
  .barcode-card { 
      background: white; border-radius: 8px; display: grid; grid-template-columns: 80px 1fr; 
      width: 90%; max-width: 700px; margin-bottom: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
      overflow: hidden; cursor: pointer; border-left: 6px solid #ccc; 
      transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); 
      opacity: 0.15; transform: scale(0.9); filter: blur(6px) grayscale(100%); /* SFOCATURA FORTE */
  }
  
  /* CARD ATTIVA - GIGANTE E NITIDA */
  .barcode-card.active-focus { 
      opacity: 1; transform: scale(1.3); filter: none; 
      border: 4px solid var(--accent); 
      box-shadow: 0 30px 80px rgba(0,0,0,0.4); 
      margin: 100px 0; z-index: 100; position: relative; 
  }
  
  /* Barcode SVG Gigante nella card attiva */
  .barcode-card.active-focus svg { height: 180px !important; width: 100% !important; }
  .barcode-card.active-focus .human-readable { font-size: 2.2rem; color: var(--primary); font-weight: 900; margin-top: 15px; }
  .barcode-card.active-focus .zone-box { background: var(--primary); }
  .barcode-card.active-focus .details { font-size: 1rem; color: #333; font-weight: bold; }

  /* Stati */
  .barcode-card.scanned { display: none; }
  .barcode-card.hidden { display: none; }

  .zone-box { background: var(--primary); color: var(--accent); display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; transition: background 0.3s; }
  .human-readable { font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 800; letter-spacing: 2px; color: var(--primary); margin-top: 10px; transition: font-size 0.3s; }
  .details { font-size: 0.8rem; color: #888; margin-top: 5px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* COLORI ZONE */
  .border-A { border-left-color: #dc3545; } 
  .border-B { border-left-color: #0d6efd; }
  .border-C { border-left-color: #ffc107; } 
  .border-D { border-left-color: #6f42c1; }
  .border-E { border-left-color: #198754; } 
  .border-F { border-left-color: #fd7e14; }
  .border-G { border-left-color: #0dcaf0; }

  .status-led { width: 10px; height: 10px; border-radius: 50%; background: #ddd; border: 2px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.1); transition: 0.1s; }
  .status-led.flash { background: #28a745; box-shadow: 0 0 10px #28a745; transform: scale(1.5); }

  .styled-select { width: 100%; padding: 8px; border: 1px solid #ced4da; border-radius: 6px; background-color: #fff; font-size: 0.9rem; font-weight: bold; color: #333; }
`;

export default function GLSReader() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [scannedCount, setScannedCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterLogic, setFilterLogic] = useState('ALL'); 
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
      const searchMatch = item.human.toLowerCase().includes(filterQuery) || item.zona.toLowerCase().includes(filterQuery);
      if (!searchMatch) return false;

      if (filterLogic === 'ALL') return true;
      const regexMap: Record<string, RegExp> = {
        'NS': /\*\s+N\s+S/,
        'SN': /\*\s+S\s+N/,
        'NN': /\*\s+N\s+N/,
        'SS': /\*\s+S\s+S/
      };
      return regexMap[filterLogic] ? regexMap[filterLogic].test(item.raw || '') : true;
    });
  }, [dataList, filterQuery, filterLogic]);

  // --- FOCUS & SCROLL (Centratura Migliorata) ---
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
  const onDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
  };
  const onDragLeave = () => setIsDragActive(false);
  
  const onDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
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

      <div className="flex flex-col h-screen overflow-hidden bg-[#f0f2f5] text-gray-800 font-sans">
        
        {/* HEADER */}
        <div className="top-section">
          <header className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
               <Link href="/" className="no-underline text-xl">🏠</Link>
               <h1 className="text-xl font-extrabold text-[#0b2d51] uppercase m-0">Lettore GLS</h1>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setShowModal(true)} className="bg-[#fdb913] text-[#0b2d51] border-none px-4 py-2 rounded-full font-bold text-sm cursor-pointer shadow-sm">+ Manuale</button>
               <div className={`status-led ${ledActive ? 'flash' : ''}`}></div>
            </div>
          </header>

          <div className="control-card">
             <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={toggleAudio} className={`btn-mic ${isListening ? 'active' : ''}`}>
                   <span className="text-2xl">🎙️</span>
                   <span className="text-xs font-bold uppercase tracking-wide">{isListening ? 'ASCOLTO ATTIVO' : 'ATTIVA ASCOLTO'}</span>
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
                   <p className="font-bold text-[#0b2d51] text-xs uppercase mb-2">📂 Area Caricamento</p>
                   
                   <div className="flex gap-2 w-full px-2">
                       {/* Input File Nascosto */}
                       <input type="file" id="fileUpload" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
                       
                       {/* Pulsante Sfoglia PC */}
                       <button onClick={() => document.getElementById('fileUpload')?.click()} className="flex-1 bg-white border border-gray-300 px-2 py-1 rounded text-[10px] font-bold text-gray-600 cursor-pointer hover:bg-gray-50">
                           Sfoglia PC
                       </button>

                       {/* Link Apri Server (Windows) */}
                       <a href="search-ms:displayname=Risultati%20ricerca%20in%20%5C%5C10.58.125.2%5Cpc&crumb=System.Generic.String%3Anatana&crumb=location:%5C%5C10.58.125.2%5Cpc" target="_blank" className="flex-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded text-[10px] font-bold text-blue-700 text-center no-underline hover:bg-blue-100 flex items-center justify-center">
                           Apri Server
                       </a>
                   </div>
                   
                   <span className="text-[9px] text-gray-400 mt-2">Trascina qui il file</span>
                </div>
             </div>

             {/* FILTRI E STATISTICHE */}
             <div className="border-t border-dashed border-gray-200 pt-3 grid grid-cols-2 gap-4 items-center">
                <div>
                   <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Filtro Sequenza</label>
                   <select className="styled-select" value={filterLogic} onChange={e => setFilterLogic(e.target.value)}>
                      <option value="ALL">Mostra Tutto</option>
                      <option value="NS">✱ N S (Richiesto)</option>
                      <option value="SN">✱ S N (Standard)</option>
                      <option value="NN">✱ N N</option>
                      <option value="SS">✱ S S</option>
                   </select>
                </div>
                <div className="text-right text-xs text-gray-500">
                   <div>Totale: <b>{dataList.length}</b></div>
                   <div className="text-green-600 font-bold">Fatti: {scannedCount}</div>
                </div>
             </div>
          </div>

          <input 
            type="text" 
            placeholder="🔍 Cerca spedizione o zona..." 
            value={filterQuery}
            onChange={e => { setFilterQuery(e.target.value.toLowerCase()); }}
            className="w-full p-3 rounded-lg border border-gray-300 text-lg font-bold outline-none focus:border-[#0b2d51] shadow-sm"
          />
        </div>

        {/* LISTA SCORREVOLE */}
        <div className="list-container" id="scrollContainer">
           <div className="barcode-list">
              {filteredList.length === 0 && (
                 <div className="text-center text-gray-400 mt-20 italic">Nessun dato (o filtro attivo).</div>
              )}
              
              {filteredList.map(item => {
                 const isActive = activeId === item.id;
                 const classes = `barcode-card ${item.colorClass} ${item.status === 'scanned' ? 'scanned' : ''} ${isActive ? 'active-focus' : ''}`;

                 return (
                    <div key={item.id} data-id={item.id} className={classes} onClick={() => markAsDone(item.id)}>
                       <div className="zone-box">
                          <h2 className="text-4xl font-black m-0 leading-none">{item.zona}</h2>
                          <span className="text-[10px] font-bold opacity-80 mt-1">ZONA</span>
                       </div>
                       <div className="p-4 text-center flex flex-col items-center justify-center">
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
           <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl border-t-4 border-[#fdb913] animate-in slide-in-from-bottom-10 fade-in duration-300">
                 <h3 className="text-[#0b2d51] font-black uppercase text-lg border-b pb-2 mb-4">Generazione Manuale</h3>
                 
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                       <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Sede (2-4)</label>
                       <input className="w-full border p-2 rounded font-bold uppercase" maxLength={4} placeholder="AB" value={manualData.sede} onChange={e => setManualData({...manualData, sede: e.target.value.toUpperCase()})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">N. Sped (Max 9)</label>
                       <input className="w-full border p-2 rounded font-bold" maxLength={9} placeholder="123456789" value={manualData.sped} onChange={e => setManualData({...manualData, sped: e.target.value.replace(/\D/g,'')})} />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3 mb-4">
                    <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Collo</label><input type="number" className="w-full border p-2 rounded font-bold" value={manualData.collo} onChange={e => setManualData({...manualData, collo: e.target.value})} /></div>
                    <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Tipo</label><input maxLength={1} className="w-full border p-2 rounded font-bold" value={manualData.tipo} onChange={e => setManualData({...manualData, tipo: e.target.value})} /></div>
                    <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Dest</label><input maxLength={4} className="w-full border p-2 rounded font-bold uppercase" placeholder="V3" value={manualData.dest} onChange={e => setManualData({...manualData, dest: e.target.value.toUpperCase()})} /></div>
                 </div>

                 <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center mb-4 border border-dashed border-gray-300 h-24">
                    {/* ANTEPRIMA CON REGOLA WW */}
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
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 font-bold text-gray-600 rounded-lg cursor-pointer hover:bg-gray-200">Annulla</button>
                    <button onClick={addManual} className="flex-1 py-3 bg-[#0b2d51] text-white font-bold rounded-lg cursor-pointer hover:bg-[#1a4a7a] shadow-lg">Aggiungi</button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </>
  );
}

// Componente Barcode Sicuro (CORRETTO PER TYPESCRIPT)
const BarcodeCanvas = ({ text, ready }: { text: string, ready: boolean }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    useEffect(() => {
        const draw = () => {
            if ((window as any).JsBarcode && svgRef.current && text) {
                try {
                    (window as any).JsBarcode(svgRef.current, text, {
                        format: "CODE128", 
                        width: 4, // LARGO
                        height: 150, // ALTO
                        displayValue: false, 
                        margin: 0
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