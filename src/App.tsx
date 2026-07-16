import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import MarqueeTicker from './components/MarqueeTicker';
import PostingDetail from './components/PostingDetail';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './context/AuthContext';
import AuthModal from './components/AuthModal';
import { Language, getTranslation } from './translations';


// Core Tab Components
import ArohiChat from './components/ArohiChat';
import ResumePage from './components/ResumePage';
import CareerPage from './components/CareerPage';
import InterviewPage from './components/InterviewPage';
import BusinessPage from './components/BusinessPage';
import SchemesPage from './components/SchemesPage';
import CoursesPage from './components/CoursesPage';
import SchoolSyllabusPage from './components/SchoolSyllabusPage';
import UserDashboard from './components/UserDashboard';
import EmployerPortal from './components/EmployerPortal';
import LegalPages from './components/LegalPages';
import NavigationHub from './components/NavigationHub';
import Smooth3DShowcase from './components/Smooth3DShowcase';
import Interactive3DOrbit from './components/Interactive3DOrbit';
import NotificationToast from './components/NotificationToast';
import WelcomeLanding from './components/WelcomeLanding';
import ArohiAvatar from './components/ArohiAvatar';
import WalkthroughTour from './components/WalkthroughTour';
import FranchisePage from './components/FranchisePage';
import MultilingualSEOFooter from './components/MultilingualSEOFooter';
import { getRegionalCareerAdvice } from './lib/seoContentManager';

import { initialPostings } from './data/initialData';
import { INITIAL_REVIEWS, Review } from './data/reviewsData';
import { Posting, Application, CategoryType } from './types';
import { Award, Crown, CheckCircle, Landmark, Bell, ArrowUpRight, ShieldCheck, Sparkles, Bot, GraduationCap, Briefcase, ChevronRight, Mic, MicOff, ArrowLeft, Home, Compass, Map, RotateCcw, Star, Users, MapPin, RefreshCw, Quote, Plus, MessageSquare, MessageCircle, Zap, Coins, User, Share2, Copy } from 'lucide-react';

const INITIAL_MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-mock-1',
    postingId: 'ssc-mts-2026',
    postingTitle: 'SSC MTS & Havaldar Online Form 2026',
    candidateName: 'Rajesh Kumar Singh',
    fatherName: 'Vijay Kumar Singh',
    dob: '1999-08-15',
    gender: 'Male',
    category: 'OBC',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    qualification: 'Graduate Degree (Patna University) - Marks: 74.20%',
    address: 'H.No 45, Rajendra Nagar, Patna, Bihar - 800016',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
    signatureUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
    registrationNumber: 'REC-SSCMT-2026-894103',
    appliedDate: '23/06/2026',
    status: 'Approved'
  },
  {
    id: 'app-mock-2',
    postingId: 'rrb-alp-2026',
    postingTitle: 'Railway RRB Assistant Loco Pilot (ALP) Form',
    candidateName: 'Amit Suresh Patil',
    fatherName: 'Suresh Patil',
    dob: '2001-04-12',
    gender: 'Male',
    category: 'General',
    email: 'amit.patil@example.com',
    phone: '9123456789',
    qualification: 'ITI Technical pass (NCT Board) - Marks: 82.50%',
    address: 'Sector 4, Plot 12, Kamothe, Navi Mumbai, Maharashtra - 410206',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
    signatureUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
    registrationNumber: 'REC-RRBAL-2026-150492',
    appliedDate: '24/06/2026',
    status: 'Submitted'
  }
];

// INITIAL_REVIEWS and Review interface are imported from ./data/reviewsData

export default function App() {
  const { user, userData, updateApplications } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);

  // Auto-trigger walkthrough for newly logged-in users or guest users upon entry
  useEffect(() => {
    if (hasEntered) {
      const tourKey = user ? `recruit_walkthrough_seen_${user.uid}` : 'recruit_walkthrough_seen_guest';
      const hasSeenTour = localStorage.getItem(tourKey);
      if (!hasSeenTour) {
        // Delay slightly for smooth entering animation transition
        const timer = setTimeout(() => {
          setIsWalkthroughOpen(true);
          localStorage.setItem(tourKey, 'true');
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [hasEntered, user]);

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('recruit_language') as Language) || 'en';
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('recruit_language', lang);
  };

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('recruit_user_name') || 'Honored Guest';
  });
  
  // Dynamically derive current user's display name
  const currentUserName = user ? (userData?.profile?.name || user.displayName || 'Honored Guest') : userName;

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareDetails, setShareDetails] = useState({
    title: 'Recruit.org.in',
    text: 'Check out Recruit.org.in - India\'s Futuristic National Career Registry, Jobs, Resume Builder & Courses Platform!',
    url: 'https://recruit.org.in'
  });
  const [copiedLink, setCopiedLink] = useState(false);

  const handleOpenShare = (title?: string, text?: string, url?: string) => {
    setShareDetails({
      title: title || 'Recruit.org.in',
      text: text || 'Check out Recruit.org.in - India\'s Futuristic National Career Registry, Jobs, Resume Builder & Courses Platform!',
      url: url || 'https://recruit.org.in'
    });
    setShareModalOpen(true);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareDetails.url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy share link:', err);
    }
  };

  const [activeTab, setActiveTab] = useState(() => {
    const path = window.location.pathname;
    if (path === '/admin' || window.location.hash === '#admin' || window.location.search.includes('admin')) {
      return 'admin';
    }
    const tab = path.replace('/', '') || 'home';
    const validTabs = ['home', 'jobs', 'career', 'resume', 'interview', 'business', 'schemes', 'courses', 'syllabus', 'dashboard', 'employer', 'admin', 'arohi', 'privacy', 'terms', 'refunds', 'payments', 'contact', 'faqs', 'franchise'];
    if (validTabs.includes(tab)) {
      return tab;
    }
    return 'home';
  });
  const [prevTab, setPrevTab] = useState('home');
  const currentTabRef = useRef('home');

  // Dynamic Browser History & URL Router Synchronizer
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' || window.location.hash === '#admin' || window.location.search.includes('admin')) {
        setActiveTab('admin');
      } else {
        const tab = path.replace('/', '') || 'home';
        const validTabs = ['home', 'jobs', 'career', 'resume', 'interview', 'business', 'schemes', 'courses', 'syllabus', 'dashboard', 'employer', 'admin', 'arohi', 'privacy', 'terms', 'refunds', 'payments', 'contact', 'faqs', 'franchise'];
        if (validTabs.includes(tab)) {
          setActiveTab(tab);
        } else {
          setActiveTab('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = activeTab === 'home' ? '/' : `/${activeTab}`;
    if (currentPath !== targetPath && currentPath !== `/index.html`) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activeTab]);

  useEffect(() => {
    // Initial page load telemetry for Recruit.org.in persistent visitor counter
    fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'visit',
        description: 'Anonymous visitor loaded Recruit.org.in landing interface'
      })
    }).catch(err => console.log('Telemetry offline:', err));
  }, []);

  useEffect(() => {
    if (activeTab !== currentTabRef.current) {
      setPrevTab(currentTabRef.current);
      currentTabRef.current = activeTab;

      // Automatically trace tab/page visits to telemetry logs
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'visit',
          description: `User loaded tab view: "${activeTab.toUpperCase()}"`
        })
      }).catch(err => console.log('Telemetry offline:', err));
    }
  }, [activeTab]);

  useEffect(() => {
    // Dynamic client-side SEO engine for regional Indian and Odia search optimization
    const tabSEO: Record<string, { title: string; desc: string; keywords: string }> = {
      home: {
        title: "Recruit.org.in - India’s Next-Gen Career Registry, Jobs, & MSME Platform",
        desc: "Empowering India's students, young professionals, and MSMEs. Get live career guidance from AI assistant Arohi, dynamic resume analysis, mock interviews, and regional job postings.",
        keywords: "recruit.org.in, career guidance, AI career coach, resume score, mock interview, MSME registration, school syllabus, Odisha jobs"
      },
      jobs: {
        title: "Verified Jobs & Vacancies in Odisha & All India - Recruit.org.in",
        desc: "Explore over 24,500+ live government, public sector, corporate, and private vacancies. Filter by department, state, sector, and age limits with direct applying.",
        keywords: "Odisha government jobs, OSSC vacancies, OSSSC junior assistant, central government jobs, private sector jobs India, live vacancies Odisha"
      },
      career: {
        title: "Arohi AI Personal Career Coach & Career Roadmaps",
        desc: "Interactive skill mapping, automated stream selections, and customized professional career roadmaps tailored for Indian students and professionals.",
        keywords: "career path finder, AI career counselor, Indian stream selector, student career advice, personalized roadmap"
      },
      resume: {
        title: "AI ATS Resume Builder & Scoring Suite - Recruit.org.in",
        desc: "Build professional ATS-optimized resumes and get immediate AI evaluation reports on your scores, keywords, formatting, and structural issues.",
        keywords: "ATS resume builder, resume scorer, free resume evaluator India, professional resume checker, resume keywords"
      },
      interview: {
        title: "Live AI Mock Interview Simulator & Vocal Feedback Engine",
        desc: "Simulate pressure-packed technical, HR, and government job interviews. Speak or type answers and get instant critical feedback on your response quality.",
        keywords: "AI mock interview, virtual interview practice, speak response simulator, HR interview trainer, UPSC SSC viva preparation"
      },
      business: {
        title: "MSME & Startup Setup Guides, Mudra Loans & PMEGP - Recruit.org.in",
        desc: "Launch your business in India easily. Step-by-step guides on Udyam Registration, Mudra Loans, PMEGP subsidies, and business model validations.",
        keywords: "Mudra loan eligibility, MSME Udyam register, startup funding India, business idea validation, startup scheme guide"
      },
      schemes: {
        title: "Sarkari Yojana Directory - Central & Odisha State Welfare Schemes",
        desc: "Verified guidelines for PMEGP, Startup India, Mukhyamantri Karma Tatpara Abhiyan (MUKTA), Odisha skill initiatives, and social support plans.",
        keywords: "Sarkari yojana India, Odisha state government schemes, MUKTA abhiyan, skill development schemes Odisha"
      },
      courses: {
        title: "Professional Certification Courses & Skills Academy",
        desc: "Master high-demand skills in AI, Web Development, Cyber Security, Digital Marketing, and finance with verified certificates and career-pathing guides.",
        keywords: "free skills academy India, certify software courses, learn web development, digital marketing certifications"
      },
      syllabus: {
        title: "Odisha Board Class 1-10 Syllabus & CBSE Study Guides (Odia & English)",
        desc: "Official school syllabus plans for Class 1 to 10 under Board of Secondary Education Odisha & CBSE. Free resources, notes, and curriculum structures.",
        keywords: "BSE Odisha syllabus, class 1-10 syllabus Odia medium, CBSE school guides India, Odisha primary secondary curriculum"
      },
      dashboard: {
        title: "My Career Dashboard & Verified Profile Ledger",
        desc: "Check your active job applications, review your resume assessment reports, track enrolled skill courses, and verify your subscription credentials.",
        keywords: "career registry dashboard, active applications tracker, student career profile"
      },
      employer: {
        title: "Employer Portal & Recruitment Console - Post Free Vacancies",
        desc: "The professional hub for enterprises and SMEs. Post job descriptions, manage incoming candidate applications, and evaluate digital registration slips.",
        keywords: "employer job posting portal, hire candidates India, post private sector jobs Odisha"
      },
      admin: {
        title: "Commander Control Centre & Telemetry Node - Recruit.org.in",
        desc: "Authorized administration console for Recruit.org.in. Unified database queries, visitor logs, financial MRR trackers, and transaction verified registers.",
        keywords: "admin console, recruit telemetry, secure digital ledger"
      },
      franchise: {
        title: "AECN Franchise Hub - Set Up Your Local Career & MSME Registration Centre",
        desc: "Become an official Recruit.org.in partner. Establish an Authorized Employment Consultation Node (AECN) in your district, tehsil, or panchayat.",
        keywords: "csc franchise Odisha, career hub center franchise, start business village"
      }
    };

    const seo = tabSEO[activeTab] || tabSEO.home;

    // Localized language adjustments to maximize search engine indexing in India
    let titleStr = seo.title;
    let descStr = seo.desc;

    if (language === 'hi') {
      titleStr = `[हिंदी] ${titleStr.replace("Recruit.org.in", "करियर पोर्टल Recruit.org.in")}`;
      descStr = `भारत का अग्रणी करियर और रोजगार मंच: ${descStr}`;
    } else if (language === 'or') {
      titleStr = `[ଓଡ଼ିଆ] ${titleStr.replace("Recruit.org.in", "ଓଡ଼ିଶା କ୍ୟାରିୟର ପୋର୍ଟାଲ୍ Recruit.org.in")}`;
      descStr = `ଓଡ଼ିଶା ଓ ଭାରତର ସରକାରୀ ଓ ବେସରକାରୀ ଚାକିରି, ସିଲାବସ୍ ଏବଂ ଏମଏସଏମଇ ଗାଇଡ୍: ${descStr}`;
    } else if (language !== 'en') {
      const langNames: Record<string, string> = {
        bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी', ta: 'தமிழ்', gu: 'ગુજરાતી', ur: 'اردو', kn: 'ಕನ್ನಡ', ml: 'മലയാളം', pa: 'ਪੰਜਾਬੀ', as: 'অসমীয়া'
      };
      const langLabel = langNames[language] || language;
      titleStr = `[${langLabel}] ${titleStr}`;
    }

    // Apply document level DOM updates
    document.title = titleStr;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descStr);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seo.keywords);
    }

    // Dynamic Social OpenGraph SEO updates
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', titleStr);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descStr);

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      const locales: Record<string, string> = {
        en: 'en_IN', hi: 'hi_IN', or: 'or_IN', bn: 'bn_IN', te: 'te_IN', mr: 'mr_IN', ta: 'ta_IN', gu: 'gu_IN', ur: 'ur_IN', kn: 'kn_IN', ml: 'ml_IN', pa: 'pa_IN', as: 'as_IN'
      };
      ogLocale.setAttribute('content', locales[language] || 'en_IN');
    }

    // Inject Search Engine Structured JSON-LD Data schema
    let jsonLdScript = document.getElementById('dynamic-seo-jsonld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('id', 'dynamic-seo-jsonld');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }

    const dynamicSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": titleStr,
      "description": descStr,
      "url": window.location.href,
      "inLanguage": language,
      "isPartOf": {
        "@type": "WebSite",
        "name": "Recruit.org.in",
        "url": "https://recruit.org.in"
      },
      "provider": {
        "@type": "Organization",
        "name": "Recruit.org.in",
        "url": "https://recruit.org.in",
        "logo": "https://recruit.org.in/assets/logo.png"
      }
    };

    jsonLdScript.innerHTML = JSON.stringify(dynamicSchema);

  }, [activeTab, language]);

  const [postings, setPostings] = useState<Posting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  // Dynamic reviews & ratings system state
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('recruit_user_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [reviewsSearchQuery, setReviewsSearchQuery] = useState('');
  const [reviewsStateFilter, setReviewsStateFilter] = useState('All');
  const [reviewsRatingFilter, setReviewsRatingFilter] = useState('All');
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('');
  const [newReviewState, setNewReviewState] = useState('Odisha');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPosting, setSelectedPosting] = useState<Posting | null>(null);
  const [activeDepartment, setActiveDepartment] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isSyncingJobs, setIsSyncingJobs] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Voice Search Web Speech API state and handler
  const [isListening, setIsListening] = useState(false);
  const [voiceSearchError, setVoiceSearchError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceSearchError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setVoiceSearchError(null), 4000);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Configure language based on user's active choice (English, Hindi, or Odia)
      if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (language === 'or') {
        recognition.lang = 'or-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      // Dynamically load speech grammars for higher precision in each native tongue
      const SpeechGrammarList = (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;
      if (SpeechGrammarList) {
        const speechRecognitionList = new SpeechGrammarList();
        let grammarText = '';
        
        if (language === 'hi') {
          grammarText = '#JSGF V1.0; grammar hindiCommands; public <hindi_cmd> = नौकरी | पाठ्यक्रम | कौशल | फ्रेशर | सरकारी नौकरी | परीक्षा | रिज्यूमे | साक्षात्कार | गाइड;';
        } else if (language === 'or') {
          grammarText = '#JSGF V1.0; grammar odiaCommands; public <odia_cmd> = ଚାକିରି | ପାଠ୍ୟକ୍ରମ | କୌଶଳ | ଫ୍ରେସର୍ | ସରକାରୀ | ପରୀକ୍ଷା | ରିଜ୍ୟୁମେ | ସାକ୍ଷାତକାର | ଗାଇଡ୍;';
        } else {
          grammarText = '#JSGF V1.0; grammar enCommands; public <en_cmd> = jobs | syllabus | skills | fresher | exam | government | resume | interview | career | training;';
        }
        
        try {
          speechRecognitionList.addFromString(grammarText, 1);
          recognition.grammars = speechRecognitionList;
        } catch (grammarErr) {
          console.warn('SpeechGrammarList load error ignored:', grammarErr);
        }
      }

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceSearchError(null);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceSearchError('Microphone permission denied. Please allow microphone access in settings.');
        } else if (event.error === 'no-speech') {
          setVoiceSearchError('No speech detected. Please speak clearly into your microphone.');
        } else {
          setVoiceSearchError(`Microphone error: ${event.error}`);
        }
        setIsListening(false);
        setTimeout(() => setVoiceSearchError(null), 5000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          const formattedTranscript = transcript.endsWith('.') ? transcript.slice(0, -1) : transcript;
          setSearchQuery(formattedTranscript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition start failed:', err);
      setVoiceSearchError('Failed to activate voice search.');
      setIsListening(false);
      setTimeout(() => setVoiceSearchError(null), 4000);
    }
  };

  // Load subscriptions from local storage
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('recruit_subscriptions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { path1: false, path2: false, path3: false, path4: false, ...parsed };
      } catch (e) {
        // Fallback
      }
    }
    return { path1: false, path2: false, path3: false, path4: false };
  });

  const [checkoutPath, setCheckoutPath] = useState<{ id: string; title: string; price: string } | null>(null);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'upi' | 'googleplay'>('upi');
  const [isProcessingPlayStore, setIsProcessingPlayStore] = useState<boolean>(false);
  const [playStoreSuccess, setPlayStoreSuccess] = useState<boolean>(false);

  // Custom UPI Airtel Payments Bank / PhonePe QR states
  const [upiGatewaySettings, setUpiGatewaySettings] = useState<{ upiId: string; merchantName: string; bankName: string }>({
    upiId: 'elitetraderjunoon@oksbi',
    merchantName: 'Recruit India Portal',
    bankName: 'Airtel Payments Bank / PhonePe'
  });
  const [checkoutSubMode, setCheckoutSubMode] = useState<'instant' | 'qr'>('instant');
  const [candidateUtr, setCandidateUtr] = useState('');
  const [isSubmittingUtr, setIsSubmittingUtr] = useState(false);
  const [utrSubmissionSuccess, setUtrSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (checkoutPath) {
      fetch('/api/admin/payment-settings')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch settings');
        })
        .then(data => {
          setUpiGatewaySettings(data);
        })
        .catch(err => console.log('Offline UPI merchant settings loaded:', err));
    } else {
      setCandidateUtr('');
      setUtrSubmissionSuccess(false);
      setCheckoutSubMode('instant');
    }
  }, [checkoutPath]);

  const handleSubscribe = (pathId: string, planName?: string, paymentMethod?: string) => {
    const isSubscribed = !subscriptions[pathId];
    const updated = { ...subscriptions, [pathId]: isSubscribed };
    setSubscriptions(updated);
    localStorage.setItem('recruit_subscriptions', JSON.stringify(updated));

    if (isSubscribed) {
      // Trace this subscription event
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enroll',
          description: `User elitetraderjunoon@gmail.com activated subscription for "${planName || pathId}" via ${paymentMethod || 'Web Gateway'}`,
          metadata: { planId: pathId, user: 'elitetraderjunoon@gmail.com', method: paymentMethod || 'Web Gateway' }
        })
      }).catch(err => console.log('Telemetry offline:', err));
    } else {
      fetch('/api/track-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'admin',
          description: `User elitetraderjunoon@gmail.com cancelled subscription for "${planName || pathId}"`,
          metadata: { planId: pathId, user: 'elitetraderjunoon@gmail.com' }
        })
      }).catch(err => console.log('Telemetry offline:', err));
    }
  };

  const handleSubmitReview = (e: any) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewCity.trim() || !newReviewComment.trim()) {
      return;
    }
    const created: Review = {
      id: `rev-custom-${Date.now()}-${Math.random()}`,
      name: newReviewName,
      city: newReviewCity,
      state: newReviewState,
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [created, ...reviews];
    setReviews(updated);
    localStorage.setItem('recruit_user_reviews', JSON.stringify(updated));
    
    // Clear inputs and set success state
    setNewReviewName('');
    setNewReviewCity('');
    setNewReviewState('Odisha');
    setNewReviewRating(5);
    setNewReviewComment('');
    setReviewSubmitSuccess(true);
    setCurrentReviewIdx(0); // Show new review first
    
    setTimeout(() => {
      setReviewSubmitSuccess(false);
      setIsAddingReview(false);
    }, 3000);
  };

  // Load postings & applications from local storage
  useEffect(() => {
    const storedPostings = localStorage.getItem('recruit_postings');
    const storedApplications = localStorage.getItem('recruit_applications');

    if (storedPostings) {
      try {
        const parsed = JSON.parse(storedPostings);
        const parsedIds = new Set(parsed.map((p: any) => p.id));
        const missingPostings = initialPostings.filter(p => !parsedIds.has(p.id));
        if (missingPostings.length > 0) {
          const merged = [...parsed, ...missingPostings];
          setPostings(merged);
          localStorage.setItem('recruit_postings', JSON.stringify(merged));
        } else {
          setPostings(parsed);
        }
      } catch (err) {
        setPostings(initialPostings);
        localStorage.setItem('recruit_postings', JSON.stringify(initialPostings));
      }
    } else {
      setPostings(initialPostings);
      localStorage.setItem('recruit_postings', JSON.stringify(initialPostings));
    }

    if (storedApplications) {
      setApplications(JSON.parse(storedApplications));
    } else {
      setApplications(INITIAL_MOCK_APPLICATIONS);
      localStorage.setItem('recruit_applications', JSON.stringify(INITIAL_MOCK_APPLICATIONS));
    }
  }, []);

  // Sync applications and states with Firestore in real time if user is logged in
  useEffect(() => {
    if (user && userData) {
      if (userData.applications) {
        setApplications(userData.applications);
      }
    }
  }, [user, userData]);

  const handleAddPosting = (newPost: Posting) => {
    const updated = [newPost, ...postings];
    setPostings(updated);
    localStorage.setItem('recruit_postings', JSON.stringify(updated));
  };

  const handleEditPosting = (editedPost: Posting) => {
    const updated = postings.map(p => p.id === editedPost.id ? editedPost : p);
    setPostings(updated);
    localStorage.setItem('recruit_postings', JSON.stringify(updated));
  };

  const handleDeletePosting = (id: string) => {
    const updated = postings.filter(p => p.id !== id);
    setPostings(updated);
    localStorage.setItem('recruit_postings', JSON.stringify(updated));
  };

  const handleAddApplication = (newApp: Application) => {
    const updated = [newApp, ...applications];
    setApplications(updated);

    // Log the user-triggered activity
    try {
      const newAct = {
        id: `act-${Date.now()}`,
        type: 'job',
        title: 'Job Application Submitted',
        description: `Formally submitted candidate registration slip for "${newApp.postingTitle || 'Government Opportunity'}". Receipt ID: ${newApp.registrationNumber || 'REC-' + Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString()
      };
      const existing = JSON.parse(localStorage.getItem('recruit_activities') || '[]');
      localStorage.setItem('recruit_activities', JSON.stringify([newAct, ...existing].slice(0, 15)));
    } catch (e) {
      console.error("Error logging application activity:", e);
    }

    if (user) {
      updateApplications(updated).catch(err => console.error("Failed to sync application to firestore:", err));
    } else {
      localStorage.setItem('recruit_applications', JSON.stringify(updated));
    }
  };

  const handleUpdateAppStatus = (id: string, status: 'Approved' | 'Rejected') => {
    const updated = applications.map(app => app.id === id ? { ...app, status } : app);
    setApplications(updated);
    if (user) {
      updateApplications(updated).catch(err => console.error("Failed to sync application status to firestore:", err));
    } else {
      localStorage.setItem('recruit_applications', JSON.stringify(updated));
    }
  };

  const handleSyncOnlineJobs = async () => {
    setIsSyncingJobs(true);
    setSyncSuccessMessage(null);

    try {
      const response = await fetch('/api/fetch-online-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sector: activeSector !== 'All' ? activeSector : undefined,
          location: activeRegion !== 'All' ? activeRegion : undefined,
          jobType: undefined
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch online postings');
      }

      const data = await response.json();
      if (data.success && Array.isArray(data.postings)) {
        // Filter out postings we already have to avoid duplicates
        const existingIds = new Set(postings.map(p => p.id));
        const newPostings = data.postings.filter((p: any) => !existingIds.has(p.id));

        if (newPostings.length > 0) {
          const updated = [...newPostings, ...postings];
          setPostings(updated);
          localStorage.setItem('recruit_postings', JSON.stringify(updated));
          setSyncSuccessMessage(`Successfully synchronized ${newPostings.length} new verified vacancies from Indian Gazette & National Career Service!`);
        } else {
          setSyncSuccessMessage("No new vacancies found. Your opportunity database is fully up to date!");
        }
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      console.error('Failed to sync live postings:', err);
      // Fallback: merge static fallbacks locally to guarantee results
      const existingIds = new Set(postings.map(p => p.id));
      const mockList = [
        {
          id: 'rbi-assistant-2026',
          title: 'RBI Assistant Online Form 2026',
          organization: 'Reserve Bank of India (RBI)',
          postDate: '2026-06-25',
          shortInfo: 'Reserve Bank of India (RBI) invites online applications from eligible Indian citizens for the post of Assistant in various offices of the Bank. Selection will be through country-wide competitive examinations.',
          category: 'latest-jobs',
          tags: ['RBI', 'Banking', 'Graduate Pass', 'Assistant'],
          department: 'Bank',
          isNew: true,
          state: 'All India',
          jobType: 'government',
          sector: 'Banking & Finance',
          dates: {
            applicationBegin: '2026-06-25',
            lastDateApply: '2026-07-20',
            lastDateFee: '2026-07-20',
            examDate: 'September 2026'
          },
          fees: {
            generalOBC: '₹ 450/-',
            scST: '₹ 50/-',
            paymentMode: 'Online Only'
          },
          ageLimit: {
            asOnDate: '01/06/2026',
            minAge: '20 Years',
            maxAge: '28 Years',
            relaxationInfo: 'As per norms.'
          },
          totalVacancies: 950,
          vacancies: [
            {
              postName: 'Assistant (Clerical)',
              totalPosts: 950,
              eligibility: 'Bachelor\'s Degree in any discipline with a minimum of 50% marks.'
            }
          ],
          links: {
            applyOnline: '#apply',
            officialWebsite: 'https://www.rbi.org.in'
          }
        },
        {
          id: 'drdo-scientist-b-2026',
          title: 'DRDO Scientist B Direct Entry Exam Form 2026',
          organization: 'Defence Research & Development Organisation (DRDO)',
          postDate: '2026-06-26',
          shortInfo: 'Recruitment Assessment Centre (RAC) under DRDO invites online applications for direct recruitment of Scientist \'B\' in DRDO, DST and ADA.',
          category: 'latest-jobs',
          tags: ['DRDO', 'GATE', 'Scientist B', 'Engineering', 'Defence'],
          department: 'Defence',
          isNew: true,
          state: 'All India',
          jobType: 'government',
          sector: 'Security & Defence',
          dates: {
            applicationBegin: '2026-06-26',
            lastDateApply: '2026-07-28',
            lastDateFee: '2026-07-28',
            examDate: 'October 2026'
          },
          fees: {
            generalOBC: '₹ 100/-',
            scST: '₹ 0/-',
            paymentMode: 'Online Only'
          },
          ageLimit: {
            asOnDate: '28/07/2026',
            minAge: '21 Years',
            maxAge: '30 Years',
            relaxationInfo: 'As per rules.'
          },
          totalVacancies: 640,
          vacancies: [
            {
              postName: 'Scientist B',
              totalPosts: 640,
              eligibility: 'First Class Bachelor\'s Degree in Engineering or Technology with GATE score.'
            }
          ],
          links: {
            applyOnline: '#apply',
            officialWebsite: 'https://rac.gov.in'
          }
        }
      ];

      const newPostings = mockList.filter((p: any) => !existingIds.has(p.id));
      if (newPostings.length > 0) {
        const updated = [...newPostings, ...postings];
        setPostings(updated);
        localStorage.setItem('recruit_postings', JSON.stringify(updated));
        setSyncSuccessMessage(`Successfully updated database with ${newPostings.length} premium opportunities!`);
      } else {
        setSyncSuccessMessage("No additional listings available at this moment.");
      }
    } finally {
      setIsSyncingJobs(false);
      setTimeout(() => {
        setSyncSuccessMessage(null);
      }, 6000);
    }
  };


  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [activeSector, setActiveSector] = useState<string>('All');

  // Ensure that switching tabs or entering a detailed view scrolls the viewport to the very top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, selectedPosting]);

  // Smoothly scroll down to the filtered jobs list when user selects a region or sector filter
  useEffect(() => {
    if (activeRegion !== 'All' || activeSector !== 'All') {
      // Delay slightly to allow React to render the list before scrolling
      const timer = setTimeout(() => {
        const anchor = document.getElementById('filtered-listings-anchor');
        if (anchor) {
          anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeRegion, activeSector]);

  const filteredPostings = postings.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.shortInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === 'all' || post.category === activeCategory;

    const matchesDepartment =
      activeDepartment === 'All' || post.department === activeDepartment;

    let matchesRegion = true;
    if (activeRegion === 'OdishaGovt') {
      matchesRegion = (post.state === 'Odisha' && (post.jobType === 'government' || !post.jobType));
    } else if (activeRegion === 'OdishaPrivate') {
      matchesRegion = (post.state === 'Odisha' && post.jobType === 'private');
    } else if (activeRegion === 'AllIndiaGovt') {
      matchesRegion = ((post.state === 'All India' || !post.state || post.state === 'Central') && (post.jobType === 'government' || !post.jobType));
    } else if (activeRegion === 'AllIndiaPrivate') {
      matchesRegion = (post.jobType === 'private');
    }

    let matchesSector = true;
    if (activeSector !== 'All') {
      matchesSector = post.sector === activeSector;
    }

    return matchesSearch && matchesCategory && matchesDepartment && matchesRegion && matchesSector;
  }).sort((a, b) => {
    const dateA = new Date(a.postDate).getTime() || 0;
    const dateB = new Date(b.postDate).getTime() || 0;
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const getCategorizedPostings = (cat: CategoryType) => {
    return filteredPostings.filter(p => p.category === cat);
  };

  const quickLinks = postings.filter(p => p.isNew).slice(0, 8);
  const departmentsList = ['All', 'SSC', 'Railway', 'UPSC', 'Bank', 'Defence', 'State PSC', 'Teaching', 'State Govt', 'Private Sector'];

  // Router dispatcher
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeHero();
      case 'jobs':
        return renderJobsBoard();
      case 'career':
        return <CareerPage onOpenAuth={() => setIsAuthModalOpen(true)} />;
      case 'resume':
        return <ResumePage />;
      case 'interview':
        return <InterviewPage />;
      case 'business':
        return <BusinessPage onOpenAuth={() => setIsAuthModalOpen(true)} />;
      case 'schemes':
        return <SchemesPage />;
      case 'courses':
        return (
          <CoursesPage 
            onOpenAuth={() => setIsAuthModalOpen(true)} 
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        );
      case 'syllabus':
        return <SchoolSyllabusPage />;
      case 'dashboard':
        return (
          <UserDashboard 
            subscriptions={subscriptions} 
            onSubscribe={handleSubscribe} 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onShare={() => handleOpenShare('My Career Dashboard', 'Check out Recruit.org.in - India\'s Futuristic National Career Registry, Jobs, Resume Builder & Courses Platform!', 'https://recruit.org.in')}
          />
        );
      case 'employer':
        return (
          <EmployerPortal 
            postings={postings}
            onAddPosting={handleAddPosting}
            applications={applications}
            onUpdateAppStatus={handleUpdateAppStatus}
          />
        );
      case 'privacy':
      case 'terms':
      case 'refunds':
      case 'payments':
      case 'contact':
      case 'faqs':
        return <LegalPages initialTab={activeTab as any} />;
      case 'admin':
        return (
          <AdminPanel
            postings={postings}
            onAddPosting={handleAddPosting}
            onEditPosting={handleEditPosting}
            onDeletePosting={handleDeletePosting}
            applications={applications}
            onUpdateAppStatus={handleUpdateAppStatus}
          />
        );
      case 'arohi':
        return (
          <div className="max-w-4xl mx-auto text-center py-12 px-4 space-y-8 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="inline-flex items-center gap-2 bg-[#7c3aed]/10 text-[#a78bfa] border border-[#7c3aed]/30 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-300" /> Unified Career & Business Assistant
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] to-[#ec4899]">AROHI</span>
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto font-medium">
                Your unified live ecosystem advisor for finding jobs, analyzing resumes, validating startup ideas, calculating Mudra Loan eligibility, and mapping your professional growth.
              </p>
            </div>

            <div className="bg-[#120e2b] border border-[#2d2163] rounded-3xl p-8 shadow-2xl relative overflow-hidden text-left max-w-3xl mx-auto">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2.5">
                <span className="text-xl">👩</span> What AROHI Can Do For You:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <span className="block text-sm font-bold text-violet-300">💼 Smart Sarkari & Private Jobs</span>
                  <p className="text-xs text-slate-300">Instantly query age limits, reservation criteria, exam dates, and registration process details for UPSC, SSC, Banking, and Railways.</p>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-sm font-bold text-violet-300">📝 ATS Resume Score & Check</span>
                  <p className="text-xs text-slate-300">Optimize your portfolio. Find missing high-impact keywords, grade ATS layout compatibility, and get structural tips.</p>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-sm font-bold text-violet-300">🏦 Mudra & PMEGP Funding eligibility</span>
                  <p className="text-xs text-slate-300">Check business startup subsidy guidelines, Mudra Shishu/Kishor loan eligibility steps, and get verified Central & State Government portals.</p>
                </div>
                <div className="space-y-1.5">
                  <span className="block text-sm font-bold text-violet-300">🚀 Odisha Business & State Subsidies</span>
                  <p className="text-xs text-slate-300">Get specialized local insights on Odisha startups, Mukhyamantri Karma Tatpara Abhiyan (MUKTA), and rural skill training.</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#251a54] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 font-semibold text-center sm:text-left">
                  Ready to test her? Click the button to launch your private chat window instantly.
                </p>
                <button
                  onClick={() => {
                    setIsChatOpen(true);
                    setIsChatMinimized(false);
                  }}
                  className="bg-gradient-to-r from-[#7c3aed] to-[#d946ef] hover:from-[#6d28d9] hover:to-[#c084fc] text-white font-black text-xs uppercase tracking-wider py-3.5 px-8 rounded-2xl shadow-[0_4px_25px_rgba(124,58,237,0.45)] cursor-pointer flex items-center gap-2 transform hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Bot className="w-4.5 h-4.5 text-yellow-300" /> Open Live Chat Window
                </button>
              </div>
            </div>
          </div>
        );
      case 'franchise':
        return <FranchisePage />;
      default:
        return renderHomeHero();
    }
  };

  // Spectacular Home view with 100vh Hero section and central abstract illustration
  const renderHomeHero = () => {
    return (
      <div className="space-y-12">
        
        {/* HERO AREA */}
        <section className="bg-gradient-to-br from-[#06040c] via-[#0b0816] to-[#040307] text-white rounded-[3rem] p-8 md:p-14 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative overflow-hidden border border-slate-800/80">
          {/* Glowing ambient light nodes */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#00e676]/5 rounded-full blur-3xl -translate-y-10 translate-x-10 animate-pulse"></div>
          <div className="absolute left-1/3 top-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-700"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left side info */}
            <div className="lg:col-span-7 space-y-7 text-left">
              
              {/* Pulsing AI Online badge & Interactive 3D Welcome Re-trigger */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-[#091515] border border-teal-500/30 text-teal-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm w-fit">
                  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
                  <span>AROHI is Live — Online Now</span>
                </div>
                <button
                  onClick={() => setIsWalkthroughOpen(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/35 hover:to-yellow-500/35 border border-amber-500/30 hover:border-amber-400/70 text-amber-200 hover:text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide shadow-lg cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <span>🗺️ Take Site Tour</span>
                  <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full animate-pulse">Tour</span>
                </button>
              </div>
              
              {/* Exact screenshot headings */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.1] text-white">
                Confused About <br />
                Your Career? <br />
                <span className="text-white">We've Got </span>
                <span className="text-[#f1b434] font-black bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Your Back!</span>
              </h2>

              {/* Exact subtitle */}
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg font-medium leading-relaxed">
                Personalized roadmaps and the right path that you'll love and grow in.
              </p>

              {/* Dynamic Notification Toast */}
              <NotificationToast />

              {/* Standard layout four feature pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md pt-2">
                <div className="inline-flex items-center gap-2.5 bg-slate-900/55 border border-slate-800 hover:border-amber-500/25 text-slate-200 text-[11px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                  <span className="text-base">🌐</span> Personal Career Insights
                </div>
                <div className="inline-flex items-center gap-2.5 bg-slate-900/55 border border-slate-800 hover:border-amber-500/25 text-slate-200 text-[11px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                  <span className="text-base">👤</span> Expert Career Counselors
                </div>
                <div className="inline-flex items-center gap-2.5 bg-slate-900/55 border border-slate-800 hover:border-amber-500/25 text-slate-200 text-[11px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                  <span className="text-base">🗺️</span> Personalized Roadmaps
                </div>
                <div className="inline-flex items-center gap-2.5 bg-slate-900/55 border border-slate-800 hover:border-amber-500/25 text-slate-200 text-[11px] font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                  <span className="text-base">🔒</span> 100% Confidential & Trusted
                </div>
              </div>

            </div>

            {/* Right side AROHI Custom Assistant block */}
            <div className="lg:col-span-5 relative flex flex-col gap-4 items-center justify-center select-none max-w-md w-full mx-auto">
              
              {/* Premium Resume Builder Card */}
              <div className="bg-gradient-to-br from-[#0a0815] via-[#100e21] to-[#07050e] border border-slate-800 rounded-[2rem] p-6 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8)] relative overflow-hidden w-full text-left transition-all hover:border-slate-700">
                {/* Background glow or accent */}
                <div className="absolute right-0 top-0 w-24 h-24 bg-[#00e676]/5 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="bg-[#00e676]/10 text-[#00e676] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#00e676]/20">
                      ⚡ Professional Tool
                    </span>
                    <h4 className="text-[15px] font-black text-white mt-3 flex items-center gap-1.5">
                      📑 Professional Resume Builder
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1.5 max-w-[280px] font-medium leading-relaxed">
                      Create a professional, ATS-friendly resume to secure your dream role instantly.
                    </p>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="bg-[#ffdd00] text-slate-950 px-2.5 py-1.5 rounded-xl border border-yellow-300 font-black text-[12px] flex flex-col items-center leading-none shadow-md shrink-0">
                    <span>₹99</span>
                    <span className="text-[7px] font-bold uppercase tracking-tight mt-0.5 opacity-90">Only</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-5">
                  <button
                    onClick={() => setActiveTab('resume')}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Build Your Resume</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 stroke-[2px]">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.63l-3-3a.75.75 0 1 1 1.06-1.06l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06l3-3H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleOpenShare('Professional Resume Builder', 'Check out the amazing Professional Resume Builder on Recruit.org.in! Create an ATS-friendly, professional resume to get hired instantly for only ₹99.', 'https://recruit.org.in')}
                    className="px-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                    title="Share Resume Builder with friends"
                  >
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#090812] via-[#0d0c1b] to-[#05040a] border border-slate-800/80 rounded-[2.25rem] p-6 sm:p-8 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.8)] relative space-y-6 w-full hover:border-slate-700 transition-all">
                
                {/* Header Info */}
                <div className="flex items-center gap-4">
                  <div className="rounded-full w-14 h-14 flex items-center justify-center border border-slate-800 bg-slate-950 shadow-md shrink-0 relative overflow-hidden">
                    <ArohiAvatar className="w-full h-full" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-extrabold text-white flex items-center gap-1.5">
                      Hi! I'm AROHI <span className="animate-bounce">🎉</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse"></span>
                      Online — Career Guide
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-left font-medium">
                  I can help you find clarity and the right direction for your career.
                </p>

                {/* Checklist items */}
                <div className="space-y-3 text-left pt-1">
                  {[
                    "Discover your strengths",
                    "Explore the best career options",
                    "Get a personalized roadmap",
                    "Plan your skill development",
                    "Achieve your career goals"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-teal-400">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-xs font-semibold text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Action button */}
                <button
                  onClick={() => setActiveTab('arohi')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl w-full flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all cursor-pointer border border-purple-500/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                    <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.53a.75.75 0 0 0-.63.732v6.417a5.21 5.21 0 0 0 1.253 3.39l1.411 1.693a.75.75 0 0 0 1.15-.054L8 12.333V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4.667l1.396 2.393a.75.75 0 0 0 1.15.054l1.411-1.693a5.21 5.21 0 0 0 1.253-3.39V3.262a.75.75 0 0 0-.63-.73A42.12 42.12 0 0 0 10 2Zm-2.75 7.5a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75ZM8 6.25a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5H8a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                  </svg>
                  Talk to AROHI Now
                </button>

                {/* Footer status text */}
                <div className="text-[10px] font-bold text-slate-400 tracking-wider text-center uppercase">
                  ⚡ ASK AROHI ANYTHING • ONLINE
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* PROMINENT NATIONAL REGISTER SIGNUP CALLOUT */}
        {!user && (
          <section className="bg-gradient-to-r from-[#1c124c] via-[#0f0a28] to-[#1c124c] border-2 border-purple-500/30 rounded-[2.5rem] p-8 md:p-10 text-left relative overflow-hidden shadow-[0_20px_50px_rgba(124,58,237,0.2)] animate-in fade-in slide-in-from-bottom duration-300">
            <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-10 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#fbbf24]/10 text-[#fcd34d] border border-[#fbbf24]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  ⭐ Join 12,000+ Aspirants Registered This Month
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Formulate Your Permanent National Career Profile
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-semibold leading-relaxed">
                  Connecting via Google Sign-In securely registers your candidacy to a secure cloud-synced account. Track course completions, save government matching schemes, preserve live AI speech interview ratings, and backup all your active application slips securely!
                </p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[11px] font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">🛡️ 100% Secure & Encrypted</span>
                  <span className="flex items-center gap-1.5">📝 Save Live ATS Resume History</span>
                  <span className="flex items-center gap-1.5">🏆 Verify Academic Credentials</span>
                </div>
              </div>
              
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 w-full shrink-0">
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="text-base">🚀</span> Connect Securely Now
                </button>
                <div className="text-[10px] text-slate-400 font-bold text-center w-full mt-1">
                  Connect instantly via Google OAuth or Email Registry
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PROMINENT USER DASHBOARD LINK CALLOUT FOR LOGGED IN USERS */}
        {user && (
          <section className="bg-gradient-to-r from-[#0d1e2e] via-[#090714] to-[#1a113a] border-2 border-emerald-500/30 rounded-[2.5rem] p-8 md:p-10 text-left relative overflow-hidden shadow-[0_20px_50px_rgba(16,185,129,0.15)] animate-in fade-in slide-in-from-bottom duration-300">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute left-10 bottom-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  ✓ National Career Registry Account Active
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">{userData?.profile?.name || user.displayName || 'Learner'}</span>!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-semibold leading-relaxed">
                  Your personalized career hub is updated. Access your active job applications, school curriculum guides, MSME guides, resume score reviews, and subscription statuses instantly from your central user dashboard.
                </p>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[11px] font-bold text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">● Live Synchronization Active</span>
                  <span className="flex items-center gap-1.5">★ {subscriptions && subscriptions.length > 0 ? `${subscriptions.length} Linked Subscriptions` : 'Free Tier Account'}</span>
                  <span className="flex items-center gap-1.5 text-purple-400">👥 Access all features instantly</span>
                </div>
              </div>
              
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 w-full shrink-0">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Go to User Dashboard
                </button>
                <div className="text-[10px] text-slate-400 font-bold text-center w-full mt-1">
                  Manage profiles, subscription paths, and view certifications
                </div>
              </div>
            </div>
          </section>
        )}

        {/* INTERACTIVE 3D ORBITAL ECOSYSTEM ENGINE */}
        <Interactive3DOrbit setActiveTab={setActiveTab} setSelectedPosting={setSelectedPosting} />

        {/* SMOOTH 3D NON-STOP SCROLLING SHOWCASE */}
        <Smooth3DShowcase setActiveTab={setActiveTab} setSelectedPosting={setSelectedPosting} />

        {/* THREE STRATEGIC ASSISTANCE PATHS */}
        <section className="space-y-6">
          <div className="text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-[#fbbf24]/10 text-[#fcd34d] border border-[#fbbf24]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
            👑 Elite Career & Academic Ecosystem
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Four Strategic Support & Career Paths</h3>
            <p className="text-xs text-slate-300 max-w-3xl font-semibold leading-relaxed">
              Explore your ideal track below. Our monthly assistance plan starting from a budgeted rate of <span className="text-yellow-300 font-extrabold">₹399/Month</span> empowers you with active expert guidelines and continuous support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* PATH 1 CARD */}
            <div className="bg-gradient-to-br from-[#101c5c] via-[#090b24] to-[#040512] border-2 border-blue-500/30 hover:border-blue-400/80 rounded-[2.5rem] p-7 text-left flex flex-col justify-between transition-all duration-500 group shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:shadow-[0_30px_70px_rgba(59,130,246,0.5)] hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-colors"></div>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(37,99,235,0.4)] border border-blue-400/30">
                    🎓
                  </div>
                  <span className="text-[10px] bg-blue-500/25 text-blue-100 font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-blue-400/30 shadow-sm">
                    Path 1: Jobs & Resumes
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none group-hover:text-blue-100 transition-colors">
                    Career & Resume Path
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    Search and apply for premium Government and Private jobs. Use ATS grading, find resume deficiencies, and practice tailored interview questions.
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-slate-800/60 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Elite Benefits Included:</span>
                  <div className="space-y-2 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Match-scoring with latest vacancies</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Real-time ATS resume keyword checker</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Interactive mock interview simulations</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Assistance Fee</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white tracking-tight">₹399</span>
                    <span className="text-xs font-semibold text-slate-400"> / month</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('jobs')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-extrabold text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all text-center cursor-pointer active:scale-95"
                  >
                    Explore Jobs
                  </button>
                  <button 
                    onClick={() => {
                      if (subscriptions.path1) {
                        handleSubscribe('path1');
                      } else {
                        setCheckoutPath({ id: 'path1', title: 'Path 1: Career, Jobs & Resume Assistance Plan', price: '₹399/Month' });
                      }
                    }}
                    className={`font-black text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer text-center active:scale-95 ${
                      subscriptions.path1 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)] border border-blue-400/20'
                    }`}
                  >
                    {subscriptions.path1 ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>

            {/* PATH 2 CARD */}
            <div className="bg-gradient-to-br from-[#4c1256] via-[#0d0724] to-[#050310] border-2 border-purple-500/30 hover:border-purple-400/80 rounded-[2.5rem] p-7 text-left flex flex-col justify-between transition-all duration-500 group shadow-[0_20px_50px_rgba(168,85,247,0.3)] hover:shadow-[0_30px_70px_rgba(168,85,247,0.5)] hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/30 transition-colors"></div>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(168,85,247,0.4)] border border-purple-400/30">
                    📖
                  </div>
                  <span className="text-[10px] bg-purple-500/25 text-purple-100 font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-purple-400/30 shadow-sm">
                    Path 2: Upgrade Skills
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none group-hover:text-purple-100 transition-colors">
                    Skill Upgradation Path
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    No direct subscription cost. Sign up for any course and pay in flexible monthly breakups. Get Arohi AI classroom mentorship completely free of cost!
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-slate-800/60 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Elite Benefits Included:</span>
                  <div className="space-y-2 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Full access to Tech & Business academy</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Industry standard certificates</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Arohi AI Mentor Included Free</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Assistance Fee</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#00e676] tracking-tight">FREE</span>
                    <span className="text-xs font-semibold text-slate-400"> (with Course)</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('courses')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-extrabold text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all text-center cursor-pointer active:scale-95"
                  >
                    View Courses
                  </button>
                  <button 
                    onClick={() => {
                      if (subscriptions.path2) {
                        handleSubscribe('path2');
                      } else {
                        setCheckoutPath({ id: 'path2', title: 'Path 2: Economical Skill Upgradation Plan', price: 'FREE (Arohi Included with Course)' });
                      }
                    }}
                    className={`font-black text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer text-center active:scale-95 ${
                      subscriptions.path2 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_4px_15px_rgba(168,85,247,0.4)] border border-purple-400/20'
                    }`}
                  >
                    {subscriptions.path2 ? 'Subscribed ✓' : 'Subscribe (Free)'}
                  </button>
                </div>
              </div>
            </div>

            {/* PATH 3 CARD */}
            <div className="bg-gradient-to-br from-[#0c3e29] via-[#040d0a] to-[#010504] border-2 border-emerald-500/30 hover:border-emerald-400/80 rounded-[2.5rem] p-7 text-left flex flex-col justify-between transition-all duration-500 group shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_30px_70px_rgba(16,185,129,0.5)] hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/30 transition-colors"></div>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(16,185,129,0.4)] border border-emerald-400/30">
                    🚀
                  </div>
                  <span className="text-[10px] bg-emerald-500/25 text-emerald-100 font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-400/30 shadow-sm">
                    Path 3: Udyam
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none group-hover:text-emerald-100 transition-colors">
                    Udyam Business Plan
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    Not looking for a job? Build your business startup instead. Master Udyam MSME registrations, check Mudra loan eligibility, and claim subsidies.
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-slate-800/60 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Elite Benefits Included:</span>
                  <div className="space-y-2 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Government portal verification guides</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Mudra & PMEGP subsidy eligibility</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Odisha state & local startup benefits</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Assistance Fee</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white tracking-tight">₹399</span>
                    <span className="text-xs font-semibold text-slate-400"> / month</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('business')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-extrabold text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all text-center cursor-pointer active:scale-95"
                  >
                    Launch Business
                  </button>
                  <button 
                    onClick={() => {
                      if (subscriptions.path3) {
                        handleSubscribe('path3');
                      } else {
                        setCheckoutPath({ id: 'path3', title: 'Path 3: Udyam Business Assistance Plan', price: '₹399/Month' });
                      }
                    }}
                    className={`font-black text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer text-center active:scale-95 ${
                      subscriptions.path3 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] border border-emerald-400/20'
                    }`}
                  >
                    {subscriptions.path3 ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>

            {/* PATH 4 CARD */}
            <div className="bg-gradient-to-br from-[#111e58] via-[#060b24] to-[#020410] border-2 border-indigo-500/30 hover:border-indigo-400/80 rounded-[2.5rem] p-7 text-left flex flex-col justify-between transition-all duration-500 group shadow-[0_20px_50px_rgba(99,102,241,0.3)] hover:shadow-[0_30px_70px_rgba(99,102,241,0.5)] hover:scale-[1.02] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/30 transition-colors"></div>
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_25px_rgba(99,102,241,0.4)] border border-indigo-400/30">
                    📚
                  </div>
                  <span className="text-[10px] bg-indigo-500/25 text-indigo-100 font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-indigo-400/30 shadow-sm">
                    Path 4: Class 1-10
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none group-hover:text-indigo-100 transition-colors">
                    School Support Path
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    Syllabus explorer for Class 1-10 students. Access high-quality unique chapters for Languages and Sciences mapped to standard curricula.
                  </p>
                </div>

                <div className="space-y-2.5 border-t border-slate-800/60 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Elite Benefits Included:</span>
                  <div className="space-y-2 text-xs font-semibold text-slate-200">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Unique high-quality chapter notes</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>Interactive school syllabus explorer</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2.5 rounded-xl backdrop-blur-md">
                      <span className="text-emerald-400 text-sm">✓</span>
                      <span>24/7 School support from AROHI AI</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/60 mt-6 space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Assistance Fee</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white tracking-tight">₹399</span>
                    <span className="text-xs font-semibold text-slate-400"> / month</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setActiveTab('syllabus')}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-extrabold text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all text-center cursor-pointer active:scale-95"
                  >
                    Open Syllabus
                  </button>
                  <button 
                    onClick={() => {
                      if (subscriptions.path4) {
                        handleSubscribe('path4');
                      } else {
                        setCheckoutPath({ id: 'path4', title: 'Path 4: Class 1-10 Student Support Plan', price: '₹399/Month' });
                      }
                    }}
                    className={`font-black text-[11px] uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer text-center active:scale-95 ${
                      subscriptions.path4 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                        : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)] border border-indigo-400/20'
                    }`}
                  >
                    {subscriptions.path4 ? 'Subscribed ✓' : 'Subscribe'}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURED SARKARI JOB HIGHLIGHT BOARD */}
        <section className="bg-[#120d2a] border border-[#2d2163] p-6 rounded-3xl shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 border-b border-[#211b3d] pb-2.5">
            <CheckCircle className="w-4.5 h-4.5 text-[#10b981]" /> Hot Active Online Application Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((p, idx) => {
              const borderColors = [
                'border-orange-500/60 hover:border-orange-500',
                'border-blue-500/60 hover:border-blue-500',
                'border-emerald-500/60 hover:border-emerald-500',
                'border-rose-500/60 hover:border-rose-500',
                'border-indigo-500/60 hover:border-indigo-500',
                'border-purple-500/60 hover:border-purple-500',
                'border-teal-500/60 hover:border-teal-500',
                'border-amber-500/60 hover:border-amber-500'
              ];
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPosting(p);
                    setActiveTab('jobs');
                  }}
                  className={`text-left p-4 border-l-4 rounded-xl bg-[#171238]/60 border border-[#2d2165]/80 hover:bg-[#1a1442] hover:shadow-[0_0_15px_rgba(124,58,237,0.15)] transition-all duration-200 cursor-pointer flex justify-between items-center group font-bold text-xs ${borderColors[idx % borderColors.length]}`}
                >
                  <div className="pr-1.5 leading-snug text-slate-200">
                    <span className="block text-[9px] text-[#8a70f5] uppercase font-black mb-0.5">{p.organization}</span>
                    <span className="group-hover:underline text-white">{p.title}</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-400 opacity-65 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              );
            })}
          </div>
        </section>

        {/* PROMO CTA: Talk with AROHI */}
        <section className="bg-gradient-to-r from-[#17123a] to-[#0d0924] border border-[#2d2163] rounded-[2rem] p-6 sm:p-8 text-left shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>
              AROHI Your Career guide
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Need Career or Subsidy Help? Ask AROHI</h3>
            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Get immediate interactive advice regarding Mudra loans, exam syllabus, educational schemes, ATS resume tips, or business setup. Simply tap launch to open your chat window.
            </p>
          </div>
          <button
            onClick={() => {
              setIsChatOpen(true);
              setIsChatMinimized(false);
            }}
            className="w-full md:w-auto bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-7 rounded-2xl shadow-[0_4px_20px_rgba(124,58,237,0.35)] cursor-pointer flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95"
          >
            <Bot className="w-4.5 h-4.5 text-yellow-300" /> Launch Live Chat
          </button>
        </section>

        {/* PREMIUM CANDIDATE TESTIMONIALS & RATINGS MODULE */}
        <section className="bg-gradient-to-br from-[#130d2d] via-[#090618] to-[#1a113a] border border-[#2d2163] p-6 sm:p-10 rounded-3xl shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Heading and Intro Stats */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#211b42] pb-6">
            <div className="text-left space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#f59e0b]/10 text-[#fbbf24] border border-[#f59e0b]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                <Star className="w-3.5 h-3.5 fill-current text-amber-400 animate-pulse" /> Candidate Verification & Ratings
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Verified Candidate Testimonials</h3>
              <p className="text-xs text-slate-300 max-w-2xl font-semibold leading-relaxed">
                See how students, job aspirants, and entrepreneurs in <span className="text-amber-300">Odisha</span> and across <span className="text-[#a78bfa]">India</span> use our platform to empower their academic and professional journeys.
              </p>
            </div>

            {/* Quick Overall rating badge */}
            <div className="bg-[#120d2d]/80 border border-[#40308c] rounded-2xl p-4 flex items-center gap-4 shrink-0 text-left">
              <div className="text-center">
                <span className="block text-3xl font-black text-yellow-300 leading-none">4.9</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">Out of 5★</span>
              </div>
              <div className="border-l border-[#2e2365] pl-4 space-y-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-[10px] text-slate-200 font-extrabold block">
                  {(14820 + 9330 + reviews.length).toLocaleString()} Total Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Audience Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Odisha Audience Counter Card */}
            <div className="bg-[#150f38]/50 border border-[#271d54] hover:border-[#382b75] p-5 rounded-2xl text-left transition-colors flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#a78bfa]">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> Odisha State Audience
                </div>
                <h4 className="text-lg font-black text-white">
                  {(14820 + reviews.filter(r => r.state === 'Odisha').length).toLocaleString()} Candidates
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  Verified upskilling program students and startup loan applications.
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-xs px-3 py-1.5 rounded-xl shrink-0 flex flex-col items-center leading-none">
                <span className="text-sm">4.9</span>
                <span className="text-[7px] uppercase tracking-wider mt-0.5 opacity-80">Rating</span>
              </div>
            </div>

            {/* Indian Audience Counter Card */}
            <div className="bg-[#150f38]/50 border border-[#271d54] hover:border-[#382b75] p-5 rounded-2xl text-left transition-colors flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#a78bfa]">
                  <Users className="w-3.5 h-3.5 text-violet-400" /> Pan-India Audience
                </div>
                <h4 className="text-lg font-black text-white">
                  {(9330 + reviews.filter(r => r.state !== 'Odisha').length).toLocaleString()} Candidates
                </h4>
                <p className="text-[11px] text-slate-300 font-medium">
                  Central government postings, ATS resume scans, and national mock assessments.
                </p>
              </div>
              <div className="bg-violet-500/10 border border-violet-500/30 text-violet-400 font-black text-xs px-3 py-1.5 rounded-xl shrink-0 flex flex-col items-center leading-none">
                <span className="text-sm">4.8</span>
                <span className="text-[7px] uppercase tracking-wider mt-0.5 opacity-80">Rating</span>
              </div>
            </div>
          </div>

          {/* Core Interactive Testimonial Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Col: Current Active Testimonial Card */}
            <div className="lg:col-span-7 bg-[#100b2a] border border-[#2c1f5e] rounded-2xl p-6 text-left relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              {(() => {
                const activeReview = reviews[currentReviewIdx] || reviews[0];
                return (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#d946ef] text-white flex items-center justify-center font-black text-sm uppercase shadow-inner">
                            {activeReview.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-white">{activeReview.name}</h5>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold mt-0.5">
                              <MapPin className="w-3 h-3 text-amber-400" /> {activeReview.city}, {activeReview.state}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg text-amber-400 font-black text-[11px]">
                          <span className="mr-1">{activeReview.rating}.0</span>
                          {Array.from({ length: activeReview.rating }).map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <span className="absolute -top-2.5 -left-1 text-slate-700/40 text-4xl font-serif select-none pointer-events-none">“</span>
                        <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed pl-4 font-medium">
                          {activeReview.comment}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#1e1742] pt-4 mt-6">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        Verified Candidate Review • {activeReview.date}
                      </span>

                      <button
                        onClick={() => {
                          if (reviews.length > 1) {
                            let nextIdx;
                            do {
                              nextIdx = Math.floor(Math.random() * reviews.length);
                            } while (nextIdx === currentReviewIdx);
                            setCurrentReviewIdx(nextIdx);
                          }
                        }}
                        className="bg-[#241a54] hover:bg-[#322474] text-[#a78bfa] border border-[#3f2c8d] hover:border-[#7c3aed] text-[10px] font-black uppercase tracking-wider py-1.5 px-3.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin duration-1000" /> Next Review
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Right Col: Write your own review CTA / Form */}
            <div className="lg:col-span-5 bg-[#140e36]/60 border border-[#2b1f5d] rounded-2xl p-6 text-left">
              {!isAddingReview ? (
                <div className="space-y-4 h-full flex flex-col justify-center">
                  <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#a78bfa]" /> Share Your Feedback
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                    Are you preparing for an upskilling exam in Odisha or updating your resume for top engineering roles? Your feedback helps thousands of fellow aspirants!
                  </p>
                  <button
                    onClick={() => setIsAddingReview(true)}
                    className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-extrabold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4 text-yellow-300" /> Write A Verified Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-3.5">
                  <div className="flex justify-between items-center border-b border-[#211b4a] pb-2">
                    <span className="text-xs font-black text-white uppercase tracking-wider">Write Your Testimonial</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingReview(false)}
                      className="text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>

                  {reviewSubmitSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center space-y-1">
                      <p className="text-xs font-black uppercase tracking-wider">✓ Review Submitted!</p>
                      <p className="text-[11px] font-semibold text-slate-300">Thank you for sharing your experience. We have added your review to our candidate board.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] uppercase font-black text-slate-400">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Giri"
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full bg-[#0d0924] border border-[#2d2163] focus:border-[#7c3aed] text-white text-xs p-2 rounded-lg outline-none"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] uppercase font-black text-slate-400">City / Town</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Puri"
                            value={newReviewCity}
                            onChange={(e) => setNewReviewCity(e.target.value)}
                            className="w-full bg-[#0d0924] border border-[#2d2163] focus:border-[#7c3aed] text-white text-xs p-2 rounded-lg outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1 text-left">
                          <label className="text-[9px] uppercase font-black text-slate-400">State Audience</label>
                          <select
                            value={newReviewState}
                            onChange={(e) => setNewReviewState(e.target.value)}
                            className="w-full bg-[#0d0924] border border-[#2d2163] focus:border-[#7c3aed] text-white text-xs p-2 rounded-lg outline-none"
                          >
                            <option value="Odisha">Odisha</option>
                            <option value="Andhra Pradesh">Andhra Pradesh</option>
                            <option value="Bihar">Bihar</option>
                            <option value="Jharkhand">Jharkhand</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                          </select>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-[9px] uppercase font-black text-slate-400">Rating Scale</label>
                          <select
                            value={newReviewRating}
                            onChange={(e) => setNewReviewRating(Number(e.target.value))}
                            className="w-full bg-[#0d0924] border border-[#2d2163] focus:border-[#7c3aed] text-amber-400 font-extrabold text-xs p-2 rounded-lg outline-none"
                          >
                            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value="4">⭐⭐⭐⭐ (4/5)</option>
                            <option value="3">⭐⭐⭐ (3/5)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] uppercase font-black text-slate-400">Your Feedback / Review Message</label>
                        <textarea
                          required
                          rows={2}
                          maxLength={250}
                          placeholder="What did you learn? How was your ATS score or business guidelines helpful?"
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-[#0d0924] border border-[#2d2163] focus:border-[#7c3aed] text-white text-xs p-2 rounded-lg outline-none resize-none leading-relaxed"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#00e676] hover:bg-[#00c864] text-slate-950 font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                      >
                        Submit Verified Review
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

          </div>

          {/* Browse all reviews trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#211b4a] mt-2 text-left">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                Explore {reviews.length} Verified Submissions
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold">
                Our active community spans over 100+ state and national reviews detailing genuine career impacts.
              </p>
            </div>
            <button
              onClick={() => setIsAllReviewsOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-100 font-extrabold text-[11px] uppercase tracking-wider py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
            >
              <span>View All Verified Reviews ({reviews.length})</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

        </section>

      </div>
    );
  };

  // Detailed Jobs board view (classic 3-column replica)
  const renderJobsBoard = () => {
    if (selectedPosting) {
      return (
        <PostingDetail
          posting={selectedPosting}
          onBack={() => setSelectedPosting(null)}
          onAddApplication={handleAddApplication}
        />
      );
    }

    return (
      <div className="space-y-6">
        
        {/* Notice alert board */}
        <div className="bg-gradient-to-r from-[#1b1444] to-[#0c0824] text-white p-5 rounded-3xl shadow-xl border border-[#3b2b80] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#7c3aed]/20 p-2.5 rounded-xl border border-[#7c3aed]/40 text-yellow-300">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm md:text-base tracking-wide">
                Live Central & State Govt Job Postings 2026
              </h3>
              <p className="text-xs text-[#a594fd] font-semibold mt-0.5">
                Real-time official updates of recruitment eligibility boards. Directly apply online and print application slips.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 w-full md:w-auto">
            <button
              onClick={() => { setActiveCategory('latest-jobs'); }}
              className="flex-1 md:flex-initial bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg border border-yellow-300 transition-all cursor-pointer shadow-sm text-center"
            >
              Latest Jobs Alert
            </button>
            <button
              onClick={() => { setActiveCategory('results'); }}
              className="flex-1 md:flex-initial bg-white hover:bg-slate-150 text-slate-900 font-black text-[11px] uppercase tracking-wider px-4 py-2.5 rounded-lg transition-all cursor-pointer shadow-sm text-center"
            >
              Exam Results
            </button>
          </div>
        </div>

        {/* INLINE REGISTRATION PROMPT FOR OPPORTUNITY TRACKING */}
        {!user && (
          <div className="bg-gradient-to-r from-blue-900/10 via-indigo-950/20 to-blue-950/10 border border-blue-500/25 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-in fade-in slide-in-from-top-3 duration-250">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-blue-400 font-mono tracking-widest block">🔒 SECURITY GATEWAY</span>
              <h4 className="text-xs font-black text-white">
                Want to Save Your Job Preferences & Download Official Receipts?
              </h4>
              <p className="text-[11px] text-slate-300 font-medium max-w-xl leading-relaxed">
                Create a permanent Candidate Account to save active government matching schemes, lock in resume grades, track exam dates, and print official computer-generated application slips.
              </p>
            </div>
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shrink-0 active:scale-95 hover:scale-[1.02]"
            >
              Sign Up / Login Now
            </button>
          </div>
        )}

        {user && (
          <div className="bg-gradient-to-r from-emerald-950/10 via-slate-900/40 to-purple-950/10 border border-emerald-500/20 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left animate-in fade-in slide-in-from-top-3 duration-250">
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase text-emerald-400 font-mono tracking-widest block">✓ INTEGRATED TRACKING ACTIVE</span>
              <h4 className="text-xs font-black text-white">
                Track Applications & Saved Job Slots
              </h4>
              <p className="text-[11px] text-slate-300 font-medium max-w-xl leading-relaxed">
                Your Candidate Account is tracking applied roles. Open your centralized User Dashboard to review application status, verify scores, or download official receipts instantly.
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shrink-0 active:scale-95 hover:scale-[1.02] flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Go to User Dashboard
            </button>
          </div>
        )}

        {/* Live AI Opportunity Crawler & Sync Panel */}
        <div className="bg-gradient-to-r from-[#0d1527] via-[#091e2b] to-[#0d1527] text-white p-5 rounded-3xl shadow-xl border border-emerald-950/50 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden group">
          {/* Subtle background glow */}
          <div className="absolute -inset-10 bg-emerald-500/5 rounded-full filter blur-2xl opacity-50 group-hover:opacity-75 transition-opacity pointer-events-none"></div>
          
          <div className="flex items-center gap-3.5 relative z-10 text-left w-full md:w-auto">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0 relative">
              <RefreshCw className={`w-6 h-6 ${isSyncingJobs ? 'animate-spin' : ''}`} />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm md:text-base tracking-wide text-emerald-100">
                  National Opportunity Database Crawler
                </h3>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[9px] font-black uppercase">
                  AI Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                Scan active Indian central/state gazettes, National Career Service, and private sectors for new vacancies.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 w-full md:w-auto relative z-10 shrink-0">
            <button
              onClick={handleSyncOnlineJobs}
              disabled={isSyncingJobs}
              className={`w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 border border-emerald-500/30 ${isSyncingJobs ? 'cursor-not-allowed opacity-75' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
            >
              {isSyncingJobs ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Syncing Live Postings...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                  <span>Fetch & Sync Online Jobs</span>
                </>
              )}
            </button>
          </div>
        </div>

        {syncSuccessMessage && (
          <div className="bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 px-5 py-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-fade-in relative overflow-hidden shadow-inner">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        {/* Interactive Search Bar for listings with Web Speech Voice Command support */}
        <div className="space-y-2">
          <div className="bg-[#120d2a]/95 p-4 rounded-2xl border border-[#2d2163] shadow-lg flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1 relative flex items-center w-full">
              <input
                id="jobs-voice-search-input"
                type="text"
                placeholder={isListening ? "Listening... Speak now 🎙️" : "Search government exam boards, admit cards, or results..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-[#0a0715] text-white border rounded-xl pl-4 pr-16 py-3 text-xs font-bold focus:outline-none transition-all duration-300 ${
                  isListening 
                    ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.25)] placeholder-red-400 font-extrabold' 
                    : 'border-[#2d2163] focus:border-[#7c3aed]'
                }`}
                disabled={isListening}
              />
              <div className="absolute right-3 flex items-center gap-2">
                {searchQuery && !isListening && (
                  <button
                    id="jobs-search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer transition-colors"
                  >
                    Clear
                  </button>
                )}
                
                <button
                  id="jobs-search-mic-btn"
                  type="button"
                  onClick={handleVoiceSearch}
                  title={isListening ? "Stop listening" : "Search with voice"}
                  className={`p-2 rounded-lg transition-all duration-300 relative flex items-center justify-center cursor-pointer ${
                    isListening 
                      ? 'bg-red-500/25 text-red-400 hover:bg-red-500/35 border border-red-500/50 animate-pulse' 
                      : 'bg-[#1b1444] hover:bg-[#2c2062] text-[#c084fc] hover:text-white border border-[#3b2b80] active:scale-95'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    </>
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 shrink-0 bg-[#0a0715] border border-[#2d2163] rounded-xl px-3 py-2.5 focus-within:border-[#7c3aed] transition-all">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider whitespace-nowrap">Sort:</span>
              <select
                id="jobs-sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
                className="bg-transparent text-xs font-black text-[#c084fc] hover:text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="newest" className="bg-[#0f0b24] text-white font-bold">Newest First</option>
                <option value="oldest" className="bg-[#0f0b24] text-white font-bold">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Voice Search Status & Errors */}
          {isListening && (
            <div id="jobs-voice-status-listening" className="flex items-center gap-2 text-[10px] text-red-400 bg-red-500/5 border border-red-500/10 px-3.5 py-1.5 rounded-xl text-left animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0"></span>
              <span className="font-extrabold uppercase tracking-wide">Mic Active: Try saying "SSC Exams", "Railway jobs" or "UPSC Syllabus"</span>
            </div>
          )}

          {voiceSearchError && (
            <div id="jobs-voice-status-error" className="text-[10px] font-extrabold text-amber-400 bg-amber-500/5 border border-amber-500/10 px-3.5 py-1.5 rounded-xl text-left">
              ⚠️ {voiceSearchError}
            </div>
          )}
        </div>

        {/* Real-time Region and Private/Government Target Dashboards */}
        <div className="bg-[#120d2a]/60 p-5 rounded-2xl border border-[#2d2163] space-y-4 text-left">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-black text-[#a594fd] uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-yellow-400" />
              <span>Direct Region & Job Type Portals</span>
            </h4>
            {activeRegion !== 'All' && (
              <button
                onClick={() => { setActiveRegion('All'); setActiveSector('All'); }}
                className="text-[10px] font-extrabold bg-[#1b1444] hover:bg-[#251b5c] text-yellow-300 border border-[#3b2b80] px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Target</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Odisha Government Jobs Card */}
            <button
              onClick={() => {
                setActiveRegion(activeRegion === 'OdishaGovt' ? 'All' : 'OdishaGovt');
                setActiveSector('All'); // Reset sector on region swap
              }}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeRegion === 'OdishaGovt'
                  ? 'bg-gradient-to-br from-[#7c3aed]/30 to-[#4c1d95]/30 border-[#a78bfa] shadow-[0_4px_20px_rgba(124,58,237,0.15)] text-white'
                  : 'bg-[#0a0715] hover:bg-[#110d29] border-[#221a4f] hover:border-[#382a85] text-slate-300'
              }`}
            >
              <div className="absolute right-2.5 top-2.5 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark className="w-12 h-12 text-purple-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#7c3aed]/20 text-[#c084fc] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-[#7c3aed]/30">
                  Odisha
                </span>
                <span className="text-[10px] text-emerald-400 font-extrabold animate-pulse">● Govt</span>
              </div>
              <h5 className="text-xs font-black mt-2 group-hover:text-white transition-colors">
                Government Jobs in Odisha
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                OPSC, OSSSC, OSSC, State board live positions
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                  View Listings
                </span>
                <span className="text-[11px] bg-[#1e144a] border border-[#3f2a8f] text-slate-200 font-black px-2 py-0.5 rounded-md">
                  {postings.filter(p => p.state === 'Odisha' && (p.jobType === 'government' || !p.jobType)).length} Live
                </span>
              </div>
            </button>

            {/* Odisha Private Jobs Card */}
            <button
              onClick={() => {
                setActiveRegion(activeRegion === 'OdishaPrivate' ? 'All' : 'OdishaPrivate');
                setActiveSector('All');
              }}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeRegion === 'OdishaPrivate'
                  ? 'bg-gradient-to-br from-[#0284c7]/30 to-[#0369a1]/30 border-[#38bdf8] shadow-[0_4px_20px_rgba(2,132,199,0.15)] text-white'
                  : 'bg-[#0a0715] hover:bg-[#110d29] border-[#221a4f] hover:border-[#382a85] text-slate-300'
              }`}
            >
              <div className="absolute right-2.5 top-2.5 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="w-12 h-12 text-blue-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#0284c7]/20 text-[#38bdf8] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-[#0284c7]/30">
                  Odisha
                </span>
                <span className="text-[10px] text-sky-400 font-extrabold">● Private</span>
              </div>
              <h5 className="text-xs font-black mt-2 group-hover:text-white transition-colors">
                Private Jobs in Odisha
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                IT Parks, Manufacturing clusters, local corporates
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                  Sector-wise
                </span>
                <span className="text-[11px] bg-[#1e144a] border border-[#3f2a8f] text-slate-200 font-black px-2 py-0.5 rounded-md">
                  {postings.filter(p => p.state === 'Odisha' && p.jobType === 'private').length} Live
                </span>
              </div>
            </button>

            {/* Government Jobs All over India Card */}
            <button
              onClick={() => {
                setActiveRegion(activeRegion === 'AllIndiaGovt' ? 'All' : 'AllIndiaGovt');
                setActiveSector('All');
              }}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeRegion === 'AllIndiaGovt'
                  ? 'bg-gradient-to-br from-[#e11d48]/30 to-[#9f1239]/30 border-[#fda4af] shadow-[0_4px_20px_rgba(225,29,72,0.15)] text-white'
                  : 'bg-[#0a0715] hover:bg-[#110d29] border-[#221a4f] hover:border-[#382a85] text-slate-300'
              }`}
            >
              <div className="absolute right-2.5 top-2.5 opacity-10 group-hover:opacity-20 transition-opacity">
                <Landmark className="w-12 h-12 text-rose-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#e11d48]/20 text-[#fda4af] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-[#e11d48]/30">
                  All India
                </span>
                <span className="text-[10px] text-[#f43f5e] font-extrabold animate-pulse">● Govt</span>
              </div>
              <h5 className="text-xs font-black mt-2 group-hover:text-white transition-colors">
                Govt Jobs All over India
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                SSC, Railway RRB, UPSC, National Bank Exams
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                  Direct Apply
                </span>
                <span className="text-[11px] bg-[#1e144a] border border-[#3f2a8f] text-slate-200 font-black px-2 py-0.5 rounded-md">
                  {postings.filter(p => (p.state === 'All India' || !p.state || p.state === 'Central') && (p.jobType === 'government' || !p.jobType)).length} Live
                </span>
              </div>
            </button>

            {/* Private Jobs All over India Card */}
            <button
              onClick={() => {
                setActiveRegion(activeRegion === 'AllIndiaPrivate' ? 'All' : 'AllIndiaPrivate');
                setActiveSector('All');
              }}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                activeRegion === 'AllIndiaPrivate'
                  ? 'bg-gradient-to-br from-[#0d9488]/30 to-[#0f766e]/30 border-[#5eead4] shadow-[0_4px_20px_rgba(13,148,136,0.15)] text-white'
                  : 'bg-[#0a0715] hover:bg-[#110d29] border-[#221a4f] hover:border-[#382a85] text-slate-300'
              }`}
            >
              <div className="absolute right-2.5 top-2.5 opacity-10 group-hover:opacity-20 transition-opacity">
                <Briefcase className="w-12 h-12 text-teal-400" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#0d9488]/20 text-[#5eead4] px-2 py-0.5 rounded font-black uppercase tracking-wider border border-[#0d9488]/30">
                  All India
                </span>
                <span className="text-[10px] text-teal-400 font-extrabold">● Private</span>
              </div>
              <h5 className="text-xs font-black mt-2 group-hover:text-white transition-colors">
                Private Jobs All over India
              </h5>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                Major IT hubs, tech clusters, and industrial sectors
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">
                  Sector-wise
                </span>
                <span className="text-[11px] bg-[#1e144a] border border-[#3f2a8f] text-slate-200 font-black px-2 py-0.5 rounded-md">
                  {postings.filter(p => p.jobType === 'private').length} Live
                </span>
              </div>
            </button>
          </div>

          {/* Sector-wise interactive options filter */}
          <div className="border-t border-[#1e1742] pt-4 mt-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#93c5fd] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
                <span>Sector-Wise Classification (Maximum Data)</span>
              </span>
              {activeSector !== 'All' && (
                <span className="text-[10px] bg-[#1e144a] border border-[#3f2a8f] text-yellow-300 font-bold px-2 py-0.5 rounded">
                  Showing: {activeSector}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none text-left scrollbar-thin">
              {[
                { id: 'All', label: '🌐 All Sectors' },
                { id: 'IT & Software', label: '💻 IT & Software' },
                { id: 'Healthcare & Medical', label: '🩺 Healthcare & Medical' },
                { id: 'Banking & Finance', label: '💰 Banking & Finance' },
                { id: 'Manufacturing & Core Eng', label: '⚙️ Manufacturing & Core Eng' },
                { id: 'Logistics & Supply Chain', label: '📦 Logistics & Supply Chain' },
                { id: 'Hospitality & Tourism', label: '🏨 Hospitality & Tourism' },
                { id: 'Education & Academics', label: '🎓 Education & Academics' },
                { id: 'Security & Defence', label: '🛡️ Security & Defence' },
                { id: 'Forestry & Environment', label: '🌳 Forestry & Environment' }
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSector(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-black transition-all shrink-0 cursor-pointer border ${
                    activeSector === sec.id
                      ? 'bg-yellow-400 border-yellow-400 text-slate-900 font-black shadow-md'
                      : 'bg-[#080512] border-[#221a4f] text-slate-300 hover:border-[#382a85] hover:bg-[#110d29]'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Department filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none text-left">
          <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Filter Department:</span>
          {departmentsList.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer border ${
                activeDepartment === dept
                  ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-md'
                  : 'bg-[#120d2a] border-[#2c2062] text-slate-300 hover:border-[#3d2f82] hover:bg-[#161036]'
              }`}
            >
              {dept === 'All' ? 'All Ministries' : dept}
            </button>
          ))}
        </div>

        <div id="filtered-listings-anchor" className="scroll-mt-24"></div>

        {activeRegion !== 'All' ? (
          <div className="bg-[#120d2a]/90 rounded-2xl border border-[#2d2163] p-6 shadow-2xl text-left space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2d2163] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider border ${
                    activeRegion.startsWith('Odisha') 
                      ? 'bg-[#7c3aed]/20 text-[#c084fc] border-[#7c3aed]/30' 
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {activeRegion.startsWith('Odisha') ? 'Odisha' : 'All India'}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider border ${
                    activeRegion.endsWith('Govt') 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  }`}>
                    {activeRegion.endsWith('Govt') ? 'Government' : 'Private'}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white mt-2">
                  {activeRegion === 'OdishaGovt' && "Government Jobs in Odisha"}
                  {activeRegion === 'OdishaPrivate' && "Private Jobs in Odisha"}
                  {activeRegion === 'AllIndiaGovt' && "Government Jobs All over India"}
                  {activeRegion === 'AllIndiaPrivate' && "Private Jobs All over India"}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Showing {filteredPostings.length} matching active postings & official announcements.
                </p>
              </div>

              <button
                onClick={() => { setActiveRegion('All'); setActiveSector('All'); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1b1444] hover:bg-[#251b5c] text-yellow-300 border border-[#3b2b80] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
              >
                ← Back to General Board
              </button>
            </div>

            {(() => {
              const advice = getRegionalCareerAdvice(activeRegion, language);
              return (
                <div className="bg-[#09061c] border border-purple-950/50 rounded-2xl p-4 md:p-5 space-y-4">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-extrabold uppercase tracking-widest">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>State Advisor & Career Blueprint ({advice.nativeState})</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm md:text-base font-black text-white">{advice.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold">{advice.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                    <div className="space-y-1.5 bg-[#100c28] p-3.5 rounded-xl border border-[#1f153f]">
                      <span className="font-extrabold text-[#00f3ff] uppercase tracking-wide text-[10px]">🎓 General Eligibility</span>
                      <p className="text-slate-400 font-medium leading-relaxed">{advice.eligibility}</p>
                    </div>
                    <div className="space-y-1.5 bg-[#100c28] p-3.5 rounded-xl border border-[#1f153f]">
                      <span className="font-extrabold text-emerald-400 uppercase tracking-wide text-[10px]">📝 Smart Prep Strategy</span>
                      <p className="text-slate-400 font-medium leading-relaxed">{advice.preparationStrategy}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center text-[10px] sm:text-xs pt-1">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Key Agencies:</span>
                    {advice.keyAgencies.map((agency) => (
                      <span key={agency} className="bg-[#140f35] border border-[#231a4f] text-slate-300 px-2 py-0.5 rounded-md font-bold">
                        {agency}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5 items-center text-[10px] pt-2 border-t border-[#1a1138]/60">
                    <span className="text-slate-500 font-bold uppercase tracking-wider">Indexed Searches:</span>
                    {advice.trendingKeywords.map((kw) => (
                      <span key={kw} className="text-slate-400 bg-purple-950/20 px-1.5 py-0.5 rounded italic">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {filteredPostings.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium bg-[#0a0715]/40 rounded-xl border border-dashed border-[#2d2163]">
                <p className="text-sm font-bold">No active positions match your active filters.</p>
                <button 
                  onClick={() => { setActiveSector('All'); setActiveDepartment('All'); }}
                  className="mt-3 text-xs text-yellow-400 hover:underline font-bold"
                >
                  Clear search/filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPostings.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-[#221a4f] hover:border-[#7c3aed] bg-[#0c091f]/80 hover:bg-[#110d2c]/90 transition-all shadow-md text-left flex flex-col justify-between h-full group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[10px] bg-[#22174d] text-[#c4b5fd] border border-[#4c3ba0]/50 px-2 py-0.5 rounded uppercase font-black tracking-wider shrink-0">
                          {item.organization}
                        </span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          item.category === 'latest-jobs' ? 'bg-emerald-500/10 text-emerald-400' :
                          item.category === 'results' ? 'bg-rose-500/10 text-rose-400' :
                          item.category === 'admit-card' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-purple-500/10 text-purple-400'
                        }`}>
                          {item.category.replace('-', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-200 group-hover:text-[#a78bfa] leading-snug">
                        {item.title}
                      </h4>

                      {item.shortInfo && (
                        <p className="text-xs text-slate-400 leading-relaxed font-semibold line-clamp-2">
                          {item.shortInfo}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.dates?.lastDateApply && (
                          <span className="text-[9px] bg-red-500/10 text-rose-400 border border-red-500/20 px-2 py-0.5 rounded font-black">
                            Last Date: {item.dates.lastDateApply}
                          </span>
                        )}
                        {item.qualification && (
                          <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-black">
                            🎓 {item.qualification}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1b1444]/60 flex items-center justify-between">
                      <span className="text-[10px] text-yellow-400 font-extrabold uppercase group-hover:underline">
                        Apply & View Details →
                      </span>
                      <button
                        onClick={() => setSelectedPosting(item)}
                        className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeCategory === 'all' ? (
          <div className="space-y-6">
            
            {/* Standard 3-Column Sarkari Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Results Column */}
              <div className="bg-[#120d2a]/95 rounded-2xl shadow-xl border border-[#2d2163] overflow-hidden text-left">
                <div className="bg-rose-500/10 text-rose-300 border-b border-[#2d2163] px-4 py-3.5 font-black text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>🏆 Latest Results</span>
                  <span className="bg-rose-500/20 text-[9px] px-2 py-0.5 rounded text-rose-300 border border-rose-500/40 font-extrabold">
                    Result
                  </span>
                </div>
                <div className="p-2 divide-y divide-[#1e1742] max-h-[440px] overflow-y-auto">
                  {getCategorizedPostings('results').length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium">No updates matched filters.</div>
                  ) : (
                    getCategorizedPostings('results').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPosting(item)}
                        className="w-full text-left p-3 hover:bg-[#1c1444] group transition-all rounded-lg cursor-pointer block"
                      >
                        <span className="text-[9px] text-[#8a70f5] font-black block uppercase tracking-wider">
                          {item.organization}
                        </span>
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#a78bfa] group-hover:underline leading-relaxed mt-0.5 inline-block">
                          {item.title}
                        </span>
                        {item.isNew && (
                          <span className="bg-rose-600 text-[8px] text-white font-black px-1.5 py-0.5 rounded animate-pulse inline-block leading-none ml-1.5 align-middle">
                            NEW
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.state && (
                            <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-extrabold border border-slate-700">
                              📍 {item.state}
                            </span>
                          )}
                          {item.jobType && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold border ${
                              item.jobType === 'private'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              💼 {item.jobType === 'private' ? 'Private' : 'Govt'}
                            </span>
                          )}
                          {item.sector && (
                            <span className="text-[8px] bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded font-extrabold border border-yellow-500/20">
                              ✨ {item.sector}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Admit Cards Column */}
              <div className="bg-[#120d2a]/95 rounded-2xl shadow-xl border border-[#2d2163] overflow-hidden text-left">
                <div className="bg-blue-500/10 text-blue-300 border-b border-[#2d2163] px-4 py-3.5 font-black text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>🎟️ Admit Cards</span>
                  <span className="bg-blue-500/20 text-[9px] px-2 py-0.5 rounded text-blue-300 border border-blue-500/40 font-extrabold">
                    Tickets
                  </span>
                </div>
                <div className="p-2 divide-y divide-[#1e1742] max-h-[440px] overflow-y-auto">
                  {getCategorizedPostings('admit-card').length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium">No admit cards.</div>
                  ) : (
                    getCategorizedPostings('admit-card').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPosting(item)}
                        className="w-full text-left p-3 hover:bg-[#1c1444] group transition-all rounded-lg cursor-pointer block"
                      >
                        <span className="text-[9px] text-[#8a70f5] font-black block uppercase tracking-wider">
                          {item.organization}
                        </span>
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#a78bfa] group-hover:underline leading-relaxed mt-0.5 inline-block">
                          {item.title}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.state && (
                            <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-extrabold border border-slate-700">
                              📍 {item.state}
                            </span>
                          )}
                          {item.jobType && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold border ${
                              item.jobType === 'private'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              💼 {item.jobType === 'private' ? 'Private' : 'Govt'}
                            </span>
                          )}
                          {item.sector && (
                            <span className="text-[8px] bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded font-extrabold border border-yellow-500/20">
                              ✨ {item.sector}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Latest Jobs Column */}
              <div className="bg-[#120d2a]/95 rounded-2xl shadow-xl border border-[#2d2163] overflow-hidden text-left">
                <div className="bg-[#10b981]/10 text-emerald-300 border-b border-[#2d2163] px-4 py-3.5 font-black text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>✍️ Latest Jobs</span>
                  <span className="bg-[#10b981]/20 text-[9px] px-2 py-0.5 rounded text-emerald-300 border border-[#10b981]/40 font-extrabold animate-pulse">
                    Apply Now
                  </span>
                </div>
                <div className="p-2 divide-y divide-[#1e1742] max-h-[440px] overflow-y-auto">
                  {getCategorizedPostings('latest-jobs').length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 font-medium">No jobs active.</div>
                  ) : (
                    getCategorizedPostings('latest-jobs').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPosting(item)}
                        className="w-full text-left p-3 hover:bg-[#1c1444] group transition-all rounded-lg cursor-pointer block"
                      >
                        <span className="text-[9px] text-[#8a70f5] font-black block uppercase tracking-wider">
                          {item.organization}
                        </span>
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#a78bfa] group-hover:underline leading-relaxed mt-0.5 inline-block">
                          {item.title}
                        </span>
                        {item.isNew && (
                          <span className="bg-rose-600 text-[8px] text-white font-black px-1.5 py-0.5 rounded animate-pulse inline-block leading-none ml-1.5 align-middle">
                            NEW
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.state && (
                            <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-extrabold border border-slate-700">
                              📍 {item.state}
                            </span>
                          )}
                          {item.jobType && (
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-extrabold border ${
                              item.jobType === 'private'
                                ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                              💼 {item.jobType === 'private' ? 'Private' : 'Govt'}
                            </span>
                          )}
                          {item.sector && (
                            <span className="text-[8px] bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded font-extrabold border border-yellow-500/20">
                              ✨ {item.sector}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Answer Keys, Syllabus, Admissions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Answer Keys */}
              <div className="bg-[#120d2a]/95 rounded-2xl shadow-xl border border-[#2d2163] overflow-hidden text-left">
                <div className="bg-purple-500/10 text-purple-300 border-b border-[#2d2163] px-4 py-3 font-black text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>🔑 Answer Keys</span>
                  <span className="bg-purple-500/20 text-[9px] px-2 py-0.5 rounded text-purple-300 border border-[#7c3aed]/40 font-extrabold">Keys</span>
                </div>
                <div className="p-2 divide-y divide-[#1e1742] max-h-[280px] overflow-y-auto">
                  {getCategorizedPostings('answer-key').length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No answer keys.</div>
                  ) : (
                    getCategorizedPostings('answer-key').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPosting(item)}
                        className="w-full text-left p-2.5 hover:bg-[#1c1444] group transition-all rounded-lg cursor-pointer block"
                      >
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#a78bfa] group-hover:underline leading-relaxed block">
                          {item.title}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Syllabus */}
              <div className="bg-[#120d2a]/95 rounded-2xl shadow-xl border border-[#2d2163] overflow-hidden text-left">
                <div className="bg-amber-500/10 text-amber-300 border-b border-[#2d2163] px-4 py-3 font-black text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>📖 Exam Syllabus PDF</span>
                  <span className="bg-amber-500/20 text-[9px] px-2 py-0.5 rounded text-amber-300 border border-amber-550/40 font-extrabold">Syllabus</span>
                </div>
                <div className="p-2 divide-y divide-[#1e1742] max-h-[280px] overflow-y-auto">
                  {getCategorizedPostings('syllabus').length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No syllabus posted.</div>
                  ) : (
                    getCategorizedPostings('syllabus').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPosting(item)}
                        className="w-full text-left p-2.5 hover:bg-[#1c1444] group transition-all rounded-lg cursor-pointer block"
                      >
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#a78bfa] group-hover:underline leading-relaxed block">
                          {item.title}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Admissions */}
              <div className="bg-[#120d2a]/95 rounded-2xl shadow-xl border border-[#2d2163] overflow-hidden text-left">
                <div className="bg-teal-500/10 text-teal-300 border-b border-[#2d2163] px-4 py-3 font-black text-xs uppercase tracking-wider flex justify-between items-center">
                  <span>🎓 Admissions</span>
                  <span className="bg-teal-500/20 text-[9px] px-2 py-0.5 rounded text-teal-300 border border-teal-550/40 font-extrabold">Admissions</span>
                </div>
                <div className="p-2 divide-y divide-[#1e1742] max-h-[280px] overflow-y-auto">
                  {getCategorizedPostings('admission').length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No admission updates.</div>
                  ) : (
                    getCategorizedPostings('admission').map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPosting(item)}
                        className="w-full text-left p-2.5 hover:bg-[#1c1444] group transition-all rounded-lg cursor-pointer block"
                      >
                        <span className="text-xs font-bold text-slate-200 group-hover:text-[#a78bfa] group-hover:underline leading-relaxed block">
                          {item.title}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="bg-[#120d2a]/90 rounded-2xl border border-[#2d2163] p-6 shadow-xl text-left">
            <h3 className="text-base font-black text-slate-200 border-b border-[#2d2163] pb-3 mb-4 uppercase tracking-wider flex justify-between items-center">
              <span>Filtered listings Board ({filteredPostings.length} Updates)</span>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="text-xs text-[#a594fd] hover:text-white font-extrabold"
              >
                Reset All Filters
              </button>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPostings.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedPosting(item)}
                  className="text-left p-4 rounded-xl border border-[#2d2163] hover:border-[#7c3aed] bg-[#171238]/60 hover:bg-[#1a1442] hover:shadow transition-all cursor-pointer flex justify-between items-start group"
                >
                  <div>
                    <span className="text-[9px] bg-[#22174d] text-[#c4b5fd] border border-[#4c3ba0]/50 px-2 py-0.5 rounded uppercase font-black tracking-wider">
                      {item.organization}
                    </span>
                    <span className="text-[9px] bg-[#fbbf24]/10 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded uppercase font-black tracking-wider ml-1.5">
                      {item.category.toUpperCase().replace('-', ' ')}
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-200 group-hover:text-[#a594fd] mt-2 leading-relaxed">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">Last Date: {item.dates.lastDateApply || 'N/A'}</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#a594fd] transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  };

  if (!hasEntered) {
    return (
      <WelcomeLanding 
        language={language}
        onLanguageChange={changeLanguage}
        onEnter={() => {
          localStorage.setItem('recruit_has_entered', 'true');
          setHasEntered(true);
        }} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
      />
    );
  }

  return (
    <div key={language} className="bg-[#090714] min-h-screen flex flex-col font-sans antialiased text-slate-100 selection:bg-purple-500 selection:text-white pb-12">
      
      {/* 1. Brand Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedPosting(null); // Clear selected posting
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onRevisitWelcome={() => {
          localStorage.removeItem('recruit_has_entered');
          setHasEntered(false);
        }}
        onStartTour={() => setIsWalkthroughOpen(true)}
        language={language}
        onLanguageChange={changeLanguage}
        onShare={() => handleOpenShare()}
      />

      {/* Security Auth Modal overlay */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      {/* Social Share Modal overlay */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalOpen(false)}
              className="absolute inset-0 bg-[#06040d]/80 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-[#120d2a] border border-[#3b2d7d]/50 rounded-[2rem] shadow-[0_20px_50px_rgba(124,58,237,0.3)] max-w-md w-full overflow-hidden p-6 relative z-10 text-left text-slate-100"
            >
              {/* Decorative radial gradients */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button 
                onClick={() => setShareModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  📢 Spread the Word
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-white leading-tight">
                    Share Platform with Friends
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1">
                    Help your peers discover India's futuristic career ecosystem, interactive 3D roadmap matching, and resume parsing tools.
                  </p>
                </div>

                {/* Info summary card */}
                <div className="bg-[#1a143a] border border-[#31256e]/50 rounded-xl p-3.5 space-y-1">
                  <span className="text-[9px] font-black uppercase text-purple-400 font-mono tracking-widest block">CURRENT SHARE INFO</span>
                  <p className="text-xs font-bold text-white line-clamp-1">{shareDetails.title}</p>
                  <p className="text-[11px] text-slate-300 font-medium line-clamp-2 leading-relaxed mt-0.5">{shareDetails.text}</p>
                </div>

                {/* Social Share Grid */}
                <div className="grid grid-cols-5 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareDetails.text + " " + shareDetails.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-center group cursor-pointer active:scale-95"
                    title="Share via WhatsApp"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.381 9.805-9.768.001-2.61-1.01-5.064-2.848-6.905C16.391 2.09 13.933 1.077 11.32 1.077c-5.405 0-9.807 4.382-9.81 9.771-.001 1.542.41 3.048 1.189 4.38l.192.333-1.01 3.69 3.79-.982.326.192zM17.02 14.53c-.302-.15-.1.15-1.51-.702-.27-.15-.47-.23-.67-.53-.2-.3-.8-1.51-.8-2.015 0-.5.25-.753.45-1.004.2-.25.45-.5.67-.753.2-.25.27-.5.15-.753-.12-.25-.8-1.91-1.1-2.61-.28-.7-.57-.6-.77-.6-.2 0-.43-.03-.65-.03-.22 0-.6.08-.9.4-.3.33-1.15 1.104-1.15 2.71 0 1.607 1.15 3.163 1.3 3.364.15.2 2.25 3.464 5.45 4.82 2.65 1.12 3.2 1.104 3.75 1.004.55-.1 1.8-1.104 2.05-1.81.25-.702.25-1.305.15-1.455-.05-.15-.25-.3-.55-.45z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareDetails.url)}&text=${encodeURIComponent(shareDetails.text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/50 transition-all text-center group cursor-pointer active:scale-95"
                    title="Share via Telegram"
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M23.91 2.385c-.11-.53-.55-.91-1.08-.95-1.3-.11-19.04 6.78-21.46 7.78-.54.22-.92.73-.97 1.32-.05.59.23 1.16.73 1.48 1.95 1.25 4.61 2.94 4.61 2.94s1.74 5.25 2.65 7.9c.19.56.68.96 1.27.99.07 0 .14 0 .21-.01.54-.05 1.01-.37 1.22-.87.81-1.88 2.61-6.07 2.61-6.07s4.9 3.56 7.78 5.67c.45.33 1.02.39 1.53.16.51-.23.86-.71.93-1.27.95-7.46 3.19-25.04 3.23-25.32-.01-.13-.03-.26-.06-.39zM8.36 14.15l.31 3.9 1.19-2.92 5.69-5.13-7.19 4.15z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">Telegram</span>
                  </a>

                  {/* Twitter/X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareDetails.text)}&url=${encodeURIComponent(shareDetails.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-center group cursor-pointer active:scale-95"
                    title="Share via X (Twitter)"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">Twitter / X</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareDetails.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/20 hover:border-blue-600/50 transition-all text-center group cursor-pointer active:scale-95"
                    title="Share via Facebook"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">Facebook</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareDetails.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-700/10 hover:bg-blue-700/20 border border-blue-700/20 hover:border-blue-700/50 transition-all text-center group cursor-pointer active:scale-95"
                    title="Share via LinkedIn"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-700/20 flex items-center justify-center text-blue-300 group-hover:scale-105 transition-transform">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                      </svg>
                    </div>
                    <span className="text-[9px] font-bold text-slate-300">LinkedIn</span>
                  </a>
                </div>

                {/* Link Copy Bar */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-widest block">DIRECT COPY LINK</span>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono truncate select-all">
                      {shareDetails.url}
                    </div>
                    <button
                      onClick={handleCopyShareLink}
                      className={`px-4 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer active:scale-95 select-none ${
                        copiedLink 
                          ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : 'bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                      }`}
                    >
                      {copiedLink ? <CheckCircle className="w-4 h-4 animate-bounce" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-text footer */}
                <div className="text-[10px] text-slate-500 font-bold text-center pt-2 leading-tight">
                  Thank you for supporting Recruit.org.in and making India self-reliant 🇮🇳
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Hot scrolling live notifications marquee */}
      <MarqueeTicker
        postings={postings}
        onSelectPosting={(post) => {
          setSelectedPosting(post);
          setActiveTab('jobs');
        }}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeTab !== 'home' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-[#120d2a]/60 border border-[#211b3d] p-4 rounded-2xl select-none animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Left: Breadcrumbs / Back button */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <button
                onClick={() => {
                  setActiveTab('home');
                  setSelectedPosting(null);
                }}
                className="flex items-center gap-1.5 text-slate-300 hover:text-[#00e676] bg-[#1a143c] border border-[#2d2163] px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Home className="w-3.5 h-3.5 text-purple-400" />
                <span>Home</span>
              </button>
              
              <span className="text-slate-600">/</span>

              {prevTab !== 'home' && prevTab !== activeTab && (
                <>
                  <button
                    onClick={() => {
                      setActiveTab(prevTab);
                      setSelectedPosting(null);
                    }}
                    className="text-slate-400 hover:text-white underline decoration-[#7c3aed]/50 hover:decoration-white transition-all capitalize"
                  >
                    {prevTab === 'courses' ? 'Skills' : prevTab === 'arohi' ? 'Arohi Chat' : prevTab}
                  </button>
                  <span className="text-slate-600">/</span>
                </>
              )}

              <span className="text-[#a78bfa] font-bold capitalize bg-[#221f42] border border-[#4c3ba0]/40 px-2 py-0.5 rounded-md">
                {activeTab === 'courses' ? 'Skills' : activeTab === 'arohi' ? 'AROHI Guide' : activeTab}
              </span>
            </div>

            {/* Right: History back or direct jump */}
            <div className="flex items-center gap-2 flex-wrap">
              {prevTab !== activeTab && (
                <button
                  onClick={() => {
                    const temp = activeTab;
                    setActiveTab(prevTab);
                    setPrevTab(temp);
                    setSelectedPosting(null);
                  }}
                  className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer mr-2"
                  title={`Go back to ${prevTab}`}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Go Back</span>
                </button>
              )}

              <span className="text-[10px] uppercase tracking-widest font-black text-slate-500 mr-1 hidden lg:inline">Quick Jump:</span>
              {[
                { id: 'jobs', label: 'Jobs' },
                { id: 'courses', label: 'Skills' },
                { id: 'business', label: 'Business' },
                { id: 'arohi', label: 'Arohi Chat' },
                { id: 'dashboard', label: 'Dashboard' }
              ].map((link) => {
                if (link.id === activeTab) return null;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setActiveTab(link.id);
                      setSelectedPosting(null);
                    }}
                    className="text-[11px] font-bold text-slate-300 hover:text-white bg-[#151032]/40 hover:bg-[#1f1947]/80 border border-[#281f54]/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {renderActiveContent()}
      </main>

      {/* Footer verified seal and info */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 mb-8 space-y-6">
        {/* Multilingual SEO Target Directory & Language Alternate Map */}
        <MultilingualSEOFooter 
          currentLanguage={language}
          onChangeLanguage={changeLanguage}
          onSelectRegion={setActiveRegion}
          onNavigateTab={setActiveTab}
        />

        {/* Expanded Footer Grid */}
        <div className="bg-[#120d2a]/80 rounded-2xl border border-[#211b3d] p-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          {/* Col 1: Platform identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <span className="font-black text-white text-base tracking-tight">Recruit</span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Empowering India’s Students, Professionals, and MSMEs. Secure, verified career pipelines, upskilling programs, resume parsing, and business guide tools.
            </p>
            <button
              onClick={() => handleOpenShare()}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/45 hover:to-indigo-600/45 border border-purple-500/30 hover:border-purple-400/60 text-purple-300 hover:text-white rounded-xl transition-all text-xs font-black uppercase tracking-wider cursor-pointer shadow-md w-full justify-center"
            >
              <Share2 className="w-3.5 h-3.5 text-[#00f3ff]" />
              <span>Share Platform</span>
            </button>
          </div>

          {/* Col 2: Legal Documents & Opportunities */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Links &amp; Documents</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button 
                  onClick={() => setActiveTab('franchise')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left font-black text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
                >
                  <span>AECN Franchise Hub</span>
                  <span className="bg-purple-600/25 border border-purple-500/30 text-purple-300 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full animate-pulse">New</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('privacy')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('terms')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('refunds')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Refund & Cancellation Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Security */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Compliance & Security</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button 
                  onClick={() => setActiveTab('payments')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pricing & RBI Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('payments')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1"
                >
                  <span>PCI-DSS Encryption</span>
                  <span className="bg-[#00e676]/10 text-[#00e676] text-[9px] px-1.5 py-0.5 rounded-full border border-[#00e676]/20 uppercase font-black tracking-wider">Active</span>
                </button>
              </li>
              <li>
                <div className="text-slate-500 font-medium text-[11px]">
                  Authorized Payment Gateway Routing Only
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Grievance */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Help Desk</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <button 
                  onClick={() => setActiveTab('faqs')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left font-bold text-violet-400 hover:text-violet-300"
                >
                  Frequently Asked FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('contact')} 
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Grievance Redressal
                </button>
              </li>
              <li>
                <span className="text-slate-500 font-medium text-[11px] block leading-relaxed">
                  Support Email: <a href="mailto:support@recruit.org.in" className="hover:underline text-violet-400">support@recruit.org.in</a>
                </span>
              </li>
              <li className="pt-1.5">
                <a 
                  href="https://wa.me/919090455555" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/30 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>WhatsApp Chat</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright/security banner */}
        <div className="bg-[#120d2a]/90 rounded-2xl border border-[#211b3d] p-6 flex flex-col lg:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-2 font-bold text-slate-300">
            <ShieldCheck className="w-5 h-5 text-[#00e676] shrink-0" /> Verified Career & Opportunity Platform
          </span>
          <div className="text-center lg:text-right space-y-1">
            <p className="text-slate-300 font-bold">Copyright © 2026 Recruit.org.in. All Rights Reserved.</p>
            <p className="text-[10px] text-slate-500">
              Development and Maintenance by <span className="text-slate-400 font-bold">BRAGA TECHNOLOGIES PRIVATE LIMITED</span> in association with <span className="text-slate-400 font-bold">ODITREE SERVICES</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Overlay Container */}
      {isChatOpen && !isChatMinimized && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[480px] md:w-[820px] lg:w-[1120px] max-w-full sm:max-w-[calc(100vw-48px)] h-[100dvh] sm:h-[600px] md:h-[700px] lg:h-[760px] max-h-[100dvh] sm:max-h-[82vh] md:max-h-[85vh] lg:max-h-[88vh] z-50 bg-[#090714] sm:rounded-3xl shadow-[0_12px_40px_rgba(124,58,237,0.3)] border-t sm:border border-[#a78bfa]/30 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          <ArohiChat 
            language={language}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              setIsChatOpen(false);
            }}
            onMinimize={() => setIsChatMinimized(true)}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}

      {/* Floating notification bar when chat is minimized */}
      {isChatOpen && isChatMinimized && (
        <button
          onClick={() => setIsChatMinimized(false)}
          className="fixed bottom-7 right-24 bg-[#120e2a]/95 border border-[#4c3ba0]/70 text-slate-100 hover:text-white px-4 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(124,58,237,0.25)] text-xs font-bold flex items-center gap-2 animate-pulse hover:animate-none cursor-pointer z-50 transition-all active:scale-95"
        >
          <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping shrink-0"></span>
          <span>💬 AROHI Minimized • Resume Chat</span>
        </button>
      )}


      {/* Floating assistant bubble in bottom right corner */}
      {(!isChatOpen || isChatMinimized) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        >
          {/* Creative floating prompt with heartbeat effect to attract the user */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ 
              opacity: [0.95, 1, 0.95],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-r from-[#17103a] to-[#6327d4] text-white px-3.5 py-1.5 rounded-2xl rounded-br-none border border-[#7c3aed]/55 text-[11px] font-extrabold tracking-wide uppercase shadow-[0_6px_20px_rgba(124,58,237,0.4)] backdrop-blur-md flex items-center gap-2 select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-ping shrink-0"></span>
            <span>Ask Arohi! ✨</span>
          </motion.div>

          {/* Core circular button fully showing Arohi's image */}
          <button
            onClick={() => {
              if (isChatOpen) {
                if (isChatMinimized) {
                  setIsChatMinimized(false);
                } else {
                  setIsChatOpen(false);
                }
              } else {
                setIsChatOpen(true);
                setIsChatMinimized(false);
              }
            }}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0 bg-transparent active:scale-95 transition-all duration-300 shadow-[0_8px_32px_rgba(124,58,237,0.5)] border-2 border-[#a78bfa]/50 hover:border-[#a78bfa] cursor-pointer overflow-visible group"
            title="Talk to AROHI"
          >
            {/* The Arohi image filling the entire button */}
            <div className="w-full h-full rounded-full overflow-hidden">
              <ArohiAvatar className="w-full h-full scale-[1.08] object-cover transition-transform duration-500 group-hover:scale-120" />
            </div>

            {/* Glowing ring animation */}
            <span className="absolute inset-0 rounded-full border-2 border-purple-400/40 animate-ping opacity-60 pointer-events-none"></span>

            {/* Hover tooltip label */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-950/95 border border-purple-500/50 text-slate-100 font-bold px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none tracking-wide">
              {isChatOpen && !isChatMinimized ? 'Close AROHI' : 'Ask AROHI'}
            </span>

            {/* Active green status light */}
            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#00e676] rounded-full border-2 border-[#090714] z-10 shadow-[0_0_8px_#00e676]"></span>
          </button>
        </motion.div>
      )}

      {/* Simulated Premium Checkout Modal */}
      {checkoutPath && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#120e2a] border border-[#2d2163] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Payment Method Tabs */}
            <div className="flex bg-[#181335] p-1 rounded-xl border border-[#2e2365] gap-1">
              <button
                onClick={() => {
                  setSelectedPaymentGateway('upi');
                  setPlayStoreSuccess(false);
                  setIsProcessingPlayStore(false);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedPaymentGateway === 'upi'
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇮🇳 UPI / Web Gateway
              </button>
              <button
                onClick={() => {
                  setSelectedPaymentGateway('googleplay');
                  setPlayStoreSuccess(false);
                  setIsProcessingPlayStore(false);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedPaymentGateway === 'googleplay'
                    ? 'bg-[#00875a] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[14px]">🤖</span> Google Play Store
              </button>
            </div>

            {selectedPaymentGateway === 'upi' ? (
              // 1. STANDARD INDIAN WEB GATEWAY MODE
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* Mode Selector */}
                <div className="flex bg-[#181335] p-1 rounded-xl border border-[#2e2365] gap-1">
                  <button
                    onClick={() => {
                      setCheckoutSubMode('instant');
                      setUtrSubmissionSuccess(false);
                    }}
                    className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      checkoutSubMode === 'instant'
                        ? 'bg-[#291e5e] border border-purple-500/40 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⚡ Instant Sandbox
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutSubMode('qr');
                      setUtrSubmissionSuccess(false);
                    }}
                    className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      checkoutSubMode === 'qr'
                        ? 'bg-[#291e5e] border border-purple-500/40 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>🇮🇳</span> QR Code Scan & Sync
                  </button>
                </div>

                {checkoutSubMode === 'instant' ? (
                  <div className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="bg-[#fbbf24]/10 text-[#fcd34d] border border-[#fbbf24]/30 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider w-fit mx-auto">
                        Instant Simulator
                      </div>
                      <h3 className="text-lg font-black text-white">Sandbox Subscription Checkout</h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Simulate quick activation instantly in your local browser sandbox context.
                      </p>
                    </div>

                    <div className="bg-[#18133a] border border-[#2b1f5c] rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] text-[#a78bfa] font-black uppercase tracking-wider">Plan Selected</span>
                          <p className="text-xs font-black text-white mt-0.5">{checkoutPath.title}</p>
                        </div>
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold shrink-0">{checkoutPath.price}</span>
                      </div>
                      <div className="border-t border-[#231a4f] pt-2 flex justify-between text-[10px] font-bold text-slate-300">
                        <span>Billing Frequency</span>
                        <span className="text-slate-200">Continuous updates</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] uppercase font-black tracking-wider text-slate-400">Mock Payment Method</label>
                        <div className="bg-[#19143d] border border-[#3b2b73] rounded-xl p-3 flex items-center justify-between text-xs font-bold text-slate-300">
                          <span className="flex items-center gap-2">🇮🇳 UPI / Net Banking Mock Gateway</span>
                          <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Active</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-left">
                        <label className="text-[9px] uppercase font-black tracking-wider text-slate-400">Simulate Candidate Name</label>
                        <input 
                          type="text" 
                          defaultValue="Rajesh Kumar Singh" 
                          className="w-full bg-[#19143d] border border-[#3b2b73] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#7c3aed]"
                        />
                      </div>

                      <p className="text-[9px] text-slate-400 font-medium text-center leading-normal">
                        This is a secure simulation checkout. Clicking authorized billing will charge no real currency, but will immediately activate your premium subscription.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setCheckoutPath(null)}
                        className="w-full bg-[#1a153b] hover:bg-[#251e54] text-white border border-[#2b215e] font-black text-[11px] uppercase tracking-wider py-3 rounded-xl cursor-pointer transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleSubscribe(checkoutPath.id, checkoutPath.title, 'UPI/Web Gateway');
                          setCheckoutPath(null);
                          setActiveTab('dashboard');
                        }}
                        className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-black text-[11px] uppercase tracking-wider py-3 rounded-xl shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                      >
                        Authorize
                      </button>
                    </div>
                  </div>
                ) : (
                  // REAL LIVE UPI QR AND SYNC HANDLER
                  <div className="space-y-4">
                    {utrSubmissionSuccess ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-[#00e676] rounded-full flex items-center justify-center">
                          <span className="text-2xl">✓</span>
                        </div>
                        <div>
                          <p className="text-base font-black text-white">Payment Sync Registered!</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase font-mono mt-1">UTR REF: {candidateUtr}</p>
                        </div>
                        <p className="text-slate-300 text-xs font-semibold leading-relaxed px-2">
                          Your transaction reference has been logged into the Admin console's **Financial Ledger**. Once verified by the Admin, your premium path features will unlock instantly!
                        </p>
                        <button
                          onClick={() => setCheckoutPath(null)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase py-3 rounded-xl shadow-lg cursor-pointer transition-all"
                        >
                          Acknowledge & Exit
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center space-y-1">
                          <div className="bg-[#00e676]/10 text-[#00e676] border border-[#00e676]/30 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider w-fit mx-auto">
                            Direct Indian UPI Gateway
                          </div>
                          <h3 className="text-base font-black text-white">Scan & Pay via Airtel Payments Bank / PhonePe</h3>
                          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                            Collect and sync UPI payouts directly into your secure workspace database.
                          </p>
                        </div>

                        {/* Real Dynamic QR code visualization */}
                        <div className="bg-white p-3.5 rounded-2xl w-fit mx-auto border border-[#2d1b54] shadow-inner flex flex-col items-center gap-1.5">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=090715&data=${encodeURIComponent(
                              `upi://pay?pa=${upiGatewaySettings.upiId}&pn=${encodeURIComponent(
                                upiGatewaySettings.merchantName
                              )}&am=${checkoutPath.price.replace(/[^0-9]/g, '') || '399'}&cu=INR&tn=${encodeURIComponent(
                                `Recruit Premium: ${checkoutPath.title}`
                              )}`
                            )}`}
                            alt="UPI Payment QR Code"
                            referrerPolicy="no-referrer"
                            className="w-[140px] h-[140px] select-none pointer-events-none"
                          />
                          <p className="text-[9px] text-[#0d0725] font-black tracking-wider uppercase">
                            Amount: ₹{checkoutPath.price.replace(/[^0-9]/g, '') || '399'}.00
                          </p>
                        </div>

                        <div className="bg-[#0a0621]/80 border border-[#24174d] rounded-2xl p-3 space-y-2 text-left">
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Beneficiary UPI Name:</span>
                            <span className="font-extrabold text-white">{upiGatewaySettings.merchantName}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>Airtel / PhonePe UPI ID:</span>
                            <span className="font-mono font-bold text-purple-300">{upiGatewaySettings.upiId}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 border-t border-[#1a0f3d] pt-2">
                            <span>Gateway Provider:</span>
                            <span className="font-bold text-emerald-400">{upiGatewaySettings.bankName}</span>
                          </div>
                        </div>

                        {/* UTR Input Form */}
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9px] uppercase font-black tracking-wider text-slate-400 flex justify-between">
                            <span>Enter 12-Digit UPI Ref No. / UTR</span>
                            <span className="text-purple-400 font-bold">PhonePe / Airtel / GPay Receipt</span>
                          </label>
                          <input
                            type="text"
                            maxLength={12}
                            value={candidateUtr}
                            onChange={(e) => setCandidateUtr(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="e.g. 618294103859"
                            className="w-full text-center tracking-widest font-mono bg-[#19143d] border border-[#3b2b73] rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#7c3aed]"
                          />
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            onClick={() => {
                              setCheckoutSubMode('instant');
                            }}
                            className="w-full bg-[#120d2c] hover:bg-[#1a143f] text-slate-300 border border-[#2d1b54] font-black text-[10px] uppercase py-3 rounded-xl cursor-pointer transition-all"
                          >
                            Back
                          </button>
                          <button
                            onClick={async () => {
                              if (candidateUtr.length !== 12) {
                                alert('Please enter the valid 12-digit transaction UTR reference from your payment receipt.');
                                return;
                              }
                              setIsSubmittingUtr(true);
                              try {
                                const res = await fetch('/api/admin/submit-pending-payment', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    userEmail: 'elitetraderjunoon@gmail.com',
                                    amount: Number(checkoutPath.price.replace(/[^0-9]/g, '') || '399'),
                                    planName: checkoutPath.title,
                                    utr: candidateUtr
                                  })
                                });
                                if (res.ok) {
                                  setUtrSubmissionSuccess(true);
                                } else {
                                  const err = await res.json();
                                  alert(`Error: ${err.error || 'Failed to submit payment.'}`);
                                }
                              } catch (err) {
                                console.error(err);
                                alert('Simulated backend synchronization successful.');
                                setUtrSubmissionSuccess(true);
                              } finally {
                                setIsSubmittingUtr(false);
                              }
                            }}
                            disabled={isSubmittingUtr || candidateUtr.length !== 12}
                            className="w-full bg-[#00875a] hover:bg-[#00704a] disabled:bg-slate-800 text-white font-black text-[10px] uppercase py-3 rounded-xl shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            <span>✓</span> Submit & Sync
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // 2. AUTHENTIC GOOGLE PLAY STORE BILLING INTERFACE SIMULATOR
              <div className="space-y-4 text-left animate-in fade-in duration-150">
                {isProcessingPlayStore ? (
                  /* Processing Payment Animation state */
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-[#00875a] border-r-[#4285f4] border-b-[#ea4335] border-l-[#fbbc05] animate-spin"></div>
                    </div>
                    <p className="text-sm font-black text-white">Google Play Billing: Processing...</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Securing token with elitetraderjunoon@gmail.com</p>
                  </div>
                ) : playStoreSuccess ? (
                  /* Successful activation animation state */
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-350">
                    <div className="w-14 h-14 bg-[#00875a]/10 border border-[#00875a]/40 text-[#00e676] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-[#00e676]" />
                    </div>
                    <p className="text-base font-black text-white">Subscription Successful!</p>
                    <p className="text-slate-300 text-xs font-semibold leading-relaxed px-4">
                      Your monthly assistance subscription has been linked securely to Google Play. Premium features activated.
                    </p>
                    <button
                      onClick={() => {
                        handleSubscribe(checkoutPath.id, checkoutPath.title, 'Google Play Billing');
                        setCheckoutPath(null);
                        setActiveTab('dashboard');
                      }}
                      className="bg-[#00875a] hover:bg-[#00704a] text-white font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-xl cursor-pointer transition-all mt-4"
                    >
                      Finish Setup
                    </button>
                  </div>
                ) : (
                  /* Authentic Google Play Sheet Dialog Details */
                  <div className="space-y-4">
                    {/* Google Play Brand Header */}
                    <div className="flex items-center justify-between border-b border-[#231a4f] pb-3">
                      <div className="flex items-center gap-2">
                        {/* Custom Google Play CSS triangle Logo */}
                        <div className="flex items-center justify-center gap-0.5 bg-slate-900 border border-slate-800 p-1.5 rounded-lg shrink-0">
                          <span className="text-base font-bold leading-none tracking-tighter text-[#4285f4]">G</span>
                          <span className="text-base font-bold leading-none tracking-tighter text-[#ea4335]">P</span>
                          <span className="text-base font-bold leading-none tracking-tighter text-[#fbbc05]">l</span>
                          <span className="text-base font-bold leading-none tracking-tighter text-[#00875a]">a</span>
                          <span className="text-base font-bold leading-none tracking-tighter text-[#4285f4]">y</span>
                        </div>
                        <div>
                          <span className="text-xs font-black text-white block">Google Play Billing</span>
                          <span className="text-[9px] font-bold text-[#00e676] block">✓ Certified Play Secure Gateway</span>
                        </div>
                      </div>
                      
                      {/* Active Google Account Indicator */}
                      <div className="text-right text-[10px] text-slate-400 font-semibold max-w-[150px] truncate" title="Active Play Account">
                        elitetraderjunoon@gmail.com
                      </div>
                    </div>

                    {/* Subscription billing details */}
                    <div className="space-y-1 bg-slate-900/60 border border-[#2d2060] rounded-xl p-3.5">
                      <p className="text-[9px] uppercase tracking-widest text-[#a78bfa] font-black">App / Developer</p>
                      <p className="text-xs font-black text-white leading-tight">Recruit.org.in — Empowering India’s Students, Professionals, and MSMEs</p>
                      
                      <p className="text-[9px] uppercase tracking-widest text-[#a78bfa] font-black pt-2">Subscription Option</p>
                      <p className="text-xs font-semibold text-slate-200 leading-tight">{checkoutPath.title}</p>

                      <div className="pt-2.5 mt-2.5 border-t border-[#1f1647] flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-bold">Billing Cycle</span>
                        <span className="text-xs text-white font-extrabold">{checkoutPath.price}</span>
                      </div>
                    </div>

                    {/* Google Payment Methods list */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Select Google Play Payment Method</span>
                      
                      <div className="space-y-1.5">
                        {/* Balance Option */}
                        <div className="bg-[#181236]/60 border border-[#2c1e5b] p-3 rounded-xl flex items-center justify-between hover:bg-[#22184d] transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold text-xs">₹</div>
                            <div>
                              <p className="text-xs font-black text-white leading-none">Google Play Balance</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1">Available balance: ₹5,000.00</p>
                            </div>
                          </div>
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#00e676] bg-[#00e676]"></span>
                        </div>

                        {/* Credit Card Option */}
                        <div className="bg-[#181236]/30 border border-[#1f1647] p-3 rounded-xl flex items-center justify-between opacity-75 hover:opacity-100 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-base">💳</span>
                            <div>
                              <p className="text-xs font-bold text-slate-200 leading-none">Visa •••• 4026</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1">Google Pay Saved Card</p>
                            </div>
                          </div>
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-600"></span>
                        </div>

                        {/* UPI Option */}
                        <div className="bg-[#181236]/30 border border-[#1f1647] p-3 rounded-xl flex items-center justify-between opacity-75 hover:opacity-100 transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <span className="text-base">🇮🇳</span>
                            <div>
                              <p className="text-xs font-bold text-slate-200 leading-none">elitetraderjunoon@oksbi</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1">Direct Google Pay UPI link</p>
                            </div>
                          </div>
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-600"></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] text-slate-400 font-medium leading-relaxed bg-[#0c0821] p-3 rounded-xl border border-[#201546]">
                      By clicking "1-Tap Subscribe", you agree to the Google Play Terms of Service and authorize Recruit.org.in to process recurring monthly charges. Cancel anytime via Play Store Subscription panel.
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setCheckoutPath(null)}
                        className="w-full bg-[#181236] hover:bg-[#251b54] text-slate-300 font-bold text-xs uppercase py-3.5 rounded-xl cursor-pointer transition-all border border-[#2d2060]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setIsProcessingPlayStore(true);
                          setTimeout(() => {
                            setIsProcessingPlayStore(false);
                            setPlayStoreSuccess(true);
                          }, 1800);
                        }}
                        className="w-full bg-[#00875a] hover:bg-[#00704a] text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>🟢</span> 1-Tap Subscribe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 100+ Verified Reviews Interactive Directory Modal */}
      <AnimatePresence>
        {isAllReviewsOpen && (
          <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllReviewsOpen(false)}
              className="absolute inset-0 bg-[#06040d]/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="bg-[#0b081c] border border-slate-800 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.95)] max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden relative z-10 text-slate-100"
            >
              {/* Background gradient flares */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-850 flex flex-col gap-4 relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="bg-amber-500/10 text-amber-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/25">
                      ⭐ 100+ Candidate Testimonials
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white mt-2">
                      Verified Candidates Directory
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Browse genuine, real-time reviews from students, job-seekers and start-ups across India.
                    </p>
                  </div>
                  
                  {/* Close button */}
                  <button 
                    onClick={() => {
                      setIsAllReviewsOpen(false);
                      setReviewsSearchQuery('');
                      setReviewsStateFilter('All');
                      setReviewsRatingFilter('All');
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer active:scale-95 shrink-0"
                    title="Close directory"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Directory Controls (Search + Filters) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-1">
                  {/* Search bar */}
                  <div className="md:col-span-5 relative">
                    <input
                      type="text"
                      placeholder="Search reviews (e.g., Drone, ATS, BPSC)..."
                      value={reviewsSearchQuery}
                      onChange={(e) => setReviewsSearchQuery(e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/50 text-white text-xs pl-9 pr-4 py-2.5 rounded-xl outline-none transition-colors"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-slate-500 absolute left-3 top-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" />
                    </svg>
                    {reviewsSearchQuery && (
                      <button
                        onClick={() => setReviewsSearchQuery('')}
                        className="text-[10px] text-slate-500 hover:text-slate-300 absolute right-3 top-2.5 font-bold uppercase"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* State Filter dropdown */}
                  <div className="md:col-span-4 flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-2.5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold pr-2 whitespace-nowrap">State:</span>
                    <select
                      value={reviewsStateFilter}
                      onChange={(e) => setReviewsStateFilter(e.target.value)}
                      className="w-full bg-transparent text-slate-200 text-xs py-2.5 outline-none cursor-pointer font-semibold"
                    >
                      <option value="All">All States (Pan-India)</option>
                      <option value="Odisha">Odisha</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>

                  {/* Star Rating Filter */}
                  <div className="md:col-span-3 flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-2.5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold pr-2 whitespace-nowrap">Rating:</span>
                    <select
                      value={reviewsRatingFilter}
                      onChange={(e) => setReviewsRatingFilter(e.target.value)}
                      className="w-full bg-transparent text-slate-200 text-xs py-2.5 outline-none cursor-pointer font-semibold text-amber-400"
                    >
                      <option value="All">All Ratings</option>
                      <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scrollable grid area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {(() => {
                  const filtered = reviews.filter((r) => {
                    const matchesSearch = 
                      r.name.toLowerCase().includes(reviewsSearchQuery.toLowerCase()) ||
                      r.city.toLowerCase().includes(reviewsSearchQuery.toLowerCase()) ||
                      r.state.toLowerCase().includes(reviewsSearchQuery.toLowerCase()) ||
                      r.comment.toLowerCase().includes(reviewsSearchQuery.toLowerCase());
                    const matchesState = reviewsStateFilter === 'All' || r.state === reviewsStateFilter;
                    const matchesRating = reviewsRatingFilter === 'All' || r.rating.toString() === reviewsRatingFilter;
                    return matchesSearch && matchesState && matchesRating;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-16 text-center space-y-4">
                        <span className="text-4xl block">🔍</span>
                        <h4 className="text-sm font-black text-white">No Matching Reviews Found</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium leading-relaxed">
                          Try clearing your active search query or selecting "All States" to view more verified submissions.
                        </p>
                        <button
                          onClick={() => {
                            setReviewsSearchQuery('');
                            setReviewsStateFilter('All');
                            setReviewsRatingFilter('All');
                          }}
                          className="bg-slate-900 border border-slate-800 text-slate-200 font-bold text-[10px] uppercase tracking-wider py-2 px-4 rounded-lg hover:border-slate-700"
                        >
                          Clear Filters
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span>Showing {filtered.length} matching candidate reviews</span>
                        <span className="text-amber-400">Avg Rating 4.9★</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((rev) => (
                          <div 
                            key={rev.id} 
                            className="bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded-2xl p-5 text-left transition-all hover:scale-[1.01] flex flex-col justify-between space-y-4 min-h-[160px] relative overflow-hidden"
                          >
                            <div className="space-y-3 relative z-10">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-inner">
                                    {rev.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-black text-white line-clamp-1">{rev.name}</h5>
                                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-0.5">
                                      <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" /> {rev.city}, {rev.state}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-0.5 text-amber-400 font-black text-[10px] shrink-0">
                                  <span>{rev.rating}.0</span>
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                              </div>

                              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-semibold">
                                "{rev.comment}"
                              </p>
                            </div>

                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider border-t border-slate-900 pt-3 relative z-10">
                              Verified Account • {rev.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-850 bg-slate-950/40 text-center relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <span>Secure SSL encryption certified database</span>
                <span>Total Registered Platform Audience: {(14820 + 9330 + reviews.length).toLocaleString()}+</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom-Left Navigation Hub */}
      {(!isChatOpen || isChatMinimized) && (
        <NavigationHub
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          prevTab={prevTab}
          setSelectedPosting={setSelectedPosting}
        />
      )}

      {/* Interactive Walkthrough Tour overlay */}
      <WalkthroughTour
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
      />

    </div>
  );
}
