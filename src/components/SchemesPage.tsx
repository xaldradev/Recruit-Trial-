import { useState } from 'react';
import { Search, Sparkles, Filter, CheckCircle2, ChevronRight, Landmark, ShieldCheck, HelpCircle } from 'lucide-react';

interface Scheme {
  id: string;
  title: string;
  ministry: string;
  category: 'student' | 'farmer' | 'women' | 'msme' | 'general';
  scope: 'Central' | 'State';
  state?: string;
  benefits: string;
  eligibilityInfo: string;
  requiredDocuments: string[];
  applyUrl: string;
}

export default function SchemesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  // Eligibility tester states
  const [userAge, setUserAge] = useState(22);
  const [userIncome, setUserIncome] = useState(150000);
  const [userGender, setUserGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [userCaste, setUserCaste] = useState<'General' | 'OBC' | 'SC/ST' | 'Minority'>('OBC');
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[] | null>(null);

  const schemesData: Scheme[] = [
    {
      id: 'mudra',
      title: 'Pradhan Mantri Mudra Yojana (PMMY)',
      ministry: 'Ministry of Finance',
      category: 'msme',
      scope: 'Central',
      benefits: 'Collateral-free business loans up to ₹10 Lakhs split into Shishu, Kishor, and Tarun schemes.',
      eligibilityInfo: 'Proprietors, partners, micro-entrepreneurs aged between 18 and 65 years.',
      requiredDocuments: ['Udyam MSME Certificate', 'PAN Card', 'Business address proof', 'Last 6 months bank statement'],
      applyUrl: 'https://www.udyamimitra.in'
    },
    {
      id: 'pmegp',
      title: 'Prime Minister Employment Generation Programme',
      ministry: 'Ministry of Micro, Small and Medium Enterprises',
      category: 'msme',
      scope: 'Central',
      benefits: 'Government subsidy of up to 35% on project costs up to ₹50 Lakhs for starting a new factory or service.',
      eligibilityInfo: 'Any individual above 18 years of age with at least 8th standard pass certificate.',
      requiredDocuments: ['Project report blueprint', 'Educational marksheet', 'Adhaar card', 'Caste certificate (if applicable)'],
      applyUrl: 'https://www.kviconline.gov.in/pmegpeportal'
    },
    {
      id: 'pm-kisan',
      title: 'PM Kisan Samman Nidhi',
      ministry: 'Ministry of Agriculture & Farmers Welfare',
      category: 'farmer',
      scope: 'Central',
      benefits: 'Guaranteed cash support of ₹6,000 per year delivered in three equal installments directly into bank accounts.',
      eligibilityInfo: 'Small and marginal landholder farmer families holding cultivable land in their names.',
      requiredDocuments: ['Land ownership papers (Khatauni)', 'Aadhaar Card', 'Bank Account details linked with Aadhaar'],
      applyUrl: 'https://pmkisan.gov.in'
    },
    {
      id: 'post-matric',
      title: 'Post Matric Scholarship Scheme',
      ministry: 'Ministry of Social Justice and Empowerment',
      category: 'student',
      scope: 'Central',
      benefits: 'Full/partial reimbursement of college academic fees and monthly student maintenance allowance.',
      eligibilityInfo: 'SC, ST, OBC and Minority students studying at post-matriculation levels with family income under ₹2.5 Lakhs.',
      requiredDocuments: ['College fee structure receipt', 'Family Income Certificate', 'Caste certificate', 'Previous year marksheet'],
      applyUrl: 'https://scholarships.gov.in'
    },
    {
      id: 'ladli-behna',
      title: 'Ladli Behna Yojana',
      ministry: 'Department of Women & Child Development',
      category: 'women',
      scope: 'State',
      state: 'Madhya Pradesh',
      benefits: 'Monthly financial support of ₹1,250 directly credited to women heads of families.',
      eligibilityInfo: 'Married/unmarried women resident of Madhya Pradesh aged between 21 and 60 years with family income below ₹2.5 Lakhs.',
      requiredDocuments: ['MP Samagra ID card', 'Aadhaar Card', 'Domicile certificate of MP', 'Mobile linked Bank account'],
      applyUrl: 'https://cmladlibahna.mp.gov.in'
    },
    {
      id: 'standup-india',
      title: 'Stand-Up India Scheme',
      ministry: 'Ministry of Finance',
      category: 'women',
      scope: 'Central',
      benefits: 'Bank loans between ₹10 Lakhs and ₹1 Crore for setting up greenfield trading or manufacturing businesses.',
      eligibilityInfo: 'At least one SC/ST or Female entrepreneur per bank branch above 18 years of age.',
      requiredDocuments: ['Detailed project report', 'Business registration certificate', 'Aadhaar card', 'Security pledge (if any)'],
      applyUrl: 'https://www.standupmitra.in'
    }
  ];

  const handleTestEligibility = () => {
    // Filter schemes based on user parameters
    const filtered = schemesData.filter((sch) => {
      // Basic checks
      if (sch.category === 'student' && userAge > 30) return false;
      if (sch.category === 'women' && userGender !== 'Female') return false;
      
      // Income checks
      if (sch.id === 'post-matric' && userIncome > 250000) return false;
      if (sch.id === 'ladli-behna' && userIncome > 250000) return false;

      // Caste check for post matric
      if (sch.id === 'post-matric' && userCaste === 'General') return false;

      return true;
    });

    setMatchedSchemes(filtered);
  };

  const filteredSchemes = schemesData.filter((sch) => {
    const matchesSearch = sch.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sch.ministry.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || sch.category === selectedCategory;
    const matchesState = selectedState === 'all' || (sch.scope === 'State' && sch.state === selectedState) || (selectedState === 'Central' && sch.scope === 'Central');

    return matchesSearch && matchesCategory && matchesState;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-850">
        <span className="bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-500/30">AROHI Schemes Module</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">Government Schemes Matchmaker</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">Search and verify eligibility for central and state welfare benefits. Input your background demographics to let AROHI pull aligned grants, capital subsidies, and scholarship options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Eligibility Tester */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md space-y-4">
            
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-blue-600" /> Instant Eligibility Analyzer
            </h3>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Your Age</label>
                <input
                  type="number"
                  value={userAge}
                  onChange={(e) => setUserAge(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Annual Family Income</label>
                <input
                  type="number"
                  value={userIncome}
                  onChange={(e) => setUserIncome(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Gender</label>
                <select
                  value={userGender}
                  onChange={(e) => setUserGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Caste Category</label>
                <select
                  value={userCaste}
                  onChange={(e) => setUserCaste(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="General">General Category</option>
                  <option value="OBC">OBC</option>
                  <option value="SC/ST">SC / ST</option>
                  <option value="Minority">Minority Community</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleTestEligibility}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Analyze Aligned Schemes
            </button>

          </div>

          {matchedSchemes && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl shadow-sm text-emerald-800 space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" /> Matched Benefits Found ({matchedSchemes.length})
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {matchedSchemes.length > 0 ? (
                  matchedSchemes.map((item) => (
                    <div key={item.id} className="text-xs bg-white border border-emerald-150 p-2.5 rounded-xl font-bold text-slate-800 flex justify-between items-center shadow-sm">
                      <div className="truncate">
                        <span className="block truncate">{item.title}</span>
                        <span className="block text-[9px] text-slate-400 font-medium">{item.ministry}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 font-semibold text-center">No precise scheme matches family income thresholds. Try lower limits.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Search and Schemes listings */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-md flex flex-col md:flex-row gap-3 items-center">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Search by scheme title, benefits or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2 pl-9 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none w-full md:w-auto"
            >
              <option value="all">All Categories</option>
              <option value="msme">MSME Businesses</option>
              <option value="farmer">Agriculture / Farmers</option>
              <option value="women">Women Welfare</option>
              <option value="student">Student Scholarships</option>
            </select>

            {/* Scope Filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none w-full md:w-auto"
            >
              <option value="all">All Scopes</option>
              <option value="Central">Central Schemes</option>
              <option value="Madhya Pradesh">MP State Schemes</option>
            </select>

          </div>

          {/* Scheme cards */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {filteredSchemes.map((sch) => (
              <div key={sch.id} className="bg-white rounded-xl border border-slate-150/65 shadow-sm p-5 space-y-3.5 hover:border-blue-200 transition-colors">
                
                <div className="flex justify-between items-start gap-2">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                        sch.scope === 'Central' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-800'
                      }`}>{sch.scope} Scheme</span>
                      <span className="text-[10px] text-slate-400 font-bold">{sch.state || 'National scope'}</span>
                    </div>
                    <h4 className="font-extrabold text-xs md:text-sm text-slate-800 mt-1.5">{sch.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{sch.ministry}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-150/50">
                  **Key Benefits:** {sch.benefits}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div>
                    <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">Standard Eligibility</span>
                    <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{sch.eligibilityInfo}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">Required Documents</span>
                    <ul className="list-disc list-inside space-y-0.5 text-[10px] text-slate-500 font-medium">
                      {sch.requiredDocuments.slice(0, 3).map((d, i) => <li key={i} className="truncate">{d}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <a
                    href={sch.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-2 px-3.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    Apply on Official Portal <ChevronRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
