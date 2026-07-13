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
  HelpCircle,
  Lightbulb,
  Building,
  User,
  Sparkles
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
      highlightText: 'Perfect for students in Odisha prepping for exams or upskilling for corporate roles.'
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

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#05030f]/80 backdrop-blur-md pointer-events-auto">
      {/* Immersive glowing background nodes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none animate-pulse delay-500"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-gradient-to-br from-[#0e0a26] via-[#0a071a] to-[#120d30] border-2 border-purple-500/40 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.4)] text-left overflow-hidden"
      >
        {/* Floating "In-action" indicator tab */}
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e676]"></span>
          </span>
          <span className="text-[10px] font-black text-[#00e676] uppercase tracking-widest bg-[#00e676]/10 px-2 py-0.5 rounded-full border border-[#00e676]/20">
            Live Tab View Mapped
          </span>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all ml-1 cursor-pointer"
            title="Exit Tour"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Header Icon + Navigation Progress Info */}
        <div className="flex items-center gap-3.5 mt-2">
          <div className="bg-[#7c3aed]/15 p-3.5 rounded-2xl border border-[#7c3aed]/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.15)] shrink-0">
            <IconComponent className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest">
              Step {currentStep + 1} of {steps.length} • Platform Walkthrough
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight flex items-center gap-2">
              <span>{step.title}</span>
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            </h3>
          </div>
        </div>

        {/* Main description and core highlights */}
        <div className="mt-6 space-y-4">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {step.description}
          </p>

          <div className="bg-purple-950/20 border border-purple-500/15 rounded-2xl p-4 flex items-start gap-3">
            <div className="bg-purple-500/10 text-purple-300 p-1.5 rounded-lg border border-purple-500/20 mt-0.5 font-bold text-[10px]">
              PRO TIP
            </div>
            <p className="text-xs text-purple-200 font-semibold leading-relaxed">
              {step.highlightText}
            </p>
          </div>
        </div>

        {/* Progress bar indicator */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Navigation Sequence</span>
            <span>{Math.round(progressPercent)}% Mapped</span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-0.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Footer controls: Back, Next, Skip */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-purple-950/30 pt-6">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-extrabold uppercase tracking-wider cursor-pointer py-1.5 transition-all text-center sm:text-left w-full sm:w-auto"
          >
            Skip Walkthrough
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border font-black text-xs uppercase tracking-wider transition-all cursor-pointer w-full sm:w-auto ${
                currentStep === 0
                  ? 'border-slate-800 text-slate-600 cursor-not-allowed opacity-40'
                  : 'border-[#2d2163] hover:border-[#4c3ba0]/50 bg-[#16122e] text-slate-300 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center justify-center gap-1.5 py-3 px-5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/10 active:scale-95 transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish & Explore' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
