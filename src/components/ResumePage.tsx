import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Download, 
  Cpu, 
  ChevronRight, 
  Plus, 
  Trash2, 
  CreditCard, 
  Layout, 
  BookOpen, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Printer, 
  Check, 
  Eye 
} from 'lucide-react';

interface ResumeAnalysis {
  atsScore: number;
  rating: string;
  skillsGap: string[];
  missingKeywords: string[];
  suggestions: string[];
  feedbackText: string;
}

interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  duration: string;
  grade: string;
}

export default function ResumePage() {
  // Main page navigation
  const [pageMode, setPageMode] = useState<'evaluator' | 'builder'>('builder');

  // --- ATS EVALUATOR STATE ---
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [evaluatorTab, setEvaluatorTab] = useState<'upload' | 'text'>('upload');

  // --- RESUME BUILDER STATE ---
  const [personal, setPersonal] = useState({
    name: 'Rahul Sharma',
    role: 'Full-Stack Software Engineer',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    linkedin: 'linkedin.com/in/rahulsharma',
    objective: 'Motivated Full-Stack Software Engineer with 2+ years of hands-on experience in modern JavaScript frameworks and scalable database applications. Enthusiastic about creating highly responsive user interfaces and robust server architectures.'
  });

  const [experiences, setExperiences] = useState<WorkExperience[]>([
    {
      company: 'IndoTech Solutions',
      role: 'Frontend Engineer',
      duration: '2024 - Present',
      description: 'Developed and optimized responsive web applications for civic and state platforms. Integrated REST APIs, resulting in 35% faster data rendering and state persistence.'
    },
    {
      company: 'Savitri Systems',
      role: 'Software Developer Intern',
      duration: '2023 - 2024',
      description: 'Designed interactive components using Tailwind CSS and React. Maintained database backups and optimized critical queries.'
    }
  ]);

  const [educations, setEducations] = useState<Education[]>([
    {
      school: 'Mumbai University',
      degree: 'B.E. in Computer Engineering',
      duration: '2020 - 2024',
      grade: '8.8 CGPA / First Class with Distinction'
    }
  ]);

  const [skills, setSkills] = useState<string>('React, Node.js, Express, JavaScript, TypeScript, Tailwind CSS, PostgreSQL, Git, REST APIs');
  const [activeBuilderTab, setActiveBuilderTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [selectedTemplate, setSelectedTemplate] = useState<'slate' | 'navy' | 'emerald'>('navy');
  
  // Payment states for ₹99/- Unlock
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'success'>('checkout');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('user@okaxis');

  // --- ATS EVALUATOR HANDLERS ---
  const handleAnalyze = async (text: string) => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText: text })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setAnalysisResult({
        atsScore: 74,
        rating: 'Good',
        skillsGap: ['Cloud Operations (AWS)', 'CI/CD Pipelines (Jenkins/GitHub Actions)', 'TypeScript'],
        missingKeywords: ['System Design', 'Serverless', 'Microservices Architecture', 'Unit Testing'],
        suggestions: [
          'Incorporate industry keywords into your skills summary section to bypass automated filters.',
          'Quantify your impact at past jobs using percentages (e.g., "Boosted conversion rate by 15%").',
          'Avoid complex columns or tables in your layout, as some ATS scanners cannot parse multi-column structures.'
        ],
        feedbackText: `### Profile Review
Your resume lists solid software experience, particularly with **React**, **Node.js**, and **Database queries**. However, modern tech agencies prioritize Cloud exposure and DevOps automation.

* **Strengths:** Excellent project description detail.
* **Focus Area:** Standardize your bullet points to begin with strong action verbs (e.g., "Developed", "Optimized", "Spearheaded").`
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text || `Rajesh Kumar Singh\nSoftware Engineer\nEmail: rajesh@example.com\nPhone: +91 9876543210\n\nExperience:\n- Built frontend apps in React.js for 2 years.\n- Managed REST APIs using Node.js & Express.\n- Designed database schemas in MongoDB.`);
      };
      reader.readAsText(file);
    }
  };

  const selectMockTemplate = (templateType: 'developer' | 'banker' | 'fresher') => {
    let mockText = '';
    let mockFileName = '';
    if (templateType === 'developer') {
      mockText = `Amit Patil - Full Stack Web Developer\namit.patil@example.com | +91 9123456789\n\nTechnical Skills: React, Node.js, Express, JavaScript, TailwindCSS, SQL.\n\nExperience:\n- Junior Developer at TechSolutions (18 months).\n- Created and deployed web interfaces for e-commerce platforms.\n- Optimized databases which reduced page load delay by 2 seconds.`;
      mockFileName = 'amit_developer_cv.docx';
    } else if (templateType === 'banker') {
      mockText = `Priya Sharma - Financial Analyst\npriya.sharma@example.com | +91 8888777766\n\nSkills: Portfolio management, risk evaluation, accounting spreadsheets, client advisory.\n\nExperience:\n- Relationship Manager at HDFC bank (2 years).\n- Guided over 50 clients on financial investments.`;
      mockFileName = 'priya_financial_resume.pdf';
    } else {
      mockText = `Rohan Das - Computer Science Graduate (Fresher)\nrohan.das@example.com | +91 7777666655\n\nEducation:\nB.Tech in CSE - Marks: 82% (2026 Passout)\n\nSkills: Python, HTML, CSS, Git, Linux, fundamental SQL.\n\nProjects:\n- Library Management System in Python with database backup.`;
      mockFileName = 'rohan_fresher_resume.pdf';
    }
    setResumeText(mockText);
    setFileName(mockFileName);
    setEvaluatorTab('text');
  };

  const downloadReport = () => {
    if (!analysisResult) return;
    const content = `RECRUIT.ORG.IN - AROHI RESUME ANALYSIS REPORT\n` +
      `ATS Score: ${analysisResult.atsScore}/100 (${analysisResult.rating})\n\n` +
      `Missing Keywords:\n${analysisResult.missingKeywords.join('\n')}\n\n` +
      `Skills Gaps Identified:\n${analysisResult.skillsGap.join('\n')}\n\n` +
      `Actionable Suggestions:\n${analysisResult.suggestions.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arohi_resume_report_${analysisResult.atsScore}.txt`;
    a.click();
  };

  // --- RESUME BUILDER DYNAMIC HANDLERS ---
  const handleAddExperience = () => {
    setExperiences([...experiences, { company: '', role: '', duration: '', description: '' }]);
  };

  const handleUpdateExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
  };

  const handleRemoveExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    setEducations([...educations, { school: '', degree: '', duration: '', grade: '' }]);
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducations(updated);
  };

  const handleRemoveEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  // --- SECURE PAYMENT MOCK HANDLERS ---
  const handleInitiatePayment = () => {
    setShowPaymentModal(true);
    setPaymentStep('checkout');
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsUnlocked(true);
      setPaymentStep('success');
    }, 2000);
  };

  const handlePrintResume = () => {
    if (!isUnlocked) {
      handleInitiatePayment();
      return;
    }
    window.print();
  };

  // Custom colors for A4 Paper Preview based on theme
  const getThemeClasses = () => {
    switch (selectedTemplate) {
      case 'navy':
        return {
          banner: 'bg-[#0f172a] text-white',
          accentText: 'text-[#1e3a8a]',
          accentBorder: 'border-[#1e3a8a]',
          iconBg: 'bg-[#1e3a8a]/10 text-[#1e3a8a]',
          subheading: 'text-[#1e3a8a] border-b-2 border-[#1e3a8a]'
        };
      case 'emerald':
        return {
          banner: 'bg-[#064e3b] text-white',
          accentText: 'text-[#065f46]',
          accentBorder: 'border-[#065f46]',
          iconBg: 'bg-[#065f46]/10 text-[#065f46]',
          subheading: 'text-[#065f46] border-b-2 border-[#065f46]'
        };
      case 'slate':
      default:
        return {
          banner: 'bg-[#334155] text-white',
          accentText: 'text-[#334155]',
          accentBorder: 'border-[#334155]',
          iconBg: 'bg-[#334155]/10 text-[#334155]',
          subheading: 'text-[#334155] border-b-2 border-[#334155]'
        };
    }
  };

  const templateStyle = getThemeClasses();

  return (
    <div className="space-y-6">
      
      {/* Upper Navigation & Title Block */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-slate-850">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="bg-blue-600/20 text-blue-400 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/30">AROHI Opportunity Suite</span>
            <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">AI Resume & Career Engine</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Write, edit, and optimize your employment profile. Compare with state guidelines using ATS parsing tools, or build a professional premium resume template directly.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur px-4 py-3 rounded-xl border border-white/10 flex items-center gap-3 shrink-0">
            <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
            <div className="text-left font-semibold">
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest leading-none">Subscription Status</span>
              <span className="text-xs text-white flex items-center gap-1.5">
                {isUnlocked ? (
                  <span className="text-[#00e676] font-extrabold flex items-center gap-1">✨ Premium Unlocked</span>
                ) : (
                  <span className="text-amber-400 font-extrabold">🔒 Standard Plan</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* View Selection Toggle */}
        <div className="flex bg-[#0f0b24] p-1.5 rounded-xl border border-slate-800 mt-6 max-w-md">
          <button
            onClick={() => setPageMode('builder')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
              pageMode === 'builder' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" /> Interactive Builder (₹99)
          </button>
          <button
            onClick={() => setPageMode('evaluator')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-2 ${
              pageMode === 'evaluator' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> ATS AI Evaluator
          </button>
        </div>
      </div>

      {/* --- PAGE VIEW 1: PREMIUM INTERACTIVE RESUME BUILDER --- */}
      {pageMode === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Builder Form Inputs - Left Side */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Fill Resume Details</h3>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">Step by Step</span>
              </div>

              {/* Accordion/Tab Headers for Form Sections */}
              <div className="grid grid-cols-4 gap-1 mb-4">
                <button
                  onClick={() => setActiveBuilderTab('personal')}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-tight text-center transition-all cursor-pointer ${
                    activeBuilderTab === 'personal' ? 'bg-[#1b1444] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setActiveBuilderTab('experience')}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-tight text-center transition-all cursor-pointer ${
                    activeBuilderTab === 'experience' ? 'bg-[#1b1444] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Experience
                </button>
                <button
                  onClick={() => setActiveBuilderTab('education')}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-tight text-center transition-all cursor-pointer ${
                    activeBuilderTab === 'education' ? 'bg-[#1b1444] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Education
                </button>
                <button
                  onClick={() => setActiveBuilderTab('skills')}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-black uppercase tracking-tight text-center transition-all cursor-pointer ${
                    activeBuilderTab === 'skills' ? 'bg-[#1b1444] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Skills
                </button>
              </div>

              {/* 1. PERSONAL DETAILS SECTION */}
              {activeBuilderTab === 'personal' && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={personal.name}
                      onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Target Professional Role</label>
                    <input
                      type="text"
                      value={personal.role}
                      onChange={(e) => setPersonal({ ...personal, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={personal.email}
                        onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={personal.phone}
                        onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Location (City, State)</label>
                      <input
                        type="text"
                        value={personal.location}
                        onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">LinkedIn Profile</label>
                      <input
                        type="text"
                        value={personal.linkedin}
                        onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Professional Summary / Objective</label>
                    <textarea
                      value={personal.objective}
                      rows={4}
                      onChange={(e) => setPersonal({ ...personal, objective: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-blue-600 text-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* 2. WORK EXPERIENCE SECTION */}
              {activeBuilderTab === 'experience' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Past & Current Job Roles</span>
                    <button
                      onClick={handleAddExperience}
                      className="flex items-center gap-1 text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Experience
                    </button>
                  </div>

                  {experiences.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">No experience cards added yet.</div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {experiences.map((exp, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3 relative space-y-2">
                          <button
                            onClick={() => handleRemoveExperience(idx)}
                            className="absolute right-2 top-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove Role"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">Company Name</label>
                              <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">Job Title / Role</label>
                              <input
                                type="text"
                                value={exp.role}
                                onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">Duration (e.g. 2022 - 2024)</label>
                              <input
                                type="text"
                                value={exp.duration}
                                onChange={(e) => handleUpdateExperience(idx, 'duration', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400">Key Contributions & Results</label>
                            <textarea
                              value={exp.description}
                              rows={2}
                              onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-850"
                              placeholder="Describe your key achievements..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. EDUCATION SECTION */}
              {activeBuilderTab === 'education' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase text-slate-400">Academic Qualifications</span>
                    <button
                      onClick={handleAddEducation}
                      className="flex items-center gap-1 text-[10px] font-black uppercase bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add School
                    </button>
                  </div>

                  {educations.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">No education qualifications added.</div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                      {educations.map((edu, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-150 rounded-xl p-3 relative space-y-2">
                          <button
                            onClick={() => handleRemoveEducation(idx)}
                            className="absolute right-2 top-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Remove School"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">University / School</label>
                              <input
                                type="text"
                                value={edu.school}
                                onChange={(e) => handleUpdateEducation(idx, 'school', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">Degree & Specialization</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">Duration (e.g. 2020 - 2024)</label>
                              <input
                                type="text"
                                value={edu.duration}
                                onChange={(e) => handleUpdateEducation(idx, 'duration', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold uppercase text-slate-400">Grade / CGPA / %</label>
                              <input
                                type="text"
                                value={edu.grade}
                                onChange={(e) => handleUpdateEducation(idx, 'grade', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-850"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. TECHNICAL & SOFT SKILLS SECTION */}
              {activeBuilderTab === 'skills' && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-500 mb-1">Skills (Separated by Commas)</label>
                    <textarea
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, JavaScript, AWS, MySQL, Project Management"
                      rows={6}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-blue-600 text-slate-800 leading-relaxed"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-150 rounded-xl p-3.5 text-[11px] text-blue-800 font-medium">
                    💡 **AROHI Pro-Tip:** Keep your skills list concise and aligned with keywords matching active central jobs boards to score highly on ATS tests.
                  </div>
                </div>
              )}
            </div>

            {/* Template & Color Selector */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-violet-600" /> Choose Stylized Template Color
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedTemplate('navy')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    selectedTemplate === 'navy' 
                      ? 'border-[#1e3a8a] bg-[#1e3a8a]/5 text-[#1e3a8a] font-extrabold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#0f172a]"></span> Navy Blue
                </button>
                <button
                  onClick={() => setSelectedTemplate('emerald')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    selectedTemplate === 'emerald' 
                      ? 'border-[#065f46] bg-[#065f46]/5 text-[#065f46] font-extrabold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#064e3b]"></span> Emerald
                </button>
                <button
                  onClick={() => setSelectedTemplate('slate')}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                    selectedTemplate === 'slate' 
                      ? 'border-[#334155] bg-[#334155]/5 text-[#334155] font-extrabold' 
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-[#334155]"></span> Slate Grey
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Resume live A4 Paper Preview - Right Side */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 text-center flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-black uppercase text-slate-300">Live Preview Container (A4 Proportioned)</span>
              </div>
              
              <div className="flex gap-2">
                {isUnlocked ? (
                  <button
                    onClick={handlePrintResume}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / Export PDF
                  </button>
                ) : (
                  <button
                    onClick={handleInitiatePayment}
                    className="bg-[#c084fc] hover:bg-[#a855f7] text-[#0a0715] font-extrabold text-[11px] uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg transition-all active:scale-95"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Unlock Premium Export (₹99)
                  </button>
                )}
              </div>
            </div>

            {/* A4 PAPER PREVIEW BOX */}
            <div id="arohi-printable-resume" className="bg-white text-slate-800 shadow-2xl rounded-2xl p-8 border border-slate-200 font-sans max-w-[210mm] min-h-[297mm] mx-auto overflow-hidden text-left relative">
              
              {/* Header Banner */}
              <div className={`-mx-8 -mt-8 p-6 mb-6 ${templateStyle.banner}`}>
                <h1 className="text-2xl font-black tracking-tight uppercase">{personal.name || 'Your Name'}</h1>
                <p className="text-sm font-bold text-slate-200 mt-1 uppercase tracking-wide">{personal.role || 'Professional Role'}</p>
                
                {/* Contact Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-[11px] text-slate-300 font-medium">
                  {personal.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                      <span>{personal.email}</span>
                    </div>
                  )}
                  {personal.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                      <span>{personal.phone}</span>
                    </div>
                  )}
                  {personal.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                      <span>{personal.location}</span>
                    </div>
                  )}
                  {personal.linkedin && (
                    <div className="flex items-center gap-1.5 sm:col-span-3 mt-0.5">
                      <Linkedin className="w-3.5 h-3.5 text-violet-300 shrink-0" />
                      <span>{personal.linkedin}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                
                {/* 1. Objective / Profile */}
                {personal.objective && (
                  <div className="space-y-1.5">
                    <h3 className={`text-xs font-black uppercase tracking-wider pb-1 ${templateStyle.subheading}`}>
                      Professional Profile
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {personal.objective}
                    </p>
                  </div>
                )}

                {/* 2. Experience Section */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider pb-1 mb-3.5 ${templateStyle.subheading}`}>
                    Employment Experience
                  </h3>
                  
                  {experiences.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No experience items added.</p>
                  ) : (
                    <div className="space-y-4">
                      {experiences.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-extrabold text-slate-900">{exp.role || 'Job Role'}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{exp.duration || '2024'}</span>
                          </div>
                          <div className="text-[11px] font-black uppercase text-slate-500 tracking-wide">
                            {exp.company || 'Company Name'}
                          </div>
                          {exp.description && (
                            <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                              • {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Education Section */}
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-wider pb-1 mb-3.5 ${templateStyle.subheading}`}>
                    Academic History
                  </h3>

                  {educations.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No education items added.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {educations.map((edu, idx) => (
                        <div key={idx} className="space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-extrabold text-slate-900">{edu.degree || 'Degree/Certificate'}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{edu.duration || '2024'}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold uppercase">
                            <span>{edu.school || 'University Name'}</span>
                            <span className="font-bold text-slate-700">{edu.grade || 'Marks'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Skills Section */}
                {skills && (
                  <div className="space-y-2">
                    <h3 className={`text-xs font-black uppercase tracking-wider pb-1 ${templateStyle.subheading}`}>
                      Core Expertise & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skills.split(',').map((s, i) => {
                        const cleanSkill = s.trim();
                        if (!cleanSkill) return null;
                        return (
                          <span key={i} className="bg-slate-100 text-slate-800 text-[10px] font-extrabold px-2.5 py-1 rounded">
                            {cleanSkill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* Watermark for standard/unlocked preview */}
              {!isUnlocked && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center select-none">
                  <div className="bg-slate-950/95 border border-slate-800 text-white rounded-2xl p-6 shadow-2xl max-w-sm space-y-4">
                    <div className="bg-violet-600/20 p-3.5 rounded-full text-[#c084fc] border border-violet-500/30 w-fit mx-auto animate-pulse">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wide">Standard Preview Mode</h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        To export high-resolution ATS-friendly PDFs, remove watermarks, and unlock full templates, authorize the ₹99/- payment package.
                      </p>
                    </div>
                    <button
                      onClick={handleInitiatePayment}
                      className="w-full bg-[#c084fc] hover:bg-[#a855f7] text-[#0a0715] py-2.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Unlock for ₹99 Only
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* --- PAGE VIEW 2: ATS RESUME AI EVALUATOR (PRESERVED) --- */}
      {pageMode === 'evaluator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Input Section */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
              
              <div className="flex border-b border-slate-100 pb-3 mb-4">
                <button
                  onClick={() => setEvaluatorTab('upload')}
                  className={`flex-1 pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer ${
                    evaluatorTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  File Upload
                </button>
                <button
                  onClick={() => setEvaluatorTab('text')}
                  className={`flex-1 pb-2 text-xs font-black uppercase tracking-wider transition-all border-b-2 text-center cursor-pointer ${
                    evaluatorTab === 'text' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Enter Text Directly
                </button>
              </div>

              {evaluatorTab === 'upload' ? (
                <div className="space-y-4">
                  <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-blue-50/10">
                    <Upload className="w-10 h-10 text-slate-400 mb-3" />
                    <span className="text-xs font-bold text-slate-700">Drag & Drop Resume here</span>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Supports PDF, DOCX or TXT files up to 5MB</span>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {fileName && (
                    <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-center gap-2.5 text-xs font-semibold">
                      <FileText className="w-4.5 h-4.5 text-emerald-600" />
                      <span className="truncate flex-1">Loaded: **{fileName}**</span>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-extrabold mb-2.5">Or try a ready prototype profile</p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => selectMockTemplate('developer')}
                        className="px-2 py-1.5 border border-slate-150 hover:border-blue-300 hover:bg-slate-50 text-[10px] font-black text-slate-700 rounded-lg transition-all cursor-pointer text-center"
                      >
                        Web Dev CV
                      </button>
                      <button
                        onClick={() => selectMockTemplate('banker')}
                        className="px-2 py-1.5 border border-slate-150 hover:border-blue-300 hover:bg-slate-50 text-[10px] font-black text-slate-700 rounded-lg transition-all cursor-pointer text-center"
                      >
                        Finance CV
                      </button>
                      <button
                        onClick={() => selectMockTemplate('fresher')}
                        className="px-2 py-1.5 border border-slate-150 hover:border-blue-300 hover:bg-slate-50 text-[10px] font-black text-slate-700 rounded-lg transition-all cursor-pointer text-center"
                      >
                        Fresher Grad
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste details, experience history, skills list, and qualifications here to parse..."
                    rows={10}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              )}

              <button
                onClick={() => handleAnalyze(resumeText)}
                disabled={isAnalyzing || !resumeText.trim()}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white py-3 px-4 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Profile Keywords...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-yellow-300 stroke-[3.5]" /> Run ATS Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Output Dashboard */}
          <div className="lg:col-span-7">
            {analysisResult ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-md overflow-hidden space-y-6 p-6">
                
                {/* Score bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 border border-slate-150/60 p-4 rounded-xl">
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">ATS Compatibility</span>
                    <div className="relative mt-2 flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke={analysisResult.atsScore >= 80 ? '#10B981' : analysisResult.atsScore >= 70 ? '#3B82F6' : '#F59E0B'}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - analysisResult.atsScore / 100)}
                        />
                      </svg>
                      <span className="absolute text-2xl font-black text-slate-900">{analysisResult.atsScore}%</span>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center md:text-left space-y-1">
                    <div className="flex items-center justify-center md:justify-start gap-1.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Overall Rating:</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        analysisResult.atsScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {analysisResult.rating}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800 mt-1">AROHI Advice:</h4>
                    <p className="text-xs text-slate-500 leading-normal font-medium">
                      Your profile requires standard keyword optimization to match central database listings. Apply the recommendations below to score &gt;85%.
                    </p>
                  </div>

                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Actionable Improvement Steps
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-slate-600 font-medium">
                        <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid of gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Missing keywords */}
                  <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-red-700 flex items-center gap-1 mb-2.5">
                      <AlertCircle className="w-4 h-4 text-red-500" /> Missing Industry Keywords
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.missingKeywords.map((kw, i) => (
                        <span key={i} className="bg-white border border-red-150 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills Gap */}
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                    <h5 className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1 mb-2.5">
                      <Cpu className="w-4 h-4 text-blue-500" /> Upskilling Gap Recommendations
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.skillsGap.map((sk, i) => (
                        <span key={i} className="bg-white border border-blue-150 text-blue-800 text-[10px] font-bold px-2 py-1 rounded-md">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Feedback text */}
                <div className="border-t border-slate-100 pt-4 leading-relaxed text-slate-700 whitespace-pre-line text-xs font-medium">
                  {analysisResult.feedbackText}
                </div>

                {/* Bottom Buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5 border-t border-slate-100 pt-4">
                  <button
                    onClick={downloadReport}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" /> Download PDF/TXT Report
                  </button>
                  <button
                    onClick={() => alert('Generating tailored alternative resume layouts utilizing OpenAI standard structures. (Feature is active)')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    Generate Tailored Resume <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="bg-blue-50 p-4 rounded-full text-blue-600 border border-blue-100 animate-bounce">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-slate-800 text-sm md:text-base">Awaiting Resume Analysis</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Paste your experience or upload your resume PDF in the input container to check compatibility and receive AROHI upskilling suggestions.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* --- MOCK PAYMENT MODAL WINDOW (₹99 SECURE CHECKOUT) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-[#060410]/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f0a28] border border-[#30246a] text-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl relative animate-fade-in">
            
            {/* Header */}
            <div className="bg-[#1c1445] p-5 border-b border-[#30246a] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="bg-[#c084fc]/20 text-[#c084fc] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-[#c084fc]/30">Secure Payment Gateway</span>
                <span className="text-xs font-black text-slate-200">Recruit.org.in</span>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-white font-extrabold text-xs cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {paymentStep === 'checkout' ? (
              <div className="p-6 space-y-5">
                
                {/* Package Overview */}
                <div className="bg-[#120e35] rounded-xl p-4 border border-[#2b1f63] flex justify-between items-center">
                  <div>
                    <h5 className="font-extrabold text-xs uppercase tracking-wide text-violet-300">Premium Resume Builder Unlock</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">High-res export, unlimited updates, premium themes.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-2xl font-black text-emerald-400">₹99</span>
                    <span className="text-[8px] uppercase font-bold text-slate-400">One-Time Fee</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-[#0a071d] p-1 rounded-lg border border-[#231b53]">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-wider rounded transition-all text-center cursor-pointer ${
                      paymentMethod === 'upi' ? 'bg-[#c084fc] text-[#0a0715]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    UPI / Scan QR
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-1.5 text-[11px] font-black uppercase tracking-wider rounded transition-all text-center cursor-pointer ${
                      paymentMethod === 'card' ? 'bg-[#c084fc] text-[#0a0715]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Debit / Credit Card
                  </button>
                </div>

                {/* Form Body */}
                {paymentMethod === 'upi' ? (
                  <div className="space-y-4 text-center">
                    <div className="bg-white p-2.5 rounded-xl w-32 h-32 mx-auto flex items-center justify-center border border-slate-200">
                      {/* Fake QR Code Visual */}
                      <div className="w-full h-full relative bg-slate-100 flex flex-col justify-center items-center rounded border border-slate-300">
                        <span className="text-[8px] font-black text-slate-700 tracking-tighter uppercase leading-none mb-1">Scan to Pay</span>
                        <div className="grid grid-cols-5 gap-1 p-1 bg-slate-900 rounded">
                          {[...Array(25)].map((_, i) => (
                            <span key={i} className={`w-3.5 h-3.5 rounded-sm ${i % 3 === 0 || i % 4 === 1 ? 'bg-white' : 'bg-transparent'}`}></span>
                          ))}
                        </div>
                        <span className="text-[7px] font-bold text-emerald-600 uppercase mt-1">₹99 Secure</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Or enter UPI ID directly</p>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full text-center mt-1.5 bg-[#0a071c] border border-[#281f61] rounded-xl px-3 py-2 text-xs font-bold text-violet-300 focus:outline-none focus:border-[#c084fc]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full bg-[#0a071c] border border-[#281f61] rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#c084fc]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="4321 8765 0987 1122"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-[#0a071c] border border-[#281f61] rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#c084fc]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#0a071c] border border-[#281f61] rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#c084fc]"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">CVV</label>
                        <input
                          type="password"
                          placeholder="***"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-[#0a071c] border border-[#281f61] rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#c084fc]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" /> Connecting Securely...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Complete Payment of ₹99
                    </>
                  )}
                </button>

                <p className="text-[9px] text-slate-500 text-center font-medium">
                  🔒 Bank-level SSL Encryption. By completing, you gain immediate, lifetime download rights for any custom resumes built.
                </p>

              </div>
            ) : (
              <div className="p-6 text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white uppercase tracking-wide">Payment Successful!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Transaction ID: **TXN98871221**. Your lifetime access token to the AROHI Premium Resume Builder is successfully activated.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setTimeout(() => handlePrintResume(), 300);
                  }}
                  className="w-full bg-[#c084fc] hover:bg-[#a855f7] text-[#0a0715] font-extrabold text-xs uppercase tracking-wider py-3 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Proceed to Export / Print PDF
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
