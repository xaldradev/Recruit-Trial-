import { useState, useEffect, useRef } from 'react';
import { 
  PanelLeft, 
  PanelLeftClose, 
  Home, 
  Briefcase, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  User, 
  Landmark, 
  Phone, 
  X, 
  ArrowLeft, 
  Shield, 
  Bot, 
  FileText, 
  Award, 
  Building, 
  Search, 
  FileCheck, 
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Posting } from '../types';

interface NavigationHubProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  prevTab: string;
  setSelectedPosting: (posting: Posting | null) => void;
}

const navigationCategories = [
  {
    title: 'Core Ecosystem',
    items: [
      { id: 'home', label: 'Ecosystem Home', icon: Home, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
      { id: 'dashboard', label: 'User Dashboard', icon: User, color: 'text-[#00e676] bg-[#00e676]/10 border-[#00e676]/20' },
      { id: 'arohi', label: 'Arohi AI Chat & Voice', icon: Bot, color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
      { id: 'franchise', label: 'AECN Franchise Center', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', badge: 'Partner' },
    ]
  },
  {
    title: 'Careers & Opportunities',
    items: [
      { id: 'jobs', label: 'Jobs & Openings', icon: Briefcase, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
      { id: 'employer', label: 'Recruiters & Employers', icon: Building, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', badge: 'Free' },
      { id: 'resume', label: 'AI Resume Builder', icon: FileCheck, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', badge: '₹99' },
      { id: 'interview', label: 'AI Mock Interviewer', icon: Bot, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    ]
  },
  {
    title: 'Skills & Education',
    items: [
      { id: 'courses', label: 'Skills & Certification', icon: BookOpen, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
      { id: 'syllabus', label: 'School Syllabus (1-10)', icon: GraduationCap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', badge: 'Odia/CBSE' },
    ]
  },
  {
    title: 'Business & Subsidies',
    items: [
      { id: 'business', label: 'MSME Business Guides', icon: Landmark, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', badge: 'New' },
      { id: 'schemes', label: 'Govt Loans & Schemes', icon: Lightbulb, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    ]
  },
  {
    title: 'Legal & Support',
    items: [
      { id: 'privacy', label: 'Privacy Policy', icon: Shield, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
      { id: 'terms', label: 'Terms of Service', icon: FileText, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
      { id: 'refunds', label: 'Refund Policy', icon: Landmark, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
      { id: 'payments', label: 'Payment Terms', icon: Award, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
      { id: 'contact', label: 'Support Desk', icon: Phone, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
    ]
  }
];

export default function NavigationHub({ activeTab, setActiveTab, prevTab, setSelectedPosting }: NavigationHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
    } else {
      setFilterQuery('');
    }
  }, [isOpen]);

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedPosting(null);
    setIsOpen(false);
  };

  // Filter categories and items based on search query
  const filteredCategories = navigationCategories.map(cat => {
    const matchingItems = cat.items.filter(item => 
      item.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
      cat.title.toLowerCase().includes(filterQuery.toLowerCase())
    );
    return {
      ...cat,
      items: matchingItems
    };
  }).filter(cat => cat.items.length > 0);

  return (
    <>
      {/* 1. Floating Side-Tab Trigger Button (ChatGPT 3-bar style) */}
      <div className="fixed bottom-6 left-6 z-40 font-sans select-none">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center p-3.5 bg-[#0f0b24]/90 hover:bg-[#181238] border border-[#302166] hover:border-[#6342cb] text-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(124,58,237,0.2)] transition-all duration-300 cursor-pointer backdrop-blur-xl group relative ${
            isOpen ? 'ring-2 ring-indigo-500/80 border-indigo-400' : ''
          }`}
          title={isOpen ? "Close Navigation" : "Open Navigation"}
          id="floating-navigation-hub-trigger"
        >
          {/* Animated 3-Bar / Panel Left Icon */}
          <div className="relative w-5 h-5 flex items-center justify-center text-indigo-400 group-hover:text-white transition-colors">
            {isOpen ? (
              <PanelLeftClose className="w-5 h-5 text-purple-300" />
            ) : (
              <div className="flex flex-col gap-1 items-center justify-center w-4.5">
                <span className="w-4.5 h-0.5 bg-indigo-400 group-hover:bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-5"></span>
                <span className="w-3.5 h-0.5 bg-indigo-300 group-hover:bg-white rounded-full transition-all duration-300 group-hover:w-5"></span>
                <span className="w-4.5 h-0.5 bg-indigo-400 group-hover:bg-cyan-300 rounded-full transition-all duration-300 group-hover:w-5"></span>
              </div>
            )}
          </div>

          {/* Pulse notification dot when closed */}
          {!isOpen && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#0f0b24]"></span>
            </span>
          )}
        </motion.button>
      </div>

      {/* 2. ChatGPT-Style Full-Height Side Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            {/* Backdrop Dimmer Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-[#04020a]/75 backdrop-blur-sm"
            />

            {/* Slide-out Sidebar Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 left-0 bottom-0 w-[88vw] sm:w-[380px] max-w-[400px] h-full bg-[#0c081e]/95 border-r border-[#2d2163] shadow-[20px_0_60px_rgba(0,0,0,0.8),0_0_40px_rgba(124,58,237,0.15)] flex flex-col z-50 backdrop-blur-2xl"
            >
              {/* Drawer Top Branding Header */}
              <div className="p-5 border-b border-[#201847] flex items-center justify-between shrink-0 bg-[#0e0924]/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm text-white tracking-tight uppercase">
                        AROHI <span className="text-indigo-400">AI</span>
                      </h3>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                        Ecosystem
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-[#1a143b] hover:bg-[#281f5c] border border-[#342775] text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95"
                  title="Close Navigation (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Search Filter Bar */}
              <div className="px-5 pt-4 pb-2 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Quick search sections..."
                    className="w-full bg-[#140e33] border border-[#2b1f5e] focus:border-[#7c3aed] text-white text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none placeholder:text-slate-500 transition-colors"
                  />
                  {filterQuery && (
                    <button
                      onClick={() => setFilterQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Return to Main Home Button if on another tab */}
              {activeTab !== 'home' && (
                <div className="px-5 pt-2 pb-2 shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectTab('home')}
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 border border-indigo-400/30 transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Ecosystem Home</span>
                  </motion.button>
                </div>
              )}

              {/* Scrollable Side Nav List */}
              <div className="flex-1 overflow-y-auto px-5 py-3 space-y-6 custom-scrollbar">
                {filteredCategories.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No sections matched "{filterQuery}"
                  </div>
                ) : (
                  filteredCategories.map((cat, catIdx) => (
                    <div key={catIdx} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {cat.title}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          const isSelected = activeTab === item.id;

                          return (
                            <motion.button
                              key={item.id}
                              whileHover={{ x: 4 }}
                              onClick={() => handleSelectTab(item.id)}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border transition-all text-left cursor-pointer relative overflow-hidden group ${
                                isSelected
                                  ? 'bg-[#1e1747] border-[#7c3aed] text-white shadow-md shadow-indigo-950/50'
                                  : 'bg-[#120d2d]/60 hover:bg-[#1a1342] border-[#22174a]/80 text-slate-300 hover:text-white'
                              }`}
                            >
                              {/* Left Active Glow Bar */}
                              {isSelected && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#00e676] rounded-r-full shadow-[0_0_10px_#00e676]" />
                              )}

                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl border shrink-0 ${item.color}`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                    {item.label}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {item.badge && (
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
                                    {item.badge}
                                  </span>
                                )}
                                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#00e676] translate-x-0.5' : 'text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5'}`} />
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Bottom Footer */}
              <div className="p-4 border-t border-[#201847] bg-[#090617] shrink-0 flex items-center justify-between text-[10px] text-slate-400 font-bold px-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
                  <span>AROHI AI Active</span>
                </div>
                <div className="text-slate-500 font-semibold">
                  Esc to dismiss
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

