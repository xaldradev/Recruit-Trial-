import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ArohiAvatar from './ArohiAvatar';
import Interactive3DOrbit from './Interactive3DOrbit';
import { 
  GraduationCap, 
  Briefcase, 
  Laptop, 
  Landmark, 
  Star, 
  Lightbulb, 
  User, 
  ArrowLeftRight, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MessageSquare,
  Globe,
  ChevronDown,
  MessageCircle,
  BookOpen,
  Users,
  FlaskConical,
  Activity,
  Cpu,
  Stethoscope,
  Building,
  Network,
  Rocket,
  Bot,
  UserCheck,
  Crown,
  Heart,
  HelpCircle,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  ChevronRight,
  Menu,
  X,
  Share2
} from 'lucide-react';
import { Language, getTranslation } from '../translations';
import { LANGUAGES_LIST } from './Header';

interface WelcomeLandingProps {
  onEnter: () => void;
  setActiveTab: (tab: string) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  setIsChatOpen?: (isOpen: boolean) => void;
  onQuickChat?: (prompt: string) => void;
  onShare?: () => void;
}

const categoryColors: Record<string, {
  border: string;
  hoverBorder: string;
  bg: string;
  iconBg: string;
  iconText: string;
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
  selectedGlow: string;
  indicator: string;
  badge: string;
}> = {
  students: {
    border: 'border-indigo-500/25',
    hoverBorder: 'hover:border-indigo-400/80',
    bg: 'bg-indigo-950/20 hover:bg-indigo-950/40',
    iconBg: 'bg-indigo-500/15 group-hover:bg-indigo-500/25',
    iconText: 'text-indigo-400',
    selectedBg: 'bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-blue-600/30',
    selectedBorder: 'border-indigo-400',
    selectedText: 'text-indigo-200',
    selectedGlow: '0 0 25px rgba(99, 102, 241, 0.65)',
    indicator: 'bg-indigo-400',
    badge: 'STUDENT CORE'
  },
  teachers: {
    border: 'border-emerald-500/25',
    hoverBorder: 'hover:border-emerald-400/80',
    bg: 'bg-emerald-950/20 hover:bg-emerald-950/40',
    iconBg: 'bg-emerald-500/15 group-hover:bg-emerald-500/25',
    iconText: 'text-emerald-400',
    selectedBg: 'bg-gradient-to-r from-emerald-600/40 via-teal-600/30 to-green-600/30',
    selectedBorder: 'border-emerald-400',
    selectedText: 'text-emerald-200',
    selectedGlow: '0 0 25px rgba(16, 185, 129, 0.65)',
    indicator: 'bg-emerald-400',
    badge: 'ACADEMIC HUBS'
  },
  parents: {
    border: 'border-pink-500/25',
    hoverBorder: 'hover:border-pink-400/80',
    bg: 'bg-pink-950/20 hover:bg-pink-950/40',
    iconBg: 'bg-pink-500/15 group-hover:bg-pink-500/25',
    iconText: 'text-pink-400',
    selectedBg: 'bg-gradient-to-r from-pink-600/40 via-rose-600/30 to-purple-600/30',
    selectedBorder: 'border-pink-400',
    selectedText: 'text-pink-200',
    selectedGlow: '0 0 25px rgba(236, 72, 153, 0.65)',
    indicator: 'bg-pink-400',
    badge: 'FAMILY INSIGHTS'
  },
  scientists: {
    border: 'border-cyan-500/25',
    hoverBorder: 'hover:border-cyan-400/80',
    bg: 'bg-cyan-950/20 hover:bg-cyan-950/40',
    iconBg: 'bg-cyan-500/15 group-hover:bg-cyan-500/25',
    iconText: 'text-cyan-400',
    selectedBg: 'bg-gradient-to-r from-cyan-600/40 via-blue-600/30 to-teal-600/30',
    selectedBorder: 'border-cyan-400',
    selectedText: 'text-cyan-200',
    selectedGlow: '0 0 25px rgba(6, 182, 212, 0.65)',
    indicator: 'bg-cyan-400',
    badge: 'HYPOTHESIS MAPPING'
  },
  researchers: {
    border: 'border-blue-500/25',
    hoverBorder: 'hover:border-blue-400/80',
    bg: 'bg-blue-950/20 hover:bg-blue-950/40',
    iconBg: 'bg-blue-500/15 group-hover:bg-blue-500/25',
    iconText: 'text-blue-400',
    selectedBg: 'bg-gradient-to-r from-blue-600/40 via-indigo-600/30 to-sky-600/30',
    selectedBorder: 'border-blue-400',
    selectedText: 'text-blue-200',
    selectedGlow: '0 0 25px rgba(59, 130, 246, 0.65)',
    indicator: 'bg-blue-400',
    badge: 'DATA AUDITING'
  },
  doctors: {
    border: 'border-rose-500/25',
    hoverBorder: 'hover:border-rose-400/80',
    bg: 'bg-rose-950/20 hover:bg-rose-950/40',
    iconBg: 'bg-rose-500/15 group-hover:bg-rose-500/25',
    iconText: 'text-rose-400',
    selectedBg: 'bg-gradient-to-r from-rose-600/40 via-pink-600/30 to-orange-600/30',
    selectedBorder: 'border-rose-400',
    selectedText: 'text-rose-200',
    selectedGlow: '0 0 25px rgba(244, 63, 94, 0.65)',
    indicator: 'bg-rose-400',
    badge: 'CLINICAL AIDS'
  },
  engineers: {
    border: 'border-emerald-500/25',
    hoverBorder: 'hover:border-emerald-400/80',
    bg: 'bg-emerald-950/20 hover:bg-emerald-950/40',
    iconBg: 'bg-emerald-500/15 group-hover:bg-emerald-500/25',
    iconText: 'text-emerald-400',
    selectedBg: 'bg-gradient-to-r from-emerald-600/40 via-green-600/30 to-cyan-600/30',
    selectedBorder: 'border-emerald-400',
    selectedText: 'text-emerald-200',
    selectedGlow: '0 0 25px rgba(16, 185, 129, 0.65)',
    indicator: 'bg-emerald-400',
    badge: 'DEV OPERATIONS'
  },
  entrepreneurs: {
    border: 'border-amber-500/25',
    hoverBorder: 'hover:border-amber-400/80',
    bg: 'bg-amber-950/20 hover:bg-amber-950/40',
    iconBg: 'bg-amber-500/15 group-hover:bg-amber-500/25',
    iconText: 'text-amber-400',
    selectedBg: 'bg-gradient-to-r from-amber-600/40 via-orange-600/30 to-yellow-600/30',
    selectedBorder: 'border-amber-400',
    selectedText: 'text-amber-200',
    selectedGlow: '0 0 25px rgba(245, 158, 11, 0.65)',
    indicator: 'bg-amber-400',
    badge: 'BUSINESS SCALE'
  },
  jobSeeker: {
    border: 'border-teal-500/25',
    hoverBorder: 'hover:border-teal-400/80',
    bg: 'bg-teal-950/20 hover:bg-teal-950/40',
    iconBg: 'bg-teal-500/15 group-hover:bg-teal-500/25',
    iconText: 'text-teal-400',
    selectedBg: 'bg-gradient-to-r from-teal-600/40 via-emerald-600/30 to-cyan-600/30',
    selectedBorder: 'border-teal-400',
    selectedText: 'text-teal-200',
    selectedGlow: '0 0 25px rgba(20, 184, 166, 0.65)',
    indicator: 'bg-teal-400',
    badge: 'ACTIVE BOARDS'
  },
  professionals: {
    border: 'border-violet-500/25',
    hoverBorder: 'hover:border-violet-400/80',
    bg: 'bg-violet-950/20 hover:bg-violet-950/40',
    iconBg: 'bg-violet-500/15 group-hover:bg-violet-500/25',
    iconText: 'text-violet-400',
    selectedBg: 'bg-gradient-to-r from-violet-600/40 via-purple-600/30 to-indigo-600/30',
    selectedBorder: 'border-violet-400',
    selectedText: 'text-violet-200',
    selectedGlow: '0 0 25px rgba(139, 92, 246, 0.65)',
    indicator: 'bg-violet-400',
    badge: 'CAREER PATH'
  },
  businesses: {
    border: 'border-teal-500/25',
    hoverBorder: 'hover:border-teal-400/80',
    bg: 'bg-teal-950/20 hover:bg-teal-950/40',
    iconBg: 'bg-teal-500/15 group-hover:bg-teal-500/25',
    iconText: 'text-teal-400',
    selectedBg: 'bg-gradient-to-r from-teal-600/40 via-cyan-600/30 to-indigo-600/30',
    selectedBorder: 'border-teal-400',
    selectedText: 'text-teal-200',
    selectedGlow: '0 0 25px rgba(20, 184, 166, 0.65)',
    indicator: 'bg-teal-400',
    badge: 'WORKFLOW HUBS'
  },
  govAspirant: {
    border: 'border-sky-500/25',
    hoverBorder: 'hover:border-sky-400/80',
    bg: 'bg-sky-950/20 hover:bg-sky-950/40',
    iconBg: 'bg-sky-500/15 group-hover:bg-sky-500/25',
    iconText: 'text-sky-400',
    selectedBg: 'bg-gradient-to-r from-sky-600/40 via-blue-600/30 to-indigo-600/30',
    selectedBorder: 'border-sky-400',
    selectedText: 'text-sky-200',
    selectedGlow: '0 0 25px rgba(14, 165, 233, 0.65)',
    indicator: 'bg-sky-400',
    badge: 'CIVIL EXAMS'
  },
  universities: {
    border: 'border-pink-500/25',
    hoverBorder: 'hover:border-pink-400/80',
    bg: 'bg-pink-950/20 hover:bg-pink-950/40',
    iconBg: 'bg-pink-500/15 group-hover:bg-pink-500/25',
    iconText: 'text-pink-400',
    selectedBg: 'bg-gradient-to-r from-pink-600/40 via-fuchsia-600/30 to-violet-600/30',
    selectedBorder: 'border-pink-400',
    selectedText: 'text-pink-200',
    selectedGlow: '0 0 25px rgba(236, 72, 153, 0.65)',
    indicator: 'bg-pink-400',
    badge: 'ACADEMIC PORTALS'
  },
  organizations: {
    border: 'border-purple-500/25',
    hoverBorder: 'hover:border-purple-400/80',
    bg: 'bg-purple-950/20 hover:bg-purple-950/40',
    iconBg: 'bg-purple-500/15 group-hover:bg-purple-500/25',
    iconText: 'text-purple-400',
    selectedBg: 'bg-gradient-to-r from-purple-600/40 via-indigo-600/30 to-blue-600/30',
    selectedBorder: 'border-purple-400',
    selectedText: 'text-purple-200',
    selectedGlow: '0 0 25px rgba(168, 85, 247, 0.65)',
    indicator: 'bg-purple-400',
    badge: 'CROSS-TEAM FLOW'
  },
  aliens: {
    border: 'border-lime-500/25',
    hoverBorder: 'hover:border-lime-400/80',
    bg: 'bg-lime-950/20 hover:bg-lime-950/40',
    iconBg: 'bg-lime-500/15 group-hover:bg-lime-500/25',
    iconText: 'text-lime-400',
    selectedBg: 'bg-gradient-to-r from-lime-600/40 via-emerald-600/30 to-green-600/30',
    selectedBorder: 'border-lime-400',
    selectedText: 'text-lime-200',
    selectedGlow: '0 0 25px rgba(132, 204, 22, 0.65)',
    indicator: 'bg-lime-400',
    badge: 'QUANTUM COMM'
  },
  marsCitizens: {
    border: 'border-red-500/25',
    hoverBorder: 'hover:border-red-400/80',
    bg: 'bg-red-950/20 hover:bg-red-950/40',
    iconBg: 'bg-red-500/15 group-hover:bg-red-500/25',
    iconText: 'text-red-400',
    selectedBg: 'bg-gradient-to-r from-red-600/40 via-orange-600/30 to-amber-600/30',
    selectedBorder: 'border-red-400',
    selectedText: 'text-red-200',
    selectedGlow: '0 0 25px rgba(239, 68, 68, 0.65)',
    indicator: 'bg-red-400',
    badge: 'COLONY SYSTEMS'
  },
  jupiterCitizens: {
    border: 'border-amber-500/25',
    hoverBorder: 'hover:border-amber-400/80',
    bg: 'bg-amber-950/20 hover:bg-amber-950/40',
    iconBg: 'bg-amber-500/15 group-hover:bg-amber-500/25',
    iconText: 'text-amber-400',
    selectedBg: 'bg-gradient-to-r from-amber-600/40 via-orange-600/30 to-yellow-600/30',
    selectedBorder: 'border-amber-400',
    selectedText: 'text-amber-200',
    selectedGlow: '0 0 25px rgba(245, 158, 11, 0.65)',
    indicator: 'bg-amber-400',
    badge: 'JOVIAN SYSTEMS'
  },
  govOfficials: {
    border: 'border-orange-500/25',
    hoverBorder: 'hover:border-orange-400/80',
    bg: 'bg-orange-950/20 hover:bg-orange-950/40',
    iconBg: 'bg-orange-500/15 group-hover:bg-orange-500/25',
    iconText: 'text-orange-400',
    selectedBg: 'bg-gradient-to-r from-orange-600/40 via-amber-600/30 to-yellow-600/30',
    selectedBorder: 'border-orange-400',
    selectedText: 'text-orange-200',
    selectedGlow: '0 0 25px rgba(249, 115, 22, 0.65)',
    indicator: 'bg-orange-400',
    badge: 'POLICY AUDITS'
  },
  privateOfficials: {
    border: 'border-teal-500/25',
    hoverBorder: 'hover:border-teal-400/80',
    bg: 'bg-teal-950/20 hover:bg-teal-950/40',
    iconBg: 'bg-teal-500/15 group-hover:bg-teal-500/25',
    iconText: 'text-teal-400',
    selectedBg: 'bg-gradient-to-r from-teal-600/40 via-sky-600/30 to-blue-600/30',
    selectedBorder: 'border-teal-400',
    selectedText: 'text-teal-200',
    selectedGlow: '0 0 25px rgba(20, 184, 166, 0.65)',
    indicator: 'bg-teal-400',
    badge: 'CORPORATE STEER'
  },
  humans: {
    border: 'border-fuchsia-500/25',
    hoverBorder: 'hover:border-fuchsia-400/80',
    bg: 'bg-fuchsia-950/20 hover:bg-fuchsia-950/40',
    iconBg: 'bg-fuchsia-500/15 group-hover:bg-fuchsia-500/25',
    iconText: 'text-fuchsia-400',
    selectedBg: 'bg-gradient-to-r from-fuchsia-600/40 via-purple-600/30 to-pink-600/30',
    selectedBorder: 'border-fuchsia-400',
    selectedText: 'text-fuchsia-200',
    selectedGlow: '0 0 25px rgba(217, 70, 239, 0.65)',
    indicator: 'bg-fuchsia-400',
    badge: 'HUMAN POTENTIAL'
  },
};

interface InteractiveBubbleProps {
  id: string;
  key?: any;
  cat: {
    key: string;
    label: string;
    icon: any;
    color: string;
    tabId: string;
    slogan: string;
    desc: string;
  };
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

function InteractiveBubble({ id, cat, isSelected, onClick, index }: InteractiveBubbleProps) {
  const Icon = cat.icon;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [clickParticles, setClickParticles] = useState<{ id: number; x: number; y: number; size: number; color: string; targetX: number; targetY: number }[]>([]);
  const particleIdCounter = useRef(0);

  const cTheme = categoryColors[cat.key] || categoryColors.students;

  // Magnetic Pull on Mouse Move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < 160) {
      // Pull strength increases closer to center but caps out
      const pullStrength = 0.12;
      setMouseOffset({
        x: distanceX * pullStrength,
        y: distanceY * pullStrength
      });
    } else {
      setMouseOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Click physics + Spawn bursting micro-bubbles
  const handleBubbleClick = (e: React.MouseEvent) => {
    onClick();

    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Spawn 6 small floating bubble particles from the click center
    const newParticles = Array.from({ length: 6 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 15 + Math.random() * 35;
      const size = 4 + Math.random() * 8;
      const colors = ['#00e5ff', '#a855f7', '#ec4899', '#3b82f6', '#10b981'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        id: particleIdCounter.current++,
        x: clickX,
        y: clickY,
        targetX: clickX + Math.cos(angle) * distance,
        targetY: clickY + Math.sin(angle) * distance,
        size,
        color: randomColor
      };
    });

    setClickParticles(prev => [...prev, ...newParticles]);
  };

  // Clean up finished particles
  useEffect(() => {
    if (clickParticles.length > 0) {
      const timer = setTimeout(() => {
        setClickParticles([]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [clickParticles]);

  // Stagger/Randomize continuous idle float period
  const bobbingDuration = 3.5 + (index % 3) * 0.8;
  const bobbingDelay = index * 0.2;

  return (
    <motion.div
      className="relative w-full"
      animate={{
        y: [0, -6, 0],
      }}
      transition={{
        duration: bobbingDuration,
        delay: bobbingDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.button
        ref={buttonRef}
        id={id}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleBubbleClick}
        animate={{
          x: mouseOffset.x,
          y: mouseOffset.y,
          scale: isSelected ? 1.05 : 1,
        }}
        whileHover={{
          scale: 1.04,
          boxShadow: isSelected 
            ? cTheme.selectedGlow 
            : `0 0 20px rgba(255, 255, 255, 0.08)`,
        }}
        whileTap={{
          scale: 0.94,
          rotate: (index % 2 === 0 ? 1.5 : -1.5),
        }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 12,
          mass: 0.5
        }}
        className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer text-left w-full justify-start overflow-hidden select-none group ${
          isSelected 
            ? `${cTheme.selectedBg} ${cTheme.selectedBorder} text-white`
            : `bg-gradient-to-br from-[#120d2a]/95 to-[#08051a]/95 ${cTheme.border} ${cTheme.hoverBorder} text-slate-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]`
        }`}
        style={{
          boxShadow: isSelected ? cTheme.selectedGlow : undefined
        }}
      >
        {/* Background bubble sheen overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none opacity-40 rounded-2xl"></div>
        
        {/* 3D highlight edge mimicking user's screenshot */}
        <div className={`absolute top-0 left-0 right-0 h-[1.5px] rounded-full pointer-events-none ${
          isSelected 
            ? 'bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-90' 
            : `bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40 group-hover:via-white/40 transition-all`
        }`}></div>

        <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 transition-all duration-300 ${
          isSelected 
            ? 'bg-white/20 text-white border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.4)] scale-110' 
            : `${cTheme.iconBg} ${cTheme.iconText} border border-transparent group-hover:scale-105`
        }`}>
          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isSelected ? 'animate-bounce' : 'group-hover:rotate-12'}`} />
        </div>
        
        <div className="flex flex-col">
          <span className={`text-[10px] sm:text-xs font-extrabold uppercase tracking-widest leading-snug transition-colors ${
            isSelected ? 'text-white' : 'text-slate-100 group-hover:text-white'
          }`}>{cat.label}</span>
          <span className={`hidden sm:inline-block text-[8px] uppercase tracking-widest font-bold mt-0.5 opacity-90 transition-colors ${
            isSelected ? 'text-white/80' : `${cTheme.iconText}`
          }`}>
            {cTheme.badge}
          </span>
        </div>

        {/* Pulsing colored indicator dot on the right */}
        <div className="ml-auto flex items-center justify-center pl-1">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isSelected ? 'bg-white' : cTheme.indicator
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isSelected ? 'bg-white' : cTheme.indicator
            }`}></span>
          </span>
        </div>

        {/* Floating click particles inside the button context */}
        <AnimatePresence>
          {clickParticles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: p.x, y: p.y, scale: 1, opacity: 0.9 }}
              animate={{ 
                x: p.targetX, 
                y: p.targetY, 
                scale: [1, 1.4, 0], 
                opacity: [0.9, 0.7, 0] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                left: 0,
                top: 0
              }}
            />
          ))}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

export default function WelcomeLanding({ 
  onEnter, 
  setActiveTab, 
  language, 
  onLanguageChange, 
  setIsChatOpen,
  onQuickChat,
  onShare
}: WelcomeLandingProps) {
  const [selectedCategory, setSelectedCategory] = useState('students');
  const [activeOrbText, setActiveOrbText] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [simulatedInput, setSimulatedInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success'>('idle');

  const categoryBubbleItems = [
    {
      key: 'students',
      label: 'Students',
      icon: GraduationCap,
      color: 'from-indigo-600/30 to-blue-600/10 border-indigo-500/40 text-indigo-300',
      tabId: 'syllabus',
      slogan: 'STUDENTS',
      desc: 'Access student curriculum, adaptive learning syllabus, and career advice.'
    },
    {
      key: 'teachers',
      label: 'Teachers',
      icon: BookOpen,
      color: 'from-emerald-600/30 to-teal-600/10 border-emerald-500/40 text-emerald-300',
      tabId: 'syllabus',
      slogan: 'TEACHERS',
      desc: 'Create lesson plans, structure academic maps, and manage digital classrooms.'
    },
    {
      key: 'parents',
      label: 'Parents',
      icon: Users,
      color: 'from-pink-600/30 to-rose-600/10 border-pink-500/40 text-pink-300',
      tabId: 'syllabus',
      slogan: 'PARENTS',
      desc: 'Monitor educational progress, syllabus coverage, and child growth milestones.'
    },
    {
      key: 'scientists',
      label: 'Scientists',
      icon: FlaskConical,
      color: 'from-cyan-600/30 to-blue-600/10 border-cyan-500/40 text-cyan-300',
      tabId: 'courses',
      slogan: 'SCIENTISTS',
      desc: 'Run simulations, query research publications, and structure hypotheses.'
    },
    {
      key: 'researchers',
      label: 'Researchers',
      icon: Activity,
      color: 'from-blue-600/30 to-sky-600/10 border-blue-500/40 text-blue-300',
      tabId: 'courses',
      slogan: 'RESEARCHERS',
      desc: 'Compile reference databases, summarize whitepapers, and perform data audits.'
    },
    {
      key: 'doctors',
      label: 'Doctors',
      icon: Stethoscope,
      color: 'from-rose-600/30 to-pink-600/10 border-rose-500/40 text-rose-300',
      tabId: 'courses',
      slogan: 'DOCTORS',
      desc: 'Keep up-to-date with medical publications, clinical insights, and patient logs.'
    },
    {
      key: 'engineers',
      label: 'Engineers',
      icon: Cpu,
      color: 'from-emerald-600/30 to-green-600/10 border-emerald-500/40 text-emerald-300',
      tabId: 'courses',
      slogan: 'ENGINEERS',
      desc: 'Develop structural schematics, manage systems architectures, and write code.'
    },
    {
      key: 'entrepreneurs',
      label: 'Entrepreneurs',
      icon: Lightbulb,
      color: 'from-amber-600/30 to-yellow-600/10 border-amber-500/40 text-amber-300',
      tabId: 'business',
      slogan: 'ENTREPRENEURS',
      desc: 'Generate compliance files, financial projections, and business canvas models.'
    },
    {
      key: 'jobSeeker',
      label: 'Job Seekers',
      icon: Briefcase,
      color: 'from-teal-600/30 to-emerald-600/10 border-teal-500/40 text-teal-300',
      tabId: 'jobs',
      slogan: 'JOB SEEKERS',
      desc: 'Search active high-fidelity recruitment boards and optimize entry profiles.'
    },
    {
      key: 'professionals',
      label: 'Professionals',
      icon: UserCheck,
      color: 'from-indigo-600/30 to-violet-600/10 border-indigo-500/40 text-indigo-300',
      tabId: 'jobs',
      slogan: 'PROFESSIONALS',
      desc: 'Advance career milestones, expand industry networks, and track certifications.'
    },
    {
      key: 'businesses',
      label: 'Businesses',
      icon: Building,
      color: 'from-teal-600/30 to-cyan-600/10 border-teal-500/40 text-teal-300',
      tabId: 'business',
      slogan: 'BUSINESSES',
      desc: 'Automate operational workflows, design B2B pipelines, and handle client logs.'
    },
    {
      key: 'govAspirant',
      label: 'Govt. Aspirants',
      icon: Landmark,
      color: 'from-sky-600/30 to-blue-600/10 border-sky-500/40 text-sky-300',
      tabId: 'jobs',
      slogan: 'GOVT. ASPIRANTS',
      desc: 'Apply for central SSC, railway, and state commissions with offline study guides.'
    },
    {
      key: 'universities',
      label: 'Universities',
      icon: GraduationCap,
      color: 'from-pink-600/30 to-fuchsia-600/10 border-pink-500/40 text-pink-300',
      tabId: 'syllabus',
      slogan: 'UNIVERSITIES',
      desc: 'Establish modern academic curriculum standards and manage student portals.'
    },
    {
      key: 'organizations',
      label: 'Organizations',
      icon: Network,
      color: 'from-violet-600/30 to-indigo-600/10 border-violet-500/40 text-violet-300',
      tabId: 'business',
      slogan: 'ORGANIZATIONS',
      desc: 'Coordinate cross-team projects, establish workflows, and audit resources.'
    },
    {
      key: 'aliens',
      label: 'Aliens',
      icon: Bot,
      color: 'from-lime-600/30 to-green-600/10 border-lime-500/40 text-lime-300',
      tabId: 'career',
      slogan: 'ALIENS',
      desc: 'Interstellar task-coordination, atmospheric data processing, and quantum logic.'
    },
    {
      key: 'marsCitizens',
      label: 'The citizens of Mars',
      icon: Globe,
      color: 'from-red-600/30 to-orange-600/10 border-red-500/40 text-red-300',
      tabId: 'career',
      slogan: 'MARS CITIZENS',
      desc: 'Manage colony lifesupport parameters, terraforming timelines, and red-planet charts.'
    },
    {
      key: 'jupiterCitizens',
      label: 'The citizens of Jupiter',
      icon: Sparkles,
      color: 'from-amber-600/30 to-orange-600/10 border-amber-500/40 text-amber-300',
      tabId: 'career',
      slogan: 'JUPITER CITIZENS',
      desc: 'Navigate gas-giant weather patterns, high-gravity logistics, and Jovian moon bases.'
    },
    {
      key: 'govOfficials',
      label: 'All Govt. Officials',
      icon: ShieldCheck,
      color: 'from-orange-600/30 to-amber-600/10 border-orange-500/40 text-orange-300',
      tabId: 'business',
      slogan: 'GOVT. OFFICIALS',
      desc: 'Implement regulatory policies, manage compliance standards, and administer public datasets.'
    },
    {
      key: 'privateOfficials',
      label: 'All Private officials',
      icon: Briefcase,
      color: 'from-teal-600/30 to-sky-600/10 border-teal-500/40 text-teal-300',
      tabId: 'business',
      slogan: 'PRIVATE OFFICIALS',
      desc: 'Direct corporate strategy, draft partnership templates, and coordinate corporate growth.'
    },
    {
      key: 'humans',
      label: 'Humans',
      icon: User,
      color: 'from-fuchsia-600/30 to-purple-600/10 border-fuchsia-500/40 text-fuchsia-300',
      tabId: 'career',
      slogan: 'HUMANS',
      desc: 'All human individuals looking for general guidance, learning roadmaps, and personal development advice.'
    }
  ];

  const leftCategories = categoryBubbleItems.slice(0, 10);
  const rightCategories = categoryBubbleItems.slice(10);
  const selectedItem = categoryBubbleItems.find(c => c.key === selectedCategory) || categoryBubbleItems[0];

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler for opening the actual functional chatbot directly with pre-selected prompts
  const triggerActualChat = (prompt?: string) => {
    if (setIsChatOpen) {
      setIsChatOpen(true);
      if (prompt) {
        // Send simulated input to the actual Chat session
        setTimeout(() => {
          const chatInputEl = document.querySelector('textarea[placeholder*="Ask Arohi"], input[placeholder*="Ask Arohi"]') as HTMLTextAreaElement | HTMLInputElement | null;
          if (chatInputEl) {
            chatInputEl.value = prompt;
            const event = new Event('input', { bubbles: true });
            chatInputEl.dispatchEvent(event);
          }
        }, 300);
      }
    } else {
      onEnter();
    }
  };

  // List of everyone
  const categories = [
    { name: 'Students', icon: GraduationCap, color: 'text-indigo-400' },
    { name: 'Teachers', icon: BookOpen, color: 'text-emerald-400' },
    { name: 'Parents', icon: Users, color: 'text-pink-400' },
    { name: 'Scientists', icon: FlaskConical, color: 'text-cyan-400' },
    { name: 'Researchers', icon: Activity, color: 'text-blue-400' },
    { name: 'Doctors', icon: Stethoscope, color: 'text-rose-400' },
    { name: 'Engineers', icon: Cpu, color: 'text-amber-400' },
    { name: 'Entrepreneurs', icon: Lightbulb, color: 'text-yellow-400' },
    { name: 'Job Seekers', icon: Briefcase, color: 'text-[#00e676]' },
    { name: 'Professionals', icon: UserCheck, color: 'text-purple-400' },
    { name: 'Businesses', icon: Building, color: 'text-teal-400' },
    { name: 'Govt. Aspirants', icon: Landmark, color: 'text-[#00b0ff]' },
    { name: 'Universities', icon: GraduationCap, color: 'text-pink-400' },
    { name: 'Organizations', icon: Network, color: 'text-violet-400' },
    { name: 'Aliens', icon: Bot, color: 'text-lime-400' },
    { name: 'The citizens of Mars', icon: Globe, color: 'text-red-400' },
    { name: 'The citizens of Jupiter', icon: Sparkles, color: 'text-amber-500' },
    { name: 'All Govt. Officials', icon: ShieldCheck, color: 'text-orange-500' },
    { name: 'All Private officials', icon: Briefcase, color: 'text-teal-400' }
  ];

  return (
    <div className="relative w-full bg-[#020208] text-white overflow-x-hidden font-sans select-none pb-2">
      
      {/* Dynamic Keyframes Styling for Orbit Nodes & Genius Animations */}
      <style>{`
        @keyframes float-orbit {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes rotate-concentric {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-concentric-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes grid-slide {
          0% { background-position: 0 0; }
          100% { background-position: 0 80px; }
        }
        @keyframes scanline-move {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes nebula-drift-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 0.4; }
          33% { transform: translate(40px, -30px) scale(1.15) rotate(120deg); opacity: 0.55; }
          66% { transform: translate(-30px, 50px) scale(0.9) rotate(240deg); opacity: 0.35; }
        }
        @keyframes nebula-drift-medium {
          0%, 100% { transform: translate(0px, 0px) scale(1.1) rotate(360deg); opacity: 0.35; }
          50% { transform: translate(-50px, 40px) scale(0.85) rotate(180deg); opacity: 0.5; }
        }
        @keyframes shooting-star-fly {
          0% { transform: translate(100vw, -10vh) rotate(-45deg) scale(0); opacity: 0; }
          1% { opacity: 1; }
          8% { transform: translate(-20vw, 110vh) rotate(-45deg) scale(1.5); opacity: 0; }
          100% { transform: translate(-20vw, 110vh) rotate(-45deg) scale(0); opacity: 0; }
        }
        @keyframes space-dust-drift {
          0% { transform: translateY(100vh) translateX(0) scale(0.5); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(50px) scale(1.2); opacity: 0; }
        }
        @keyframes text-shimmer-sweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes orbit-quantum-node-1 {
          0% { transform: rotate(0deg) translateX(90px) rotate(0deg) scale(0.9); }
          50% { transform: rotate(180deg) translateX(90px) rotate(-180deg) scale(1.2); }
          100% { transform: rotate(360deg) translateX(90px) rotate(-360deg) scale(0.9); }
        }
        @keyframes orbit-quantum-node-2 {
          0% { transform: rotate(120deg) translateX(90px) rotate(-120deg) scale(1.1); }
          50% { transform: rotate(300deg) translateX(90px) rotate(-300deg) scale(0.8); }
          100% { transform: rotate(480deg) translateX(90px) rotate(-480deg) scale(1.1); }
        }
        @keyframes orbit-quantum-node-3 {
          0% { transform: rotate(240deg) translateX(90px) rotate(-240deg) scale(0.8); }
          50% { transform: rotate(420deg) translateX(90px) rotate(-420deg) scale(1.2); }
          100% { transform: rotate(600deg) translateX(90px) rotate(-600deg) scale(0.8); }
        }
        @keyframes eq-bar-1 { 0%, 100% { height: 4px; } 50% { height: 16px; } }
        @keyframes eq-bar-2 { 0%, 100% { height: 14px; } 50% { height: 6px; } }
        @keyframes eq-bar-3 { 0%, 100% { height: 8px; } 50% { height: 18px; } }
        @keyframes eq-bar-4 { 0%, 100% { height: 16px; } 50% { height: 4px; } }

        .shimmer-text-glow {
          background-size: 200% auto;
          animation: text-shimmer-sweep 6s ease infinite;
        }
        .animate-orbit-node-1 { animation: orbit-quantum-node-1 12s linear infinite; }
        .animate-orbit-node-2 { animation: orbit-quantum-node-2 12s linear infinite; }
        .animate-orbit-node-3 { animation: orbit-quantum-node-3 12s linear infinite; }
        .animate-eq-1 { animation: eq-bar-1 1.2s ease-in-out infinite; }
        .animate-eq-2 { animation: eq-bar-2 0.9s ease-in-out infinite; }
        .animate-eq-3 { animation: eq-bar-3 1.4s ease-in-out infinite; }
        .animate-eq-4 { animation: eq-bar-4 1.1s ease-in-out infinite; }
        
        .animate-float-orbit {
          animation: float-orbit 6s ease-in-out infinite;
        }
        .animate-rotate-concentric {
          animation: rotate-concentric 25s linear infinite;
        }
        .animate-rotate-concentric-reverse {
          animation: rotate-concentric-reverse 35s linear infinite;
        }
        .animated-grid {
          background-image: linear-gradient(rgba(124, 58, 237, 0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(124, 58, 237, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-slide 12s linear infinite;
        }
        .animated-scanline {
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(0, 229, 255, 0.01) 30%,
            rgba(0, 229, 255, 0.04) 50%,
            rgba(0, 229, 255, 0.01) 70%,
            transparent 100%
          );
          animation: scanline-move 14s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-nebula-1 {
          animation: nebula-drift-slow 22s ease-in-out infinite;
        }
        .animate-nebula-2 {
          animation: nebula-drift-medium 28s ease-in-out infinite;
        }
        .animate-nebula-3 {
          animation: nebula-drift-slow 34s ease-in-out infinite;
          animation-delay: -5s;
        }
        .animate-star-1 { animation: shooting-star-fly 14s linear infinite; animation-delay: 1s; }
        .animate-star-2 { animation: shooting-star-fly 18s linear infinite; animation-delay: 5s; }
        .animate-star-3 { animation: shooting-star-fly 22s linear infinite; animation-delay: 10s; }
        .animate-star-4 { animation: shooting-star-fly 15s linear infinite; animation-delay: 3s; }
        .animate-star-5 { animation: shooting-star-fly 25s linear infinite; animation-delay: 12s; }
        
        .animate-dust-1 { animation: space-dust-drift 18s linear infinite; }
        .animate-dust-2 { animation: space-dust-drift 24s linear infinite; animation-delay: -6s; }
        .animate-dust-3 { animation: space-dust-drift 30s linear infinite; animation-delay: -12s; }
        .animate-dust-4 { animation: space-dust-drift 21s linear infinite; animation-delay: -3s; }
        .animate-dust-5 { animation: space-dust-drift 27s linear infinite; animation-delay: -18s; }
      `}</style>

      {/* 1. Backdrop Stars and Plasma Clouds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Futuristic Sci-fi Grid */}
        <div className="absolute inset-0 animated-grid opacity-[0.45] mix-blend-color-dodge"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020208]/60 to-[#020208]"></div>
        
        {/* Holographic Scanline bar */}
        <div className="absolute inset-0 animated-scanline mix-blend-screen"></div>

        {/* Dynamic Plasma/Nebula Clouds */}
        <div className="absolute top-[5%] left-[-15%] w-[65%] h-[600px] bg-gradient-to-tr from-[#7c3aed]/20 via-[#3b82f6]/10 to-transparent blur-[140px] rounded-full animate-nebula-1"></div>
        <div className="absolute top-[35%] right-[-15%] w-[65%] h-[600px] bg-gradient-to-bl from-[#ec4899]/15 via-[#7c3aed]/8 to-transparent blur-[140px] rounded-full animate-nebula-2"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[55%] h-[500px] bg-gradient-to-tr from-[#00e5ff]/12 via-[#3b82f6]/8 to-transparent blur-[120px] rounded-full animate-nebula-3"></div>
        
        {/* Cosmic Shooting Stars (Diagonal laser trails) */}
        <div className="absolute top-0 right-0 w-[2px] h-[100px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-star-1 opacity-0 mix-blend-screen shadow-[0_0_12px_#00e5ff]"></div>
        <div className="absolute top-0 right-0 w-[1.5px] h-[150px] bg-gradient-to-b from-transparent via-purple-400 to-transparent animate-star-2 opacity-0 mix-blend-screen shadow-[0_0_12px_#7c3aed]"></div>
        <div className="absolute top-0 right-0 w-[2px] h-[80px] bg-gradient-to-b from-transparent via-pink-400 to-transparent animate-star-3 opacity-0 mix-blend-screen shadow-[0_0_12px_#ec4899]"></div>
        <div className="absolute top-0 right-0 w-[1.5px] h-[120px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-star-4 opacity-0 mix-blend-screen shadow-[0_0_12px_#10b981]"></div>
        <div className="absolute top-0 right-0 w-[2px] h-[90px] bg-gradient-to-b from-transparent via-cyan-300 to-transparent animate-star-5 opacity-0 mix-blend-screen shadow-[0_0_12px_#06b6d4]"></div>

        {/* Slow drifting Space Dust particles */}
        <div className="absolute left-[8%] w-1.5 h-1.5 bg-cyan-400 rounded-full animate-dust-1 blur-[0.5px]"></div>
        <div className="absolute left-[24%] w-1 h-1 bg-purple-400 rounded-full animate-dust-2 blur-[0.5px]"></div>
        <div className="absolute left-[48%] w-2 h-2 bg-pink-400/70 rounded-full animate-dust-3 blur-[1px]"></div>
        <div className="absolute left-[68%] w-1 h-1 bg-blue-400 rounded-full animate-dust-4"></div>
        <div className="absolute left-[88%] w-1.5 h-1.5 bg-emerald-400/80 rounded-full animate-dust-5 blur-[0.5px]"></div>
        
        {/* Constant subtle starry sparkle in grid corners */}
        <div className="absolute top-24 left-[15%] w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-48 right-[18%] w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-64 left-[25%] w-1.5 h-1.5 bg-pink-500/30 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-24 right-[10%] w-2 h-2 bg-emerald-400/30 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
      </div>

      {/* 2. Top Header Navigation (Nav) */}
      <nav className="relative z-50 w-full border-b border-white/5 bg-[#020208]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Trust Seal Logo for Authentic Feel */}
          <div className="flex items-center gap-2 bg-[#060e0a]/90 border border-emerald-500/35 px-3.5 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.12)] select-none">
            <ShieldCheck className="w-4 h-4 text-[#00e676] shrink-0 animate-pulse" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black tracking-widest text-[#00e676] leading-none uppercase">
                100% SECURE & CERTIFIED
              </span>
              <span className="text-[8px] font-bold text-slate-400 tracking-wider leading-none mt-0.5 uppercase">
                ISO 9001:2015 TRUSTED AI PARTNER
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center">
            
            {/* Language dropdown button */}
            <div className="relative" ref={langDropdownRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#120d2b]/80 hover:bg-[#1b143f]/90 border border-purple-500/30 rounded-full text-[10px] font-bold text-slate-200 hover:text-white transition-all shadow-md cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '20s' }} />
                <span>{LANGUAGES_LIST.find(l => l.code === language)?.symbol || 'AA'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0d091e]/95 border border-[#3e2b85]/60 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.5)] backdrop-blur-md z-[100] overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-white/5 text-[9px] text-slate-400 font-bold uppercase tracking-wider sticky bg-[#0d091e]">
                    {getTranslation('selectLang', language)}
                  </div>
                  {LANGUAGES_LIST.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code as Language);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-all flex items-center justify-between cursor-pointer ${
                        language === lang.code ? 'bg-[#7c3aed]/25 text-purple-200 font-bold' : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{lang.native}</span>
                      {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </nav>

      {/* 3. Hero Section (Home) - Symmetrical 3D Floating Bubbles & Core Orb */}
      <section id="home" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
        
        {/* Top Header info matching user's screenshot layout */}
        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center justify-center gap-2 bg-[#091515] border border-cyan-500/30 text-[#00e5ff] px-4 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm uppercase">
            <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
            <span>World's #1 Search Engine on Call ★</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-pink-500 drop-shadow-[0_0_40px_rgba(236,72,153,0.35)] leading-none pt-1 uppercase font-sans shimmer-text-glow">
            AROHI AI
          </h1>
          
          <p className="text-[11px] sm:text-xs md:text-sm font-black tracking-[0.3em] uppercase mt-1 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            {getTranslation('dreamPrepare', language)}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-[#120d2a]/85 border border-[#7c3aed]/40 text-purple-200 px-4 py-1 rounded-full text-[10px] sm:text-xs font-extrabold tracking-wider shadow-[0_4px_20px_rgba(124,58,237,0.15)] mt-2 backdrop-blur-sm uppercase select-none">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e5ff]"></span>
            </span>
            <span>NATIVE ODIA / ଓଡ଼ିଆ FULLY ACTIVE & OPTIMIZED</span>
            <span className="text-slate-500 font-normal">|</span>
            <span className="text-cyan-400 font-extrabold">150+ LANGUAGES CHAT & CALL</span>
          </div>
        </div>

        {/* Desktop 3D Bubble Layout Container (Hidden on Mobile) */}
        <div className="hidden md:grid grid-cols-12 gap-4 items-center justify-center relative min-h-[460px] sm:min-h-[500px] max-w-5xl mx-auto">
          
          {/* Background Concentric Rings (Centered behind or layered) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
              {/* Outer dashed ring */}
              <div className="absolute w-full h-full rounded-full border-2 border-dashed border-[#00e5ff]/15 animate-rotate-concentric"></div>
              {/* Middle ring */}
              <div className="absolute w-[80%] h-[80%] rounded-full border border-indigo-500/10 animate-rotate-concentric-reverse"></div>
              {/* Inner ring */}
              <div className="absolute w-[60%] h-[60%] rounded-full border-2 border-pink-500/10"></div>
              {/* Glowing aura */}
              <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#7c3aed]/5 to-[#00e5ff]/5 blur-3xl"></div>
            </div>
          </div>

          {/* LEFT COLUMN: 5 categories */}
          <div className="col-span-4 flex flex-col gap-5 z-10 text-right pr-4">
            {leftCategories.map((cat, idx) => (
              <InteractiveBubble
                id={`category-btn-${cat.key}`}
                key={cat.key}
                cat={cat}
                isSelected={selectedCategory === cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setActiveOrbText(cat.desc);
                }}
                index={idx}
              />
            ))}
          </div>

          {/* MIDDLE COLUMN: Central Interactive Orb & Pedestal */}
          <div className="col-span-4 flex flex-col items-center justify-center z-10 h-full relative py-8">
            
            {/* Central Hologram Pedestal */}
            <div className="absolute bottom-[10%] w-full flex flex-col items-center pointer-events-none">
              <div className="w-36 h-6 bg-blue-900/35 border border-blue-500/40 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.45)]"></div>
              <div className="w-24 h-4 bg-slate-950/75 border border-purple-500/25 rounded-full shadow-[inset_0_0_10px_rgba(124,58,237,0.45)] -mt-2"></div>
            </div>

            {/* Central Arohi Avatar Bubble */}
            <div className="relative flex flex-col items-center gap-3">
              {/* Floating Symmetrical Heartbeat Tag above the central bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: [0.95, 1, 0.95],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-gradient-to-r from-[#17103a] to-[#6327d4] text-white px-4 py-2 rounded-2xl border border-[#7c3aed]/55 text-xs font-black tracking-widest uppercase shadow-[0_8px_25px_rgba(124,58,237,0.5)] backdrop-blur-md flex items-center gap-2 select-none z-10"
              >
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping shrink-0"></span>
                <span>Ask Arohi! ✨</span>
              </motion.div>

              {/* Central Arohi Chatbot Bubble showing Arohi's Avatar image, much bigger */}
              <button
                id="central-arohi-orb"
                onClick={() => {
                  if (onQuickChat) {
                    onQuickChat("Hi Arohi, let's get started!");
                  } else {
                    if (selectedItem) {
                      setActiveTab(selectedItem.tabId);
                    }
                    onEnter();
                  }
                }}
                className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-0 bg-transparent active:scale-95 transition-all duration-300 shadow-[0_12px_45px_rgba(124,58,237,0.655)] cursor-pointer overflow-visible group flex items-center justify-center"
                title="Talk to AROHI"
              >
                {/* Revolving Quantum Orbiting Nodes */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_12px_#00e5ff] animate-orbit-node-1 z-20"></div>
                  <div className="absolute w-2.5 h-2.5 bg-fuchsia-400 rounded-full shadow-[0_0_12px_#ec4899] animate-orbit-node-2 z-20"></div>
                  <div className="absolute w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_12px_#00e676] animate-orbit-node-3 z-20"></div>
                </div>

                {/* The Arohi animating SVG filling the entire button */}
                <div className="w-full h-full rounded-full relative z-10">
                  <ArohiAvatar className="w-full h-full scale-[1.08] transition-transform duration-500 group-hover:scale-115" />
                </div>

                {/* Glowing ring animation */}
                <span className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping opacity-60 pointer-events-none"></span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: 5 categories */}
          <div className="col-span-4 flex flex-col gap-5 z-10 text-left pl-4">
            {rightCategories.map((cat, idx) => (
              <InteractiveBubble
                id={`category-btn-${cat.key}`}
                key={cat.key}
                cat={cat}
                isSelected={selectedCategory === cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setActiveOrbText(cat.desc);
                }}
                index={idx + leftCategories.length}
              />
            ))}
          </div>

        </div>

        {/* Mobile Symmetrical Layout (Visible on Mobile Only) */}
        <div className="md:hidden flex flex-col items-center justify-center space-y-3 w-full relative">
          
          {/* Centered Mobile Orb */}
          <div className="relative flex items-center justify-center py-2 w-full">
            
            {/* Background dashed ring */}
            <div className="absolute w-56 h-56 rounded-full border border-dashed border-[#00e5ff]/20 animate-rotate-concentric"></div>
            
            <div className="relative flex flex-col items-center gap-2">
              {/* Floating Symmetrical Heartbeat Tag above the central bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: [0.95, 1, 0.95],
                  scale: [0.98, 1.02, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-gradient-to-r from-[#17103a] to-[#6327d4] text-white px-3 py-1 rounded-2xl border border-[#7c3aed]/55 text-[10px] font-black tracking-wider uppercase shadow-[0_6px_20px_rgba(124,58,237,0.4)] backdrop-blur-md flex items-center gap-1.5 select-none z-10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-ping shrink-0"></span>
                <span>Ask Arohi! ✨</span>
              </motion.div>

              {/* Core circular button fully showing Arohi's animating SVG */}
              <button
                id="central-arohi-orb-mobile"
                onClick={() => {
                  if (onQuickChat) {
                    onQuickChat("Hi Arohi, let's get started!");
                  } else {
                    if (selectedItem) {
                      setActiveTab(selectedItem.tabId);
                    }
                    onEnter();
                  }
                }}
                className="relative w-28 h-28 rounded-full p-0 bg-transparent active:scale-95 transition-all duration-300 shadow-[0_8px_32px_rgba(124,58,237,0.5)] cursor-pointer overflow-visible group"
                title="Talk to AROHI"
              >
                {/* The Arohi animating SVG filling the entire button */}
                <div className="w-full h-full rounded-full">
                  <ArohiAvatar className="w-full h-full scale-[1.08]" />
                </div>

                {/* Glowing ring animation */}
                <span className="absolute inset-0 rounded-full border border-purple-400/40 animate-ping opacity-60 pointer-events-none"></span>
              </button>
            </div>
          </div>

          {/* Symmetrical Left/Right category buttons array for Mobile */}
          <div className="grid grid-cols-2 gap-3.5 w-full px-1">
            {/* Left categories column */}
            <div className="flex flex-col gap-3">
              {leftCategories.map((cat, idx) => (
                <InteractiveBubble
                  id={`mobile-category-btn-${cat.key}`}
                  key={cat.key}
                  cat={cat}
                  isSelected={selectedCategory === cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setActiveOrbText(cat.desc);
                  }}
                  index={idx}
                />
              ))}
            </div>

            {/* Right categories column */}
            <div className="flex flex-col gap-3">
              {rightCategories.map((cat, idx) => (
                <InteractiveBubble
                  id={`mobile-category-btn-${cat.key}`}
                  key={cat.key}
                  cat={cat}
                  isSelected={selectedCategory === cat.key}
                  onClick={() => {
                    setSelectedCategory(cat.key);
                    setActiveOrbText(cat.desc);
                  }}
                  index={idx + leftCategories.length}
                />
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM CONTROLS & STATUS TICKER MATCHING USER'S SCREENSHOT */}
        <div className="mt-3 flex flex-col items-center justify-center space-y-2 max-w-xl mx-auto z-10 relative">
          
          {/* Primary Solid Neon Blue Journey Button */}
          <button 
            id="enter-the-journey-cta"
            onClick={() => {
              setActiveTab('home');
              onEnter();
            }}
            className="w-full bg-[#005cff] hover:bg-[#004cd0] text-white font-black text-sm sm:text-base uppercase tracking-widest py-3.5 px-8 rounded-full shadow-[0_10px_35px_rgba(0,92,255,0.5)] border border-blue-400/35 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Enter The Journey</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>

          {/* "AROHI AI ACTIVE" box with Live Audio EQ Equalizer Bars */}
          <div id="arohi-active-status-bar" className="w-full bg-[#031c26]/90 border border-teal-500/30 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-semibold text-slate-200 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e676]"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-[#00e676] tracking-widest">AROHI AI ACTIVE</span>
              <span className="text-slate-300 font-medium text-[10px] sm:text-xs">"Hi! I'm Arohi 🤖 Your AI Career Assistant."</span>
            </div>
            {/* Live Audio Equalizer Visualizer */}
            <div className="flex items-end gap-1 px-2 py-1 bg-[#002b36]/60 rounded-lg border border-teal-500/20 shrink-0">
              <span className="w-1 bg-cyan-400 rounded-full animate-eq-1"></span>
              <span className="w-1 bg-fuchsia-400 rounded-full animate-eq-2"></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-eq-3"></span>
              <span className="w-1 bg-purple-400 rounded-full animate-eq-4"></span>
            </div>
          </div>

        </div>

        {/* FOOTER SECTION AT THE BOTTOM OF THE WELCOME LANDING PAGE */}
        <footer id="welcome-footer" className="w-full max-w-6xl mx-auto px-4 mt-3 mb-1 z-10 relative">
          {/* Copyright, Security & Development/Maintenance Credits Banner */}
          <div className="bg-[#120d2a]/90 rounded-2xl border border-[#211b3d] p-3.5 sm:p-4 flex flex-col lg:flex-row justify-between items-center gap-3 text-xs font-semibold text-slate-400 backdrop-blur-md">
            <span className="flex items-center gap-2 font-bold text-slate-300">
              <ShieldCheck className="w-5 h-5 text-[#00e676] shrink-0" /> Verified Career & Opportunity Platform
            </span>
            <div className="text-center lg:text-right space-y-1">
              <p className="text-slate-300 font-bold">Copyright © 2026 Arohi AI (Arohiai.com). All Rights Reserved.</p>
              <p className="text-[10px] text-slate-500">
                Development and Maintenance by <span className="text-slate-400 font-bold">BRAGA TECHNOLOGIES PRIVATE LIMITED</span> in association with <span className="text-slate-400 font-bold">ODITREE SERVICES</span>
              </p>
            </div>
          </div>
        </footer>

      </section>

    </div>
  );
}
