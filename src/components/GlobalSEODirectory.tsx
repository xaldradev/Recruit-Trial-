import React, { useState } from 'react';
import { Globe, MapPin, Flag, X, Search, Sparkles, Check, Compass, Loader2 } from 'lucide-react';
import { GLOBAL_LANGUAGES, INDIAN_STATES, WORLD_COUNTRIES } from '../data/seoLocationsData';
import { Language } from '../translations';
import { reverseGeocode } from '../utils/geolocation';

interface GlobalSEODirectoryProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onSelectState?: (stateName: string) => void;
  onSelectCountry?: (countryCode: string) => void;
  onTriggerAutoLocation?: () => void;
}

export default function GlobalSEODirectory({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  onSelectState,
  onSelectCountry,
  onTriggerAutoLocation
}: GlobalSEODirectoryProps) {
  const [activeTab, setActiveTab] = useState<'languages' | 'states' | 'countries'>('languages');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoStatusMsg, setGeoStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoDetect = () => {
    if (onTriggerAutoLocation) {
      onTriggerAutoLocation();
      onClose();
      return;
    }

    if (!('geolocation' in navigator)) {
      setGeoStatusMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsGeolocating(true);
    setGeoStatusMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          setIsGeolocating(false);
          if (res.state && onSelectState) {
            onSelectState(res.state.name);
            setGeoStatusMsg(`Matched State: ${res.state.name}!`);
            const newPath = `/state/${res.state.slug}`;
            window.history.pushState(null, '', newPath);
            setTimeout(() => onClose(), 800);
          } else if (res.country && onSelectCountry) {
            onSelectCountry(res.country.code);
            setGeoStatusMsg(`Matched Country: ${res.country.name}!`);
            const newPath = `/country/${res.country.code.toLowerCase()}`;
            window.history.pushState(null, '', newPath);
            setTimeout(() => onClose(), 800);
          } else {
            setGeoStatusMsg('Location detected, but no matching state found. Please pick from list.');
          }
        } catch (err) {
          setIsGeolocating(false);
          setGeoStatusMsg('Failed to resolve location details.');
        }
      },
      (err) => {
        setIsGeolocating(false);
        setGeoStatusMsg(err.code === err.PERMISSION_DENIED ? 'Location permission was denied.' : 'Unable to retrieve location.');
      },
      { timeout: 8000 }
    );
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, type: 'lang' | 'state' | 'country', value: string) => {
    e.preventDefault();
    if (type === 'lang') {
      onSelectLanguage(value as Language);
      const newPath = value === 'en' ? '/' : `/${value}`;
      window.history.pushState(null, '', newPath);
    } else if (type === 'state') {
      if (onSelectState) onSelectState(value);
      const newPath = `/state/${value.toLowerCase().replace(/\s+/g, '-')}`;
      window.history.pushState(null, '', newPath);
    } else if (type === 'country') {
      if (onSelectCountry) onSelectCountry(value);
      const countryObj = WORLD_COUNTRIES.find(c => c.code.toLowerCase() === value.toLowerCase() || c.name.toLowerCase() === value.toLowerCase());
      if (countryObj && countryObj.primaryLang) {
        onSelectLanguage(countryObj.primaryLang as Language);
      }
      const newPath = `/country/${value.toLowerCase()}`;
      window.history.pushState(null, '', newPath);
    }
    onClose();
  };

  const filteredLanguages = GLOBAL_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStates = INDIAN_STATES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCountries = WORLD_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-[#0b081e] border-2 border-indigo-500/40 text-slate-100 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(124,58,237,0.35)] overflow-hidden relative my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-4 relative z-10 bg-[#0d0924]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Country, State & Language
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  Select Region
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Switch language, Indian state opportunities portal, or global country portal.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700/80 transition-all cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search & Tabs Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 space-y-3.5 bg-[#0e0a29]/60 relative z-10">
          {/* Search box & Auto-Detect button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search language, state (e.g. Odisha, Delhi), or country..."
                className="w-full bg-slate-900/90 border border-slate-700/80 focus:border-indigo-500 text-white rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={handleAutoDetect}
              disabled={isGeolocating}
              className="bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {isGeolocating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Compass className="w-3.5 h-3.5" />
                  <span>Auto-Detect My Location</span>
                </>
              )}
            </button>
          </div>

          {geoStatusMsg && (
            <div className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{geoStatusMsg}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('languages')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'languages'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-slate-800/40 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Languages ({GLOBAL_LANGUAGES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('states')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'states'
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-sm'
                  : 'bg-slate-800/40 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Indian States & UTs ({INDIAN_STATES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('countries')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'countries'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-sm'
                  : 'bg-slate-800/40 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-cyan-400" />
              <span>World Countries ({WORLD_COUNTRIES.length})</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 relative z-10">
          {/* Languages Grid */}
          {activeTab === 'languages' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Select Regional / International Language:
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {filteredLanguages.length} result{filteredLanguages.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredLanguages.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No languages matched "{searchQuery}"
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                  {filteredLanguages.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <a
                        key={lang.code}
                        href={lang.path}
                        onClick={(e) => handleLinkClick(e, 'lang', lang.code)}
                        className={`p-3 rounded-2xl border transition-all flex flex-col gap-1 text-left relative group ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold shadow-md'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-emerald-500/40 hover:bg-slate-800/90 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg">{lang.flag}</span>
                          <div className="flex items-center gap-1">
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-400 uppercase">
                              {lang.code}
                            </span>
                          </div>
                        </div>
                        <span className="font-extrabold text-slate-100 mt-1 line-clamp-1">{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{lang.name} • {lang.region}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Indian States Grid */}
          {activeTab === 'states' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Select Indian State / Union Territory Portal:
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {filteredStates.length} result{filteredStates.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredStates.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No state matched "{searchQuery}"
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                  {filteredStates.map((state) => (
                    <a
                      key={state.slug}
                      href={state.path}
                      onClick={(e) => handleLinkClick(e, 'state', state.name)}
                      className="p-3 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-1 text-slate-300 hover:text-white group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-100 truncate group-hover:text-indigo-300 transition-colors">{state.name}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-400 uppercase">
                          {state.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-indigo-300/90 font-medium">{state.nativeName}</span>
                      <span className="text-[10px] text-slate-400">Capital: {state.capital}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* World Countries Grid */}
          {activeTab === 'countries' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Flag className="w-3.5 h-3.5 text-cyan-400" />
                  Select Global Country Node:
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {filteredCountries.length} result{filteredCountries.length !== 1 ? 's' : ''}
                </span>
              </div>

              {filteredCountries.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No country matched "{searchQuery}"
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                  {filteredCountries.map((c) => (
                    <a
                      key={c.code}
                      href={c.path}
                      onClick={(e) => handleLinkClick(e, 'country', c.code)}
                      className="p-3 rounded-2xl border border-slate-800/90 bg-slate-900/60 hover:bg-slate-800 hover:border-cyan-500/50 transition-all flex items-center gap-3 text-slate-300 hover:text-white group"
                    >
                      <span className="text-2xl shrink-0">{c.flag}</span>
                      <div className="flex flex-col truncate">
                        <span className="font-extrabold text-slate-100 truncate group-hover:text-cyan-300 transition-colors">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">/country/{c.code.toLowerCase()}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0c0822] text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span>Arohi AI Multilingual Engine • Instant Localization for 150+ Languages & Regional Portals</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all text-xs cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
