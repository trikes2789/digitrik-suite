'use client';

import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, Download, AlertTriangle, 
  Clock, Hash, Box, Scale, Activity, Search, Calculator, Calendar, Filter, XOctagon, Copy, Check
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
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }

  .stat-card {
    background: var(--card-dark);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
  }
  
  .stat-card.alert { border-color: var(--error); background: var(--error-dim); }
  
  .stat-card.clickable { cursor: pointer; }
  .stat-card.clickable:hover { border-color: var(--error); box-shadow: 0 0 15px var(--error-dim); transform: translateY(-2px); }
  .stat-card.active-filter { border: 2px solid var(--error); background: rgba(239, 68, 68, 0.2); transform: scale(1.02); box-shadow: 0 0 20px var(--error-dim); }

  .stat-icon { position: absolute; top: 12px; right: 12px; opacity: 0.15; }
  .stat-label { font-size: 0.6rem; text-transform: uppercase; font-weight: 800; color: #71717a; letter-spacing: 1px; margin-bottom: 2px; }
  .stat-value { font-size: 1.4rem; font-weight: 900; color: var(--text-main); line-height: 1; margin-bottom: 2px; }
  .stat-sub { font-size: 0.65rem; color: #a1a1aa; font-family: monospace; }

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
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
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
    font-size: 0.75rem;
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
  .row-error td { color: var(--error) !important; font-weight: bold; }
  .row-weight-issue td { color: #fbbf24; } 
  
  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #52525b; text-align: center; margin-top: 40px;
  }

  .copy-btn {
    padding: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    color: #a1a1aa;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .copy-btn:hover {
    background: rgba(245, 158, 11, 0.1);
    color: var(--primary);
    border-color: var(--primary-dim);
  }
`;

export default function GeneratoreTransitiCSV() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [filesCaricati, setFilesCaricati] = useState<string[]>([]);
  const [datiFusi, setDatiFusi] = useState<any[]>([]);
  
  // STATI PER I FILTRI E COPIA
  const [ricercaSpedizione, setRicercaSpedizione] = useState('');
  const [filtroTurno, setFiltroTurno] = useState('TUTTI');
  const [filtroErrore, setFiltroErrore] = useState('TUTTI');
  const [filtroDataInizio, setFiltroDataInizio] = useState('');
  const [filtroDataFine, setFiltroDataFine] = useState('');
  const [filtroSoloDoppi, setFiltroSoloDoppi] = useState(false); 
  const [filtroIncongruenzaPeso, setFiltroIncongruenzaPeso] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (testo: string, rowId: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(testo);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = testo;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (error) {
          console.error("Fallback execCommand fallito", error);
        } finally {
          textArea.remove();
        }
      }
      setCopiedId(rowId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Errore durante la copia: ', err);
    }
  };

  // 1. TROVA I DOPPIONI GLOBALI E LE INCONGRUENZE DI PESO SUI DOPPI
  const { globalDuplicati, spedizioniConErrori, spedizioniDiffPeso } = useMemo(() => {
    let viste = new Set<string>();
    let doppie = new Set<string>();
    let conErrore = new Set<string>();
    let pesiPerSpedizione = new Map<string, number[]>();
    
    datiFusi.forEach(r => {
      if (r.spedizione && !r.spedizione.includes('ERR_NO_READ')) {
        if (viste.has(r.spedizione)) doppie.add(r.spedizione);
        else viste.add(r.spedizione);
        
        if (!pesiPerSpedizione.has(r.spedizione)) {
          pesiPerSpedizione.set(r.spedizione, []);
        }
        pesiPerSpedizione.get(r.spedizione)?.push(r.pesoKg);
      }
      if (r.errore && r.spedizione) {
        conErrore.add(r.spedizione);
      }
    });
    
    let conDiffPeso = new Set<string>();
    doppie.forEach(sped => {
       const pesi = pesiPerSpedizione.get(sped);
       if (pesi && pesi.length > 1) {
          const minPeso = Math.min(...pesi);
          const maxPeso = Math.max(...pesi);
          if (maxPeso - minPeso >= 0.5) {
             conDiffPeso.add(sped);
          }
       }
    });

    return { 
      globalDuplicati: Array.from(doppie), 
      spedizioniConErrori: conErrore,
      spedizioniDiffPeso: conDiffPeso
    };
  }, [datiFusi]);

  // 2. APPLICAZIONE DEI FILTRI E ORDINAMENTO
  const datiFiltrati = useMemo(() => {
    let filtered = datiFusi.filter(r => {
      if (ricercaSpedizione && !r.spedizione.includes(ricercaSpedizione.toUpperCase())) return false;
      if (filtroTurno !== 'TUTTI' && r.turno !== filtroTurno) return false;
      if (filtroErrore === 'ERRORI' && !r.errore) return false;
      if (filtroErrore === 'NO_ERRORI' && spedizioniConErrori.has(r.spedizione)) return false;
      if (filtroDataInizio && r.giornoId < filtroDataInizio) return false;
      if (filtroDataFine && r.giornoId > filtroDataFine) return false;
      
      if (filtroSoloDoppi && !globalDuplicati.includes(r.spedizione)) return false;
      if (filtroIncongruenzaPeso && !spedizioniDiffPeso.has(r.spedizione)) return false;

      return true;
    });

    if (filtroSoloDoppi || filtroIncongruenzaPeso) {
      filtered.sort((a, b) => {
        const compSped = a.spedizione.localeCompare(b.spedizione);
        if (compSped !== 0) return compSped;
        return a.timestamp - b.timestamp; 
      });
    }

    return filtered;
  }, [datiFusi, ricercaSpedizione, filtroTurno, filtroErrore, filtroDataInizio, filtroDataFine, filtroSoloDoppi, filtroIncongruenzaPeso, globalDuplicati, spedizioniConErrori, spedizioniDiffPeso]);

  // 3. CALCOLO STATISTICHE GLOBALI
  const statistiche = useMemo(() => {
    let duplicatiCount = new Set<string>();
    let diffPesoCountLocal = new Set<string>();
    let spedVisteLocal = new Set<string>();
    let pesoTotale = 0;
    let volumeTotale = 0;
    let minTime = Infinity;
    let maxTime = -Infinity;
    let colliArrivi = 0;
    let colliPartenze = 0;
    let erroriCount = 0;

    datiFiltrati.forEach(riga => {
      if (riga.spedizione && !riga.spedizione.includes('ERR_NO_READ')) {
        if (spedVisteLocal.has(riga.spedizione)) duplicatiCount.add(riga.spedizione);
        else spedVisteLocal.add(riga.spedizione);
        
        if (spedizioniDiffPeso.has(riga.spedizione)) {
           diffPesoCountLocal.add(riga.spedizione);
        }
      }
      if (riga.timestamp) {
        if (riga.timestamp < minTime) minTime = riga.timestamp;
        if (riga.timestamp > maxTime) maxTime = riga.timestamp;
      }
      pesoTotale += riga.pesoKg;
      volumeTotale += riga.volumeM3;

      if (riga.turno === 'ARRIVI') colliArrivi++;
      else colliPartenze++;
      
      if (riga.errore) erroriCount++;
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
      erroriCount,
      incongruenzePesoCount: filtroIncongruenzaPeso ? spedizioniDiffPeso.size : diffPesoCountLocal.size,
      mediaColli: numLavorazioni > 0 ? Math.round(numLavorazioni / oreCalcolo) : 0,
      oreRealiFormattate: stringaOre,
      pesoTot: pesoTotale,
      pesoOra: pesoTotale / oreCalcolo,
      volTot: volumeTotale,
      volOra: volumeTotale / oreCalcolo,
      rapportoPV: volumeTotale / 300,
      numDuplicati: filtroSoloDoppi ? globalDuplicati.length : duplicatiCount.size
    };
  }, [datiFiltrati, filtroSoloDoppi, filtroIncongruenzaPeso, globalDuplicati, spedizioniDiffPeso]);

  // 4. CALCOLO CONFRONTO GIORNALIERO
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
          erroriCount: 0,
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
      
      if (riga.errore) g.erroriCount++;

      if (riga.timestamp < g.minTime) g.minTime = riga.timestamp;
      if (riga.timestamp > g.maxTime) g.maxTime = riga.timestamp;

      if (riga.spedizione && !riga.spedizione.includes('ERR_NO_READ')) {
        if (g.spedVisteLocal.has(riga.spedizione)) g.duplicatiSet.add(riga.spedizione);
        else g.spedVisteLocal.add(riga.spedizione);
      }
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

  // Gestione Upload con Riconoscimento Tracciati
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
      if (linee.length === 0) continue;

      const separatore = linee[0].includes(';') ? ';' : ',';
      
      // Valori di default per il tracciato Odierno
      let idxId = 0, idxData = 2, idxOra = 3, idxErrore = 4, idxSped = 8, idxL = 9, idxW = 10, idxH = 11, idxPeso = 12, idxZona = 14;

      for (let i = 0; i < linee.length; i++) {
        const linea = linee[i];
        const campi = linea.split(separatore);
        
        // RICONOSCIMENTO AUTOMATICO TRACCIATO (Storico vs Odierno)
        if (i === 0) {
            const headerB = campi[1]?.trim().toLowerCase();
            if (headerB === 'data transito') {
                // E' un file STORICO
                idxId = 0;    // A
                idxData = 1;  // B
                idxOra = 2;   // C
                idxErrore = 3;// D
                idxSped = 7;  // H (Barcode Match)
                idxL = 9;     // J
                idxW = 10;    // K
                idxH = 11;    // L
                idxPeso = 12; // M
                idxZona = 18; // S (Filiale Destinazione)
            } else {
                // E' un file ODIERNO (Vid in colonna B)
                idxId = 0;    // A
                idxData = 2;  // C
                idxOra = 3;   // D
                idxErrore = 4;// E
                idxSped = 8;  // I (Barcode Match)
                idxL = 9;     // J
                idxW = 10;    // K
                idxH = 11;    // L
                idxPeso = 12; // M
                idxZona = 14; // O (Filiale Partenza)
            }
            continue; // Salta la riga delle intestazioni
        }
        
        if (campi.length >= 10) {
          const clean = (val: string) => val?.trim().replace(/["\r]/g, '') || '';
          
          const idTransito = clean(campi[idxId]);  
          const dataStr = clean(campi[idxData]);     
          const oraStr = clean(campi[idxOra]);      
          const errore = clean(campi[idxErrore]);      
          
          let spedizione = clean(campi[idxSped]); 
          if (!spedizione || spedizione === '?') spedizione = "ERR_NO_READ_" + idTransito;
          
          const l = parseFloat(clean(campi[idxL]).replace(',','.')) || 0;    
          const w = parseFloat(clean(campi[idxW]).replace(',','.')) || 0;   
          const h = parseFloat(clean(campi[idxH]).replace(',','.')) || 0;   
          const volumeM3 = (l * w * h) / 1000000;
          
          const pesoKg = parseFloat(clean(campi[idxPeso]).replace(',','.')) || 0; 
          const zona = clean(campi[idxZona]); 
          
          const rapportoPVRiga = volumeM3 / 300;
          
          let dataOraFormattata = dataStr ? `${dataStr} ${oraStr}` : '';
          let timestamp = null;
          let giornoId = "Sconosciuto";
          let giornoLabel = "Sconosciuto";
          let turno = "Sconosciuto";
          
          if (dataStr && oraStr) {
             const partiData = dataStr.split('/');
             const partiOra = oraStr.split(':');
             
             if (partiData.length >= 3 && partiOra.length >= 2) {
                 const D = parseInt(partiData[0], 10);
                 const M = parseInt(partiData[1], 10); 
                 const Y = parseInt(partiData[2], 10);
                 const ore = parseInt(partiOra[0], 10);
                 const min = parseInt(partiOra[1], 10);
                 const sec = partiOra.length > 2 ? parseInt(partiOra[2], 10) : 0;
                 
                 turno = ore < 13 ? 'ARRIVI' : 'PARTENZE';
                 giornoId = `${Y}-${M.toString().padStart(2, '0')}-${D.toString().padStart(2, '0')}`;
                 giornoLabel = `${D.toString().padStart(2, '0')}/${M.toString().padStart(2, '0')}/${Y}`;
                 timestamp = new Date(Y, M - 1, D, ore, min, sec).getTime();
             }
          }

          if (idTransito) {
            nuoviDati.push({
              idTransito, spedizione, errore, zona,
              pesoKg, l, w, h, volumeM3, rapportoPVRiga,
              dataOraFormattata, timestamp, giornoId, giornoLabel, turno,
              fileName 
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
    azzeraFiltri();
  };

  const azzeraFiltri = () => {
    setRicercaSpedizione('');
    setFiltroTurno('TUTTI');
    setFiltroErrore('TUTTI');
    setFiltroDataInizio('');
    setFiltroDataFine('');
    setFiltroSoloDoppi(false);
    setFiltroIncongruenzaPeso(false);
  };

  const scaricaFileUnico = () => {
    if (datiFiltrati.length === 0) return;
    const intestazioni = "Transito_ID;Spedizione;Data_Ora;Turno;Zona;Errore;Peso_Kg;L_cm;W_cm;H_cm;Volume_m3;Rapporto_PV;File_Sorgente\n";
    const contenuto = datiFiltrati.map(r => 
      `${r.idTransito};${r.spedizione};${r.dataOraFormattata};${r.turno};${r.zona};${r.errore};${r.pesoKg.toFixed(2)};${r.l};${r.w};${r.h};${r.volumeM3.toFixed(4)};${r.rapportoPVRiga.toFixed(6)};${r.fileName}`
    ).join('\n');
    const blob = new Blob([intestazioni + contenuto], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Analisi_Transiti_Excel_${new Date().getTime()}.csv`);
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
              <FileText size={18} className="text-amber-500"/> TRANSITI EXCEL ANALYZER
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
                    <p className="font-bold text-white text-sm uppercase">Carica file Excel (CSV Transiti) per compararli</p>
                    <p className="text-xs text-zinc-500 font-mono">Trascina qui le estrapolazioni Odierne o Storiche ({filesCaricati.length} file in memoria).</p>
                  </div>
                  <input type="file" multiple id="fileUpload" className="hidden" accept=".txt,.csv" onChange={handleFileChange} />
                  <button onClick={() => document.getElementById('fileUpload')?.click()} className="bg-zinc-800 border border-zinc-700 px-6 py-2 rounded text-xs font-bold text-zinc-300 hover:text-white hover:border-amber-500 transition-all uppercase tracking-wider">
                      Sfoglia PC
                  </button>
                </div>
             </div>
          </div>

          {/* STATISTICHE (Reattive ai filtri attivi) */}
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 mt-4 ml-1 flex items-center gap-2">
            Statistiche Relazionali {filtroSoloDoppi || filtroIncongruenzaPeso || filtroErrore !== 'TUTTI' || filtroDataInizio || filtroDataFine || filtroTurno !== 'TUTTI' || ricercaSpedizione ? <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black">FILTRATE</span> : ''}
          </h2>
          
          <div className="dashboard-grid">
            <div className="stat-card">
              <Hash size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Lav. Viste</span>
              <span className="stat-value text-primary">{statistiche.totale}</span>
              <span className="stat-sub">A: <span className="text-blue">{statistiche.colliArrivi}</span> | P: <span className="text-orange">{statistiche.colliPartenze}</span></span>
            </div>
            <div className="stat-card">
              <Activity size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Media Ora</span>
              <span className="stat-value text-white">{statistiche.mediaColli}</span>
              <span className="stat-sub">Sped. / ora</span>
            </div>
            <div className="stat-card">
              <Scale size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Peso / Ora</span>
              <span className="stat-value text-emerald">{statistiche.pesoOra.toLocaleString('it-IT', {maximumFractionDigits: 1})} <span className="text-xs">kg/h</span></span>
              <span className="stat-sub">Tot: {statistiche.pesoTot.toLocaleString('it-IT', {maximumFractionDigits: 0})} kg</span>
            </div>
            <div className="stat-card">
              <Box size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Vol / Ora</span>
              <span className="stat-value text-emerald">{statistiche.volOra.toLocaleString('it-IT', {maximumFractionDigits: 2})} <span className="text-xs">m³/h</span></span>
              <span className="stat-sub">Tot: {statistiche.volTot.toLocaleString('it-IT', {maximumFractionDigits: 1})} m³</span>
            </div>
            <div className="stat-card">
              <Calculator size={24} className="stat-icon text-zinc-500" />
              <span className="stat-label">Rapp. P/V</span>
              <span className="stat-value text-purple">{statistiche.rapportoPV.toLocaleString('it-IT', {maximumFractionDigits: 4})}</span>
              <span className="stat-sub">Vol / 300</span>
            </div>
            
            {/* RIQUADRO ERRORI */}
            <div className={`stat-card ${statistiche.erroriCount > 0 ? 'alert' : ''}`}>
              <XOctagon size={24} className={`stat-icon ${statistiche.erroriCount > 0 ? 'text-error opacity-40' : 'text-zinc-500'}`} />
              <span className={`stat-label ${statistiche.erroriCount > 0 ? 'text-error' : ''}`}>Errori Ril.</span>
              <span className={`stat-value ${statistiche.erroriCount > 0 ? 'text-error' : 'text-white'}`}>
                {statistiche.erroriCount}
              </span>
              <span className="stat-sub">Anomalie scan</span>
            </div>

            {/* NUOVO RIQUADRO: DIFFERENZA PESO SUI DOPPIONI */}
            <div 
              onClick={() => setFiltroIncongruenzaPeso(!filtroIncongruenzaPeso)}
              title="Clicca per isolare i colli passati più volte che hanno una differenza di peso tra i vari passaggi di almeno 0.5kg"
              className={`stat-card clickable ${statistiche.incongruenzePesoCount > 0 ? 'alert' : ''} ${filtroIncongruenzaPeso ? 'active-filter' : ''}`}
            >
              <Scale size={24} className={`stat-icon ${statistiche.incongruenzePesoCount > 0 ? 'text-error opacity-40' : 'text-zinc-500'}`} />
              <span className={`stat-label ${statistiche.incongruenzePesoCount > 0 ? 'text-error' : ''}`}>Diff. {'>='} 500g</span>
              <span className={`stat-value ${statistiche.incongruenzePesoCount > 0 ? 'text-error' : 'text-white'}`}>
                {statistiche.incongruenzePesoCount}
              </span>
              <span className="stat-sub">{filtroIncongruenzaPeso ? 'FILTRO ATTIVO' : 'Sui doppioni'}</span>
            </div>

            {/* RIQUADRO DOPPIE SPEDIZIONI */}
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
              <span className="stat-sub">{filtroSoloDoppi ? 'FILTRO ATTIVO' : 'Clicca per isolare'}</span>
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
                    <div className="daily-row"><span className="daily-label">Errori / Doppioni:</span> <span className={(g.erroriCount > 0 || g.numDuplicati > 0) ? "text-error font-bold" : "daily-val"}>{g.erroriCount} / {g.numDuplicati}</span></div>
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
                <option value="PARTENZE">Solo PARTENZE (Pomeriggio/Sera)</option>
             </select>

             <select 
                value={filtroErrore} 
                onChange={(e) => setFiltroErrore(e.target.value)}
                className="filter-input"
             >
                <option value="TUTTI">Con & Senza Errori</option>
                <option value="ERRORI">Mostra Solo Errori</option>
                <option value="NO_ERRORI">Nascondi Errori</option>
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
             
             {(filtroTurno !== 'TUTTI' || filtroErrore !== 'TUTTI' || filtroDataInizio || filtroDataFine || filtroSoloDoppi || filtroIncongruenzaPeso || ricercaSpedizione) && (
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
                  <p className="text-xs text-zinc-700 mt-2 font-mono">Trascina i tuoi file orari Transiti per visualizzare le liste.</p>
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
                   <th>Zona (O/S)</th>
                   <th>Turno</th>
                   {(filtroSoloDoppi || filtroIncongruenzaPeso) && <th>File Sorgente</th>}
                   <th>Errore (E)</th>
                   <th>Peso (Kg)</th>
                   <th>Misure (LWH)</th>
                   <th>Volume (m³)</th>
                   <th>Rapp. P/V</th>
                 </tr>
               </thead>
               <tbody>
                 {datiFiltrati.map((riga, i) => {
                   const isDuplicato = globalDuplicati.includes(riga.spedizione);
                   const isErrore = !!riga.errore;
                   const isWeightIssue = spedizioniDiffPeso.has(riga.spedizione);
                   
                   let rowClass = '';
                   if (isErrore) rowClass = 'row-error';
                   else if (isWeightIssue) rowClass = 'row-weight-issue'; 
                   else if (isDuplicato) rowClass = 'row-duplicate';

                   const rowKeyId = `${riga.idTransito}-${i}`;

                   return (
                     <tr key={rowKeyId} className={rowClass}>
                       <td className="text-zinc-600 font-bold">{i + 1}</td>
                       
                       <td className={(isDuplicato || isErrore || isWeightIssue) ? 'font-bold' : 'text-white'}>
                         <div className="flex items-center gap-3">
                           {riga.spedizione}
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               handleCopy(riga.spedizione, rowKeyId);
                             }}
                             className="copy-btn"
                             title="Copia negli appunti"
                           >
                             {copiedId === rowKeyId ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} />}
                           </button>
                         </div>
                       </td>
                       
                       <td>{riga.dataOraFormattata}</td>
                       <td>{riga.zona}</td>
                       <td className={riga.turno === 'ARRIVI' ? 'text-blue font-bold' : 'text-orange font-bold'}>{riga.turno}</td>
                       
                       {(filtroSoloDoppi || filtroIncongruenzaPeso) && <td className="text-xs font-mono text-zinc-400">{riga.fileName}</td>}
                       
                       <td className={isErrore ? 'text-error font-black' : 'text-zinc-600'}>{riga.errore || '-'}</td>
                       <td className={isWeightIssue ? 'text-amber-400 font-bold' : 'text-amber-500/80'}>{riga.pesoKg.toFixed(2)}</td>
                       <td className="text-zinc-400">{riga.l}x{riga.w}x{riga.h}</td>
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