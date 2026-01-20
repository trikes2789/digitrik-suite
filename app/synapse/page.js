'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, Copy, Check, MessageSquare, Image as ImageIcon, Music, 
  Linkedin, Instagram, Facebook, Twitter, Youtube, X,
  Type, Layout, Wand2, ArrowLeft, Info, Heart, Coffee, CreditCard, Share2, Video,
  BookOpen, HelpCircle, Layers, Fingerprint, PenTool, 
  Palette, Globe, ChevronDown, Smartphone, Clapperboard, ExternalLink, Settings, Mic, MicOff, Menu, Target, ToggleLeft, ToggleRight, RotateCcw, Clock, Trash2, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// --- 1. DATI STATICI ---
const OUTPUT_LANGUAGES = [
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'ko', label: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', label: 'Suomi', flag: '🇫🇮' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'ro', label: 'Română', flag: '🇷🇴' },
];

const SOCIALS = [
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', rules: { ar: '--ar 16:9', textLen: 'professional post', vibe: 'corporate' } },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', rules: { ar: '--ar 4:5', textLen: 'engaging caption', vibe: 'aesthetic' } },
  { id: 'tiktok', name: 'TikTok', icon: Video, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', rules: { ar: '--ar 9:16', textLen: 'viral script', vibe: 'high energy' } },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-600/10', border: 'border-blue-600/20', rules: { ar: '--ar 1:1', textLen: 'community post', vibe: 'friendly' } },
  { id: 'twitter', name: 'X / Twitter', icon: X, color: 'text-zinc-400', bg: 'bg-zinc-800', border: 'border-zinc-700', rules: { ar: '--ar 16:9', textLen: 'short thread', vibe: 'concise' } },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', rules: { ar: '--ar 16:9', textLen: 'video description', vibe: 'informative' } },
  { id: 'pinterest', name: 'Pinterest', icon: ImageIcon, color: 'text-red-600', bg: 'bg-red-600/10', border: 'border-red-600/20', rules: { ar: '--ar 2:3', textLen: 'SEO description', vibe: 'visual' } },
  { id: 'reddit', name: 'Reddit', icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', rules: { ar: '--ar 16:9', textLen: 'discussion starter', vibe: 'authentic' } },
  { id: 'threads', name: 'Threads', icon: Type, color: 'text-zinc-100', bg: 'bg-zinc-900', border: 'border-zinc-700', rules: { ar: '--ar 4:5', textLen: 'quick thought', vibe: 'casual' } },
];

const VISUAL_STYLES = [
  { id: 'corporate', label: 'Corporate', prompt: 'flat vector illustration, corporate memphis style, clean lines' },
  { id: 'lifestyle', label: 'Lifestyle', prompt: 'bright lifestyle photography, candid shot, natural lighting' },
  { id: 'neon', label: 'Neon Tech', prompt: 'futuristic cyberpunk style, neon lighting, dark background, 3d render' },
  { id: 'product', label: 'Product', prompt: 'professional product photography, studio lighting, neutral background' },
  { id: 'cinematic', label: 'Cinematic', prompt: 'cinematic shot, anamorphic lens, dramatic lighting, color graded' },
  { id: 'minimal', label: 'Minimal', prompt: 'minimalist aesthetic, high key lighting, clean composition' },
  { id: 'pixar', label: '3D Toon', prompt: '3d render, pixar style, cute shapes, vibrant colors, octane render' },
  { id: 'fantasy', label: 'Fantasy', prompt: 'epic fantasy art, ethereal atmosphere, magic particles, oil painting' },
  { id: 'analog', label: 'Analog', prompt: 'analog photography, film grain, light leaks, nostalgic 90s style' },
  { id: 'sketch', label: 'Sketch', prompt: 'hand drawn sketch, pencil texture, artistic shading, rough lines' },
];

const MUSIC_GENRES = [
  { id: 'lofi', label: '☕ Lofi', prompt: 'lofi hip hop, chill beats, study, relax' },
  { id: 'pop', label: '🎤 Pop', prompt: 'modern pop, catchy melody, radio hit, upbeat' },
  { id: 'rock', label: '🎸 Rock', prompt: 'classic rock, electric guitar, driving drums, energetic' },
  { id: 'cinematic', label: '🎬 Cinematic', prompt: 'epic orchestral, trailer music, dramatic build up' },
  { id: 'hiphop', label: '🎧 Hip Hop', prompt: 'boom bap, old school hip hop, heavy bass, groove' },
  { id: 'jazz', label: '🎷 Jazz', prompt: 'smooth jazz, saxophone, piano, lounge atmosphere' },
  { id: 'electronic', label: '🎹 Electronic', prompt: 'edm, synthesizer, dance beat, club atmosphere' },
  { id: 'classical', label: '🎻 Classical', prompt: 'classical symphony, piano concerto, elegant, timeless' },
  { id: 'ambient', label: '🌌 Ambient', prompt: 'ambient drone, ethereal textures, meditation, space' },
  { id: 'techno', label: '🤖 Techno', prompt: 'industrial techno, repetitive beat, dark warehouse vibe' },
];

const ASPECT_RATIOS = [
  { label: '1:1', value: '--ar 1:1' },
  { label: '16:9', value: '--ar 16:9' },
  { label: '9:16', value: '--ar 9:16' },
  { label: '4:5', value: '--ar 4:5' },
  { label: '5:4', value: '--ar 5:4' },
  { label: '3:2', value: '--ar 3:2' },
  { label: '2:3', value: '--ar 2:3' },
  { label: '21:9', value: '--ar 21:9' },
];

// --- 2. TRADUZIONI ---
const TRANSLATIONS = {
  it: {
    sidebar: { title: "PIATTAFORMA", info: "INFO", support: "SUPPORTO", goal: "IL TUO OBIETTIVO", goalPlace: "Es. Vendere scarpe, Viralità..." },
    main: { 
      inputTitle: "Argomento", 
      placeholders: {
        text: "Di cosa vuoi parlare nel post?",
        image: "Descrivi l'immagine che vuoi creare...",
        video: "Descrivi la scena del video...",
        audio: "Titolo della canzone o tema del testo..."
      },
      generate: "ATTIVA SINAPSI",
      langLabel: "Lingua Output",
      result: "Output Generato",
      waiting: "Configura a destra e genera",
      history: "Cronologia"
    },
    controls: {
      title: "CONFIGURAZIONE",
      modeLabel: "Modalità Creativa",
      modes: { text: "Testo", image: "Immagini", video: "Video", audio: "Musica" },
      settings: "Impostazioni",
      reset: "RESETTA TUTTO",
      style: "Stile Visivo",
      stylePlaceholder: "O scrivi stile personalizzato...",
      intensity: "Intensità Stile",
      vibe: "Genere Musicale",
      musicDesc: "Dettagli Audio",
      musicPlace: "es. assolo chitarra...",
      vocals: "Tipo Traccia",
      vocalOpts: { inst: "Strumentale", song: "Canzone" },
      tone: "Tono",
      tech: "Complessità",
      intent: "Obiettivo",
      duration: "Durata",
      words: "Lunghezza (Parole)",
      format: "Formato (AR)",
      auto: "Auto (Social)",
      manual: "Manuale",
      levels: {
        tone: ["Molto Formale", "Professionale", "Neutro", "Amichevole", "Informale/Slang"],
        tech: ["Esperto (Jargon)", "Tecnico", "Divulgativo", "Semplice", "Bambino (ELI5)"],
        intent: ["Solo Info", "Educativo", "Storytelling", "Persuasivo", "Vendita Hard"],
        intensity: ["Realistico", "Naturale", "Artistico", "Onirico", "Astratto"]
      }
    },
    actions: { copy: "Copia Prompt" },
    modal: {
      title: "COPIATO!",
      desc: "Prompt negli appunti.",
      subDesc: "Supportaci con una donazione o incolla il prompt (CTRL+V) dove preferisci!",
      close: "CHIUDI"
    },
    resetModal: {
        title: "RESETTARE TUTTO?",
        desc: "Stai per cancellare tutte le impostazioni correnti.",
        confirm: "Sì, Resetta",
        cancel: "Annulla"
    },
    seo: { 
      title: "Prompt Engineering 2.0", 
      p1: "Il tuo centro di comando per l'IA.",
      h1: "Cross-Platform", t1: "9 Social Network.",
      h2: "Zero Data", t2: "Privacy Totale."
    }
  },
  en: {
    sidebar: { title: "PLATFORM", info: "INFO", support: "SUPPORT", goal: "YOUR GOAL", goalPlace: "E.g. Sell shoes, Go viral..." },
    main: { 
      inputTitle: "Topic", 
      placeholders: {
        text: "What do you want to talk about?",
        image: "Describe the image...",
        video: "Describe the video scene...",
        audio: "Song title or lyrical theme..."
      },
      generate: "ACTIVATE SYNAPSE",
      langLabel: "Output Language",
      result: "Generated Output",
      waiting: "Configure on right & generate",
      history: "History"
    },
    controls: {
      title: "CONFIGURATION",
      modeLabel: "Creative Mode",
      modes: { text: "Text", image: "Images", video: "Video", audio: "Music" },
      settings: "Settings",
      reset: "RESET ALL",
      style: "Visual Style",
      stylePlaceholder: "Or type custom style...",
      intensity: "Style Intensity",
      vibe: "Genre",
      musicDesc: "Audio Details",
      musicPlace: "e.g. guitar solo...",
      vocals: "Track Type",
      vocalOpts: { inst: "Instrumental", song: "Song" },
      tone: "Tone",
      tech: "Complexity",
      intent: "Intent",
      duration: "Duration",
      words: "Length (Words)",
      format: "Aspect Ratio",
      auto: "Auto (Social)",
      manual: "Manual",
      levels: {
        tone: ["Very Formal", "Professional", "Neutral", "Friendly", "Casual/Slang"],
        tech: ["Expert", "Technical", "Informative", "Simple", "Child (ELI5)"],
        intent: ["Info Only", "Educational", "Storytelling", "Persuasive", "Hard Sell"],
        intensity: ["Realistic", "Natural", "Artistic", "Dreamlike", "Abstract"]
      }
    },
    actions: { copy: "Copy Prompt" },
    modal: {
      title: "COPIED!",
      desc: "Prompt in clipboard.",
      subDesc: "Support us or paste (CTRL+V) wherever you like!",
      close: "CLOSE"
    },
    resetModal: {
        title: "RESET ALL?",
        desc: "You are about to clear all current settings.",
        confirm: "Yes, Reset",
        cancel: "Cancel"
    },
    seo: { 
      title: "Prompt Engineering 2.0", 
      p1: "Your AI Command Center.",
      h1: "Cross-Platform", t1: "9 Social Networks.",
      h2: "Zero Data", t2: "Total Privacy."
    }
  }
};

// --- 3. HELPER LOGICA ---
const getPromptKeyword = (level, type) => {
  const prompts = {
    tone: ["Strictly Formal", "Professional Corporate", "Neutral Balanced", "Friendly Conversational", "Casual Slang"],
    tech: ["Expert Jargon", "Technical Detailed", "Informative Balanced", "Simple Beginner", "ELI5 Basic"],
    intent: ["Pure Information", "Educational Value", "Engaging Storytelling", "Persuasive Soft-sell", "Hard-sell CTA"],
    intensity: ["Raw Documentary Style", "Balanced Realistic", "Artistic Stylized", "Dreamlike Surreal", "Abstract Avant-garde"]
  };
  return prompts[type][level - 1] || "";
};

// --- COMPONENTS UI ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-3 text-indigo-400 uppercase tracking-widest text-[10px] font-bold px-1 mt-6">
    <Icon size={12} /> {title}
  </div>
);

const StepSlider = ({ label, value, onChange, levelLabels }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase truncate max-w-[100px]">
          {levelLabels[value - 1]}
        </span>
      </div>
      <div className="relative h-4 flex items-center group cursor-pointer">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 rounded-full -translate-y-1/2 group-hover:bg-zinc-700 transition-colors"></div>
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-[2px]">
           {[1, 2, 3, 4, 5].map((step) => (
             <div key={step} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 z-0 ${step <= value ? 'bg-indigo-500' : 'bg-zinc-700'}`}/>
           ))}
        </div>
        <input type="range" min="1" max="5" step="1" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
        <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-indigo-500 rounded-full shadow-lg pointer-events-none transition-all duration-200 z-20" style={{ left: `calc(${((value - 1) / 4) * 100}% - 7px)` }}/>
      </div>
    </div>
  );
};

const RangeSlider = ({ label, value, min, max, unit, onChange }) => (
  <div className="mb-4">
    <div className="flex justify-between items-end mb-1.5">
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
      <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 uppercase">
        {value} {unit}
      </span>
    </div>
    <div className="relative h-4 flex items-center">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 rounded-full -translate-y-1/2 overflow-hidden">
         <div className="h-full bg-indigo-600 transition-all" style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white border-2 border-indigo-500 rounded-full shadow-lg pointer-events-none transition-all" style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 7px)` }} />
    </div>
  </div>
);

const ResultBox = ({ title, content, type, actionLabel, onAction }) => (
  <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 mb-4 relative group hover:border-indigo-500/30 transition-all shadow-lg hover:shadow-indigo-500/5">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          {type === 'text' && <MessageSquare size={14} className="text-indigo-400"/>}
          {type === 'image' && <ImageIcon size={14} className="text-pink-400"/>}
          {type === 'video' && <Clapperboard size={14} className="text-cyan-400"/>}
          {type === 'audio' && <Music size={14} className="text-purple-400"/>}
          {title}
      </div>
      <button onClick={onAction} className="p-1.5 bg-zinc-900/50 hover:bg-indigo-500/20 text-zinc-500 hover:text-indigo-400 rounded-lg transition-all border border-transparent hover:border-indigo-500/30" title="Copia">
        <Copy size={12} />
      </button>
    </div>
    <p className="text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap mb-4 bg-black/20 p-3 rounded-lg border border-white/5">{content}</p>
    <button onClick={onAction} className="w-full py-2.5 bg-zinc-900 hover:bg-indigo-600 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 border border-zinc-800 hover:border-indigo-500">
      <Copy size={12} /> {actionLabel}
    </button>
  </div>
);

// --- COMPONENTE CONTROLLI ---
const ConfigControls = ({ 
  mode, setMode, t, 
  copySettings, setCopySettings, 
  visualStyle, setVisualStyle, 
  customStyle, setCustomStyle, 
  styleIntensity, setStyleIntensity, 
  musicGenre, setMusicGenre, 
  musicDetails, setMusicDetails, 
  isInstrumental, setIsInstrumental,
  wordCount, setWordCount, useCustomWordCount, setUseCustomWordCount,
  aspectRatio, setAspectRatio, useCustomAR, setUseCustomAR,
  duration, setDuration,
  openResetModal
}) => (
    <div className="space-y-5">
        
        {/* RESET BUTTON */}
        <button onClick={openResetModal} className="w-full flex items-center justify-center gap-2 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all mb-4 group">
            <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500"/> {t.controls.reset}
        </button>

        <div className="mb-6">
           <label className="text-[10px] font-bold text-zinc-500 uppercase mb-3 block text-center tracking-widest">{t.controls.modeLabel}</label>
           <div className="grid grid-cols-4 gap-2">
              {Object.entries(t.controls.modes).map(([key, label]) => {
                  const isActive = mode === key;
                  return (
                    <button 
                        key={key} 
                        onClick={() => setMode(key)} 
                        className={`
                            relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-300 group
                            ${isActive 
                                ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] scale-105 z-10' 
                                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 hover:border-zinc-700'}
                        `}
                    >
                        {key === 'text' && <Type size={18} className={isActive ? 'animate-pulse' : ''}/>}
                        {key === 'image' && <ImageIcon size={18} className={isActive ? 'animate-pulse' : ''}/>}
                        {key === 'video' && <Clapperboard size={18} className={isActive ? 'animate-pulse' : ''}/>}
                        {key === 'audio' && <Music size={18} className={isActive ? 'animate-pulse' : ''}/>}
                        <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
                    </button>
                  )
              })}
           </div>
        </div>

        <SectionTitle icon={Settings} title={t.controls.settings} />

        {mode === 'text' && (
            <div className="animate-in fade-in slide-in-from-right-4">
                <StepSlider label={t.controls.tone} value={copySettings.tone} onChange={(v) => setCopySettings({...copySettings, tone: v})} levelLabels={t.controls.levels.tone} />
                <StepSlider label={t.controls.tech} value={copySettings.tech} onChange={(v) => setCopySettings({...copySettings, tech: v})} levelLabels={t.controls.levels.tech} />
                <StepSlider label={t.controls.intent} value={copySettings.intent} onChange={(v) => setCopySettings({...copySettings, intent: v})} levelLabels={t.controls.levels.intent} />
                
                {/* WORD COUNT TOGGLE */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{t.controls.words}</label>
                        <button onClick={() => setUseCustomWordCount(!useCustomWordCount)} className="flex items-center gap-2 text-[9px] font-bold uppercase text-indigo-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 transition-colors hover:border-indigo-500/50">
                            {useCustomWordCount ? <ToggleRight size={16} className="text-indigo-500"/> : <ToggleLeft size={16} className="text-zinc-600"/>}
                            {useCustomWordCount ? t.controls.manual : t.controls.auto}
                        </button>
                    </div>
                    {useCustomWordCount && (
                        <RangeSlider label="" value={wordCount} min={50} max={1000} unit="w" onChange={setWordCount} />
                    )}
                </div>
            </div>
        )}

        {(mode === 'image' || mode === 'video') && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-3">
                {mode === 'image' && (
                    <>
                        <div>
                            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">{t.controls.style}</label>
                            <div className="grid grid-cols-2 gap-1.5 mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {VISUAL_STYLES.map(s => (
                                    <button key={s.id} onClick={() => { setVisualStyle(s); setCustomStyle(''); }} className={`text-left p-1.5 rounded-lg border transition-all ${visualStyle.id === s.id && !customStyle ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}>
                                        <div className="text-[9px] font-bold uppercase truncate">{s.label}</div>
                                    </button>
                                ))}
                            </div>
                            <input type="text" placeholder={t.controls.stylePlaceholder} value={customStyle} onChange={(e) => setCustomStyle(e.target.value)} className="w-full bg-zinc-900 border rounded-lg p-2 text-[10px] text-white outline-none focus:border-indigo-500 border-zinc-800" />
                        </div>
                        <StepSlider label={t.controls.intensity} value={styleIntensity} onChange={(v) => setStyleIntensity(v)} levelLabels={t.controls.levels.intensity} />
                    </>
                )}
                
                {/* VIDEO & IMAGE FORMAT SELECTION WITH TOGGLE */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{t.controls.format}</label>
                        <button onClick={() => setUseCustomAR(!useCustomAR)} className="flex items-center gap-2 text-[9px] font-bold uppercase text-indigo-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800 transition-colors hover:border-indigo-500/50">
                            {useCustomAR ? <ToggleRight size={16} className="text-indigo-500"/> : <ToggleLeft size={16} className="text-zinc-600"/>}
                            {useCustomAR ? t.controls.manual : t.controls.auto}
                        </button>
                    </div>
                    
                    {useCustomAR && (
                        <div className="grid grid-cols-4 gap-1.5 animate-in fade-in slide-in-from-top-2">
                            {ASPECT_RATIOS.map(ar => (
                                <button key={ar.label} onClick={() => setAspectRatio(ar.value)} className={`p-1.5 rounded-lg border text-[9px] font-bold uppercase transition-all ${aspectRatio === ar.value ? 'bg-pink-500/20 border-pink-500 text-pink-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                                    {ar.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                {mode === 'video' && (
                    <RangeSlider label={t.controls.duration} value={duration} min={5} max={120} unit="sec" onChange={setDuration} />
                )}
            </div>
        )}

        {mode === 'audio' && (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-3">
                <RangeSlider label={t.controls.duration} value={duration} min={30} max={300} unit="sec" onChange={setDuration} />
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">{t.controls.vibe}</label>
                    <div className="grid grid-cols-2 gap-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {MUSIC_GENRES.map(a => (
                            <button key={a.id} onClick={() => setMusicGenre(a)} className={`text-left px-2 py-1.5 rounded-md text-[9px] font-bold uppercase border transition-all ${musicGenre.id === a.id ? 'bg-purple-500/20 border-purple-500 text-purple-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                                {a.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase mb-1.5 block">{t.controls.musicDesc}</label>
                    <input type="text" placeholder={t.controls.musicPlace} value={musicDetails} onChange={(e) => setMusicDetails(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] text-white outline-none focus:border-purple-500"/>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button onClick={() => setIsInstrumental(true)} className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded flex items-center justify-center gap-1 ${isInstrumental ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}><MicOff size={10}/> {t.controls.vocalOpts.inst}</button>
                    <button onClick={() => setIsInstrumental(false)} className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded flex items-center justify-center gap-1 ${!isInstrumental ? 'bg-purple-600 text-white' : 'text-zinc-500'}`}><Mic size={10}/> {t.controls.vocalOpts.song}</button>
                </div>
            </div>
        )}
    </div>
);

// --- MAIN PAGE ---
export default function SynapsePost() {
  const [lang, setLang] = useState('it');
  const t = TRANSLATIONS[lang];

  // UI / Data States
  const [activeSocial, setActiveSocial] = useState(SOCIALS[0]);
  const [mode, setMode] = useState('text');
  const [topic, setTopic] = useState('');
  const [userGoal, setUserGoal] = useState('');
  const [outputLang, setOutputLang] = useState(OUTPUT_LANGUAGES[0]);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [results, setResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Settings States
  const [copySettings, setCopySettings] = useState({ tone: 3, tech: 3, intent: 3 });
  const [visualStyle, setVisualStyle] = useState(VISUAL_STYLES[0]);
  const [customStyle, setCustomStyle] = useState('');
  const [styleIntensity, setStyleIntensity] = useState(3);
  const [musicGenre, setMusicGenre] = useState(MUSIC_GENRES[0]);
  const [musicDetails, setMusicDetails] = useState('');
  const [isInstrumental, setIsInstrumental] = useState(true);
  
  // NEW STATES (Toggles)
  const [wordCount, setWordCount] = useState(150);
  const [useCustomWordCount, setUseCustomWordCount] = useState(false); 
  const [aspectRatio, setAspectRatio] = useState('--ar 16:9');
  const [useCustomAR, setUseCustomAR] = useState(false); 
  const [duration, setDuration] = useState(60);

  // History & Modals State
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Mobile Drawers
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileConfigOpen, setIsMobileConfigOpen] = useState(false);

  // --- MEMORY: LOAD & SAVE ---
  useEffect(() => {
    const savedHistory = localStorage.getItem('synapse_history');
    if (savedHistory) { try { setHistory(JSON.parse(savedHistory)); } catch(e) {} }
    
    const savedSettings = localStorage.getItem('synapse_settings');
    if (savedSettings) {
        try {
            const data = JSON.parse(savedSettings);
            if(data.lang) setLang(data.lang);
            if(data.outputLang) {
                const foundLang = OUTPUT_LANGUAGES.find(l => l.code === data.outputLang.code);
                if(foundLang) setOutputLang(foundLang);
            }
            if(data.activeSocial) {
                const foundSocial = SOCIALS.find(s => s.id === data.activeSocial.id);
                if(foundSocial) setActiveSocial(foundSocial);
            }
            if(data.copySettings) setCopySettings(data.copySettings);
            if(data.wordCount) setWordCount(data.wordCount);
            if(data.aspectRatio) setAspectRatio(data.aspectRatio);
        } catch(e) {}
    }
  }, []);

  useEffect(() => {
    const settings = {
        lang, outputLang, activeSocial: { id: activeSocial.id }, copySettings, wordCount, aspectRatio
    };
    localStorage.setItem('synapse_settings', JSON.stringify(settings));
  }, [lang, outputLang, activeSocial, copySettings, wordCount, aspectRatio]);

  // RESET FUNCTION WITH CONFIRMATION
  const confirmReset = () => {
      setCopySettings({ tone: 3, tech: 3, intent: 3 });
      setVisualStyle(VISUAL_STYLES[0]);
      setCustomStyle('');
      setStyleIntensity(3);
      setMusicGenre(MUSIC_GENRES[0]);
      setMusicDetails('');
      setIsInstrumental(true);
      setWordCount(150);
      setUseCustomWordCount(false);
      setAspectRatio('--ar 16:9');
      setUseCustomAR(false);
      setDuration(60);
      setTopic('');
      setUserGoal('');
      setResults(null);
      setShowResetModal(false);
  };

  // ADD TO HISTORY FUNCTION
  const addToHistory = (resultObj) => {
      const newItem = { 
          id: Date.now(), 
          timestamp: new Date().toLocaleTimeString(), 
          mode: mode,
          topic: topic,
          content: resultObj
      };
      const newHistory = [newItem, ...history].slice(0, 5); 
      setHistory(newHistory);
      localStorage.setItem('synapse_history', JSON.stringify(newHistory));
  };

  const restoreHistory = (item) => {
      setTopic(item.topic);
      setMode(item.mode);
      setResults(item.content);
      setShowHistoryModal(false);
  };

  // GENERATE LOGIC
  const handleGenerate = () => {
    if (!topic) return;
    setIsGenerating(true);
    setIsMobileConfigOpen(false); 
    setTimeout(() => {
      const socialRules = activeSocial.rules;
      const currentStyle = customStyle || visualStyle.prompt;
      const stylizeVal = styleIntensity * 200; 
      
      const toneKw = getPromptKeyword(copySettings.tone, 'tone');
      const techKw = getPromptKeyword(copySettings.tech, 'tech');
      const intentKw = getPromptKeyword(copySettings.intent, 'intent');
      const styleKw = getPromptKeyword(styleIntensity, 'intensity');

      const textLength = useCustomWordCount ? `approx ${wordCount} words` : socialRules.textLen;
      const activeAR = useCustomAR ? aspectRatio : socialRules.ar;
      const cleanAR = activeAR.replace('--ar ', '');

      const textPrompt = `Act as an expert Social Media Manager for ${activeSocial.name}. 
Goal of the User: "${userGoal}".
Topic: "${topic}".
Output Language: ${outputLang.label} (${outputLang.code}).
Target Length: ${textLength}.
Tone: ${toneKw}, Complexity: ${techKw}, Intent: ${intentKw}.
Optimize for ${activeSocial.name} algorithm (hashtags, formatting, spacing).`;

      const imgPrompt = `/imagine prompt: ${currentStyle}, subject: ${topic}, Vibe: ${styleKw}, optimized for ${activeSocial.name}, ${activeAR} --v 6.0 --stylize ${stylizeVal}`;
      const vocals = isInstrumental ? 'instrumental' : 'vocals, song with lyrics';
      const audioPrompt = `Song about ${topic}, ${musicGenre.prompt}, ${musicDetails}, ${vocals}, ${socialRules.vibe} mood, Duration: ${duration} seconds`;
      const videoPrompt = `Cinematic video of ${topic}, style: ${currentStyle}, Atmosphere: ${styleKw}, audio: ${musicGenre.prompt}, Duration: ${duration}s, 4k resolution, Aspect Ratio: ${cleanAR}`;

      const res = { text: textPrompt, image: imgPrompt, audio: audioPrompt, video: videoPrompt };
      setResults(res);
      addToHistory(res);
      setIsGenerating(false);
    }, 800);
  };

  const handleCopyAndShowModal = async (content) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
        setShowCopyModal(true);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = content;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setShowCopyModal(true);
      } catch (err) {
        alert("Impossibile copiare automaticamente.");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      
      {/* MOBILE HEADER */}
      <header className="h-14 border-b border-white/5 bg-zinc-950 flex items-center justify-between px-4 z-50 shrink-0 lg:hidden">
        <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-zinc-400 hover:text-white"><Menu size={20}/></button>
            <Link href="/" className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center"><ArrowLeft size={16}/></Link>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">DIGITRIK</span>
                <span className="text-[10px] font-bold text-white leading-none truncate max-w-[100px] mt-0.5">{activeSocial.name}</span>
            </div>
        </div>
        <button onClick={() => setIsMobileConfigOpen(true)} className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-indigo-400"><Settings size={18}/></button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT SIDEBAR */}
        <aside className={`fixed inset-0 z-[60] lg:static lg:z-auto bg-zinc-950/95 backdrop-blur-xl lg:bg-zinc-950 w-full lg:w-64 border-r border-white/5 flex flex-col p-4 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="text-lg font-bold text-white">Menu</h3>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-zinc-900 rounded-full"><X size={18}/></button>
            </div>
            
            {/* Desktop Header Logo */}
            <div className="mb-6 px-2 items-center gap-2 hidden lg:flex">
              <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-indigo-600/20 rounded-lg flex items-center justify-center transition-colors group"><ArrowLeft size={18} className="text-zinc-400 group-hover:text-indigo-400" /></Link>
              <div className="flex flex-col"><h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK</h1><span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] leading-none mt-1">SYNAPSE</span></div>
            </div>

            {/* USER GOAL INPUT */}
            <div className="mb-4">
               <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block px-1"><Target size={10} className="inline mr-1"/> {t.sidebar.goal}</label>
               <input type="text" value={userGoal} onChange={(e) => setUserGoal(e.target.value)} placeholder={t.sidebar.goalPlace} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-indigo-500/50 transition-all"/>
            </div>

            <div className="flex bg-zinc-900 rounded-lg p-1 mb-6 border border-zinc-800 shrink-0">
                <button onClick={() => setLang('it')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'it' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>IT</button>
                <button onClick={() => setLang('en')} className={`flex-1 py-1 text-[10px] font-bold uppercase rounded ${lang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500'}`}>EN</button>
            </div>

            <div className="text-[10px] font-bold text-zinc-500 uppercase mb-4 px-2">{t.sidebar.title}</div>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {SOCIALS.map(s => {
                    const Icon = s.icon;
                    const active = activeSocial.id === s.id;
                    return (
                    <button key={s.id} onClick={() => { setActiveSocial(s); setResults(null); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all border group ${active ? `bg-zinc-900 ${s.border} ${s.color} shadow-lg` : 'border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
                        <div className={`p-1.5 rounded-lg ${active ? s.bg : 'bg-zinc-800 group-hover:bg-zinc-700'}`}><Icon size={16} /></div>
                        <span className="text-xs font-bold">{s.name}</span>
                        {active && <Check size={14} className="ml-auto"/>}
                    </button>
                    )
                })}
            </div>
            
            <div className="mt-4 space-y-2 lg:block">
                <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 text-zinc-400 hover:text-white text-xs font-bold uppercase"><Info size={16}/> {t.sidebar.info}</button>
                <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-green-900/10 text-green-400 hover:text-green-300 text-xs font-bold uppercase"><Heart size={16}/> {t.sidebar.support}</button>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col relative bg-zinc-900/50 overflow-hidden">
            
            <header className="hidden lg:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
               <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  {activeSocial.name} <span className="text-zinc-600">/</span> <span className="text-indigo-400">{t.controls.modes[mode]}</span>
               </h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-24 lg:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="max-w-3xl mx-auto">
                    
                    {/* INPUT SECTION */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{t.main.inputTitle}</label>
                            <div className="relative hidden lg:flex items-center gap-3">
                                <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white transition-all uppercase hover:bg-zinc-800"><Clock size={12} className="text-indigo-400"/> {t.main.history}</button>
                                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300 hover:text-white transition-all uppercase"><Globe size={12} className="text-indigo-400"/> {t.main.langLabel}: <span className="text-white">{outputLang.flag} {outputLang.code.toUpperCase()}</span> <ChevronDown size={10}/></button>
                                {isLangMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto p-1 grid grid-cols-1 gap-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {OUTPUT_LANGUAGES.map(l => (
                                            <button key={l.code} onClick={() => { setOutputLang(l); setIsLangMenuOpen(false); }} className={`flex items-center gap-3 w-full px-3 py-2 text-left text-xs rounded-lg hover:bg-zinc-800 transition-colors ${outputLang.code === l.code ? 'bg-indigo-900/20 text-indigo-400' : 'text-zinc-400'}`}>
                                                <span className="text-base">{l.flag}</span> <span className="font-medium">{l.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative group">
                            <input type="text" value={topic} onChange={e => setTopic(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleGenerate()} placeholder={t.main.placeholders[mode]} className="w-full bg-zinc-950 border border-white/10 rounded-2xl p-4 pl-5 text-base text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-xl group-hover:border-white/20"/>
                            <button onClick={handleGenerate} disabled={!topic || isGenerating} className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg">
                                {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/> : <Zap size={16} fill="currentColor"/>} <span className="hidden sm:inline">{t.main.generate}</span>
                            </button>
                        </div>
                        {/* Mobile Lang & History Picker */}
                        <div className="lg:hidden mt-3 flex justify-between">
                             <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900"><Clock size={10}/> {t.main.history}</button>
                             <div className="relative">
                                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 border border-zinc-800 px-3 py-1 rounded-full bg-zinc-900"><Globe size={10}/> {outputLang.flag} {outputLang.code.toUpperCase()} <ChevronDown size={10}/></button>
                                {isLangMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto p-1 grid grid-cols-1 gap-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                        {OUTPUT_LANGUAGES.map(l => (
                                            <button key={l.code} onClick={() => { setOutputLang(l); setIsLangMenuOpen(false); }} className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs rounded-lg hover:bg-zinc-800 text-zinc-400"><span>{l.flag}</span> <span>{l.label}</span></button>
                                        ))}
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>

                    {/* RESULTS */}
                    {results ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-green-500 uppercase tracking-widest flex items-center gap-2"><Wand2 size={14}/> {t.main.result}</span></div>
                            {mode === 'text' && <ResultBox title="Prompt Copywriting" content={results.text} type="text" actionLabel={t.actions.copy} onAction={() => handleCopyAndShowModal(results.text)} />}
                            {mode === 'image' && <ResultBox title="Prompt Immagine" content={results.image} type="image" actionLabel={t.actions.copy} onAction={() => handleCopyAndShowModal(results.image)} />}
                            {mode === 'audio' && <ResultBox title="Prompt Musica" content={results.audio} type="audio" actionLabel={t.actions.copy} onAction={() => handleCopyAndShowModal(results.audio)} />}
                            {mode === 'video' && <ResultBox title="Prompt Video" content={results.video} type="video" actionLabel={t.actions.copy} onAction={() => handleCopyAndShowModal(results.video)} />}
                        </div>
                    ) : (
                        <div className="h-48 flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl p-8 bg-zinc-950/30">
                            <Smartphone size={24} className="opacity-50 mb-3"/>
                            <p className="text-xs font-bold uppercase text-center">{t.main.waiting}</p>
                        </div>
                    )}

                    {/* SEO FOOTER */}
                    <div className="mt-16 pt-12 border-t border-white/5 text-zinc-400">
                        <div className="flex items-center gap-2 mb-6"><BookOpen size={20} className="text-indigo-500"/><h2 className="text-2xl font-black text-white tracking-tight">{t.seo.title}</h2></div>
                        <p className="leading-relaxed mb-8 text-zinc-300 text-sm">{t.seo.p1}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5"><h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Layers size={16} className="text-indigo-500"/> {t.seo.h1}</h3><p className="text-xs text-zinc-400">{t.seo.t1}</p></div>
                            <div className="bg-zinc-900/10 p-6 rounded-2xl border border-indigo-500/10"><h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Fingerprint size={16} className="text-indigo-500"/> {t.seo.h2}</h3><p className="text-xs text-zinc-400">{t.seo.t2}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        {/* RIGHT CONFIG SIDEBAR */}
        <aside className={`absolute lg:static inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl lg:bg-zinc-950 w-full lg:w-80 border-l border-white/5 flex flex-col p-6 transition-transform duration-300 ${isMobileConfigOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-6 lg:hidden">
                <h3 className="text-lg font-bold text-white">{t.controls.title}</h3>
                <button onClick={() => setIsMobileConfigOpen(false)} className="p-2 bg-zinc-900 rounded-full"><X size={18}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <ConfigControls 
                    mode={mode} setMode={setMode} t={t}
                    copySettings={copySettings} setCopySettings={setCopySettings}
                    visualStyle={visualStyle} setVisualStyle={setVisualStyle}
                    customStyle={customStyle} setCustomStyle={setCustomStyle}
                    styleIntensity={styleIntensity} setStyleIntensity={setStyleIntensity}
                    musicGenre={musicGenre} setMusicGenre={setMusicGenre}
                    musicDetails={musicDetails} setMusicDetails={setMusicDetails}
                    isInstrumental={isInstrumental} setIsInstrumental={setIsInstrumental}
                    wordCount={wordCount} setWordCount={setWordCount}
                    useCustomWordCount={useCustomWordCount} setUseCustomWordCount={setUseCustomWordCount}
                    aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
                    useCustomAR={useCustomAR} setUseCustomAR={setUseCustomAR}
                    duration={duration} setDuration={setDuration}
                    openResetModal={() => setShowResetModal(true)}
                />
            </div>
            <button onClick={() => setIsMobileConfigOpen(false)} className="mt-4 w-full py-3 bg-indigo-600 text-white font-bold uppercase rounded-xl lg:hidden">Fatto</button>
        </aside>

      </div>

      {/* --- MODALS --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#0a0a0a] border border-red-500/30 rounded-[2rem] w-full max-w-sm p-6 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"/>
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 relative z-10"><AlertTriangle size={24} /></div>
                <h3 className="text-xl font-black italic text-white uppercase mb-2 relative z-10">{t.resetModal.title}</h3>
                <p className="text-zinc-400 text-xs mb-6 leading-relaxed relative z-10">{t.resetModal.desc}</p>
                <div className="flex gap-3 relative z-10">
                    <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase rounded-xl text-xs transition-colors">{t.resetModal.cancel}</button>
                    <button onClick={confirmReset} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase rounded-xl text-xs transition-colors">{t.resetModal.confirm}</button>
                </div>
            </div>
        </div>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-full max-w-md max-h-[80vh] flex flex-col relative shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-zinc-950/50 flex items-center justify-between">
                    <h3 className="text-xl font-black italic text-white uppercase flex items-center gap-2"><Clock size={20} className="text-indigo-500"/> {t.main.history}</h3>
                    <button onClick={() => setShowHistoryModal(false)}><X size={20} className="text-zinc-500 hover:text-white"/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                    {history.length === 0 && <p className="text-zinc-500 text-sm text-center py-8">Nessuna cronologia recente.</p>}
                    {history.map(item => (
                        <button key={item.id} onClick={() => restoreHistory(item)} className="w-full text-left bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all group">
                            <div className="flex justify-between mb-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.timestamp}</span>
                                <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">{item.mode}</span>
                            </div>
                            <p className="text-sm text-white font-medium truncate">{item.topic}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {showCopyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-full max-w-sm p-6 text-center shadow-2xl">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500"><Check size={24} /></div>
            <h3 className="text-xl font-black italic text-white uppercase mb-2">{t.modal.title}</h3>
            <p className="text-zinc-400 text-xs mb-6 leading-relaxed">{t.modal.desc}<br/>{t.modal.subDesc}</p>
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 mb-6">
                <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold uppercase text-[10px] tracking-widest mb-3"><Heart size={12} className="animate-pulse"/> Supporta Digitrik</div>
                <div className="flex gap-2 justify-center">{['1', '2', '5'].map(a => (<a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="px-4 py-2 rounded-lg bg-zinc-950 border border-zinc-700 hover:border-green-500 text-white font-bold text-xs transition-all hover:text-green-400 hover:bg-green-900/10">{a}€</a>))}</div>
            </div>
            <button onClick={() => setShowCopyModal(false)} className="w-full py-3 bg-white text-black font-bold uppercase rounded-xl text-xs hover:bg-zinc-200 transition-colors">{t.modal.close}</button>
          </div>
        </div>
      )}

      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-full max-w-sm relative shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-zinc-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-zinc-800 p-2 rounded-full text-white"><Info size={20} /></div><h3 className="text-lg font-black italic text-white uppercase">{t.sidebar.info}</h3></div>
                <button onClick={() => setShowInfoModal(false)}><X size={20} className="text-zinc-500"/></button>
            </div>
            <div className="p-6 text-sm text-zinc-400 leading-relaxed">Digitrik Synapse democratizza l'accesso all'IA avanzata. Niente prompt engineering complesso, solo creatività pura.</div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in p-4">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-full max-w-sm relative">
            <div className="p-6 border-b border-white/5 bg-zinc-950/50 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="bg-green-500/10 p-2 rounded-full text-green-500"><Coffee size={20} /></div><h3 className="text-lg font-black italic text-white uppercase">{t.sidebar.support}</h3></div>
                <button onClick={() => setShowSupportModal(false)}><X size={20} className="text-zinc-500"/></button>
            </div>
            <div className="p-6 space-y-4">
                <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-center"><h4 className="text-green-400 font-bold uppercase text-xs mb-3 flex items-center justify-center gap-2"><CreditCard size={14}/> Donazione</h4><div className="flex justify-center gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-2 px-4 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div></div>
                <button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed flex items-center justify-center gap-2"><Share2 size={14}/> Condividi (Presto)</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}