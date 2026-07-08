import { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  BookOpen, 
  Landmark, 
  UserCheck, 
  FileText, 
  PhoneCall, 
  Tv, 
  Play, 
  Pause, 
  Maximize2, 
  RotateCcw, 
  ChevronRight, 
  TrendingUp, 
  Award,
  Zap,
  MoveLeft,
  MoveRight
} from 'lucide-react';

interface Smooth3DShowcaseProps {
  setActiveTab: (tab: string) => void;
  setSelectedPosting: (posting: any) => void;
}

export default function Smooth3DShowcase({ setActiveTab, setSelectedPosting }: Smooth3DShowcaseProps) {
  const [speed, setSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [depth, setDepth] = useState<'medium' | 'deep' | 'flat'>('medium');
  const [isPaused, setIsPaused] = useState(false);

  // Elite ecosystem portals configured as 3D Gateway Tiles
  const showcaseItems = [
    {
      id: 'jobs',
      title: 'SSC MTS & Railways',
      subtitle: 'Students, Professionals & MSMEs',
      desc: 'Apply directly with customized automated form checks, reservation calculators, and key date trackers.',
      tag: '🔥 HOT JOB ALERT',
      icon: Briefcase,
      colorClass: 'from-blue-600/20 via-indigo-600/10 to-transparent border-blue-500/30 text-blue-400',
      iconColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      extra: '15,000+ Vacancies Live'
    },
    {
      id: 'arohi',
      title: 'AROHI Career Assistant',
      subtitle: 'Instant Ecosystem Help',
      desc: 'Get immediate answers for your Mudra loan queries, exam details, syllabus, or state schemas.',
      tag: '🤖 SUPPORT PANEL',
      icon: Sparkles,
      colorClass: 'from-purple-600/20 via-pink-600/10 to-transparent border-purple-500/30 text-purple-400',
      iconColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      extra: '24/7 Verified Support'
    },
    {
      id: 'resume',
      title: 'ATS Resume Deficiencies',
      subtitle: 'Professional Document Builder',
      desc: 'Construct and export clean ATS-compatible resumes. Identify critical missing keywords instantly.',
      tag: '⚡ BUILD & SCORE',
      icon: FileText,
      colorClass: 'from-emerald-600/20 via-teal-600/10 to-transparent border-emerald-500/30 text-emerald-400',
      iconColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      extra: 'Grade Compatibilities'
    },
    {
      id: 'business',
      title: 'Mudra Startup Loans',
      subtitle: 'Business Subsidy Calculator',
      desc: 'Generate perfect project reports for Shishu, Kishor, and Tarun schemes. Validate local ideas.',
      tag: '🏦 GOVERNMENT AID',
      icon: Landmark,
      colorClass: 'from-amber-600/20 via-orange-600/10 to-transparent border-amber-500/30 text-amber-400',
      iconColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      extra: 'PMEGP Subsidy Sync'
    },
    {
      id: 'courses',
      title: 'Advanced Skill Upgrades',
      subtitle: 'Certified Digital Courses',
      desc: 'Upskill with TallyPrime, cyber security, and web development courses to unlock high-income tracks.',
      tag: '🎓 SKILL ACCELERATOR',
      icon: BookOpen,
      colorClass: 'from-violet-600/20 via-fuchsia-600/10 to-transparent border-violet-500/30 text-violet-400',
      iconColor: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      extra: 'ISO-Certified Tracks'
    },
    {
      id: 'dashboard',
      title: 'Active User Dashboard',
      subtitle: 'Ecosystem Teleport',
      desc: 'Check saved mock applications, print Hall Tickets, inspect active premium plan status, and track logs.',
      tag: '👑 PRIVATE ACCESS',
      icon: UserCheck,
      colorClass: 'from-cyan-600/20 via-sky-600/10 to-transparent border-cyan-500/30 text-cyan-400',
      iconColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      extra: 'Secured Portal Gate'
    },
  ];

  // We repeat items multiple times to allow infinite looping and cover extra wide viewports seamlessly
  const repeatedItems = [...showcaseItems, ...showcaseItems, ...showcaseItems, ...showcaseItems];

  // Resolve active animation class based on settings
  const getAnimationClass = () => {
    if (isPaused) return '[animation-play-state:paused]';
    if (direction === 'right') return 'animate-scroll-right-3d';
    
    switch (speed) {
      case 'fast': return 'animate-scroll-3d-fast';
      case 'slow': return 'animate-scroll-3d-slow';
      default: return 'animate-scroll-3d-normal';
    }
  };

  // Determine perspective class
  const getPerspectiveStyle = () => {
    switch (depth) {
      case 'deep': return { perspective: '700px' };
      case 'flat': return { perspective: '3000px' };
      default: return { perspective: '1200px' };
    }
  };

  const handleTileClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedPosting(null);
  };

  return (
    <section className="bg-gradient-to-r from-[#110d2d] via-[#0b0821] to-[#160f38] border border-[#231a52] rounded-[2.5rem] p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden select-none font-sans mt-8">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 relative z-10">
        <div className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-[#7c3aed]/15 text-[#c084fc] border border-[#7c3aed]/30 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5 text-yellow-300 animate-bounce" /> 
            <span>Ecosystem Corridor Showcase</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Navigate Our Unified Recruitment Ecosystem
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl font-semibold leading-relaxed">
            Explore our endless sliding directory of central recruitment portals, skills classes, government calculators, and resume utilities. <span className="text-[#a78bfa]">Click any card directly to navigate there!</span>
          </p>
        </div>

        {/* 3D Showcase Live Control HUD */}
        <div className="bg-[#120d2a]/90 border border-[#302373] p-3 rounded-2xl flex flex-wrap items-center gap-3 shrink-0 shadow-lg">
          
          {/* Play/Pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isPaused 
                ? 'bg-[#00e676]/20 text-[#00e676] border-[#00e676]/30' 
                : 'bg-[#1b1540] hover:bg-[#251e56] border-[#2d2163] text-slate-300'
            }`}
            title={isPaused ? 'Resume Scroll' : 'Pause Scroll'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Direction */}
          <div className="flex rounded-xl bg-[#1b1540] p-0.5 border border-[#2d2163]">
            <button
              onClick={() => setDirection('left')}
              className={`p-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                direction === 'left' ? 'bg-[#7c3aed] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Scroll Left"
            >
              <MoveLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDirection('right')}
              className={`p-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                direction === 'right' ? 'bg-[#7c3aed] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              title="Scroll Right"
            >
              <MoveRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Speed Indicator */}
          <div className="flex rounded-xl bg-[#1b1540] p-0.5 border border-[#2d2163] items-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-2 hidden sm:inline">Speed:</span>
            {(['slow', 'normal', 'fast'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                  speed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Perspective Depth */}
          <div className="flex rounded-xl bg-[#1b1540] p-0.5 border border-[#2d2163] items-center">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold px-2 hidden sm:inline">Depth:</span>
            {(['flat', 'medium', 'deep'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                  depth === d ? 'bg-[#7c3aed] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Real 3D Endless Viewport */}
      <div 
        className="w-full relative py-10 overflow-hidden bg-[#070514]/60 border border-[#1b143c] rounded-[2rem] preserve-3d"
        style={getPerspectiveStyle()}
      >
        {/* Soft Left and Right Ambient Overlays for depth fade */}
        <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-[#070514] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-[#070514] to-transparent z-20 pointer-events-none"></div>

        {/* 3D Transform Track */}
        <div className="w-max flex gap-6 items-center preserve-3d">
          <div className={`flex gap-6 whitespace-nowrap preserve-3d ${getAnimationClass()} hover:[animation-play-state:paused]`}>
            {repeatedItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => handleTileClick(item.id)}
                  className={`w-72 sm:w-80 bg-gradient-to-br ${item.colorClass} border rounded-2xl p-5 text-left flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_15px_30px_rgba(124,58,237,0.3),0_0_15px_rgba(255,255,255,0.05)] preserve-3d relative group`}
                  style={{
                    transform: 'translateZ(10px)',
                  }}
                >
                  {/* Subtle Grid Pattern Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] rounded-2xl pointer-events-none"></div>

                  <div className="space-y-4 relative z-10">
                    {/* Upper Line */}
                    <div className="flex justify-between items-center">
                      <div className={`p-2 rounded-xl border ${item.iconColor} transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-md ${item.badgeColor} animate-pulse`}>
                        {item.tag}
                      </span>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">
                        {item.subtitle}
                      </span>
                      <h4 className="text-base font-black text-white group-hover:text-yellow-200 transition-colors flex items-center gap-1.5">
                        {item.title}
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-yellow-200 transition-colors shrink-0" />
                      </h4>
                      <p className="text-xs text-slate-300 leading-normal font-medium whitespace-normal line-clamp-2 pt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Divider and Portal Action info */}
                  <div className="mt-4 pt-3 border-t border-[#231b57]/60 flex items-center justify-between text-[10px] font-bold text-slate-400 relative z-10">
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00e676]" />
                      {item.extra}
                    </span>
                    <span className="group-hover:text-white transition-colors uppercase tracking-wider flex items-center gap-0.5 text-slate-400">
                      Teleport Port ➔
                    </span>
                  </div>

                  {/* 3D highlight beam */}
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-transparent via-[#7c3aed]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Decorative Outer Stats Footnote */}
      <div className="mt-4 pt-4 border-t border-[#1d1645] flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 font-black tracking-wider uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-yellow-400" /> Authorized National Career Service Ecosystem
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline">256-bit SSL encrypted connections only</span>
        </div>
        <div className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer" onClick={() => setActiveTab('contact')}>
          Need Custom Navigation Assistance? Connect with Support ➔
        </div>
      </div>

    </section>
  );
}
