import React, { useState } from 'react';
import { 
  Shield, 
  FileText, 
  RefreshCw, 
  CreditCard, 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  MessageSquare,
  Lock,
  UserCheck
} from 'lucide-react';

interface LegalPagesProps {
  initialTab: 'privacy' | 'terms' | 'refunds' | 'payments' | 'contact' | 'faqs';
}

export default function LegalPages({ initialTab }: LegalPagesProps) {
  const [activeSubTab, setActiveSubTab] = useState<'privacy' | 'terms' | 'refunds' | 'payments' | 'contact' | 'faqs'>(initialTab);
  
  // FAQ Section States
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('general');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Update sub-tab if initialTab prop changes
  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  const faqs = [
    {
      category: 'Application Status',
      q: 'How can I check the status of my recruitment application?',
      a: 'You can check your current application status by logging into your Dashboard panel. Once logged in, go to the "My Applications" section where real-time progress will be displayed as "Submitted", "Under Review", "Approved", or "Rejected". You will also receive an automated email alert whenever an administrator updates your status.'
    },
    {
      category: 'Application Status',
      q: 'What is the processing turnaround time (TAT) for submitted forms?',
      a: 'The administrative verification process usually takes between 3 to 7 working days. During peak exam announcements, this may take up to 10 days. If your profile remains under review beyond 10 days, please contact the Support Desk with your application registration number.'
    },
    {
      category: 'Payment Methods',
      q: 'Which payment methods are supported on the platform?',
      a: 'We support 100% secure end-to-end payment methods compliant with Reserve Bank of India (RBI) rules. This includes Unified Payments Interface (UPI) (via PhonePe, Google Pay, Paytm, etc.), Debit/Credit Cards (Visa, MasterCard, RuPay), and secure Net Banking across all major commercial banks inside India.'
    },
    {
      category: 'Payment Methods',
      q: 'What if my payment fails but the money is deducted from my bank account?',
      a: 'In compliance with standard banking settlement rules, failed transactions are automatically reconciled within 2 to 5 working days. If the money was debited but the registration was not successful, the amount will be fully credited back to your original source payment account. You can submit a ticket under "Payment Gateway Dispute" if the credit does not reflect after 5 working days.'
    },
    {
      category: 'Account Recovery',
      q: 'How do I recover my account if I forget my login password or registration number?',
      a: 'To recover your credentials, click the "Forgot Password" link on the login page, or utilize our AI Assistant Arohi to initialize verification. You will be prompted to enter your registered email address or mobile number. A secure password reset link or dynamic OTP will be dispatched to verify your identity. Alternatively, you can search your email inbox for "Recruit.org.in Confirmation" to retrieve your unique Application Registration Number.'
    },
    {
      category: 'Account Recovery',
      q: 'Can I change my registered email address or phone number after signup?',
      a: 'For security reasons, users cannot change their primary email ID or phone number directly from the settings panel. If you have lost access to your primary email/phone, please send a signed request letter or submit a grievance ticket under the "Grievance or Regulatory Complaint" category along with a valid Indian Government-issued identity proof (e.g. Aadhaar or PAN card) for identity verification.'
    }
  ];

  const filteredFaqs = selectedFaqCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedFaqCategory);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    
    setIsSubmitting(true);
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactSubject('general');
      setContactMessage('');
    }, 1200);
  };

  const legalTabs = [
    { id: 'faqs', label: 'Frequently Asked Questions', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'refunds', label: 'Refund & Cancellation', icon: RefreshCw },
    { id: 'payments', label: 'Pricing & RBI Compliance', icon: CreditCard },
    { id: 'contact', label: 'Contact Us & Grievance', icon: Mail },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4 text-left">
      {/* Header */}
      <div className="bg-[#120d2a] border border-[#211b3d] rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-[0_4px_30px_rgba(124,58,237,0.1)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7c3aed]/10 to-[#ec4899]/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <span className="bg-[#00e676]/10 text-[#00e676] text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#00e676]/20">
            Legal & Support Desk
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-4">
            Security, Compliance & Support Center
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl font-medium">
            We adhere strictly to regulatory policies, ensuring 100% compliance with Reserve Bank of India (RBI) payment gateway guidelines, PCI-DSS security protocols, and Indian privacy statutes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 space-y-2 bg-[#120d2a]/80 p-3 rounded-2xl border border-[#211b3d]">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 block mb-2">Legal Sections</span>
          {legalTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  setIsSubmitted(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-[#1a143b]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#8a70f5]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Content Pane */}
        <div className="lg:col-span-9 bg-[#120d2a] rounded-3xl border border-[#211b3d] p-6 md:p-8 min-h-[500px] shadow-xl relative overflow-hidden">
          
          {/* FAQ SECTION */}
          {activeSubTab === 'faqs' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#211b3d] pb-4">
                <HelpCircle className="w-6 h-6 text-[#7c3aed]" />
                <h2 className="text-lg font-black text-white">Frequently Asked Questions</h2>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Got questions? We have answers. Find resources below addressing application statuses, payment modes, and profile recovery procedures.
              </p>

              {/* Category Quick Filters */}
              <div className="flex flex-wrap gap-2 pb-2">
                {['All', 'Application Status', 'Payment Methods', 'Account Recovery'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedFaqCategory(cat);
                      setExpandedQuestion(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all cursor-pointer border uppercase ${
                      selectedFaqCategory === cat
                        ? 'bg-[#7c3aed]/15 border-[#7c3aed] text-white'
                        : 'bg-[#120d2a] border-[#211b3d] text-slate-400 hover:text-white hover:border-[#30275c]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedQuestion === faq.q;
                  return (
                    <div 
                      key={idx}
                      className={`border rounded-2xl transition-all duration-300 ${
                        isExpanded 
                          ? 'bg-[#161035] border-[#7c3aed]/40 shadow-[0_4px_20px_rgba(124,58,237,0.05)]' 
                          : 'bg-[#130f2c] border-[#2b1f5c] hover:border-[#3e317c]'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedQuestion(isExpanded ? null : faq.q)}
                        className="w-full flex justify-between items-center px-4 py-3 text-left font-bold text-xs text-white gap-4 cursor-pointer focus:outline-none"
                      >
                        <span className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-[#8a70f5] text-[9px] font-black tracking-wider uppercase bg-[#8a70f5]/10 px-2 py-0.5 rounded shrink-0">
                            {faq.category}
                          </span>
                          <span className="leading-snug">{faq.q}</span>
                        </span>
                        <span className={`text-[#8a70f5] shrink-0 text-[10px] transition-transform duration-300 transform ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isExpanded ? 'max-h-60 border-t border-[#211b3d]' : 'max-h-0'
                        }`}
                      >
                        <div className="p-4 text-xs text-slate-300 font-medium leading-relaxed bg-[#110c28]">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Can't find your question? Support CTA */}
              <div className="bg-[#130f2c] border border-[#2b1f5c] p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Still have unanswered questions?</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Our regulatory helpdesk and technical team are ready to assist you 24/7.</p>
                </div>
                <button
                  onClick={() => setActiveSubTab('contact')}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  <span>Submit Support Ticket</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#211b3d] pb-4">
                <Shield className="w-6 h-6 text-[#00e676]" />
                <h2 className="text-lg font-black text-white">Privacy Policy</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">Last Updated: June 24, 2026 • Compliant with Indian DPDP Act, 2023</p>
              
              <div className="space-y-5 text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">1. Information We Collect</h3>
                  <p>
                    Recruit.org.in ("we", "us", or "our") collects critical user data strictly to facilitate job recommendations, custom roadmaps, and resume compilation. This includes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong>Personal Identifiers:</strong> Name, email address, telephone contact number, and location.</li>
                    <li><strong>Career Metadata:</strong> Academic credentials, occupational history, skill sets, and industry target choices.</li>
                    <li><strong>Financial Indicators:</strong> Billing names, email IDs, and payment references (payment gateways handle card specifics; we store zero raw card data).</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">2. Strict Purpose & Usage Policy</h3>
                  <p>
                    Your data is strictly processed to optimize your career guide experience. Under the Digital Personal Data Protection (DPDP) Act of India, we obtain explicit consent before processing:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>Processing job applications and securely routing them to verifying employers.</li>
                    <li>Utilizing our secure, isolated processing endpoints to parse resume files and generate custom roadmaps.</li>
                    <li>Facilitating secure subscription processing and payment receipts.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">3. Data Sharing & Non-Disclosure</h3>
                  <p>
                    We enforce a absolute zero-selling policy. We do not sell, rent, or lease personal user listings to third-party marketing brokers. Data sharing is limited strictly to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li>Authorized employers of verified government and public sector job listings where you actively hit "Apply Online".</li>
                    <li>RBI-authorized payment gateways and processing banking entities strictly for premium transactions.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">4. Data Security & Storage Controls</h3>
                  <p>
                    Our databases are hosted in standard production cloud servers with high-level SSL/TLS 1.3 encryption. We secure rest data using industry-standard Advanced Encryption Standard (AES-256). All access parameters are gated behind multi-factor administrative authentication.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">5. User Consent & Revocation Rights</h3>
                  <p>
                    You have the right to request full extraction or permanent erasure of your personal career files at any moment. Simply register a request via our Contact Us pane, and our designated data compliance officers will wipe all relevant database entries within 72 hours.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TERMS & CONDITIONS */}
          {activeSubTab === 'terms' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#211b3d] pb-4">
                <FileText className="w-6 h-6 text-[#7c3aed]" />
                <h2 className="text-lg font-black text-white">Terms & Conditions</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">Last Updated: June 24, 2026 • Registered under Indian IT Act, 2000</p>
              
              <div className="space-y-5 text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">1. Acceptance of Terms</h3>
                  <p>
                    By creating an account, browsing our consolidated sarkari jobs aggregator, utilizing AROHI AI, or procuring premium tools (such as the Interactive AI Resume Builder for ₹99), you accept and consent to remain bound by these Terms of Service. If you disagree, please discontinue service usage immediately.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">2. Eligibility Criteria</h3>
                  <p>
                    You must be at least 18 years of age or possess formal parental consent to complete monetary transactions on this platform. Usage for any unlawful, misleading, or deceptive purpose is strictly prohibited.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">3. User Accounts & Security Credentials</h3>
                  <p>
                    If you register a personal workspace, you are solely responsible for protecting all verification logins. We will not be liable for losses stemming from unauthorized credential access due to your negligence.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">4. Proprietary Information & Trademark Use</h3>
                  <p>
                    Our visual systems, customized codebase, dynamic AROHI AI algorithms, and custom themes are proprietary properties. You are forbidden from reverse-engineering, crawling, scraping, or mirroring our service endpoints without explicit, sealed corporate authorization.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">5. Liability Limitation & Warranties</h3>
                  <p>
                    Job postings are gathered directly from public gazettes, newspaper employment ads, and authorized government notifications (such as UPSC, SSC, Railway notifications). While we verify daily to ensure supreme accuracy, we do not guarantee immediate recruitment, and users must cross-verify exam timetables directly with official statutory boards.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* REFUND & CANCELLATION */}
          {activeSubTab === 'refunds' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#211b3d] pb-4">
                <RefreshCw className="w-6 h-6 text-amber-500 animate-spin-slow" />
                <h2 className="text-lg font-black text-white">Cancellation & Refund Policy</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">Governed by Consumer Protection (E-Commerce) Rules, 2020</p>
              
              <div className="space-y-5 text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-amber-200">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-black">Notice on Instant Digital Services:</span> Under standard e-commerce regulations, immediate digital generation services (such as downloading a complete premium AI-built resume) are consumed instantly. However, we maintain highly accommodating refund paths for technical errors or accidental double charges!
                  </div>
                </div>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">1. Standard Refund Parameters</h3>
                  <p>
                    We offer a 100% money-back guarantee in the following circumstances:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-400">
                    <li><strong>Accidental Duplicate Purchases:</strong> If you are charged multiple times for a single ₹99 Resume Builder request due to network latencies, all duplicate charges are automatically reversed.</li>
                    <li><strong>Critical Technical Failures:</strong> If our AI engine fails to output or compile your resume document, or a fatal crash locks your access, and our team cannot resolve the error within 48 hours, a complete refund will be processed.</li>
                    <li><strong>System Errors:</strong> Any transaction marked "Failed" at the merchant gateway level which deducted funds from your bank or wallet will be credited back automatically by your issuing bank within 5 to 7 working days.</li>
                  </ul>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">2. Refund Request Walkthrough</h3>
                  <p>
                    To claim a manual refund:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                    <li>Head over to our <strong>Contact Us</strong> pane or email <code>refunds@recruit.org.in</code>.</li>
                    <li>Include your Name, Registrant Email, date of transaction, and unique Transaction ID (e.g., UTR, Bank Ref No., or Gateway Ref).</li>
                    <li>Our finance support desk will review and confirm eligibility within 24 hours. Approved claims are initiated instantly.</li>
                  </ol>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">3. Settlement & Turnaround Times (TAT)</h3>
                  <p>
                    Once approved, refunds are securely dispatched directly to the original payment source (UPI, Card, or NetBanking wallet used during checkout). Banks typically credit your account within:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                    <div className="bg-[#1a143c] p-3 rounded-xl border border-[#2d2163] text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">UPI Payments</span>
                      <span className="text-base font-black text-[#00e676]">24 - 48 Hours</span>
                    </div>
                    <div className="bg-[#1a143c] p-3 rounded-xl border border-[#2d2163] text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Wallets & NetBanking</span>
                      <span className="text-base font-black text-[#8a70f5]">3 - 5 Working Days</span>
                    </div>
                    <div className="bg-[#1a143c] p-3 rounded-xl border border-[#2d2163] text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Credit/Debit Cards</span>
                      <span className="text-base font-black text-[#00e676]">5 - 7 Working Days</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* PRICING & RBI COMPLIANCE */}
          {activeSubTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#211b3d] pb-4">
                <CreditCard className="w-6 h-6 text-[#00e676]" />
                <h2 className="text-lg font-black text-white">Pricing & RBI Payment Gateway Guidelines</h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">100% Compliant with RBI/DPSS/2021-22/82 directives</p>
              
              <div className="space-y-5 text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                
                {/* Visual pricing guide */}
                <div className="bg-[#1a143c] border border-[#2c2062] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-white">Resume Builder Access Cost</h4>
                    <p className="text-xs text-slate-400 mt-1">One-time processing fee per dynamic resume document</p>
                  </div>
                  <div className="flex items-baseline gap-1 bg-[#1a143c] py-2 px-4 rounded-xl border border-[#3b2b73] shrink-0">
                    <span className="text-xs text-slate-400 font-bold">INR</span>
                    <span className="text-2xl font-black text-[#ffdd00]">₹99</span>
                    <span className="text-[10px] text-emerald-400 font-bold ml-1.5">(Inclusive of GST)</span>
                  </div>
                </div>

                <section className="space-y-3">
                  <h3 className="font-extrabold text-white text-sm md:text-base flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#00e676]" /> Reserve Bank of India (RBI) Security Guidelines We Observe
                  </h3>
                  <p>
                    Our payment infrastructure strictly complies with the latest mandate on <strong>Regulation of Payment Aggregators and Payment Gateways</strong> released by the RBI. Every online payment follows these strict frameworks:
                  </p>
                  
                  <div className="space-y-3 pl-2">
                    <div className="bg-[#130f2c] border border-[#2b1f5c] p-4 rounded-xl space-y-1">
                      <span className="text-xs font-black text-[#00e676] uppercase tracking-wider block">1. Card-on-File Tokenization (CoFT) Compliance</span>
                      <p className="text-xs text-slate-400">
                        In compliance with RBI circulars, we do not store customer Card Numbers (PAN), CVVs, or Card Expiry details on our local databases. Instead, your credit/debit card information is safely tokenized through secure banking networks. Only the network-certified token is kept for safe reference.
                      </p>
                    </div>

                    <div className="bg-[#130f2c] border border-[#2b1f5c] p-4 rounded-xl space-y-1">
                      <span className="text-xs font-black text-[#8a70f5] uppercase tracking-wider block">2. Mandatory Two-Factor Authentication (2FA)</span>
                      <p className="text-xs text-slate-400">
                        No financial transaction can proceed without an Additional Factor of Authentication (AFA). Users must complete 2FA validation via Secure OTP (One-Time Password) dispatched by their issuing bank, or bio-authenticated bank tokens.
                      </p>
                    </div>

                    <div className="bg-[#130f2c] border border-[#2b1f5c] p-4 rounded-xl space-y-1">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">3. End-to-End PCI-DSS Certified Processing</span>
                      <p className="text-xs text-slate-400">
                        We route all premium payments exclusively through PCI-DSS Level 1 compliant aggregators (e.g. Razorpay, Cashfree, or PayU). The entire connection uses secure TLS 1.3 protocol encryption, rendering intercepts impossible.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">2. Merchant Nodal Account Trust</h3>
                  <p>
                    All collected user fees are kept in a strict <strong>RBI-mandated Merchant Nodal Account</strong> operated by licensed commercial banks. This guarantees funds are isolated, protected, and used strictly for prompt merchant settlement and instant consumer refunds.
                  </p>
                </section>

                <section className="space-y-2">
                  <h3 className="font-extrabold text-white text-sm md:text-base">3. Dispute and Chargeback Mechanisms</h3>
                  <p>
                    Disputes are resolved under the RBI guidelines for Turnaround Time (TAT) and customer compensation for failed transactions. Any failed checkout where money was deducted must be reconciled and reversed within 5 days of the occurrence.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* CONTACT US & GRIEVANCE */}
          {activeSubTab === 'contact' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-3 border-b border-[#211b3d] pb-4">
                <Mail className="w-6 h-6 text-[#8a70f5]" />
                <h2 className="text-lg font-black text-white">Contact Us & Grievance Redressal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Contact Coordinates */}
                <div className="md:col-span-5 space-y-5 text-xs text-slate-300 font-medium">
                  <div className="bg-[#130f2c] border border-[#2b1f5c] rounded-2xl p-4 space-y-3">
                    <h4 className="font-extrabold text-white text-sm uppercase tracking-wider border-b border-[#211b3d] pb-2">Support Coordinates</h4>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#8a70f5] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Email Support</span>
                        <a href="mailto:support@recruit.org.in" className="text-white font-black hover:underline">support@recruit.org.in</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-[#00e676] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Helpline Line</span>
                        <span className="text-white font-black">+91-90904 55555</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Mon to Sat (10:00 AM - 6:00 PM IST)</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-slate-400 font-bold block text-[10px]">Registered Address</span>
                        <span className="text-white leading-relaxed">
                          BRAGA TECHNOLOGIES PRIVATE LIMITED<br />
                          (In association with ODITREE SERVICES)<br />
                          Level 4, Dynasty Plaza, Outer Ring Road,<br />
                          HSR Layout Sector 2, Bengaluru,<br />
                          Karnataka - 560102, India
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Grievance Desk */}
                  <div className="bg-[#1a143c] border border-[#3b2b73]/60 rounded-2xl p-4 space-y-2">
                    <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-400" /> Grievance Redressal Desk
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      In compliance with IT (Intermediary Guidelines & Digital Media Ethics Code) Rules, 2021:
                    </p>
                    <div className="text-[11px] space-y-1 mt-2 bg-[#120d2a] p-2.5 rounded-lg border border-[#211b3d]">
                      <div><strong>Officer:</strong> Rajesh Kumar</div>
                      <div><strong>Designation:</strong> Chief Grievance Officer</div>
                      <div><strong>Direct Desk:</strong> <a href="mailto:grievance@recruit.org.in" className="text-[#a855f7] hover:underline">grievance@recruit.org.in</a></div>
                      <div className="text-[9px] text-slate-500 mt-1">Issues are resolved within 15 days as mandated.</div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="md:col-span-7 bg-[#130f2c] border border-[#2b1f5c] rounded-2xl p-5">
                  <h4 className="font-extrabold text-white text-sm mb-4">Send Secure Support Request</h4>
                  
                  {isSubmitted ? (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h5 className="font-extrabold text-white">Ticket Submitted Successfully</h5>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. A security reference number has been assigned. Our support team will respond via your registered email address within 4-12 hours.
                      </p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="text-xs font-black text-[#7c3aed] hover:underline mt-2 inline-block cursor-pointer"
                      >
                        Send another query
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-[#120d2a] border border-[#2b1f5c] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7c3aed]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-[#120d2a] border border-[#2b1f5c] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7c3aed]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Mobile Number (Optional)</label>
                          <input 
                            type="tel" 
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+91"
                            className="w-full bg-[#120d2a] border border-[#2b1f5c] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7c3aed]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Request Category *</label>
                        <select 
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          className="w-full bg-[#120d2a] border border-[#2b1f5c] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#7c3aed]"
                        >
                          <option value="general">General Guidance Support</option>
                          <option value="payment">Payment Gateway Dispute (₹99 Refund/Failure)</option>
                          <option value="grievance">Grievance or Regulatory Complaint</option>
                          <option value="employer">Employer / Recruiter Verification</option>
                          <option value="delete">DPDP Data Deletion Request</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Description of Ticket *</label>
                        <textarea 
                          required
                          rows={4}
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          placeholder="Please provide details about your issue, purchase transaction references, or general question..."
                          className="w-full bg-[#120d2a] border border-[#2b1f5c] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#7c3aed] resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-slate-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Verifying and dispatching...</span>
                          </>
                        ) : (
                          <>
                            <span>Dispatch Secure Ticket</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
