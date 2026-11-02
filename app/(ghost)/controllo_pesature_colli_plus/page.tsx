'use client';

import React, { useState, useMemo } from 'react';
import { 
  Upload, FileText, Download, AlertTriangle, 
  Hash, Search, FileSpreadsheet, Box, CheckCircle2, XOctagon, Copy, Check, Scale
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
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

  .stat-icon { position: absolute; top: 12px; right: 12px; opacity: 0.15; }
  .stat-label { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; color: #71717a; letter-spacing: 1px; margin-bottom: 2px; }
  .stat-value { font-size: 1.5rem; font-weight: 900; color: var(--text-main); line-height: 1; margin-bottom: 2px; }
  .stat-sub { font-size: 0.7rem; color: #a1a1aa; font-family: monospace; }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-family: monospace;
    font-size: 0.8rem;
  }
  .data-table th { background: var(--card-dark); color: var(--primary); padding: 10px; text-align: left; position: sticky; top: 0; z-index: 10; font-size: 0.7rem; text-transform: uppercase; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 8px 10px; border-bottom: 1px solid var(--border); color: #a1a1aa; }
  .data-table tr:hover td { background: var(--card-dark); color: white; }
  
  .row-missing td { color: #fbbf24; }
  .row-error td { color: var(--error); font-weight: bold; }
  .row-ok td { color: var(--success); opacity: 0.7; }
  
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
  
  // Dati grezzi estratti
  const [datiTxt, setDatiTxt] = useState<any[]>([]);
  const [datiCsv, setDatiCsv] = useState<any[]>([]);
  
  // Nomi file
  const [nomeTxt, setNomeTxt] = useState<string>('');
  const [nomiCsv, setNomiCsv] = useState<string[]>([]);

  // Filtro
  const [filtroVista, setFiltroVista] = useState('TUTTI'); // TUTTI, ERRORI, MANCANTI, OK
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
    let listaTxt = [];

    for (let linea of linee) {
      if (linea.length > 50 && linea.charAt(0) !== '-' && !linea.startsWith('Data') && !linea.startsWith('Stampa') && !linea.startsWith('Sig') && !linea.startsWith('>>>')) {
        // Estrazione posizionale rigida in base alle colonne del TXT fornito
        const siglaPart = linea.substring(0, 3).trim();
        const numSped = linea.substring(4, 13).trim();
        const prgCollo = linea.substring(30, 34).trim();
        const tipoCollo = linea.substring(34, 36).trim();
        const siglaDest = linea.substring(56, 60).trim();
        const barcodeFull = `${siglaPart}${numSped}${prgCollo.padStart(2,'0')}${tipoCollo}${siglaDest}`;
        
        const eu1 = linea.substring(72, 73).trim();
        const eu2 = linea.substring(74, 75).trim();
        const cliente = linea.substring(87, 98).trim();

        // Filtro solo spedizioni con S S (Partite)
        if (eu1 === 'S' && eu2 === 'S') {
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
    let listaCsv = [];

    for (let file of arrFiles) {
      const testo = await file.text();
      const linee = testo.split('\n').filter(l => l.trim() !== '');
      if (linee.length === 0) continue;

      const separatore = linee[0].includes(';') ? ';' : ',';
      
      let idxId = 0, idxErrore = 4, idxSped = 8, idxL = 9, idxW = 10, idxH = 11, idxPeso = 12;

      for (let i = 0; i < linee.length; i++) {
        const linea = linee[i]; // CORRETTO QUI: Aggiunta la definizione della variabile linea
        const campi = linea.split(separatore);
        
        // Riconoscimento Tracciato (Storico / Odierno)
        if (i === 0) {
          if (campi[1]?.trim().toLowerCase() === 'data transito') {
             idxId = 0; idxErrore = 3; idxSped = 7; idxL = 9; idxW = 10; idxH = 11; idxPeso = 12;
          } else {
             idxId = 0; idxErrore = 4; idxSped = 8; idxL = 9; idxW = 10; idxH = 11; idxPeso = 12;
          }
          continue;
        }

        if (campi.length >= 10) {
          const clean = (val: string) => val?.trim().replace(/["\r]/g, '') || '';
          const spedizioneRaw = clean(campi[idxSped]);
          if (!spedizioneRaw || spedizioneRaw.includes('ERR_NO_READ')) continue;

          // Dal CSV estraiamo il numero di spedizione puro per poterlo matchare col TXT (che a volte è di 9 cifre)
          // Il Barcode Match di solito è Sigla+Sped+Collo+Tipo+Dest. Prendiamo solo le cifre della spedizione.
          const matchSped = spedizioneRaw.match(/[A-Z]{2}(\d{9})/);
          const numeroSpedizionePuro = matchSped ? matchSped[1] : spedizioneRaw;

          const errore = clean(campi[idxErrore]);
          const l = parseFloat(clean(campi[idxL]).replace(',','.')) || 0;
          const w = parseFloat(clean(campi[idxW]).replace(',','.')) || 0;
          const h = parseFloat(clean(campi[idxH]).replace(',','.')) || 0;
          const pesoKg = parseFloat(clean(campi[idxPeso]).replace(',','.')) || 0;

          listaCsv.push({
             numeroSpedizionePuro, 
             barcodeMatch: spedizioneRaw,
             errore, l, w, h, pesoKg
          });
        }
      }
    }
    setDatiCsv(prev => [...prev, ...listaCsv]);
  };

  // --- MOTORE DI MATCHING (Incrocio TXT vs CSV) ---
  const analisiIncrociata = useMemo(() => {
    if (datiTxt.length === 0) return [];
    
    return datiTxt.map(itemTxt => {
       // Cerca nel CSV tutti i passaggi di questo numero di spedizione
       const passaggiCsv = datiCsv.filter(c => c.numeroSpedizionePuro === itemTxt.numSped || c.barcodeMatch.includes(itemTxt.numSped));
       
       let stato = 'MANCANTE'; // Default: nel TXT c'è, ma non è passato in Packmaster
       let errori: string[] = [];
       let pesoMax = 0;
       let l=0, w=0, h=0;

       if (passaggiCsv.length > 0) {
          stato = 'OK';
          // Controlliamo se uno dei passaggi ha un errore
          passaggiCsv.forEach(p => {
             if (p.errore) errori.push(p.errore);
             if (p.pesoKg > pesoMax) {
                pesoMax = p.pesoKg;
                l = p.l; w = p.w; h = p.h;
             }
          });
          if (errori.length > 0) stato = 'ERRORE_CSV';
       }

       return {
         ...itemTxt,
         stato,
         erroreCsv: errori.length > 0 ? errori.join(' | ') : '',
         pesoMax, l, w, h,
         passaggiCsv: passaggiCsv.length
       };
    });
  }, [datiTxt, datiCsv]);

  // --- FILTRO VISUALE ---
  const datiFiltrati = useMemo(() => {
    return analisiIncrociata.filter(r => {
      if (ricercaSped && !r.numSped.includes(ricercaSped) && !r.cliente.toLowerCase().includes(ricercaSped.toLowerCase())) return false;
      if (filtroVista === 'ERRORI' && r.stato !== 'ERRORE_CSV') return false;
      if (filtroVista === 'MANCANTI' && r.stato !== 'MANCANTE') return false;
      if (filtroVista === 'OK' && r.stato !== 'OK') return false;
      return true;
    });
  }, [analisiIncrociata, ricercaSped, filtroVista]);

  // Statistiche per la Dashboard
  const stats = useMemo(() => {
    let mancanti = 0;
    let conErrore = 0;
    let perfetti = 0;
    analisiIncrociata.forEach(r => {
       if (r.stato === 'MANCANTE') mancanti++;
       else if (r.stato === 'ERRORE_CSV') conErrore++;
       else if (r.stato === 'OK') perfetti++;
    });
    return { 
      totale: analisiIncrociata.length, 
      mancanti, conErrore, perfetti, 
      totCsv: datiCsv.length 
    };
  }, [analisiIncrociata, datiCsv]);

  // Funzione Copia sicura
  const handleCopy = async (testo: string, id: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(testo);
      } else {
        const ta = document.createElement("textarea"); 
        ta.value = testo; 
        ta.style.position = "absolute"; 
        ta.style.left = "-9999px";
        document.body.appendChild(ta); 
        ta.select(); 
        document.execCommand('copy'); 
        document.body.removeChild(ta);
      }
      setCopiedId(id); 
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  const scaricaReport = () => {
    if (datiFiltrati.length === 0) return;
    const intestazioni = "Spedizione;Stato;Cliente;Dest;Collo;Errore_Packmaster;Peso_Max;Dimensioni\n";
    const contenuto = datiFiltrati.map(r => 
      `${r.numSped};${r.stato};${r.cliente};${r.siglaDest};${r.prgCollo};${r.erroreCsv || '-'};${r.pesoMax.toFixed(2)};${r.l}x${r.w}x${r.h}`
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
            <Scale size={20} className="text-amber-500"/> CONTROLLO PESATURE PLUS
          </h1>
          <div className="flex gap-2">
             <button onClick={() => { setDatiTxt([]); setDatiCsv([]); setNomeTxt(''); setNomiCsv([]); setFiltroVista('TUTTI'); setRicercaSped('');}} className="bg-zinc-800 text-xs font-bold px-3 py-1.5 rounded uppercase hover:text-amber-500 transition-colors">Reset</button>
             <button onClick={scaricaReport} disabled={datiFiltrati.length === 0} className="bg-amber-600 disabled:opacity-50 text-xs font-bold px-3 py-1.5 rounded uppercase hover:bg-amber-500 transition-colors text-white">Esporta Report</button>
          </div>
        </header>

        {/* AREE DI CARICAMENTO */}
        <div className="grid grid-cols-2 gap-4 mb-4">
           {/* BOX TXT */}
           <div 
             className={`drop-zone ${isDragTxt ? 'drag-active' : ''} ${nomeTxt ? 'loaded' : ''}`}
             onDragOver={(e)=>{e.preventDefault(); setIsDragTxt(true);}} onDragLeave={()=>setIsDragTxt(false)} onDrop={handleTxtDrop}
             onClick={() => document.getElementById('fileTxt')?.click()}
           >
              <FileText size={28} className={nomeTxt ? "text-emerald-500 mb-2" : "text-amber-500 mb-2"}/>
              <p className="font-bold text-sm uppercase">{nomeTxt ? 'TXT BORDERÒ CARICATO' : '1. Carica Borderò Partenze (TXT)'}</p>
              <p className="text-xs text-zinc-500 font-mono mt-1">{nomeTxt || 'Trascina o clicca per caricare'}</p>
              <input type="file" id="fileTxt" className="hidden" accept=".txt" onChange={handleTxtChange} />
           </div>

           {/* BOX CSV */}
           <div 
             className={`drop-zone ${isDragCsv ? 'drag-active' : ''} ${nomiCsv.length > 0 ? 'loaded' : ''}`}
             onDragOver={(e)=>{e.preventDefault(); setIsDragCsv(true);}} onDragLeave={()=>setIsDragCsv(false)} onDrop={handleCsvDrop}
             onClick={() => document.getElementById('fileCsv')?.click()}
           >
              <FileSpreadsheet size={28} className={nomiCsv.length > 0 ? "text-emerald-500 mb-2" : "text-amber-500 mb-2"}/>
              <p className="font-bold text-sm uppercase">{nomiCsv.length > 0 ? `${nomiCsv.length} CSV PESATURE CARICATI` : '2. Carica CSV Packmaster'}</p>
              <p className="text-xs text-zinc-500 font-mono mt-1">{nomiCsv.length > 0 ? `${datiCsv.length} letture in memoria` : 'Trascina CSV Storico o Odierno'}</p>
              <input type="file" multiple id="fileCsv" className="hidden" accept=".csv,.txt" onChange={handleCsvChange} />
           </div>
        </div>

        {/* DASHBOARD RISULTATI INCROCIO */}
        <div className="dashboard-grid">
           <div className="stat-card">
              <Hash size={24} className="stat-icon text-zinc-500"/>
              <span className="stat-label">Spedizioni in Borderò</span>
              <span className="stat-value text-white">{stats.totale}</span>
              <span className="stat-sub">Da File TXT</span>
           </div>
           
           <div onClick={() => setFiltroVista(filtroVista === 'MANCANTI' ? 'TUTTI' : 'MANCANTI')} className={`stat-card cursor-pointer hover:border-amber-500 ${filtroVista === 'MANCANTI' ? 'border-amber-500 bg-amber-500/10' : ''}`}>
              <AlertTriangle size={24} className="stat-icon text-amber-500"/>
              <span className="stat-label text-amber-500">Saltate / Mancanti</span>
              <span className="stat-value text-amber-500">{stats.mancanti}</span>
              <span className="stat-sub">Nel TXT ma non in Packmaster</span>
           </div>

           <div onClick={() => setFiltroVista(filtroVista === 'ERRORI' ? 'TUTTI' : 'ERRORI')} className={`stat-card cursor-pointer hover:border-red-500 ${filtroVista === 'ERRORI' ? 'border-red-500 bg-red-500/10' : ''}`}>
              <XOctagon size={24} className="stat-icon text-red-500"/>
              <span className="stat-label text-red-500">Errori Packmaster</span>
              <span className="stat-value text-red-500">{stats.conErrore}</span>
              <span className="stat-sub">Nel TXT ma con anomalia CSV</span>
           </div>

           <div onClick={() => setFiltroVista(filtroVista === 'OK' ? 'TUTTI' : 'OK')} className={`stat-card cursor-pointer hover:border-emerald-500 ${filtroVista === 'OK' ? 'border-emerald-500 bg-emerald-500/10' : ''}`}>
              <CheckCircle2 size={24} className="stat-icon text-emerald-500"/>
              <span className="stat-label text-emerald-500">Pesature Valide</span>
              <span className="stat-value text-emerald-500">{stats.perfetti}</span>
              <span className="stat-sub">TXT e CSV allineati senza errori</span>
           </div>
        </div>

        {/* TABELLA REPORT */}
        <div className="flex gap-4 mb-2">
           <input type="text" placeholder="Cerca spedizione o cliente..." value={ricercaSped} onChange={e => setRicercaSped(e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-sm font-bold w-full uppercase outline-none focus:border-amber-500 text-white" />
        </div>

        <div className="flex-grow overflow-auto bg-black border border-zinc-800 rounded-lg">
           <table className="data-table w-full">
             <thead>
               <tr>
                 <th>Spedizione (Borderò)</th>
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
                   if (r.stato === 'MANCANTE') cssClass = 'row-missing';
                   if (r.stato === 'ERRORE_CSV') cssClass = 'row-error';
                   if (r.stato === 'OK') cssClass = 'row-ok';

                   return (
                     <tr key={i} className={cssClass}>
                       <td className="font-bold text-white flex items-center gap-2">
                         {r.numSped}
                         <button onClick={() => handleCopy(r.numSped, `${i}`)} className="copy-btn">
                           {copiedId === `${i}` ? <Check size={12} className="text-emerald-500"/> : <Copy size={12} />}
                         </button>
                       </td>
                       <td className="font-bold text-zinc-300">{r.cliente}</td>
                       
                       <td className="font-black text-[10px] tracking-wider">
                         {r.stato === 'MANCANTE' && <span className="bg-amber-500/20 text-amber-500 px-2 py-1 rounded">MANCANTE IN PESATURA</span>}
                         {r.stato === 'ERRORE_CSV' && <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded">ERRORE MACCHINA</span>}
                         {r.stato === 'OK' && <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">ALLINEATO</span>}
                       </td>
                       
                       <td>{r.siglaDest}</td>
                       <td className={r.erroreCsv ? 'font-black' : ''}>{r.erroreCsv || '-'}</td>
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