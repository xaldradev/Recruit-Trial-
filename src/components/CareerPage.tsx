import { useState } from 'react';
import { Sparkles, Map, TrendingUp, HelpCircle, Clipboard, ChevronRight, BookOpen, Clock, Award, ShieldCheck } from 'lucide-react';
import InteractiveD3Roadmap from './InteractiveD3Roadmap';

interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  duration: string;
  skillsToLearn: string[];
  recommendedResources: string[];
  checkpointProject: string;
}

interface CareerRoadmap {
  title: string;
  estimatedMonths: number;
  phases: RoadmapPhase[];
  criticalCertifications: string[];
  salaryExpectation: string;
}

export default function CareerPage() {
  const [targetField, setTargetField] = useState('Technology');
  const [targetRole, setTargetRole] = useState('Full Stack Web Developer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);

  // Assessment States
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<string | null>(null);

  const assessmentQuestions = [
    {
      q: 'Which of the following activities interests you the most?',
      options: [
        { label: 'Designing modern apps, writing code, or building software solutions', category: 'Technology' },
        { label: 'Analyzing investment charts, balancing budgets, or business strategy', category: 'Finance/Business' },
        { label: 'Educating people, training teams, or civil administration services', category: 'Public Administration & Teaching' },
        { label: 'Managing supply chain systems, defense forces, or logistical operations', category: 'Logistics/Defense' }
      ]
    },
    {
      q: 'What is your current highest level of education qualification?',
      options: [
        { label: 'High School Matric / 10th Pass / 12th Pass', category: 'Fresh Entry Level' },
        { label: 'Technical ITI / Diploma / Technical certification holder', category: 'Engineering/Technical' },
        { label: 'Graduation Degree (BA / B.Com / B.Sc / BCA / B.Tech)', category: 'Professional Graduate' },
        { label: 'Post-graduate (MA / M.Tech / MBA / PhD)', category: 'Postgraduate Expert' }
      ]
    },
    {
      q: 'Which environment matches your preference for working style?',
      options: [
        { label: 'Desk-oriented high-speed software development or desk analysis', category: 'Desk/Tech' },
        { label: 'Government structural hierarchy, law enforcement, or public interaction', category: 'Government/Service' },
        { label: 'Creative entrepreneurship, starting local manufacturing, or MSME trades', category: 'Startup/MSME' },
        { label: 'Teaching, content creation, or group guidance', category: 'Academics' }
      ]
    }
  ];

  const handleAssessmentAnswer = (category: string) => {
    const nextAnswers = [...answers, category];
    setAnswers(nextAnswers);

    if (assessmentStep < assessmentQuestions.length - 1) {
      setAssessmentStep(assessmentStep + 1);
    } else {
      // Complete assessment and generate dynamic outcome based on predominant votes
      const techVotes = nextAnswers.filter(a => a.includes('Tech') || a.includes('Desk')).length;
      const govVotes = nextAnswers.filter(a => a.includes('Public') || a.includes('Government')).length;
      const bizVotes = nextAnswers.filter(a => a.includes('Business') || a.includes('MSME')).length;

      let result = '';
      if (techVotes >= govVotes && techVotes >= bizVotes) {
        result = 'Software Engineering, UI/UX Design, and Cloud DevOps are your ideal fields! AROHI recommends focusing on React and cloud certifications.';
      } else if (govVotes >= techVotes && govVotes >= bizVotes) {
        result = 'Civil Services, Banking Cadre (IBPS), and Public Board sector jobs align with your systematic working style. Focus on exam preparations like SSC or State PCS.';
      } else {
        result = 'Entrepreneurship, MSME trading, and Startups fit your high-agency preference. Check out Mudra funding programs and the Business board!';
      }
      setAssessmentResult(result);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    setRoadmap(null);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field: targetField, targetRole: targetRole })
      });

      if (!response.ok) {
        throw new Error('API Roadmap failed');
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setRoadmap({
        title: `Career Roadmap: ${targetRole} (${targetField})`,
        estimatedMonths: 6,
        phases: [
          {
            phaseNumber: 1,
            title: 'Phase I: Essential Foundations',
            duration: 'Month 1-2',
            skillsToLearn: ['Core programming constructs', 'Git workflows', 'Basic UI Layouts'],
            recommendedResources: ['Official developer docs', 'YouTube beginner tutorials', 'LeetCode practice'],
            checkpointProject: 'Build and deploy a responsive static profile landing page.'
          },
          {
            phaseNumber: 2,
            title: 'Phase II: Frameworks & Scale',
            duration: 'Month 3-4',
            skillsToLearn: ['React framework logic', 'Tailwind styling classes', 'Rest APIs integration'],
            recommendedResources: ['Meta Front-End Certificate', 'FullStackOpen guidelines'],
            checkpointProject: 'Assemble a fully responsive job-board user interface.'
          },
          {
            phaseNumber: 3,
            title: 'Phase III: Deploy & Optimization',
            duration: 'Month 5-6',
            skillsToLearn: ['Node server structures', 'Cloud storage operations', 'Unit tests'],
            recommendedResources: ['AWS cloud documentation', 'Node.js best practices'],
            checkpointProject: 'Launch a fully persistent Full-Stack Opportunity tracker with local credentials.'
          }
        ],
        criticalCertifications: ['AWS Cloud Practitioner', 'Google Professional Developer'],
        salaryExpectation: '₹4,50,000 to ₹9,00,000 per annum for fresh candidates.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAssessment = () => {
    setAssessmentStep(0);
    setAnswers([]);
    setAssessmentResult(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-850">
        <span className="bg-rose-500/20 text-rose-400 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-rose-500/30">AROHI Career Module</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">AI Career Counselor</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">Take a smart personality/skills assessment or directly input your career goal to let AROHI blueprint a personalized roadmap to landing your dream job.</p>
      </div>

      {/* D3-based Interactive Career Roadmap Visualization */}
      <InteractiveD3Roadmap initialField={targetField} onFieldChange={setTargetField} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Assessment questionnaire */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <Clipboard className="w-4.5 h-4.5 text-blue-600" /> AROHI Skills & Career Assessment
            </h3>

            {assessmentResult ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold leading-relaxed">
                    <span className="block font-bold text-slate-800 mb-1">Your Diagnostic Result:</span>
                    {assessmentResult}
                  </div>
                </div>
                <button
                  onClick={resetAssessment}
                  className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center"
                >
                  Restart Assessment
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase">
                  <span>Question {assessmentStep + 1} of {assessmentQuestions.length}</span>
                  <span>Progress {Math.round(((assessmentStep) / assessmentQuestions.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all" style={{ width: `${((assessmentStep) / assessmentQuestions.length) * 100}%` }}></div>
                </div>

                <h4 className="font-extrabold text-xs md:text-sm text-slate-800 leading-snug mt-2">
                  {assessmentQuestions[assessmentStep].q}
                </h4>

                <div className="space-y-2.5 mt-4">
                  {assessmentQuestions[assessmentStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAssessmentAnswer(opt.category)}
                      className="w-full text-left p-3 border border-slate-150 hover:border-blue-300 hover:bg-blue-50/20 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer block leading-normal shadow-sm bg-slate-50"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Industry Trends Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-rose-500" /> Future High-Growth Sectors in India (2026)
            </h3>
            
            <div className="space-y-3">
              {[
                { name: 'AI & Data Science engineering', growth: '+142%', demand: 'Critical', color: 'bg-emerald-500' },
                { name: 'EV Logistics & Renewable tech', growth: '+98%', demand: 'High', color: 'bg-blue-500' },
                { name: 'MSME Manufacturing & Textiles', growth: '+74%', demand: 'Medium', color: 'bg-indigo-500' },
                { name: 'Cloud Architects & Security', growth: '+112%', demand: 'Critical', color: 'bg-purple-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0 font-semibold">
                  <div className="space-y-0.5">
                    <span className="block text-slate-800 font-bold">{item.name}</span>
                    <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider leading-none ${
                      item.demand === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>{item.demand} Demand</span>
                  </div>
                  <span className="text-emerald-600 font-black text-sm">{item.growth}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Career Roadmap Generator */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5 border-b border-slate-50 pb-2.5">
              <Map className="w-4.5 h-4.5 text-blue-600" /> AROHI Roadmap Generator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Industry Sector</label>
                <select
                  value={targetField}
                  onChange={(e) => setTargetField(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Technology">Technology & Software</option>
                  <option value="Banking">Banking & Financial Services</option>
                  <option value="Public Administration">Central / State Exams</option>
                  <option value="Entrepreneurship">MSME & Startups</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. AWS Cloud Architect"
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating || !targetRole.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? 'Mapping Career Pathway...' : 'Generate Roadmap Blueprint'}
            </button>
          </div>

          {roadmap ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-base font-black text-slate-900">{roadmap.title}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1">Estimated Prep: {roadmap.estimatedMonths} Months to Job Ready</p>
                </div>
                <div className="bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg border border-blue-100 text-[11px] font-black shrink-0">
                  Avg Salary: {roadmap.salaryExpectation}
                </div>
              </div>

              {/* Phases */}
              <div className="space-y-6 relative border-l border-blue-100 pl-5 ml-2">
                {roadmap.phases.map((phase) => (
                  <div key={phase.phaseNumber} className="relative space-y-2">
                    {/* Circle Node */}
                    <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-4 border-white shadow"></div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">{phase.duration}</span>
                      <h5 className="font-extrabold text-xs md:text-sm text-slate-800">{phase.title}</h5>
                    </div>

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {phase.skillsToLearn.map((skill, idx) => (
                        <span key={idx} className="bg-slate-50 border border-slate-150 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      **Recommended Resources:** {phase.recommendedResources.join(', ')}
                    </p>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5 text-[11px] font-semibold text-emerald-800 leading-relaxed">
                      <span className="font-black text-[9px] uppercase tracking-wider text-emerald-600 block mb-0.5">Checkpoint Milestones Project</span>
                      {phase.checkpointProject}
                    </div>

                  </div>
                ))}
              </div>

              {/* Certifications Box */}
              <div className="bg-slate-50 border border-slate-150/60 p-4 rounded-xl mt-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">AROHI Recommended Certifications</span>
                <div className="flex flex-wrap gap-1.5">
                  {roadmap.criticalCertifications.map((cert, idx) => (
                    <span key={idx} className="bg-white border border-slate-150 text-slate-700 font-extrabold text-xs px-2.5 py-1 rounded-lg">
                      🏆 {cert}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-2">
              <Map className="w-8 h-8 text-slate-400 animate-pulse" />
              <h4 className="font-extrabold text-slate-800 text-xs md:text-sm">No Roadmap Generated</h4>
              <p className="text-xs text-slate-400 max-w-sm">Enter your preferred job title or select options above to map your study phase checkpoints directly.</p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
