'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { 
  ScanLine, ArrowLeft, Download, Settings, 
  X, Heart, RefreshCcw, Type, Wand2
} from 'lucide-react';
import Link from 'next/link';

export default function BarcodeGenerator() {
  const [lang, setLang] = useState('en');
  const [text, setText] = useState('DIGITRIK');
  const [format, setFormat] = useState('CODE128');
  const [isValid, setIsValid] = useState(true);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportFilename, setExportFilename] = useState("barcode");
  
  // Riferimento all'elemento SVG reale
  const barcodeRef = useRef(null);

  const [design, setDesign] = useState({
    width: 2,
    height: 100,
    displayValue: true,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 10
  });

  // FUNZIONE DI GENERAZIONE
  useEffect(() => {
    if (barcodeRef.current && text) {
      try {
        JsBarcode(barcodeRef.current, text, {
          format: format,
          width: design.width,
          height: design.height,
          displayValue: design.displayValue,
          background: design.background,
          lineColor: design.lineColor,
          margin: design.margin,
          valid: (valid) => {
            setIsValid(valid);
          }
        });
      } catch (e) {
        setIsValid(false);
      }
    }
  }, [text, format, design]);

  const downloadBarcode = () => {
    const svg = barcodeRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = design.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${exportFilename}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    setShowDownloadModal(false);
  };

  return (
    <div className="h-screen bg-zinc-950 text-zinc-100 font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-zinc-950 flex flex-col p-4 overflow-y-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-cyan-600/20 rounded-lg flex items-center justify-center transition-colors">
            <ArrowLeft size={18} className="text-zinc-400" />
          </Link>
          <h1 className="text-xl font-black italic text-white leading-none">DIGITRIK <span className="text-cyan-500 block text-[10px] uppercase tracking-widest mt-1">BARCODE PRO</span></h1>
        </div>

        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-white outline-none focus:border-cyan-500">
                    <option value="CODE128">CODE 128 (Text+Num)</option>
                    <option value="EAN13">EAN-13 (Numbers only)</option>
                    <option value="UPC">UPC (Numbers only)</option>
                    <option value="CODE39">CODE 39</option>
                </select>
            </div>

            <div className="space-y-4">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Bar Width</label>
                <input type="range" min="1" max="4" value={design.width} onChange={(e) => setDesign({...design, width: parseInt(e.target.value)})} className="w-full accent-cyan-500" />
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Height</label>
                <input type="range" min="40" max="150" value={design.height} onChange={(e) => setDesign({...design, height: parseInt(e.target.value)})} className="w-full accent-cyan-500" />
            </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col bg-zinc-900/50 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full space-y-8">
            
            {/* INPUT BOX */}
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl shadow-xl">
                <h3 className="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-widest flex items-center gap-2"><Type size={16} className="text-cyan-500"/> Barcode Content</h3>
                <input 
                    type="text" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    className={`w-full bg-zinc-900 border rounded-xl p-4 text-xl text-white font-mono outline-none transition-all ${isValid ? 'border-zinc-800 focus:border-cyan-500' : 'border-red-500 text-red-400'}`}
                />
                {!isValid && <p className="text-red-500 text-[10px] mt-2 font-bold uppercase tracking-tighter">Invalid content for {format} format</p>}
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="bg-white p-12 rounded-[2.5rem] flex items-center justify-center min-h-[300px] shadow-2xl overflow-hidden border-4 border-zinc-800">
                <div className={isValid ? "block" : "hidden"}>
                    <svg ref={barcodeRef}></svg>
                </div>
                {!isValid && (
                    <div className="text-center text-zinc-400">
                        <RefreshCcw className="animate-spin mx-auto mb-2" size={32} />
                        <p className="text-xs font-bold uppercase">Waiting for valid input...</p>
                    </div>
                )}
            </div>

            {/* DOWNLOAD ACTION */}
            <div className="text-center">
                <button 
                    onClick={() => { setExportFilename(`barcode_${text}`); setShowDownloadModal(true); }}
                    disabled={!isValid}
                    className="px-12 py-5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                    <Download size={20} className="inline mr-2" /> Download Barcode
                </button>
            </div>
        </div>
      </main>

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-cyan-600/30 rounded-[2rem] w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(6,182,212,0.2)]">
            <h3 className="text-xl font-black text-white uppercase mb-2">Ready to Export</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-6 tracking-widest">Choose your filename</p>
            
            <input 
                type="text" 
                value={exportFilename} 
                onChange={(e) => setExportFilename(e.target.value)} 
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white mb-8 outline-none focus:border-cyan-500 font-bold" 
            />
            
            <div className="flex gap-3">
              <button onClick={() => setShowDownloadModal(false)} className="flex-1 py-4 text-zinc-500 font-bold uppercase text-xs hover:text-zinc-300">Cancel</button>
              <button onClick={downloadBarcode} className="flex-1 py-4 bg-cyan-600 text-white rounded-xl font-black uppercase text-xs shadow-lg shadow-cyan-900/20">Download Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}