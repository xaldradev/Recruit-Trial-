import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  Volume2, 
  VolumeX, 
  Check, 
  ShieldCheck, 
  Calculator, 
  LineChart, 
  Tv, 
  Fingerprint, 
  Users, 
  HelpCircle, 
  Cpu, 
  Award, 
  Building2, 
  Network, 
  Search, 
  TrendingUp, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  CloudLightning,
  Workflow,
  Compass,
  DollarSign,
  Layers,
  Monitor,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  RotateCcw,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ArohiAvatar from './ArohiAvatar';

export default function FranchisePage() {
  // Navigation Tabs Scroll Synchronizer
  const [activeSection, setActiveSection] = useState('hero');
  
  // Interactive Arohi Chat States
  const [isArohiChatOpen, setIsArohiChatOpen] = useState(false);
  const [arohiVoiceEnabled, setArohiVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<Array<{sender: 'user' | 'arohi', text: string}>>([
    { sender: 'arohi', text: "Hello! I am AROHI, the AI Career & Opportunity Ecosystem Advisor. Interested in partnering with us to launch an Arohi Experience Center Network (AECN) franchise in your city? Ask me any questions about investment models, spaces, revenue, or setup!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isArohiTyping, setIsArohiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Franchise Model states
  const [selectedModel, setSelectedModel] = useState<'bronze' | 'silver' | 'gold' | 'master'>('gold');
  const [upgradeModeActive, setUpgradeModeActive] = useState(true);
  const [hoveredModel, setHoveredModel] = useState<'bronze' | 'silver' | 'gold' | 'master' | null>(null);

  // Revenue Calculator inputs & outputs
  const [dailyVisitors, setDailyVisitors] = useState(120);
  const [avgServiceValue, setAvgServiceValue] = useState(150); // in INR
  const [monthlyMemberships, setMonthlyMemberships] = useState(40);
  const [employerClients, setEmployerClients] = useState(15);

  const [estMonthlyRevenue, setEstMonthlyRevenue] = useState(0);
  const [estAnnualRevenue, setEstAnnualRevenue] = useState(0);

  // Calculate live revenue estimates
  useEffect(() => {
    // Visitor service fee (Daily fee * visitors * 25 days)
    const visitorRevenue = dailyVisitors * avgServiceValue * 25;
    // Membership revenue (₹999 per membership)
    const membershipRevenue = monthlyMemberships * 999;
    // Recruiter service retainer (₹4,999 per employer client)
    const recruiterRevenue = employerClients * 4999;
    
    // Skill development commission split + cyber services (~₹120 per visitor supplementary)
    const extraServices = dailyVisitors * 120 * 25;

    const totalMonthly = visitorRevenue + membershipRevenue + recruiterRevenue + extraServices;
    setEstMonthlyRevenue(Math.round(totalMonthly));
    setEstAnnualRevenue(Math.round(totalMonthly * 12));
  }, [dailyVisitors, avgServiceValue, monthlyMemberships, employerClients]);

  // Juggernaut OS Simulation Metrics
  const [simActiveUsers, setSimActiveUsers] = useState(412);
  const [simTodayRevenue, setSimTodayRevenue] = useState(48900);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  // Simulation log ticker
  useEffect(() => {
    const logs = [
      "⚡ FIDO2 Biometric Sync: 4 candidates enrolled at Delhi South center",
      "💰 Revenue Trigger: ATS Resume Scan credit sold to Mumbai West Hub",
      "🤖 Arohi Chat Session: Startup guidance initiated at Hyderabad East",
      "🎓 Course Enrolment: Skill Module 'Odisha Public Service Preps' active",
      "🏛️ Mudra Loan Match: MSME Eligibility score verified for Bengaluru Hub",
      "💼 Employer Hiring Alert: 12 vacancies created by Tata Motors Franchise partner",
    ];
    setSimLogs(logs);

    const interval = setInterval(() => {
      setSimActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      setSimTodayRevenue(prev => prev + Math.floor(Math.random() * 800) + 100);
      setSimLogs(prev => {
        const nextLog = logs[Math.floor(Math.random() * logs.length)];
        const withTimestamp = `[${new Date().toLocaleTimeString('en-IN')}] ${nextLog}`;
        return [withTimestamp, ...prev.slice(0, 4)];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Multi-step Application Form States
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    experience: '',
    currentBusiness: '',
    investmentCap: '₹10L - ₹20L',
    preferredCity: '',
    preferredState: '',
    proposedLocationSize: '',
    resumeOrProfileName: '',
    additionalNotes: ''
  });
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Experience Center clickable hotspots
  const [activeHotspot, setActiveHotspot] = useState<string>('reception');
  
  const hotspots = [
    {
      id: 'reception',
      name: 'Smart Reception & FIDO2 Verification',
      description: 'The smart gateway where visitors register, sync their National Career Registry profile using fast offline QR cards, or log in securely using Face ID and Touch ID passkeys.',
      amenities: ['FIDO2 Biometric scanner kiosk', 'National Registry ID Card Printer', 'AI Welcome Screen'],
      capacity: 'Up to 15 concurrent check-ins'
    },
    {
      id: 'conversation',
      name: 'AI Arohi Interactive Zone',
      description: 'Futuristic sound-insulated pods where candidates converse with AROHI in their local mother tongue for complete, real-time career maps, job alerts, and Mudra loan advice.',
      amenities: ['Interactive Holographic Arohi Pods', 'Directional Voice Transceivers', 'Multi-lingual local support'],
      capacity: '6 Sound-Proof Conversation Pods'
    },
    {
      id: 'resume',
      name: 'ATS Dynamic Resume Studio',
      description: 'Equipped with custom high-speed Juggernaut OS scanners that instantly review candidates paper resumes, convert them to verified digital formats, and rank ATS scores.',
      amenities: ['Instant scan visualizer', 'Resume Score thermal feedback', 'AI template formatting engines'],
      capacity: '4 Desktop review stations'
    },
    {
      id: 'interview',
      name: 'AI Video Mock Interview Studio',
      description: 'State-of-the-art camera studio with automated speech and visual sentiment trackers where job aspirants practice interviews and receive comprehensive scoring reports.',
      amenities: ['Studio lighting & High-definition cameras', 'Dynamic visual feedback prompts', 'Automated sentiment diagnostic log'],
      capacity: '3 Fully enclosed recording studios'
    },
    {
      id: 'business',
      name: 'MSME & Startup Guidance Bay',
      description: 'Dedicated business consultants corner where local micro-entrepreneurs qualify their business ideas and generate automated Mudra Loan eligibility reports.',
      amenities: ['MSME Registry Gateway access', 'Mudra Bank scheme evaluator', 'Interactive business canvas printers'],
      capacity: '2 Dedicated private meeting lounge zones'
    },
    {
      id: 'recruitment',
      name: 'Corporate Recruitment Lounge',
      description: 'Where local recruiters and small business owners review ATS-screened candidates, watch pre-recorded mock interviews, and hold instant physical hiring drives.',
      amenities: ['Recruitment smartboard', 'High-speed local candidate database matching', 'Physical interview tables'],
      capacity: 'Seats 12 executives comfortably'
    },
    {
      id: 'learning',
      name: 'Digital Learning & Examination Desk',
      description: 'A noise-controlled computer cluster where students study regional school syllabus content, take National Mock Examinations, and receive accredited skill certificates.',
      amenities: ['15 Secure high-speed student terminals', 'Local syllabus repository cached server', 'Certificates printing kiosk'],
      capacity: '15 Standard learning desks'
    }
  ];

  // FAQ Accordion (20 Q&As)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      q: "What is the Arohi Experience Center Network (AECN)?",
      a: "AECN is India's first tech-forward, franchise-driven AI physical network designed to bridge the gap between online career resources and local communities. Backed by Arohi.ai, these centers provide secure biometric registry, local language AI advisory, interview preparation, and business development services directly to job seekers and MSMEs."
    },
    {
      q: "What is Juggernaut OS?",
      a: "Juggernaut OS is our proprietary ERP and AI management platform. It powers all Experience Centers by handling customer check-ins, biometric registrations, resume scans, interview diagnostics, billing, membership logs, and center management analytics in one unified dashboard."
    },
    {
      q: "Who is Arohi, and how does she function in the franchise?",
      a: "Arohi is our highly advanced, multi-lingual AI career advisor. In your Experience Center, she acts as a virtual counselor helping candidates match jobs, prepare for exams, map out syllabi, and check loan eligibilities, which drastically reduces your overhead for counseling staff."
    },
    {
      q: "How much initial investment is required to buy an AECN franchise?",
      a: "We offer four distinct models to fit different capacities: Bronze (₹5 Lakhs), Silver (₹10 Lakhs), Gold (₹20 Lakhs), and Master Franchise (₹50 Lakhs)."
    },
    {
      q: "What are the primary space/property requirements?",
      a: "Depending on the model: Bronze requires 300 - 500 sq ft, Silver requires 600 - 1000 sq ft, Gold requires 1200 - 2000 sq ft, and Master Franchise requires 3000+ sq ft, located in a commercial market or high-traffic student area."
    },
    {
      q: "What are the primary revenue streams of an Experience Center?",
      a: "Revenue streams are highly diversified and include: 1) Career Registry & ID card printing, 2) Premium AI Resume score audits, 3) AI Mock Interview recordings, 4) Mudra Loan business planning services, 5) Recruitment fees from local employers, and 6) Premium offline/online study desk memberships."
    },
    {
      q: "Do I need prior experience in education or recruitment?",
      a: "No. AECN franchise owners receive comprehensive 360-degree training, site design blueprints, pre-configured Juggernaut OS hardware, and local launch marketing kits to make operations seamless from Day 1."
    },
    {
      q: "Is there an ongoing royalty fee?",
      a: "Yes, we charge a nominal 8% royalty on gross monthly billing to support continuous AI upgrades, centralized marketing, database servers, and regular technical maintenance."
    },
    {
      q: "How long does it take to fully launch an AECN center?",
      a: "Typically, the entire process takes 30 to 45 days from signing the franchise agreement to the official launching ceremony."
    },
    {
      q: "Is the franchise model officially registered with any government bodies?",
      a: "Yes, Arohi.ai and AECN operate in alignment with the National Education Policy (NEP) guidelines, MSME development initiatives, and Digital India standards."
    },
    {
      q: "What kind of local marketing support will I receive?",
      a: "We provide localized SEO marketing, geographic target ads, standard printing templates (hoardings, newspaper flyers), official grand opening campaigns, and listing on the central Arohi.ai map."
    },
    {
      q: "Can I manage multiple centers under a single dashboard?",
      a: "Yes! The Gold and Master franchise plans support multi-center Juggernaut OS dashboard management so you can monitor multiple locations from a single master account."
    },
    {
      q: "How does the FIDO2 Biometric system benefit the center?",
      a: "It provides a robust security layer and seamless login experience. Once candidates enroll their fingerprints or facial signatures at your center, they can log into any terminal or our online platform without passwords, creating high user trust."
    },
    {
      q: "What training programs are provided for my local staff?",
      a: "We conduct a 5-day intensive boot camp covering Juggernaut OS operations, basic computer hardware, resume scanning procedures, and premium client service standards."
    },
    {
      q: "How is billing handled? Does Juggernaut OS support digital payments?",
      a: "Juggernaut OS has built-in unified UPI, credit/debit card, and net banking payment gateways. All customer transactions are processed securely and credited to your franchise account instantly."
    },
    {
      q: "What is the typical return on investment (ROI) timeline?",
      a: "Most franchise partners achieve operational break-even within 3 to 6 months, and complete capital payback within 12 to 18 months, depending on location and local community engagement."
    },
    {
      q: "Is there a territory protection policy?",
      a: "Yes. Every Silver, Gold, and Master center is granted an exclusive geographic territory of 3 to 8 kilometers where we will not authorize any other franchise centers."
    },
    {
      q: "Can I transition my existing cyber café or training center to AECN?",
      a: "Absolutely! We have a specialized transition program with discounted setup costs for active computer centers, cyber cafés, and digital service kiosks."
    },
    {
      q: "Are the computer servers located locally or on the cloud?",
      a: "We use a hybrid cloud model. All student testing cached materials are held on local Juggernaut edge servers for offline speed, while candidate databases and AI models run on secured central cloud infrastructure."
    },
    {
      q: "How can I apply for an AECN Franchise?",
      a: "Simply fill out our 5-step interactive application form at the bottom of this page, and our National Partnership director will reach out to you within 24 hours."
    }
  ];

  // Gallery slider states
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const galleryItems = [
    {
      title: "Smart AI Pods Center",
      subtitle: "AECN Hyderabad - AI sound-insulated pods where candidates consult with Arohi.",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Premium Virtual Interview Studio",
      subtitle: "AECN Delhi South - Professional high-definition recording booths with automated speech diagnostics.",
      img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Secure Biometric Reception",
      subtitle: "AECN Bhubaneswar Hub - FIDO2 passkey registry and thermal resume print stations.",
      img: "https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "MSME Business Lounge",
      subtitle: "AECN Mumbai West - Meeting tables where local entrepreneurs draft Mudra Business Blueprints.",
      img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Accredited Student Learning Zone",
      subtitle: "AECN Bengaluru Central - Dynamic study cubicles with offline cached syllabus modules.",
      img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  // Smooth scroll handler
  const scrollToId = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Chat with Arohi Franchise Handler
  const handleArohiFranchiseChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsArohiTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);

    // Context-aware responses for franchise inquiry
    setTimeout(async () => {
      let reply = "";
      const query = userMsg.toLowerCase();

      if (query.includes('investment') || query.includes('cost') || query.includes('rupees') || query.includes('money') || query.includes('price')) {
        reply = `We support 4 franchise tiers for AROHI Experience Centers:\n\n1. **Bronze (₹5 Lakhs):** Suitable for tier-3 towns. Focuses on career registries and school syllabus cached workstations.\n2. **Silver (₹10 Lakhs):** Ideal for tier-2 districts. Includes ATS resume scanner, 2 AI pods and local study desks.\n3. **Gold (₹20 Lakhs):** Our standard city-model. Full suite with MSME loan advisory, automated interview studio, and 4 AI pods.\n4. **Master (₹50 Lakhs):** Divisional headquarters. Acts as the regional hub handling secondary centers, marketing splits, and direct recruiter premium portals.`;
      } else if (query.includes('revenue') || query.includes('earn') || query.includes('profit') || query.includes('salary') || query.includes('make')) {
        reply = `AECN centers have multiple robust revenue streams:\n\n• **Candidate Registrations:** ₹49 to ₹99 per digital registry and high-impact FIDO2 setup.\n• **ATS Resume Diagnostics:** ₹299 per verified resume score sheet.\n• **Interview practice recording:** ₹399 per visual recording session with AI metrics.\n• **Mudra Loan Blueprints:** ₹1,499 per bank-ready business proposal.\n• **Study Desk Membership:** ₹999/month for offline access to resources.\n• **Employer Hiring Events:** Direct retainer commissions from local MSMEs and retailers looking for candidates.`;
      } else if (query.includes('apply') || query.includes('join') || query.includes('partner') || query.includes('buy')) {
        reply = `To apply, simply scroll to our **Apply Now** section at the bottom of this page. You can fill out our interactive 5-step registration form. Once submitted, our National Partnership director will review your investment capacity and schedule an interview within 24 hours!`;
      } else if (query.includes('space') || query.includes('size') || query.includes('area') || query.includes('sq ft') || query.includes('location')) {
        reply = `The space requirements vary by model:\n\n• **Bronze:** 300 - 500 sq ft\n• **Silver:** 600 - 1000 sq ft\n• **Gold:** 1200 - 2000 sq ft\n• **Master:** 3000+ sq ft\n\nWe recommend properties on the ground or first floor in high-visibility student markets, near colleges, coaching institutes, or busy commercial hubs.`;
      } else {
        // Fallback to live API or simple smart response
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `You are answering questions as AROHI about the Arohi Experience Center Network (AECN) franchise opportunity. User asked: "${userMsg}". Answer concisely, in a professional, ultra-premium product launch tone, showcasing high ROI, advanced Juggernaut OS technology, and the 9-step path.`,
              history: []
            })
          });
          if (response.ok) {
            const data = await response.json();
            reply = data.response;
          } else {
            throw new Error();
          }
        } catch {
          reply = `I would love to help you build an Arohi Experience Center in your city. That request is directly analyzed! As India's fastest-growing AI career network, we provide you with all structural blueprints, Juggernaut OS hardware, biometric registers, and marketing toolkits. Would you like me to guide you to the investment details or the application form?`;
        }
      }

      setMessages(prev => [...prev, { sender: 'arohi', text: reply }]);
      setIsArohiTyping(false);
      
      // Scroll to bottom
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);

    }, 1500);
  };

  // Quick prompt click trigger
  const handleQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
    setTimeout(() => {
      const btn = document.getElementById('franchise-send-chat-btn');
      if (btn) btn.click();
    }, 50);
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingForm(true);
    setFormError(null);
    setFormSuccessMessage(null);

    // Validate inputs
    if (!formData.fullName || !formData.email || !formData.phone || !formData.preferredCity) {
      setFormError("Please fill in all mandatory fields (Name, Email, Phone, and Preferred City).");
      setIsSubmittingForm(false);
      return;
    }

    try {
      // Simulate real-time API sync and store to local storage
      const existingAppRaw = localStorage.getItem('recruit_franchise_applications');
      const existingApps = existingAppRaw ? JSON.parse(existingAppRaw) : [];
      
      const newApp = {
        id: 'AECN-' + Math.floor(Math.random() * 90000 + 10000),
        timestamp: new Date().toISOString(),
        status: 'Pending Review',
        ...formData
      };

      existingApps.push(newApp);
      localStorage.setItem('recruit_franchise_applications', JSON.stringify(existingApps));

      // Mock database delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setFormSuccessMessage(`🎉 Application Registered Successfully! Reference ID: ${newApp.id}. Our Regional Alliance Partner will call you on ${formData.phone} within 24 hours.`);
      setFormStep(6); // Success Step
    } catch (err) {
      setFormError("Something went wrong during submission. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const updateField = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-[#04010b] text-white font-sans antialiased selection:bg-purple-600 selection:text-white pb-20 relative overflow-hidden">
      
      {/* Decorative ambient background lights */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-900/15 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-1/4 left-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-2/3 right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* AECN Secondary Navigation Sticky bar */}
      <div className="sticky top-[80px] z-40 bg-[#080512]/90 backdrop-blur-xl border-b border-[#21184a] shadow-lg hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#a78bfa]">AROHI EXPERIENCE CENTER NETWORK (AECN)</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
            {[
              { id: 'hero', label: 'Overview' },
              { id: 'about', label: 'About AECN' },
              { id: 'meet-arohi', label: 'Meet Arohi' },
              { id: 'centers', label: 'Centers' },
              { id: 'models', label: 'Models' },
              { id: 'revenue', label: 'Revenue' },
              { id: 'juggernaut', label: 'Juggernaut OS' },
              { id: 'timeline', label: 'Journey' },
              { id: 'apply', label: 'Apply Now' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToId(item.id)}
                className={`px-3 py-1.5 rounded-full transition-all text-[11px] font-bold ${
                  activeSection === item.id 
                    ? 'bg-purple-600/20 text-[#c084fc] border border-purple-500/40' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center px-4 md:px-8 pt-12 md:pt-20 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text branding */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/40 to-violet-800/25 border border-purple-500/30 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(124,58,237,0.15)]">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#d8b4fe]">AROHI EXPERIENCE CENTER NETWORK (AECN)</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Own an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] via-[#e9d5ff] to-white">Arohi Experience Center</span>
              </h1>
              <p className="text-sm md:text-lg text-slate-300 font-medium max-w-2xl mx-auto lg:mx-0">
                Become a Franchise Partner in India's leading AI Career &amp; Opportunity Experience Network. Backed by <span className="text-purple-400 font-bold">Arohi.ai</span>, empowered by next-gen FIDO2 biometric registries, automated resume score tracking, and automated interactive career counselling.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center pt-2">
              <button 
                onClick={() => scrollToId('apply')}
                className="w-full sm:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-[0_10px_30px_rgba(124,58,237,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 border border-purple-400/30"
              >
                <span>APPLY FOR FRANCHISE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => {
                  alert("💾 Downloading official AECN Franchise Brochure PDF...\n(This is a mock blueprint download - successfully simulated)");
                }}
                className="w-full sm:w-auto px-6 py-4 bg-[#120e2a] hover:bg-[#1a143c] text-[#d8b4fe] border border-[#2d2163] rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-purple-400" />
                <span>Download Brochure</span>
              </button>

              <button 
                onClick={() => scrollToId('meet-arohi')}
                className="w-full sm:w-auto px-6 py-4 bg-transparent text-slate-300 hover:text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-800 hover:border-purple-500/50"
              >
                <Play className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
                <span>Watch Experience</span>
              </button>
            </div>

            {/* Quick trust highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1d1645] max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-black text-[#a78bfa]">₹5L+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Starting Investment</p>
              </div>
              <div className="text-center lg:text-left border-l border-[#1d1645] pl-4">
                <p className="text-2xl font-black text-white">40%+</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Illustrative ROI</p>
              </div>
              <div className="text-center lg:text-left border-l border-[#1d1645] pl-4">
                <p className="text-2xl font-black text-[#f472b6]">100%</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Tech OS Powered</p>
              </div>
            </div>
          </div>

          {/* Hero right: Futuristic AI City/Center representation */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden border border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.2)] bg-gradient-to-br from-[#120c33] to-[#04010b] flex flex-col items-center justify-center p-8 group">
              {/* Spinning background rings */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-purple-500/10 animate-spin duration-[20s] pointer-events-none"></div>
              <div className="absolute w-[360px] h-[360px] rounded-full border-dashed border-violet-500/10 animate-spin duration-[40s] pointer-events-none"></div>
              
              {/* Ambient purple light in the center */}
              <div className="absolute w-48 h-48 rounded-full bg-violet-600/20 blur-3xl pointer-events-none"></div>

              {/* Central mock hub graphic */}
              <div className="relative z-10 text-center space-y-6">
                <div className="w-24 h-24 mx-auto rounded-2xl bg-purple-600/10 border border-purple-400/40 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.3)] animate-pulse">
                  <Building2 className="w-12 h-12 text-[#a78bfa]" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">Futuristic Vision 2026</span>
                  <h3 className="text-xl font-extrabold text-white">AROHI HUB ARCHITECTURE</h3>
                  <p className="text-xs text-slate-400 max-w-[260px] mx-auto">India's first physical career network with integrated software &amp; localized AI bots.</p>
                </div>

                <div className="bg-[#05030f]/90 border border-[#2d2163] p-4 rounded-xl flex items-center gap-3 text-left">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#34d399] tracking-wider">Live System Sync</p>
                    <p className="text-xs text-slate-300 font-mono">1,482 candidates active now</p>
                  </div>
                </div>
              </div>

              {/* Floating micro indicators */}
              <div className="absolute top-8 left-8 bg-[#09061c]/80 border border-purple-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <Fingerprint className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[9px] font-black text-slate-300">FIDO2 SECURE</span>
              </div>
              <div className="absolute bottom-8 right-8 bg-[#09061c]/80 border border-purple-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                <Users className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[9px] font-black text-slate-300">NEP COMPLIANT</span>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Scroll to Explore AECN</span>
          <div className="w-5 h-8 border-2 border-slate-700 rounded-full flex justify-center p-1">
            <span className="w-1.5 h-1.5 bg-[#a78bfa] rounded-full animate-bounce"></span>
          </div>
        </div>
      </section>

      {/* ABOUT AECN */}
      <section id="about" className="py-24 border-t border-[#17113a] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">NATIONAL EMPOWERMENT MISSION</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">What is Arohi Experience Center?</h2>
            <p className="text-slate-300 font-medium">
              We are introducing a structural shift in career advisory. By establishing micro physical centers across every district of India, we provide localized software diagnostics and physical support for millions of job seekers.
            </p>
          </div>

          {/* Premium Infographic Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-[#110b2b] to-[#060410] border border-[#23174f] rounded-3xl p-8 hover:border-purple-500/40 transition-all group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/15 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-3">Our Mission</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                To establish 500+ Experience Centers across India by 2027, empowering local youth with real-time National Career Registry IDs, verified digital resume scores, and offline study desks.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#110b2b] to-[#060410] border border-[#23174f] rounded-3xl p-8 hover:border-purple-500/40 transition-all group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-pink-600/15 border border-pink-400/30 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-3">Our Vision</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                To automate basic career guidance via local-language AI bots (Arohi), reducing operating overheads for franchises while ensuring high quality counseling services in tier-2 and tier-3 towns.
              </p>
            </div>

            <div className="bg-gradient-to-b from-[#110b2b] to-[#060410] border border-[#23174f] rounded-3xl p-8 hover:border-purple-500/40 transition-all group shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-105 transition-transform">
                <Network className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white mb-3">National Expansion</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Supported by Arohi.ai's online cloud engine, franchise centers serve as physical local gateways for offline examinations, MSME business setup, and secure biometric passkey registers.
              </p>
            </div>
          </div>

          {/* Interactive National Infographic element */}
          <div className="bg-gradient-to-r from-[#0d0725] via-[#140a3b] to-[#0d0725] border border-[#291e5e] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[10px] bg-purple-600/35 text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full uppercase font-black tracking-widest">NEP Alignments</span>
              <h3 className="text-xl md:text-2xl font-black text-white leading-snug">Empowering Central Government &amp; MSME Registry Goals</h3>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                AECN centers are built in deep coordination with the Digital India roadmap, allowing local candidates to scan and sync qualifications with the National Career Registry, and helping small business owners qualify for national MSME incentives.
              </p>
            </div>

            <div className="flex gap-4 md:gap-8 shrink-0">
              <div className="bg-[#05030f]/60 p-6 rounded-2xl border border-purple-500/20 text-center min-w-[120px]">
                <span className="text-3xl font-black text-[#a78bfa] block">1.4L+</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-2">Registries Completed</span>
              </div>
              <div className="bg-[#05030f]/60 p-6 rounded-2xl border border-purple-500/20 text-center min-w-[120px]">
                <span className="text-3xl font-black text-white block">24 Hubs</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mt-2">Active Nationwide</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MEET AROHI */}
      <section id="meet-arohi" className="py-24 bg-[#070414] border-y border-[#1a123f] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">CONVERSE WITH THE SYSTEM</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Meet AROHI: Your Virtual Advisor</h2>
            <p className="text-slate-300 font-medium">
              Arohi is pre-programmed to act as a 24/7 dedicated advisor at Experience Centers. Test her out now below by chatting or asking franchise questions directly!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            
            {/* Left: Avatar representation */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#110c30] to-[#070414] border border-[#2c205e] rounded-3xl p-8 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-4">
                <span className="text-[9px] bg-[#22c55e]/15 text-[#4ade80] border border-[#22c55e]/30 px-2.5 py-1 rounded-full uppercase font-black tracking-wider inline-block">SYSTEM VOICE ONLINE</span>
                <h3 className="text-lg font-black text-white">AROHI Hologram Engine</h3>
                <p className="text-xs text-slate-400 max-w-[220px]">Real-time conversational support for local languages and technical diagnostics.</p>
              </div>

              {/* Glowing Interactive Avatar */}
              <div className="my-8">
                <ArohiAvatar className="w-32 h-32 mx-auto" />
                <div className="mt-4 flex justify-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>

              {/* Sound toggler */}
              <button 
                onClick={() => setArohiVoiceEnabled(!arohiVoiceEnabled)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  arohiVoiceEnabled 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-[#151131] text-slate-400 border border-slate-800'
                }`}
              >
                {arohiVoiceEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <span>{arohiVoiceEnabled ? "Voice Speech Enabled" : "Enable Voice Output"}</span>
              </button>
            </div>

            {/* Right: Integrated interactive Chat component */}
            <div className="lg:col-span-7 bg-[#0a071d] border border-[#2c205e] rounded-3xl overflow-hidden flex flex-col shadow-2xl min-h-[500px]">
              {/* Chat header */}
              <div className="bg-[#120a2e] border-b border-[#2d2163] px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-black text-slate-300 uppercase tracking-widest">AROHI PARTNERSHIP DIALOGUE</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400">c82bf65a_v1.0</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[340px] text-left">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex gap-3 items-start ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'arohi' && (
                      <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                    )}
                    <div className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed font-semibold ${
                      m.sender === 'user' 
                        ? 'bg-[#7c3aed] text-white rounded-tr-none' 
                        : 'bg-[#151133] text-slate-200 border border-[#2d2163] rounded-tl-none whitespace-pre-wrap'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                
                {isArohiTyping && (
                  <div className="flex gap-3 items-start justify-start">
                    <div className="h-8 w-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                    </div>
                    <div className="p-4 rounded-2xl bg-[#151133] border border-[#2d2163] rounded-tl-none text-xs text-slate-400 italic">
                      Arohi is preparing response...
                    </div>
                  </div>
                )}
                
                <div ref={chatBottomRef}></div>
              </div>

              {/* Suggested quick clicks */}
              <div className="px-6 py-2 bg-[#0d0a27] border-t border-[#1d1645] flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap py-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pr-1">Try asking:</span>
                {[
                  "What is the investment cost?",
                  "Explain the revenue streams",
                  "What are the space rules?",
                  "How do I apply?"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="bg-[#17123d] hover:bg-purple-600/35 border border-[#2e236b] hover:border-purple-500/50 text-slate-300 hover:text-white px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleArohiFranchiseChat} className="p-4 bg-[#110c30] border-t border-[#2d2163] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask Arohi about AECN Franchise metrics..."
                  className="flex-1 bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="submit"
                  id="franchise-send-chat-btn"
                  className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all shrink-0"
                >
                  <span>Send</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

            </div>

          </div>

        </div>
      </section>

      {/* EXPERIENCE CENTER HOTSPOT ILLUSTRATION */}
      <section id="centers" className="py-24 border-b border-[#18123c] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">INTERACTIVE BLUEPRINT</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Explore the Experience Center Layout</h2>
            <p className="text-slate-300 font-medium font-semibold">
              Click the hotspots below to tour the physical setup. Every Arohi Experience Center is structured with high-tech modular hubs for candidates and employers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Interactive Hotspot blueprint map */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#120a2e] to-[#04010b] border border-[#2d2163] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative min-h-[400px]">
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#05030f]/80 border border-purple-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase text-[#a78bfa] tracking-wider">
                <span>Interactive Floorplan View</span>
              </div>

              {/* Center Map representation with glowing markers */}
              <div className="flex-1 flex flex-col justify-center items-center py-10 relative">
                <div className="w-full max-w-[500px] aspect-[16/10] bg-[#070415]/80 rounded-2xl border border-purple-500/20 relative overflow-hidden p-6 shadow-inner flex flex-wrap gap-3 justify-center items-center">
                  
                  {/* Visual design of blueprint with connected paths */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e1548_1.5px,transparent_1.5px)] [background-size:16px_16px] opacity-35"></div>
                  
                  {hotspots.map((h, idx) => (
                    <button
                      key={h.id}
                      onClick={() => setActiveHotspot(h.id)}
                      className={`relative z-10 px-4 py-3 rounded-xl font-bold text-xs cursor-pointer border transition-all flex items-center gap-2 ${
                        activeHotspot === h.id 
                          ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_20px_rgba(124,58,237,0.5)]' 
                          : 'bg-[#120a2e]/80 text-slate-300 border-[#2b1f5e] hover:border-purple-500/50 hover:bg-[#1a0f3d]'
                      }`}
                    >
                      <span className="flex h-2 w-2 relative">
                        {activeHotspot === h.id && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${activeHotspot === h.id ? 'bg-white' : 'bg-purple-500'}`}></span>
                      </span>
                      <span>{idx + 1}. {h.name.split(' & ')[0].split('Interactive')[0].split(' Dynamic')[0].split(' Video')[0]}</span>
                    </button>
                  ))}

                </div>
              </div>

              {/* Sequence path indicator */}
              <div className="border-t border-[#1d1445] pt-4 mt-4 flex justify-between items-center flex-wrap gap-2 text-[11px] text-slate-400 font-bold">
                <span>Standard Candidate Path Sequence:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-purple-300">1. Reception</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-purple-300">2. AI Pod</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-purple-300">3. Resume Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-purple-300">4. Interview Studio</span>
                </div>
              </div>

            </div>

            {/* Right: Hotspot details readout panel */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#110b2d] to-[#080516] border border-[#2a1d5e] rounded-3xl p-8 flex flex-col justify-between shadow-2xl text-left">
              {(() => {
                const cur = hotspots.find(h => h.id === activeHotspot) || hotspots[0];
                return (
                  <div className="space-y-8 h-full flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="inline-flex items-center gap-2 bg-purple-500/10 text-[#c084fc] border border-purple-500/25 px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AECN Zone Details</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-white leading-tight">{cur.name}</h3>
                        <p className="text-xs text-slate-300 font-medium leading-relaxed">{cur.description}</p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-[#23174f]">
                        <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Technical Hardware &amp; Setup</h4>
                        <ul className="space-y-2">
                          {cur.amenities.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#05030f]/90 border border-[#23174f] p-4 rounded-2xl flex justify-between items-center mt-6">
                      <div>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Zone Flow Rate</span>
                        <span className="text-sm font-black text-white block">{cur.capacity}</span>
                      </div>
                      <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-full uppercase">verified</span>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* WHO CAN VISIT - Beautiful horizontal grid */}
          <div className="space-y-8 pt-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#a78bfa]">DEMOGRAPHIC MATCHES</span>
              <h3 className="text-xl md:text-2xl font-black text-white">Who Can Visit an Arohi Center?</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Students", count: "NEP Preps", icon: BookOpen },
                { label: "Freshers", count: "Entry Jobs", icon: Compass },
                { label: "Job Seekers", count: "Sarkari & Private", icon: Briefcase },
                { label: "Entrepreneurs", count: "MSME Setups", icon: TrendingUp },
                { label: "Employers", count: "Direct Hiring", icon: Users },
                { label: "Women Returning", count: "Reskill Hub", icon: RotateCcw }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0b081e] border border-[#21184a] p-5 rounded-2xl text-center hover:border-purple-500/40 transition-all shadow-lg group">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-purple-600/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-black text-white">{item.label}</h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">{item.count}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FRANCHISE MODELS & COMPARISON TABLE */}
      <section id="models" className="py-24 bg-[#05020c] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">INVESTMENT OPTIONS</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Choose Your Franchise Model</h2>
            <p className="text-slate-300 font-medium">
              We offer four flexible tiers to fit different towns, regional capacities, and investment levels. Select a model to preview details.
            </p>

            {/* Toggleable 'Upgrade' hover effect control */}
            <div className="pt-6 flex flex-col items-center justify-center sm:flex-row gap-4">
              <div className="flex items-center gap-3 bg-[#110b30] border border-[#3c258d]/50 px-4 py-2.5 rounded-full shadow-inner">
                <span className="text-xs font-bold text-slate-300">Upgrade Radar Mode</span>
                <button
                  type="button"
                  onClick={() => setUpgradeModeActive(!upgradeModeActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    upgradeModeActive ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      upgradeModeActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${upgradeModeActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/10 text-slate-400'}`}>
                  {upgradeModeActive ? 'Active' : 'Off'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold max-w-xs text-center sm:text-left leading-normal">
                {upgradeModeActive 
                  ? '✨ Hover cards to trigger live holographic upgrade highlights and additional premium benefits!' 
                  : 'Toggle active to view tiered investment step-up highlights.'}
              </p>
            </div>
          </div>

          {/* Interactive model selector cards with Framer Motion animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Visual connector lines to indicate progression path */}
            <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 -translate-y-1/2 -z-10" />

            {[
              { 
                id: 'bronze', 
                tier: 'Bronze Tier', 
                cost: '₹5L', 
                size: '300-500 sq ft', 
                location: 'Tier-3 Towns', 
                desc: 'Focuses on Candidate Registry & Syllabus caching',
                color: 'from-amber-700/30 via-amber-800/20 to-slate-950',
                borderColor: 'border-amber-600/30',
                badge: 'Entry-Level Kiosk',
                upgradeBenefits: {
                  title: "Bronze Foundations",
                  summary: "Best suited for tier-3 small towns. Establishes the initial career gateway.",
                  points: [
                    "Basic Candidate Register & Digital ID Card terminal.",
                    "Local Odia/CBSE school syllabus offline cached drive.",
                    "1 Active AI Assistant station with local desk seating."
                  ]
                }
              },
              { 
                id: 'silver', 
                tier: 'Silver Tier', 
                cost: '₹10L', 
                size: '600-1000 sq ft', 
                location: 'Tier-2 Cities', 
                desc: 'Adds resume reviews & silent study cubicles',
                color: 'from-slate-400/20 via-slate-500/10 to-slate-950',
                borderColor: 'border-slate-500/30',
                badge: '+100% Volume Bump',
                upgradeBenefits: {
                  title: "Upgrade from Bronze: What's New?",
                  summary: "Doubles student throughput and brings automation to standard resume checks.",
                  points: [
                    "Thermal ATS Resume Score diagnostic scanner printer.",
                    "Adds 2 physical Arohi Conversational AI counselor pods.",
                    "5-desk premium Silent Study Cubicle Zone membership setup."
                  ]
                }
              },
              { 
                id: 'gold', 
                tier: 'Gold Tier', 
                cost: '₹20L', 
                size: '1200-2000 sq ft', 
                location: 'Urban Hubs', 
                desc: 'Full conversational mock interview suite & Mudra desk',
                color: 'from-yellow-600/20 via-yellow-700/10 to-slate-950',
                borderColor: 'border-yellow-500/40',
                badge: 'Highest ROI Model',
                upgradeBenefits: {
                  title: "Upgrade from Silver: What's New?",
                  summary: "Transforms the franchise into a premium fully-automated recruitment studio.",
                  points: [
                    "Automated HD Video Mock-Interview studio with screen recording.",
                    "Dual-core Juggernaut OS server with 99.9% offline uptime.",
                    "Full MSME Mudra Loan business planning advisory kit."
                  ]
                }
              },
              { 
                id: 'master', 
                tier: 'Master Franchise', 
                cost: '₹50L', 
                size: '3000+ sq ft', 
                location: 'Divisional Cap', 
                desc: 'Oversees regional sub-centers & revenue splits',
                color: 'from-purple-600/30 via-pink-600/10 to-slate-950',
                borderColor: 'border-purple-500/50',
                badge: 'Divisional Authority',
                upgradeBenefits: {
                  title: "Upgrade from Gold: What's New?",
                  summary: "Gives you complete regional dominion and royalty cuts from satellite nodes.",
                  points: [
                    "5% Lifetime Royalty Commission split from all area sub-franchises.",
                    "Direct enterprise panel to sell premium recruiter placement packages.",
                    "Physical job-fair host rights & priority elite dispatch support."
                  ]
                }
              }
            ].map((m) => {
              const isSelected = selectedModel === m.id;
              const isHovered = hoveredModel === m.id;
              
              return (
                <div
                  key={m.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredModel(m.id as any)}
                  onMouseLeave={() => setHoveredModel(null)}
                >
                  <button
                    onClick={() => setSelectedModel(m.id as any)}
                    className={`w-full text-left p-6 rounded-3xl border transition-all flex flex-col justify-between cursor-pointer min-h-[290px] relative overflow-hidden shadow-2xl ${
                      isSelected 
                        ? 'bg-gradient-to-b from-[#1b1049] to-[#070415] border-purple-500 shadow-[0_0_40px_rgba(124,58,237,0.4)]' 
                        : 'bg-[#0b071e]/90 border-[#22184d] hover:border-purple-500/40 hover:bg-[#120b33]/90'
                    }`}
                  >
                    {/* Glowing active background gradients */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${m.color} opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none -z-10`} />
                    
                    <div className="space-y-4 w-full relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">{m.tier}</span>
                        {isSelected ? (
                          <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                          </span>
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2a1d5c]"></span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <h3 className="text-4xl font-black text-white tracking-tight">{m.cost}</h3>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Investment</span>
                        </div>
                        <span className="inline-block mt-2 text-[9px] font-black bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-full">
                          {m.badge}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-bold leading-normal">{m.desc}</p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-[#22184d] space-y-1.5 text-[10px] text-slate-400 uppercase font-black tracking-wider relative z-10">
                      <div className="flex justify-between items-center">
                        <span>Min Space:</span>
                        <span className="text-white font-bold">{m.size}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Target Region:</span>
                        <span className="text-white font-bold">{m.location}</span>
                      </div>
                    </div>
                  </button>

                  {/* HIGH-FIDELITY UPGRADE TOOLTIP OVERLAY ON HOVER */}
                  <AnimatePresence>
                    {upgradeModeActive && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-3 z-50 bg-[#0f0a2d] border-2 border-purple-500 rounded-2xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(124,58,237,0.25)] text-left"
                      >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10px] border-l-8 border-r-8 border-b-8 border-transparent border-b-purple-500" />
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 text-purple-300 font-black text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-purple-400 animate-spin duration-[4s]" />
                            <span>{m.upgradeBenefits.title}</span>
                          </div>
                          
                          <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                            {m.upgradeBenefits.summary}
                          </p>

                          <div className="space-y-2 pt-2 border-t border-purple-500/20">
                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest block">Premium Upgraded Value:</span>
                            {m.upgradeBenefits.points.map((p, pIdx) => (
                              <div key={pIdx} className="flex gap-2 items-start text-[10px] text-white">
                                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✦</span>
                                <span className="font-semibold leading-normal">{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Upgrade Animation visual checklist */}
          <div className="bg-[#0f0b27] border border-[#2d2163] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] bg-purple-500/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full uppercase font-black tracking-widest">Active Tier Unlocks</span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  {selectedModel} model benefits
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Below are the specific technological inclusions, edge servers, and support parameters unlocked at this level.
                </p>
                <button
                  onClick={() => scrollToId('apply')}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-wider cursor-pointer transition-all"
                >
                  <span>Select {selectedModel} model</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Juggernaut OS hardware unit", desc: "Pre-configured cloud router & secure terminal edge server." },
                  { label: "FIDO2 Biometric Scanner set", desc: "Allows instant offline/online keycard logins." },
                  { label: "Regional Syllabus Offline cache", desc: "Guarantees lag-free mock exams with Zero internet dependencies." },
                  { label: "Arohi conversational pods", desc: "Access the multi-lingual AI career advisor database." },
                  { label: "ATS Resume Scan Printer", desc: "Thermal feedback print stations for immediate hand-out reviews." },
                  { label: "Site Architectural Blueprint", desc: "Complete 3D layout guidelines and store exterior signboards." }
                ].map((item, idx) => {
                  // Hide some features on bronze/silver to simulate upgrade locks
                  const isLocked = (selectedModel === 'bronze' && idx > 2) || (selectedModel === 'silver' && idx > 4);
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl border transition-all ${
                        isLocked 
                          ? 'bg-slate-950/20 border-slate-900 opacity-30 select-none' 
                          : 'bg-[#0a071d] border-[#251b54]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black uppercase tracking-wider ${isLocked ? 'text-slate-500' : 'text-white'}`}>{item.label}</span>
                        {isLocked ? (
                          <span className="text-[9px] text-[#f43f5e] font-black uppercase">Requires Silver+</span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* REVENUE OPPORTUNITIES & LIVE REVENUE CALCULATOR */}
      <section id="revenue" className="py-24 border-t border-[#1d1645] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">FINANCIAL TRANSPARENCY</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Ecosystem Revenue Streams</h2>
            <p className="text-slate-300 font-medium font-semibold">
              Our franchise partners do not rely on just one source of income. We have engineered a multi-layered ecosystem spanning student, job-seeker, and corporate recruiter retainers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Connected Ecosystem Visual illustration */}
            <div className="lg:col-span-5 relative flex justify-center py-10 bg-[#09061c]/80 border border-[#2d2163] rounded-3xl p-8 shadow-2xl">
              <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
                
                {/* Center Node (Arohi / Tech OS) */}
                <div className="z-10 bg-[#7c3aed] text-white p-5 rounded-full border-4 border-[#09061c] shadow-[0_0_25px_rgba(124,58,237,0.8)] text-center w-24 h-24 flex flex-col justify-center items-center">
                  <Sparkles className="w-6 h-6 animate-spin duration-[8s]" />
                  <span className="text-[8px] font-black tracking-widest uppercase mt-1">AECN</span>
                </div>

                {/* Satellite Nodes representing revenue segments */}
                {[
                  { label: "Career Registry", top: "10%", left: "10%" },
                  { label: "ATS Score Reports", top: "10%", right: "10%" },
                  { label: "Mock Interviews", bottom: "10%", left: "10%" },
                  { label: "MSME Blueprints", bottom: "10%", right: "10%" },
                  { label: "Recruiter Retention", top: "50%", left: "-15px" },
                  { label: "Study Desk", top: "50%", right: "-15px" }
                ].map((node, idx) => (
                  <div 
                    key={idx}
                    style={{ top: node.top, left: node.left, right: node.right, bottom: node.bottom }}
                    className="absolute z-20 bg-[#120a2e] border border-[#3f2988] rounded-xl px-3 py-2 text-[10px] font-black text-purple-300 shadow-md flex items-center gap-1.5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{node.label}</span>
                  </div>
                ))}

                {/* Decorative background vectors linking satellites */}
                <div className="absolute inset-4 rounded-full border border-dashed border-purple-500/20 animate-spin duration-[30s]"></div>

              </div>
            </div>

            {/* Right: Live Interactive Revenue Calculator */}
            <div className="lg:col-span-7 bg-gradient-to-b from-[#110b2c] to-[#04010b] border border-[#2d2163] rounded-3xl p-8 md:p-10 shadow-2xl text-left space-y-8">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Live Revenue Calculator</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Inputs */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-300">
                      <span>Daily Visitors:</span>
                      <span className="text-purple-300">{dailyVisitors} visitors/day</span>
                    </div>
                    <input 
                      type="range" 
                      min="30" 
                      max="300" 
                      step="10"
                      value={dailyVisitors} 
                      onChange={(e) => setDailyVisitors(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-300">
                      <span>Average Ticket Value:</span>
                      <span className="text-purple-300">₹{avgServiceValue} per ticket</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="500" 
                      step="10"
                      value={avgServiceValue} 
                      onChange={(e) => setAvgServiceValue(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-300">
                      <span>Monthly Memberships Sold:</span>
                      <span className="text-purple-300">{monthlyMemberships} study passes</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="150" 
                      step="5"
                      value={monthlyMemberships} 
                      onChange={(e) => setMonthlyMemberships(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold text-slate-300">
                      <span>Recruiter Client Base:</span>
                      <span className="text-purple-300">{employerClients} local MSMEs</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" 
                      max="50" 
                      step="1"
                      value={employerClients} 
                      onChange={(e) => setEmployerClients(parseInt(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                  </div>
                </div>

                {/* Simulated Outputs Dashboard */}
                <div className="bg-[#05030f]/95 border border-[#23184a] rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <div className="space-y-4">
                    <span className="text-[9px] bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full uppercase font-black tracking-widest inline-block">Estimated Earnings</span>
                    
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Gross Estimate</span>
                      <span className="text-3xl font-black text-[#a78bfa]">₹{estMonthlyRevenue.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="space-y-1 border-t border-[#1d1445] pt-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Annual Gross Estimate</span>
                      <span className="text-3xl font-black text-white">₹{estAnnualRevenue.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-4 block">Calculations locked to 2026 guidelines</span>
                </div>

              </div>

              {/* Mandatory PRD disclaimer */}
              <div className="bg-[#0a071c] border border-purple-500/10 p-4 rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-[#c084fc] shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  "These are illustrative estimates only. Actual business performance depends on location, demand, pricing, operations, and other factors."
                </p>
              </div>

            </div>

          </div>

          {/* WHY INVEST SECTION */}
          <div className="space-y-8 pt-8">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#a78bfa]">PARTNERSHIP ADVANTAGES</span>
              <h3 className="text-xl md:text-2xl font-black text-white">Why Invest in an AECN Center?</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "AI Powered Advice", desc: "Arohi answers career & MSME queries directly, minimizing staff salaries.", icon: Cpu },
                { label: "National Brand Trust", desc: "Co-branded with Arohi.ai's online national database registry.", icon: Award },
                { label: "Multiple Income streams", desc: "6 dynamic channels targeting candidates, students, and employers.", icon: DollarSign },
                { label: "360-Degree Training", desc: "We handle site design layouts, edge installs, and local SEO campaigns.", icon: Workflow }
              ].map((item, idx) => (
                <div key={idx} className="bg-gradient-to-b from-[#110b2b] to-[#04010b] border border-[#23174f] p-6 rounded-2xl text-left hover:border-purple-500/40 transition-all shadow-xl">
                  <item.icon className="w-8 h-8 text-[#a78bfa] mb-4" />
                  <h4 className="text-sm font-black text-white mb-2">{item.label}</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* JUGGERNAUT OS INTERACTIVE DASHBOARD */}
      <section id="juggernaut" className="py-24 bg-[#070414] border-t border-[#1d1645] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">OPERATING SYSTEM ENGINE</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Powered by Juggernaut OS</h2>
            <p className="text-slate-300 font-medium font-semibold">
              Juggernaut OS is our master dashboard installed in every Experience Center. It manages billing, active student mock mockups, diagnostic scans, and FIDO2 logs.
            </p>
          </div>

          <div className="bg-[#0f0b27] border border-[#2d2163] rounded-3xl overflow-hidden shadow-2xl relative">
            
            {/* Top titlebar */}
            <div className="bg-[#120a2e] px-6 py-4 border-b border-[#2d2163] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#f43f5e]"></span>
                <span className="h-3 w-3 rounded-full bg-[#eab308]"></span>
                <span className="h-3 w-3 rounded-full bg-[#22c55e]"></span>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest ml-2">Juggernaut OS Franchise Console</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono text-purple-400 font-bold">
                <span className="bg-purple-600/20 border border-purple-500/30 px-3 py-1 rounded-full uppercase">FRANCHISE SYSTEM: CONNECTED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Sidebar list representing modules */}
              <div className="lg:col-span-3 border-r border-[#2d2163] bg-[#0c0821]/60 p-4 space-y-1 text-left">
                {[
                  { label: "Customer Registry", count: "FIDO2 Enrolled" },
                  { label: "Revenue Analytics", count: "Direct Settlements" },
                  { label: "ATS Diagnostic scans", count: "48 Reviewed" },
                  { label: "Billing & Receipts", count: "Terminals Online" },
                  { label: "Arohi AI Logs", count: "14 Convs Today" },
                  { label: "Offline Desk Manager", count: "12 Desks Booked" },
                  { label: "Mock Interview Review", count: "Video Audio Logs" }
                ].map((mod, idx) => (
                  <button 
                    key={idx}
                    className={`w-full text-left p-3 rounded-xl transition-all flex justify-between items-center cursor-pointer ${
                      idx === 1 
                        ? 'bg-purple-600/15 text-[#a78bfa] border border-purple-500/30 font-bold' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">{mod.label}</p>
                      <p className="text-[9px] text-slate-500 font-bold">{mod.count}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>

              {/* Main OS screen showing telemetry, simulated logs, stats */}
              <div className="lg:col-span-9 p-8 space-y-8 text-left bg-[#050311]">
                
                {/* Stats rows */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-[#120a2e]/60 border border-[#2d2163] p-5 rounded-2xl">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Active Users at Center</span>
                    <span className="text-2xl font-black text-purple-400 block mt-1">{simActiveUsers} candidates</span>
                    <span className="text-[9px] text-slate-400 block mt-1">Live from secure FIDO2 logs</span>
                  </div>

                  <div className="bg-[#120a2e]/60 border border-[#2d2163] p-5 rounded-2xl">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Simulated Daily Sales</span>
                    <span className="text-2xl font-black text-white block mt-1">₹{simTodayRevenue.toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-400 block mt-1">Calculated via edge receipts</span>
                  </div>

                  <div className="bg-[#120a2e]/60 border border-[#2d2163] p-5 rounded-2xl">
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Terminal Health Status</span>
                    <span className="text-2xl font-black text-emerald-400 block mt-1">100% ONLINE</span>
                    <span className="text-[9px] text-slate-400 block mt-1">Syllabus Cache fully updated</span>
                  </div>
                </div>

                {/* Simulated live logs terminal style */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Live System Telemetry Feed (Juggernaut OS)</span>
                    <span className="text-[9px] font-mono text-slate-500">Auto-refresh active</span>
                  </div>
                  
                  <div className="bg-black/80 border border-[#23184a] p-5 rounded-2xl font-mono text-[10px] text-purple-300 space-y-2 h-44 overflow-y-auto">
                    {simLogs.map((log, idx) => (
                      <p key={idx} className="leading-relaxed border-l-2 border-purple-500 pl-3">
                        {log}
                      </p>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 9-STEP JOURNEY */}
      <section id="timeline" className="py-24 border-t border-[#1d1645] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">ROADMAP TO LAUNCH</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Your 9-Step Franchise Journey</h2>
            <p className="text-slate-300 font-medium font-semibold">
              We guide you step-by-step from initial inquiry to the official grand opening of your local Experience Center.
            </p>
          </div>

          {/* Elegant Horizontal/Vertical Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-4 text-left relative">
            {[
              { step: "01", title: "Apply Online", desc: "Submit your business and investment metrics using our 5-step form." },
              { step: "02", title: "Discussion", desc: "Discuss territorial rights with our central partnership director." },
              { step: "03", title: "Approval", desc: "Verification of site feasibility, region and financial documents." },
              { step: "04", title: "Agreement", desc: "Signing the official AECN partnership deed & territory locks." },
              { step: "05", title: "Location Setup", desc: "We share structural layouts, design blue prints and branding kits." },
              { step: "06", title: "Integration", desc: "Installing Juggernaut OS routers, biometric terminals & cache server." },
              { step: "07", title: "Staff Training", desc: "5-day intensive bootcamp covering Juggernaut OS operations." },
              { step: "08", title: "Grand Launch", desc: "Grand local launch with localized SEO & regional Target Ads." },
              { step: "09", title: "Continuous Support", desc: "Daily software syncs, marketing assets, and regular updates." }
            ].map((j, idx) => (
              <div key={idx} className="bg-gradient-to-b from-[#110b2b] to-[#04010b] border border-[#23174f] rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/50 transition-all flex flex-col justify-between min-h-[160px]">
                <div className="absolute top-2 right-2 text-2xl font-black text-purple-900/40 select-none">{j.step}</div>
                <div className="space-y-2 relative z-10">
                  <h4 className="text-xs font-black text-[#c084fc] uppercase tracking-wide">{idx + 1}. {j.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{j.desc}</p>
                </div>
                <span className="text-[9px] font-mono text-purple-700 font-bold uppercase mt-4 block">AECN PROGRESSION</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* INDIA NETWORK & MAP */}
      <section className="py-24 border-t border-[#1d1645] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">NATIONWIDE FOOTPRINT</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Active &amp; Future Locations</h2>
            <p className="text-slate-300 font-medium font-semibold">
              Explore where Arohi Experience Center Networks are expanding. Secure your city's exclusive territorial rights before other partners apply.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Simulated glowing map container */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#120a2e] to-[#04010b] border border-[#2d2163] rounded-3xl p-8 shadow-2xl relative flex flex-col justify-between min-h-[380px]">
              
              {/* Central Map Illustration with Glowing Points */}
              <div className="flex-1 flex flex-col justify-center items-center py-10 text-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(#1e1548_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-35"></div>
                
                {/* Simulated India Map Layout using connected CSS nodes */}
                <div className="w-full max-w-[400px] aspect-[4/5] bg-purple-950/10 border border-[#2d2163] rounded-3xl relative overflow-hidden flex flex-col justify-center items-center p-6">
                  
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#a78bfa] mb-4">India AECN Cluster Map</span>
                  
                  {/* Glowing city coordinates */}
                  <div className="relative w-full h-[250px] border border-purple-500/10 rounded-2xl flex justify-center items-center">
                    
                    {/* India Outline Mockup text indicator */}
                    <div className="text-center space-y-1 opacity-20 select-none pointer-events-none">
                      <p className="text-xs font-mono font-black text-slate-300 uppercase">MAP GRID ONLINE</p>
                      <p className="text-[10px] font-mono text-slate-500">LAT / LNG VERIFIED</p>
                    </div>

                    {[
                      { name: "Delhi", top: "25%", left: "40%", status: "Active" },
                      { name: "Bhubaneswar", top: "55%", left: "65%", status: "Active" },
                      { name: "Mumbai", top: "60%", left: "25%", status: "Active" },
                      { name: "Hyderabad", top: "65%", left: "45%", status: "Expansion" },
                      { name: "Bengaluru", top: "78%", left: "40%", status: "Expansion" },
                      { name: "Chennai", top: "80%", left: "55%", status: "Expansion" },
                      { name: "Kolkata", top: "45%", left: "75%", status: "Expansion" }
                    ].map((city, idx) => (
                      <div 
                        key={idx}
                        style={{ top: city.top, left: city.left }}
                        className="absolute flex flex-col items-center group cursor-pointer z-20"
                      >
                        <span className="flex h-3.5 w-3.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-600 border border-white"></span>
                        </span>
                        <div className="absolute top-4 bg-[#0a071c] border border-purple-500/30 rounded px-2 py-0.5 whitespace-nowrap text-[8px] font-black text-slate-200 uppercase tracking-wider group-hover:scale-105 transition-all">
                          {city.name}
                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              </div>

              <div className="border-t border-[#23184a] pt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Total Active Tiers: 24 Hubs</span>
                <span>Exclusive expansion active</span>
              </div>

            </div>

            {/* Right: City Details layout */}
            <div className="lg:col-span-5 bg-gradient-to-b from-[#110b2d] to-[#04010b] border border-[#2d2163] rounded-3xl p-8 flex flex-col justify-between shadow-2xl text-left">
              <div className="space-y-6">
                <span className="text-[10px] bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full uppercase font-black tracking-widest inline-block">Active Regional Hubs</span>
                
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Experience Clusters</h3>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Below are the central districts slated for master franchise authorization. Contact us to reserve neighboring district branches.
                </p>

                <div className="space-y-3 pt-4 border-t border-[#1d1544]">
                  {[
                    { city: "Bhubaneswar Hub", state: "Odisha - Master center fully active" },
                    { city: "Delhi South Hub", state: "Delhi NCR - 4 satellite branches active" },
                    { city: "Mumbai West Hub", state: "Maharashtra - Regional registry active" },
                    { city: "Hyderabad East Hub", state: "Telangana - Arohi conversation trials online" },
                    { city: "Bengaluru Central", state: "Karnataka - Mudra consultant desk setup complete" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#0a071d] border border-[#23174e] rounded-xl hover:border-purple-500/30 transition-all">
                      <div>
                        <span className="text-xs font-black text-white block">{item.city}</span>
                        <span className="text-[10px] text-slate-400 font-medium block">{item.state}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-purple-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => scrollToId('apply')}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 text-xs font-black uppercase tracking-wider transition-all mt-6 cursor-pointer text-center"
              >
                Reserve Your City Exclusive Right
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* GALLERY / SPACE SLIDER */}
      <section className="py-24 border-t border-[#1d1645] relative z-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">VISUAL INSPIRATION</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Experience Center Gallery</h2>
            <p className="text-slate-300 font-medium font-semibold">
              Take a physical look at our fully operating smart centers. Every AECN branch is customized with glass partitions, purple accent lighting, and premium hardware.
            </p>
          </div>

          {/* Immersive gallery block with carousel control */}
          <div className="max-w-5xl mx-auto space-y-8 text-left">
            <div className="bg-[#0f0b27] border border-[#2d2163] rounded-3xl overflow-hidden shadow-2xl relative">
              <img 
                src={galleryItems[activeGalleryIndex].img} 
                alt={galleryItems[activeGalleryIndex].title} 
                className="w-full h-[400px] object-cover opacity-80"
              />
              
              {/* Title & description overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 space-y-2">
                <span className="text-[10px] bg-purple-600 text-white px-2.5 py-1 rounded-full uppercase font-black tracking-wider inline-block">AECN PHOTO RECORD</span>
                <h3 className="text-xl font-black text-white">{galleryItems[activeGalleryIndex].title}</h3>
                <p className="text-xs text-slate-300 font-medium">{galleryItems[activeGalleryIndex].subtitle}</p>
              </div>
            </div>

            {/* Slider controls indicators */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">
                Photo {activeGalleryIndex + 1} of {galleryItems.length}
              </span>
              <div className="flex gap-2">
                {galleryItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      activeGalleryIndex === idx ? 'w-8 bg-purple-500' : 'w-2.5 bg-slate-800'
                    }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ ACCORDION SECTION (20 questions as requested) */}
      <section className="py-24 border-t border-[#1d1645] relative z-10 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-16 text-left">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">KNOWLEDGE BASE</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white text-center">Frequently Asked Questions</h2>
            <p className="text-slate-300 font-medium text-center">
              Have questions about investments, Juggernaut OS hardware, or licensing agreements? Review our detailed answers below.
            </p>
          </div>

          <div className="space-y-4 pt-8">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#0f0b27]/60 border border-[#2d2163] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left cursor-pointer hover:bg-purple-950/20"
                >
                  <span className="text-xs md:text-sm font-black text-white leading-tight pr-4">{idx + 1}. {faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                
                {openFaqIndex === idx && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#1d1445] text-xs text-slate-300 leading-relaxed font-semibold">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* APPLY NOW MULTI-STEP FORM */}
      <section id="apply" className="py-24 border-t border-[#1a133f] bg-gradient-to-b from-[#05030f] to-[#04010b] relative z-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-left bg-[#0c0823] border border-[#2d2163] rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-6 mb-10 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#a78bfa]">EXCLUSIVE FRANCHISE APPLICATION</span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Become an AECN Partner</h2>
            <p className="text-xs text-slate-400 font-medium max-w-xl mx-auto">
              Please complete our 5-step interactive application form. Our regional coordination alliance partner will call you to lock territorial rights.
            </p>

            {/* Sleek progress bar */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-wider">
                <span>Step {formStep} of 5</span>
                <span>{formStep === 1 ? "Personal Info" : formStep === 2 ? "Business Profile" : formStep === 3 ? "Investment Scale" : formStep === 4 ? "Preferred Region" : formStep === 5 ? "Submit Docs" : "Success"}</span>
              </div>
              <div className="w-full h-1.5 bg-[#05030f] rounded-full overflow-hidden">
                <div 
                  className="bg-purple-600 h-full transition-all duration-350" 
                  style={{ width: `${(formStep / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {formError && (
            <div className="bg-[#f43f5e]/10 border border-[#f43f5e]/30 text-[#f43f5e] p-4 rounded-xl text-xs font-bold flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            
            {/* STEP 1: Personal Info */}
            {formStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Full Legal Name *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Active Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Mobile Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Business Profile */}
            {formStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Company or Enterprise Name</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="Optional company name"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Years of Business/Management Experience *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.experience}
                    onChange={(e) => updateField('experience', e.target.value)}
                    placeholder="e.g., 5 years in educational retail"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Current Business or Profession *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.currentBusiness}
                    onChange={(e) => updateField('currentBusiness', e.target.value)}
                    placeholder="e.g., Cyber Café Owner / Educational Consultant"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Investment Scale */}
            {formStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300 text-left">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Select Investment Capacity *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "₹5L - ₹10L (Bronze Model Eligible)",
                    "₹10L - ₹20L (Silver/Gold Eligible)",
                    "₹20L - ₹50L (Gold Model/Regional Hub)",
                    "₹50L+ (Master Franchise Scale)"
                  ].map((cap, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateField('investmentCap', cap)}
                      className={`p-4 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                        formData.investmentCap === cap 
                          ? 'bg-purple-600/15 border-purple-500 text-[#c084fc] font-black shadow-lg' 
                          : 'bg-[#05030f] border-[#2d2163] text-slate-300 hover:border-purple-500/30'
                      }`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Preferred Region */}
            {formStep === 4 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Target City/District *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.preferredCity}
                    onChange={(e) => updateField('preferredCity', e.target.value)}
                    placeholder="e.g., Bhubaneswar or Patna"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Target State *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.preferredState}
                    onChange={(e) => updateField('preferredState', e.target.value)}
                    placeholder="e.g., Odisha or Bihar"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Proposed Commercial Property Size (sq ft)</label>
                  <input 
                    type="text" 
                    value={formData.proposedLocationSize}
                    onChange={(e) => updateField('proposedLocationSize', e.target.value)}
                    placeholder="e.g., 1200 sq ft"
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Submit Docs */}
            {formStep === 5 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Upload Business Profile or ID Proof</label>
                  <div className="border-2 border-dashed border-[#2d2163] hover:border-purple-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#05030f]">
                    <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-300">Drag &amp; drop or click to upload PDF/JPEG</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase font-black">Max size 5MB</p>
                    <input 
                      type="file" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateField('resumeOrProfileName', file.name);
                        }
                      }}
                      className="hidden" 
                      id="franchise-doc-upload" 
                    />
                    <label htmlFor="franchise-doc-upload" className="inline-block mt-4 bg-[#110c30] hover:bg-[#1a1348] text-purple-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all">
                      Select File
                    </label>
                    {formData.resumeOrProfileName && (
                      <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-3">✓ {formData.resumeOrProfileName} selected</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">Additional Notes / Territorial Demands</label>
                  <textarea 
                    value={formData.additionalNotes}
                    onChange={(e) => updateField('additionalNotes', e.target.value)}
                    rows={3}
                    placeholder="Enter any specific questions or geographic requests..."
                    className="w-full bg-[#05030f] border border-[#2d2163] rounded-xl px-4 py-3 text-xs font-semibold text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Success Step */}
            {formStep === 6 && formSuccessMessage && (
              <div className="text-center py-10 space-y-6 animate-in scale-in duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Deed Request Registered</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-md mx-auto">
                    {formSuccessMessage}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormStep(1);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      companyName: '',
                      experience: '',
                      currentBusiness: '',
                      investmentCap: '₹10L - ₹20L',
                      preferredCity: '',
                      preferredState: '',
                      proposedLocationSize: '',
                      resumeOrProfileName: '',
                      additionalNotes: ''
                    });
                    setFormSuccessMessage(null);
                  }}
                  className="bg-[#110c30] hover:bg-purple-600 text-[#a78bfa] hover:text-white border border-purple-500/25 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Apply for Another Location
                </button>
              </div>
            )}

            {/* Navigation Buttons inside application form */}
            {formStep < 6 && (
              <div className="flex justify-between items-center pt-6 border-t border-[#23174f] mt-8">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setFormStep(prev => prev - 1)}
                    className="bg-transparent hover:bg-white/5 text-slate-300 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-slate-800"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {formStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Simple step checks
                      if (formStep === 1 && (!formData.fullName || !formData.email || !formData.phone)) {
                        setFormError("Please fill in Name, Email and Phone to proceed.");
                        return;
                      }
                      if (formStep === 2 && (!formData.experience || !formData.currentBusiness)) {
                        setFormError("Please explain your experience and current business profession.");
                        return;
                      }
                      setFormError(null);
                      setFormStep(prev => prev + 1);
                    }}
                    className="bg-[#17113e] hover:bg-[#251b63] text-[#c084fc] hover:text-white border border-[#3c2980]/50 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next step</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-950 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/30"
                  >
                    {isSubmittingForm ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>REGISTERING DEED...</span>
                      </>
                    ) : (
                      <>
                        <span>SUBMIT PROPOSAL</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

          </form>

        </div>
      </section>

      {/* FLOATING AI AROHI AVATAR SHORTCUT & DIALOG */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Animated Popover Message */}
        <AnimatePresence>
          {isArohiChatOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              className="bg-[#0e0a29] border border-[#3c2980] rounded-2xl w-[320px] max-w-sm shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#150e38] border-b border-[#2d2163] px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">AECN Franchise AI</span>
                </div>
                <button 
                  onClick={() => setIsArohiChatOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages brief */}
              <div className="p-4 max-h-[220px] overflow-y-auto space-y-3 text-left">
                {messages.slice(-2).map((m, idx) => (
                  <div key={idx} className={`space-y-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">{m.sender === 'user' ? "You" : "Arohi AI"}</span>
                    <p className={`p-2.5 rounded-xl text-[11px] leading-relaxed font-semibold inline-block ${
                      m.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-[#1b1548] text-slate-200 rounded-tl-none'
                    }`}>
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Mini quick form */}
              <form 
                onSubmit={handleArohiFranchiseChat}
                className="p-3 bg-[#110c30] border-t border-[#2d2163] flex gap-1.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about AECN setup cost..."
                  className="flex-1 bg-[#05030f] border border-[#2d2163] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white placeholder-slate-600 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider hover:bg-purple-500"
                >
                  Ask
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating trigger avatar circle button */}
        <button
          onClick={() => setIsArohiChatOpen(!isArohiChatOpen)}
          className="pointer-events-auto h-14 w-14 rounded-full bg-gradient-to-tr from-purple-600 to-violet-500 border border-purple-400/50 hover:scale-105 transition-transform flex items-center justify-center text-white shadow-[0_10px_30px_rgba(124,58,237,0.5)] cursor-pointer"
          title="Talk with Arohi AI Franchise assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>

      </div>

    </div>
  );
}
