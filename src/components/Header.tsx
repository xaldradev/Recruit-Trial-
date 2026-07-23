import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, Sparkles, Award, Menu, X, Landmark, Briefcase, Settings, User, BookOpen, FileText, ChevronDown, LogOut, LogIn, ShieldCheck, Globe, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Language, getTranslation } from '../translations';
import ArohiAvatar from './ArohiAvatar';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onOpenAuth: () => void;
  onRevisitWelcome?: () => void;
  onStartTour?: () => void;
  onOpenSeoHub?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onShare?: () => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export const COUNTRIES_LIST = [
  { code: 'Global', name: 'Global Opportunities', flag: '🌐' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' }
] as const;

export const LANGUAGES_LIST = [
  { code: 'en', native: 'English', symbol: 'AA', english: '' },
  { code: 'hi', native: 'हिंदी', english: 'Hindi', symbol: 'अ' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', symbol: 'ଅ' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', symbol: 'বা' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', symbol: 'తె' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', symbol: 'म' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', symbol: 'த' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', symbol: 'ગુ' },
  { code: 'ur', native: 'اردو', english: 'Urdu', symbol: 'ا' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', symbol: 'ಕ' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam', symbol: 'മ' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', symbol: 'ਪ' },
  { code: 'as', native: 'অসমীয়া', english: 'Assamese', symbol: 'অ' }
] as const;

export default function Header({ activeTab, onTabChange, onSearchChange, searchQuery, onOpenAuth, onRevisitWelcome, onStartTour, onOpenSeoHub, language, onLanguageChange, onShare, selectedCountry, onCountryChange }: HeaderProps) {
  const { user, userData, signOutUser } = useAuth();

  const [countdown, setCountdown] = useState({ hours: 23, minutes: 45, seconds: 20 });
  const [isHeaderLangOpen, setIsHeaderLangOpen] = useState(false);
  const [isHeaderRegionOpen, setIsHeaderRegionOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const headerLangRef = useRef<HTMLDivElement>(null);
  const headerRegionRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerLangRef.current && !headerLangRef.current.contains(event.target as Node)) {
        setIsHeaderLangOpen(false);
      }
      if (headerRegionRef.current && !headerRegionRef.current.contains(event.target as Node)) {
        setIsHeaderRegionOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target as Node)) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLangVisual = (lang: Language) => {
    switch (lang) {
      case 'en': return 'AA';
      case 'hi': return 'अ';
      case 'or': return 'ଅ';
      case 'bn': return 'বা';
      case 'te': return 'తె';
      case 'mr': return 'म';
      case 'ta': return 'த';
      case 'gu': return 'ગુ';
      case 'ur': return 'ا';
      case 'kn': return 'ಕ';
      case 'ml': return 'മ';
      case 'pa': return 'ਪ';
      case 'as': return 'অ';
      default: return 'AA';
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let s = prev.seconds - 1;
        let m = prev.minutes;
        let h = prev.hours;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const padZero = (num: number) => num.toString().padStart(2, '0');

  const navLinks = [
    { id: 'home', label: getTranslation('home', language), hasDropdown: false },
    { id: 'dashboard', label: getTranslation('dashboard', language), hasDropdown: false },
    { id: 'jobs', label: getTranslation('jobs', language), hasDropdown: true },
    { id: 'courses', label: getTranslation('skills', language), hasDropdown: true },
    { id: 'syllabus', label: getTranslation('syllabus', language), hasBadge: true, badgeText: 'Odia/CBSE' },
    { id: 'business', label: getTranslation('business', language), hasBadge: true, badgeText: 'New' },
    { id: 'franchise', label: 'Franchise (AECN)', hasBadge: true, badgeText: 'AI Hub' },
    { id: 'arohi', label: getTranslation('arohiChat', language), hasDropdown: false },
    { id: 'employer', label: 'Recruiters', hasBadge: true, badgeText: 'Free' },
    { id: 'privacy', label: 'Privacy', hasDropdown: false },
    { id: 'terms', label: 'Terms', hasDropdown: false },
    { id: 'refunds', label: 'Refund', hasDropdown: false },
    { id: 'payments', label: 'Payment', hasDropdown: false },
    { id: 'contact', label: 'Contact', hasDropdown: false }
  ];

  const primaryLinks = navLinks.filter(l => !['privacy', 'terms', 'refunds', 'payments', 'contact'].includes(l.id));
  const secondaryLinks = navLinks.filter(l => ['privacy', 'terms', 'refunds', 'payments', 'contact'].includes(l.id));

  return (
    <header className="sticky top-0 z-50 bg-[#06040b] border-b border-[#171329] text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
      
      {/* Top micro promo banner - Replaced with premium Apple-style status announcement */}
      <div className="bg-gradient-to-r from-[#070510] via-[#100a29] to-[#070510] text-slate-300 text-xs py-2 px-4 flex justify-center items-center gap-3 overflow-hidden border-b border-[#1b1535] text-center shadow-md">
        <div className="flex items-center gap-2.5 font-medium text-slate-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide text-[10px] sm:text-xs font-semibold text-slate-200">
            {getTranslation('registryActive', language)}
          </span>
          <span className="text-[#3b3261] hidden sm:inline">•</span>
          <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 inline" /> {getTranslation('portalVerification', language)}
          </span>
          <span className="text-[#3b3261] hidden md:inline">•</span>
          <span className="text-[10px] sm:text-xs text-slate-400 hidden md:inline">
            {getTranslation('liveVacancies', language)}
          </span>
        </div>
      </div>

      {/* Main Navbar: Height 80px */}
      <div className="max-w-7xl mx-auto px-4 min-h-20 h-auto py-2 sm:py-0 flex justify-between items-center gap-4">
        
        {/* Left Side: Logo */}
        <div 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Custom Arohi AI Avatar Cosmic Orb Icon */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 relative group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
            <ArohiAvatar className="w-full h-full" />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight select-none leading-none text-white">
              Arohi AI
            </h1>
            <span className="text-[9px] sm:text-xs text-slate-400 font-semibold tracking-normal mt-0.5 leading-tight max-w-[180px] sm:max-w-none">
              {getTranslation('slogan', language)}
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation links */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 text-[11px] xl:text-xs">
          {primaryLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`px-1.5 xl:px-3 py-1.5 rounded-xl text-[10px] xl:text-xs font-bold transition-all cursor-pointer flex items-center gap-0.5 xl:gap-1 whitespace-nowrap ${
                activeTab === link.id
                  ? 'bg-[#221f42] text-white border border-[#4c3ba0]/50'
                  : 'text-slate-300 hover:text-white hover:bg-[#15122e]/60'
              }`}
            >
              <span>{link.label}</span>
              {link.hasDropdown && <ChevronDown className="w-3 h-3 opacity-60" />}
              {link.hasBadge && (
                <span className="bg-[#7c3aed] text-white text-[9px] font-black px-1.5 py-0.5 rounded ml-1 animate-pulse uppercase">
                  {link.badgeText}
                </span>
              )}
            </button>
          ))}

          {/* More Dropdown (Vertically expands when clicked) */}
          <div className="relative" ref={moreDropdownRef}>
            <button
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
              className={`px-1.5 xl:px-3 py-1.5 rounded-xl text-[10px] xl:text-xs font-bold transition-all cursor-pointer flex items-center gap-0.5 xl:gap-1.5 whitespace-nowrap ${
                secondaryLinks.some(l => l.id === activeTab)
                  ? 'bg-[#221f42] text-white border border-[#4c3ba0]/50'
                  : 'text-slate-300 hover:text-white hover:bg-[#15122e]/60'
              }`}
            >
              <span>More Policies</span>
              <ChevronDown className={`w-3 h-3 opacity-60 transition-transform duration-350 ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isMoreDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-48 bg-[#0c0820] border border-[#2d1b54] rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-md z-50 overflow-hidden py-1.5 text-left"
                >
                  {secondaryLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        onTabChange(link.id);
                        setIsMoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all cursor-pointer hover:bg-white/5 flex items-center justify-between ${
                        activeTab === link.id ? 'bg-[#7c3aed]/25 text-purple-200' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Side: CTA and Mobile toggle */}
        <div className="flex items-center gap-2.5">

          {/* Trust Seal Logo for Authentic Feel */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#060e0a]/90 border border-emerald-500/30 rounded-xl shadow-[0_0_12px_rgba(16,185,129,0.08)] select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00e676] shrink-0 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black tracking-wider text-[#00e676] leading-none uppercase">
                Verified Safe
              </span>
              <span className="text-[7px] font-bold text-slate-400 tracking-wider leading-none mt-0.5 uppercase">
                ISO 9001:2015 TRUSTED
              </span>
            </div>
          </div>

          {/* Global & India SEO Directory Button */}
          {onOpenSeoHub && (
            <button
              onClick={onOpenSeoHub}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-cyan-950/80 to-teal-950/80 border border-cyan-500/40 hover:border-cyan-400 rounded-xl text-cyan-300 hover:text-white text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
              title="Open Global & India SEO Career Directory (Odisha & States)"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span>SEO Hub (Odisha/India)</span>
            </button>
          )}

          {/* Sleek Globe Language Selector */}
          <div className="relative" ref={headerLangRef}>
            <button
              onClick={() => setIsHeaderLangOpen(!isHeaderLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0f0e1a]/80 border border-slate-800 rounded-xl hover:bg-[#161427]/80 hover:border-purple-500/40 transition-all shadow-sm cursor-pointer min-w-[70px] justify-between"
              title="Change Language / ਭାଷା ବଦଳାନ୍ତୁ"
            >
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-200 hover:text-white text-[11px] font-extrabold font-sans tracking-wide">
                  {getLangVisual(language)}
                </span>
              </div>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-300 ${isHeaderLangOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
              className={`absolute right-0 mt-2 w-52 max-h-80 overflow-y-auto bg-[#07060f]/95 border border-slate-800 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent ${
                isHeaderLangOpen
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              } z-[60]`}
            >
              <div className="px-3.5 py-2 border-b border-slate-800/40 text-[10px] text-slate-400 font-bold uppercase tracking-wider sticky top-0 bg-[#07060f] z-10">
                {getTranslation('selectLang', language)}
              </div>
              {LANGUAGES_LIST.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code as Language);
                    setIsHeaderLangOpen(false);
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

          {/* The Globe Language Selector is kept exactly as it is and wherever it is */}

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Account details badge */}
              <div 
                onClick={() => onTabChange('dashboard')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 bg-[#17113a] border border-[#3b289c] rounded-full cursor-pointer hover:bg-[#251b5c] transition-all"
                title="Go to User Dashboard"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white text-[10px] font-black uppercase">
                  {userData?.profile?.name?.slice(0, 2) || user.displayName?.slice(0, 2) || 'IN'}
                </div>
                <div className="text-left hidden xs:block sm:block">
                  <p className="text-[10px] font-black text-white leading-tight uppercase tracking-wider truncate max-w-[70px] sm:max-w-[90px]">
                    {userData?.profile?.name || user.displayName || 'Guest'}
                  </p>
                  <p className="text-[8px] text-slate-400 font-bold leading-none uppercase">
                    {userData?.profile?.location || 'India'}
                  </p>
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => signOutUser()}
                className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 cursor-pointer transition-all active:scale-95 flex items-center gap-1 text-[9px] font-black uppercase tracking-wider"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Sign In Button */}
              <button
                onClick={onOpenAuth}
                className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-purple-500/30 hover:border-purple-400/60 text-purple-300 hover:text-white text-[11px] sm:text-xs font-bold transition-all cursor-pointer bg-[#0f0a28]/40 whitespace-nowrap"
              >
                Sign In
              </button>

              {/* Join Now Glowing Gradient Button */}
              <button
                onClick={onOpenAuth}
                className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider py-1.5 sm:py-2 px-3 sm:px-6 rounded-full shadow-[0_0_15px_rgba(124,58,237,0.4)] hover:shadow-[0_0_20px_rgba(124,58,237,0.6)] transition-all cursor-pointer transform hover:scale-[1.02] whitespace-nowrap"
              >
                Sign Up
              </button>
            </div>
          )}

        </div>

      </div>

    </header>
  );
}
