'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, UploadCloud, Printer, RefreshCw } from 'lucide-react';

export default function FiltroSpedizioniPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [risultati, setRisultati] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const fileInputRef = useRef(null);

  // --- GESTIONE DRAG & DROP ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      elaboraFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      elaboraFile(e.target.files[0]);
    }
  };

  // --- LOGICA DI ELABORAZIONE FILE CORRETTA ---
  const elaboraFile = (file) => {
    const reader = new FileReader();

    reader.onload = (evento) => {
      const testo = evento.target.result;
      
      // Divisione sicura delle righe (supporta sia file Windows che Mac/Linux)
      const righe = testo.split(/\r?\n/);
      const nuoviRisultati = [];

      // Partiamo da i = 1 per saltare l'intestazione
      for (let i = 1; i < righe.length; i++) {
        const riga = righe[i];
        
        // Saltiamo solo le righe che sono letteralmente vuote
        if (riga.trim() === "") continue;

        // Dividiamo le colonne PRIMA di fare il trim per non perdere le colonne vuote alla fine
        const colonne = riga.split('\t');

        // Ci bastano 12 colonne per arrivare all'indice 11 (Firma)
        if (colonne.length > 11) {
          
          // Estrazione sicura con fallback "" se la colonna è vuota
          const sede = (colonne[0] || "").trim();
          const nSped = (colonne[1] || "").trim();
          const firmaOra = (colonne[11] || "").trim().toUpperCase();
          const autista = (colonne[14] || "").trim().toUpperCase();

          // Filtro 1: Se l'autista contiene "TEMPI DI RESA", è sul camion corretto -> SCARTA
          if (autista.includes("TEMPI DI RESA")) {
            continue;
          }

          // Filtro 2: Se NON è sul quel camion, ma la località richiede 48 ORE -> INCONGRUENZA
          if (firmaOra.includes("22 LOCALITA' SERVITA IN 48 ORE")) {
            nuoviRisultati.push({ sede, nSped });
          }
        }
      }

      setRisultati(nuoviRisultati);
      setHasSearched(true);
    };

    // Lettura con encoding per supportare correttamente gli apostrofi e accenti dei file testuali
    reader.readAsText(file, 'ISO-8859-1');
  };

  // --- RESET APP ---
  const resetApp = () => {
    setRisultati([]);
    setHasSearched(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-8 font-sans flex flex-col items-center print:bg-white print:p-0 print:text-black">
      
      <div className="max-w-4xl w-full">
        {/* INTESTAZIONE (nascosta in stampa) */}
        <div className="flex items-center gap-4 mb-12 print:hidden">
           <Link href="/dashboard" className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white">
             <ArrowLeft size={20} />
           </Link>
           <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
             <Truck className="text-blue-500" /> Filtro Tempi di Resa
           </h1>
        </div>

        {/* CONTENITORE PRINCIPALE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 min-h-[400px] print:border-none print:p-0 print:bg-white print:shadow-none">
           
           {/* AREA DRAG & DROP (nascosta in stampa) */}
           <div className="print:hidden">
             <div 
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current.click()}
               className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-4
                 ${isDragging 
                   ? 'border-blue-500 bg-blue-500/10' 
                   : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'
                 }`}
             >
               <UploadCloud size={48} className={isDragging ? 'text-blue-500' : 'text-zinc-500'} />
               <div>
                 <p className="text-lg font-bold text-white mb-1">Trascina qui il tuo file .txt</p>
                 <p className="text-zinc-400 text-sm">oppure clicca per selezionarlo dal computer</p>
               </div>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 accept=".txt" 
                 className="hidden" 
                 onChange={handleFileSelect} 
               />
             </div>
           </div>

           {/* RISULTATI */}
           {hasSearched && (
             <div className="mt-8">
               
               {/* Header Risultati & Bottoni */}
               <div className="flex items-center justify-between mb-6 print:hidden">
                 <h2 className={`text-xl font-bold ${risultati.length > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                   {risultati.length > 0 
                     ? `Trovate ${risultati.length} spedizioni incongruenti` 
                     : "Nessun risultato trovato in questo file."}
                 </h2>
                 
                 <div className="flex gap-3">
                   {risultati.length > 0 && (
                     <button 
                       onClick={() => window.print()} 
                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                     >
                       <Printer size={18} /> Stampa
                     </button>
                   )}
                   <button 
                     onClick={resetApp} 
                     className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-lg font-medium transition-colors"
                   >
                     <RefreshCw size={18} /> Nuovo File
                   </button>
                 </div>
               </div>

               {/* Titolo visibile solo in fase di stampa */}
               <h2 className="hidden print:block text-2xl font-bold mb-4 border-b border-black pb-2 text-black">
                 Report Incongruenze Spedizioni (Totale: {risultati.length})
               </h2>

               {/* TABELLA */}
               {risultati.length > 0 && (
                 <div className="overflow-hidden rounded-xl border border-zinc-800 print:border-black print:rounded-none">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-zinc-950 print:bg-gray-200">
                         <th className="p-4 font-semibold text-zinc-300 border-b border-zinc-800 print:text-black print:border-black">Sede</th>
                         <th className="p-4 font-semibold text-zinc-300 border-b border-zinc-800 print:text-black print:border-black">N. Spedizione</th>
                       </tr>
                     </thead>
                     <tbody>
                       {risultati.map((item, index) => (
                         <tr key={index} className="bg-zinc-900 hover:bg-zinc-800 transition-colors print:bg-white">
                           <td className="p-4 border-b border-zinc-800/50 text-zinc-300 print:text-black print:border-black">{item.sede}</td>
                           <td className="p-4 border-b border-zinc-800/50 font-mono text-amber-400 print:text-black print:border-black">{item.nSped}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}

             </div>
           )}

        </div>
      </div>
    </div>
  );
}