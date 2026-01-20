'use client';

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';

export default function GLSReader() {
  // --- STATO E LOGICA ---
  // Qui dovrai integrare la logica del tuo file 'script.js' originale.
  // Ho preparato gli stati base per l'interfaccia.
  const [freq, setFreq] = useState(3000);
  const [threshold, setThreshold] = useState(85);
  const [filter, setFilter] = useState('NS');
  const [manualInput, setManualInput] = useState({ sede: '', sped: '', collo: '', tipo: '', dest: '' });
  const [showModal, setShowModal] = useState(false);

  // --- FUNZIONI PLACEHOLDER (Sostituisci con la tua logica di script.js) ---
  const toggleAudio = () => {
    alert("Qui va integrata la funzione toggleAudio() dal tuo script.js");
  };

  const handleManualPreview = () => {
    // Logica per aggiornare l'anteprima barcode manuale
    console.log("Aggiornamento anteprima...", manualInput);
  };

  const addManualItem = () => {
    console.log("Aggiungi item manuale");
    setShowModal(false);
  };

  return (
    <>
      {/* Caricamento libreria esterna */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js" 
        strategy="lazyOnload" 
      />

      <div className="gls-app">
        {/* --- MODALE --- */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Generazione Manuale</h3>
              <div className="modal-grid-2">
                <div>
                  <label>Sede Mitt. (2-4)</label>
                  <input 
                    className="manual-input" 
                    maxLength={4} 
                    placeholder="AB" 
                    value={manualInput.sede}
                    onChange={(e) => { setManualInput({...manualInput, sede: e.target.value.toUpperCase()}); handleManualPreview(); }} 
                  />
                </div>
                <div>
                  <label>N. Sped (Max 9)</label>
                  <input 
                    className="manual-input" 
                    maxLength={9} 
                    placeholder="123456789" 
                    type="tel" 
                    value={manualInput.sped}
                    onChange={(e) => { setManualInput({...manualInput, sped: e.target.value.replace(/[^0-9]/g, '')}); handleManualPreview(); }} 
                  />
                </div>
              </div>
              <div className="modal-grid-3">
                <div>
                  <label>Collo</label>
                  <input 
                    className="manual-input" 
                    type="number" 
                    placeholder="1"
                    value={manualInput.collo}
                    onChange={(e) => setManualInput({...manualInput, collo: e.target.value})}
                  />
                </div>
                <div>
                  <label>Tipo (1)</label>
                  <input 
                    className="manual-input" 
                    type="tel" 
                    maxLength={1} 
                    placeholder="0"
                    value={manualInput.tipo}
                    onChange={(e) => setManualInput({...manualInput, tipo: e.target.value})}
                  />
                </div>
                <div>
                  <label>Dest (2-4)</label>
                  <input 
                    className="manual-input" 
                    maxLength={4} 
                    placeholder="V3"
                    value={manualInput.dest}
                    onChange={(e) => setManualInput({...manualInput, dest: e.target.value})}
                  />
                </div>
              </div>
              <div className="preview-box">
                <svg id="manualBarcode"></svg>
                <div className="preview-text">Anteprima...</div>
              </div>
              <div className="modal-actions">
                <button className="btn-modal-close" onClick={() => setShowModal(false)}>Annulla</button>
                <button className="btn-modal-add" onClick={addManualItem}>Aggiungi alla Lista</button>
              </div>
            </div>
          </div>
        )}

        {/* --- HEADER --- */}
        <div className="top-section">
          <header>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link href="/" className="btn-home" style={{textDecoration: 'none', fontSize: '1.2rem'}}>🏠</Link>
              <h1>Lettore GLS</h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button className="btn-manual" onClick={() => setShowModal(true)}>+ Manuale</button>
              <div className="status-led" id="triggerLed"></div>
            </div>
          </header>

          <div className="control-card">
            <div className="controls-grid">
              <div>
                <button className="btn-mic" id="btnMic" onClick={toggleAudio}>
                  <div className="icon">🎙️</div>
                  <span id="micText">Attiva Ascolto</span>
                  <div className="visualizer-container">
                    <div className="visualizer-bar" id="audioBar"></div>
                    <div className="visualizer-threshold" id="threshLine" style={{ left: `${threshold}%` }}></div>
                  </div>
                </button>
              </div>
              
              <div className="drop-zone" id="dropZone">
                <p>📂 Area Caricamento</p>
                <div className="drop-actions">
                  <input type="file" id="fileInput" accept=".txt,.csv" style={{ display: 'none' }} />
                  <button className="btn-drop-action" onClick={() => document.getElementById('fileInput')?.click()}>
                    📁 Sfoglia PC
                  </button>
                  <a className="btn-drop-action btn-server" href="search-ms:displayname=Risultati%20ricerca%20in%20%5C%5C10.58.125.2%5Cpc&crumb=System.Generic.String%3Anatana&crumb=location:%5C%5C10.58.125.2%5Cpc" target="_blank">
                    🔍 Apri Server
                  </a>
                </div>
                <span style={{ fontSize: '0.7em', color: '#999', marginTop: '5px' }}>o trascina il file qui</span>
              </div>
            </div>

            <div className="settings-grid">
              <div className="input-group">
                <label>Filtro Sequenza</label>
                <select id="filterLogic" className="styled-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="NS">✱ N S (Richiesto)</option>
                  <option value="SN">✱ S N (Standard)</option>
                  <option value="NN">✱ N N</option>
                  <option value="SS">✱ S S</option>
                  <option value="ALL">Mostra Tutto</option>
                </select>
              </div>
              
              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Calibrazione Audio</label>
                  <span id="freqVal" style={{ fontSize: '0.7em', color: 'var(--primary)' }}>{freq} Hz</span>
                </div>
                <input type="range" min="2000" max="4000" value={freq} onChange={(e) => setFreq(Number(e.target.value))} title="Frequenza" />
                <input type="range" min="50" max="98" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} title="Soglia" style={{ marginTop: '8px', accentColor: 'var(--error)' }} />
              </div>
            </div>
            
            <div className="stats-bar">
              <span id="statsTotal">In attesa file...</span>
              <span id="statsDone" className="stats-highlight">0 Fatti</span>
            </div>
          </div>

          <input type="text" className="search-box" id="searchInput" placeholder="🔍 Cerca spedizione o zona..." />
        </div>

        {/* --- LISTA --- */}
        <div className="list-container" id="scrollContainer">
          <div id="listResult" className="barcode-list"></div>
          <div id="emptyState" className="empty-state">Nessun dato caricato.</div>
        </div>
      </div>

      {/* --- CSS INTEGRATO (Portato dall'HTML originale) --- */}
      <style jsx global>{`
        :root {
            --primary: #0b2d51; 
            --accent: #fdb913;
            --bg: #f0f2f5;
            --text: #333;
            --text-light: #666;
            --white: #ffffff;
            --success: #28a745;
            --error: #dc3545;
            --border: #dee2e6;
            --shadow: 0 4px 12px rgba(0,0,0,0.08);
            --card-radius: 12px;
        }

        .gls-app {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: var(--bg);
          color: var(--text);
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex; 
          flex-direction: column;
        }

        .top-section {
            flex-shrink: 0; 
            background-color: var(--bg); 
            z-index: 200;
            padding: 10px 15px 0 15px; 
            box-shadow: 0 5px 20px rgba(0,0,0,0.05);
            position: relative;
        }

        header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin-bottom: 10px; 
            padding: 0 5px;
        }
        
        header h1 { 
            color: var(--primary); 
            margin: 0; 
            font-size: 1.3rem; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            font-weight: 800;
        }

        .control-card {
            background: var(--white); 
            border-radius: var(--card-radius); 
            box-shadow: var(--shadow); 
            border-top: 4px solid var(--primary);
            padding: 15px; 
            margin-bottom: 10px;
        }

        .controls-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            align-items: start; 
        }
        
        .btn-mic {
            background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
            color: white; 
            border: none; 
            padding: 12px;
            border-radius: 8px; 
            font-weight: bold; 
            cursor: pointer; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            gap: 5px;
            width: 100%; 
            height: 100%; 
            min-height: 80px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            transition: all 0.2s;
        }
        .btn-mic:active { transform: translateY(1px); }

        .visualizer-container {
            height: 6px; 
            background: #e9ecef; 
            border-radius: 10px; 
            margin-top: 8px; 
            overflow: hidden; 
            position: relative; 
            width: 100%;
        }
        .visualizer-bar {
            height: 100%; 
            width: 0%; 
            background: linear-gradient(90deg, var(--accent), var(--success));
            transition: width 0.05s linear;
        }
        .visualizer-threshold { 
            position: absolute; 
            top: 0; 
            bottom: 0; 
            width: 2px; 
            background: var(--error); 
            z-index: 5; 
        }

        .drop-zone {
            border: 2px dashed #cbd5e0; 
            background-color: #f8f9fa; 
            border-radius: 8px; 
            padding: 10px; 
            text-align: center; 
            height: 100%; 
            min-height: 80px;
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center;
            position: relative; 
            transition: all 0.2s;
        }
        .drop-zone p { 
            margin: 0 0 8px 0; 
            font-weight: 700; 
            color: var(--primary); 
            font-size: 0.85rem; 
            text-transform: uppercase; 
        }
        
        .drop-actions { 
            display: flex; 
            gap: 8px; 
            width: 100%; 
        }
        
        .btn-drop-action {
            flex: 1; 
            padding: 8px 5px; 
            border: 1px solid #ced4da; 
            border-radius: 6px;
            font-size: 0.75rem; 
            font-weight: 600; 
            cursor: pointer; 
            text-decoration: none;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 5px;
            transition: all 0.2s; 
            color: var(--text); 
            background: white;
        }
        .btn-drop-action:hover { background-color: #e2e6ea; }
        
        .btn-server {
            background-color: #e3f2fd; 
            color: #0d47a1; 
            border-color: #90caf9;
        }

        .input-group label { 
            display: block; 
            margin-bottom: 5px; 
            font-weight: 700; 
            font-size: 0.75rem; 
            color: #666; 
            text-transform: uppercase; 
        }
        
        .styled-select, .search-box, .manual-input {
            width: 100%; 
            padding: 10px 12px; 
            border: 1px solid #ced4da; 
            border-radius: 6px; 
            font-size: 0.95rem; 
            background-color: #fff; 
            color: var(--text);
        }
        
        input[type=range] { 
            width: 100%; 
            cursor: pointer; 
            accent-color: var(--primary); 
            height: 4px; 
            margin-top: 5px; 
        }

        .settings-grid {
            display: grid; 
            grid-template-columns: 1fr 1.5fr; 
            gap: 10px; 
            margin-top: 15px; 
            padding-top: 15px; 
            border-top: 1px dashed #eee;
        }

        .stats-bar {
            display: flex; 
            justify-content: space-between; 
            font-size: 0.8rem; 
            color: #888; 
            padding: 5px 5px; 
            border-top: 1px solid #eee; 
            margin-top: 10px;
        }
        .stats-highlight { color: var(--primary); font-weight: 700; }

        .btn-manual {
            background-color: var(--accent); 
            color: var(--primary); 
            border: none;
            padding: 8px 15px; 
            border-radius: 20px; 
            font-weight: bold; 
            font-size: 0.8rem;
            cursor: pointer; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .list-container {
            flex-grow: 1; 
            overflow-y: auto; 
            position: relative;
            padding: 0; 
            scroll-behavior: smooth;
            background: #e2e6ea;
        }
        .barcode-list { 
            display: flex; 
            flex-direction: column; 
            align-items: center;
            padding-top: 50vh; 
            padding-bottom: 50vh; 
        }

        .empty-state { 
            text-align: center; 
            padding: 50px 20px; 
            color: #aaa; 
            font-style: italic; 
            margin-top: -20vh; 
        }
        
        .status-led {
            width: 10px; 
            height: 10px; 
            border-radius: 50%; 
            background: #ddd; 
            border: 2px solid #fff; 
            box-shadow: 0 0 2px rgba(0,0,0,0.1);
        }

        /* MODALE */
        .modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 2000; 
            display: flex; justify-content: center; align-items: center; 
            backdrop-filter: blur(5px);
        }
        .modal-card {
            background: white; width: 90%; max-width: 400px;
            border-radius: 16px; padding: 20px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.3);
            border-top: 5px solid var(--accent);
        }
        .modal-card h3 { margin: 0 0 15px; color: var(--primary); border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .modal-grid-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 10px; margin-bottom: 10px; }
        .modal-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px; }
        .btn-modal-close { background: #eee; color: #555; }
        .btn-modal-add { background: var(--primary); color: white; }
        .modal-actions { display: flex; gap: 10px; margin-top: 15px; }
        .modal-actions button { flex: 1; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }

        .preview-box {
            background: #f8f9fa; border: 1px dashed #ccc; padding: 10px;
            text-align: center; border-radius: 8px; min-height: 80px;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
      `}</style>
    </>
  );
}