'use client';

import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, Download, AlertTriangle, 
  Clock, Hash, Box, Scale, Activity, Search, Calculator, Calendar
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
    --primary-dim: rgba(245, 158, 11, 0.1);
    --success: #10b981; 
    --error: #ef4444; 
    --error-dim: rgba(239, 68, 68, 0.1);
  }

  body { background-color: var(--bg); color: var(--text-main); overflow: hidden; font-family: sans-serif; }

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

  .drop-zone { 
    border: 2px dashed var(--border); 
    background: rgba(255,255,255,0.02); 
    border-radius: 12px; 
    padding: 20px; 
    text-align: center; 
    min-height: 80px; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    cursor: pointer; 
    transition: 0.2s; 
  }
  .drop-zone.drag-active { background: var(--primary-dim); border-color: var(--primary); }
  .drop-zone:hover { border-color: var(--primary); }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
  }

  .stat-card {
    background: var(--card-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .stat-card.alert { border-color: var(--error); background: var(--error-dim); }

  .stat-icon { position: absolute; top: 12px; right: 12px; opacity: 0.15; }
  .stat-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; color: #71717a; letter-spacing: 1px; margin-bottom: 2px; }
  .stat-value { font-size: 1.5rem; font-weight: 900; color: var(--text-main); line-height: 1; margin-bottom: 2px; }
  .stat-sub { font-size: 0.7rem; color: #a1a1aa; font-family: monospace; }

  /* COMPONENTI PER CONFRONTO GIORNALIERO */
  .daily-comparison-wrapper {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 12px;
    margin-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }
  .daily-card {
    min-width: 260px;
    background: #121214;
    border: 1px solid var(--border);
    border-top: 3px solid var(--primary);
    border-radius: 12px;
    padding: 14px;
    flex-shrink: 0;
  }
  .daily-header {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .daily-header h3 { font-size: 1rem; font-weight: 900; color: white; margin: 0; }
  .daily-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    margin-bottom: 6px;
    font-family: monospace;
  }
  .daily-label { color: #a1a1aa; }
  .daily-val { font-weight: bold; color: white; }

  .text-primary { color: var(--primary) !important; }
  .text-error { color: var(--error) !important; }
  .text-emerald { color: var(--success) !important; }
  .text-purple { color: #c084fc !important; }

  .search-wrapper {
    padding: 0 20px 10px 20px;
    position: relative;
  }
  .search-input {
    width: 100%;
    background: var(--card-dark);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 10px 10px 38px;
    color: white;
    outline: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8rem;
    transition: 0.2s;
  }
  .search-input:focus { border-color: var(--primary); }
  .search-icon { position: absolute; left: 32px; top: 50%; transform: translateY(-50%); color: #71717a; }

  .list-wrapper {
    flex-grow: 1;
    overflow-y: auto;
    background: #000;
    height: 0; 
    padding: 0 20px 20px 20px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: monospace;
    font-size: 0.8rem;
  }
  .data-table th { background: var(--bg); color: var(--primary); padding: 10px; text-align: left; position: sticky; top: 0px; z-index: 10; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 8px 10px; border-bottom: 1px solid var(--border); color: #a1a1aa; }
  .data-table tr:hover td { background: var(--card-dark); color: white; }
  .row-duplicate { background: rgba(239, 68, 68, 0.05); }
  .row-duplicate td { color: var(--error); }
  
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #52525b; text-align: center; margin-top: 40px;
  }
`;

export default function GeneratoreLavorazioniCSV() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [filesCaricati, setFilesCaricati] = useState<string[]>([]);
  const [datiFusi, setDatiFusi] = useState<any[]>([]);
  const [ricercaSpedizione, setRicercaSpedizione] = useState('');

  // 1. CALCOLO STATISTICHE GLOBALI (TUTTI I GIORNI UNITI)
  const statistiche = useMemo(() => {
    let duplicati = new Set<string>();
    let spedViste = new Set<string>();
    let pesoTotale = 0;
    let volumeTotale = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;

    datiFusi.forEach(riga => {
      if (riga.spedizione) {
        if (spedViste.has(riga.spedizione)) duplicati.add(riga.spedizione);
        else spedViste.add(riga.spedizione);
      }
      if (riga.timestamp) {
        if (riga.timestamp < minTime) minTime = riga.timestamp;
        if (riga.timestamp > maxTime) maxTime = riga.timestamp;
      }
      pesoTotale += riga.pesoKg;
      volumeTotale += riga.volumeM3;
    });

    let oreCalcolo = 1; 
    let stringaOre = "0h 0m";
    if (minTime !== Infinity && maxTime !== -Infinity) {
      const diffMs = maxTime - minTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      let hEffettive = diffHours;
      if (hEffettive === 0 && datiFusi.length > 0) hEffettive = 1/60; 
      oreCalcolo = hEffettive > 0 ? hEffettive : 1;
      const h = Math.floor(hEffettive);
      const m = Math.floor((hEffettive - h) * 60);
      stringaOre = `${h}h ${m}m`;
    }

    const numLavorazioni = datiFusi.length;
    return {
      totale: numLavorazioni,
      mediaColli: numLavorazioni > 0 ? Math.round(numLavorazioni / oreCalcolo) : 0,
      oreRealiFormattate: stringaOre,
      pesoTot: pesoTotale,
      pesoOra: pesoTotale / oreCalcolo,
      volTot: volumeTotale,
      volOra: volumeTotale / oreCalcolo,
      rapportoPV: volumeTotale / 300,
      numDuplicati: duplicati.size,
      listaDuplicati: Array.from(duplicati)
    };
  }, [datiFusi]);

  // 2. CALCOLO CONFRONTO GIORNALIERO (Raggruppato per data)
  const statsGiornaliere = useMemo(() => {
    const map = new Map();

    datiFusi.forEach(riga => {
      if (!map.has(riga.giornoId)) {
        map.set(riga.giornoId, {
          id: riga.giornoId,
          label: riga.giornoLabel,
          totale: 0,
          pesoTot: 0,
          volTot: 0,
          minTime: Infinity,
          maxTime: -Infinity,
          duplicatiSet: new Set(),
          spedViste: new Set()
        });
      }
      
      const g = map.get(riga.giornoId);
      g.totale += 1;
      g.pesoTot += riga.pesoKg;
      g.volTot += riga.volumeM3;

      if (riga.timestamp < g.minTime) g.minTime = riga.timestamp;
      if (riga.timestamp > g.maxTime) g.maxTime = riga.timestamp;

      if (g.spedViste.has(riga.spedizione)) g.duplicatiSet.add(riga.spedizione);
      else g.spedViste.add(riga.spedizione);
    });

    return Array.from(map.values())
      .sort((a, b) => a.id.localeCompare(b.id)) 
      .map(g => {
        let oreCalcolo = 1;
        let stringaOre = "0h 0m";
        if (g.minTime !== Infinity && g.maxTime !== -Infinity) {
          const diffMs = g.maxTime - g.minTime;
          let diffHours = diffMs / (1000 * 60 * 60);
          if (diffHours === 0 && g.totale > 0) diffHours = 1/60;
          oreCalcolo = diffHours > 0 ? diffHours : 1;
          const h = Math.floor(diffHours);
          const m = Math.floor((diffHours - h) * 60);
          stringaOre = `${h}h ${m}m`;
        }

        return {
          ...g,
          stringaOre,
          mediaColli: g.totale > 0 ? Math.round(g.totale / oreCalcolo) : 0,
          pesoOra: g.pesoTot / oreCalcolo,
          volOra: g.volTot / oreCalcolo,
          rapportoPV: g.volTot / 300,
          numDuplicati: g.duplicatiSet.size
        };
      });
  }, [datiFusi]);


  // Filtro ricerca globale
  const datiFiltrati = useMemo(() => {
    if (!ricercaSpedizione) return datiFusi;
    const q = ricercaSpedizione.toUpperCase();
    return datiFusi.filter(r => r.spedizione.includes(q));
  }, [datiFusi, ricercaSpedizione]);

  // Gestione Drag & Drop e Parser
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragActive(true); };
  const onDragLeave = () => setIsDragActive(false);
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragActive(false);
    if (e.dataTransfer.files) processaListaFiles(e.dataTransfer.files);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processaListaFiles(e.target.files);
  };

  const processaListaFiles = async (files: FileList) => {
    const nuoviFiles = Array.from(files);
    setFilesCaricati(prev => [...prev, ...nuoviFiles.map(f => f.name)]);

    let nuoviDati: any[] = [];

    for (let file of nuoviFiles) {
      const testo = await file.text();
      const linee = testo.split('\n').filter(l => l.trim() !== '');
      
      for (let linea of linee) {
        const campi = linea.split(',');
        
        if (campi.length >= 15) {
          const clean = (val: string) => val?.trim().replace(/["\r]/g, '') || '';
          const spedizione = clean(campi[0]);
          
          const pesoGr = parseFloat(clean(campi[2])) || 0;
          const pesoKg = pesoGr / 1000;
          
          const l = parseFloat(clean(campi[3])) || 0;
          const w = parseFloat(clean(campi[4])) || 0;
          const h = parseFloat(clean(campi[5])) || 0;
          const volumeM3 = (l * w * h) / 1000000;
          
          const rapportoPVRiga = volumeM3 / 300;
          
          const dataOraRaw = clean(campi[14]);
          
          let dataOraFormattata = dataOraRaw;
          let timestamp = null;
          let giornoId = "Sconosciuto";
          let giornoLabel = "Sconosciuto";
          
          const partiData = dataOraRaw.split('_'); 
          if (partiData.length >= 6) {
             const Y = parseInt(partiData[0], 10);
             const M = parseInt(partiData[1], 10); 
             const D = parseInt(partiData[2], 10);
             const ore = parseInt(partiData[3], 10);
             const min = parseInt(partiData[4], 10);
             const sec = parseInt(partiData[5], 10);
             
             giornoId = `${Y}-${M.toString().padStart(2, '0')}-${D.toString().padStart(2, '0')}`;
             giornoLabel = `${D.toString().padStart(2, '0')}/${M.toString().padStart(2, '0')}/${Y}`;

             timestamp = new Date(Y, M - 1, D, ore, min, sec).getTime();
             dataOraFormattata = `${giornoLabel} ${partiData[3]}:${partiData[4]}:${partiData[5]}`;
          }

          if (spedizione) {
            nuoviDati.push({
              spedizione,
              pesoKg, l, w, h, volumeM3,
              rapportoPVRiga,
              dataOraFormattata, timestamp,
              giornoId, giornoLabel
            });
          }
        }
      }
    }

    setDatiFusi(prev => [...prev, ...nuoviDati]);
  };

  const svuotaTutto = () => {
    setDatiFusi([]); setFilesCaricati([]); setRicercaSpedizione('');
  };

  const scaricaFileUnico = () => {
    if (datiFusi.length === 0) return;
    
    const intestazioni = "Spedizione;Peso_Kg;Lungh_cm;Largh_cm;Alt_cm;Volume_m3;Rapporto_PV;Data_Ora\n";
    const contenuto = datiFusi.map(r => 
      `${r.spedizione};${r.pesoKg.toFixed(2)};${r.l};${r.w};${r.h};${r.volumeM3.toFixed(4)};${r.rapportoPVRiga.toFixed(6)};${r.dataOraFormattata}`
    ).join('\n');

    const blob = new Blob([intestazioni + contenuto], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Analisi_Comparata_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: stiliCSS }} />
      <div className="flex flex-col h-screen bg-black text-white selection:bg-amber-500/30">

        {/* TOP SECTION FISSA */}
        <div className="top-section">
          <header className="flex justify-between items-center mb-3">
            <h1 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <FileText size={18} className="text-amber-500"/> SORTING ANALYZER MULTI-DAY
            </h1>
            <div className="flex gap-2">
              <button onClick={svuotaTutto} className="bg-zinc-800 border border-zinc-700 hover:border-red-500 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all">
                Reset
              </button>
              <button onClick={scaricaFileUnico} disabled={datiFusi.length === 0} className="bg-amber-600 border border-amber-500 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Download size={14} /> Esporta Tutto
              </button>
            </div>
          </header>

          <div className="control-card !mb-3 !py-3">
             <div 
                 className={`drop-zone ${isDragActive ? 'drag-active' : ''}`} 
                 onDragOver={onDragOver}
                 onDragLeave={onDragLeave}
                 onDrop={onDrop}
             >
                <div className="flex items-center gap-4 w-full px-4">
                  <Upload size={24} className="text-amber-500"/>
                  <div className="text-left flex-1">
                    <p className="font-bold text-white text-sm uppercase">Carica i file CSV per compararli</p>
                    <p className="text-xs text-zinc-500 font-mono">Puoi inserire estrapolazioni di giorni diversi per attivarne il confronto ({filesCaricati.length} file attuali).</p>
                  </div>
                  <input type="file" multiple id="fileUpload" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
                  <button onClick={() => document.getElementById('fileUpload')?.click()} className="bg-zinc-800 border border-zinc-700 px-6 py-2 rounded text-xs font-bold text-zinc-300 hover:text-white hover:border-amber-500 transition-all uppercase tracking-wider">
                      Sfoglia PC
                  </button>
                </div>
             </div>
          </div>

          {/* STATISTICHE GLOBALI (SOMMA DI TUTTO) */}
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-4 ml-1">Statistiche Globali (Intero Dataset)</h2>
          <div className="dashboard-grid">
            <div className="stat-card">
              <Hash size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Lavorazioni Totali</span>
              <span className="stat-value text-primary">{statistiche.totale}</span>
              <span className="stat-sub">Colli rilevati</span>
            </div>
            <div className="stat-card">
              <Activity size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Media Oraria Globale</span>
              <span className="stat-value text-white">{statistiche.mediaColli}</span>
              <span className="stat-sub">Sped. / ora esatta</span>
            </div>
            <div className="stat-card">
              <Scale size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Peso Totale</span>
              <span className="stat-value text-emerald">{statistiche.pesoTot.toLocaleString('it-IT', {maximumFractionDigits: 1})} <span className="text-xs">kg</span></span>
              <span className="stat-sub">Somma ponderale</span>
            </div>
            <div className="stat-card">
              <Scale size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Peso / Ora</span>
              <span className="stat-value text-emerald">{statistiche.pesoOra.toLocaleString('it-IT', {maximumFractionDigits: 1})} <span className="text-xs">kg/h</span></span>
              <span className="stat-sub">Media oraria kg</span>
            </div>
            <div className="stat-card">
              <Box size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Volume Totale</span>
              <span className="stat-value text-emerald">{statistiche.volTot.toLocaleString('it-IT', {maximumFractionDigits: 2})} <span className="text-xs">m³</span></span>
              <span className="stat-sub">Cubo totale</span>
            </div>
            <div className="stat-card">
              <Box size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Volume / Ora</span>
              <span className="stat-value text-emerald">{statistiche.volOra.toLocaleString('it-IT', {maximumFractionDigits: 2})} <span className="text-xs">m³/h</span></span>
              <span className="stat-sub">Media oraria cubo</span>
            </div>
            <div className="stat-card">
              <Calculator size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Rapp. P/V Globale</span>
              <span className="stat-value text-purple">{statistiche.rapportoPV.toLocaleString('it-IT', {maximumFractionDigits: 4})}</span>
              <span className="stat-sub">Volume Totale / 300</span>
            </div>
          </div>

          {/* CONFRONTO GIORNALIERO (SCORRIMENTO ORIZZONTALE) */}
          {statsGiornaliere.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Confronto Giornaliero ({statsGiornaliere.length} giorni)</h2>
              <div className="daily-comparison-wrapper">
                {statsGiornaliere.map((g) => (
                  <div key={g.id} className="daily-card">
                    <div className="daily-header">
                      <Calendar size={16} className="text-amber-500"/>
                      <h3>{g.label}</h3>
                    </div>
                    <div className="daily-row"><span className="daily-label">Colli Lavorati:</span> <span className="text-primary daily-val">{g.totale}</span></div>
                    <div className="daily-row"><span className="daily-label">Durata Effettiva:</span> <span className="daily-val">{g.stringaOre}</span></div>
                    <div className="daily-row"><span className="daily-label">Media (Colli/h):</span> <span className="daily-val">{g.mediaColli}</span></div>
                    <div className="daily-row"><span className="daily-label">Vol/h (m³/h):</span> <span className="text-emerald daily-val">{g.volOra.toLocaleString('it-IT', {maximumFractionDigits: 2})}</span></div>
                    <div className="daily-row"><span className="daily-label">Rapporto P/V:</span> <span className="text-purple daily-val">{g.rapportoPV.toLocaleString('it-IT', {maximumFractionDigits: 4})}</span></div>
                    <div className="daily-row"><span className="daily-label">Duplicati:</span> <span className={g.numDuplicati > 0 ? "text-error font-bold" : "daily-val"}>{g.numDuplicati}</span></div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* CAMPO DI RICERCA */}
        <div className="search-wrapper shrink-0">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Cerca numero di spedizione nell'intero dataset..." 
            value={ricercaSpedizione}
            onChange={(e) => setRicercaSpedizione(e.target.value)}
            className="search-input"
          />
        </div>

        {/* TABELLA DATI ESTRATTI */}
        <div className="list-wrapper flex-1">
           {datiFusi.length === 0 ? (
               <div className="empty-state">
                  <FileText size={48} className="mb-4 text-zinc-800"/>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">In attesa di dati</p>
                  <p className="text-xs text-zinc-700 mt-2 font-mono">Trascina i tuoi file orari per confrontare i giorni.</p>
               </div>
           ) : (
             <table className="data-table">
               <thead>
                 <tr>
                   <th style={{ width: '40px' }}>#</th>
                   <th>Spedizione</th>
                   <th>Data & Ora</th>
                   <th>Peso (Kg)</th>
                   <th>L (cm)</th>
                   <th>W (cm)</th>
                   <th>H (cm)</th>
                   <th>Volume (m³)</th>
                   <th>Rapp. P/V</th>
                 </tr>
               </thead>
               <tbody>
                 {datiFiltrati.map((riga, i) => {
                   const isDuplicato = statistiche.listaDuplicati.includes(riga.spedizione);
                   return (
                     <tr key={i} className={isDuplicato ? 'row-duplicate' : ''}>
                       <td className="text-zinc-600 font-bold">{i + 1}</td>
                       <td className={isDuplicato ? 'font-bold' : 'text-white'}>{riga.spedizione}</td>
                       <td>{riga.dataOraFormattata}</td>
                       <td className="text-amber-500/80">{riga.pesoKg.toFixed(2)}</td>
                       <td>{riga.l}</td>
                       <td>{riga.w}</td>
                       <td>{riga.h}</td>
                       <td className="text-emerald-500/80">{riga.volumeM3.toFixed(4)}</td>
                       <td className="text-purple-400/80">{riga.rapportoPVRiga.toFixed(6)}</td>
                     </tr>
                   );
                 })}
               </tbody>
             </table>
           )}
        </div>

      </div>
    </>
  );
}