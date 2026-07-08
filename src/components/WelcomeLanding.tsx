import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Briefcase, 
  Laptop, 
  Landmark, 
  Star, 
  Lightbulb, 
  User, 
  ArrowLeftRight, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Globe,
  ChevronDown,
  MessageCircle
} from 'lucide-react';
import { Language, getTranslation } from '../translations';
import { LANGUAGES_LIST } from './Header';

interface WelcomeLandingProps {
  onEnter: () => void;
  setActiveTab: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function WelcomeLanding({ onEnter, setActiveTab, language, onLanguageChange }: WelcomeLandingProps) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLangVisual = (lang: Language) => {
    switch (lang) {
      case 'en': return 'AA';
      case 'hi': return 'अ';
      case 'or': return 'ଅଅ';
    }
  };

  // Helper function to handle badge click (teleports user directly inside targeted page)
  const handleBadgeClick = (tabId: string) => {
    setActiveTab(tabId);
    onEnter();
  };

  const categories = [
    {
      id: 'fresher',
      title: getTranslation('cat_fresher', language),
      icon: GraduationCap,
      color: 'from-blue-600/35 to-blue-500/15',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.55)]',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-400',
      positionClasses: 'top-[3%] left-[2%] sm:top-[6%] sm:left-[3%] md:top-[8%] md:left-[4%] xl:top-[8%] xl:left-[6%]',
      tilt: 'rotate-x-12 rotate-y-6 -rotate-2',
      tabId: 'jobs'
    },
    {
      id: 'school_student',
      title: getTranslation('cat_schoolStudent', language),
      icon: GraduationCap,
      color: 'from-emerald-600/35 to-indigo-500/15',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.55)]',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-100',
      iconColor: 'text-emerald-400',
      positionClasses: 'top-[3%] right-[2%] sm:top-[6%] sm:right-[3%] md:top-[8%] md:right-[4%] xl:top-[8%] xl:right-[6%]',
      tilt: '-rotate-x-12 -rotate-y-6 rotate-2',
      tabId: 'syllabus'
    },
    {
      id: 'job_seeker',
      title: getTranslation('cat_jobSeeker', language),
      icon: Briefcase,
      color: 'from-purple-600/35 to-purple-500/15',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)]',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-100',
      iconColor: 'text-purple-400',
      positionClasses: 'top-[16%] left-[1%] sm:top-[19%] sm:left-[2%] md:top-[21%] md:left-[3%] xl:top-[22%] xl:left-[4%]',
      tilt: 'rotate-x-6 rotate-y-12 -rotate-3',
      tabId: 'jobs'
    },
    {
      id: 'career_changer',
      title: getTranslation('cat_careerChanger', language),
      icon: ArrowLeftRight,
      color: 'from-fuchsia-600/35 to-purple-500/15',
      glow: 'shadow-[0_0_15px_rgba(217,70,239,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.55)]',
      borderColor: 'border-fuchsia-500/30',
      textColor: 'text-fuchsia-100',
      iconColor: 'text-fuchsia-400',
      positionClasses: 'top-[16%] right-[1%] sm:top-[19%] sm:right-[2%] md:top-[21%] md:right-[3%] xl:top-[22%] xl:right-[4%]',
      tilt: '-rotate-x-6 -rotate-y-12 rotate-3',
      tabId: 'resume'
    },
    {
      id: 'remote_worker',
      title: getTranslation('cat_remoteWorker', language),
      icon: Laptop,
      color: 'from-teal-600/35 to-cyan-500/15',
      glow: 'shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.55)]',
      borderColor: 'border-teal-500/30',
      textColor: 'text-teal-100',
      iconColor: 'text-teal-400',
      positionClasses: 'top-[29%] left-[3%] sm:top-[32%] sm:left-[4%] md:top-[35%] md:left-[6%] xl:top-[37%] xl:left-[9%]',
      tilt: 'rotate-x-12 -rotate-y-6 -rotate-1',
      tabId: 'jobs'
    },
    {
      id: 'gov_aspirant',
      title: getTranslation('cat_govAspirant', language),
      icon: Landmark,
      color: 'from-cyan-600/35 to-blue-500/15',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.55)]',
      borderColor: 'border-cyan-500/30',
      textColor: 'text-cyan-100',
      iconColor: 'text-cyan-400',
      positionClasses: 'top-[29%] right-[3%] sm:top-[32%] sm:right-[4%] md:top-[35%] md:right-[6%] xl:top-[37%] xl:right-[9%]',
      tilt: '-rotate-x-12 rotate-y-6 rotate-1',
      tabId: 'jobs'
    },
    {
      id: 'skilled_pro',
      title: getTranslation('cat_skilledPro', language),
      icon: Star,
      color: 'from-blue-600/35 to-cyan-500/15',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.55)]',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-400',
      positionClasses: 'top-[42%] left-[2%] sm:top-[46%] sm:left-[3%] md:top-[50%] md:left-[5%] xl:top-[53%] xl:left-[8%]',
      tilt: 'rotate-x-6 rotate-y-12 -rotate-2',
      tabId: 'interview'
    },
    {
      id: 'freelancer',
      title: getTranslation('cat_freelancer', language),
      icon: Briefcase,
      color: 'from-purple-600/35 to-pink-500/15',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.55)]',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-100',
      iconColor: 'text-purple-400',
      positionClasses: 'top-[42%] right-[2%] sm:top-[46%] sm:right-[3%] md:top-[50%] md:right-[5%] xl:top-[53%] xl:right-[8%]',
      tilt: '-rotate-x-6 -rotate-y-12 rotate-2',
      tabId: 'business'
    },
    {
      id: 'entrepreneur',
      title: getTranslation('cat_entrepreneur', language),
      icon: Lightbulb,
      color: 'from-blue-600/35 to-teal-500/15',
      glow: 'shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.55)]',
      borderColor: 'border-sky-500/30',
      textColor: 'text-sky-100',
      iconColor: 'text-sky-400',
      positionClasses: 'top-[55%] left-[1%] sm:top-[60%] sm:left-[2%] md:top-[64%] md:left-[3%] xl:top-[68%] xl:left-[5%]',
      tilt: 'rotate-x-12 rotate-y-6 -rotate-3',
      tabId: 'business'
    },
    {
      id: 'intern',
      title: getTranslation('cat_intern', language),
      icon: User,
      color: 'from-blue-600/35 to-indigo-500/15',
      glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.55)]',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-100',
      iconColor: 'text-blue-400',
      positionClasses: 'top-[55%] right-[1%] sm:top-[60%] sm:right-[2%] md:top-[64%] md:right-[3%] xl:top-[68%] xl:right-[5%]',
      tilt: '-rotate-x-12 -rotate-y-6 rotate-3',
      tabId: 'courses'
    }
  ];

  const floatingAnims = [
    { x: [0, -15, 10, -5, 0], y: [0, 20, -15, 12, 0], rotate: [0, 3, -4, 2, 0], duration: 8 },
    { x: [0, 12, -18, 8, 0], y: [0, -15, 15, -10, 0], rotate: [0, -3, 4, -2, 0], duration: 9 },
    { x: [0, -8, 15, -12, 0], y: [0, 18, -12, 15, 0], rotate: [0, 2, -3, 3, 0], duration: 10 },
    { x: [0, 15, -10, 14, 0], y: [0, -20, 18, -8, 0], rotate: [0, -4, 2, -3, 0], duration: 11 },
    { x: [0, -12, 12, -15, 0], y: [0, 14, -20, 10, 0], rotate: [0, 3, -2, 4, 0], duration: 8.5 },
    { x: [0, 18, -15, 8, 0], y: [0, -12, 14, -18, 0], rotate: [0, -2, 3, -1, 0], duration: 9.5 },
    { x: [0, -10, 18, -12, 0], y: [0, 15, -15, 8, 0], rotate: [0, 4, -3, 2, 0], duration: 10.5 },
    { x: [0, 14, -8, 15, 0], y: [0, -18, 12, -14, 0], rotate: [0, -3, 4, -2, 0], duration: 7.5 },
    { x: [0, -16, 12, -10, 0], y: [0, 12, -18, 15, 0], rotate: [0, 2, -4, 3, 0], duration: 11.5 },
    { x: [0, 10, -14, 12, 0], y: [0, -15, 20, -12, 0], rotate: [0, -4, 3, -3, 0], duration: 8.8 }
  ];

  return (
    <div className="relative w-full h-screen min-h-[580px] sm:min-h-[640px] bg-[#020208] text-white flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* Top Floating Language Dropdown Selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2" ref={langDropdownRef}>
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#120d2b]/80 hover:bg-[#1b143f]/80 border border-[#3e2b85]/50 rounded-full text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-md backdrop-blur-md cursor-pointer min-w-[85px] justify-between"
          >
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '15s' }} />
              <span className="font-extrabold text-[11px] tracking-wide text-purple-200">
                {LANGUAGES_LIST.find(l => l.code === language)?.symbol || 'AA'}
              </span>
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <div 
            className={`absolute left-1/2 -translate-x-1/2 mt-2 w-52 max-h-72 overflow-y-auto bg-[#0d091e]/95 border border-[#3e2b85]/70 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent ${
              isLangOpen 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none'
            } z-[60]`}
          >
            <div className="px-3.5 py-2 border-b border-[#2b1f5c]/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider sticky top-0 bg-[#0d091e] z-10">
              {getTranslation('selectLang', language)}
            </div>
            {LANGUAGES_LIST.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onLanguageChange(lang.code as Language);
                  setIsLangOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer hover:bg-white/5 ${
                  language === lang.code ? 'bg-[#7c3aed]/25 text-purple-200 font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 text-center text-[10px] font-bold bg-[#1b143f] px-1.5 py-0.5 rounded border border-[#3e2b85]/50 text-slate-300">{lang.symbol}</span>
                  <span>{lang.native} {lang.english ? `(${lang.english})` : ''}</span>
                </div>
                {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Deep space backdrop with floating pink/blue light streaks and bokeh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Neon Light Streaks */}
        <div className="absolute top-[10%] left-[-20%] w-[80%] h-[300px] bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent rotate-12 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[-20%] w-[80%] h-[300px] bg-gradient-to-l from-pink-500/10 via-purple-500/10 to-transparent -rotate-12 blur-[120px] rounded-full"></div>
        
        {/* Soft floating particles / stars */}
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-teal-400 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-pink-500/30 rounded-full blur-[1px] animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center relative min-h-0 h-full">
        
        {/* 2. Responsive Layout for Floating 3D Badge Cards - Always Visible on All Devices */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            const anim = floatingAnims[idx % floatingAnims.length];
            return (
              <motion.button
                key={cat.id}
                onClick={() => handleBadgeClick(cat.tabId)}
                className={`absolute pointer-events-auto bg-gradient-to-br ${cat.color} border ${cat.borderColor} ${cat.glow} px-3 py-2 sm:px-4.5 sm:py-3 md:px-5.5 md:py-4 xl:px-6 xl:py-4.5 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center gap-1.5 sm:gap-3 backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 group text-left ${cat.positionClasses}`}
                style={{
                  transform: `perspective(1000px) ${cat.tilt}`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: anim.x,
                  y: anim.y,
                  rotate: anim.rotate
                }}
                transition={{
                  opacity: { duration: 0.6, delay: idx * 0.08 + 0.15 },
                  scale: { duration: 0.6, delay: idx * 0.08 + 0.15 },
                  x: {
                    duration: anim.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: anim.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: anim.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
              >
                <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-2xl bg-black/40 border border-white/10 ${cat.iconColor} shrink-0 shadow-inner`}>
                  <IconComponent className="w-3 sm:w-4.5 md:w-5 md:h-5 sm:h-4.5 h-3 group-hover:scale-110 transition-transform duration-300 group-hover:animate-pulse" />
                </div>
                <div>
                  <span className={`text-[9px] sm:text-xs md:text-sm xl:text-base font-black uppercase tracking-wider sm:tracking-widest ${cat.textColor} whitespace-nowrap sm:whitespace-normal sm:max-w-[120px] md:max-w-[150px] xl:max-w-[180px] leading-tight block`}>
                    {cat.title}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* 3. Central Landing Header & Interactive Branding */}
        <div className="z-10 text-center max-w-2xl mx-auto space-y-4 md:space-y-6 py-6 sm:py-12 relative flex flex-col items-center">
          
          {/* Official Recruit Website Logo Portal */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative cursor-pointer mb-2 group"
            onClick={onEnter}
          >
            {/* Glowing active outline */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#7c3aed] to-indigo-500 opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500"></div>
            
            {/* Logo box */}
            <div className="relative bg-[#7c3aed] p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl border border-[#a78bfa]/50 shadow-[0_0_35px_rgba(124,58,237,0.5),inset_0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 sm:w-11 sm:h-11 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">
                <path d="M11.645 2.044a.75.75 0 0 1 .71 0l9.75 5.25a.75.75 0 0 1 0 1.312l-9.75 5.25a.75.75 0 0 1-.71 0L1.9 8.606a.75.75 0 0 1 0-1.312h.005l9.74-5.25ZM22 12.75a.75.75 0 0 1-.75-.75V9.11l-2 1.077v3.063c0 .385-.21.74-.55 1.13-1.256 1.436-3.708 2.62-7.2 2.62-3.492 0-5.944-1.184-7.2-2.62a1.5 1.5 0 0 1-.55-1.13V10.187L2.75 9.11v2.89a.75.75 0 0 1-1.5 0V8.534a.75.75 0 0 1 .373-.648l9.75-5.25a.75.75 0 0 1 .746 0l9.75 5.25a.75.75 0 0 1 .373.648v4.216a.75.75 0 0 1-.75.75Zm-10.25 2.5c2.975 0 4.968-.946 5.86-1.966a.25.25 0 0 0 .04-.154v-1.74l-5.63 3.03a.75.75 0 0 1-.74 0L5.65 11.39v1.74a.25.25 0 0 0 .04.154c.892 1.02 2.885 1.966 5.86 1.966Z" />
              </svg>
            </div>
            
            {/* Elegant outer dashed orbit ring */}
            <div className="absolute -inset-3 sm:-inset-5 rounded-full border border-dashed border-[#7c3aed]/20 group-hover:border-[#7c3aed]/40 group-hover:rotate-45 transition-all duration-700 pointer-events-none"></div>
          </motion.div>

          {/* Texts */}
          <div className="space-y-1 sm:space-y-2">
            <motion.span 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
              className="text-[8px] sm:text-xs font-bold tracking-[0.35em] text-slate-400 uppercase block"
            >
              {getTranslation('welcomeTo', language)}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="text-4xl sm:text-7xl xl:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#2dd4bf] via-[#3b82f6] to-[#ec4899] drop-shadow-[0_0_35px_rgba(59,130,246,0.25)] select-none uppercase leading-none font-sans"
            >
              Recruit
            </motion.h1>

            <motion.span 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
              className="text-[8px] sm:text-[11px] font-black tracking-[0.25em] text-slate-400 uppercase block pt-0.5"
            >
              {getTranslation('dreamPrepare', language)}
            </motion.span>
          </div>



          {/* 3D Circular Pedestal Stage */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
            className="relative w-48 h-16 sm:w-64 sm:h-20 flex items-center justify-center my-2 sm:my-4 preserve-3d"
          >
            {/* Multiple nested glow rings representing 3D platform */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-10 sm:w-48 sm:h-12 bg-[#101438] border-2 border-blue-500/30 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.25)] transform -rotate-x-12 scale-100 flex items-center justify-center">
              {/* Inner deep spotlight ring */}
              <div className="w-32 h-6 sm:w-40 sm:h-8 bg-[#070921] border border-blue-400/40 rounded-full shadow-[inset_0_0_15px_rgba(59,130,246,0.5)]"></div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 sm:w-56 sm:h-14 border border-indigo-500/15 rounded-full transform -rotate-x-12 scale-105 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-6 sm:w-36 sm:h-8 border border-blue-400/20 rounded-full transform -rotate-x-12 scale-95 pointer-events-none"></div>

            {/* Firing Light Particles up from the podium */}
            <div className="absolute -top-10 w-12 h-16 bg-gradient-to-t from-blue-500/20 to-transparent blur-md rounded-full animate-pulse"></div>
          </motion.div>

          {/* Main CTA Enter Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
            className="pt-1"
          >
            <motion.button
              onClick={onEnter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 sm:px-10 sm:py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-[0_8px_25px_rgba(59,130,246,0.35)] hover:shadow-[0_12px_35px_rgba(59,130,246,0.5)] border border-blue-400/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{getTranslation('enterBtn', language)}</span>
              <ArrowRight className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '2.5s' }} />
            </motion.button>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="text-[10px] text-slate-400 font-semibold italic"
          >
            {getTranslation('buildFuture', language)}
          </motion.p>
        </div>

      </div>

      {/* 5. Footer and Status Indicator Panel */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-4 sm:pb-6 z-10 flex flex-col items-center gap-3 sm:gap-4 shrink-0">
        
        {/* Arohi is Online Active Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
          className="bg-gradient-to-r from-[#0d1527] via-[#091e2b] to-[#0d1527] border border-emerald-950/40 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-xl flex items-center justify-between gap-4 max-w-sm sm:max-w-lg w-full"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <span className="text-[8px] sm:text-[10px] uppercase font-black tracking-widest text-emerald-400 block">
                {getTranslation('arohiActive', language)}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-200 line-clamp-1">
                {getTranslation('arohiGreeting', language)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => handleBadgeClick('arohi')}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 cursor-pointer shadow-md shrink-0"
            title="Chat with Arohi"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </button>
        </motion.div>

        {/* Legal brand footer text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.25, ease: "easeOut" }}
          className="w-full border-t border-slate-900/50 pt-4 flex flex-col items-center justify-center gap-2 text-[8px] sm:text-[10px] text-slate-400 font-extrabold uppercase tracking-widest text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
            <span className="flex items-center gap-1">
              RECRUIT.ORG.IN &copy; {new Date().getFullYear()} &bull; Empowering Careers Across India
            </span>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-slate-500">
              <button onClick={() => handleBadgeClick('jobs')} className="hover:text-blue-400 transition-colors cursor-pointer">Jobs</button>
              <span>&bull;</span>
              <button onClick={() => handleBadgeClick('courses')} className="hover:text-indigo-400 transition-colors cursor-pointer">Training</button>
              <span>&bull;</span>
              <button onClick={() => handleBadgeClick('syllabus')} className="hover:text-emerald-400 transition-colors cursor-pointer text-[#00e676] font-bold">School Syllabus</button>
              <span>&bull;</span>
              <button onClick={() => handleBadgeClick('interview')} className="hover:text-purple-400 transition-colors cursor-pointer">Interviews</button>
              <span>&bull;</span>
              <button onClick={() => handleBadgeClick('resume')} className="hover:text-emerald-400 transition-colors cursor-pointer">Resume</button>
              <span>&bull;</span>
              <button onClick={() => handleBadgeClick('business')} className="hover:text-teal-400 transition-colors cursor-pointer">Career Guidance</button>
            </div>
          </div>
          <div className="text-[8px] sm:text-[10px] text-slate-500 tracking-wider font-semibold mt-2.5 uppercase flex flex-wrap items-center justify-center gap-2">
            <span>Developed and maintained by</span>
            <span className="text-[9.5px] sm:text-[11px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.1)] tracking-normal normal-case">
              BRAGA TECHNOLOGIES PRIVATE LIMITED
            </span>
            <span>in association with</span>
            <span className="text-[9.5px] sm:text-[11px] font-black text-[#00e676] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shadow-[0_0_12px_rgba(0,230,118,0.1)] tracking-normal normal-case">
              ODITREE SERVICES
            </span>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
