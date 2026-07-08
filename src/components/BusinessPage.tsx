import { useState } from 'react';
import { Sparkles, Landmark, Rocket, CheckSquare, Plus, DollarSign, ArrowRight, HelpCircle, FileCheck, Info } from 'lucide-react';

interface FundingOption {
  schemeName: string;
  limit: string;
  subsidy: string;
  bestFor: string;
}

interface Validation {
  marketScore: number;
  feasibility: string;
  fundingSchemes: FundingOption[];
  msmeCategory: string;
  checklist: string[];
  growthMilestones: string[];
}

export default function BusinessPage() {
  const [idea, setIdea] = useState('');
  const [sector, setSector] = useState('Agri-Tech / Farming');
  const [investment, setInvestment] = useState('₹50,000 - ₹5,000,000');
  const [locationType, setLocationType] = useState('Rural Area');
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<Validation | null>(null);

  // Cost calculator states
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [monthlyInventory, setMonthlyInventory] = useState(25000);
  const [marketingCost, setMarketingCost] = useState(5000);

  const handleValidateIdea = () => {
    if (!idea.trim()) return;
    setIsValidating(true);
    setValidation(null);

    setTimeout(() => {
      // Dynamic simulated business validations based on sector
      let isAgri = sector.toLowerCase().includes('agri');
      let isRetail = sector.toLowerCase().includes('retail');

      setValidation({
        marketScore: 84,
        feasibility: `Your business idea targeting **"${sector}"** in a **"${locationType}"** is highly feasible with low-to-medium capital entry thresholds. Traditional and digital integration will expand local demand.`,
        msmeCategory: isAgri ? 'Primary Agriculture / Allied MSME micro-enterprise' : 'Services / Trading micro-enterprise',
        fundingSchemes: [
          {
            schemeName: 'Pradhan Mantri Mudra Yojana (PMMY) - Shishu Category',
            limit: 'Loans up to ₹50,000',
            subsidy: 'No collateral required. 2% interest subvention for timely payments.',
            bestFor: 'Initial inventory acquisition or local shop equipment setup.'
          },
          {
            schemeName: "Prime Minister's Employment Generation Programme (PMEGP)",
            limit: 'Up to ₹50 Lakhs (Manufacturing) | ₹20 Lakhs (Services)',
            subsidy: 'Rural Subsidy: 35% of project cost | Urban Subsidy: 25% of project cost.',
            bestFor: 'Higher capital machinery or local factory building.'
          },
          {
            schemeName: 'Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)',
            limit: 'Collateral-free loans up to ₹2 Crores',
            subsidy: 'Guaranteed by SIDBI/Govt. with zero asset collateral.',
            bestFor: 'Scalable service platforms or retail agencies.'
          }
        ],
        checklist: [
          'Register on Udyam Registration Portal (100% Free, provides MSME certificate).',
          'Apply for a Business PAN Card and local Municipal Trade license.',
          'Open a Business Current Account with an authorized Public/Private Bank.',
          'Apply for GSTIN (Goods and Services Tax Identification Number) if turnover exceeds ₹40 Lakhs (or ₹20 Lakhs in hill states).'
        ],
        growthMilestones: [
          'Month 1: Prototype launch / local market testing with a micro-budget.',
          'Month 3: Secure initial Mudra Shishu funding & expand logistics.',
          'Month 6: Onboard 500+ local customers and apply for PMEGP rural subsidy.',
          'Month 12: Hire secondary employees and scale state-wide trading channels.'
        ]
      });
      setIsValidating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-850">
        <span className="bg-blue-600/20 text-blue-400 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/30">AROHI Business Advisor</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">MSME & Startup Idea Validator</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">Validate local business concepts. Assess market viability, map immediate MSME registration pathways, check CGTMSE or Mudra funding eligibility, and draft project launch frameworks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input parameters left */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md space-y-4">
            
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Rocket className="w-4.5 h-4.5 text-blue-600" /> Startup Idea Specification
            </h3>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Sector Classification</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Agri-Tech / Farming">Agri-Tech / Allied Farming</option>
                <option value="Food Processing / Bakery">Food Processing & Local Bakery</option>
                <option value="Handloom / Textiles">Handloom, Handicrafts & Textiles</option>
                <option value="Retail shop / Trading">Retail Stores & Local Trading</option>
                <option value="IT platform / Software service">Software / App Platforms</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Proposed Capital Range</label>
              <select
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Under ₹50,000">Micro-budget (Under ₹50,000)</option>
                <option value="₹50,000 - ₹5,000,000">Seed-capital (₹50,000 - ₹5 Lakhs)</option>
                <option value="₹500,000 - ₹2,000,000">Medium manufacturing (₹5 Lakhs - ₹20 Lakhs)</option>
                <option value="Above ₹2,000,000">Scalable enterprise (Above ₹20 Lakhs)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Launch Location Segment</label>
              <div className="grid grid-cols-2 gap-2">
                {['Rural Area', 'Urban Center'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocationType(l)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                      locationType === l
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-50 border-slate-150 text-slate-700'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Detail Business Description</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. Starting an organic honey and beeswax retail store sourcing directly from local rural bee keepers in Karnataka."
                rows={4}
                className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              onClick={handleValidateIdea}
              disabled={isValidating || !idea.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isValidating ? 'AROHI Analysis running...' : 'Validate Business Framework'}
            </button>
          </div>

          {/* Quick interactive MSME Cost calculator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <DollarSign className="w-4.5 h-4.5 text-emerald-500" /> Micro-Business Cost Planner
            </h3>

            <div className="space-y-3">
              <div>
                <label className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Monthly Store Rent / Cloud costs</span>
                  <span className="font-extrabold text-slate-800">₹{monthlyRent}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="5000"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Initial Inventory / Raw Materials</span>
                  <span className="font-extrabold text-slate-800">₹{monthlyInventory}</span>
                </label>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={monthlyInventory}
                  onChange={(e) => setMonthlyInventory(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Marketing & Local Listing cost</span>
                  <span className="font-extrabold text-slate-800">₹{marketingCost}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="30000"
                  step="1000"
                  value={marketingCost}
                  onChange={(e) => setMarketingCost(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 flex justify-between items-center">
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-black tracking-wider leading-none">Total Run Capital Req.</span>
                  <span className="block text-base font-black text-slate-900 mt-1">₹{monthlyRent + monthlyInventory + marketingCost}</span>
                </div>
                <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">
                  Mudra eligible
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Validation Results Right */}
        <div className="lg:col-span-7">
          {validation ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 space-y-6">
              
              {/* Score card */}
              <div className="bg-slate-50 border border-slate-150/65 p-4.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Market Feasibility index</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-blue-600">{validation.marketScore}%</span>
                    <span className="text-xs font-extrabold text-emerald-600 uppercase">Highly Profitable</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                    {validation.feasibility}
                  </p>
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0">
                  {validation.msmeCategory}
                </div>
              </div>

              {/* Funding suggestions */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
                  <Landmark className="w-4.5 h-4.5 text-blue-600" /> AROHI Government Loan Matching
                </h4>
                <div className="space-y-3">
                  {validation.fundingSchemes.map((item, idx) => (
                    <div key={idx} className="border border-slate-150/80 rounded-xl p-3.5 hover:border-blue-200 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                        <span className="text-xs font-black text-slate-800">{item.schemeName}</span>
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-black px-2 py-0.5 rounded leading-none shrink-0 uppercase">
                          {item.limit}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 leading-normal">
                        **Feature details:** {item.subsidy}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-500 font-bold bg-slate-50 py-1 px-2 rounded">
                        💡 Best used for: {item.bestFor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance & Registration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/60">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2.5">
                    <FileCheck className="w-4 h-4 text-blue-600" /> Licensing Requirements
                  </h5>
                  <div className="space-y-2">
                    {validation.checklist.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[11px] text-slate-600 font-medium leading-normal">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/60">
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-2.5">
                    <Info className="w-4 h-4 text-emerald-600" /> AROHI Launch Roadmap
                  </h5>
                  <div className="space-y-2">
                    {validation.growthMilestones.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[11px] text-slate-600 font-medium leading-normal">
                        <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1 py-0.5 rounded-md leading-none shrink-0 mt-0.5">STEP</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-2.5">
              <Landmark className="w-8 h-8 text-slate-400 animate-pulse" />
              <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">No Active Business Plan Analyzed</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Draft your entrepreneurial concept description in the left configuration container to calculate feasibility and pull central registration requirements.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
