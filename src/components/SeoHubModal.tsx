import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, MapPin, Globe, Sparkles, Building2, GraduationCap, Briefcase, 
  ChevronRight, Mic, CheckCircle2, HelpCircle, PhoneCall, Award, Users, 
  Compass, Landmark, BookOpen, Layers, ArrowUpRight, Flame, ShieldAlert, Cpu
} from 'lucide-react';

interface SeoHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVoiceContext?: (contextPrompt: string, langName?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

// Odisha Localized Search Terms & Entities
const ODISHA_HUBS = [
  {
    city: "Bhubaneswar",
    title: "Capital Tech & Education Hub",
    description: "Software export hub (Infocity, TCS, Wipro, Infosys), AIIMS Bhubaneswar, Utkal University, KIIT, SOA, World Skill Centre.",
    keywords: ["bhubaneswar IT jobs", "aiims bhubaneswar career", "infocity jobs 2026", "utkal university syllabus", "world skill centre odisha"]
  },
  {
    city: "Cuttack",
    title: "Silver City - Legal, Medical & Heritage",
    description: "SCB Medical College, Orissa High Court, Ravenshaw University, National Law University Odisha (NLUO).",
    keywords: ["scb medical entrance", "ravenshaw university admissions", "orissa high court clerk jobs", "cuttack business setup"]
  },
  {
    city: "Rourkela",
    title: "Steel & Engineering Excellence",
    description: "NIT Rourkela, Rourkela Steel Plant (SAIL), BPUT central campus, industrial MSMEs.",
    keywords: ["nit rourkela placement", "sail rourkela jobs", "bput syllabus guide", "rourkela engineering MSME"]
  },
  {
    city: "Sambalpur",
    title: "Western Odisha Education & Mining",
    description: "Sambalpur University, VSSUT Burla, VIMSAR, MCL mining opportunities.",
    keywords: ["vssut burla placements", "mcl job form", "sambalpur university result", "vimsar medical recruitment"]
  },
  {
    city: "Berhampur & Ganjam",
    title: "Southern Trade & Academic Portal",
    description: "Berhampur University, MKCG Medical College, Gopalpur Port industrial cluster.",
    keywords: ["berhampur university exam", "mkcg doctor vacancies", "gopalpur port careers"]
  }
];

const ODISHA_EXAMS_SCHEMES = [
  {
    name: "OPSC (Odisha Public Service Commission)",
    tag: "OAS / OPS / OFS Recruitment",
    description: "Complete Syllabus guidance, mock interview practice in Odia/English, prelims & mains strategy."
  },
  {
    name: "OSSC & OSSSC Exams",
    tag: "CGL, RI, AMIN, Executive Officer",
    description: "Previous year question papers, computer skill test preparation, and Odia grammar notes."
  },
  {
    name: "CHSE Odisha (Class 12th)",
    tag: "Science, Arts, Commerce Streams",
    description: "Board exam question banks, model papers, chapter summaries, and career counseling after 12th."
  },
  {
    name: "Subhadra Yojana & KALIA Scheme",
    tag: "Odisha Govt Financial Assistance",
    description: "Eligibility checking, application form submission guide, direct benefit transfer (DBT) helpline."
  },
  {
    name: "Startup Odisha & MSME Udyam",
    tag: "Entrepreneurship Grants & Incubation",
    description: "Seed funding registration, Udyam certificate, MSME loan guidance, and GST help for Odisha founders."
  }
];

const INDIAN_STATES_ARRAY = [
  { name: "Odisha", focus: "OPSC, CHSE, Subhadra Yojana, Bhubaneswar Tech Hub", count: "12,400+ Queries/mo", region: "East" },
  { name: "Maharashtra", focus: "MPSC, Mumbai Finance, Pune Tech, ITI Skill", count: "45,000+ Queries/mo", region: "West" },
  { name: "Karnataka", focus: "Bengaluru Tech Jobs, KCET, Startup Capital", count: "52,000+ Queries/mo", region: "South" },
  { name: "Tamil Nadu", focus: "TNPSC, Chennai Auto Hub, Anna University", count: "38,000+ Queries/mo", region: "South" },
  { name: "Delhi NCR", focus: "UPSC IAS, DU Admissions, SSC CGL, Corporate", count: "65,000+ Queries/mo", region: "North" },
  { name: "West Bengal", focus: "WBPSC, WBJEE, Kolkata Tech, Jadavpur Univ", count: "28,000+ Queries/mo", region: "East" },
  { name: "Telangana", focus: "TSPSC, T-Hub Hyderabad, Pharma & IT Hub", count: "34,000+ Queries/mo", region: "South" },
  { name: "Uttar Pradesh", focus: "UPPSC, Noida Tech Park, BHU, Police Constable", count: "58,000+ Queries/mo", region: "North" },
  { name: "Gujarat", focus: "Gift City, GIDC MSME, iCreate, GATE Gujarat", count: "29,000+ Queries/mo", region: "West" },
  { name: "Kerala", focus: "Technopark, K-DISC, Nursing & Overseas Careers", count: "22,000+ Queries/mo", region: "South" },
  { name: "Punjab & Haryana", focus: "IELTS & Overseas Jobs, Agriculture MSME", count: "31,000+ Queries/mo", region: "North" },
  { name: "Bihar & Jharkhand", focus: "BPSC, JPSC, Railway Recruitment, Mining", count: "42,000+ Queries/mo", region: "East" },
  { name: "Assam & North East", focus: "APSC, Tea Estates MSME, Gauhati Univ", count: "18,000+ Queries/mo", region: "North East" },
  { name: "Rajasthan & MP", focus: "Kota Coaching Guide, MPPSC, REET, RPSC", count: "36,000+ Queries/mo", region: "Central" }
];

const GLOBAL_REGIONS_ARRAY = [
  { country: "United States (USA)", flag: "🇺🇸", highlight: "H-1B Visa Prep, STEM OPT Jobs, Silicon Valley Tech", audience: "120k Search Index" },
  { country: "United Kingdom (UK)", flag: "🇬🇧", highlight: "NHS Healthcare Doctors, London Finance, University Masters", audience: "85k Search Index" },
  { country: "UAE & GCC Countries", flag: "🇦🇪", highlight: "Dubai Tech, Abu Dhabi Energy, MSME Business Setup", audience: "140k Search Index" },
  { country: "Canada", flag: "🇨🇦", highlight: "Express Entry PR, Tech Careers, Toronto & Vancouver Jobs", audience: "95k Search Index" },
  { country: "Germany & EU", flag: "🇩🇪", highlight: "Opportunity Card (Chancenkarte), Engineering Careers", audience: "75k Search Index" },
  { country: "Singapore & East Asia", flag: "🇸🇬", highlight: "Fintech, Global Logistics, Regional Career Mentorship", audience: "60k Search Index" }
];

const AUDIENCE_SEO_TARGETS = [
  { title: "Students & School Learners", icon: GraduationCap, detail: "Board exam notes (CHSE/CBSE/ICSE), NEET/JEE mock tests, skill roadmaps, and career pathway discovery." },
  { title: "Job Seekers & Freshers", icon: Briefcase, detail: "Free ATS resume builder, 1-click voice mock interviews, fresh graduate job alerts in top MNCs & startups." },
  { title: "MSMEs & Entrepreneurs", icon: Building2, detail: "Udyam Aadhaar registration, government subsidy finder, business pitch builder, GST compliance guide." },
  { title: "Govt Job Aspirants (Sarkari)", icon: Landmark, detail: "UPSC, OPSC, SSC, Railway RRB, Bank PO notification analyzer, admit card updates, syllabus trackers." },
  { title: "Teachers & Professors", icon: BookOpen, detail: "AI lesson plan creator, research paper writing helper, university syllabus design, student evaluation tools." },
  { title: "Scientists & Researchers", icon: Cpu, detail: "Grant proposal drafting, literature review summarizer, ISRO/DRDO job alerts, data modeling assistance." },
  { title: "Doctors & Healthcare Workers", icon: Users, detail: "NEET PG strategy, hospital vacancy tracker, medical research summaries, clinical case discussions." },
  { title: "Aliens & Space Explorers 🛸", icon: Globe, detail: "Intergalactic universal communication engine, planetary orbital career matrix, multi-species harmony guide!" }
];

const FREQUENT_SEARCH_FAQS = [
  {
    q: "How can Arohi AI assist Odisha students in OPSC & CHSE Board Exams?",
    a: "Arohi AI offers customized Odia and English study material, previous year question paper solutions, chapter breakdowns for CHSE Odisha Class 12 Science/Arts/Commerce, and real-time voice interview practice for OPSC Civil Services (OAS)."
  },
  {
    q: "Can I talk to Arohi AI directly over voice in Odia, Hindi, or English?",
    a: "Yes! Arohi AI features a high-speed interactive voice engine. Click the microphone button anytime on arohiai.com to start a natural spoken call in Odia, Hindi, Bengali, Tamil, Telugu, Marathi, Kannada, Malayalam, English, and 150+ global languages."
  },
  {
    q: "How do I check my ATS Resume Score for jobs in Bengaluru, Mumbai, or Bhubaneswar?",
    a: "Navigate to the Resume section on Arohi AI, upload or paste your resume text, and select your target role or city. Arohi AI will generate a detailed 100-point ATS score with keyword gap analysis and instant bullet point improvements."
  },
  {
    q: "How does Arohi AI help MSME owners register Udyam and apply for Subhadra Yojana?",
    a: "Arohi AI guides entrepreneurs step-by-step through Udyam registration, GST application, Startup Odisha recognition, MUDRA loans, and financial welfare schemes like Odisha Subhadra Yojana."
  }
];

export default function SeoHubModal({ isOpen, onClose, onSelectVoiceContext, onNavigateTab }: SeoHubModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'odisha' | 'india' | 'global' | 'audiences' | 'faqs'>('odisha');

  if (!isOpen) return null;

  const handleVoiceLaunch = (contextPrompt: string, langName: string = 'Odia') => {
    if (onSelectVoiceContext) {
      onSelectVoiceContext(contextPrompt, langName);
    }
    onClose();
  };

  const filterText = searchTerm.toLowerCase().trim();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-5xl bg-[#030712] border border-cyan-500/30 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] text-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header Bar */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-[#070e24] via-[#0b1739] to-[#030712] border-b border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                  Global & India SEO Directory
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 uppercase tracking-widest">
                  arohiai.com Live
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                <span>AROHI AI Global & Regional Search Index</span>
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">150+ Langs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting 20+ Audiences • Deep Odisha & 28 Indian States Focus • Global Career & MSME Guidance
              </p>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/10"
              title="Close SEO Hub"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar & Tab Controls */}
          <div className="p-4 bg-[#070e24]/80 border-b border-slate-800 shrink-0 space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                placeholder="Search keywords (e.g. Odisha OPSC, Subhadra Yojana, Bengaluru IT jobs, CHSE Board, USA STEM visa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#020617] border border-cyan-500/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setActiveTab('odisha')}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'odisha'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                Odisha Deep Focus (Special)
              </button>

              <button
                onClick={() => setActiveTab('india')}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'india'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Landmark className="w-3.5 h-3.5 text-amber-300" />
                28 Indian States & UTs
              </button>

              <button
                onClick={() => setActiveTab('global')}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'global'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-300" />
                Global Regions (USA, UK, UAE)
              </button>

              <button
                onClick={() => setActiveTab('audiences')}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'audiences'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-fuchsia-300" />
                20+ Target Audiences
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'faqs'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
                SEO Search FAQs & voice
              </button>
            </div>
          </div>

          {/* Main Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-[#020617]">

            {/* TAB 1: ODISHA DEEP FOCUS */}
            {activeTab === 'odisha' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-teal-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                        Odisha Regional Hub
                      </span>
                      <span className="text-xs text-slate-400">Targeting 30 Districts & All Major Cities</span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">
                      Arohi AI for Odisha: Education, Sarkari Exams, Subhadra Yojana & MSMEs
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Integrated voice support in Odia (ଓଡ଼ିଆ). Get instant exam help, resume score, and local job alerts in Bhubaneswar, Cuttack, Rourkela, Sambalpur & Berhampur.
                    </p>
                  </div>

                  <button
                    onClick={() => handleVoiceLaunch("I am from Odisha. Please guide me about local job opportunities, OPSC/OSSC exam preparation, and Subhadra Yojana in Odia or English.", "Odia")}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2 shrink-0"
                  >
                    <Mic className="w-4 h-4 text-slate-950" />
                    Speak to Arohi AI in Odia (ଓଡ଼ିଆ)
                  </button>
                </div>

                {/* Odisha Key Cities & Clusters */}
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    Odisha Major Educational & Economic Hubs
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ODISHA_HUBS.filter(h => filterText === '' || h.city.toLowerCase().includes(filterText) || h.description.toLowerCase().includes(filterText)).map((hub, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#09122c]/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all group">
                        <div className="flex items-center justify-between">
                          <h5 className="font-extrabold text-cyan-200 text-base">{hub.city}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/20">OD-Hub</span>
                        </div>
                        <p className="text-xs text-teal-300 font-semibold mt-0.5">{hub.title}</p>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{hub.description}</p>
                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-mono">Searched keywords: {hub.keywords.length}</span>
                          <button
                            onClick={() => handleVoiceLaunch(`Provide detailed career guidance for ${hub.city} students and job seekers regarding ${hub.keywords.join(', ')}.`, "Odia")}
                            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          >
                            Explore {hub.city} AI Guide <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Odisha Exams & Government Schemes */}
                <div>
                  <h4 className="text-sm font-bold text-teal-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-teal-400" />
                    Odisha Competitive Exams, CHSE Board & Welfare Schemes
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {ODISHA_EXAMS_SCHEMES.filter(e => filterText === '' || e.name.toLowerCase().includes(filterText) || e.description.toLowerCase().includes(filterText)).map((item, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-[#071626]/80 border border-teal-500/20 hover:border-teal-400/50 transition-all">
                        <div className="flex items-center justify-between">
                          <h5 className="font-extrabold text-white text-sm">{item.name}</h5>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium">{item.tag}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.description}</p>
                        <button
                          onClick={() => handleVoiceLaunch(`Explain how Arohi AI can help me with ${item.name} step by step in Odia and English.`, "Odia")}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30 transition-colors flex items-center gap-1.5"
                        >
                          <Mic className="w-3.5 h-3.5" /> Start {item.name} Voice Session
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 28 INDIAN STATES & UTs */}
            {activeTab === 'india' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">All India 28 States & 8 Union Territories Directory</h3>
                    <p className="text-xs text-slate-400">Localized search terms for competitive exams, state IT hubs, and state government schemes.</p>
                  </div>
                  <span className="text-xs text-cyan-400 font-mono bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    500,000+ Indian Monthly Search Index
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INDIAN_STATES_ARRAY.filter(s => filterText === '' || s.name.toLowerCase().includes(filterText) || s.focus.toLowerCase().includes(filterText)).map((st, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#081028] border border-slate-800 hover:border-cyan-500/40 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-white text-base flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                          {st.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{st.region}</span>
                      </div>
                      <p className="text-xs text-cyan-300 mt-1 font-medium">{st.focus}</p>
                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">{st.count}</span>
                        <button
                          onClick={() => handleVoiceLaunch(`Provide localized career, exam, and business advice for job seekers in ${st.name} focusing on ${st.focus}.`, "Hindi")}
                          className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
                        >
                          Launch {st.name} Guide <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: GLOBAL REGIONS */}
            {activeTab === 'global' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">Global Target Regions & International Careers</h3>
                    <p className="text-xs text-slate-400">Visa requirements, overseas study guidance, global tech job boards, and international MSME expansion.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GLOBAL_REGIONS_ARRAY.filter(g => filterText === '' || g.country.toLowerCase().includes(filterText) || g.highlight.toLowerCase().includes(filterText)).map((reg, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#0a1535] border border-blue-500/20 hover:border-blue-400/50 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-black text-white flex items-center gap-2">
                            <span className="text-xl">{reg.flag}</span> {reg.country}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">{reg.audience}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{reg.highlight}</p>
                      </div>

                      <button
                        onClick={() => handleVoiceLaunch(`Give me an international career roadmap for ${reg.country} covering visa options, high-demand skills, and job searching with Arohi AI.`, "English")}
                        className="mt-4 px-3 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-xs font-bold border border-blue-500/30 transition-colors flex items-center justify-center gap-2"
                      >
                        <Globe className="w-3.5 h-3.5" /> Start {reg.country} Global Voice Session
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: 20+ TARGET AUDIENCES */}
            {activeTab === 'audiences' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">20+ Target Audiences Powered by Arohi AI</h3>
                    <p className="text-xs text-slate-400">Tailored AI tools, voice prompts, and career engines for every segment of society.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {AUDIENCE_SEO_TARGETS.filter(a => filterText === '' || a.title.toLowerCase().includes(filterText) || a.detail.toLowerCase().includes(filterText)).map((aud, idx) => {
                    const IconComp = aud.icon;
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-[#0e1630] border border-fuchsia-500/20 hover:border-fuchsia-400/50 transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 shrink-0">
                            <IconComp className="w-5 h-5" />
                          </div>
                          <h4 className="font-extrabold text-white text-sm">{aud.title}</h4>
                        </div>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{aud.detail}</p>
                        <button
                          onClick={() => handleVoiceLaunch(`I am a ${aud.title}. Show me how Arohi AI can help me advance my career and opportunities.`, "English")}
                          className="mt-3 text-xs text-fuchsia-400 font-bold hover:underline flex items-center gap-1"
                        >
                          Launch {aud.title} AI Mode <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: FREQUENT SEARCH FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white">High-Intent Voice & Search Engine FAQs</h3>
                    <p className="text-xs text-slate-400">Google Rich Snippet structured Q&A for Arohi AI (arohiai.com).</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {FREQUENT_SEARCH_FAQS.filter(faq => filterText === '' || faq.q.toLowerCase().includes(filterText) || faq.a.toLowerCase().includes(filterText)).map((faq, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#081524] border border-emerald-500/20 space-y-2">
                      <h4 className="text-sm font-bold text-emerald-300 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{faq.q}</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-4 bg-[#070e24] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-slate-300 font-semibold">Indexed on Google, Bing, Yahoo & AI Engine Crawlers</span>
            </div>

            <div className="flex items-center gap-3">
              {onNavigateTab && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateTab('career');
                  }}
                  className="text-cyan-400 hover:underline font-bold"
                >
                  Go to Job Board
                </button>
              )}
              <span className="text-slate-600">•</span>
              <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white underline">
                sitemap.xml
              </a>
              <span className="text-slate-600">•</span>
              <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white underline">
                robots.txt
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
