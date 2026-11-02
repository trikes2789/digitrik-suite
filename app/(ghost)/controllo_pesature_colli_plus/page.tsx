'use client';

import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, Download, AlertTriangle, 
  Hash, Search, FileSpreadsheet, Box, CheckCircle2, XOctagon, Copy, Check, Scale, PlusCircle, RefreshCw
} from 'lucide-react';

/* STILI CSS INLINE - TEMA AMBRA UNIFORME */
const stiliCSS = `
  :root { 
    --bg: #09090b; 
    --card-dark: #18181b; 
    --card-light: #ffffff; 
    --border: #27272a; 
    --text-main: #e4e4e7; 
    --primary: #f59e0b; 
    --primary-dim: rgba(245, 158, 11, 0.1);
    --success: #10b981; 
    --error: #ef4444; 
    --error-dim: rgba(239, 68, 68, 0.1);
  }

  body { background-color: var(--bg); color: var(--text-main); font-family: sans-serif; }

  .top-section { 
    background: rgba(9, 9, 11, 0.95); 
    border-bottom: 1px solid var(--border);
    padding: 15px; 
    z-index: 50; 
  }

  .control-card { 
    background: var(--card-dark); 
    border: 1px solid var(--border); 
    border-radius: 16px; 
    padding: 16px; 
  }

  .drop-zone { 
    border: 2px dashed var(--border); 
    background: rgba(255,255,255,0.02); 
    border-radius: 12px; 
    padding: 20px; 
    text-align: center; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    cursor: pointer; 
    transition: 0.2s; 
    min-height: 100px;
  }
  .drop-zone.drag-active { background: var(--primary-dim); border-color: var(--primary); }
  .drop-zone:hover { border-color: var(--primary); }
  .drop-zone.loaded { border-color: var(--success); background: rgba(16, 185, 129, 0.05); }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    margin-bottom: 15px;
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
    transition: 0.2s;
  }
  .stat-card.alert { border-color: var(--error); background: var(--error-dim); }

  .stat-card.active-filter {
    transform: scale(1.02);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  }
  .active-filter .stat-sub { font-weight: 900; color: white !important; }
  
  @keyframes ping-soft {
    0% { transform: scale(1); opacity: 1; }
    75% { transform: scale(1.05); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
  .active-filter::after {
    content: ''; position: absolute; inset: 0; border-radius: 12px; 
    border: 2px solid inherit; animation: ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: -1;
  }

  .stat-icon { position: absolute; top: 12px; right: 12px; opacity: 0.15; }
  .stat-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; color: #71717a; letter-spacing: 1px; margin-bottom: 2px; }
  .stat-value { font-size: 1.5rem; font-weight: 900; color: var(--text-main); line-height: 1; margin-bottom: 2px; }
  .stat-sub { font-size: 0.7rem; color: #a1a1aa; font-family: monospace; transition: 0.2s; }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: monospace;
    font-size: 0.8rem;
  }
  .data-table th { background: var(--card-dark); color: var(--primary); padding: 10px; text-align: left; position: sticky; top: 0; z-index: 10; font-size: 0.7rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 10px; border-bottom: 1px solid var(--border); color: #a1a1aa; transition: all 0.2s; vertical-align: middle; }
  .data-table tr:hover td { background: var(--card-dark); color: white; }
  
  .row-missing td { color: #fbbf24; }
  .row-extra td { color: #60a5fa; } 
  .row-ok td { color: var(--success); opacity: 0.7; }
  .row-fixed td { color: #a3e635; opacity: 0.9; } 
  
  /* STILI RIGA ERRORE (Dimensione normale, sfondi pieni) */
  .row-error td { 
    color: var(--error) !important; 
    font-weight: bold; 
    background: rgba(239, 68, 68, 0.1) !important; 
  }

  .badge-ripassaggio {
    background-color: var(--error);
    color: black;
    font-weight: 900;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    animation: pulse-red 1.5s infinite;
  }

  @keyframes pulse-red {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  
  .copy-btn {
    padding: 4px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    color: #a1a1aa;
    transition: all 0.2s;
    display: inline-flex;
    cursor: pointer;
    border: 1px solid transparent;
  }
  .copy-btn:hover { background: var(--primary-dim); color: var(--primary); }
`;

export default function ControlloPesaturePlus() {
  const [isDragTxt, setIsDragTxt] = useState(false);
  const [isDragCsv, setIsDragCsv] = useState(false);
  
  const [datiTxt, setDatiTxt] = useState<any[]>([]);
  const [datiCsv, setDatiCsv] = useState<any[]>([]);
  const [nomeTxt, setNomeTxt] = useState<string>('');
  const [nomiCsv, setNomiCsv] = useState<string[]>([]);

  const [filtroVista, setFiltroVista] = useState('TUTTI'); 
  const [ricercaSped, setRicercaSped] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- LETTURA FILE TXT (Borderò) ---
  const handleTxtDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragTxt(false);
    if (e.dataTransfer.files.length) processaTxt(e.dataTransfer.files[0]);
  };
  const handleTxtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processaTxt(e.target.files[0]);
  };
  const processaTxt = async (file: File) => {
    setNomeTxt(file.name);
    const testo = await file.text();
    const linee = testo.split('\n');
    let listaTxt: any[] = [];

    for (let linea of linee) {
      if (linea.length > 50 && linea.charAt(0) !== '-' && !linea.startsWith('Data') && !linea.startsWith('Stampa') && !linea.startsWith('Sig') && !linea.startsWith('>>>')) {
        const siglaPart = linea.substring(0, 4).trim();
        const numSped = linea.substring(4, 14).trim();
        const prgCollo = linea.substring(26, 32).trim().padStart(2, '0');
        const tipoCollo = linea.substring(32, 34).trim();
        const siglaDest = linea.substring(52, 56).trim();
        
        const barcodeFull = `${siglaPart}${numSped}${prgCollo}${tipoCollo}${siglaDest}`.replace(/\s+/g, '');
        const euStr = linea.substring(71, 75).trim();
        const cliente = linea.substring(86, 99).trim();

        if (euStr === 'S S' && tipoCollo === '4') {
          listaTxt.push({ numSped, barcodeFull, cliente, siglaDest, prgCollo, rigaGrezza: linea });
        }
      }
    }
    setDatiTxt(listaTxt);
  };

  // --- LETTURA FILE CSV (Packmaster) ---
  const handleCsvDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragCsv(false);
    if (e.dataTransfer.files.length) processaCsv(e.dataTransfer.files);
  };
  const handleCsvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) processaCsv(e.target.files);
  };
  const processaCsv = async (files: FileList) => {
    const arrFiles = Array.from(files);
    setNomiCsv(prev => [...prev, ...arrFiles.map(f => f.name)]);
    let listaCsv: any[] = [];

    for (let file of arrFiles) {
      const testo = await file.text();
      const linee = testo.split('\n').filter(l => l.trim() !== '');
      if (linee.length === 0) continue;

      const separatore = linee[0].includes(';') ? ';' : ',';
      let idxId = 0, idxData = 1, idxOra = 2, idxErrore = 4, idxSped = 8, idxL = 9, idxW = 10, idxH = 11, idxPeso = 12;

      for (let i = 0; i < linee.length; i++) {
        const campi = linee[i].split(separatore);
        
        if (i === 0) {
          if (campi[1]?.trim().toLowerCase() === 'data transito') {
             idxId = 0; idxData = 1; idxOra = 2; idxErrore = 3; idxSped = 7; idxL = 9; idxW = 10; idxH = 11; idxPeso = 12;
          } else {
             idxId = 0; idxData = 2; idxOra = 3; idxErrore = 4; idxSped = 8; idxL = 9; idxW = 10; idxH = 11; idxPeso = 12;
          }
          continue;
        }

        if (campi.length >= 10) {
          const clean = (val: string) => val?.trim().replace(/["\r]/g, '') || '';
          
          if (clean(campi[16]) !== '4') continue;

          const spedizioneRaw = clean(campi[idxSped]);
          if (!spedizioneRaw || spedizioneRaw.includes('ERR_NO_READ')) continue;

          const matchSped = spedizioneRaw.match(/[A-Z]{2}(\d{9})/);
          const numeroSpedizionePuro = matchSped ? matchSped[1] : spedizioneRaw;

          const errore = clean(campi[idxErrore]);
          const l = parseFloat(clean(campi[idxL]).replace(',','.')) || 0;
          const w = parseFloat(clean(campi[idxW]).replace(',','.')) || 0;
          const h = parseFloat(clean(campi[idxH]).replace(',','.')) || 0;
          const pesoKg = parseFloat(clean(campi[idxPeso]).replace(',','.')) || 0;
          
          const dataStr = clean(campi[idxData]);
          const oraStr = clean(campi[idxOra]);
          let timestamp = 0;
          if (dataStr && oraStr) {
             const pd = dataStr.split('/');
             const po = oraStr.split(':');
             if (pd.length === 3 && po.length >= 2) {
                 timestamp = new Date(parseInt(pd[2]), parseInt(pd[1])-1, parseInt(pd[0]), parseInt(po[0]), parseInt(po[1]), parseInt(po[2]||'0')).getTime();
             }
          }

          listaCsv.push({
             numeroSpedizionePuro, 
             barcodeMatch: spedizioneRaw.replace(/\s+/g, ''), 
             errore, l, w, h, pesoKg, timestamp
          });
        }
      }
    }
    
    listaCsv.sort((a,b) => a.timestamp - b.timestamp);
    setDatiCsv(prev => {
        const uniti = [...prev, ...listaCsv];
        uniti.sort((a,b) => a.timestamp - b.timestamp);
        return uniti;
    });
  };

  // --- MOTORE DI MATCHING BIDIREZIONALE MIGLIORATO ---
  const analisiIncrociata = useMemo(() => {
    if (datiTxt.length === 0 && datiCsv.length === 0) return [];
    
    let risultati: any[] = [];
    let csvUsati = new Set(); 

    // 1. TXT verso CSV 
    datiTxt.forEach(itemTxt => {
       const passaggiCsv = datiCsv.filter((c, index) => {
          const isMatch = c.barcodeMatch.includes(itemTxt.barcodeFull) ||
                          c.barcodeMatch.includes(itemTxt.numSped) ||
                          c.numeroSpedizionePuro === itemTxt.numSped;
          if (isMatch) csvUsati.add(index); 
          return isMatch;
       });
       
       let stato = 'MANCANTE';
       let errori: string[] = [];
       let pesoMax = 0;
       let l=0, w=0, h=0;
       let isRisoltoDaRipassaggio = false;

       if (passaggiCsv.length > 0) {
          stato = 'OK';
          let haMaiAvutoErrore = false;
          let ultimoValido = false;

          passaggiCsv.forEach((p: any) => {
             const isAnomalo = p.errore || p.pesoKg === 0;
             if (isAnomalo) {
                 if (p.errore) errori.push(p.errore);
                 else errori.push("ANOMALIA: PESO 0");
                 haMaiAvutoErrore = true;
                 ultimoValido = false; 
             } else {
                 ultimoValido = true;
             }

             if (p.pesoKg > pesoMax) {
                pesoMax = p.pesoKg;
                l = p.l; w = p.w; h = p.h;
             }
          });

          if (haMaiAvutoErrore) {
              if (ultimoValido && pesoMax > 0) {
                  stato = 'RIPASSAGGIO_OK';
                  isRisoltoDaRipassaggio = true;
              } else {
                  stato = 'ERRORE_CSV';
              }
          }
       }

       risultati.push({
         ...itemTxt,
         stato,
         erroreCsv: errori.length > 0 ? errori.join(' | ') : '',
         isRisoltoDaRipassaggio,
         pesoMax, l, w, h,
         passaggiCsv: passaggiCsv.length
       });
    });

    // 2. CSV Extra verso TXT
    let extraMap = new Map();
    datiCsv.forEach((c, index) => {
        if (!csvUsati.has(index)) {
            const key = c.barcodeMatch || c.numeroSpedizionePuro;
            if (!extraMap.has(key)) extraMap.set(key, []);
            extraMap.get(key).push(c);
        }
    });

    extraMap.forEach((passaggi: any[], key: string) => {
        let errori: string[] = [];
        let pesoMax = 0;
        let l=0, w=0, h=0;
        let haMaiAvutoErrore = false;
        let ultimoValido = false;
        
        passaggi.forEach((p: any) => {
           const isAnomalo = p.errore || p.pesoKg === 0;
           if (isAnomalo) {
               if (p.errore) errori.push(p.errore);
               else errori.push("ANOMALIA: PESO 0");
               haMaiAvutoErrore = true;
               ultimoValido = false;
           } else {
               ultimoValido = true;
           }

           if (p.pesoKg > pesoMax) {
              pesoMax = p.pesoKg;
              l = p.l; w = p.w; h = p.h;
           }
        });

        let isRisoltoDaRipassaggio = false;
        let statoEffettivo = 'EXTRA_CSV';

        if (haMaiAvutoErrore) {
            if (ultimoValido && pesoMax > 0) {
                statoEffettivo = 'EXTRA_RIPASSAGGIO_OK';
                isRisoltoDaRipassaggio = true;
            } else {
                statoEffettivo = 'ERRORE_CSV'; 
            }
        }

        risultati.push({
           numSped: passaggi[0].numeroSpedizionePuro,
           barcodeFull: passaggi[0].barcodeMatch,
           cliente: 'SCONOSCIUTO (Non in Borderò)',
           siglaDest: '-',
           prgCollo: '-',
           rigaGrezza: '',
           stato: statoEffettivo,
           isRisoltoDaRipassaggio,
           erroreCsv: errori.length > 0 ? errori.join(' | ') : '',
           pesoMax, l, w, h,
           passaggiCsv: passaggi.length
        });
    });

    return risultati;
  }, [datiTxt, datiCsv]);

  // --- FILTRO E ORDINAMENTO ---
  const datiFiltrati = useMemo(() => {
    let filtrati = analisiIncrociata.filter(r => {
      if (ricercaSped && !r.barcodeFull.includes(ricercaSped.toUpperCase()) && !r.cliente.toLowerCase().includes(ricercaSped.toLowerCase())) return false;
      
      if (filtroVista === 'ERRORI' && r.stato !== 'ERRORE_CSV') return false; 
      if (filtroVista === 'MANCANTI' && r.stato !== 'MANCANTE') return false;
      if (filtroVista === 'EXTRA' && !r.stato.includes('EXTRA_CSV')) return false;
      if (filtroVista === 'OK' && (r.stato === 'ERRORE_CSV' || r.stato === 'MANCANTE' || r.stato.includes('EXTRA'))) return false; 
      
      return true;
    });

    // SPARA GLI ERRORI IN CIMA
    filtrati.sort((a, b) => {
      const aIsError = a.stato === 'ERRORE_CSV';
      const bIsError = b.stato === 'ERRORE_CSV';
      
      if (aIsError && !bIsError) return -1;
      if (!aIsError && bIsError) return 1;
      return 0; 
    });

    return filtrati;
  }, [analisiIncrociata, ricercaSped, filtroVista]);

  // Statistiche per la Dashboard
  const stats = useMemo(() => {
    let mancanti = 0;
    let conErroreAperto = 0;
    let perfetti = 0;
    let extra = 0;

    analisiIncrociata.forEach(r => {
       if (r.stato === 'MANCANTE') mancanti++;
       else if (r.stato === 'ERRORE_CSV') conErroreAperto++;
       else if (r.stato === 'EXTRA_CSV' || r.stato === 'EXTRA_RIPASSAGGIO_OK') extra++;
       else if (r.stato === 'OK' || r.stato === 'RIPASSAGGIO_OK') perfetti++;
    });
    
    return { 
      totaleTxt: datiTxt.length, 
      mancanti, conErrore: conErroreAperto, perfetti, extra,
      totCsv: datiCsv.length 
    };
  }, [analisiIncrociata, datiTxt, datiCsv]);

  const handleCopy = async (testo: string, id: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(testo);
      } else {
        const ta = document.createElement("textarea"); 
        ta.value = testo; ta.style.position = "absolute"; ta.style.left = "-9999px";
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      setCopiedId(id); setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  const scaricaReport = () => {
    if (datiFiltrati.length === 0) return;
    const intestazioni = "Spedizione_Intera;Stato;Cliente;Dest;Collo;Errore_Packmaster;Peso_Max;Dimensioni\n";
    const contenuto = datiFiltrati.map(r => 
      `${r.barcodeFull};${r.stato};${r.cliente};${r.siglaDest};${r.prgCollo};${r.erroreCsv || '-'};${r.pesoMax.toFixed(2)};${r.l}x${r.w}x${r.h}`
    ).join('\n');
    const blob = new Blob([intestazioni + contenuto], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Incrocio_Pesature_${new Date().getTime()}.csv`;
    link.click();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: stiliCSS }} />
      <div className="flex flex-col h-screen bg-black text-white p-4 overflow-hidden">
        
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Scale size={20} className="text-amber-500"/> CONTROLLO PESATURE TIPO 4
            {(filtroVista !== 'TUTTI' || ricercaSped) && <span className="ml-2 bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black">FILTRATE</span>}
          </h1>
          <div className="flex gap-2">
             <button onClick={() => { setDatiTxt([]); setDatiCsv([]); setNomeTxt(''); setNomiCsv([]); setFiltroVista('TUTTI'); setRicercaSped('');}} className="bg-zinc-800 text-xs font-bold px-3 py-1.5 rounded uppercase hover:text-amber-500 transition-colors">Reset</button>
             <button onClick={scaricaReport} disabled={datiFiltrati.length === 0} className="bg-amber-600 disabled:opacity-50 text-xs font-bold px-3 py-1.5 rounded uppercase hover:bg-amber-500 transition-colors text-white">Esporta Report</button>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-4">
           <div 
             className={`drop-zone ${isDragTxt ? 'drag-active' : ''} ${nomeTxt ? 'loaded' : ''}`}
             onDragOver={(e)=>{e.preventDefault(); setIsDragTxt(true);}} onDragLeave={()=>setIsDragTxt(false)} onDrop={handleTxtDrop}
             onClick={() => document.getElementById('fileTxt')?.click()}
           >
              <FileText size={28} className={nomeTxt ? "text-emerald-500 mb-2" : "text-amber-500 mb-2"}/>
              <p className="font-bold text-sm uppercase">{nomeTxt ? 'TXT BORDERÒ CARICATO' : '1. Carica Borderò (solo Tipo 4)'}</p>
              <p className="text-xs text-zinc-500 font-mono mt-1">{nomeTxt || 'Trascina o clicca per caricare'}</p>
              <input type="file" id="fileTxt" className="hidden" accept=".txt" onChange={handleTxtChange} />
           </div>

           <div 
             className={`drop-zone ${isDragCsv ? 'drag-active' : ''} ${nomiCsv.length > 0 ? 'loaded' : ''}`}
             onDragOver={(e)=>{e.preventDefault(); setIsDragCsv(true);}} onDragLeave={()=>setIsDragCsv(false)} onDrop={handleCsvDrop}
             onClick={() => document.getElementById('fileCsv')?.click()}
           >
              <FileSpreadsheet size={28} className={nomiCsv.length > 0 ? "text-emerald-500 mb-2" : "text-amber-500 mb-2"}/>
              <p className="font-bold text-sm uppercase">{nomiCsv.length > 0 ? `${nomiCsv.length} CSV PESATURE CARICATI` : '2. Carica CSV Packmaster'}</p>
              <p className="text-xs text-zinc-500 font-mono mt-1">{nomiCsv.length > 0 ? `${datiCsv.length} colli Tipo 4 trovati` : 'Trascina CSV Storico o Odierno'}</p>
              <input type="file" multiple id="fileCsv" className="hidden" accept=".csv,.txt" onChange={handleCsvChange} />
           </div>
        </div>

        <div className="dashboard-grid">
           <div className="stat-card">
              <Hash size={24} className="stat-icon text-zinc-500"/>
              <span className="stat-label">Tipo 4 in Borderò</span>
              <span className="stat-value text-white">{stats.totaleTxt}</span>
              <span className="stat-sub">Estratti da TXT</span>
           </div>
           
           <div onClick={() => setFiltroVista(filtroVista === 'MANCANTI' ? 'TUTTI' : 'MANCANTI')} className={`stat-card cursor-pointer hover:border-amber-500 ${filtroVista === 'MANCANTI' ? 'border-amber-500 bg-amber-500/10 active-filter' : ''}`}>
              <AlertTriangle size={24} className="stat-icon text-amber-500"/>
              <span className="stat-label text-amber-500">Saltate / Mancanti</span>
              <span className="stat-value text-amber-500">{stats.mancanti}</span>
              <span className="stat-sub">{filtroVista === 'MANCANTI' ? 'FILTRO ATTIVO' : 'Nel TXT ma non in Packmaster'}</span>
           </div>

           <div onClick={() => setFiltroVista(filtroVista === 'EXTRA' ? 'TUTTI' : 'EXTRA')} className={`stat-card cursor-pointer hover:border-blue-500 ${filtroVista === 'EXTRA' ? 'border-blue-500 bg-blue-500/10 active-filter' : ''}`}>
              <PlusCircle size={24} className="stat-icon text-blue-500"/>
              <span className="stat-label text-blue-500">Extra (Non Previste)</span>
              <span className="stat-value text-blue-500">{stats.extra}</span>
              <span className="stat-sub">{filtroVista === 'EXTRA' ? 'FILTRO ATTIVO' : 'Pesate Tipo 4 Non in TXT'}</span>
           </div>

           <div onClick={() => setFiltroVista(filtroVista === 'ERRORI' ? 'TUTTI' : 'ERRORI')} className={`stat-card cursor-pointer hover:border-red-500 ${filtroVista === 'ERRORI' ? 'border-red-500 bg-red-500/10 active-filter' : ''}`}>
              <XOctagon size={24} className="stat-icon text-red-500"/>
              <span className="stat-label text-red-500">Errori Macchina</span>
              <span className="stat-value text-red-500">{stats.conErrore}</span>
              <span className="stat-sub">{filtroVista === 'ERRORI' ? 'FILTRO ATTIVO' : 'Da ripassare (Non risolti)'}</span>
           </div>

           <div onClick={() => setFiltroVista(filtroVista === 'OK' ? 'TUTTI' : 'OK')} className={`stat-card cursor-pointer hover:border-emerald-500 ${filtroVista === 'OK' ? 'border-emerald-500 bg-emerald-500/10 active-filter' : ''}`}>
              <CheckCircle2 size={24} className="stat-icon text-emerald-500"/>
              <span className="stat-label text-emerald-500">Pesature Valide</span>
              <span className="stat-value text-emerald-500">{stats.perfetti}</span>
              <span className="stat-sub">{filtroVista === 'OK' ? 'FILTRO ATTIVO' : 'TXT e CSV Allineati / Risolti'}</span>
           </div>
        </div>

        <div className="flex gap-4 mb-2">
           <input type="text" placeholder="Cerca codice a barre esatto o cliente..." value={ricercaSped} onChange={e => setRicercaSped(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-sm font-bold w-full uppercase outline-none focus:border-amber-500 text-white" />
        </div>

        <div className="flex-grow overflow-auto bg-black border border-zinc-800 rounded-lg">
           <table className="data-table w-full">
             <thead>
               <tr>
                 <th>Spedizione (Completa)</th>
                 <th>Cliente / Mittente</th>
                 <th>Stato Incrocio</th>
                 <th>Dest.</th>
                 <th>Errore CSV</th>
                 <th>Peso CSV (kg)</th>
                 <th>Misure CSV (cm)</th>
               </tr>
             </thead>
             <tbody>
               {datiFiltrati.length === 0 ? (
                 <tr><td colSpan={7} className="text-center py-8 text-zinc-500 font-bold uppercase">Nessun dato da mostrare</td></tr>
               ) : (
                 datiFiltrati.map((r, i) => {
                   let cssClass = '';
                   
                   if (r.stato === 'ERRORE_CSV') cssClass = 'row-error';
                   else if (r.stato === 'MANCANTE') cssClass = 'row-missing';
                   else if (r.stato.includes('EXTRA_CSV')) cssClass = 'row-extra';
                   else if (r.isRisoltoDaRipassaggio) cssClass = 'row-fixed';
                   else if (r.stato === 'OK') cssClass = 'row-ok';

                   return (
                     <tr key={i} className={cssClass}>
                       <td className="font-bold text-white">
                         <div className="flex items-center justify-between gap-2 max-w-[250px]">
                           <span className="truncate">{r.barcodeFull}</span>
                           <button onClick={() => handleCopy(r.barcodeFull, `${i}`)} className="copy-btn shrink-0" title="Copia Spedizione Intera">
                             {copiedId === `${i}` ? <Check size={14} className="text-emerald-500"/> : <Copy size={14} />}
                           </button>
                         </div>
                       </td>
                       <td className="font-bold text-zinc-300">
                           <div className="flex flex-col items-start">
                             <span>{r.cliente}</span>
                             {r.stato === 'ERRORE_CSV' && (
                                 <div className="badge-ripassaggio">
                                    <RefreshCw size={10}/> EFFETTUARE RIPASSAGGIO
                                 </div>
                             )}
                           </div>
                       </td>
                       
                       <td className="font-black text-[10px] tracking-wider badge-stato">
                         {r.stato === 'ERRORE_CSV' && <span className="bg-red-500 text-black px-2 py-1 rounded">ERRORE (DA RIPASSARE)</span>}
                         {r.isRisoltoDaRipassaggio && <span className="bg-lime-500/20 text-lime-400 px-2 py-1 rounded">RIPASSAGGIO OK (RISOLTO)</span>}
                         {r.stato === 'MANCANTE' && <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded">MANCANTE IN PESATURA</span>}
                         {r.stato === 'EXTRA_CSV' && <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded">EXTRA (NON IN BORDERÒ)</span>}
                         {r.stato === 'OK' && !r.isRisoltoDaRipassaggio && <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">ALLINEATO</span>}
                       </td>
                       
                       <td>{r.siglaDest}</td>
                       <td className={r.stato === 'ERRORE_CSV' ? 'font-black text-red-500' : ''}>
                          {r.erroreCsv || '-'}
                          {r.passaggiCsv > 1 && <span className="block text-xs font-normal text-zinc-500 mt-1">({r.passaggiCsv} letture)</span>}
                       </td>
                       <td className="font-mono">{r.pesoMax > 0 ? r.pesoMax.toFixed(2) : '-'}</td>
                       <td className="font-mono">{r.l > 0 ? `${r.l}x${r.w}x${r.h}` : '-'}</td>
                     </tr>
                   )
                 })
               )}
             </tbody>
           </table>
        </div>

      </div>
    </>
  );
}