import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Briefcase, 
  Award, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Compass, 
  Lightbulb,
  Building,
  User,
  Sparkles,
  Search,
  CheckCircle2,
  Mic,
  Play,
  Download,
  DollarSign,
  UserCheck,
  RefreshCw,
  PlusCircle,
  Video,
  ShieldCheck,
  Pause,
  ArrowRight
} from 'lucide-react';

interface WalkthroughStep {
  tab: string;
  title: string;
  description: string;
  selector?: string;
  icon: any;
  highlightText: string;
}

interface WalkthroughTourProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function WalkthroughTour({ activeTab, setActiveTab, isOpen, onClose }: WalkthroughTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: WalkthroughStep[] = [
    {
      tab: 'home',
      title: 'Welcome to Recruit India!',
      description: 'Your premium, cloud-synced Career Registry and AI guidance platform. Let\'s take a 60-second interactive tour to discover how to skyrocket your career!',
      icon: Compass,
      highlightText: 'Begin your journey with custom counseling, tailored pathways, and verified registries.'
    },
    {
      tab: 'arohi',
      title: 'AROHI: Smart AI Career Guide',
      description: 'Your round-the-clock digital career expert. Ask AROHI anything in English, Hindi, or Odia about job vacancies, career advice, exam schedules, or academic syllabi!',
      icon: Bot,
      highlightText: 'Talk in your native language and receive immediate structured counseling roadmaps.'
    },
    {
      tab: 'jobs',
      title: 'National Job Registry & Scheme Matcher',
      description: 'Explore verified state and private jobs with automatic eligibility checks. View matching national schemes, submit application slips, and download secure official receipts.',
      icon: Briefcase,
      highlightText: 'Filters by region, departments, qualification tiers, and live salary categories.'
    },
    {
      tab: 'resume',
      title: 'ATS-Friendly Professional Resume Builder',
      description: 'Create a stellar, modern, and ATS-friendly professional resume (.docx and PDF format) in under 60 seconds for just ₹99! Upload and parse your current CV for quick scoring.',
      icon: FileText,
      highlightText: 'Maximize your selection rate with real-time optimization guidelines.'
    },
    {
      tab: 'interview',
      title: 'Realistic AI Oral Interview Engine',
      description: 'Crack your upcoming interviews! Practice answering high-difficulty technical and general questions with our live speech recorder. Receive complete textual transcripts, scores, and upskilling tips.',
      icon: MessageSquare,
      highlightText: 'Interactive vocal recordings with robust feedback on vocabulary, tone, and pacing.'
    },
    {
      tab: 'courses',
      title: 'Upskilling Paths & Certified Courses',
      description: 'Never stop learning. Enroll in structured, bite-sized engineering and vocational certification courses complete with high-definition video modules and mock testing.',
      icon: Award,
      highlightText: 'Progressive modules to help you bridge any skill gaps directly from home.'
    },
    {
      tab: 'syllabus',
      title: 'Odia Board & CBSE School Syllabus Hub',
      description: 'Our digital education desk! Download complete Class 1-12 NCERT books, browse board-specific textbook solutions offline, and study mapped curriculum structures.',
      icon: BookOpen,
      highlightText: 'Perfect for students preping for board exams or school curriculum reviews.'
    },
    {
      tab: 'business',
      title: 'MSME Business & Freelancer Portal',
      description: 'For budding entrepreneurs and self-starters. Explore MSME government grants, register a digital enterprise, find freelance jobs, and calculate startup tax deductions.',
      icon: Lightbulb,
      highlightText: 'Unlocking access to financial aids, regulatory schemas, and self-employment paths.'
    },
    {
      tab: 'employer',
      title: 'Free Job Posting & Recruiter Suite',
      description: 'Are you hiring? Post unlimited job vacancies for free, parse candidate resumes automatically, track application statuses, and interview applicants seamlessly.',
      icon: Building,
      highlightText: 'A high-impact recruiter dashboard that handles postings, applicants, and scoring.'
    },
    {
      tab: 'dashboard',
      title: 'Your Centralized Candidate Dashboard',
      description: 'Review your personalized progress score! Track active application statuses, review vocal mock interview transcripts, download transaction slips, and access saved schemes.',
      icon: User,
      highlightText: 'Your verified, cloud-synced personal digital profile is secure with us.'
    }
  ];

  // Step-specific simulation states
  const [welcomeScanning, setWelcomeScanning] = useState(true);
  const [arohiChatMsg, setArohiChatMsg] = useState(0); 
  const [jobEligibleCheck, setJobEligibleCheck] = useState<'idle' | 'checking' | 'passed'>('idle');
  const [resumeScore, setResumeScore] = useState(82);
  const [isResumingScore, setIsResumingScore] = useState(false);
  const [interviewState, setInterviewState] = useState<'idle' | 'recording' | 'feedback'>('idle');
  const [coursePlaying, setCoursePlaying] = useState(false);
  const [courseProgress, setCourseProgress] = useState(35);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [businessType, setBusinessType] = useState<'retail' | 'msme' | 'freelance'>('msme');
  const [shortlistedCandidates, setShortlistedCandidates] = useState<{ [key: string]: boolean }>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  // Auto-switch parent tab as the user navigates steps
  useEffect(() => {
    if (isOpen) {
      const step = steps[currentStep];
      if (step && activeTab !== step.tab) {
        setActiveTab(step.tab);
      }
    }
  }, [currentStep, isOpen]);

  // Reset to step 0 when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Reset step simulations whenever the step changes
  useEffect(() => {
    const step = steps[currentStep];
    if (!step) return;

    if (step.tab === 'home') {
      setWelcomeScanning(true);
      const timer = setTimeout(() => setWelcomeScanning(false), 2200);
      return () => clearTimeout(timer);
    }

    if (step.tab === 'arohi') {
      setArohiChatMsg(0);
      const interval = setInterval(() => {
        setArohiChatMsg(prev => (prev < 2 ? prev + 1 : 0));
      }, 3500);
      return () => clearInterval(interval);
    }

    // Reset others
    setJobEligibleCheck('idle');
    setResumeScore(82);
    setIsResumingScore(false);
    setInterviewState('idle');
    setCoursePlaying(false);
    setCourseProgress(35);
    setSelectedClass('Class 10');
    setBusinessType('msme');
    setShortlistedCandidates({});
    setIsSyncing(false);
    setSynced(false);
  }, [currentStep]);

  if (!isOpen) return null;

  const step = steps[currentStep];
  const IconComponent = step.icon;
  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Renderer for the Live Interactive Preview Sandbox
  const renderInteractiveSandbox = () => {
    switch (step.tab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            {welcomeScanning ? (
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-purple-500/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border border-indigo-500/40 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border-2 border-dashed border-purple-400/50 animate-spin" />
                  <Compass className="w-7 h-7 text-emerald-400 animate-bounce relative z-10" />
                </div>
                <p className="text-[10px] font-mono text-emerald-400 tracking-wider animate-pulse uppercase">
                  Connecting live career grids...
                </p>
                <p className="text-[9px] text-slate-400 mt-1">Mapping National & State Databases</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/25 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-5 h-5 animate-bounce" />
                </div>
                <p className="text-xs font-black text-white uppercase tracking-wider">Registries Connected!</p>
                <p className="text-[10px] text-slate-300 mt-1.5 max-w-xs leading-normal">
                  Found <span className="text-emerald-400 font-extrabold">12,420 Active Jobs</span> & <span className="text-purple-400 font-extrabold">85 Govt Schemes</span> mapped for you.
                </p>
                <button 
                  onClick={() => setWelcomeScanning(true)} 
                  className="mt-4 px-3 py-1.5 bg-[#171035] border border-purple-500/35 hover:border-purple-400 text-[9px] text-purple-300 rounded-xl hover:text-white transition-all cursor-pointer flex items-center gap-1.5 font-bold uppercase tracking-wider"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Re-Scan Databases
                </button>
              </motion.div>
            )}
          </div>
        );

      case 'arohi':
        const messages = [
          { sender: 'user', text: 'Any Mudra Loans for software startups?' },
          { sender: 'arohi', text: 'Yes! Under Shishu/Kishor Mudra, get up to ₹5 Lakhs at low interest. No collateral needed!' },
          { sender: 'arohi', text: 'I can help draft your business profile plan now in English, Odia, or Hindi!' }
        ];
        return (
          <div className="flex flex-col h-full justify-between p-2">
            <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
              {messages.slice(0, arohiChatMsg + 1).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2 rounded-xl text-[10px] max-w-[85%] leading-normal ${
                    msg.sender === 'user'
                      ? 'bg-purple-600/20 border border-purple-500/30 text-purple-100 ml-auto'
                      : 'bg-[#150d3a] border border-indigo-950/40 text-slate-200 mr-auto'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {msg.sender === 'user' ? (
                      <span className="font-extrabold text-purple-400 text-[8px] uppercase">You</span>
                    ) : (
                      <span className="font-extrabold text-emerald-400 text-[8px] uppercase flex items-center gap-0.5">
                        <Bot className="w-2.5 h-2.5 text-emerald-400" /> AROHI AI
                      </span>
                    )}
                  </div>
                  <p className="font-medium">{msg.text}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Moving live equalizer simulator */}
            <div className="border-t border-purple-950/50 pt-2 flex items-center justify-between mt-2">
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Vocal Audio Mapped
              </span>
              <div className="flex items-end gap-0.5 h-3">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{
                      duration: 0.6 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                    className="w-1 bg-gradient-to-t from-emerald-500 to-purple-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'jobs':
        return (
          <div className="flex flex-col h-full justify-between p-2">
            <div className="bg-[#120a2e]/60 border border-purple-500/25 rounded-2xl p-3 shadow-md relative overflow-hidden">
              <div className="absolute top-2 right-2 bg-emerald-500/10 text-[#00e676] text-[8px] font-black px-1.5 py-0.5 rounded-full border border-[#00e676]/30 uppercase tracking-wider">
                Govt Verified
              </div>
              <h4 className="text-xs font-black text-white">Assistant Revenue Officer (ARO)</h4>
              <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Revenue Dept • Bhubaneswar</p>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-[9px] border-t border-purple-950/40 pt-2.5">
                <div>
                  <span className="text-slate-400 block text-[8px]">Salary Tier</span>
                  <span className="font-bold text-emerald-400">₹35,400 - ₹1,12,400/mo</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[8px]">Eligibility Criteria</span>
                  <span className="font-bold text-white">Bachelor Degree + Odia Lit</span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 space-y-2">
              {jobEligibleCheck === 'idle' && (
                <button
                  onClick={() => {
                    setJobEligibleCheck('checking');
                    setTimeout(() => setJobEligibleCheck('passed'), 2000);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Check My Eligibility Real-Time
                </button>
              )}

              {jobEligibleCheck === 'checking' && (
                <div className="w-full py-2 bg-[#10082c] border border-purple-500/30 text-[10px] font-black uppercase text-purple-300 rounded-xl flex items-center justify-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin text-purple-400" />
                  <span>Matching qualifications with official registry...</span>
                </div>
              )}

              {jobEligibleCheck === 'passed' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/20 border border-emerald-500/35 p-2.5 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wide block">Eligibility Passed!</span>
                      <span className="text-[8px] text-slate-300 font-semibold block leading-tight">Your credentials score matches the department standard.</span>
                    </div>
                  </div>
                  <button className="px-2 py-1 bg-emerald-500 text-slate-950 text-[8px] font-black rounded-lg uppercase tracking-wider">
                    Apply Slip
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className="flex flex-col h-full justify-between p-2">
            <div className="bg-[#120a2e]/60 border border-purple-950/40 rounded-2xl p-3 flex items-start gap-3">
              <div className="w-12 h-16 bg-[#161036] border border-purple-500/20 rounded-lg p-1.5 flex flex-col justify-between shadow-inner shrink-0">
                <div className="h-1 w-8 bg-purple-400/50 rounded-full" />
                <div className="h-1 w-6 bg-slate-500/30 rounded-full" />
                <div className="h-1 w-7 bg-slate-500/30 rounded-full" />
                <div className="h-1 w-5 bg-slate-500/30 rounded-full" />
                <div className="h-2 w-full bg-emerald-500/40 rounded-sm" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h5 className="text-[10px] font-black text-white">ATS Professional Template</h5>
                <p className="text-[8px] text-slate-400 font-semibold leading-tight mt-0.5">Optimized for government & private corporate screening standards.</p>
                
                {/* Score bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider mb-1">
                    <span className="text-slate-400">ATS Resume Score</span>
                    <span className={resumeScore > 90 ? 'text-emerald-400 font-black' : 'text-amber-400 font-black'}>
                      {resumeScore}/100
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full p-0.5 border border-purple-950/40">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" 
                      animate={{ width: `${resumeScore}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 text-left">
              <button
                onClick={() => {
                  if (isResumingScore) return;
                  setIsResumingScore(true);
                  setResumeScore(82);
                  setTimeout(() => {
                    setResumeScore(97);
                    setIsResumingScore(false);
                  }, 1800);
                }}
                disabled={isResumingScore}
                className="w-full py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                {isResumingScore ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing & Auto-Correcting Errors...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Run AI Resume Score & Optimize</span>
                  </>
                )}
              </button>
              <p className="text-[8px] text-slate-400 font-bold tracking-tight text-center mt-1.5 uppercase">
                {resumeScore > 90 ? "🎉 Score passed. Optimized Resume downloaded in Docx & PDF" : "Includes: Skill alignment, Grammar check, Formatting fixes"}
              </p>
            </div>
          </div>
        );

      case 'interview':
        return (
          <div className="flex flex-col h-full justify-between p-2">
            <div className="bg-[#120a2e]/60 border border-purple-950/40 rounded-2xl p-3 text-left">
              <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest bg-purple-950/40 border border-purple-500/20 px-1.5 py-0.5 rounded-md">
                Mock Question 3 of 5
              </span>
              <p className="text-[10px] font-extrabold text-white mt-2 leading-snug">
                "What is your strategy for managing multiple state variables in a React application?"
              </p>
            </div>

            <div className="mt-2 space-y-2">
              {interviewState === 'idle' && (
                <button
                  onClick={() => {
                    setInterviewState('recording');
                    setTimeout(() => setInterviewState('feedback'), 2500);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Start Microphone Record Simulation</span>
                </button>
              )}

              {interviewState === 'recording' && (
                <div className="bg-[#1c0814] border border-red-500/35 p-2 rounded-xl flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">RECORDING USER VOCAL ANSWER...</span>
                  </div>
                  <div className="flex items-end gap-1 h-5 mt-1">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [4, 16, 4] }}
                        transition={{
                          duration: 0.4 + (i % 3) * 0.1,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="w-1 bg-red-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              )}

              {interviewState === 'feedback' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#100c30] border border-indigo-500/30 rounded-xl p-2 text-left"
                >
                  <div className="flex justify-between items-center border-b border-purple-950/40 pb-1.5 mb-1.5">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wide">AI Analytics Transcript Received</span>
                    <span className="text-[9px] font-black text-white bg-purple-600 px-1.5 py-0.5 rounded-md">88% Match</span>
                  </div>
                  <p className="text-[9px] text-slate-300 leading-snug font-medium italic">
                    "I prefer using React Context or custom hooks for modularity and avoidance of props-drilling..."
                  </p>
                  <div className="grid grid-cols-3 gap-1 mt-1.5 pt-1.5 border-t border-purple-950/30 text-[7px] text-slate-400 font-bold uppercase">
                    <div>Pacing: <span className="text-emerald-400 font-black">94wpm</span></div>
                    <div>Grammar: <span className="text-emerald-400 font-black">92%</span></div>
                    <div>Vocabulary: <span className="text-emerald-400 font-black">Robust</span></div>
                  </div>
                  <button 
                    onClick={() => setInterviewState('idle')}
                    className="w-full mt-2 py-1 bg-purple-950/40 border border-purple-500/20 text-purple-300 text-[8px] font-black rounded-lg uppercase tracking-wider"
                  >
                    Try Another Question
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="flex flex-col h-full justify-between p-2">
            <div className="relative bg-slate-950 rounded-2xl border border-purple-950/40 aspect-[16/10] overflow-hidden flex items-center justify-center group shadow-inner">
              {coursePlaying ? (
                <div className="absolute inset-0 flex flex-col justify-between p-2.5 bg-gradient-to-t from-black/80 via-transparent to-black/40 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black text-[#00e676] uppercase tracking-wider bg-[#00e676]/10 border border-[#00e676]/20 px-1.5 py-0.5 rounded-full">
                      Module 3 Video Lecture
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono">14:22 / 28:05</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 my-auto">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="w-1.5 bg-emerald-400/40 rounded-full animate-pulse" style={{ height: `${12 + Math.sin(i) * 16}px` }} />
                    ))}
                  </div>
                  <div>
                    <h6 className="text-[10px] font-black text-white truncate">Industrial Robotics & PLCs Course</h6>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5">
                      <div className="h-full bg-emerald-400 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-[1px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop')" }} />
                  <div className="absolute inset-0 bg-[#070512]/60" />
                  <button
                    onClick={() => setCoursePlaying(true)}
                    className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 border border-purple-400 flex items-center justify-center text-white relative z-10 cursor-pointer shadow-lg transition-transform active:scale-95 hover:scale-105"
                  >
                    <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                  </button>
                  <span className="absolute bottom-2 left-3 right-3 text-center text-[8px] font-bold uppercase tracking-wider text-slate-300 relative z-10 bg-[#070512]/80 py-1 rounded-lg border border-purple-950/40">
                    Preview Course Lecture
                  </span>
                </>
              )}
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wide mb-1">
                <span>Course Completion Progress</span>
                <span>{courseProgress}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-950 border border-purple-950/40 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300" style={{ width: `${courseProgress}%` }} />
              </div>
              {coursePlaying && (
                <button
                  onClick={() => {
                    setCoursePlaying(false);
                    setCourseProgress(100);
                  }}
                  className="w-full mt-2 py-1 bg-emerald-500 text-slate-950 text-[8px] font-black rounded-lg uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                >
                  <Award className="w-3 h-3 text-slate-950 animate-bounce" /> Claim Certification Voucher
                </button>
              )}
            </div>
          </div>
        );

      case 'syllabus':
        const classes = ['Class 10', 'Class 9', 'Class 8'];
        const subjects = {
          'Class 10': ['Mathematics (Class X NCERT)', 'Science (Board textbook)', 'History & Civics (CBSE)'],
          'Class 9': ['Mathematics (Class IX NCERT)', 'Geography & Science', 'Odia Language Primer'],
          'Class 8': ['General Science NCERT', 'Basic Arithmetic', 'English Grammar']
        };
        return (
          <div className="flex flex-col h-full justify-between p-2">
            <div className="flex items-center gap-1">
              {classes.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`flex-1 py-1.5 rounded-lg text-[9px] font-black cursor-pointer uppercase transition-all ${
                    selectedClass === cls
                      ? 'bg-purple-600 text-white border border-purple-400 shadow-sm'
                      : 'bg-purple-950/30 border border-purple-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <div className="mt-2.5 bg-[#120a2e]/60 border border-purple-950/40 rounded-xl p-2.5 text-left space-y-1.5">
              <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest block">Available Textbook PDFs</span>
              {subjects[selectedClass as keyof typeof subjects]?.map((subject, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-purple-950/20 last:border-0">
                  <span className="text-[9px] text-slate-200 font-semibold truncate max-w-[70%]">{subject}</span>
                  <button className="px-2 py-1 bg-[#171035] hover:bg-purple-900/30 border border-purple-500/30 text-purple-300 text-[8px] font-bold rounded-lg flex items-center gap-1 cursor-pointer">
                    <Download className="w-2.5 h-2.5" /> PDF
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2 bg-[#0d0922] border border-indigo-950/40 rounded-xl p-2 text-center">
              <p className="text-[8px] text-slate-400 font-bold leading-relaxed uppercase">
                Offline Mode Active • Solutions preloaded for board test preparation.
              </p>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="flex flex-col h-full justify-between p-2 text-left">
            <div className="flex items-center gap-1.5">
              {(['retail', 'msme', 'freelance'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`flex-1 py-1.5 rounded-lg text-[8px] font-black cursor-pointer uppercase tracking-wider transition-all ${
                    businessType === type
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white border border-purple-400 shadow-sm'
                      : 'bg-purple-950/30 border border-purple-950/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'retail' ? '🏪 Micro Shop' : type === 'msme' ? '🏭 MSME Plant' : '💻 Freelance'}
                </button>
              ))}
            </div>

            <div className="mt-2.5 bg-[#120a2e]/60 border border-purple-500/20 rounded-xl p-3">
              {businessType === 'retail' && (
                <div>
                  <h6 className="text-[10px] font-black text-white uppercase">PM SVANidhi Scheme Match</h6>
                  <p className="text-[8px] text-slate-400 mt-0.5 font-semibold">Micro-loans for small shopkeepers & vendors.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-purple-950/40 text-[9px] font-black text-white">
                    <div>Grant / Loan Limit: <span className="text-emerald-400 block font-black text-xs">₹50,000</span></div>
                    <div>Subsidy Match: <span className="text-purple-400 block font-black text-xs">7% Cashback</span></div>
                  </div>
                </div>
              )}
              {businessType === 'msme' && (
                <div>
                  <h6 className="text-[10px] font-black text-white uppercase">PMEGP Subsidized Enterprise Grant</h6>
                  <p className="text-[8px] text-slate-400 mt-0.5 font-semibold">Central grant for manufacturing & industrial setups.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-purple-950/40 text-[9px] font-black text-white">
                    <div>Max Plant Funding: <span className="text-emerald-400 block font-black text-xs">₹50,000,000</span></div>
                    <div>Govt Subsidy: <span className="text-purple-400 block font-black text-xs">Up to 35% Off</span></div>
                  </div>
                </div>
              )}
              {businessType === 'freelance' && (
                <div>
                  <h6 className="text-[10px] font-black text-white uppercase">Digital Freelance GST Exemption</h6>
                  <p className="text-[8px] text-slate-400 mt-0.5 font-semibold">Exemptions & deductions for individual creators.</p>
                  <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-purple-950/40 text-[9px] font-black text-white">
                    <div>GST Threshold: <span className="text-emerald-400 block font-black text-xs">₹4,000,000 / yr</span></div>
                    <div>Tax Saving Rule: <span className="text-purple-400 block font-black text-xs">Section 44ADA</span></div>
                  </div>
                </div>
              )}
            </div>

            <button className="w-full mt-2.5 py-1.5 bg-[#171035] hover:bg-purple-900/30 border border-purple-500/35 text-purple-300 text-[9px] font-black rounded-lg uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer">
              <DollarSign className="w-3 h-3" /> Auto-Calculate Startup Tax Exemptions
            </button>
          </div>
        );

      case 'employer':
        const candidates = [
          { id: '1', name: 'Alok Patnaik', score: 94, verified: true },
          { id: '2', name: 'Sneha Mohanty', score: 78, verified: false }
        ];
        return (
          <div className="flex flex-col h-full justify-between p-2 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Candidate Applications Received</span>
              <span className="text-[8px] font-black text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded-full border border-[#00e676]/20 uppercase">
                {Object.keys(shortlistedCandidates).length} Shortlisted
              </span>
            </div>

            <div className="space-y-2">
              {candidates.map(candidate => {
                const isShortlisted = shortlistedCandidates[candidate.id];
                return (
                  <div key={candidate.id} className="bg-[#120a2e]/60 border border-purple-950/40 rounded-xl p-2.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-white">{candidate.name}</span>
                        {candidate.verified && <span className="bg-emerald-500/10 text-emerald-400 text-[6px] font-extrabold px-1 py-0.2 rounded uppercase">Gold Vault</span>}
                      </div>
                      <span className="text-[8px] text-slate-400 font-semibold block">ATS Resume Score: <span className={candidate.score > 90 ? "text-emerald-400 font-black" : "text-amber-400 font-black"}>{candidate.score}%</span></span>
                    </div>

                    <button
                      onClick={() => {
                        setShortlistedCandidates(prev => ({
                          ...prev,
                          [candidate.id]: !prev[candidate.id]
                        }));
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                        isShortlisted
                          ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                          : 'bg-[#1a123d] border border-purple-500/25 text-purple-300 hover:text-white'
                      }`}
                    >
                      {isShortlisted ? '✓ Shortlisted' : '+ Shortlist'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-center">
              <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider block">
                Recruit suite includes automated resume scoring & interview review.
              </span>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="flex flex-col h-full justify-between p-2 text-left">
            <div className="bg-gradient-to-tr from-[#130b2c]/80 to-[#1e0f40]/80 border border-purple-500/30 rounded-2xl p-3 flex items-center gap-3 shadow-inner relative overflow-hidden">
              <div className="absolute top-1 right-1">
                {synced && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider block"
                  >
                    👑 Verified Citizen
                  </motion.span>
                )}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] flex items-center justify-center text-white text-[12px] font-black uppercase shadow-md border border-purple-400/40 relative">
                {synced ? 'IN' : 'JD'}
                {synced && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />}
              </div>

              <div className="flex-1 min-w-0">
                <h5 className="text-[11px] font-black text-white uppercase tracking-wide">Junoon Elite Trader</h5>
                <p className="text-[8px] text-slate-400 font-bold truncate leading-tight">elitetraderjunoon@gmail.com</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[7px] font-black px-1.5 rounded uppercase ${synced ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
                    {synced ? 'Sync Match: 100%' : 'Aadhaar Sync Pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              {isSyncing ? (
                <div className="w-full py-2 bg-[#12082b] border border-purple-500/30 text-[9px] font-black text-purple-300 uppercase rounded-xl flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synchronizing Vault with state registry...</span>
                </div>
              ) : synced ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-emerald-950/20 border border-emerald-500/35 p-2 rounded-xl text-center"
                >
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wide block">Verification Successful!</span>
                  <span className="text-[8px] text-slate-300 font-semibold block leading-tight">Your digital career profile is fully secured.</span>
                </motion.div>
              ) : (
                <button
                  onClick={() => {
                    setIsSyncing(true);
                    setTimeout(() => {
                      setIsSyncing(false);
                      setSynced(true);
                    }, 1800);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer hover:opacity-90 shadow-md flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Synchronize Digital Vault
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#05030f]/65 backdrop-blur-[2px] pointer-events-auto">
      {/* Immersive glowing background nodes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none animate-pulse delay-500" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-gradient-to-br from-[#0e0a26] via-[#0a071a] to-[#120d30] border-2 border-purple-500/40 rounded-[2rem] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.4)] text-left overflow-hidden"
      >
        {/* Floating live indicator tab */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e676]"></span>
          </span>
          <span className="text-[8px] font-black text-[#00e676] uppercase tracking-widest bg-[#00e676]/10 px-2 py-0.5 rounded-full border border-[#00e676]/20">
            Interactive Preview Active
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all ml-1 cursor-pointer"
            title="Exit Tour"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Master Grid: 2 Columns for Desktop Walkthrough Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch pt-2">
          
          {/* Left Column: Interactive info & Walkthrough guide controls (cols 7) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-[#7c3aed]/15 p-3 rounded-xl border border-[#7c3aed]/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.15)] shrink-0">
                  <IconComponent className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest block leading-none">
                    Step {currentStep + 1} of {steps.length} • Interactive Demo
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight flex items-center gap-1.5 mt-1">
                    <span>{step.title}</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  </h3>
                </div>
              </div>

              {/* Description & Highlight */}
              <div className="mt-4 space-y-3.5 text-left">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                  {step.description}
                </p>

                <div className="bg-purple-950/25 border border-purple-500/15 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded-lg border border-purple-500/25 font-bold text-[8px] tracking-wider uppercase shrink-0 mt-0.5">
                    Pro Tip
                  </div>
                  <p className="text-[11px] text-purple-200 font-semibold leading-relaxed">
                    {step.highlightText}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar & Footer controllers */}
            <div className="space-y-4">
              {/* Progress bar info */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Navigation Sequence Progress</span>
                  <span>{Math.round(progressPercent)}% Explored</span>
                </div>
                <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden p-0">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-purple-950/40">
                <button
                  onClick={onClose}
                  className="text-[10px] text-slate-400 hover:text-white font-extrabold uppercase tracking-widest cursor-pointer py-1.5 transition-all text-center sm:text-left w-full sm:w-auto"
                >
                  Skip Tour
                </button>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`flex items-center justify-center gap-1 py-2 px-3.5 rounded-xl border font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto ${
                      currentStep === 0
                        ? 'border-slate-800 text-slate-600 cursor-not-allowed opacity-30'
                        : 'border-[#2d2163] hover:border-[#4c3ba0]/50 bg-[#16122e] text-slate-300 hover:text-white'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center justify-center gap-1 py-2 px-4.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/15 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <span>{currentStep === steps.length - 1 ? 'Finish' : 'Next Step'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Action Preview Sandbox (cols 5) */}
          <div className="lg:col-span-5 bg-[#05030f]/80 rounded-[1.5rem] border border-purple-500/20 p-4 flex flex-col justify-between min-h-[250px] sm:min-h-[290px] relative overflow-hidden shadow-inner">
            {/* Ambient neon decorative gradient behind preview */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Sandbox Header */}
            <div className="flex items-center justify-between border-b border-purple-950/40 pb-2 mb-3 relative z-10">
              <span className="text-[8px] font-black text-purple-300 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Feature Action Preview
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                Click elements to interact
              </span>
            </div>

            {/* Simulated Live Action UI Sandbox Content */}
            <div className="flex-1 min-h-0 relative z-10 flex flex-col justify-center">
              {renderInteractiveSandbox()}
            </div>

            {/* Sandbox Footer Info */}
            <div className="border-t border-purple-950/40 pt-2.5 mt-3 flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase tracking-wider relative z-10">
              <span>Simulation Platform v2.5</span>
              <span className="flex items-center gap-1">
                Active Tab Mode: <span className="text-emerald-400 font-extrabold">{step.tab.toUpperCase()}</span>
              </span>
            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
