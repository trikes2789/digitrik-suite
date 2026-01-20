'use client';

import React, { useState } from 'react';
import { 
  Zap, MessageSquare, Image as ImageIcon, Music, 
  Copy, ExternalLink, Wand2, Terminal, 
  Cpu, Rocket, Feather, Ghost, Palette, 
  Info, Heart, Coffee, Check, ArrowLeft, BookOpen, Layers,
  SlidersHorizontal, Network, Share2, Activity
} from 'lucide-react';
import Link from 'next/link';

// --- 1. DATABASE STILI ---
const STYLES = [
  {
    id: 'minimal',
    label: 'Minimal Zen',
    icon: Feather,
    desc: 'Essenziale, pulito, business.',
    basePrompt: "Minimalist aesthetic, clean lines, high key lighting, uncluttered composition, sophisticated simplicity"
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk Grit',
    icon: Cpu,
    desc: 'Neon, high-tech, notturno.',
    basePrompt: "Cyberpunk style, neon lights, wet pavement, futuristic technology, dystopic atmosphere, cinematic lighting"
  },
  {
    id: 'pixar',
    label: '3D Magic',
    icon: Rocket,
    desc: 'Stile animazione, dolce, colorato.',
    basePrompt: "3D render, Pixar movie style, cute shapes, vibrant colors, soft lighting, expressive features, octane render"
  },
  {
    id: 'fantasy',
    label: 'Epic Fantasy',
    icon: Ghost,
    desc: 'Magico, antico, dettagliato.',
    basePrompt: "Epic fantasy art, dungeons and dragons style, ethereal atmosphere, magic particles, majestic composition, oil painting style"
  },
  {
    id: 'cinematic',
    label: 'Hollywood 4K',
    icon: Activity,
    desc: 'Drammatico, film, fotorealistico.',
    basePrompt: "Cinematic shot, movie scene, anamorphic lens, bokeh, color graded, dramatic lighting, 8k resolution, highly detailed"
  }
];

// --- 2. LOGICA MOOD (IL CERVELLO) ---
const getMoodKeywords = (intensity, time, reality) => {
  let keywords = [];

  // Slider 1: Intensità (Calmo <-> Elettrico)
  if (intensity < 30) keywords.push("calm, soft, pastel colors, soothing, gentle, slow pace, low contrast");
  else if (intensity > 70) keywords.push("electric, intense, high contrast, dynamic action, bold colors, heavy impact, energetic");

  // Slider 2: Epoca (Antico <-> Futuro)
  if (time < 30) keywords.push("ancient, vintage, retro aesthetic, rustic textures, nostalgia, 1950s style, weathered");
  else if (time > 70) keywords.push("futuristic, sci-fi, high-tech, next-gen, year 2099, holographic, advanced materials");

  // Slider 3: Realismo (Onirico <-> Reale)
  if (reality < 30) keywords.push("abstract, surreal, dreamlike, distorted, artistic sketch, stylized, painterly");
  else if (reality > 70) keywords.push("hyper-realistic, photorealistic, 8k, sharp focus, macro photography, ray tracing, unreal engine 5");

  return keywords.join(", ");
};

// --- TRADUZIONI ---
const TRANSLATIONS = {
  it: {
    title: "SYNAPSE",
    subtitle: "AI Prompt Engine",
    steps: {
      1: "1. L'Input (Il Soggetto)",
      2: "2. Lo Stile (Il Mood)",
      3: "3. La Calibrazione (Il Tono)"
    },
    inputPlaceholder: "es. Un astronauta che beve caffè su Marte...",
    generateBtn: "ATTIVA SINAPSI",
    resultTitle: "Output Neurale Generato",
    copyGo: "Copia e Vai su",
    copied: "Copiato!",
    sliders: {
      intensity: { label: "Energia", left: "Calma", right: "Elettrica" },
      time: { label: "Timeline", left: "Passato", right: "Futuro" },
      reality: { label: "Realtà", left: "Sogno", right: "Foto" }
    },
    sections: {
      text: "Copywriting (Testo)",
      visual: "Visual Art (Immagini)",
      audio: "Soundscape (Audio)"
    },
    seo: {
      title: "Prompt Engineering Semplificato",
      p1: "Digitrik Synapse è il ponte tra la tua immaginazione e l'Intelligenza Artificiale. Non serve essere esperti: tu metti l'idea, Synapse calcola i parametri tecnici.",
      p2: "Il sistema genera prompt ottimizzati multipiattaforma (ChatGPT, Midjourney, Suno) garantendo coerenza stilistica e massima qualità dell'output."
    }
  }
};

// --- COMPONENTI UI ---
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-indigo-400 uppercase tracking-widest text-[10px] font-bold px-2">
    <Icon size={14} />
    {title}
  </div>
);

const MoodSlider = ({ label, left, right, value, onChange }) => (
  <div className="mb-6 group">
    <div className="flex justify-between items-end mb-2">
      <span className="text-[10px] font-bold text-zinc-500 uppercase group-hover:text-zinc-400 transition-colors">{left}</span>
      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
        {label} <span className="text-zinc-600 font-mono">[{value}%]</span>
      </span>
      <span className="text-[10px] font-bold text-zinc-500 uppercase group-hover:text-zinc-400 transition-colors">{right}</span>
    </div>
    <div className="relative h-2 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-indigo-500/30 transition-colors">
      <div 
        className="absolute top-0 left-0 h-full bg-indigo-600 rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
        style={{ width: `${value}%` }}
      />
      <input 
        type="range" min="0" max="100" value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-100 rounded-full shadow-lg pointer-events-none transition-all duration-150 border-2 border-indigo-500 z-0"
        style={{ left: `calc(${value}% - 8px)` }}
      />
    </div>
  </div>
);

const ResultCard = ({ title, icon: Icon, prompt, links, t }) => {
  const [copied, setCopied] = useState(false);

  const handleSmartAction = (url) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if(url) window.open(url, '_blank');
  };

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-lg hover:shadow-indigo-900/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20"><Icon size={18}/></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      
      <div className="bg-black/40 rounded-xl p-4 border border-white/5 mb-6 relative min-h-[80px]">
        <p className="text-xs text-zinc-400 font-mono leading-relaxed break-words">{prompt}</p>
        <button 
          onClick={() => handleSmartAction()}
          className="absolute top-2 right-2 p-2 bg-zinc-800/80 text-zinc-400 rounded-lg hover:text-white transition-colors backdrop-blur-sm"
          title="Copia solo testo"
        >
          {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {links.map((link, i) => (
          <button 
            key={i}
            onClick={() => handleSmartAction(link.url)}
            className="flex-1 py-3 px-4 bg-zinc-900 hover:bg-indigo-600 hover:text-white text-zinc-400 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-zinc-800 hover:border-indigo-500 shadow-sm"
          >
            {t.copyGo} {link.name} <ExternalLink size={12}/>
          </button>
        ))}
      </div>
    </div>
  );
};

export default function Synapse() {
  const t = TRANSLATIONS.it;
  
  const [subject, setSubject] = useState('');
  const [activeStyle, setActiveStyle] = useState(STYLES[0]);
  const [moods, setMoods] = useState({ intensity: 50, time: 50, reality: 50 });
  const [results, setResults] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleGenerate = () => {
    if (!subject) return;
    setIsGenerating(true);
    
    // Simula elaborazione neurale
    setTimeout(() => {
      const cleanSubject = subject.trim();
      const moodParams = getMoodKeywords(moods.intensity, moods.time, moods.reality);
      
      const finalImagePrompt = `/imagine prompt: ${cleanSubject}, ${activeStyle.basePrompt}, ${moodParams} --v 6.0`;
      
      const finalTextPrompt = `Act as a professional creative writer. Topic: ${cleanSubject}. Tone & Style: ${activeStyle.basePrompt}. Vibe settings: ${moodParams}. Write a compelling description, article or short story based on this.`;
      
      const finalAudioPrompt = `${activeStyle.basePrompt}, ${moodParams}, ${cleanSubject} theme`;

      setResults({
        text: finalTextPrompt,
        image: finalImagePrompt,
        audio: finalAudioPrompt,
      });
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="min-h-screen lg:h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col lg:flex-row lg:overflow-hidden selection:bg-indigo-500/30">
      
      {/* SIDEBAR SINISTRA */}
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 bg-zinc-950 flex flex-col p-4 z-20 shrink-0">
        <div className="mb-8 px-2 flex items-center gap-2">
          <Link href="/" className="w-8 h-8 bg-zinc-800/50 hover:bg-indigo-600/20 rounded-lg flex items-center justify-center transition-colors group">
            <ArrowLeft size={18} className="text-zinc-400 group-hover:text-indigo-400" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-black italic tracking-tighter text-white leading-none">DIGITRIK PRO</h1>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] leading-none mt-1">{t.title}</span>
          </div>
        </div>

        <SectionTitle icon={Palette} title={t.steps[2]} />
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 mb-6 lg:mb-0">
          {STYLES.map(style => (
            <button 
              key={style.id} 
              onClick={() => setActiveStyle(style)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 group relative overflow-hidden ${activeStyle.id === style.id ? 'bg-indigo-900/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-zinc-900/30 border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'}`}
            >
              {activeStyle.id === style.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
              <div className={`p-2 rounded-lg ${activeStyle.id === style.id ? 'bg-indigo-500 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:text-zinc-400'}`}>
                <style.icon size={18} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold uppercase tracking-wide">{style.label}</h4>
                <p className="text-[9px] opacity-60 truncate">{style.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto space-y-1 hidden lg:block">
            <button onClick={() => setShowInfoModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all text-xs font-bold uppercase tracking-wide group"><Info size={16} className="group-hover:text-indigo-400"/> INFO</button>
            <button onClick={() => setShowSupportModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl text-green-600/80 hover:text-green-400 hover:bg-green-900/10 transition-all text-xs font-bold uppercase tracking-wide group"><Heart size={16} className="group-hover:scale-110 transition-transform"/> SUPPORTO</button>
        </div>
      </aside>

      {/* AREA CENTRALE */}
      <main className="flex-1 flex flex-col relative bg-zinc-900/50 h-auto lg:h-full lg:overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
               <Network size={16} className="text-indigo-500"/> {activeStyle.label} <span className="text-zinc-600">/</span> {t.subtitle}
            </h2>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-y-visible lg:overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
            <div className="max-w-4xl mx-auto flex flex-col gap-8 pb-20">
                
                {/* 1. INPUT & SLIDERS CARD */}
                <div className="bg-zinc-950 border border-white/5 p-6 lg:p-8 rounded-[2rem] shadow-sm animate-in slide-in-from-bottom-4">
                    
                    {/* INPUT */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                            <Terminal size={16}/> {t.steps[1]}
                        </label>
                        <input 
                            type="text" 
                            placeholder={t.inputPlaceholder} 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white text-lg focus:border-indigo-500 transition-all outline-none placeholder:text-zinc-700 shadow-inner"
                        />
                    </div>

                    {/* SLIDERS */}
                    <div className="bg-black/20 rounded-xl p-6 border border-white/5">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 block flex items-center gap-2">
                            <SlidersHorizontal size={16}/> {t.steps[3]}
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MoodSlider 
                                label={t.sliders.intensity.label} 
                                left={t.sliders.intensity.left} 
                                right={t.sliders.intensity.right} 
                                value={moods.intensity} 
                                onChange={(v) => setMoods({...moods, intensity: v})}
                            />
                            <MoodSlider 
                                label={t.sliders.time.label} 
                                left={t.sliders.time.left} 
                                right={t.sliders.time.right} 
                                value={moods.time} 
                                onChange={(v) => setMoods({...moods, time: v})}
                            />
                            <MoodSlider 
                                label={t.sliders.reality.label} 
                                left={t.sliders.reality.left} 
                                right={t.sliders.reality.right} 
                                value={moods.reality} 
                                onChange={(v) => setMoods({...moods, reality: v})}
                            />
                        </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleGenerate}
                            disabled={!subject || isGenerating}
                            className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 hover:shadow-indigo-900/50"
                        >
                            {isGenerating ? <Zap className="animate-spin" size={18}/> : <Zap size={18} fill="currentColor"/>} {t.generateBtn}
                        </button>
                    </div>
                </div>

                {/* 2. RESULTS SECTION */}
                {results && (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex items-center gap-4 my-2">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{t.resultTitle}</span>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>

                        {/* Text */}
                        <ResultCard 
                            title={t.sections.text} 
                            icon={MessageSquare} 
                            prompt={results.text} 
                            t={t}
                            links={[
                                { name: 'ChatGPT', url: 'https://chat.openai.com/' },
                                { name: 'Claude', url: 'https://claude.ai/' },
                                { name: 'Gemini', url: 'https://gemini.google.com/' },
                            ]}
                        />

                        {/* Image */}
                        <ResultCard 
                            title={t.sections.visual} 
                            icon={ImageIcon} 
                            prompt={results.image} 
                            t={t}
                            links={[
                                { name: 'Midjourney', url: 'https://discord.com/channels/@me' },
                                { name: 'DALL-E', url: 'https://chat.openai.com/' },
                            ]}
                        />

                        {/* Audio */}
                        <ResultCard 
                            title={t.sections.audio} 
                            icon={Music} 
                            prompt={results.audio} 
                            t={t}
                            links={[
                                { name: 'Suno', url: 'https://suno.com/' },
                                { name: 'Udio', url: 'https://www.udio.com/' },
                            ]}
                        />
                    </div>
                )}

                {/* SEO */}
                <div className="mt-8 pt-12 border-t border-white/5 text-zinc-400">
                    <div className="flex items-center gap-2 mb-6">
                        <BookOpen size={20} className="text-indigo-500"/>
                        <h2 className="text-2xl font-black text-white tracking-tight">{t.seo.title}</h2>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <p className="leading-relaxed mb-8 text-zinc-300">{t.seo.p1}</p>
                        <div className="bg-indigo-900/10 p-6 rounded-2xl border border-indigo-500/10">
                            <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2"><Layers size={16}/> Multimodale</h3>
                            <p className="text-xs leading-relaxed text-indigo-100/70">{t.seo.p2}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </main>

      {/* MODALS */}
      {showInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-[2rem] w-[90%] max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-zinc-800 p-3 rounded-full text-white"><Info size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">Info & Support</h3></div><button onClick={() => setShowInfoModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={20} /></button></div>
            <div className="p-8 space-y-6">
                <div><div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold uppercase text-xs tracking-wider"><Heart size={14} /> Mission</div><p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">Digitrik Synapse democratizza l'accesso all'IA avanzata. Niente prompt engineering complesso, solo creatività pura.</p></div>
            </div>
          </div>
        </div>
      )}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2rem] w-[90%] max-w-2xl overflow-hidden relative">
            <div className="p-8 border-b border-white/5 bg-zinc-950/50 flex items-center gap-3"><div className="bg-green-500/10 p-3 rounded-full text-green-500"><Coffee size={24} /></div><div><h3 className="text-xl font-black italic text-white uppercase">Supportaci</h3></div><button onClick={() => setShowSupportModal(false)} className="absolute top-8 right-8 text-gray-600 hover:text-white"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 border-r border-white/5 space-y-4"><h4 className="text-green-400 font-bold uppercase text-xs flex gap-2"><CreditCard size={14}/> Donazione</h4><div className="grid grid-cols-3 gap-2">{['1', '2', '5'].map(a => <a key={a} href={`https://www.paypal.me/triches89/${a}`} target="_blank" className="py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-center font-bold hover:border-green-500 hover:text-green-400 transition-all">{a}€</a>)}</div></div><div className="p-8 space-y-4 bg-zinc-950/30"><h4 className="text-indigo-400 font-bold uppercase text-xs flex gap-2"><Share2 size={14}/> Condividi</h4><button disabled className="w-full py-3 border border-zinc-800 rounded-xl text-zinc-500 text-xs font-bold uppercase cursor-not-allowed">Presto Disponibile</button></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}