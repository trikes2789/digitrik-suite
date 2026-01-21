'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { 
  Calculator, Upload, Save, Trash2, FileSpreadsheet, 
  ArrowLeft, Download, Search, Filter, TrendingUp, 
  Package, Scale, AlertTriangle, Euro, Calendar
} from 'lucide-react';
import Link from 'next/link';

// --- TIPI DATI ---
interface DailyRecord {
  id: string;
  date: string;
  anno: number;
  mese: number;
  spedArr: number;
  colliArr: number;
  pesoArr: number;
  spedPart: number;
  colliPart: number;
  pesoPart: number;
  mancanze: number;
  fatturatoArr: number;
  fatturatoPart: number;
  fatturatoTotale: number;
  arriviReali: number;
  percMancanze: number;
}

// --- COSTANTI ---
const FISSO_GIORNALIERO = 2211.60;
const TARIFFA_SPED = 0.121;
const TARIFFA_PESO = 0.024;

export default function GestioneSpedizioni() {
  // STATO
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(false);
  
  // INPUT FORM
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    spedArr: 0, colliArr: 0, pesoArr: 0,
    spedPart: 0, colliPart: 0, pesoPart: 0,
    manc1: 0, manc2: 0, manc3: 0
  });

  // FILTRI STORICO
  const [filterYear, setFilterYear] = useState<string>('Tutti');
  const [filterMonth, setFilterMonth] = useState<string>('Tutti');

  // --- CARICAMENTO SALVATAGGIO ---
  useEffect(() => {
    const saved = localStorage.getItem('ghost_shipping_db');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveToHistory = () => {
    const totMancanze = Number(form.manc1) + Number(form.manc2) + Number(form.manc3);
    const fattArr = (form.spedArr * TARIFFA_SPED) + (form.pesoArr * TARIFFA_PESO);
    const fattPart = (form.spedPart * TARIFFA_SPED) + (form.pesoPart * TARIFFA_PESO);
    const fattTot = fattArr + fattPart + FISSO_GIORNALIERO;
    const arrReali = form.spedArr - totMancanze;
    const percManc = form.spedArr > 0 ? (totMancanze / form.spedArr) * 100 : 0;

    const dateObj = new Date(form.date);
    
    const newRecord: DailyRecord = {
      id: Date.now().toString(),
      date: form.date,
      anno: dateObj.getFullYear(),
      mese: dateObj.getMonth() + 1,
      spedArr: form.spedArr,
      colliArr: form.colliArr,
      pesoArr: form.pesoArr,
      spedPart: form.spedPart,
      colliPart: form.colliPart,
      pesoPart: form.pesoPart,
      mancanze: totMancanze,
      fatturatoArr: fattArr,
      fatturatoPart: fattPart,
      fatturatoTotale: fattTot,
      arriviReali: arrReali,
      percMancanze: percManc
    };

    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem('ghost_shipping_db', JSON.stringify(updated));
    alert("Dati Archiviati con Successo!");
  };

  const deleteRecord = (id: string) => {
    const updated = history.filter(r => r.id !== id);
    setHistory(updated);
    localStorage.setItem('ghost_shipping_db', JSON.stringify(updated));
  };

  const exportCSV = () => {
    if (history.length === 0) return alert("Nessun dato da esportare");
    const ws = XLSX.utils.json_to_sheet(history);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Storico");
    XLSX.writeFile(wb, `Report_Spedizioni_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // --- PARSING EXCEL ---
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Helper per leggere cella sicura
        const getVal = (cell: string) => {
            const v = sheet[cell]?.v;
            return v ? Number(v) : 0;
        };

        // Lettura Data (A10)
        let dateVal = new Date().toISOString().split('T')[0];
        const rawDate = sheet['A10']?.w || sheet['A10']?.v;
        if (rawDate) {
            // Tentativo parsing data semplice
            // Se Excel restituisce numero seriale, andrebbe convertito, qui assumiamo stringa o standard
             console.log("Data trovata:", rawDate);
        }

        setForm(prev => ({
            ...prev,
            date: dateVal, // Manteniamo oggi se il parsing data è complesso
            // ARRIVI
            spedArr: getVal('O10'),
            colliArr: getVal('Q10'),
            pesoArr: getVal('P10'),
            // PARTENZE
            spedPart: getVal('B10'),
            colliPart: getVal('D10'),
            pesoPart: getVal('C10'),
        }));
        
        alert("Dati estratti da Excel!");
      } catch (err) {
        console.error(err);
        alert("Errore lettura file. Assicurati che sia il formato corretto.");
      }
    };
    reader.readAsBinaryString(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] },
    multiple: false
  });

  // --- CALCOLI LIVE ---
  const totMancanze = Number(form.manc1) + Number(form.manc2) + Number(form.manc3);
  const fattArr = (form.spedArr * TARIFFA_SPED) + (form.pesoArr * TARIFFA_PESO);
  const fattPart = (form.spedPart * TARIFFA_SPED) + (form.pesoPart * TARIFFA_PESO);
  const fattTotale = fattArr + fattPart + FISSO_GIORNALIERO;
  const arriviReali = form.spedArr - totMancanze;
  const percMancanze = form.spedArr > 0 ? (totMancanze / form.spedArr) * 100 : 0;

  // KPI STATISTICI
  const kpiPesoMedioArr = form.spedArr > 0 ? form.pesoArr / form.spedArr : 0;
  const kpiSpedColloArr = form.colliArr > 0 ? form.spedArr / form.colliArr : 0;

  // --- FILTRO LISTA ---
  const filteredHistory = history.filter(r => {
      const yMatch = filterYear === 'Tutti' || r.anno.toString() === filterYear;
      const mMatch = filterMonth === 'Tutti' || r.mese.toString() === filterMonth;
      return yMatch && mMatch;
  });

  // --- HELPERS UI ---
  const CardValue = ({ label, val, sub, color="text-white" }: any) => (
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">{label}</div>
          <div className={`text-2xl font-black ${color}`}>{val}</div>
          {sub && <div className="text-xs text-zinc-400 mt-1">{sub}</div>}
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans p-4 lg:p-8">
      
      {/* HEADER */}
      <header className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition"><ArrowLeft size={20}/></Link>
            <div>
                <h1 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                    <Package className="text-emerald-500"/> Gestione Spedizioni
                </h1>
                <p className="text-xs text-zinc-500 font-mono">GHOST MODULE • LOCAL DATABASE</p>
            </div>
        </div>
        <button onClick={exportCSV} className="hidden md:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-xs font-bold uppercase hover:text-emerald-400 transition-colors">
            <Download size={16}/> Esporta DB
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNA SX: INPUT */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* DROPZONE */}
            <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${isDragActive ? 'border-emerald-500 bg-emerald-900/10' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}`}>
                <input {...getInputProps()} />
                <FileSpreadsheet className="mx-auto mb-3 text-zinc-500" size={32} />
                <p className="text-xs font-bold uppercase text-zinc-400">Trascina qui il file Excel giornaliero</p>
                <p className="text-[10px] text-zinc-600 mt-2">Supporta celle A10, O10, ecc.</p>
            </div>

            {/* FORM INPUT */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-2">Data Riferimento</label>
                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 font-mono" />
                </div>

                {/* ARRIVI */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-emerald-500 font-black text-xs uppercase tracking-widest"><Download size={14}/> Arrivi (Celle O, Q, P)</div>
                    <div className="grid grid-cols-3 gap-2">
                        <div><label className="text-[9px] text-zinc-500 font-bold block mb-1">SPED</label><input type="number" value={form.spedArr} onChange={e => setForm({...form, spedArr: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm font-bold"/></div>
                        <div><label className="text-[9px] text-zinc-500 font-bold block mb-1">COLLI</label><input type="number" value={form.colliArr} onChange={e => setForm({...form, colliArr: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm font-bold"/></div>
                        <div><label className="text-[9px] text-zinc-500 font-bold block mb-1">PESO</label><input type="number" value={form.pesoArr} onChange={e => setForm({...form, pesoArr: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm font-bold"/></div>
                    </div>
                </div>

                {/* PARTENZE */}
                <div>
                    <div className="flex items-center gap-2 mb-3 text-blue-500 font-black text-xs uppercase tracking-widest"><Upload size={14}/> Partenze (Celle B, D, C)</div>
                    <div className="grid grid-cols-3 gap-2">
                        <div><label className="text-[9px] text-zinc-500 font-bold block mb-1">SPED</label><input type="number" value={form.spedPart} onChange={e => setForm({...form, spedPart: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm font-bold"/></div>
                        <div><label className="text-[9px] text-zinc-500 font-bold block mb-1">COLLI</label><input type="number" value={form.colliPart} onChange={e => setForm({...form, colliPart: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm font-bold"/></div>
                        <div><label className="text-[9px] text-zinc-500 font-bold block mb-1">PESO</label><input type="number" value={form.pesoPart} onChange={e => setForm({...form, pesoPart: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm font-bold"/></div>
                    </div>
                </div>

                {/* MANCANZE */}
                <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-2 mb-3 text-red-500 font-black text-xs uppercase tracking-widest"><AlertTriangle size={14}/> Mancanze</div>
                    <div className="grid grid-cols-3 gap-2">
                        <input type="number" placeholder="M1" value={form.manc1} onChange={e => setForm({...form, manc1: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm text-red-400 font-bold"/>
                        <input type="number" placeholder="M2" value={form.manc2} onChange={e => setForm({...form, manc2: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm text-red-400 font-bold"/>
                        <input type="number" placeholder="M3" value={form.manc3} onChange={e => setForm({...form, manc3: Number(e.target.value)})} className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-center text-sm text-red-400 font-bold"/>
                    </div>
                </div>

                <button onClick={saveToHistory} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all">
                    <Save size={18}/> Archivia Dati
                </button>

            </div>
        </div>

        {/* COLONNA DX: DASHBOARD */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CardValue label="Fatturato Arrivi" val={`€ ${fattArr.toFixed(2)}`} sub="Variabile" color="text-emerald-400" />
                <CardValue label="Fatturato Partenze" val={`€ ${fattPart.toFixed(2)}`} sub="Variabile" color="text-blue-400" />
                <CardValue label="Fatturato Totale" val={`€ ${fattTotale.toFixed(2)}`} sub={`Incl. Fisso € ${FISSO_GIORNALIERO}`} color="text-white" />
                <CardValue label="Arrivi Netti" val={arriviReali} sub={`Mancanze: ${totMancanze}`} color={arriviReali > 0 ? "text-white" : "text-red-500"} />
            </div>

            {/* DETTAGLI KPI */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 flex gap-2"><TrendingUp size={14}/> Indicatori di Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-800 rounded-full text-zinc-400"><Scale size={20}/></div>
                        <div>
                            <div className="text-xl font-bold text-white">{kpiPesoMedioArr.toFixed(2)} Kg</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">Peso Medio / Sped</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-800 rounded-full text-zinc-400"><Package size={20}/></div>
                        <div>
                            <div className="text-xl font-bold text-white">{kpiSpedColloArr.toFixed(2)}</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">Rapporto Sped / Collo</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-900/20 rounded-full text-red-500"><AlertTriangle size={20}/></div>
                        <div>
                            <div className="text-xl font-bold text-red-400">{percMancanze.toFixed(2)}%</div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold">Incidenza Mancanze</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABELLA STORICO */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex gap-2"><Calendar size={14}/> Archivio Storico</h3>
                    <div className="flex gap-2">
                        <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-zinc-300 rounded-lg px-2 py-1 outline-none">
                            <option value="Tutti">Anno: Tutti</option>
                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-zinc-300 rounded-lg px-2 py-1 outline-none">
                            <option value="Tutti">Mese: Tutti</option>
                            {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-zinc-400">
                        <thead className="bg-zinc-900 text-zinc-500 font-bold uppercase text-[10px]">
                            <tr>
                                <th className="p-4">Data</th>
                                <th className="p-4">Arrivi (Reali)</th>
                                <th className="p-4">Partenze</th>
                                <th className="p-4">Mancanze</th>
                                <th className="p-4 text-right">Fatturato Tot</th>
                                <th className="p-4 text-center">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredHistory.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-zinc-600">Nessun dato in archivio.</td></tr>
                            ) : (
                                filteredHistory.map((row) => (
                                    <tr key={row.id} className="hover:bg-zinc-900/50 transition-colors">
                                        <td className="p-4 font-mono text-white">{row.date}</td>
                                        <td className="p-4">{row.arriviReali} <span className="text-[10px] text-zinc-600">({row.spedArr})</span></td>
                                        <td className="p-4">{row.spedPart}</td>
                                        <td className="p-4 text-red-400 font-bold">{row.mancanze}</td>
                                        <td className="p-4 text-right font-mono text-emerald-400">€ {row.fatturatoTotale.toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => deleteRecord(row.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}