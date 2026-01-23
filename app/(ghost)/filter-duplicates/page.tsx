'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Link from 'next/link';
import { 
  Upload, FileSpreadsheet, Download, Home, 
  AlertCircle, CheckCircle, ArrowLeft, Filter 
} from 'lucide-react';

/* STILE AMBRA DIGITRIK PRO */
const styles = `
  :root {
    --bg: #09090b; 
    --card: #18181b; 
    --border: #27272a; 
    --text: #e4e4e7; 
    --primary: #f59e0b; 
    --primary-dim: rgba(245, 158, 11, 0.1);
    --primary-glow: rgba(245, 158, 11, 0.5);
    --success: #10b981;
    --error: #ef4444;
  }

  body { background-color: var(--bg); color: var(--text); }

  .ghost-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    font-family: ui-sans-serif, system-ui, sans-serif;
  }

  .top-bar {
    background: rgba(24, 24, 27, 0.9);
    border-bottom: 1px solid var(--border);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .drop-zone {
    border: 2px dashed var(--border);
    background: rgba(255,255,255,0.02);
    border-radius: 1rem;
    padding: 3rem;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-bottom: 2rem;
  }
  .drop-zone:hover { border-color: var(--primary); background: var(--primary-dim); }
  .drop-zone.active { border-color: var(--primary); background: var(--primary-dim); transform: scale(1.02); }

  .btn-primary {
    background: var(--primary);
    color: black;
    font-weight: 800;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    text-transform: uppercase;
    font-size: 0.875rem;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 15px var(--primary-glow); }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
  .results-table th {
    background: var(--card);
    color: var(--primary);
    text-transform: uppercase;
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .results-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    color: #a1a1aa;
  }
  
  /* STILI DI GRUPPO */
  .group-odd { background-color: rgba(255, 255, 255, 0.02); }
  .group-even { background-color: transparent; }
  
  /* SEPARATORE MARCATO TRA GRUPPI */
  .group-separator td {
    border-top: 2px solid rgba(245, 158, 11, 0.4); /* Amber separator */
  }

  .col-highlight { color: var(--primary) !important; font-weight: bold; font-family: monospace; }
  .bg-highlight { background: rgba(245, 158, 11, 0.1) !important; }
`;

export default function DuplicateFilterPage() {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState({ msg: 'In attesa di file...', type: 'idle' });
  const [results, setResults] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');

  // Funzione di pulizia (dal tuo script originale)
  const cleanValue = (value: any) => {
    return String(value || '').trim().replace(/\s+/g, '').toLowerCase();
  };

  const processFile = (file: File) => {
    if (!file) return;
    console.log("Inizio elaborazione file:", file.name);
    
    setFileName(file.name);
    setStatus({ msg: `Elaborazione di "${file.name}"...`, type: 'loading' });
    setResults([]);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.length) throw new Error("File Excel vuoto");
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false }) as any[][];

        if (!jsonData || jsonData.length < 2) throw new Error("Nessun dato trovato nel file.");

        const headers = jsonData[0];
        const dataRows = jsonData.slice(1);

        console.log("Headers trovati:", headers);

        // Mappa Header Puliti -> Header Originali
        let headerMap: Record<string, string> = {};
        let cleanedHeaders = headers.map((header: any) => {
          const originalHeader = String(header);
          const cleaned = cleanValue(originalHeader);
          headerMap[cleaned] = originalHeader;
          return cleaned;
        });

        // Crea array di oggetti con chiavi pulite
        let datiPuliti = dataRows.map(row => {
          let newRow: Record<string, any> = {};
          row.forEach((value, index) => {
            if (cleanedHeaders[index]) {
                newRow[cleanedHeaders[index]] = value;
            }
          });
          return newRow;
        });

        // Colonne da preservare (come da tuo script)
        const colonneDaMantenerePulite = [
          'oratransito', 'errore', 'barcodematch', 
          'lunghezzacollocm', 'larghezzacollocm', 'altezzacollocm', 'pesocollokg'
        ];

        let barcodeCounts: Record<string, number> = {};
        
        // 1. Conta le occorrenze dei Barcode
        datiPuliti.forEach(riga => {
            const val = riga['barcodematch'];
            if (val) {
                const clean = cleanValue(val);
                barcodeCounts[clean] = (barcodeCounts[clean] || 0) + 1;
            }
        });

        // 2. Filtra e Costruisci le righe finali
        let risultatiFinali: any[] = [];

        datiPuliti.forEach(riga => {
            const barcodeVal = riga['barcodematch'];
            const barcodeClean = cleanValue(barcodeVal);

            // SE è un duplicato (count > 1)
            if (barcodeVal && barcodeCounts[barcodeClean] > 1) {
                const nuovaRiga: Record<string, any> = {};
                
                colonneDaMantenerePulite.forEach(chiavePulita => {
                    // Usa il valore dalla riga pulita
                    const valore = riga[chiavePulita] !== undefined ? riga[chiavePulita] : '';
                    // Usa il nome colonna originale per l'export (o fallback alla chiave pulita)
                    const chiaveOriginale = headerMap[chiavePulita] || chiavePulita;
                    nuovaRiga[chiaveOriginale] = valore;
                });
                
                risultatiFinali.push(nuovaRiga);
            }
        });

        // 3. Ordina per Barcode
        risultatiFinali.sort((a, b) => {
            const key = headerMap['barcodematch'] || 'barcodematch';
            const valA = String(a[key] || '');
            const valB = String(b[key] || '');
            return valA.localeCompare(valB);
        });

        console.log("Risultati trovati:", risultatiFinali.length);

        if (risultatiFinali.length > 0) {
            setResults(risultatiFinali);
            setStatus({ msg: `Trovati ${risultatiFinali.length} duplicati!`, type: 'success' });
        } else {
            setStatus({ msg: "Nessun duplicato trovato.", type: 'error' });
        }

      } catch (error: any) {
        console.error("Errore elaborazione:", error);
        setStatus({ msg: `Errore: ${error.message}`, type: 'error' });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const exportExcel = () => {
    if (results.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(results);
    const columnWidths = [{ wpx: 60 }, { wpx: 140 }, { wpx: 140 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 80 }];
    ws['!cols'] = columnWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Duplicati Filtrati");
    XLSX.writeFile(wb, `Report_Duplicati_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // --- GESTIONE EVENTI DRAG & DROP ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          processFile(e.target.files[0]);
      }
      // Reset input value per permettere di ricaricare lo stesso file
      e.target.value = '';
  };

  // Helper per il rendering con raggruppamento visivo
  const renderTableRows = () => {
    if (results.length === 0) return null;

    const headers = Object.keys(results[0]);
    // Trova la colonna che contiene "barcode" per il raggruppamento
    const barcodeKey = headers.find(h => h.toLowerCase().includes('barcode')) || headers[0];

    let groupCounter = 0;
    
    return results.map((row, i) => {
      const currentBarcode = row[barcodeKey];
      const prevBarcode = i > 0 ? results[i - 1][barcodeKey] : null;
      
      // Se il barcode cambia rispetto al precedente, è un nuovo gruppo
      const isNewGroup = i === 0 || currentBarcode !== prevBarcode;
      
      if (isNewGroup && i > 0) {
        groupCounter++;
      }

      // Alterna lo sfondo del gruppo (Pari/Dispari)
      const rowClass = groupCounter % 2 === 0 ? 'group-even' : 'group-odd';
      // Aggiungi bordo superiore se è l'inizio di un nuovo gruppo (tranne il primo assoluto)
      const separatorClass = (isNewGroup && i > 0) ? 'group-separator' : '';

      return (
        <tr key={i} className={`${rowClass} ${separatorClass}`}>
          {headers.map((key, j) => {
            const isBarcode = key.toLowerCase().includes('barcode');
            return (
              <td key={j} className={isBarcode ? 'col-highlight bg-highlight' : ''}>
                {row[key]}
              </td>
            );
          })}
        </tr>
      );
    });
  };

  return (
    <div className="ghost-container">
      <style jsx global>{styles}</style>

      {/* Header */}
      <div className="top-bar">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="text-amber-500" /> Filtro Doppi
          </h1>
        </div>
        <Link href="/" className="text-xs font-bold text-zinc-500 hover:text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <Home size={14} /> Home
        </Link>
      </div>

      <main className="max-w-6xl mx-auto w-full p-6 flex-grow">
        
        {/* AREA CARICAMENTO */}
        <div 
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('excelInput')?.click()}
        >
          <input 
            type="file" 
            id="excelInput" 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleManualSelect} 
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full ${dragActive ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-500'}`}>
              <Upload size={48} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Trascina qui il file Excel</h3>
              <p className="text-sm text-zinc-500">Supporta .xlsx, .xls e .csv</p>
            </div>
            <button className="btn-primary">
              Scegli File
            </button>
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-8 shadow-lg">
          <div className="flex items-center gap-3">
            {status.type === 'loading' && <div className="animate-spin text-amber-500"><FileSpreadsheet /></div>}
            {status.type === 'success' && <CheckCircle className="text-emerald-500" />}
            {status.type === 'error' && <AlertCircle className="text-red-500" />}
            <span className={`font-mono text-sm font-bold ${
              status.type === 'success' ? 'text-emerald-500' : 
              status.type === 'error' ? 'text-red-500' : 'text-zinc-400'
            }`}>
              {status.msg}
            </span>
          </div>

          {results.length > 0 && (
            <button onClick={exportExcel} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-sm transition-all shadow-lg shadow-emerald-900/20">
              <Download size={16} /> Scarica Report
            </button>
          )}
        </div>

        {/* TABELLA RISULTATI */}
        {results.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <div className="overflow-x-auto max-h-[500px]">
              <table className="results-table">
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows()}
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center text-xs text-zinc-500 font-mono uppercase tracking-widest">
              Anteprima dei primi {results.length} record duplicati
            </div>
          </div>
        )}

      </main>
    </div>
  );
}