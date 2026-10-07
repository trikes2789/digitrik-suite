'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Script from 'next/script';
import { 
  Upload, Search, Plus, 
  Terminal, FileText, Settings 
} from 'lucide-react';

/* STILI CSS INLINE - TEMA AMBRA UNIFORME */
const stiliCSS = `
  :root { 
    --bg: #09090b; 
    --card-dark: #18181b; 
    --card-light: #ffffff; 
    --border: #27272a; 
    --text-main: #e4e4e7; 
    --text-card: #18181b; 
    --primary: #f59e0b; 
    --primary-glow: rgba(245, 158, 11, 0.5);
    --primary-dim: rgba(245, 158, 11, 0.1);
    --success: #10b981; 
    --error: #ef4444; 
  }
  
  body { background-color: var(--bg); color: var(--text-main); overflow: hidden; }

  .top-section { 
    background: rgba(9, 9, 11, 0.95); 
    border-bottom: 1px solid var(--border);
    padding: 15px; 
    z-index: 50; 
    position: relative; 
    flex-shrink: 0; 
  }

  .control-card { 
    background: var(--card-dark); 
    border: 1px solid var(--border); 
    border-radius: 16px; 
    padding: 16px; 
    margin-bottom: 12px;
    box-shadow: 0 4px 20px -10px rgba(0,0,0,0.5);
  }
  
  .settings-box { 
    background: var(--primary-dim); 
    border: 1px solid rgba(245, 158, 11, 0.2); 
    color: var(--primary); 
    border-radius: 12px; 
    width: 100%; 
    min-height: 80px; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    padding: 10px;
  }
  .settings-input {
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--primary);
    color: white;
    text-align: center;
    font-weight: bold;
    border-radius: 8px;
    padding: 4px;
    width: 60px;
    margin-top: 5px;
    outline: none;
    text-transform: uppercase;
  }

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
    transition: 0.1s; 
  }
  .drop-zone.drag-active { background: var(--primary-dim); border-color: var(--primary); }
  .drop-zone:hover { border-color: var(--primary); }

  .list-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    position: relative;
    background: #000;
    height: calc(100vh - 280px);
  }

  .barcode-list { 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    padding-top: 20px; 
    padding-bottom: 300px; 
    min-height: 100%;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #52525b;
    text-align: center;
    padding: 20px;
  }

  .barcode-card { 
      background: var(--card-light); 
      color: var(--text-card); 
      border-radius: 12px; 
      display: grid; 
      grid-template-columns: 90px 1fr;
      width: 95%; max-width: 650px; 
      margin-bottom: 20px; 
      overflow: hidden; cursor: pointer; 
      transition: all 0.1s ease-out; 
      opacity: 0.3; transform: scale(0.95); filter: blur(3px) grayscale(100%); 
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }
  
  .barcode-card.active-focus { 
      opacity: 1; transform: scale(1.05); filter: none; 
      border: 4px solid var(--primary); 
      box-shadow: 0 0 50px -10px var(--primary-glow); 
      margin: 40px 0; z-index: 10; 
  }
  
  .barcode-card.active-focus svg { height: 180px !important; width: auto !important; max-width: 90%; filter: none; opacity: 1; }
  .barcode-card.active-focus .human-readable { font-size: 2rem; color: #000; font-weight: 900; letter-spacing: 2px; }
  .barcode-card.active-focus .zone-box { background: var(--primary); color: black; }
  
  .barcode-card.scanned { display: none; }

  .zone-box { background: #e4e4e7; color: #18181b; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; transition: background 0.1s; font-family: monospace; border-right: 1px solid #d4d4d8; }
  
  .human-readable { font-family: 'Courier New', monospace; font-size: 1.2rem; font-weight: 800; letter-spacing: 1px; color: #3f3f46; margin-top: 5px; transition: font-size 0.1s; }
  .details { font-size: 0.8rem; color: #71717a; margin-top: 5px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: monospace; font-weight: bold; }

  .border-V { border-left: 6px solid #eab308; } 
  .border-D { border-left: 6px solid #3b82f6; }

  .search-input { background: var(--card-dark); border: 1px solid var(--border); color: white; }
  .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 2px var(--primary-dim); }
`;

export default function GeneratoreSpedizioni() {
  const [dataList, setDataList] = useState<any[]>([]);
  const [scannedCount, setScannedCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const [sedeDestinataria, setSedeDestinataria] = useState('V8');
  const [showModal, setShowModal] = useState(false);
  const [manualData, setManualData] = useState({ sede: '', sped: '', collo: '1', tipo: '0', dest: 'V8' });

  // Funzione di spunta
  const markAsDone = useCallback((id: string) => {
      setDataList(prev => prev.map(item => {
          if (item.id === id && item.status !== 'scanned') {
              setScannedCount(c => c + 1);
              return { ...item, status: 'scanned' };
          }
          return item;
      }));
  }, []);

  // Filtro
  const filteredList = useMemo(() => {
    return dataList.filter(item => {
      return item.human.toLowerCase().includes(filterQuery) || item.zona.toLowerCase().includes(filterQuery);
    });
  }, [dataList, filterQuery]);

  // Focus
  const updateFocus = useCallback(() => {
    const firstPending = filteredList.find(item => item.status !== 'scanned');
    if (firstPending) {
        setActiveId(firstPending.id);
        setTimeout(() => {
            const el = document.querySelector(`[data-id="${firstPending.id}"]`);
            if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }, 10);
    } else {
        setActiveId(null);
    }
  }, [filteredList]);

  useEffect(() => {
    const t = setTimeout(updateFocus, 0); 
    return () => clearTimeout(t);
  }, [updateFocus]);

  // Tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (showModal) return;
        if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            if (activeId !== null) {
                markAsDone(activeId);
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeId, showModal, markAsDone]); 

  // Eventi Drag & Drop
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

  // Parsing del TXT
  const processText = (text: string) => {
      const lines = text.split('\n');
      const newData: any[] = [];
      const regex = /(\d+)\s+[\d,]+\s+([A-Z0-9]{2})\s*(\d+)\s*$/;
      
      lines.forEach((line, idx) => {
          const match = line.match(regex);
          if (match) {
              const colliTotali = parseInt(match[1], 10);
              const sedeMittente = match[2].toUpperCase();
              const numeroSpedizione = match[3];
              const destMatch = line.substring(36, 62).trim(); 
              
              for (let i = 1; i <= colliTotali; i++) {
                  const progressivoCollo = i.toString().padStart(2, '0');
                  const tipo = '0';
                  const zona = sedeDestinataria.toUpperCase() || 'V8';
                  
                  const barcodeString = `${sedeMittente}${numeroSpedizione}${progressivoCollo}${tipo}${zona}`;
                  const humanString = `${sedeMittente} ${numeroSpedizione} ${progressivoCollo} ${tipo} ${zona}`;

                  newData.push({
                      id: `${Date.now()}-${idx}-${i}`,
                      raw: line,
                      zona: zona,
                      sigla: sedeMittente,
                      sped: numeroSpedizione,
                      collo: progressivoCollo,
                      tipo: tipo,
                      details: `Collo ${i} di ${colliTotali} - ${destMatch || 'Sconosciuto'}`,
                      barcode: barcodeString,
                      human: humanString,
                      colorClass: `border-${zona.charAt(0)}`,
                      status: 'pending'
                  });
              }
          }
      });
      setDataList(newData);
      setScannedCount(0);
  };

  // Aggiunta manuale
  const addManual = () => {
      const { sede, sped, collo, tipo, dest } = manualData;
      if (!sede || !sped) return alert("Sede e Spedizione obbligatori");

      const finalCollo = collo.padStart(2, '0');
      const finalDest = dest.toUpperCase() || 'V8';
      
      const newItem = {
          id: `manual-${Date.now()}`,
          raw: "GENERATO MANUALMENTE",
          zona: finalDest,
          sigla: sede.toUpperCase(),
          sped: sped,
          collo: finalCollo,
          tipo,
          details: "INSERIMENTO MANUALE",
          barcode: `${sede.toUpperCase()}${sped}${finalCollo}${tipo}${finalDest}`,
          human: `${sede.toUpperCase()} ${sped} ${finalCollo} ${tipo} ${finalDest}`,
          colorClass: `border-${finalDest.charAt(0)}`,
          status: 'pending'
      };

      setDataList(prev => [newItem, ...prev]);
      setShowModal(false);
  };

  // Testo preprocessato per il Canvas del Modale (evita espressioni JS complesse nel JSX)
  const testoBarcodeManuale = `${manualData.sede.toUpperCase()}${manualData.sped}${manualData.collo.padStart(2,'0')}${manualData.tipo}${manualData.dest.toUpperCase()}`.replace(/\s/g, '');

  return (
    <>
      <Script 
        src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js" 
        strategy="afterInteractive" 
        onLoad={() => setIsScriptLoaded(true)}
      />

      <style dangerouslySetInnerHTML={{ __html: stiliCSS }} />

      <div className="flex flex-col h-screen overflow-hidden bg-black text-white font-sans selection:bg-amber-500/30">
        
        {/* HEADER */}
        <div className="top-section">
          <header className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
               <h1 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                 <Terminal size={18} className="text-amber-500"/> Generatore Barcode
               </h1>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => setShowModal(true)} className="bg-zinc-800 border border-zinc-700 hover:border-amber-500 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                 <Plus size={14} /> Manuale
               </button>
            </div>
          </header>

          <div className="control-card">
             <div className="grid grid-cols-2 gap-4 mb-4">
                
                <div className="settings-box">
                   <Settings size={20} className="mb-1" />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Sede Destinataria</span>
                   <input 
                     type="text" 
                     value={sedeDestinataria} 
                     onChange={(e) => setSedeDestinataria(e.target.value)} 
                     maxLength={2}
                     className="settings-input"
                   />
                </div>

                <div 
                    className={`drop-zone ${isDragActive ? 'drag-active' : ''}`} 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                   <p className="font-bold text-amber-500 text-xs uppercase mb-2 flex items-center gap-2"><Upload size={14}/> Carica Natana.txt</p>
                   <div className="flex gap-2 w-full px-2">
                       <input type="file" id="fileUpload" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
                       <button onClick={() => document.getElementById('fileUpload')?.click()} className="flex-1 bg-zinc-800 border border-zinc-700 px-2 py-1.5 rounded text-[10px] font-bold text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
                           Sfoglia PC
                       </button>
                   </div>
                </div>
             </div>

             <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                    Premi <span className="bg-zinc-800 text-white px-2 py-1 rounded">SPAZIO</span> per marcare
                </div>
                <div className="text-right text-xs text-zinc-500 font-mono">
                   <div>DA FARE: <b className="text-white">{dataList.length - scannedCount}</b></div>
                   <div className="text-emerald-500">COMPLETATI: <b>{scannedCount}</b></div>
                </div>
             </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16}/>
            <input 
              type="text" 
              placeholder="Cerca numero o sede..." 
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value.toLowerCase())}
              className="search-input w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider outline-none transition-all"
            />
          </div>
        </div>

        {/* LISTA SCORREVOLE */}
        <div className="list-wrapper" id="scrollContainer">
           <div className="barcode-list">
              {filteredList.length === 0 && (
                 <div className="empty-state">
                    <FileText size={48} className="mb-4 text-zinc-700"/>
                    <p className="text-sm font-bold text-zinc-500">Carica il file di testo</p>
                    <p className="text-[10px] text-zinc-600 mt-1">Trascina natana.txt nel box in alto</p>
                 </div>
              )}
              
              {filteredList.map(item => {
                 const isActive = activeId === item.id;
                 const classes = `barcode-card ${item.colorClass} ${item.status === 'scanned' ? 'scanned' : ''} ${isActive ? 'active-focus' : ''}`;

                 return (
                    <div key={item.id} data-id={item.id} className={classes} onClick={() => markAsDone(item.id)}>
                       <div className="zone-box">
                          <h2 className="text-4xl font-black m-0 leading-none text-white">{item.zona}</h2>
                          <span className="text-[10px] font-bold opacity-50 mt-1">DEST.</span>
                       </div>
                       <div className="p-6 text-center flex flex-col items-center justify-center">
                          <BarcodeCanvas text={item.barcode} ready={isScriptLoaded} options={{ height: 180, width: 2.5 }} />
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
                    <Plus size={18} className="text-amber-500"/> Nuovo Barcode
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Sede Mitt.</label>
                       <input className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white uppercase focus:border-amber-500 outline-none" maxLength={2} placeholder="E9" value={manualData.sede} onChange={(e) => setManualData({...manualData, sede: e.target.value.toUpperCase()})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Spedizione</label>
                       <input className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white focus:border-amber-500 outline-none" maxLength={9} placeholder="260246453" value={manualData.sped} onChange={(e) => setManualData({...manualData, sped: e.target.value.replace(/\D/g,'')})} />
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Prog. Collo</label>
                       <input type="number" className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white text-center" value={manualData.collo} onChange={(e) => setManualData({...manualData, collo: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Tipo</label>
                       <input maxLength={1} className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white text-center" value={manualData.tipo} onChange={(e) => setManualData({...manualData, tipo: e.target.value})} />
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Dest.</label>
                       <input maxLength={2} className="w-full bg-black border border-zinc-800 p-2 rounded-lg font-bold text-white uppercase text-center" placeholder="V8" value={manualData.dest} onChange={(e) => setManualData({...manualData, dest: e.target.value.toUpperCase()})} />
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-xl flex items-center justify-center mb-6 h-24 overflow-hidden border border-zinc-700">
                    <BarcodeCanvas 
                        text={testoBarcodeManuale} 
                        ready={isScriptLoaded}
                        options={{ height: 80, width: 2 }}
                    />
                 </div>

                 <div className="flex gap-3">
                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-zinc-800 font-bold text-zinc-400 rounded-xl text-xs uppercase hover:bg-zinc-700 transition-colors">Annulla</button>
                    <button onClick={addManual} className="flex-1 py-3 bg-amber-600 font-bold text-white rounded-xl text-xs uppercase shadow-lg shadow-amber-900/20 hover:bg-amber-500 transition-colors">Aggiungi</button>
                 </div>
              </div>
           </div>
        )}

      </div>
    </>
  );
}

// Componente Barcode Flessibile
const BarcodeCanvas = ({ text, ready, options }: { text: string, ready: boolean, options?: any }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    
    const defaults = {
        format: "CODE128", 
        width: 3, 
        height: 180, 
        displayValue: false, 
        margin: 0,
        lineColor: "#000000",
        background: "#ffffff"
    };

    const finalOptions = { ...defaults, ...options };

    useEffect(() => {
        const draw = () => {
            if ((window as any).JsBarcode && svgRef.current && text) {
                try {
                    (window as any).JsBarcode(svgRef.current, text, finalOptions);
                } catch(e) {}
            }
        };

        if (ready) {
            draw();
        } else {
            const t = setTimeout(draw, 500);
            return () => clearTimeout(t);
        }
    }, [text, ready, finalOptions]); 

    return <svg ref={svgRef} className="w-full h-full" />;
};