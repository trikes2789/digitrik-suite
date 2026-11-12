"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, List, PlusCircle, ArrowLeft, Trash2, Users, Package, Settings, ChevronRight, Clock, Share2, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Wave {
  id: string;
  client: string;
  cases: number;
  loose: number;
  plt: number;
}

// Struttura di default per i parametri
const defaultRates = {
  ALFASIGMA: { cases: 35, loose: 35, plt: 25 },
  'PIERRE FABRE': { cases: 53, loose: 53, plt: 25 },
  'BAUSCH&LOMB': { cases: 53, loose: 53, plt: 25 }
};

export default function MobileResourcePlanner() {
  const [activeTab, setActiveTab] = useState<string>('entry');
  
  const [waves, setWaves] = useState<Wave[]>([]);
  
  // Stati per il calcolo
  const [calcMode, setCalcMode] = useState<'personnel' | 'time'>('personnel');
  const [targetHours, setTargetHours] = useState<number>(8);
  const [availablePickers, setAvailablePickers] = useState<number>(2);
  const [availableForklifts, setAvailableForklifts] = useState<number>(1);
  const [shiftLength, setShiftLength] = useState<number>(8);

  // Inizializza i parametri dal localStorage
  const [rates, setRates] = useState(defaultRates);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedRates = localStorage.getItem('resourcePlannerRates');
    if (savedRates) {
      try {
        setRates(JSON.parse(savedRates));
      } catch (e) {
        console.error("Errore nel parsing dei rates salvati:", e);
      }
    }
  }, []);

  const [waveId, setWaveId] = useState<string>('');
  const [client, setClient] = useState<string>('ALFASIGMA');
  const [cases, setCases] = useState<string>('');
  const [loose, setLoose] = useState<string>('');
  const [plt, setPlt] = useState<string>('');

  const clients: string[] = ['ALFASIGMA', 'PIERRE FABRE', 'BAUSCH&LOMB'];

  const handleRateChange = (clientName: string, type: 'cases' | 'loose' | 'plt', value: string) => {
    const newRates = {
      ...rates,
      [clientName]: {
        ...rates[clientName as keyof typeof rates],
        [type]: Number(value) || 1
      }
    };
    setRates(newRates);
    localStorage.setItem('resourcePlannerRates', JSON.stringify(newRates));
  };

  const handleAddWave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!waveId || waveId.length !== 6) {
      alert("L'ID Wave deve essere di 6 cifre.");
      return;
    }

    const newWave: Wave = {
      id: waveId,
      client,
      cases: Number(cases) || 0,
      loose: Number(loose) || 0,
      plt: Number(plt) || 0,
    };

    setWaves([...waves, newWave]);
    
    setWaveId('');
    setCases('');
    setLoose('');
    setPlt('');
    
    setActiveTab('list');
  };

  const deleteWave = (idToDelete: string) => {
    setWaves(waves.filter(w => w.id !== idToDelete));
  };

  // Motore di Calcolo Unificato
  const calculations = useMemo(() => {
    let pickerHours = 0;
    let forkliftHours = 0;

    waves.forEach(w => {
      const clientRates = rates[w.client as keyof typeof rates];
      
      pickerHours += (w.cases / clientRates.cases);
      pickerHours += (w.loose / clientRates.loose);
      forkliftHours += (w.plt / clientRates.plt);
    });

    return {
      pickerHours,
      forkliftHours,
      pickersNeeded: Math.ceil(pickerHours / targetHours),
      forkliftsNeeded: Math.ceil(forkliftHours / targetHours),
      timePickers: pickerHours / (availablePickers || 1),
      timeForklifts: forkliftHours / (availableForklifts || 1),
    };
  }, [waves, targetHours, availablePickers, availableForklifts, rates]);

  // Formattazione colloquiale per interfaccia Mobile
  const formatShiftTextUI = (totalHours: number, shift: number) => {
    if (totalHours <= shift) return `Entro 1 Turno`;
    const fullShifts = Math.floor(totalHours / shift);
    const remainder = (totalHours % shift).toFixed(1);
    if (parseFloat(remainder) === 0) return `${fullShifts} Turni Esatti`;
    return `${fullShifts} Turni + ${remainder}h`;
  };

  // Formattazione formale e discorsiva per il PDF
  const formatShiftTextPDF = (totalHours: number, shift: number) => {
    if (totalHours <= shift) {
      return `${totalHours.toFixed(1)} ore totali (Il lavoro si chiude tranquillamente entro 1 turno).`;
    }
    const fullShifts = Math.floor(totalHours / shift);
    const remainder = (totalHours % shift).toFixed(1);
    if (parseFloat(remainder) === 0) {
      return `${totalHours.toFixed(1)} ore totali (Il lavoro richiede esattamente ${fullShifts} turni completi).`;
    }
    return `${totalHours.toFixed(1)} ore totali (Il lavoro richiede ${fullShifts} turni completi, più altre ${remainder} ore).`;
  };

  // Generazione e Condivisione PDF
  const handleSharePDF = async () => {
    setIsGeneratingPdf(true);
    
    try {
      const doc = new jsPDF();
      const dateStr = new Date().toLocaleDateString('it-IT');
      const timeStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      // HEADER
      doc.setFontSize(18);
      doc.setTextColor(30, 41, 59);
      doc.text("Report Pianificazione Risorse", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generato il: ${dateStr} alle ${timeStr}`, 14, 28);
      doc.text(`Totale Wave incluse nel calcolo: ${waves.length}`, 14, 34);

      // SEZIONE 1: ESITO CALCOLO
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("1. Esito Calcolo e Fabbisogno", 14, 48);

      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      
      if (calcMode === 'personnel') {
        doc.text(`Obiettivo: Terminare il lavoro tassativamente entro ${targetHours} ore.`, 14, 56);
        doc.text(`• Reparto Picker: Saranno necessari ${calculations.pickersNeeded} operatori sul floor.`, 14, 64);
        doc.text(`• Reparto Muletti: Saranno necessari ${calculations.forkliftsNeeded} mulettisti operativi.`, 14, 70);
      } else {
        doc.text(`Obiettivo: Stimare i tempi avendo in turno ${availablePickers} Picker e ${availableForklifts} Muletti (Turni da ${shiftLength}h).`, 14, 56);
        
        const textPickers = formatShiftTextPDF(calculations.timePickers, shiftLength);
        const textForklifts = formatShiftTextPDF(calculations.timeForklifts, shiftLength);
        
        doc.text(`• Tempistiche Picker: ${textPickers}`, 14, 64);
        doc.text(`• Tempistiche Muletti: ${textForklifts}`, 14, 70);
      }

      // SEZIONE 2: PARAMETRI DI PRODUTTIVITÀ (Nuova Tabella)
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("2. Parametri di Produttività Utilizzati", 14, 88);

      const productivityData = clients.map(c => [
        c, 
        `${rates[c as keyof typeof rates].cases} colli/h`, 
        `${rates[c as keyof typeof rates].loose} colli/h`, 
        `${rates[c as keyof typeof rates].plt} plt/h`
      ]);

      autoTable(doc, {
        startY: 92,
        head: [['Cliente', 'Resa CASE', 'Resa LOOSE', 'Resa BANCALI']],
        body: productivityData,
        theme: 'grid',
        headStyles: { fillColor: [71, 85, 105] }, // Grigio elegante
        styles: { fontSize: 9 }
      });

      // SEZIONE 3: DETTAGLIO WAVE
      // Ottengo la posizione Y esatta in cui è finita la tabella precedente per evitare sovrapposizioni
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text("3. Elenco Dettagliato delle Wave", 14, finalY);

      const tableData = waves.map(w => [w.id, w.client, w.cases.toString(), w.loose.toString(), w.plt.toString()]);
      
      autoTable(doc, {
        startY: finalY + 4,
        head: [['ID Wave', 'Cliente', 'Case', 'Loose', 'Bancali']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [6, 182, 212] }, // Ciano Tema Ghost
        styles: { fontSize: 9 }
      });

      // SALVATAGGIO / CONDIVISIONE NATIVA
      const pdfBlob = doc.output('blob');
      const fileName = `Report_Risorse_${new Date().getTime()}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Report Pianificazione Risorse',
          text: 'In allegato il riepilogo operativo e il calcolo del personale.',
        });
      } else {
        doc.save(fileName);
      }
    } catch (error) {
      console.error("Errore durante l'esportazione del PDF:", error);
      alert("Si è verificato un errore durante la generazione del PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#09090b] flex justify-center text-zinc-200 font-sans">
      
      <div className="w-full max-w-md bg-zinc-950 border-x border-zinc-900 shadow-2xl flex flex-col relative min-h-screen">
        
        {/* Header Tema Ghost */}
        <div className="bg-zinc-900 border-b border-zinc-800 text-white p-4 flex items-center justify-between z-10 relative shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-all text-zinc-400 hover:text-white">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
               Risorse
            </h1>
          </div>
          <div className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            {waves.length} Wave
          </div>
        </div>

        {/* Area Contenuti */}
        <div className="flex-1 overflow-y-auto p-5 pb-28">
          
          {/* TAB 1: INSERIMENTO */}
          {activeTab === 'entry' && (
            <form onSubmit={handleAddWave} className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">ID Wave (6 cifre)</label>
                <input 
                  type="number" 
                  value={waveId}
                  onChange={(e) => setWaveId(e.target.value.slice(0, 6))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-lg focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-zinc-700"
                  placeholder="Es. 123456"
                />
              </div>

              <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Seleziona Cliente</label>
                <div className="grid grid-cols-1 gap-2">
                  {clients.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setClient(c)}
                      className={`p-3 rounded-xl border text-sm font-bold transition-all ${
                        client === c 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                          : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Volumi di Carico</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1 text-center">CASE</label>
                    <input type="number" value={cases} onChange={(e) => setCases(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-white text-center focus:outline-none focus:border-cyan-500/50" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1 text-center">LOOSE</label>
                    <input type="number" value={loose} onChange={(e) => setLoose(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-white text-center focus:outline-none focus:border-cyan-500/50" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-600 mb-1 text-center text-orange-500/70">BANCALI</label>
                    <input type="number" value={plt} onChange={(e) => setPlt(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-white text-center focus:outline-none focus:border-orange-500/50" placeholder="0" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] mt-4 uppercase tracking-wide text-sm">
                Aggiungi Wave
              </button>
            </form>
          )}

          {/* TAB 2: LISTA WAVE */}
          {activeTab === 'list' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white mb-4 px-1">Wave Inserite</h2>
              {waves.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center">
                  <p className="text-zinc-600 font-medium">Nessuna wave inserita.</p>
                </div>
              ) : (
                waves.map((w, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex justify-between items-center group hover:border-zinc-700 transition-colors">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono font-bold text-lg text-white">{w.id}</span>
                        <span className="text-[9px] bg-zinc-800 px-2 py-1 rounded-md uppercase font-bold text-zinc-400 border border-zinc-700">{w.client}</span>
                      </div>
                      <div className="text-xs font-medium text-zinc-500 flex gap-4 bg-zinc-950 p-2 rounded-xl border border-zinc-800">
                        <span><span className="text-zinc-600">C:</span> {w.cases}</span>
                        <span><span className="text-zinc-600">L:</span> {w.loose}</span>
                        <span className="text-orange-400/80"><span className="text-orange-500/40">PLT:</span> {w.plt}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteWave(w.id)} className="text-red-500/50 hover:text-red-500 p-3 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-red-900/30 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: DASHBOARD RISORSE (CON CALCOLO E PDF) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="flex bg-zinc-900 rounded-2xl p-1 border border-zinc-800 mb-6 relative">
                 <button onClick={() => setCalcMode('personnel')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all z-10 ${calcMode === 'personnel' ? 'text-white shadow-md' : 'text-zinc-500'}`}>Trova Personale</button>
                 <button onClick={() => setCalcMode('time')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all z-10 flex items-center justify-center gap-2 ${calcMode === 'time' ? 'text-white shadow-md' : 'text-zinc-500'}`}>
                   <Clock size={14} className={calcMode === 'time' ? 'text-cyan-500' : ''} /> Trova Tempi
                 </button>
                 <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 rounded-xl transition-transform duration-300 ${calcMode === 'personnel' ? 'translate-x-0' : 'translate-x-[calc(100%+4px)]'}`} />
              </div>

              {calcMode === 'personnel' ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex justify-between items-end">
                      Target Lavorazione <span className="text-cyan-400 text-lg">{targetHours} Ore</span>
                    </label>
                    <input type="range" min="1" max="12" value={targetHours} onChange={(e) => setTargetHours(parseInt(e.target.value))} className="w-full accent-cyan-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-[10px] font-bold text-zinc-600 mt-3 uppercase tracking-wider"><span>1h</span><span>12h</span></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyan-500/5 border border-cyan-500/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-cyan-500/10"><Users size={80} /></div>
                      <span className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest mb-2 relative z-10">Servono</span>
                      <span className="text-6xl font-black text-cyan-400 mb-2 relative z-10">{calculations.pickersNeeded}</span>
                      <span className="text-[10px] text-cyan-500/60 font-bold uppercase relative z-10">Picker ({calculations.pickerHours.toFixed(1)}h nette)</span>
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute -right-4 -top-4 text-orange-500/10"><Package size={80} /></div>
                      <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest mb-2 relative z-10">Servono</span>
                      <span className="text-6xl font-black text-orange-400 mb-2 relative z-10">{calculations.forkliftsNeeded}</span>
                      <span className="text-[10px] text-orange-500/60 font-bold uppercase relative z-10">Muletti ({calculations.forkliftHours.toFixed(1)}h nette)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Risorse In Turno</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center">
                          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2">N. Picker</span>
                          <input type="number" min="1" value={availablePickers} onChange={(e) => setAvailablePickers(Number(e.target.value) || 1)} className="w-16 bg-zinc-900 border border-cyan-500/30 rounded-xl p-2 text-white text-center font-bold text-xl outline-none focus:border-cyan-500" />
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center">
                          <span className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mb-2">N. Muletti</span>
                          <input type="number" min="1" value={availableForklifts} onChange={(e) => setAvailableForklifts(Number(e.target.value) || 1)} className="w-16 bg-zinc-900 border border-orange-500/30 rounded-xl p-2 text-white text-center font-bold text-xl outline-none focus:border-orange-500" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/50">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex justify-between items-end">
                        Lunghezza Turno <span className="text-zinc-300 text-lg">{shiftLength} Ore</span>
                      </label>
                      <input type="range" min="1" max="12" value={shiftLength} onChange={(e) => setShiftLength(parseInt(e.target.value))} className="w-full accent-zinc-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                      <div className="flex justify-between text-[10px] font-bold text-zinc-600 mt-3 uppercase tracking-wider"><span>1h</span><span>12h</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <span className="text-[10px] text-cyan-500 uppercase font-bold tracking-widest mb-2 relative z-10">Tempo Stimato</span>
                      <span className="text-4xl font-black text-cyan-400 mb-2 relative z-10">{calculations.timePickers.toFixed(1)}<span className="text-2xl">h</span></span>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-lg uppercase font-bold relative z-10">
                        {formatShiftTextUI(calculations.timePickers, shiftLength)}
                      </span>
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <span className="text-[10px] text-orange-500 uppercase font-bold tracking-widest mb-2 relative z-10">Tempo Stimato</span>
                      <span className="text-4xl font-black text-orange-400 mb-2 relative z-10">{calculations.timeForklifts.toFixed(1)}<span className="text-2xl">h</span></span>
                      <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-lg uppercase font-bold relative z-10">
                        {formatShiftTextUI(calculations.timeForklifts, shiftLength)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handleSharePDF}
                disabled={waves.length === 0 || isGeneratingPdf}
                className="w-full mt-8 bg-zinc-100 hover:bg-white text-zinc-900 font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <span className="animate-pulse">Generazione in corso...</span>
                ) : (
                  <>
                    {typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' ? <Share2 size={20} /> : <Download size={20} />}
                    Esporta Report PDF
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 4: IMPOSTAZIONI AVANZATE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-bold text-white mb-2 px-1">Produttività Clienti</h2>
              <p className="text-xs text-zinc-500 px-1 mb-6">Regola la resa oraria (Colli/Ora e PLT/Ora) per cliente e per singola tipologia di merce. Le modifiche si salvano automaticamente.</p>
              {clients.map(clientName => (
                <div key={clientName} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-3 mb-4">
                  <h3 className="text-sm font-bold text-zinc-300 uppercase flex items-center gap-2 mb-3">
                    <ChevronRight size={16} className="text-cyan-500" /> {clientName}
                  </h3>
                  
                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50">
                    <span className="text-xs font-bold text-zinc-400">CASE / Ora</span>
                    <input type="number" value={rates[clientName as keyof typeof rates].cases} onChange={(e) => handleRateChange(clientName, 'cases', e.target.value)} className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white text-center font-bold focus:outline-none focus:border-cyan-500/50 text-sm" />
                  </div>
                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50">
                    <span className="text-xs font-bold text-zinc-400">LOOSE / Ora</span>
                    <input type="number" value={rates[clientName as keyof typeof rates].loose} onChange={(e) => handleRateChange(clientName, 'loose', e.target.value)} className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white text-center font-bold focus:outline-none focus:border-cyan-500/50 text-sm" />
                  </div>
                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50">
                    <span className="text-xs font-bold text-orange-400/80">PLT / Ora</span>
                    <input type="number" value={rates[clientName as keyof typeof rates].plt} onChange={(e) => handleRateChange(clientName, 'plt', e.target.value)} className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white text-center font-bold focus:outline-none focus:border-orange-500/50 text-sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation Tema Ghost */}
        <div className="absolute bottom-0 w-full bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 flex justify-between px-2 py-3 pb-6 z-20">
          <button onClick={() => setActiveTab('entry')} className={`flex flex-col items-center p-2 w-1/4 rounded-xl transition-colors ${activeTab === 'entry' ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <PlusCircle size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Nuova</span>
          </button>
          <button onClick={() => setActiveTab('list')} className={`flex flex-col items-center p-2 w-1/4 rounded-xl transition-colors ${activeTab === 'list' ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <List size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Lista</span>
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center p-2 w-1/4 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Calculator size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Calcolo</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center p-2 w-1/4 rounded-xl transition-colors ${activeTab === 'settings' ? 'text-cyan-400 bg-cyan-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Settings size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Setup</span>
          </button>
        </div>

      </div>
    </div>
  );
}