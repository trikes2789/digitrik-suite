'use client';

import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, Download, AlertTriangle, 
  Clock, Hash, Box, Scale, Activity, Search, Calculator, Calendar, Filter
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
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
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
    transition: all 0.2s ease-in-out;
  }
  
  .stat-card.alert { border-color: var(--error); background: var(--error-dim); }
  
  /* STAT CARD CLICCABILE PER FILTRO DOPPI */
  .stat-card.clickable { cursor: pointer; }
  .stat-card.clickable:hover { border-color: var(--error); box-shadow: 0 0 15px var(--error-dim); transform: translateY(-2px); }
  .stat-card.active-filter { border: 2px solid var(--error); background: rgba(239, 68, 68, 0.2); transform: scale(1.02); box-shadow: 0 0 20px var(--error-dim); }

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
    min-width: 270px;
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
  .text-blue { color: #60a5fa !important; }
  .text-orange { color: #fb923c !important; }

  .search-wrapper {
    padding: 0 20px 10px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .search-bar-row {
    position: relative;
    width: 100%;
  }
  .filters-row {
    display: flex;
    gap: 12px;
    align-items: center;
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
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #71717a; }
  
  .filter-input {
    background: var(--card-dark);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 12px;
    color: white;
    outline: none;
    font-size: 0.8rem;
    font-weight: bold;
    cursor: pointer;
  }
  .filter-input:focus { border-color: var(--primary); }
  .filter-label { font-size: 0.7rem; color: #a1a1aa; text-transform: uppercase; font-weight: bold; margin-right: 4px; }

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
  
  // STATI PER I FILTRI DELLA LISTA E DELLA DASHBOARD
  const [ricercaSpedizione, setRicercaSpedizione] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('TUTTI');
  const [filtroDataInizio, setFiltroDataInizio] = useState('');
  const [filtroDataFine, setFiltroDataFine] = useState('');
  const [filtroSoloDoppi, setFiltroSoloDoppi] = useState(false); 

  // 1. TROVA I DOPPIONI GLOBALI (indipendentemente dai filtri attivi, serve per evidenziare le righe)
  const globalDuplicati = useMemo(() => {
    let viste = new Set();
    let doppie = new Set();
    datiFusi.forEach(r => {
      if (r.spedizione) {
        if (viste.has(r.spedizione)) doppie.add(r.spedizione);
        else viste.add(r.spedizione);
      }
    });
    return Array.from(doppie);
  }, [datiFusi]);

  // 2. APPLICAZIONE DEI FILTRI E ORDINAMENTO
  const datiFiltrati = useMemo(() => {
    let filtered = datiFusi.filter(r => {
      if (ricercaSpedizione && !r.spedizione.includes(ricercaSpedizione.toUpperCase())) return false;
      if (filtroTurno !== 'TUTTI' && r.turno !== filtroTurno) return false;
      if (filtroDataInizio && r.giornoId < filtroDataInizio) return false;
      if (filtroDataFine && r.giornoId > filtroDataFine) return false;
      if (filtroSoloDoppi && !globalDuplicati.includes(r.spedizione)) return false;
      return true;
    });

    // Se stiamo guardando i doppioni, mettiamoli in ordine alfabetico e poi cronologico
    if (filtroSoloDoppi) {
      filtered.sort((a, b) => {
        const compSped = a.spedizione.localeCompare(b.spedizione);
        if (compSped !== 0) return compSped;
        return a.timestamp - b.timestamp; // Ordina per data/ora a parità di spedizione
      });
    }

    return filtered;
  }, [datiFusi, ricercaSpedizione, filtroTurno, filtroDataInizio, filtroDataFine, filtroSoloDoppi, globalDuplicati]);

  // 3. CALCOLO STATISTICHE GLOBALI (Reattivo a datiFiltrati)
  const statistiche = useMemo(() => {
    let duplicatiCount = new Set<string>();
    let spedVisteLocal = new Set<string>();
    let pesoTotale = 0;
    let volumeTotale = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;
    let colliArrivi = 0;
    let colliPartenze = 0;

    datiFiltrati.forEach(riga => {
      if (riga.spedizione) {
        if (spedVisteLocal.has(riga.spedizione)) duplicatiCount.add(riga.spedizione);
        else spedVisteLocal.add(riga.spedizione);
      }
      if (riga.timestamp) {
        if (riga.timestamp < minTime) minTime = riga.timestamp;
        if (riga.timestamp > maxTime) maxTime = riga.timestamp;
      }
      pesoTotale += riga.pesoKg;
      volumeTotale += riga.volumeM3;

      if (riga.turno === 'ARRIVI') colliArrivi++;
      else colliPartenze++;
    });

    let oreCalcolo = 1; 
    let stringaOre = "0h 0m";
    if (minTime !== Infinity && maxTime !== -Infinity) {
      const diffMs = maxTime - minTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      let hEffettive = diffHours;
      if (hEffettive === 0 && datiFiltrati.length > 0) hEffettive = 1/60; 
      oreCalcolo = hEffettive > 0 ? hEffettive : 1;
      const h = Math.floor(hEffettive);
      const m = Math.floor((hEffettive - h) * 60);
      stringaOre = `${h}h ${m}m`;
    }

    const numLavorazioni = datiFiltrati.length;
    return {
      totale: numLavorazioni,
      colliArrivi,
      colliPartenze,
      mediaColli: numLavorazioni > 0 ? Math.round(numLavorazioni / oreCalcolo) : 0,
      oreRealiFormattate: stringaOre,
      pesoTot: pesoTotale,
      pesoOra: pesoTotale / oreCalcolo,
      volTot: volumeTotale,
      volOra: volumeTotale / oreCalcolo,
      rapportoPV: volumeTotale / 300,
      numDuplicati: filtroSoloDoppi ? globalDuplicati.length : duplicatiCount.size
    };
  }, [datiFiltrati, filtroSoloDoppi, globalDuplicati]);

  // 4. CALCOLO CONFRONTO GIORNALIERO (Reattivo a datiFiltrati)
  const statsGiornaliere = useMemo(() => {
    const map = new Map();

    datiFiltrati.forEach(riga => {
      if (!map.has(riga.giornoId)) {
        map.set(riga.giornoId, {
          id: riga.giornoId,
          label: riga.giornoLabel,
          totale: 0,
          colliArrivi: 0,
          colliPartenze: 0,
          pesoTot: 0,
          volTot: 0,
          minTime: Infinity,
          maxTime: -Infinity,
          duplicatiSet: new Set(),
          spedVisteLocal: new Set()
        });
      }
      
      const g = map.get(riga.giornoId);
      g.totale += 1;
      g.pesoTot += riga.pesoKg;
      g.volTot += riga.volumeM3;
      
      if (riga.turno === 'ARRIVI') g.colliArrivi++;
      else g.colliPartenze++;

      if (riga.timestamp < g.minTime) g.minTime = riga.timestamp;
      if (riga.timestamp > g.maxTime) g.maxTime = riga.timestamp;

      if (g.spedVisteLocal.has(riga.spedizione)) g.duplicatiSet.add(riga.spedizione);
      else g.spedVisteLocal.add(riga.spedizione);
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
  }, [datiFiltrati]);

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
      const fileName = file.name;
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
          let turno = "Sconosciuto";
          
          const partiData = dataOraRaw.split('_'); 
          if (partiData.length >= 6) {
             const Y = parseInt(partiData[0], 10);
             const M = parseInt(partiData[1], 10); 
             const D = parseInt(partiData[2], 10);
             const ore = parseInt(partiData[3], 10);
             const min = parseInt(partiData[4], 10);
             const sec = parseInt(partiData[5], 10);
             
             turno = ore < 13 ? 'ARRIVI' : 'PARTENZE';
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
              giornoId, giornoLabel, turno,
              fileName // <-- Nome del file per il filtro doppie
            });
          }
        }
      }
    }

    setDatiFusi(prev => [...prev, ...nuoviDati]);
  };

  const svuotaTutto = () => {
    setDatiFusi([]); 
    setFilesCaricati([]); 
    setRicercaSpedizione('');
    setFiltroTurno('TUTTI');
    setFiltroDataInizio('');
    setFiltroDataFine('');
    setFiltroSoloDoppi(false);
  };

  const azzeraFiltri = () => {
    setRicercaSpedizione('');
    setFiltroTurno('TUTTI');
    setFiltroDataInizio('');
    setFiltroDataFine('');
    setFiltroSoloDoppi(false);
  };

  const scaricaFileUnico = () => {
    if (datiFiltrati.length === 0) return;
    const intestazioni = "Spedizione;Peso_Kg;Lungh_cm;Largh_cm;Alt_cm;Volume_m3;Rapporto_PV;Turno;Data_Ora;File_Sorgente\n";
    const contenuto = datiFiltrati.map(r => 
      `${r.spedizione};${r.pesoKg.toFixed(2)};${r.l};${r.w};${r.h};${r.volumeM3.toFixed(4)};${r.rapportoPVRiga.toFixed(6)};${r.turno};${r.dataOraFormattata};${r.fileName}`
    ).join('\n');
    const blob = new Blob([intestazioni + contenuto], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Analisi_Sorting_${new Date().getTime()}.csv`);
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
                Reset App
              </button>
              <button onClick={scaricaFileUnico} disabled={datiFiltrati.length === 0} className="bg-amber-600 border border-amber-500 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Download size={14} /> Esporta Vista ({datiFiltrati.length})
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
                    <p className="text-xs text-zinc-500 font-mono">Trascina qui i tuoi estrapolati ({filesCaricati.length} file in memoria).</p>
                  </div>
                  <input type="file" multiple id="fileUpload" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
                  <button onClick={() => document.getElementById('fileUpload')?.click()} className="bg-zinc-800 border border-zinc-700 px-6 py-2 rounded text-xs font-bold text-zinc-300 hover:text-white hover:border-amber-500 transition-all uppercase tracking-wider">
                      Sfoglia PC
                  </button>
                </div>
             </div>
          </div>

          {/* STATISTICHE (Reattive ai filtri attivi in basso) */}
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-4 ml-1 flex items-center gap-2">
            Statistiche Relazionali {filtroSoloDoppi || filtroDataInizio || filtroDataFine || filtroTurno !== 'TUTTI' || ricercaSpedizione ? <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black">FILTRATE</span> : ''}
          </h2>
          
          <div className="dashboard-grid">
            <div className="stat-card">
              <Hash size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Lavorazioni Viste</span>
              <span className="stat-value text-primary">{statistiche.totale}</span>
              <span className="stat-sub">Arrivi: <span className="text-blue">{statistiche.colliArrivi}</span> | Part: <span className="text-orange">{statistiche.colliPartenze}</span></span>
            </div>
            <div className="stat-card">
              <Activity size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Media Oraria Vista</span>
              <span className="stat-value text-white">{statistiche.mediaColli}</span>
              <span className="stat-sub">Sped. / ora calcolata</span>
            </div>
            <div className="stat-card">
              <Scale size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Peso Totale (Filtro)</span>
              <span className="stat-value text-emerald">{statistiche.pesoTot.toLocaleString('it-IT', {maximumFractionDigits: 1})} <span className="text-xs">kg</span></span>
              <span className="stat-sub">Somma ponderale</span>
            </div>
            <div className="stat-card">
              <Scale size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Peso / Ora (Filtro)</span>
              <span className="stat-value text-emerald">{statistiche.pesoOra.toLocaleString('it-IT', {maximumFractionDigits: 1})} <span className="text-xs">kg/h</span></span>
              <span className="stat-sub">Media oraria kg</span>
            </div>
            <div className="stat-card">
              <Box size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Volume Tot (Filtro)</span>
              <span className="stat-value text-emerald">{statistiche.volTot.toLocaleString('it-IT', {maximumFractionDigits: 2})} <span className="text-xs">m³</span></span>
              <span className="stat-sub">Cubo totale</span>
            </div>
            <div className="stat-card">
              <Box size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Volume / Ora (Filtro)</span>
              <span className="stat-value text-emerald">{statistiche.volOra.toLocaleString('it-IT', {maximumFractionDigits: 2})} <span className="text-xs">m³/h</span></span>
              <span className="stat-sub">Media oraria cubo</span>
            </div>
            <div className="stat-card">
              <Calculator size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Rapp. P/V Vista</span>
              <span className="stat-value text-purple">{statistiche.rapportoPV.toLocaleString('it-IT', {maximumFractionDigits: 4})}</span>
              <span className="stat-sub">Volume Vista / 300</span>
            </div>
            
            {/* RIQUADRO DOPPIE SPEDIZIONI - CLICCABILE */}
            <div 
              onClick={() => setFiltroSoloDoppi(!filtroSoloDoppi)}
              title="Clicca per isolare e analizzare solo i pacchi passati 2 o più volte"
              className={`stat-card clickable ${statistiche.numDuplicati > 0 ? 'alert' : ''} ${filtroSoloDoppi ? 'active-filter' : ''}`}
            >
              <AlertTriangle size={24} className={`stat-icon ${statistiche.numDuplicati > 0 ? 'text-error opacity-40' : 'text-zinc-500'}`} />
              <span className={`stat-label ${statistiche.numDuplicati > 0 ? 'text-error' : ''}`}>Sped. Doppie</span>
              <span className={`stat-value ${statistiche.numDuplicati > 0 ? 'text-error' : 'text-white'}`}>
                {statistiche.numDuplicati}
              </span>
              <span className="stat-sub">{filtroSoloDoppi ? 'FILTRO ATTIVO (Clicca x togliere)' : 'Clicca per isolarle'}</span>
            </div>

          </div>

          {/* CONFRONTO GIORNALIERO */}
          {statsGiornaliere.length > 0 && (
            <>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">Confronto Giornaliero (Vista Filtrata)</h2>
              <div className="daily-comparison-wrapper">
                {statsGiornaliere.map((g) => (
                  <div key={g.id} className="daily-card">
                    <div className="daily-header">
                      <Calendar size={16} className="text-amber-500"/>
                      <h3>{g.label}</h3>
                    </div>
                    <div className="daily-row"><span className="daily-label">Colli Totali:</span> <span className="text-primary daily-val">{g.totale}</span></div>
                    <div className="daily-row"><span className="daily-label ml-2">↳ ARRIVI:</span> <span className="text-blue daily-val">{g.colliArrivi}</span></div>
                    <div className="daily-row"><span className="daily-label ml-2">↳ PARTENZE:</span> <span className="text-orange daily-val">{g.colliPartenze}</span></div>
                    <div className="daily-row mt-2"><span className="daily-label">Media (Colli/h):</span> <span className="daily-val">{g.mediaColli}</span></div>
                    <div className="daily-row"><span className="daily-label">Vol/h (m³/h):</span> <span className="text-emerald daily-val">{g.volOra.toLocaleString('it-IT', {maximumFractionDigits: 2})}</span></div>
                    <div className="daily-row"><span className="daily-label">Rapporto P/V:</span> <span className="text-purple daily-val">{g.rapportoPV.toLocaleString('it-IT', {maximumFractionDigits: 4})}</span></div>
                    <div className="daily-row"><span className="daily-label">Doppioni in data:</span> <span className={g.numDuplicati > 0 ? "text-error font-bold" : "daily-val"}>{g.numDuplicati}</span></div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* BARRA RICERCA E FILTRI */}
        <div className="search-wrapper shrink-0">
          <div className="search-bar-row">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cerca numero di spedizione specifico..." 
              value={ricercaSpedizione}
              onChange={(e) => setRicercaSpedizione(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters-row">
             <Filter size={16} className="text-zinc-500 shrink-0" />
             
             <select 
                value={filtroTurno} 
                onChange={(e) => setFiltroTurno(e.target.value)}
                className="filter-input"
             >
                <option value="TUTTI">Tutti i Turni</option>
                <option value="ARRIVI">Solo ARRIVI (Mattina)</option>
                <option value="PARTENZE">Solo PARTENZE (Pom/Sera)</option>
             </select>

             <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1">
                <span className="filter-label">Da:</span>
                <input 
                  type="date" 
                  value={filtroDataInizio} 
                  onChange={(e) => setFiltroDataInizio(e.target.value)}
                  className="bg-transparent text-white outline-none text-sm font-bold uppercase cursor-pointer"
                />
             </div>

             <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1">
                <span className="filter-label">A:</span>
                <input 
                  type="date" 
                  value={filtroDataFine} 
                  onChange={(e) => setFiltroDataFine(e.target.value)}
                  className="bg-transparent text-white outline-none text-sm font-bold uppercase cursor-pointer"
                />
             </div>
             
             {(filtroTurno !== 'TUTTI' || filtroDataInizio || filtroDataFine || filtroSoloDoppi || ricercaSpedizione) && (
               <button 
                 onClick={azzeraFiltri}
                 className="text-xs font-bold text-amber-500 hover:text-white uppercase ml-auto border border-amber-500/50 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-all"
               >
                 Azzera Filtri
               </button>
             )}
          </div>
        </div>

        {/* TABELLA DATI ESTRATTI (Filtrata) */}
        <div className="list-wrapper flex-1">
           {datiFusi.length === 0 ? (
               <div className="empty-state">
                  <FileText size={48} className="mb-4 text-zinc-800"/>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">In attesa di dati</p>
                  <p className="text-xs text-zinc-700 mt-2 font-mono">Trascina i tuoi file orari per visualizzare le liste.</p>
               </div>
           ) : datiFiltrati.length === 0 ? (
               <div className="empty-state">
                  <AlertTriangle size={48} className="mb-4 text-zinc-700"/>
                  <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Nessun Risultato</p>
                  <p className="text-xs text-zinc-700 mt-2 font-mono">I filtri impostati non corrispondono a nessuna spedizione.</p>
               </div>
           ) : (
             <table className="data-table">
               <thead>
                 <tr>
                   <th style={{ width: '40px' }}>#</th>
                   <th>Spedizione</th>
                   <th>Data & Ora</th>
                   {/* COLONNA VISIBILE SOLO SE E' ATTIVO IL FILTRO DOPPI */}
                   {filtroSoloDoppi && <th>File Sorgente</th>}
                   <th>Turno</th>
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
                   const isDuplicato = globalDuplicati.includes(riga.spedizione);
                   return (
                     <tr key={i} className={isDuplicato ? 'row-duplicate' : ''}>
                       <td className="text-zinc-600 font-bold">{i + 1}</td>
                       <td className={isDuplicato ? 'font-bold' : 'text-white'}>{riga.spedizione}</td>
                       <td>{riga.dataOraFormattata}</td>
                       {/* CAMPO MOSTRATO SOLO SE E' ATTIVO IL FILTRO DOPPI */}
                       {filtroSoloDoppi && <td className="text-xs font-mono text-zinc-400">{riga.fileName}</td>}
                       <td className={riga.turno === 'ARRIVI' ? 'text-blue font-bold' : 'text-orange font-bold'}>{riga.turno}</td>
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