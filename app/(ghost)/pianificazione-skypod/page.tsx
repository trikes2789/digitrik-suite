"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  List, ArrowLeft, Users, Settings, Clock, AlertCircle, TrendingUp, ChevronDown, ChevronUp, CheckCircle2, Box, Settings2, FileDown,
  Activity, Wrench
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TimeSlot {
  hour: number;
  operators: number;
  hasBreak: boolean;
  hasLunch: boolean;
  isMaintenance: boolean;
}

type Strategy = 'bilanciato' | 'crescente' | 'decrescente' | 'campana' | 'estremi';

export default function SkypodPlannerMobile() {
  const [activeTab, setActiveTab] = useState<'planner' | 'stats' | 'settings'>('planner');
  const [isClient, setIsClient] = useState(false);

  // PARAMETRI BASE
  const [kpi, setKpi] = useState<number>(100);
  const [breakMins, setBreakMins] = useState<number>(15);
  const [lunchMins, setLunchMins] = useState<number>(60);
  const [startHour, setStartHour] = useState<number>(7);
  const [endHour, setEndHour] = useState<number>(17);

  // TIMELINE E WIZARD
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showWizard, setShowWizard] = useState<boolean>(true);
  const [showMaintenance, setShowMaintenance] = useState<boolean>(false);
  const [targetLinesAuto, setTargetLinesAuto] = useState<number>(5500);
  const [maxOperatorsAuto, setMaxOperatorsAuto] = useState<number>(8);
  const [strategyAuto, setStrategyAuto] = useState<Strategy>('bilanciato');
  
  // STATO MANUTENZIONE
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(false);
  const [maintenanceStart, setMaintenanceStart] = useState<number>(14);
  const [maintenanceEnd, setMaintenanceEnd] = useState<number>(15);

  useEffect(() => {
    setIsClient(true);
    setSlots(prev => {
      const newSlots: TimeSlot[] = [];
      for (let h = startHour; h < endHour; h++) {
        const existing = prev.find(s => s.hour === h);
        newSlots.push(existing ? existing : { hour: h, operators: 0, hasBreak: false, hasLunch: false, isMaintenance: false });
      }
      return newSlots;
    });
  }, [startHour, endHour]);

  const adjustOperators = (hour: number, delta: number) => {
    setSlots(prev => prev.map(slot => {
      if (slot.hour === hour) {
        const newVal = slot.operators + delta;
        return { ...slot, operators: newVal >= 0 ? newVal : 0 };
      }
      return slot;
    }));
  };

  const evaluateLines = (tempSlots: TimeSlot[]) => {
    const o12 = tempSlots.find(s => s.hour === 12 && !s.isMaintenance)?.operators || 0;
    const g1 = Math.ceil(o12 / 3);
    const g2 = Math.ceil((o12 - g1) / 2);
    const g3 = Math.max(0, o12 - g1 - g2);
    let totalLines = 0;
    
    tempSlots.forEach((s, idx) => {
      if (s.isMaintenance) return; 

      let lunchLost = 0;
      if(s.hour === 12) lunchLost = (g1 * lunchMins) + (g2 * (lunchMins / 2));
      if(s.hour === 13) lunchLost = (g2 * (lunchMins / 2)) + (g3 * lunchMins);
      lunchLost = Math.min(lunchLost, s.operators * 60);

      const workingMins = (s.operators * 60) - lunchLost;
      let coffeeLost = 0;
      if (idx >= 2) coffeeLost = (workingMins / 60) * (breakMins / 3); // Modificato calcolo per 3 alla volta
      
      let effectiveMins = workingMins - coffeeLost;
      if (effectiveMins < 0) effectiveMins = 0;

      totalLines += (effectiveMins / 60) * kpi;
    });

    return totalLines;
  };

  const handleAutoGenerate = () => {
    let newSlots = slots.map(s => ({ 
      ...s, 
      operators: 0,
      isMaintenance: isMaintenanceActive && (s.hour >= maintenanceStart && s.hour < maintenanceEnd) 
    }));
    
    const n = newSlots.length;
    let weights = [];
    for(let i = 0; i < n; i++) {
        let w = 1;
        if (strategyAuto === 'bilanciato') w = 1;
        else if (strategyAuto === 'crescente') w = (i + 1) / n;
        else if (strategyAuto === 'decrescente') w = (n - i) / n;
        else if (strategyAuto === 'campana') {
            const mid = (n - 1) / 2;
            w = 1 - (Math.abs(i - mid) / mid);
        }
        else if (strategyAuto === 'estremi') {
            const mid = (n - 1) / 2;
            w = (Math.abs(i - mid) / mid);
        }
        weights.push(Math.max(w, 0.1)); 
    }

    let currentLines = 0;
    let safety = 0;
    
    while(currentLines < targetLinesAuto && safety < 2000) {
        safety++;
        let bestSlotIdx = -1;
        let bestScore = -1;
        
        for(let i = 0; i < n; i++) {
            if (newSlots[i].isMaintenance) continue;

            if (newSlots[i].operators < maxOperatorsAuto) {
                let score = weights[i] / (newSlots[i].operators + 1);
                if (newSlots[i].hour === 12 || newSlots[i].hour === 13) score = score * 0.8; 
                if (score > bestScore) {
                    bestScore = score;
                    bestSlotIdx = i;
                }
            }
        }
        if (bestSlotIdx === -1) break; 
        
        newSlots[bestSlotIdx].operators += 1;
        currentLines = evaluateLines(newSlots);
    }
    
    setSlots(newSlots);
    setShowWizard(false); 
    setShowMaintenance(false);
  };

  const calculations = useMemo(() => {
    let totalLines = 0;
    let totalOperatorsSum = 0;
    let activeSlotsCount = 0;
    let totalLostMins = 0;

    const o12 = slots.find(s => s.hour === 12 && !s.isMaintenance)?.operators || 0;
    const g1 = Math.ceil(o12 / 3);
    const g2 = Math.ceil((o12 - g1) / 2);
    const g3 = Math.max(0, o12 - g1 - g2);

    const slotsData = slots.map((slot, idx) => {
      const currentIsMaintenance = isMaintenanceActive && (slot.hour >= maintenanceStart && slot.hour < maintenanceEnd);
      
      if (currentIsMaintenance) {
        return {
          ...slot, isMaintenance: true, expectedLines: 0, effectiveMins: 0, lunchLost: 0, coffeeLost: 0, g1: 0, g2: 0, g3: 0, isFirstTwoHours: false
        };
      }

      let lunchLost = 0;
      if (slot.hour === 12) lunchLost = (g1 * lunchMins) + (g2 * (lunchMins / 2));
      if (slot.hour === 13) lunchLost = (g2 * (lunchMins / 2)) + (g3 * lunchMins);
      lunchLost = Math.min(lunchLost, slot.operators * 60);

      const workingMins = (slot.operators * 60) - lunchLost;
      let coffeeLost = 0;
      if (idx >= 2) coffeeLost = (workingMins / 60) * (breakMins / 3); // Regola: 3 alla volta
      
      let effectiveMins = workingMins - coffeeLost;
      if (effectiveMins < 0) effectiveMins = 0;

      const expectedLines = Math.floor((effectiveMins / 60) * kpi);

      totalLines += expectedLines;
      if (slot.operators > 0) {
        totalOperatorsSum += slot.operators;
        activeSlotsCount++;
        totalLostMins += (lunchLost + coffeeLost);
      }

      return { 
        ...slot, isMaintenance: false, expectedLines, effectiveMins, lunchLost, coffeeLost, g1, g2, g3,
        isFirstTwoHours: idx < 2
      };
    });

    const maxOps = slots.length > 0 ? Math.max(...slots.map(s => s.operators)) : 0;
    
    // RISOLUZIONE DEL PARADOSSO
    // idleOperators si calcola SOLO se il target totale è stato raggiunto
    const isTargetReached = totalLines >= targetLinesAuto;
    const idleOperators = isTargetReached ? (maxOperatorsAuto - maxOps) : 0;
    const isInsufficient = !isTargetReached && (maxOps >= maxOperatorsAuto);

    // --- CALCOLO SURPLUS ---
    let surplusEstimatedEnd = "";
    if (idleOperators > 0 && totalLines < targetLinesAuto * 1.5) { 
      let simulatedLines = 0;
      let foundEnd = false;
      
      for (let i = 0; i < slotsData.length; i++) {
        const slot = slotsData[i];
        if (slot.isMaintenance) continue;
        
        const simOps = Math.min(slot.operators + idleOperators, maxOperatorsAuto);
        
        let lLost = 0;
        if (slot.hour === 12 || slot.hour === 13) {
           const sg1 = Math.ceil(simOps / 3);
           const sg2 = Math.ceil((simOps - sg1) / 2);
           const sg3 = Math.max(0, simOps - sg1 - sg2);
           if (slot.hour === 12) lLost = (sg1 * lunchMins) + (sg2 * (lunchMins / 2));
           if (slot.hour === 13) lLost = (sg2 * (lunchMins / 2)) + (sg3 * lunchMins);
        }
        lLost = Math.min(lLost, simOps * 60);

        const wMins = (simOps * 60) - lLost;
        let cLost = 0;
        if (i >= 2) cLost = (wMins / 60) * (breakMins / 3);
        
        let eMins = wMins - cLost;
        if (eMins < 0) eMins = 0;
        
        const slotProd = (eMins / 60) * kpi;
        
        if (simulatedLines + slotProd >= targetLinesAuto) {
           const linesNeeded = targetLinesAuto - simulatedLines;
           const fractionOfHour = linesNeeded / slotProd;
           const minutesNeeded = Math.round(fractionOfHour * 60);
           
           const endH = slot.hour;
           const endM = minutesNeeded;
           
           surplusEstimatedEnd = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')} (Fascia: ${endH}:00-${endH+1}:00)`;
           foundEnd = true;
           break;
        } else {
           simulatedLines += slotProd;
        }
      }
      
      if (!foundEnd) {
         surplusEstimatedEnd = "Oltre Fine Turno";
      }
    }

    return {
      slotsData,
      totalLines: Math.floor(totalLines),
      avgOperators: activeSlotsCount > 0 ? (totalOperatorsSum / activeSlotsCount).toFixed(1) : '0',
      totalLostHours: (totalLostMins / 60).toFixed(1),
      maxOps,
      isInsufficient,
      idleOperators: idleOperators > 0 ? idleOperators : 0,
      surplusEstimatedEnd
    };
  }, [slots, kpi, breakMins, lunchMins, maxOperatorsAuto, targetLinesAuto, isMaintenanceActive, maintenanceStart, maintenanceEnd]);

  const addMinutesToTime = (timeStr: string, minsToAdd: number) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + minsToAdd, 0, 0);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const generateAndSharePDF = async () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const dataOdierna = new Date().toLocaleDateString('it-IT');
    const timeStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); 
    doc.text("Pianificazione Skypod Inbound", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    let operatorStatusText = "";
    if (calculations.isInsufficient) {
      operatorStatusText = "ATTENZIONE: L'allocazione non copre il target richiesto.";
    } else {
      operatorStatusText = "Il lavoro stimato copre il target richiesto.";
    }

    doc.text(`Data: ${dataOdierna} ${timeStr} | Target Stimato: ${calculations.totalLines} Righe | Resa: ${kpi} righe/h | Max Operatori Impianto: ${calculations.maxOps}`, 14, 28);
    doc.text(`Esito Pianificazione: ${operatorStatusText}`, 14, 34);

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("1. Riepilogo Fabbisogno Orario", 14, 46);

    const timelineData = calculations.slotsData.map(s => {
      if (s.isMaintenance) {
        return [
          `${s.hour.toString().padStart(2, '0')}:00 - ${(s.hour + 1).toString().padStart(2, '0')}:00`,
          "MANUTENZIONE",
          "0",
          "-",
          "-"
        ];
      }
      return [
        `${s.hour.toString().padStart(2, '0')}:00 - ${(s.hour + 1).toString().padStart(2, '0')}:00`,
        s.operators.toString(),
        s.expectedLines.toString(),
        s.isFirstTwoHours ? "Nessuna" : `${((s.coffeeLost) / 60).toFixed(1)} Ore perse (Caffè)`,
        (s.hour === 12 || s.hour === 13) ? `${Math.round(s.lunchLost / 60)} Ore perse (Pranzo)` : "-"
      ];
    });

    autoTable(doc, {
      startY: 50,
      head: [['Fascia Oraria', 'Operatori in Postazione', 'Righe Stimate', 'Impatto Pause Caffè', 'Impatto Pausa Pranzo']],
      body: timelineData,
      theme: 'grid',
      headStyles: { fillColor: [24, 24, 27], textColor: [16, 185, 129] },
      styles: { fontSize: 9, halign: 'center' },
    });

    let finalYTimeline = (doc as any).lastAutoTable.finalY + 15;

    if (finalYTimeline > 150) {
      doc.addPage();
      finalYTimeline = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("2. Tabella di Marcia Operatori (Rotazione Max 3)", 14, finalYTimeline);

    const operatorData = [];
    const maxOpe = calculations.maxOps;

    for(let i = 1; i <= maxOpe; i++) {
      // Modificato per raggruppare le pause caffè a gruppi di 3 (Rotazione Max 3)
      const coffeeGroupIndex = Math.floor((i - 1) / 3);
      const offsetCaffe = coffeeGroupIndex * breakMins; 
      const offsetPranzo = Math.floor((i - 1) / Math.ceil(maxOpe / 3)) * 30; 

      const p1Inizio = addMinutesToTime("10:00", offsetCaffe);
      const p1Fine = addMinutesToTime(p1Inizio, breakMins);
      
      const pranzoInizio = addMinutesToTime("12:00", offsetPranzo);
      const pranzoFine = addMinutesToTime(pranzoInizio, lunchMins);
      
      const p2Inizio = addMinutesToTime("14:00", offsetCaffe);
      const p2Fine = addMinutesToTime(p2Inizio, breakMins);
      
      const p3Inizio = addMinutesToTime("16:00", offsetCaffe);
      const p3Fine = addMinutesToTime(p3Inizio, breakMins);

      const fineTurnoFormattata = `${endHour.toString().padStart(2,'0')}:00`;

      operatorData.push([
        `Operatore ${i}`,
        `${p1Inizio} - ${p1Fine}`,
        `${pranzoInizio} - ${pranzoFine}`,
        `${p2Inizio} - ${p2Fine}`,
        `${p3Inizio} - ${p3Fine}`,
        `${fineTurnoFormattata}`
      ]);
    }

    autoTable(doc, {
      startY: finalYTimeline + 4,
      head: [['Risorsa', `1a Pausa (${breakMins}m)`, `Pranzo (${lunchMins}m)`, `2a Pausa (${breakMins}m)`, `3a Pausa (${breakMins}m)`, 'Fine Turno']],
      body: operatorData,
      theme: 'grid',
      headStyles: { fillColor: [9, 9, 11] },
      styles: { fontSize: 10, halign: 'center', cellPadding: 4 },
    });

    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], `Pianificazione_Skypod_${dataOdierna.replace(/\//g, '-')}.pdf`, { type: 'application/pdf' });

    if (typeof navigator !== 'undefined' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Pianificazione Skypod',
          text: `Ecco la pianificazione Skypod Inbound del ${dataOdierna}.`,
          files: [file]
        });
      } catch (err) {
        console.log("Condivisione annullata o fallita", err);
      }
    } else {
      doc.save(`Pianificazione_Skypod_${dataOdierna.replace(/\//g, '-')}.pdf`);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#09090b] flex justify-center text-zinc-200 font-sans">
      
      <div className="w-full max-w-md bg-zinc-950 border-x border-zinc-900 shadow-2xl flex flex-col relative min-h-screen">
        
        {/* HEADER */}
        <div className="bg-zinc-900 border-b border-zinc-800 text-white p-4 flex items-center justify-between z-10 relative shadow-md">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-all text-zinc-400 hover:text-white">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-lg font-bold uppercase tracking-tight text-white flex items-center gap-2">
               Skypod Inbound
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400">
            <TrendingUp size={14} />
            <span className="text-xs font-bold tracking-wider">{calculations.totalLines} Righe</span>
          </div>
        </div>

        {/* AREA CONTENUTI */}
        <div className="flex-1 overflow-y-auto p-4 pb-28 space-y-6">
          
          {/* TAB 1: PLANNER (TIMELINE) */}
          {activeTab === 'planner' && (
            <div className="animate-in fade-in duration-300">
              
              {/* PANNELLO WIZARD E SETUP GENERATORE */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl mb-4 overflow-hidden transition-all">
                <div 
                  className="bg-zinc-800/50 p-4 flex justify-between items-center cursor-pointer hover:bg-zinc-800"
                  onClick={() => setShowWizard(!showWizard)}
                >
                  <div className="flex items-center gap-2">
                    <Settings2 size={18} className="text-emerald-500" />
                    <span className="text-sm font-bold uppercase tracking-wider text-emerald-500">Auto-Generatore</span>
                  </div>
                  {showWizard ? <ChevronUp size={18} className="text-zinc-500"/> : <ChevronDown size={18} className="text-zinc-500"/>}
                </div>
                
                {showWizard && (
                  <div className="p-5 space-y-5 border-t border-zinc-800">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Target Righe</label>
                        <input 
                          type="number" 
                          value={targetLinesAuto} 
                          onChange={(e) => setTargetLinesAuto(Number(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-lg focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Max Ope. Disp.</label>
                        <input 
                          type="number" 
                          value={maxOperatorsAuto} 
                          onChange={(e) => setMaxOperatorsAuto(Number(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-lg focus:outline-none focus:border-emerald-500/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Strategia di Flusso</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'bilanciato', label: 'Equilibrato' },
                          { id: 'crescente', label: 'Crescente' },
                          { id: 'decrescente', label: 'A Decrescere' },
                          { id: 'campana', label: 'Picco Centrale' },
                          { id: 'estremi', label: 'Picchi Estremi' }
                        ].map((strat) => (
                          <button
                            key={strat.id}
                            onClick={() => setStrategyAuto(strat.id as Strategy)}
                            className={`p-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                              strategyAuto === strat.id 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                : 'bg-zinc-950 text-zinc-500 border-zinc-800'
                            } ${strat.id === 'estremi' ? 'col-span-2' : ''}`}
                          >
                            {strategyAuto === strat.id && <CheckCircle2 size={12} />}
                            {strat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleAutoGenerate}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] uppercase tracking-wide text-xs flex items-center justify-center gap-2"
                    >
                      <Settings2 size={16} /> Calcola e Distribuisci
                    </button>
                    
                    {/* ALERT ALL'INTERNO DEL SETUP GENERATORE */}
                    {calculations.isInsufficient && (
                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mt-4 flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Copertura Insufficiente</h4>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            La mole di lavoro richiesta non viene coperta. <br/>
                            Aumenta il "Max Ope. Disp."
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {calculations.idleOperators > 0 && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mt-4 flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Risorse Non Sfruttate</h4>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            L'algoritmo non necessita di tutte le persone. <strong className="text-amber-400">Avanzano {calculations.idleOperators} operatori</strong>.<br/>
                            Consiglio: riduci "Max Ope. Disp."
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PANNELLO MANUTENZIONE */}
              <div className="bg-red-950/20 border border-red-900/30 rounded-3xl mb-6 overflow-hidden transition-all">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-red-950/30"
                  onClick={() => setShowMaintenance(!showMaintenance)}
                >
                  <div className="flex items-center gap-2">
                    <Wrench size={18} className="text-red-500" />
                    <span className="text-sm font-bold uppercase tracking-wider text-red-500">Fermo Macchina</span>
                  </div>
                  {showMaintenance ? <ChevronUp size={18} className="text-red-500/50"/> : <ChevronDown size={18} className="text-red-500/50"/>}
                </div>
                
                {showMaintenance && (
                  <div className="p-5 space-y-5 border-t border-red-900/20">
                    <div className="flex items-center justify-between bg-red-950/40 border border-red-900/50 p-3 rounded-xl mb-2">
                      <span className="text-xs font-bold text-red-400 uppercase">Attiva Fermo Macchina</span>
                      <button 
                        onClick={() => setIsMaintenanceActive(!isMaintenanceActive)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${isMaintenanceActive ? 'bg-red-500' : 'bg-zinc-800 border border-zinc-700'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${isMaintenanceActive ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>

                    <p className={`text-[10px] font-mono leading-relaxed transition-opacity ${isMaintenanceActive ? 'text-red-400/80' : 'text-zinc-600'}`}>
                      Seleziona gli orari in cui l'impianto sarà fermo. L'autogeneratore azzererà gli operatori per quelle fasce ridistribuendo il lavoro, se possibile.
                    </p>
                    
                    <div className={`flex gap-4 transition-opacity ${!isMaintenanceActive ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Ora Inizio</label>
                        <select 
                          value={maintenanceStart} 
                          onChange={(e) => setMaintenanceStart(Number(e.target.value))}
                          className="w-full bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-red-300 font-bold outline-none focus:border-red-500"
                        >
                          {Array.from({length: endHour - startHour}, (_, i) => startHour + i).map(h => (
                            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Ora Fine</label>
                        <select 
                          value={maintenanceEnd} 
                          onChange={(e) => setMaintenanceEnd(Number(e.target.value))}
                          className="w-full bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-red-300 font-bold outline-none focus:border-red-500"
                        >
                          {Array.from({length: endHour - startHour}, (_, i) => startHour + i + 1).map(h => (
                            <option key={h} value={h}>{h.toString().padStart(2, '0')}:00</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* TIMELINE SLOTS */}
              <div className="space-y-4 pb-4">
                {calculations.slotsData.map((slot) => {
                  const isMaint = slot.isMaintenance;
                  
                  return (
                    <div 
                      key={slot.hour} 
                      className={`border p-4 rounded-3xl transition-all duration-300 ${
                        isMaint 
                          ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' // ROSSO INTENSO E GRIGIO SE FERMO ATTIVO
                          : slot.operators > 0 
                              ? 'bg-zinc-900 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]' // VERDE SMERALDO
                              : 'bg-zinc-900 border-zinc-800' // GRIGIO BASE
                      }`}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className={isMaint ? 'text-red-500' : slot.operators > 0 ? 'text-emerald-500' : 'text-zinc-600'} />
                          <span className={`font-mono font-bold text-lg ${isMaint ? 'text-red-400' : slot.operators > 0 ? 'text-white' : 'text-zinc-500'}`}>
                            {slot.hour.toString().padStart(2, '0')}:00 - {(slot.hour + 1).toString().padStart(2, '0')}:00
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`text-2xl font-black block leading-none ${isMaint ? 'text-red-500/50' : slot.operators > 0 ? 'text-emerald-400' : 'text-zinc-700'}`}>
                            {isMaint ? 'FERMO' : slot.expectedLines}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${isMaint ? 'text-red-500/50' : 'text-zinc-500'}`}>
                            {isMaint ? 'Manutenzione' : 'Righe Stimate'}
                          </span>
                        </div>
                      </div>

                      {!isMaint && (
                        <div className="flex items-center justify-between bg-zinc-950 p-2 rounded-2xl border border-zinc-800/50 mb-3">
                          <button 
                            onClick={() => adjustOperators(slot.hour, -1)}
                            className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all"
                          >
                            <span className="text-xl font-bold">-</span>
                          </button>
                          
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ope. Assegnati</span>
                            <span className={`text-3xl font-black ${slot.operators > 0 ? 'text-white' : 'text-zinc-600'}`}>
                              {slot.operators}
                            </span>
                          </div>

                          <button 
                            onClick={() => adjustOperators(slot.hour, 1)}
                            className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500/20 active:scale-95 transition-all"
                          >
                            <span className="text-xl font-bold">+</span>
                          </button>
                        </div>
                      )}

                      {/* RIEPILOGO AUTOMATICO PAUSE (Solo se non in manutenzione) */}
                      {!isMaint && slot.operators > 0 && (
                        <div className="pt-3 mt-3 border-t border-zinc-800/50 space-y-2">
                          {slot.hour === 12 && (
                            <div className="flex justify-between items-center text-[10px] text-orange-400/80 bg-orange-500/10 px-2 py-1.5 rounded-lg border border-orange-500/20">
                              <span className="flex items-center gap-1.5"><Box size={12}/> Scaglioni Pranzo: {slot.g1} (12:00) | {slot.g2} (12:30)</span>
                              <span className="font-bold">-{Math.round(slot.lunchLost / 60)} Ope.</span>
                            </div>
                          )}
                          {slot.hour === 13 && (
                            <div className="flex justify-between items-center text-[10px] text-orange-400/80 bg-orange-500/10 px-2 py-1.5 rounded-lg border border-orange-500/20">
                              <span className="flex items-center gap-1.5"><Box size={12}/> Scaglioni Pranzo: {slot.g3} (13:00)</span>
                              <span className="font-bold">-{Math.round(slot.lunchLost / 60)} Ope.</span>
                            </div>
                          )}
                          
                          {!slot.isFirstTwoHours && (
                            <div className="flex justify-between items-center text-[10px] text-amber-500/70 bg-amber-500/10 px-2 py-1.5 rounded-lg border border-amber-500/10">
                              <span className="flex items-center gap-1.5"><Activity size={12}/> Rotazione Caffè (Max 3 alla volta)</span>
                              <span className="font-bold">-{((slot.coffeeLost) / 60).toFixed(1)} Ope.</span>
                            </div>
                          )}
                          
                          {slot.isFirstTwoHours && (
                            <div className="flex justify-between items-center text-[10px] text-zinc-500 bg-zinc-800/50 px-2 py-1.5 rounded-lg border border-zinc-800">
                              <span className="flex items-center gap-1.5"><Activity size={12}/> Caffè non conteggiato (prime 2 ore)</span>
                              <span className="font-bold">0.0 Ope.</span>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-xs text-emerald-400 mt-2 px-1">
                            <span className="font-bold uppercase tracking-wider">Forza Lavoro Effettiva</span>
                            <span className="font-black">{(slot.effectiveMins / 60).toFixed(1)} Ope.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: STATISTICHE E CONDIVISIONE */}
          {activeTab === 'stats' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-2">Previsione Inbound</span>
                <span className="text-7xl font-black text-emerald-400 mb-2">{calculations.totalLines}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                  Righe Totali Giornaliere
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col items-center text-center">
                  <Users size={24} className="text-cyan-500 mb-2 opacity-50" />
                  <span className="text-3xl font-black text-white">{calculations.avgOperators}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Media Ope/Ora</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col items-center text-center">
                  <Clock size={24} className="text-amber-500 mb-2 opacity-50" />
                  <span className="text-3xl font-black text-white">{calculations.totalLostHours}h</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Ore Perse (Pause/Pranzo)</span>
                </div>
              </div>

              {/* RISOLUZIONE ALLERT CONTRADDITTORI */}
              {calculations.isInsufficient ? (
                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-2xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Copertura Insufficiente</h4>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                      La mole di lavoro richiesta ({targetLinesAuto} righe) <strong>non viene coperta</strong> dalla configurazione attuale (raggiunte solo {calculations.totalLines}). <br/>
                      Aumenta il "Max Ope. Disp." oppure modifica gli orari.
                    </p>
                  </div>
                </div>
              ) : (
                calculations.idleOperators > 0 && (
                  <div className="space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
                      <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Risorse Non Sfruttate</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          L'algoritmo non necessita di tutte le persone per raggiungere il target. <strong className="text-amber-400">Avanzano {calculations.idleOperators} operatori</strong> (su {maxOperatorsAuto} max disp.).
                        </p>
                      </div>
                    </div>
                    {calculations.surplusEstimatedEnd !== "" && (
                      <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
                        <Clock size={20} className="text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Stima con Surplus</h4>
                          <p className="text-[10px] text-zinc-400 leading-relaxed">
                            Impiegando <strong className="text-blue-400">fino a {maxOperatorsAuto} operatori</strong> per ogni slot, la lavorazione terminerebbe: <strong className="text-blue-400 font-bold">{calculations.surplusEstimatedEnd}</strong>.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}

              {/* RIEPILOGO MANUTENZIONE (visibile solo se attivo) */}
              {isMaintenanceActive && (
                <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-3xl flex flex-col text-center">
                  <div className="flex justify-center items-center gap-2 mb-2">
                    <Wrench size={18} className="text-red-500" />
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Fermo Macchina Impostato</span>
                  </div>
                  <span className="text-2xl font-black text-red-400 mb-1">{maintenanceStart.toString().padStart(2, '0')}:00 - {maintenanceEnd.toString().padStart(2, '0')}:00</span>
                  <span className="text-[10px] text-red-400/80 uppercase tracking-wider">Nessuna produzione stimata in questo periodo</span>
                </div>
              )}

              {/* BOTTONE ESPORTAZIONE PDF / CONDIVISIONE MOBILE */}
              <button 
                onClick={generateAndSharePDF}
                className="w-full bg-white hover:bg-zinc-200 text-zinc-900 font-black py-4 rounded-2xl transition-all uppercase tracking-wide flex items-center justify-center gap-3 shadow-xl"
              >
                <FileDown size={20} /> Genera Tabella di Marcia PDF
              </button>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Riepilogo Regole</h3>
                <div className="space-y-3 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between border-b border-zinc-800 pb-2 items-center">
                    <span>Stacco Pranzo</span>
                    <span className="text-orange-400 font-bold text-right flex gap-1"><AlertCircle size={14}/> Scaglionato (12-14)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2 items-center">
                    <span>Rotazione Caffè</span>
                    <span className="text-amber-400 font-bold text-right">Dalla 3ª ora (Max 3 simultanei)</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span>Fascia Oraria</span>
                    <span className="text-white font-bold">{startHour.toString().padStart(2, '0')}:00 - {endHour.toString().padStart(2, '0')}:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target KPI</span>
                    <span className="text-emerald-400 font-bold">{kpi} righe/ora</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPOSTAZIONI */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-6">Orario di Lavoro</h3>
                
                <div className="space-y-5">
                  <div>
                    <label className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Inizio Turno
                      <span className="text-white">{startHour.toString().padStart(2,'0')}:00</span>
                    </label>
                    <input type="range" min="0" max="23" value={startHour} onChange={(e) => setStartHour(Number(e.target.value))} className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  
                  <div>
                    <label className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      Fine Turno
                      <span className="text-white">{endHour.toString().padStart(2,'0')}:00</span>
                    </label>
                    <input type="range" min="1" max="24" value={endHour} onChange={(e) => setEndHour(Number(e.target.value))} className="w-full accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">KPI & Rese</h3>
                
                <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Righe / Ora</span>
                  <input type="number" value={kpi} onChange={(e) => setKpi(Number(e.target.value) || 0)} className="w-24 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-emerald-400 text-center font-bold focus:outline-none focus:border-emerald-500 text-lg" />
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-4">Parametri Base Pause</h3>
                
                <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pausa Base (Min)</span>
                  <input type="number" value={breakMins} onChange={(e) => setBreakMins(Number(e.target.value) || 0)} className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white text-center font-bold focus:outline-none focus:border-amber-500 text-sm" />
                </div>

                <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Pranzo Base (Min)</span>
                  <input type="number" value={lunchMins} onChange={(e) => setLunchMins(Number(e.target.value) || 0)} className="w-20 bg-zinc-900 border border-zinc-700 rounded-xl p-2 text-white text-center font-bold focus:outline-none focus:border-orange-500 text-sm" />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION */}
        <div className="absolute bottom-0 w-full bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 flex justify-between px-2 py-3 pb-6 z-20">
          <button onClick={() => setActiveTab('planner')} className={`flex flex-col items-center p-2 w-1/3 rounded-2xl transition-all ${activeTab === 'planner' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <List size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Planner</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center p-2 w-1/3 rounded-2xl transition-all ${activeTab === 'stats' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Activity size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Statistiche</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center p-2 w-1/3 rounded-2xl transition-all ${activeTab === 'settings' ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-600 hover:text-zinc-400'}`}>
            <Settings size={22} /><span className="text-[9px] font-bold mt-1.5 uppercase tracking-wider">Setup</span>
          </button>
        </div>

      </div>
    </div>
  );
}