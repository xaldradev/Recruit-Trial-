import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, CheckCircle, Landmark, Bell, ArrowUpRight, 
  ShieldCheck, Sparkles, Bot, GraduationCap, Briefcase, 
  ChevronRight, Mic, Users, Heart, Zap, Compass, 
  MessageSquare, ChevronDown, ChevronUp, Share2, Star, 
  Shield, Clock, Globe, ArrowRight, Phone, Cpu,
  Menu, X
} from 'lucide-react';
import ArohiAvatar from './ArohiAvatar';
import { PRICING_TIERS } from '../data/pricingData';

interface ArohiLandingPageProps {
  user: any;
  setActiveTab: (tab: string) => void;
  setIsChatOpen: (isOpen: boolean) => void;
  setIsChatMinimized: (isMinimized: boolean) => void;
  setChatInitialPrompt: (prompt: string | undefined) => void;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  subscriptions: any;
  handleSubscribe: (pathId: string) => void;
  setIsWalkthroughOpen: (isOpen: boolean) => void;
  setCheckoutPath: (path: { id: string; title: string; price: string } | null) => void;
  setPendingSubscriptionDetail: (detail: { tierName: string; price: number; margin: number } | null) => void;
  isTourEnabled?: boolean;
}

export default function ArohiLandingPage({
  user,
  setActiveTab,
  setIsChatOpen,
  setIsChatMinimized,
  setChatInitialPrompt,
  setIsAuthModalOpen,
  subscriptions,
  handleSubscribe,
  setIsWalkthroughOpen,
  setCheckoutPath,
  setPendingSubscriptionDetail,
  isTourEnabled = false
}: ArohiLandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [activeOrbText, setActiveOrbText] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // FAQs exact data from screenshot
  const faqs = [
    {
      question: "What is Arohi?",
      answer: "Arohi is an AI-powered personal assistant designed to simplify learning, research, career growth, business planning, and everyday problem-solving. Instead of switching between dozens of websites and applications, ask Arohi one question and receive intelligent, personalized guidance."
    },
    {
      question: "Who can use Arohi?",
      answer: "Anyone—from school students and college learners to researchers, professionals, teachers, and business entrepreneurs."
    },
    {
      question: "How many languages does Arohi support?",
      answer: "Arohi supports active conversations, translations, and tutoring in over 150+ national and global languages."
    },
    {
      question: "Can Arohi help with research?",
      answer: "Yes, Arohi assists with literature reviews, scientific concepts, research paper summarization, technical writing, and business intelligence."
    },
    {
      question: "Is Arohi available 24x7?",
      answer: "Yes, Arohi is online 24 hours a day, 7 days a week, to help you learn, think, and grow anytime, anywhere."
    }
  ];

  // Quick Chat trigger helper
  const handleQuickChatPrompt = (promptText: string) => {
    setChatInitialPrompt(promptText);
    setIsChatOpen(true);
    setIsChatMinimized(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterSubmitted(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <div id="home-landing-root" className="space-y-16 pb-12 text-slate-100 font-sans">
      
      {/* 1. INTERNAL NAVBAR IN CARD COMPONENT FOR PREMIUM SCREENSHOT ALIGNMENT */}
      <header className="flex flex-col py-4 px-6 md:px-8 bg-slate-950/40 border border-slate-800/60 rounded-3xl backdrop-blur-xl shadow-lg relative z-20">
        <div className="flex items-center justify-between w-full">
          {/* Logo left */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
              </span>
              <span className="text-lg font-black tracking-tight text-white flex items-center">
                AROHI <span className="text-indigo-400 ml-1 font-extrabold text-sm px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded-md">AI</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold tracking-wide -mt-0.5 ml-8 uppercase">by Recruit</span>
          </div>

          {/* Navigation Middle Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#home-landing-root" className="hover:text-white transition-colors flex flex-col items-center group">
              <span>Home</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1"></span>
            </a>
            <a href="#features-grid" className="hover:text-white transition-colors flex flex-col items-center group">
              <span>Features</span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-indigo-400/50 mt-1 transition-all"></span>
            </a>
            <a href="#about-section" className="hover:text-white transition-colors flex flex-col items-center group">
              <span>About Arohi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-indigo-400/50 mt-1 transition-all"></span>
            </a>
            <a href="#contact-section" className="hover:text-white transition-colors flex flex-col items-center group">
              <span>Contact Us</span>
              <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-indigo-400/50 mt-1 transition-all"></span>
            </a>
          </nav>

          {/* Start Free CTA button on right & Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                if (user) {
                  setActiveTab('arohi');
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-2xl border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              Start Free
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/70 border border-purple-500/50 hover:border-purple-400/80 text-slate-100 hover:text-white transition-all cursor-pointer flex items-center justify-center min-w-[38px] h-9 active:scale-95"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden w-full overflow-hidden border-t border-slate-800/60 mt-4 pt-4"
            >
              <div className="flex flex-col gap-3">
                <a 
                  href="#home-landing-root" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left py-2 px-3 text-slate-300 hover:text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/5 rounded-lg transition-all block"
                >
                  Home
                </a>
                <a 
                  href="#features-grid" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left py-2 px-3 text-slate-300 hover:text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/5 rounded-lg transition-all block"
                >
                  Features
                </a>
                <a 
                  href="#about-section" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left py-2 px-3 text-slate-300 hover:text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/5 rounded-lg transition-all block"
                >
                  About Arohi
                </a>
                <a 
                  href="#contact-section" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left py-2 px-3 text-slate-300 hover:text-white font-semibold text-xs tracking-wider uppercase hover:bg-white/5 rounded-lg transition-all block"
                >
                  Contact Us
                </a>
                
                {/* Mobile Extra Menu Actions */}
                <div className="pt-4 border-t border-slate-800/40 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (user) {
                        setActiveTab('arohi');
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl shadow-lg border border-indigo-500/20 text-center cursor-pointer active:scale-95 transition-all"
                  >
                    Start Free
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. SPECTACULAR HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#090714] via-[#05030a] to-[#020205] border border-slate-800/50 rounded-[3rem] p-8 md:p-14 shadow-2xl">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 animate-pulse pointer-events-none"></div>
        <div className="absolute left-1/4 top-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left w-full">
            
            {/* Top Badge and Tour Button Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-[#091515] border border-teal-500/30 text-teal-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
                <span>#1 AI ASSISTANT FOR LEARNING, RESEARCH & GROWTH ★</span>
              </div>
              {isTourEnabled && (
                <button
                  onClick={() => setIsWalkthroughOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400/60 text-amber-200 hover:text-white px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide shadow-lg cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <span>🗺️ Take Site Tour</span>
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full">Tour</span>
                </button>
              )}
            </div>

            {/* Giant Immersive Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.1] text-white">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 font-black">Arohi AI</span>
            </h1>

            <h2 className="text-lg sm:text-2xl font-black text-slate-200 leading-tight max-w-xl">
              The World's Personal AI for <br />
              Learning, Research, Careers & Business.
            </h2>

            {/* Distinct Colored Slogans */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm sm:text-base font-black tracking-wider uppercase">
              <span className="text-cyan-400">Learn.</span>
              <span className="text-pink-400">Think.</span>
              <span className="text-violet-400">Research.</span>
              <span className="text-emerald-400">Build.</span>
              <span className="text-amber-400">Grow.</span>
            </div>

            {/* Detailed Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
              Whether you're a student, scientist, entrepreneur, teacher, engineer, or professional, Arohi helps you solve problems, gain knowledge, make decisions, and achieve more—all through one intelligent conversation.
            </p>

            {/* Interactive CTA buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleQuickChatPrompt("Arohi, give me a custom career roadmap!")}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-[0_8px_30px_rgba(124,58,237,0.35)] border border-indigo-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              
              <a
                href="#pricing-section"
                className="inline-flex items-center gap-2 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider py-4 px-6 rounded-2xl transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <span>Get Arohi Premium – ₹399/month</span>
                <span className="text-base">👑</span>
              </a>
            </div>

            {/* Trust badges below buttons */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-slate-900 text-[11px] text-slate-400 font-bold">
              <div className="flex items-center gap-1.5">
                <span className="text-indigo-400 text-xs">👥</span>
                <span>Trusted by 10,000+ Users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-teal-400 text-xs">🛡️</span>
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-purple-400 text-xs">🕒</span>
                <span>Available 24x7</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Hologram Pedestal and Absolute Badges matching screenshot */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] lg:min-h-[440px] select-none">
            
            {/* Ambient Base pedestal illustration */}
            <div className="absolute bottom-4 w-48 h-4 bg-indigo-500/10 rounded-full blur-xl animate-pulse"></div>
            
            {/* Glowing vertical platform pedestal loops */}
            <div className="absolute w-56 h-56 rounded-full border border-indigo-500/10 scale-y-[0.3] translate-y-24 animate-spin" style={{ animationDuration: '10s' }}></div>
            <div className="absolute w-44 h-44 rounded-full border border-purple-500/15 scale-y-[0.35] translate-y-24 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}></div>
            <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 scale-y-[0.3] translate-y-24 shadow-[0_0_30px_rgba(99,102,241,0.2)] border border-indigo-500/30"></div>

            {/* Pedestal Center core sphere */}
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-950 border border-indigo-500/25 flex items-center justify-center relative">
                <ArohiAvatar className="w-full h-full scale-[1.1]" />
                <div className="absolute inset-0 bg-indigo-500/5 mix-blend-color-dodge"></div>
              </div>
              {/* Spinning particle dots */}
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin" style={{ animationDuration: '12s' }}></div>
            </div>

            {/* Orbiting Badge 1: Learn Anything (Top Middle) */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 group z-20">
              <button 
                onClick={() => handleQuickChatPrompt("I want to learn standard physics concepts.")}
                onMouseEnter={() => setActiveOrbText("Deep tutorial roadmaps for academics and skills.")}
                onMouseLeave={() => setActiveOrbText(null)}
                className="flex items-center gap-2 bg-[#0a0714] border border-purple-500/30 text-[#e9d5ff] px-4 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                <span>Learn Anything</span>
              </button>
            </div>

            {/* Orbiting Badge 2: Research & Innovate (Top Left) */}
            <div className="absolute top-16 left-0 sm:-left-4 group z-20">
              <button 
                onClick={() => handleQuickChatPrompt("Arohi, help me brainstorm a research paper concept.")}
                onMouseEnter={() => setActiveOrbText("Academic literature analysis and hypothesis drafting.")}
                onMouseLeave={() => setActiveOrbText(null)}
                className="flex items-center gap-2 bg-[#050914] border border-cyan-500/30 text-[#e0f2fe] px-4 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Research & Innovate</span>
              </button>
            </div>

            {/* Orbiting Badge 3: Speak 150+ Languages (Top Right) */}
            <div className="absolute top-16 right-0 sm:-right-4 group z-20">
              <button 
                onClick={() => handleQuickChatPrompt("Let's practice conversational Spanish!")}
                onMouseEnter={() => setActiveOrbText("Translating and speaking over 150+ global languages.")}
                onMouseLeave={() => setActiveOrbText(null)}
                className="flex items-center gap-2 bg-[#050c14] border border-blue-500/30 text-[#e0f2fe] px-4 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Speak 150+ Languages</span>
              </button>
            </div>

            {/* Orbiting Badge 4: Grow Your Career (Middle Right) */}
            <div className="absolute top-44 -right-2 sm:-right-6 group z-20">
              <button 
                onClick={() => handleQuickChatPrompt("How do I prepare for a tech interview?")}
                onMouseEnter={() => setActiveOrbText("ATS optimization, professional resumes, and career pathways.")}
                onMouseLeave={() => setActiveOrbText(null)}
                className="flex items-center gap-2 bg-[#0d0714] border border-pink-500/30 text-[#fce7f3] px-4 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)]"
              >
                <Briefcase className="w-3.5 h-3.5 text-pink-400" />
                <span>Grow Your Career</span>
              </button>
            </div>

            {/* Orbiting Badge 5: Get Smart Answers (Bottom Left) */}
            <div className="absolute bottom-16 left-0 group z-20">
              <button 
                onClick={() => handleQuickChatPrompt("Arohi, what are some unique business strategies?")}
                onMouseEnter={() => setActiveOrbText("Problem-solving, text synthesis, and technical calculations.")}
                onMouseLeave={() => setActiveOrbText(null)}
                className="flex items-center gap-2 bg-[#090714] border border-violet-500/30 text-[#fae8ff] px-4 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-violet-400" />
                <span>Get Smart Answers</span>
              </button>
            </div>

            {/* Orbiting Badge 6: Build Your Business (Bottom Right) */}
            <div className="absolute bottom-16 right-0 group z-20">
              <button 
                onClick={() => handleQuickChatPrompt("How do I start a small business or get MSME funding?")}
                onMouseEnter={() => setActiveOrbText("Mudra schemes, state startups, and strategy guides.")}
                onMouseLeave={() => setActiveOrbText(null)}
                className="flex items-center gap-2 bg-[#060a12] border border-emerald-500/30 text-[#d1fae5] px-4 py-1.5 rounded-full text-xs font-black shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Build Your Business</span>
              </button>
            </div>

            {/* Informative Floating tooltip detailing orb functionalities */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[280px] bg-slate-950/80 border border-slate-800 p-2 rounded-xl text-center z-10 min-h-[44px]">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {activeOrbText ? "FEATURE FOCUS" : "✦ CLICK ANY ORB TO TALK TO AROHI ✦"}
              </p>
              <p className="text-[11px] text-slate-200 font-semibold leading-relaxed mt-0.5">
                {activeOrbText || "Activate specialized AI guidelines immediately."}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. "BUILT FOR EVERYONE" HORIZONTAL TRAY */}
      <section className="space-y-6 text-center">
        <div className="space-y-1">
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            WIDE APPLICATION RANGE
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Everyone</span>
          </h3>
        </div>

        {/* 14 Beautiful Interactive Categories Grid matching screenshot text */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {[
            { label: "Students", icon: GraduationCap, color: "text-blue-400", border: "border-blue-500/15 hover:border-blue-500/30" },
            { label: "Teachers", icon: Users, color: "text-indigo-400", border: "border-indigo-500/15 hover:border-indigo-500/30" },
            { label: "Parents", icon: Heart, color: "text-pink-400", border: "border-pink-500/15 hover:border-pink-500/30" },
            { label: "Scientists", icon: Sparkles, color: "text-yellow-400", border: "border-yellow-500/15 hover:border-yellow-500/30" },
            { label: "Researchers", icon: Clock, color: "text-cyan-400", border: "border-cyan-500/15 hover:border-cyan-500/30" },
            { label: "Doctors", icon: Heart, color: "text-rose-400", border: "border-rose-500/15 hover:border-rose-500/30" },
            { label: "Engineers", icon: Zap, color: "text-emerald-400", border: "border-emerald-500/15 hover:border-emerald-500/30" },
            { label: "Entrepreneurs", icon: Compass, color: "text-amber-400", border: "border-amber-500/15 hover:border-amber-500/30" },
            { label: "Job Seekers", icon: Briefcase, color: "text-teal-400", border: "border-teal-500/15 hover:border-teal-500/30" },
            { label: "Professionals", icon: Award, color: "text-violet-400", border: "border-violet-500/15 hover:border-violet-500/30" },
            { label: "Humans", icon: Users, color: "text-pink-400", border: "border-pink-500/15 hover:border-pink-500/30" },
            { label: "Businesses", icon: Landmark, color: "text-sky-400", border: "border-sky-500/15 hover:border-sky-500/30" },
            { label: "Govt. Aspirants", icon: Landmark, color: "text-orange-400", border: "border-orange-500/15 hover:border-orange-500/30" },
            { label: "Universities", icon: GraduationCap, color: "text-fuchsia-400", border: "border-fuchsia-500/15 hover:border-fuchsia-500/30" },
            { label: "Organizations", icon: Users, color: "text-purple-400", border: "border-purple-500/15 hover:border-purple-500/30" },
            { label: "Aliens", icon: Bot, color: "text-lime-400", border: "border-lime-500/15 hover:border-lime-500/30" },
            { label: "The citizens of Mars", icon: Globe, color: "text-red-400", border: "border-red-500/15 hover:border-red-500/30" },
            { label: "The citizens of Jupiter", icon: Sparkles, color: "text-amber-500", border: "border-amber-500/15 hover:border-amber-500/30" },
            { label: "All Govt. Officials", icon: ShieldCheck, color: "text-orange-500", border: "border-orange-500/15 hover:border-orange-500/30" },
            { label: "All Private officials", icon: Briefcase, color: "text-teal-400", border: "border-teal-500/15 hover:border-teal-500/30" }
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleQuickChatPrompt(`As a ${item.label}, how can Arohi assist me?`)}
                className={`bg-slate-950/40 border ${item.border} rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all hover:bg-slate-900/60 active:scale-95 cursor-pointer shadow-sm`}
              >
                <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${item.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold text-slate-300 group-hover:text-white">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE CHAT MOCKUP WINDOW */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950/30 border border-slate-900 rounded-[2.5rem] p-6 sm:p-10 text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Info Column */}
        <div className="lg:col-span-5 space-y-5">
          <span className="text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            INTERACTIVE PREVIEW
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 font-black">Arohi</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Arohi is an AI-powered personal assistant designed to simplify learning, research, career growth, business planning, and everyday problem-solving. Instead of switching between dozens of websites and applications, ask Arohi one question and receive intelligent, personalized guidance.
          </p>
          <button
            onClick={() => {
              setIsChatOpen(true);
              setIsChatMinimized(false);
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer border border-violet-500/25"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>Chat with Arohi Now 💬</span>
          </button>
        </div>

        {/* Real Dynamic Mockup Chat Console Column */}
        <div className="lg:col-span-7 bg-[#0b0816]/95 border border-[#21183c] rounded-3xl p-5 shadow-2xl relative">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#21183c] pb-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full w-9 h-9 border border-indigo-500/30 flex items-center justify-center bg-slate-950 relative overflow-hidden">
                <ArohiAvatar className="w-full h-full scale-105" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-extrabold text-white">Arohi AI</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>
                  <span className="text-[9px] text-[#00e676] font-bold uppercase tracking-wider">Online</span>
                </div>
              </div>
            </div>
            <div className="text-[9px] text-slate-400 font-black tracking-widest uppercase">
              RECRUIT PLATFORM ENGINE
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 min-h-[140px] flex flex-col justify-end text-left">
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="rounded-full w-7 h-7 border border-indigo-500/30 flex items-center justify-center bg-slate-950 shrink-0">
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-xs font-semibold text-slate-200 leading-relaxed shadow-sm">
                Hello! I'm Arohi <span className="text-sm">👋</span> How can I help you today?
              </div>
            </div>
          </div>

          {/* Promptsuggestion chips */}
          <div className="grid grid-cols-2 gap-2 mt-5 text-left">
            {[
              { text: "Explain Quantum Physics", bg: "from-blue-900/10 to-indigo-900/10 border-blue-500/20 text-blue-200" },
              { text: "Write a Resume", bg: "from-purple-900/10 to-indigo-900/10 border-purple-500/20 text-purple-200" },
              { text: "Business Plan Ideas", bg: "from-emerald-900/10 to-teal-900/10 border-emerald-500/20 text-emerald-200" },
              { text: "Learn Spanish", bg: "from-amber-900/10 to-orange-900/10 border-amber-500/20 text-amber-200" }
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickChatPrompt(chip.text)}
                className={`bg-gradient-to-r ${chip.bg} border p-2 rounded-xl text-[11px] font-bold text-left hover:brightness-125 transition-all cursor-pointer active:scale-95`}
              >
                ✦ {chip.text}
              </button>
            ))}
          </div>

          {/* Form mockup */}
          <div className="mt-4 flex items-center gap-2 bg-slate-950 border border-[#21183c] p-2 rounded-2xl">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              disabled
              className="flex-1 bg-transparent text-xs text-slate-300 font-semibold px-2 outline-none cursor-not-allowed opacity-80"
            />
            <button 
              onClick={() => handleQuickChatPrompt("Arohi, guide me.")}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. CORE DETAILED FEATURE CARDS (THE BENTO FEATURE LISTS FROM SCREENSHOT) */}
      <section id="features-grid" className="space-y-8 scroll-mt-20">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            SPECTACULAR FOCUS TIERS
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Five Strategic Focus Areas
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto font-semibold">
            Unlock professional guidance structured beautifully to boost learning, research, growth, and development.
          </p>
        </div>

        {/* Bento features grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: Learn the Real World (Blue theme) */}
          <div className="bg-gradient-to-br from-[#0c0f20] via-[#04050d] to-[#020306] border-2 border-blue-500/20 rounded-[2.5rem] p-7 flex flex-col justify-between relative overflow-hidden shadow-xl hover:border-blue-500/40 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-blue-600/15 border border-blue-500/30 text-blue-400 p-2.5 rounded-2xl shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-full font-extrabold uppercase">
                  Education & Science
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Learn the Real World</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  Learn beyond memorization and master real understanding.
                </p>
              </div>

              {/* Bullet points exact */}
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-slate-900/80">
                {[
                  "Mathematics", "Physics", "Chemistry", "Biology", 
                  "Computer Science", "Artificial Intelligence", "Robotics", "Astronomy", 
                  "Engineering", "Economics", "Finance", "History", 
                  "Geography", "Environmental Science"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                    <span className="text-blue-400 text-xs shrink-0">●</span>
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-900/80 mt-6 text-[10px] text-slate-400 font-bold text-center">
              From basics to advanced levels with clear explanations.
            </div>
          </div>

          {/* Card 2: Learn 150+ Languages (Cyan/Teal theme) */}
          <div className="bg-gradient-to-br from-[#0c1c1a] via-[#040c0b] to-[#020404] border-2 border-teal-500/20 rounded-[2.5rem] p-7 flex flex-col justify-between relative overflow-hidden shadow-xl hover:border-teal-500/40 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-teal-600/15 border border-teal-500/30 text-teal-400 p-2.5 rounded-2xl shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-full font-extrabold uppercase">
                  Languages
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Learn 150+ Languages</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  Communicate confidently in over 150 languages.
                </p>
              </div>

              {/* Bullet points exact */}
              <ul className="space-y-2 pt-2 border-t border-slate-900/80">
                {[
                  "Speak naturally", "Improve pronunciation", "Build vocabulary", 
                  "Practice conversations", "Learn grammar", "Read and write fluently", 
                  "Translate naturally"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                    <span className="text-teal-400 text-xs shrink-0">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-900/80 mt-6 text-[10px] text-slate-400 font-bold text-center">
              Perfect for students, travelers, professionals, and language enthusiasts.
            </div>
          </div>

          {/* Card 3: Research & Innovation (Purple theme) */}
          <div className="bg-gradient-to-br from-[#140b20] via-[#07040d] to-[#030206] border-2 border-purple-500/20 rounded-[2.5rem] p-7 flex flex-col justify-between relative overflow-hidden shadow-xl hover:border-purple-500/40 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-purple-600/15 border border-purple-500/30 text-purple-400 p-2.5 rounded-2xl shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-1 rounded-full font-extrabold uppercase">
                  Research
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Research & Innovation</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  Your Personal AI Research Analyst.
                </p>
              </div>

              {/* Bullet points exact */}
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-slate-900/80">
                {[
                  "Literature review assistance", "Research paper summaries", 
                  "Scientific concept explanations", "Data interpretation", 
                  "Hypothesis brainstorming", "Technical writing", 
                  "Academic report drafting", "Patent & innovation support", 
                  "Market research", "Business intelligence", 
                  "Trend analysis", "Strategic insights"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                    <span className="text-purple-400 text-xs shrink-0">●</span>
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-900/80 mt-6 text-[10px] text-slate-400 font-bold text-center">
              Accelerate your research and turn ideas into impact.
            </div>
          </div>

          {/* Card 4: Career Growth (Bright Blue theme) */}
          <div className="bg-gradient-to-br from-[#0c1228] via-[#04060d] to-[#020306] border-2 border-sky-500/20 rounded-[2.5rem] p-7 flex flex-col justify-between relative overflow-hidden shadow-xl hover:border-sky-500/40 transition-all duration-300 md:col-span-1 lg:col-span-1 lg:translate-x-[50%]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-sky-600/15 border border-sky-500/30 text-sky-400 p-2.5 rounded-2xl shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2.5 py-1 rounded-full font-extrabold uppercase">
                  Careers
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Career Growth</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  Advance your professional journey with AI guidance.
                </p>
              </div>

              {/* Bullet points exact */}
              <ul className="space-y-2 pt-2 border-t border-slate-900/80">
                {[
                  "Resume Builder", "ATS Resume Optimization", "Interview Preparation", 
                  "Career Planning", "Skill Development", "LinkedIn Profile Guidance", 
                  "Cover Letter Creation", "Job Search Assistance"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
                    <span className="text-sky-400 text-xs shrink-0">●</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-900/80 mt-6 text-[10px] text-slate-400 font-bold text-center">
              Get job-ready and grow your career faster.
            </div>
          </div>

          {/* Card 5: Business & Entrepreneurship (Sunset Orange/Rose theme) */}
          <div className="bg-gradient-to-br from-[#180916] via-[#080307] to-[#040104] border-2 border-rose-500/20 rounded-[2.5rem] p-7 flex flex-col justify-between relative overflow-hidden shadow-xl hover:border-rose-500/40 transition-all duration-300 md:col-span-1 lg:col-span-1 lg:translate-x-[50%]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-rose-600/15 border border-rose-500/30 text-rose-400 p-2.5 rounded-2xl shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full font-extrabold uppercase">
                  Business
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">Business & Entrepreneurship</h4>
                <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                  Turn ideas into action with AI-powered support.
                </p>
              </div>

              {/* Bullet points exact */}
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 pt-2 border-t border-slate-900/80">
                {[
                  "Business Planning", "Startup Strategy", "Market Research", 
                  "Sales Guidance", "Marketing Strategy", "Financial Planning", 
                  "MSME Guidance", "Govt. Schemes Info", "Productivity Assistance", 
                  "Decision Support"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
                    <span className="text-rose-400 text-xs shrink-0">●</span>
                    <span className="truncate">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-900/80 mt-6 text-[10px] text-slate-400 font-bold text-center">
              Build, manage and grow your business with confidence.
            </div>
          </div>

        </div>
      </section>

      {/* 6. "WHY CHOOSE AROHI?" ROW / BENTO GRID OF 12 ITEMS */}
      <section className="space-y-6 text-center">
        <div className="space-y-1">
          <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            STABILITY & TRUST
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Arohi?</span>
          </h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">One AI for Every Need</p>
        </div>

        {/* 12 Grid Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-2 text-left">
          {[
            { title: "Personalized AI Conversations", desc: "Adaptive memory structure", icon: MessageSquare, color: "text-blue-400" },
            { title: "Multilingual Support", desc: "Over 150+ global translation tools", icon: Globe, color: "text-cyan-400" },
            { title: "Voice Interaction", desc: "Live high-fidelity speech input", icon: Mic, color: "text-purple-400" },
            { title: "Context-Aware Assistance", desc: "Retains deep chat history", icon: Sparkles, color: "text-pink-400" },
            { title: "Intelligent Search", desc: "Real-time query synthesis", icon: Clock, color: "text-sky-400" },
            { title: "Career Guidance", desc: "ATS checker and interview logs", icon: Compass, color: "text-amber-400" },
            { title: "Research Support", desc: "Literature & data analysis", icon: Sparkles, color: "text-indigo-400" },
            { title: "Business Consultation", desc: "Mudra details & subsidy reports", icon: Landmark, color: "text-rose-400" },
            { title: "Learning Companion", desc: "Step-by-step academic roadmaps", icon: GraduationCap, color: "text-teal-400" },
            { title: "Professional Productivity", desc: "Rapid summary drafts & notes", icon: Zap, color: "text-emerald-400" },
            { title: "Secure & Reliable", desc: "100% data privacy verified", icon: Shield, color: "text-orange-400" },
            { title: "Available 24x7", desc: "Uninterrupted automated support", icon: Clock, color: "text-violet-400" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-[#07060f]/60 border border-slate-900 p-4 rounded-2xl flex flex-col justify-between min-h-[120px] shadow-sm hover:border-slate-800 transition-colors"
              >
                <div className={`p-2 bg-slate-950 border border-slate-900 rounded-xl w-fit ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 mt-3">
                  <h5 className="text-xs font-black text-white leading-tight">{item.title}</h5>
                  <p className="text-[10px] text-slate-400 font-bold leading-none">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* 7. PREMIUM PRICING PLANS */}
      <section className="space-y-8 scroll-mt-20">
        <div className="text-center space-y-1">
          <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            TRANSPARENT PRICING
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Premium Plan</span>
          </h3>
          <p className="text-xs text-slate-400 font-bold max-w-lg mx-auto">
            Flexible options built to match your learning pace, professional guidance, state filing needs, and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PRICING_TIERS.map((tier, idx) => {
            const isPopular = tier.price === 699;
            const features = [
              tier.callHoursText,
              `${tier.tokenUsageText} Limit`,
              ...tier.limits.path1.highlights.slice(0, 2),
              ...tier.limits.path3.highlights.slice(0, 1)
            ];

            return (
              <div
                key={idx}
                className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 relative flex flex-col justify-between ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#1b103c] to-[#0b061c] border-purple-500 shadow-[0_0_30px_rgba(124,58,237,0.25)] scale-[1.03]'
                    : 'bg-[#090616]/75 border-slate-900 hover:border-slate-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md border border-purple-400/20">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-purple-400 font-extrabold uppercase tracking-wider block">
                      {tier.name}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">₹{tier.price}</span>
                      <span className="text-[10px] text-slate-400 font-bold">/mo</span>
                    </div>
                  </div>

                  <ul className="space-y-2 border-t border-slate-900/80 pt-4 text-[10.5px] text-slate-300 font-semibold leading-relaxed">
                    {features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900/80">
                  <button
                    onClick={() => {
                      if (!user) {
                        setIsAuthModalOpen(true);
                      } else {
                        setPendingSubscriptionDetail({
                          tierName: tier.name,
                          price: tier.price,
                          margin: tier.margin
                        });
                        setCheckoutPath({
                          id: 'path1',
                          title: `${tier.name} (Arohi AI Pro)`,
                          price: `₹${tier.price}/Month`
                        });
                      }
                    }}
                    className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isPopular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                        : 'bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border border-purple-500/20'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                    Choose Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>



      {/* 8. INTERACTIVE FAQ ACCORDIONS */}
      <section className="space-y-6 max-w-3xl mx-auto scroll-mt-20">
        <div className="text-center space-y-1">
          <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">
            KNOWLEDGE BASE
          </span>
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Questions</span>
          </h3>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5 pt-2 text-left">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index} 
                className="bg-[#06040a]/80 border border-slate-900 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full py-4.5 px-6 flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-slate-200 hover:text-white transition-colors cursor-pointer bg-slate-950/30"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-indigo-400 shrink-0 transform rotate-180 transition-transform" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-6 border-t border-slate-900 text-[11px] sm:text-xs text-slate-300 font-medium leading-relaxed bg-[#0b0813]/20 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. ABOUT RECRUIT BLOCK & STATS */}
      <section id="about-section" className="bg-[#050309] border border-slate-900 rounded-[2.5rem] p-6 sm:p-10 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* About description */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-2xl font-black text-white">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Recruit</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Recruit.org.in is the company behind Arohi AI. Dedicated to making professional-grade AI assistance accessible to everyone through one intelligent assistant that empowers learning, research, careers, business, and innovation.
            </p>
          </div>

          {/* Metric cards right */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {[
              { val: "10,000+", label: "Happy Users", color: "text-blue-400 shadow-blue-500/5" },
              { val: "150+", label: "Languages Supported", color: "text-teal-400 shadow-teal-500/5" },
              { val: "24/7", label: "Always Available", color: "text-purple-400 shadow-purple-500/5" },
              { val: "∞", label: "Infinite Possibilities", color: "text-pink-400 shadow-pink-500/5" }
            ].map((metric, idx) => (
              <div 
                key={idx}
                className={`bg-slate-950 border border-slate-900 p-4.5 rounded-2xl flex flex-col justify-center items-center text-center shadow-lg ${metric.color}`}
              >
                <span className="text-xl sm:text-2xl font-black tracking-tight">{metric.val}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{metric.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. COMPREHENSIVE SITE FOOTER */}
      <footer id="contact-section" className="bg-[#030107] border-t border-slate-900/80 pt-10 pb-6 scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          
          {/* Column 1 Logo */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </span>
                <span className="text-sm font-black tracking-tight text-white flex items-center">
                  AROHI <span className="text-indigo-400 ml-1 font-extrabold text-xs px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded-md">AI</span>
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide ml-8 mt-0.5">by Recruit</span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              One AI, Infinite Possibilities. Bridging standard educational paths and professional guidelines securely.
            </p>
          </div>

          {/* Column 2 Quick Links */}
          <div className="md:col-span-2.5 space-y-3.5 md:col-start-6">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quick Links</h5>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li><a href="#home-landing-root" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#features-grid" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing-section" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#about-section" className="hover:text-white transition-colors">About Arohi</a></li>
            </ul>
          </div>

          {/* Column 3 Legal */}
          <div className="md:col-span-2.5 space-y-3.5">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Legal</h5>
            <ul className="space-y-2 text-xs font-semibold text-slate-300">
              <li><button onClick={() => setActiveTab('privacy')} className="hover:text-white transition-colors text-left cursor-pointer">Privacy Policy</button></li>
              <li><button onClick={() => setActiveTab('terms')} className="hover:text-white transition-colors text-left cursor-pointer">Terms & Conditions</button></li>
              <li><button onClick={() => setActiveTab('refunds')} className="hover:text-white transition-colors text-left cursor-pointer">Refund & Cancellation Policy</button></li>
            </ul>
          </div>

          {/* Column 4 Stay Connected Newsletter */}
          <div className="md:col-span-3 space-y-3.5">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Stay Connected</h5>
            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Join our community for updates and AI insights.
            </p>
            
            {/* Form */}
            <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 bg-slate-950 border border-slate-900 p-1.5 rounded-2xl">
              <input 
                type="email" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email" 
                className="flex-1 bg-transparent text-xs text-slate-300 font-semibold px-2.5 py-1 outline-none"
              />
              <button 
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer transition-all active:scale-95 flex items-center justify-center shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {newsletterSubmitted && (
              <p className="text-[10px] text-emerald-400 font-bold animate-pulse">
                ✓ Registered successfully for newsletters!
              </p>
            )}
          </div>

        </div>

        {/* Minimal Footer Signature Block */}
        <div className="pt-8 mt-8 border-t border-slate-950 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest space-y-2">
          <p>© 2026 RECRUIT.ORG.IN • ALL RIGHTS RESERVED</p>
          <p className="text-slate-400 font-semibold text-[9.5px]">
            DEVELOPED AND MAINTENANCE BY <span className="text-indigo-400 font-extrabold">BRAGA TECHNOLOGIES PRIVATE LIMITED</span> IN ASSOCIATION WITH <span className="text-indigo-400 font-extrabold">ODITREE SERVICES</span>
          </p>
        </div>
      </footer>

    </div>
  );
}
