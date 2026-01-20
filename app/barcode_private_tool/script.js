/**
 * GLS Smart Scan Logic
 * Gestisce la lettura barcode, l'input manuale, il parsing dei file e il trigger audio.
 */

// --- VARIABILI GLOBALI ---
let allData = [];
let scannedCount = 0;
let currentFileContent = "";

// --- VARIABILI AUDIO ---
let audioContext, analyser, microphone, filter1, filter2, gainNode;
let isListening = false;
let volumeThreshold = 0.85;
let targetFreq = 3000;
let cooldown = false;

// Al caricamento della pagina, configuriamo i listener che non sono inline nell'HTML
document.addEventListener('DOMContentLoaded', () => {
    // Gestione Drag & Drop
    const dropZone = document.getElementById('dropZone');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    dropZone.addEventListener('dragover', () => {
        dropZone.style.borderColor = 'var(--accent)';
        dropZone.style.backgroundColor = '#fff3cd';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#cbd5e0';
        dropZone.style.backgroundColor = '#f8f9fa';
    });

    dropZone.addEventListener('drop', (e) => {
        dropZone.style.borderColor = '#cbd5e0';
        dropZone.style.backgroundColor = '#f8f9fa';
        handleFiles(e.dataTransfer.files);
    });

    // Gestione input file standard
    document.getElementById('fileInput').addEventListener('change', (e) => handleFiles(e.target.files));

    // Gestione tastiera globale (Spazio/Invio per confermare)
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') {
            // Previene lo scroll della pagina se si preme spazio
            if(e.target.tagName !== 'INPUT') {
                e.preventDefault();
                completeCurrent();
            }
        }
    });
});


// --- LOGICA MODALE MANUALE ---

function openModal() {
    document.getElementById('manualModal').style.display = 'flex';
    document.getElementById('manSede').focus();
    updateManualPreview();
}

function closeModal() {
    document.getElementById('manualModal').style.display = 'none';
}

function updateManualPreview() {
    const sede = document.getElementById('manSede').value || "XX";
    let sped = (document.getElementById('manSped').value || "000000000");

    // Logica per WW (Sempre 9 cifre)
    if (sede.toUpperCase() === 'WW' && sped.length < 9) {
        sped = sped.padStart(9, '0');
    } else {
        sped = sped.padEnd(9, '0');
    }

    let colloRaw = document.getElementById('manCollo').value || "1";
    const collo = colloRaw.padStart(2, '0');
    const tipo = document.getElementById('manTipo').value || "0";
    const dest = document.getElementById('manDest').value || "DEST";

    const code = `${sede}${sped}${collo}${tipo}${dest}`;
    const human = `${sede} ${sped} ${collo} ${tipo} ${dest}`;

    document.getElementById('manualText').innerText = human;
    try {
        JsBarcode("#manualBarcode", code, {
            format: "CODE128",
            width: 1.5,
            height: 100,
            displayValue: false,
            margin: 0
        });
    } catch (e) {
        console.warn("JsBarcode non caricato o errore nella generazione", e);
    }
}

function addManualItem() {
    const sede = document.getElementById('manSede').value.toUpperCase();
    let sped = document.getElementById('manSped').value;
    let collo = (document.getElementById('manCollo').value || "1").padStart(2, '0');
    const tipo = document.getElementById('manTipo').value || "0";
    const dest = document.getElementById('manDest').value.toUpperCase() || "???";

    if (!sede || !sped) {
        alert("Sede e Spedizione obbligatori");
        return;
    }

    if (sede === 'WW' && sped.length < 9) {
        sped = sped.padStart(9, '0');
    }

    const barcodeData = `${sede}${sped}${collo}${tipo}${dest}`;
    const humanText = `${sede} ${sped} ${collo} ${tipo} ${dest}`;
    const zoneChar = dest.charAt(0).toUpperCase() || "A";

    const newItem = {
        id: Date.now(),
        zona: dest,
        barcodeData: barcodeData,
        humanText: humanText,
        details: "GENERATO MANUALMENTE",
        colorClass: `border-${zoneChar}`,
        fullSearch: (humanText + " " + dest).toLowerCase()
    };

    allData.unshift(newItem);
    renderList(allData);
    updateFocus();
    closeModal();

    // Reset campi principali per nuovo inserimento rapido
    document.getElementById('manSped').value = "";
    document.getElementById('manCollo').value = "";
}


// --- SISTEMA AUDIO (MICROFONO) ---

async function toggleAudio() {
    if (isListening) {
        location.reload(); // Semplice modo per fermare tutto resettando
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        // Filtri Highpass per rimuovere rumore di fondo basso
        filter1 = audioContext.createBiquadFilter();
        filter1.type = "highpass";
        filter1.frequency.value = 3500;

        filter2 = audioContext.createBiquadFilter();
        filter2.type = "highpass";
        filter2.frequency.value = 3500;

        // Filtro passa-banda sulla frequenza target (es. beep scanner)
        let bpFilter = audioContext.createBiquadFilter();
        bpFilter.type = "bandpass";
        bpFilter.frequency.value = targetFreq;
        bpFilter.Q.value = 5;

        gainNode = audioContext.createGain();
        gainNode.gain.value = 10.0;

        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(bpFilter);
        bpFilter.connect(gainNode);
        gainNode.connect(analyser);

        analyser.fftSize = 256;
        isListening = true;
        document.getElementById('btnMic').classList.add('active');
        document.getElementById('micText').innerText = "ASCOLTO ATTIVO";
        detectSound();
    } catch (err) {
        alert("Errore Microfono: " + err.message);
    }
}

function updateThreshold(val) {
    volumeThreshold = val / 100;
    document.getElementById('threshLine').style.left = val + "%";
}

function updateFreq(val) {
    targetFreq = val;
    document.getElementById('freqVal').innerText = val + " Hz";
}

function detectSound() {
    if (!isListening) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    let average = sum / dataArray.length;

    let visualVal = (average / 100) * 100;
    if (visualVal > 100) visualVal = 100;
    if (visualVal < 5) visualVal = 0;

    document.getElementById('audioBar').style.width = visualVal + "%";

    if (visualVal > (volumeThreshold * 100) && !cooldown) {
        flashLed();
        triggerAction();
        cooldown = true;
        setTimeout(() => { cooldown = false; }, 600);
    }
    requestAnimationFrame(detectSound);
}

function flashLed() {
    const led = document.getElementById('triggerLed');
    led.classList.add('flash');
    setTimeout(() => led.classList.remove('flash'), 200);
}

function triggerAction() {
    completeCurrent();
}


// --- GESTIONE FILE E PARSING ---

function handleFiles(files) {
    if (!files.length) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        currentFileContent = e.target.result;
        processText(currentFileContent);
    };
    reader.readAsText(files[0]);
    document.querySelector('#dropZone p').innerText = "✅ " + files[0].name;
}

function reprocessFile() {
    if (currentFileContent) processText(currentFileContent);
}

function processText(text) {
    scannedCount = 0;
    updateStats();
    const lines = text.split('\n');
    allData = [];

    // Regex specifica per il formato file GLS
    const rowRegex = /^([a-zA-Z0-9]{2})\s+(\d{6,12})\s+(\d+)\s+(\d+)\s+([a-zA-Z0-9]{2,4})/;
    const filterType = document.getElementById('filterLogic').value;

    lines.forEach((line, index) => {
        const cleanLine = line.trim();
        // Ignora intestazioni e righe vuote
        if (!cleanLine || cleanLine.includes('---') || cleanLine.includes('GLS ENTERPRISE') || cleanLine.includes('Sig  N.')) return;

        const match = cleanLine.match(rowRegex);
        if (match) {
            const sigla = match[1].toUpperCase();
            let sped = match[2];
            const colloRaw = match[3];
            const tipo = match[4];
            const zona = match[5];

            const remainingText = cleanLine.substring(match[0].length);

            // Logica filtro N S / S N
            if (filterType === "NS" && !/\*\s+N\s+S/.test(remainingText)) return;
            if (filterType === "SN" && !/\*\s+S\s+N/.test(remainingText)) return;
            if (filterType === "NN" && !/\*\s+N\s+N/.test(remainingText)) return;
            if (filterType === "SS" && !/\*\s+S\s+S/.test(remainingText)) return;

            // Fix per sedi WW
            if (sigla === 'WW' && sped.length < 9) {
                sped = sped.padStart(9, '0');
            }

            const colloFmt = colloRaw.padStart(2, '0');
            const barcodeData = `${sigla}${sped}${colloFmt}${tipo}${zona}`;
            const humanText = `${sigla} ${sped} ${colloFmt} ${tipo} ${zona}`;

            // Pulizia dettagli rimuovendo i flag * N S ecc.
            let details = cleanLine.substring(match[0].length).trim()
                .replace(/^[A-Z\s']+\*\s[S]\s[N]\s+/, '')
                .replace(/^[A-Z\s']+\*\s[N]\s[S]\s+/, '')
                .replace(/^[A-Z\s']+\*\s[N]\s[N]\s+/, '')
                .replace(/^[A-Z\s']+\*\s[S]\s[S]\s+/, '');

            const zoneChar = zona.charAt(0).toUpperCase();

            allData.push({
                id: index,
                zona: zona,
                barcodeData: barcodeData,
                humanText: humanText,
                details: details,
                colorClass: `border-${zoneChar}`,
                fullSearch: (humanText + " " + zona).toLowerCase()
            });
        }
    });
    renderList(allData);
}

function renderList(data) {
    const list = document.getElementById('listResult');
    list.innerHTML = '';

    if (data.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        return;
    }

    document.getElementById('emptyState').style.display = 'none';
    updateStats(data.length);

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = `barcode-card ${item.colorClass || ''}`;
        card.dataset.id = item.id;
        card.onclick = function() { markAsDone(this); };
        card.innerHTML = `
            <div class="zone-box">
                <h2>${item.zona}</h2>
                <span>ZONA</span>
            </div>
            <div class="card-content">
                <svg id="barcode-${item.id}"></svg>
                <div class="human-readable">${item.humanText}</div>
                <div class="details">${item.details}</div>
            </div>`;
        list.appendChild(card);
        try {
            JsBarcode(`#barcode-${item.id}`, item.barcodeData, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: false,
                margin: 0
            });
        } catch (e) {}
    });
    updateFocus();
}


// --- FOCUS & NAVIGAZIONE ---

function updateFocus() {
    // Rimuovi focus precedente
    document.querySelectorAll('.active-focus').forEach(el => el.classList.remove('active-focus'));
    
    // Trova il primo elemento non scansionato e visibile
    const first = document.querySelector('.barcode-card:not(.scanned):not([style*="display: none"])');

    if (first) {
        first.classList.add('active-focus');
        const container = document.getElementById('scrollContainer');
        const elementTop = first.offsetTop;
        const elementHeight = first.offsetHeight;
        const containerHeight = container.clientHeight;

        // Calcolo scroll per centrare l'elemento
        const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2) + 130; // +130 offset header approx

        container.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
}

function markAsDone(el) {
    if (el.classList.contains('scanned')) return;
    el.classList.add('scanned');
    scannedCount++;
    updateStats();
    updateFocus();
}

function completeCurrent() {
    const curr = document.querySelector('.active-focus');
    if (curr) markAsDone(curr);
}

function updateStats(total) {
    if (total !== undefined) document.getElementById('statsTotal').innerText = `Totale: ${total}`;
    document.getElementById('statsDone').innerText = `Fatti: ${scannedCount}`;
}

function filterData() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.barcode-card');
    cards.forEach(c => {
        const itemData = allData.find(d => d.id == c.dataset.id);
        if (itemData && itemData.fullSearch.includes(q)) c.style.display = 'grid';
        else c.style.display = 'none';
    });
    updateFocus();
}