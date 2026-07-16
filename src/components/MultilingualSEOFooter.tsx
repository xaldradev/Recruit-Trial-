import React, { useState } from 'react';
import { MapPin, Globe, Sparkles, ChevronDown, CheckCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { Language } from '../translations';

interface MultilingualSEOFooterProps {
  currentLanguage: Language;
  onChangeLanguage: (lang: Language) => void;
  onSelectRegion: (region: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function MultilingualSEOFooter({
  currentLanguage,
  onChangeLanguage,
  onSelectRegion,
  onNavigateTab
}: MultilingualSEOFooterProps) {
  const [expandedSection, setExpandedSection] = useState<'states' | 'languages' | null>(null);

  const indianStatesSEO = [
    { name: 'Odisha', key: 'OdishaGovt', query: 'Odisha OSSC OSSSC OPSC Exam guides', desc: 'Odisha State Government Jobs, Forest Guard, Junior Clerk, RI/AMIN registry', native: 'ଓଡ଼ିଶା' },
    { name: 'Bihar', key: 'AllIndiaGovt', query: 'Bihar BPSC BSSC Job notifications', desc: 'Bihar State Civil Services, police recruitment guides & teaching entries', native: 'बिहार' },
    { name: 'Uttar Pradesh', key: 'AllIndiaGovt', query: 'UP UPPSC UPSSSC Lekhpal vacancies', desc: 'Uttar Pradesh Subordinate Services, police constable & board syllabus', native: 'उत्तर प्रदेश' },
    { name: 'Maharashtra', key: 'AllIndiaGovt', query: 'Maharashtra MPSC Talathi Recruitment', desc: 'Maharashtra Civil Services, bank vacancies, and industrial upskilling', native: 'महाराष्ट्र' },
    { name: 'West Bengal', key: 'AllIndiaGovt', query: 'West Bengal WBPSC WBPRB notifications', desc: 'West Bengal municipal, clerkship, and cooperative sector job models', native: 'পশ্চিমবঙ্গ' },
    { name: 'Andhra Pradesh', key: 'AllIndiaGovt', query: 'AP APPSC Group 1 2 vacancies', desc: 'Andhra Pradesh state service, village secretariats, and technical hubs', native: 'ఆంధ్రప్రదేశ్' },
    { name: 'Tamil Nadu', key: 'AllIndiaGovt', query: 'Tamil Nadu TNPSC Group exams', desc: 'Tamil Nadu public service commissions, direct recruitments & tech entry', native: 'தமிழ்நாடு' },
    { name: 'Karnataka', key: 'AllIndiaGovt', query: 'Karnataka KPSC KSP Recruitment hub', desc: 'Karnataka state services, IT placements, and rural livelihood options', native: 'ಕರ್ನಾಟಕ' }
  ];

  const languagesSEO = [
    { code: 'en', label: 'English', native: 'English', locale: 'en_IN' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी', locale: 'hi_IN' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', locale: 'or_IN' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা', locale: 'bn_IN' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు', locale: 'te_IN' },
    { code: 'mr', label: 'Marathi', native: 'मराठी', locale: 'mr_IN' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்', locale: 'ta_IN' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', locale: 'gu_IN' },
    { code: 'ur', label: 'Urdu', native: 'اردو', locale: 'ur_IN' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', locale: 'kn_IN' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം', locale: 'ml_IN' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', locale: 'pa_IN' },
    { code: 'as', label: 'Assamese', native: 'অসমীয়া', locale: 'as_IN' }
  ];

  const handleStateClick = (stateKey: string, stateName: string) => {
    onSelectRegion(stateKey);
    onNavigateTab('jobs');
    // Scroll smoothly to filtered listings
    setTimeout(() => {
      const anchor = document.getElementById('filtered-listings-anchor');
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  return (
    <div id="multilingual-seo-hub" className="bg-[#090715] border border-[#211545] rounded-3xl p-6 md:p-8 space-y-8 text-left relative overflow-hidden shadow-[0_10px_35px_rgba(13,8,34,0.7)]">
      {/* Decorative cyber ambient backgrounds */}
      <div className="absolute right-0 bottom-0 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute left-0 top-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header section with brand and description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#211b3e]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400 animate-spin-slow" />
            <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>National SEO Directory Hub</span>
              <span className="bg-[#00f3ff]/10 text-[#00f3ff] text-[9px] px-2 py-0.5 rounded-full border border-[#00f3ff]/20 font-black tracking-widest uppercase">Verified</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-medium max-w-2xl">
            Optimized for multi-state and multi-lingual indexability under Google's 2026 Core algorithm updates. Delivering localized career registries, dynamic syllabus guides, and verified job postings for students & job seekers across India.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setExpandedSection(expandedSection === 'states' ? null : 'states')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${expandedSection === 'states' ? 'bg-purple-950/40 text-purple-300 border-purple-500/50 shadow-inner' : 'bg-[#120d2a] text-slate-300 border-[#231a47] hover:border-purple-500/40'}`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target States ({indianStatesSEO.length})</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expandedSection === 'states' ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setExpandedSection(expandedSection === 'languages' ? null : 'languages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${expandedSection === 'languages' ? 'bg-purple-950/40 text-purple-300 border-purple-500/50 shadow-inner' : 'bg-[#120d2a] text-slate-300 border-[#231a47] hover:border-purple-500/40'}`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>All Languages ({languagesSEO.length})</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expandedSection === 'languages' ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid 1: Indian States Target Matrix */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> State-Specific Career Portals & Vacancy Registries
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {indianStatesSEO.map((state) => (
            <div
              key={state.name}
              onClick={() => handleStateClick(state.key, state.name)}
              className="group bg-[#110d29]/50 hover:bg-[#150f34]/80 border border-[#211746] hover:border-purple-500/40 rounded-2xl p-4 transition-all duration-300 cursor-pointer text-left relative hover:shadow-[0_4px_15px_rgba(124,58,237,0.1)] active:scale-95"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-white tracking-wide group-hover:text-purple-300 flex items-center gap-1.5">
                  <span>{state.name} Jobs</span>
                  <span className="text-[10px] text-slate-500 font-medium">({state.native})</span>
                </span>
                <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-semibold">
                {state.desc}
              </p>
              <div className="mt-2.5 pt-2 border-t border-[#1e133d] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                  Live {state.name} Gazettes Indexed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid 2: Indian Languages SEO Matrix */}
      <div className="space-y-4 pt-4 border-t border-[#211b3e]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" /> Real-time Localized Mother Tongue Swappers (hreflang alternates)
          </h4>
          <span className="text-[10px] text-purple-400 font-bold bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-2 py-0.5 rounded-md">
            ISO 639-1 Compliant Meta Indexing
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {languagesSEO.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onChangeLanguage(lang.code as Language)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 border relative ${isSelected ? 'bg-purple-950/40 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/5' : 'bg-[#100c25] text-slate-300 border-[#201844] hover:bg-[#161033] hover:border-purple-500/30'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`}></span>
                <span className="font-extrabold">{lang.native}</span>
                <span className="text-[9px] text-slate-500 uppercase">({lang.code})</span>
                {isSelected && (
                  <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Informational SEO schema footer section */}
      <div className="bg-[#110d29]/40 border border-[#211746] rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-slate-300 font-semibold">
            Did you know? Recruit.org.in targets regional queries directly in native languages like Odia and Hindi, scoring perfect scores in local search queries!
          </span>
        </div>
        <button
          onClick={() => onNavigateTab('faqs')}
          className="text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1"
        >
          <span>Learn about local SEO mapping</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
