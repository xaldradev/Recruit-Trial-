import { useState, useEffect, useRef } from 'react';
import { Compass, Home, Briefcase, BookOpen, GraduationCap, Sparkles, User, Landmark, Phone, ChevronUp, X, ArrowLeft, Shield } from 'lucide-react';
import { Posting } from '../types';

interface NavigationHubProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  prevTab: string;
  setSelectedPosting: (posting: Posting | null) => void;
}

export default function NavigationHub({ activeTab, setActiveTab, prevTab, setSelectedPosting }: NavigationHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'home', label: 'Ecosystem Home', icon: Home, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'jobs', label: 'Jobs & Openings', icon: Briefcase, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'courses', label: 'Skills & Courses', icon: BookOpen, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { id: 'syllabus', label: 'School Syllabus 1-10', icon: GraduationCap, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'business', label: 'Business Guides', icon: Landmark, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'arohi', label: 'Arohi AI Chat', icon: Sparkles, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { id: 'dashboard', label: 'User Dashboard', icon: User, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div ref={containerRef} className="fixed bottom-6 left-6 z-50 font-sans select-none">
      
      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-72 bg-[#0d0a21]/95 backdrop-blur-md border border-[#2d2163] rounded-3xl p-5 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(124,58,237,0.15)] space-y-4 animate-in slide-in-from-bottom-6 fade-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#201847] pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#7c3aed]/20 p-1.5 rounded-lg border border-[#7c3aed]/30">
                <Compass className="w-4 h-4 text-[#a78bfa]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white tracking-wide uppercase">Ecosystem Hub</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Quickly jump across sections</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-[#181335] hover:bg-[#251e50] border border-[#2b215e] text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Return to Main Home Button */}
          {activeTab !== 'home' && (
            <button
              onClick={() => {
                setActiveTab('home');
                setSelectedPosting(null);
                setIsOpen(false);
              }}
              className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-extrabold text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.5)] transition-all cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Main Page</span>
            </button>
          )}

          {/* Grid Menu of Tabs */}
          <div className="grid grid-cols-1 gap-2">
            <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black px-1">Jump to other pages:</span>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSelected = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSelectedPosting(null);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-[#221f42] border-[#7c3aed] text-white'
                      : 'bg-[#141030]/60 hover:bg-[#1a143f]/80 border-[#231a4f] text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#00e676] shadow-[0_0_8px_#00e676]"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Options */}
          <div className="pt-2 border-t border-[#201847] flex justify-between items-center text-[10px] text-slate-400 font-bold px-1">
            <button 
              onClick={() => {
                setActiveTab('contact');
                setIsOpen(false);
              }}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3 h-3 text-[#a78bfa]" />
              <span>Support Desk</span>
            </button>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>Secure India Gateway</span>
            </span>
          </div>

        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-[#120d2a]/95 hover:bg-[#1c153f] border border-[#302373] hover:border-[#4d36aa] text-white px-4 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(124,58,237,0.1)] hover:shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(124,58,237,0.25)] transition-all duration-300 cursor-pointer active:scale-95 group relative overflow-hidden ${
          isOpen ? 'ring-2 ring-[#7c3aed]' : ''
        }`}
        title="Open Navigation Hub"
        id="floating-navigation-hub-trigger"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-[#a78bfa] rotate-180 transition-transform duration-300" />
          ) : (
            <>
              <Compass className="w-5 h-5 text-purple-400 group-hover:rotate-45 transition-transform duration-500 animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#a78bfa]"></span>
              </span>
            </>
          )}
        </span>
        <span className="text-xs font-black uppercase tracking-wider pr-1">
          {isOpen ? 'Close Map' : 'Quick Nav'}
        </span>
      </button>

    </div>
  );
}
