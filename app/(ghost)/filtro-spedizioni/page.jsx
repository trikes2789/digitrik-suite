'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, UploadCloud, Printer, RefreshCw, Copy, Check } from 'lucide-react';

export default function FiltroSpedizioniPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [risultati, setRisultati] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Stato per il feedback visivo della copia
  const [copiedIndex, setCopiedIndex] = useState(null);
  
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

  // --- LOGICA DI ELABORAZIONE FILE ---
  const elaboraFile = (file) => {
    const reader = new FileReader();

    reader.onload = (evento) => {
      const testo = evento.target.result;
      const righe = testo.split(/\r?\n/);
      const nuoviRisultati = [];

      for (let i = 1; i < righe.length; i++) {
        const riga = righe[i];
        if (riga.trim() === "") continue;

        const colonne = riga.split('\t');

        if (colonne.length > 11) {
          const sede = (colonne[0] || "").trim();
          const nSped = (colonne[1] || "").trim();
          const firmaOra = (colonne[11] || "").trim().toUpperCase();
          const autista = (colonne[14] || "").trim().toUpperCase();

          if (autista.includes("TEMPI DI RESA")) {
            continue;
          }

          if (firmaOra.includes("22 LOCALITA' SERVITA IN 48 ORE")) {
            // Unifichiamo direttamente Sede e Numero Spedizione senza spazi
            const spedizioneUnificata = `${sede}${nSped}`;
            nuoviRisultati.push({ spedizioneUnificata });
          }
        }
      }

      setRisultati(nuoviRisultati);
      setHasSearched(true);
    };

    reader.readAsText(file, 'ISO-8859-1');
  };

  // --- FUNZIONI DI COPIA (CON FALLBACK DI SICUREZZA) ---
  const copiaSingolo = (testo, index) => {
    // Funzione che mostra la spunta verde e la rimuove dopo 2 secondi
    const mostraSpunta = () => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Controllo se la Clipboard API è bloccata
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Metodo moderno
      navigator.clipboard.writeText(testo)
        .then(mostraSpunta)
        .catch((err) => console.error('Errore copia moderna:', err));
    } else {
      // Metodo Fallback per HTTP / restrizioni browser
      const textArea = document.createElement("textarea");
      textArea.value = testo;
      // Nascondi la textarea per non rovinare la grafica
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        mostraSpunta();
      } catch (err) {
        console.error('Fallback copia fallito', err);
        alert("Il browser ha bloccato la copia automatica. Seleziona il testo manualmente.");
      }
      
      document.body.removeChild(textArea);
    }
  };

  // --- RESET APP ---
  const resetApp = () => {
    setRisultati([]);
    setHasSearched(false);
    setCopiedIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-8 font-sans flex flex-col items-center print:bg-white print:p-0 print:text-black">
      
      <div className="max-w-4xl w-full">
        {/* INTESTAZIONE */}
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
           
           {/* AREA DRAG & DROP */}
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
                     ? `Trovate ${risultati.length} spedizioni` 
                     : "Nessun risultato trovato."}
                 </h2>
                 
                 <div className="flex gap-2">
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
                     <RefreshCw size={18} /> Nuovo
                   </button>
                 </div>
               </div>

               {/* TABELLA */}
               {risultati.length > 0 && (
                 <div className="overflow-hidden rounded-xl border border-zinc-800 print:border-black print:rounded-none">
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-zinc-950 print:bg-gray-200">
                         <th className="p-4 font-semibold text-zinc-100 border-b border-zinc-800 print:text-black print:border-black">Spedizione</th>
                         <th className="p-4 border-b border-zinc-800 print:hidden w-24"></th>
                       </tr>
                     </thead>
                     <tbody>
                       {risultati.map((item, index) => (
                         <tr key={index} className="bg-zinc-900 hover:bg-zinc-800 transition-colors print:bg-white group">
                           <td className="p-4 border-b border-zinc-800/50 font-mono text-lg font-bold text-amber-400 print:text-black print:border-black">
                             {item.spedizioneUnificata}
                           </td>
                           <td className="p-4 border-b border-zinc-800/50 print:hidden text-right">
                             <button
                               onClick={() => copiaSingolo(item.spedizioneUnificata, index)}
                               className="p-2 rounded-md bg-zinc-950 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all opacity-50 group-hover:opacity-100"
                               title="Copia Spedizione"
                             >
                               {copiedIndex === index ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                             </button>
                           </td>
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