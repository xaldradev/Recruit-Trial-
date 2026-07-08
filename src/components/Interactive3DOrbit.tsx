import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  BookOpen, 
  Landmark, 
  UserCheck, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft, 
  Layers, 
  Flame, 
  ShieldAlert, 
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface Interactive3DOrbitProps {
  setActiveTab: (tab: string) => void;
  setSelectedPosting?: (posting: any) => void;
}

export default function Interactive3DOrbit({ setActiveTab, setSelectedPosting }: Interactive3DOrbitProps) {
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [depthOffset, setDepthOffset] = useState(240); // 3D radius depth of the cylinder
  const [tilt, setTilt] = useState(-5); // RotateX tilt
  const [autoRotate, setAutoRotate] = useState(true);

  // Core sectors of the India Career Ecosystem
  const sectors = [
    {
      title: "Sarkari Job Vacancies",
      label: "Ministry Exams & Railways",
      emoji: "💼",
      desc: "Apply directly for SSC, Railway, UPSC, and State commissions with offline backup logs.",
      tabId: "jobs",
      badge: "ACTIVE BOARDS",
      accent: "from-cyan-500 to-blue-600",
      stats: "15,409 Live Vacancies"
    },
    {
      title: "AROHI Career Assistant",
      label: "Instant Interactive Advisor",
      emoji: "🤖",
      desc: "Get instant guidance regarding your career path, resume scores, and business loan eligibility.",
      tabId: "arohi",
      badge: "LIVE SUPPORT",
      accent: "from-purple-500 to-pink-600",
      stats: "24/7 Realtime Sync"
    },
    {
      title: "Interactive ATS Builder",
      label: "Resume Deficiency Grader",
      emoji: "📄",
      desc: "Calculate resume ATS compatibility grades instantly. Unlock deep premium templates.",
      tabId: "resume",
      badge: "ATS CHECKER",
      accent: "from-emerald-400 to-teal-600",
      stats: "₹99 Complete Unlock"
    },
    {
      title: "Mudra MSME Loans",
      label: "Government Startup Calculator",
      emoji: "🏦",
      desc: "Generate project compliance reports for Shishu, Kishor & Tarun government subsidies.",
      tabId: "business",
      badge: "RBI GUIDELINES",
      accent: "from-amber-400 to-orange-600",
      stats: "PMEGP Integration"
    },
    {
      title: "ISO-Certified Skill Classes",
      label: "Advanced Growth Upgrades",
      emoji: "🎓",
      desc: "Learn TallyPrime, cybersecurity, & cloud computing to fit current fast-growing Indian demands.",
      tabId: "courses",
      badge: "CERTIFICATIONS",
      accent: "from-violet-500 to-fuchsia-600",
      stats: "12 Certified Tracks"
    },
    {
      title: "User Control Dashboard",
      label: "Hall Tickets & Applications",
      emoji: "👤",
      desc: "Review your saved mock applications, download hall tickets, and track premium subscriptions.",
      tabId: "dashboard",
      badge: "SECURE PORTAL",
      accent: "from-rose-500 to-red-600",
      stats: "Encrypted Locker"
    }
  ];

  const totalSectors = sectors.length;

  // Handles auto rotation
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotation(prev => prev - 360 / totalSectors);
      setActiveIndex(prev => (prev + 1) % totalSectors);
    }, 4500);
    return () => clearInterval(interval);
  }, [autoRotate, totalSectors]);

  const handleNext = () => {
    setAutoRotate(false);
    setRotation(prev => prev - 360 / totalSectors);
    setActiveIndex(prev => (prev + 1) % totalSectors);
  };

  const handlePrev = () => {
    setAutoRotate(false);
    setRotation(prev => prev + 360 / totalSectors);
    setActiveIndex(prev => (prev - 1 + totalSectors) % totalSectors);
  };

  const selectSector = (index: number) => {
    setAutoRotate(false);
    // Find the shortest rotation angle
    const diff = index - activeIndex;
    let angleChange = diff * (360 / totalSectors);
    if (angleChange > 180) angleChange -= 360;
    if (angleChange < -180) angleChange += 360;
    
    setRotation(prev => prev - angleChange);
    setActiveIndex(index);
  };

  const handleTeleport = (tabId: string) => {
    setActiveTab(tabId);
    if (setSelectedPosting) {
      setSelectedPosting(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#120a32] via-[#08051a] to-[#1a0e3a] border border-[#2b1f63] rounded-[2.5rem] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_25px_rgba(124,58,237,0.15)] relative overflow-hidden select-none font-sans min-h-[580px] flex flex-col justify-between preserve-3d">
      
      {/* Background Radial Light Orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#c084fc]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top controls and title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 z-10">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/20 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> 
            <span>National Career Service Portal</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Interactive Career Hub <span className="text-xs font-bold text-slate-400 font-mono">(Portal Directory)</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl font-medium">
            Explore recruitment pipelines, skill certifications, government MSME subsidies, and career tools.
          </p>
        </div>

        {/* Depth Adjuster HUD */}
        <div className="bg-[#0b081e] border border-[#271d5b] p-2.5 rounded-2xl flex flex-wrap items-center gap-3 self-start lg:self-center shadow-md">
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1">Tilt Angle:</span>
            <input 
              type="range" 
              min="-20" 
              max="15" 
              value={tilt} 
              onChange={(e) => setTilt(Number(e.target.value))}
              className="w-16 h-1 bg-[#221c4b] rounded-lg appearance-none cursor-pointer accent-[#7c3aed]"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold px-1">Radius:</span>
            <input 
              type="range" 
              min="180" 
              max="350" 
              value={depthOffset} 
              onChange={(e) => setDepthOffset(Number(e.target.value))}
              className="w-16 h-1 bg-[#221c4b] rounded-lg appearance-none cursor-pointer accent-[#7c3aed]"
            />
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              autoRotate ? 'bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/40' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {autoRotate ? 'Auto Rotation ON' : 'Rotation Paused'}
          </button>
        </div>
      </div>

      {/* Main 3D Stage Section */}
      <div className="flex-1 w-full flex flex-col md:flex-row items-center justify-center gap-10 py-10 preserve-3d relative">
        
        {/* Left Side: 3D Ring Stage Container */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative min-h-[320px] preserve-3d perspective-2000">
          
          {/* Virtual Center Hub */}
          <div className="absolute w-24 h-24 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(124,58,237,0.2)] animate-pulse z-10">
            <span className="text-3xl animate-bounce">🇮🇳</span>
            <span className="text-[8px] font-black tracking-widest text-[#a78bfa] uppercase mt-1">NCS Hub</span>
          </div>

          {/* Interactive 3D Rotational Cylinder Grid */}
          <div 
            className="w-full h-full absolute flex items-center justify-center transition-transform duration-700 ease-out preserve-3d"
            style={{
              transform: `rotateX(${tilt}deg) rotateY(${rotation}deg)`,
            }}
          >
            {sectors.map((sector, idx) => {
              const angle = (idx * 360) / totalSectors;
              const isSelected = activeIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => selectSector(idx)}
                  className={`absolute w-44 sm:w-48 p-4 rounded-2xl border transition-all duration-500 cursor-pointer select-none backface-hidden preserve-3d text-left ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#1b1244] to-[#0a071d] border-[#7c3aed] shadow-[0_10px_30px_rgba(124,58,237,0.4),0_0_15px_rgba(255,255,255,0.05)] scale-105 ring-1 ring-[#7c3aed]/40'
                      : 'bg-[#0f0a28]/60 border-[#231a54]/80 text-slate-400 hover:border-[#42318e] hover:bg-[#150f38]/80 hover:text-white'
                  }`}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${depthOffset}px)`,
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-9 h-9 rounded-xl bg-[#1b1344] border border-[#3b2b80] flex items-center justify-center text-lg shadow-inner">
                        {sector.emoji}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        isSelected 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                          : 'bg-slate-800/40 text-slate-500 border-slate-700/30'
                      }`}>
                        {sector.badge}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[9px] text-[#a78bfa] font-black uppercase block tracking-wide">
                        {sector.label}
                      </span>
                      <h4 className="text-xs font-extrabold text-white leading-tight">
                        {sector.title}
                      </h4>
                    </div>

                    {isSelected && (
                      <p className="text-[10px] text-slate-300 leading-normal font-semibold animate-in fade-in duration-300 line-clamp-2">
                        {sector.desc}
                      </p>
                    )}

                    <div className="pt-2 border-t border-[#20184c] flex items-center justify-between text-[8px] font-extrabold">
                      <span className="text-[#00e676]">{sector.stats}</span>
                      <span className="text-slate-400 hover:text-white transition-colors">Select ➔</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orbit Navigation Ring helpers */}
          <div 
            className="absolute border border-dashed border-[#553bbf]/30 rounded-full pointer-events-none"
            style={{
              width: `${depthOffset * 2}px`,
              height: `${depthOffset * 2}px`,
              transform: `rotateX(${tilt + 90}deg)`,
            }}
          ></div>

        </div>

        {/* Right Side: Selected Portal Details HUD */}
        <div className="w-full md:w-1/2 text-left space-y-6 bg-[#0c0821]/80 border border-[#2d2165] p-6 sm:p-8 rounded-[2rem] shadow-xl relative preserve-3d animate-in slide-in-from-right-6 duration-300">
          
          {/* Absolute corner badge */}
          <div className="absolute top-4 right-4 bg-yellow-300 text-slate-950 px-2.5 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider border border-yellow-200">
            Portal Overview
          </div>

          {/* Detail Display of Active Sector */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{sectors[activeIndex].emoji}</span>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-purple-400 block">
                  {sectors[activeIndex].badge}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-white">
                  {sectors[activeIndex].title}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
              {sectors[activeIndex].desc}
            </p>

            {/* Simulated Live status and analytics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-[#120d2d] border border-[#271d5b] p-3 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Realtime Status</span>
                <span className="text-xs font-black text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active & Verified
                </span>
              </div>
              <div className="bg-[#120d2d] border border-[#271d5b] p-3 rounded-xl">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">System Metric</span>
                <span className="text-xs font-black text-[#a78bfa] mt-1 block">
                  {sectors[activeIndex].stats}
                </span>
              </div>
            </div>

            {/* Action Buttons to launch the actual tab or portal */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleTeleport(sectors[activeIndex].tabId)}
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#d946ef] hover:from-[#6d28d9] hover:to-[#c084fc] text-white font-black text-xs uppercase tracking-wider py-3 px-5 rounded-xl shadow-[0_4px_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-1.5 cursor-pointer transform hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span>Teleport to Portal</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className="px-4 py-3 bg-[#17123c] hover:bg-[#251e5e] border border-[#2d2165] rounded-xl text-xs font-black text-slate-300 uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 text-purple-400 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{autoRotate ? "Pause Stage" : "Auto Spin"}</span>
              </button>
            </div>
          </div>

          {/* Interactive Carousel controller HUD inside details */}
          <div className="flex justify-between items-center pt-4 border-t border-[#231b5d] text-xs font-bold text-slate-400">
            <button 
              onClick={handlePrev}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-purple-400" />
              <span>Prev Sector</span>
            </button>
            
            <div className="flex gap-1.5">
              {sectors.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSector(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    activeIndex === idx ? 'bg-[#7c3aed] w-5' : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Navigate to Sector ${idx + 1}`}
                ></button>
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Next Sector</span>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </button>
          </div>

        </div>

      </div>

      {/* Footer system alert message */}
      <div className="pt-4 border-t border-[#20184e] flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] text-slate-400 font-black tracking-wider uppercase">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Flame className="w-3.5 h-3.5 text-amber-400" /> Platform services are processed securely server-side
        </span>
        <button 
          onClick={() => handleTeleport('contact')}
          className="hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-[#00e676]" /> <span>Official Reserve Bank of India Certified Gateway</span>
        </button>
      </div>

    </div>
  );
}
