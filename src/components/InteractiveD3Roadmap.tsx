import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Award, ShieldCheck, Compass, TrendingUp, Sparkles, BookOpen, Clock, Briefcase, ArrowRight } from 'lucide-react';

interface Milestone {
  id: string;
  stage: 'Entry' | 'Associate' | 'Mid-Level' | 'Senior Position';
  title: string;
  experience: string;
  keyFocus: string;
  certifications: string[];
  salary: string;
  arohiTip: string;
  resources: string[];
  x: number; // relative SVG coords
  y: number;
}

interface CareerPathData {
  field: string;
  label: string;
  description: string;
  milestones: Milestone[];
}

const ROADMAP_DATA: Record<string, CareerPathData> = {
  Technology: {
    field: 'Technology',
    label: 'Technology & Software',
    description: 'Path for Software Engineers, Full-Stack Developers, and Cloud Architects.',
    milestones: [
      {
        id: 'tech-1',
        stage: 'Entry',
        title: 'Junior Software Engineer',
        experience: '0 - 2 Years',
        keyFocus: 'Mastering programming syntax, Git workflows, semantic web layout, and relational databases. Resolving small bugs and shipping isolated UI features.',
        certifications: ['AWS Cloud Practitioner', 'React Foundations'],
        salary: '₹4,00,000 - ₹6,50,000 per annum',
        arohiTip: 'Prioritize writing highly readable code and mastering Git branch management before frameworks.',
        resources: ['MDN Web Docs', 'Git Immersion', 'Scrimba React Course'],
        x: 60,
        y: 150
      },
      {
        id: 'tech-2',
        stage: 'Associate',
        title: 'Professional Developer',
        experience: '2 - 5 Years',
        keyFocus: 'Owning modular architectures, API integrations, writing rigorous test suites, database schema migrations, and CI/CD automation.',
        certifications: ['AWS Certified Developer Associate', 'Certified ScrumMaster (CSM)'],
        salary: '₹7,50,000 - ₹13,00,000 per annum',
        arohiTip: 'Take active ownership of production deployment pipelines and volunteer for database performance tuning.',
        resources: ['Refactoring.Guru', 'Full Stack Open', 'Testing JavaScript'],
        x: 180,
        y: 70
      },
      {
        id: 'tech-3',
        stage: 'Mid-Level',
        title: 'Tech Lead / Architect',
        experience: '5 - 8 Years',
        keyFocus: 'Designing scalable distributed systems, high availability patterns, cloud costing, mentoring junior talent, and scoping complex business directives.',
        certifications: ['AWS Solutions Architect Professional', 'Google Cloud Architect'],
        salary: '₹14,00,000 - ₹24,00,000 per annum',
        arohiTip: 'Bridge engineering execution with product goals by speaking both technical and commercial languages fluently.',
        resources: ['Designing Data-Intensive Applications', 'System Design Primer'],
        x: 320,
        y: 160
      },
      {
        id: 'tech-4',
        stage: 'Senior Position',
        title: 'Director of Engineering',
        experience: '8+ Years',
        keyFocus: 'Formulating technology strategies, scaling engineering groups, budget forecasting, policy compliance, and establishing engineering culture.',
        certifications: ['TOGAF Enterprise Architecture', 'ITIL Strategic Leader'],
        salary: '₹25,00,000 - ₹50,00,000+ per annum',
        arohiTip: 'Your output is now measured by your organization\'s efficiency and the leaders you grow, not the lines of code you push.',
        resources: ['The Manager\'s Path by Camille Fournier', 'Staff Eng Guides'],
        x: 440,
        y: 80
      }
    ]
  },
  Banking: {
    field: 'Banking',
    label: 'Banking & Financial Services',
    description: 'Path for Account Officers, Risk Analysts, and Wealth Administrators.',
    milestones: [
      {
        id: 'bank-1',
        stage: 'Entry',
        title: 'Bank Clerk / Finance Associate',
        experience: '0 - 2 Years',
        keyFocus: 'Securing daily balances, deposit processing, retail KYC checks, customer compliance guidelines, and automated teller system operations.',
        certifications: ['JAIIB Certification', 'NISM Investment Operations Module'],
        salary: '₹3,50,000 - ₹5,00,000 per annum',
        arohiTip: 'Hone high-accuracy speed on operational banking softwares to build immediate supervisor trust.',
        resources: ['IIBF Study Guides', 'NISM Certification Prep Portal'],
        x: 60,
        y: 150
      },
      {
        id: 'bank-2',
        stage: 'Associate',
        title: 'Probationary Officer (PO) / RM',
        experience: '2 - 5 Years',
        keyFocus: 'Performing high-value credit assessments, credit scoring, underwriting loans, portfolio diversification, and managing key corporate relationships.',
        certifications: ['CAIIB Certification', 'CFA Level I'],
        salary: '₹6,50,000 - ₹10,50,000 per annum',
        arohiTip: 'Develop strong communication skills to cross-sell retail asset projects and navigate underwriting audits.',
        resources: ['Commercial Lending Analysis', 'CFA Institute Curriculum'],
        x: 180,
        y: 70
      },
      {
        id: 'bank-3',
        stage: 'Mid-Level',
        title: 'Assistant Branch Manager',
        experience: '5 - 8 Years',
        keyFocus: 'Conducting branch operation audits, approving commercial loans, enforcing local RBI regulations, and managing recovery profiles.',
        certifications: ['FRM (Financial Risk Manager)', 'Certified Credit Professional'],
        salary: '₹11,00,000 - ₹19,00,000 per annum',
        arohiTip: 'Strictly monitor the branch Non-Performing Assets (NPAs) ratio and run regular credit compliance audits.',
        resources: ['RBI Master Circulars', 'Risk Management in Banks'],
        x: 320,
        y: 160
      },
      {
        id: 'bank-4',
        stage: 'Senior Position',
        title: 'Regional Director / VP Finance',
        experience: '8+ Years',
        keyFocus: 'Guiding state-wide retail banking policies, massive capital budgets, high-value asset acquisitions, and driving digital banking initiatives.',
        certifications: ['Executive Financial Leadership', 'Certified Public Accountant (CPA)'],
        salary: '₹20,00,000 - ₹40,00,000+ per annum',
        arohiTip: 'Drive AI-based underwriting models to reduce default rates while keeping high-touch corporate lending relationships solid.',
        resources: ['Harvard Business School Finance', 'Indian Banking Association Briefs'],
        x: 440,
        y: 80
      }
    ]
  },
  'Public Administration': {
    field: 'Public Administration',
    label: 'Central & State Exams',
    description: 'Path for Administrative Services, Secretariat Staff, and Public Officers.',
    milestones: [
      {
        id: 'gov-1',
        stage: 'Entry',
        title: 'Assistant Section Officer (ASO)',
        experience: '0 - 3 Years',
        keyFocus: 'Registering file movements, conducting basic policy verification checks, maintaining administrative registers, and servicing public grievances.',
        certifications: ['State PSC / SSC CGL Qualified', 'NIELIT CCC Computer Course'],
        salary: '₹4,80,000 - ₹6,50,000 per annum',
        arohiTip: 'Master the official Secretariat Manual of Office Procedure and state-related civil codes early.',
        resources: ['MOP Secretariat Guides', 'Laxmikanth Indian Polity'],
        x: 60,
        y: 150
      },
      {
        id: 'gov-2',
        stage: 'Associate',
        title: 'Section Officer / Circle Inspector',
        experience: '3 - 7 Years',
        keyFocus: 'Supervising secretariat sections, coordinating multi-department clearances, approving land surveys, and executing public schemes.',
        certifications: ['Administrative Academy In-Service Exam', 'National E-Governance Workshop'],
        salary: '₹7,50,000 - ₹12,00,000 per annum',
        arohiTip: 'Lead grievance resolution camps directly to understand field realities and build positive community relations.',
        resources: ['DARPG E-Governance Guidelines', 'Land Revenue Manuals'],
        x: 180,
        y: 70
      },
      {
        id: 'gov-3',
        stage: 'Mid-Level',
        title: 'Sub-Divisional Magistrate (SDM)',
        experience: '7 - 12 Years',
        keyFocus: 'Maintaining law and order, acting as executive magistrate, deploying district budgets, and leading local disaster management teams.',
        certifications: ['Mid-Career IAS / State Cadre Program', 'Executive Public Policy Certificate'],
        salary: '₹12,50,000 - ₹20,00,000 per annum',
        arohiTip: 'Keep a cool head during crises and master multi-agency coordination with police and medical networks.',
        resources: ['Disaster Management Act Protocols', 'Administrative Law Handbooks'],
        x: 320,
        y: 160
      },
      {
        id: 'gov-4',
        stage: 'Senior Position',
        title: 'District Magistrate / Joint Secretary',
        experience: '12+ Years',
        keyFocus: 'Formulating district development masterplans, advising state ministries, drafting bills, managing central subsidies, and leading department policy.',
        certifications: ['NITI Aayog Policy Integration Fellowship', 'LBSNAA Executive Seminar'],
        salary: '₹18,00,000 - ₹30,00,000+ per annum',
        arohiTip: 'Synthesize complex macro-economic data into simple, actionable public welfare programs.',
        resources: ['Economic Survey of India', 'NITI Aayog Strategy Reports'],
        x: 440,
        y: 80
      }
    ]
  },
  Entrepreneurship: {
    field: 'Entrepreneurship',
    label: 'MSME & Local Startups',
    description: 'Path for Business Founders, Retail Proprietors, and Manufacturers.',
    milestones: [
      {
        id: 'biz-1',
        stage: 'Entry',
        title: 'Budding Founder (Udyam Shishu)',
        experience: '0 - 1 Year',
        keyFocus: 'Securing legal registrations, launching minimal products, running local consumer surveys, and managing micro-capital.',
        certifications: ['Udyam MSME Registration', 'Mudra Shishu Scheme Validation'],
        salary: '₹2,00,000 - ₹6,00,000 (Owner Equity/Salary)',
        arohiTip: 'Run small physical trials to validate local customer purchase behavior before investing major debt.',
        resources: ['MSME Odisha Support Hub', 'Startup India Learning Modules'],
        x: 60,
        y: 150
      },
      {
        id: 'biz-2',
        stage: 'Associate',
        title: 'Operational Lead (Kishore)',
        experience: '1 - 3 Years',
        keyFocus: 'Hiring core team members, obtaining GST registrations, negotiating merchant logistics contracts, and scaling customer acquisitions.',
        certifications: ['GSTIN Registration', 'Mudra Kishore Scheme Credit Approval'],
        salary: '₹7,00,000 - ₹14,00,000 (Profits & Draw)',
        arohiTip: 'Adopt basic accounting software like Tally Prime or Vyapar early to manage cash reserves.',
        resources: ['Tally Academy Tutorials', 'Indian GST Filing Guides'],
        x: 180,
        y: 70
      },
      {
        id: 'biz-3',
        stage: 'Mid-Level',
        title: 'Scale Enterprise Owner (Tarun)',
        experience: '3 - 6 Years',
        keyFocus: 'Automating production assemblies, expanding to multi-district logistics, building formal distributor networks, and obtaining quality seals.',
        certifications: ['ISO 9001:2015 Quality Mark', 'MSME ZED Bronze/Silver Rating'],
        salary: '₹15,00,000 - ₹32,00,000 (Business Profits)',
        arohiTip: 'Utilize central credit guarantee schemes (CGTMSE) to source collateral-free machinery expansion loans.',
        resources: ['ISO Quality Manuals', 'ZED Certification Portal'],
        x: 320,
        y: 160
      },
      {
        id: 'biz-4',
        stage: 'Senior Position',
        title: 'Enterprise Chairman / Director',
        experience: '6+ Years',
        keyFocus: 'Developing national franchising blueprints, executing strategic brand acquisitions, negotiating equity stakes, and steering corporate boards.',
        certifications: ['CII Business Council Member', 'FICCI Leadership Credentials'],
        salary: '₹40,00,000+ (Enterprise Value & Equity)',
        arohiTip: 'Step back from operational firefighting. Hire trusted managers so you can focus entirely on capital deployment.',
        resources: ['FICCI SME Grow Manuals', 'Strategic Mergers and Acquisitions'],
        x: 440,
        y: 80
      }
    ]
  }
};

interface InteractiveD3RoadmapProps {
  initialField?: string;
  onSelectMilestone?: (milestone: Milestone) => void;
  onFieldChange?: (field: string) => void;
}

export default function InteractiveD3Roadmap({ initialField = 'Technology', onSelectMilestone, onFieldChange }: InteractiveD3RoadmapProps) {
  const [selectedField, setSelectedField] = useState<string>(initialField);
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState<number>(0);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Sync field state if prop changes
  useEffect(() => {
    if (ROADMAP_DATA[initialField]) {
      setSelectedField(initialField);
      setActiveMilestoneIdx(0);
    }
  }, [initialField]);

  const activePathData = ROADMAP_DATA[selectedField] || ROADMAP_DATA.Technology;
  const milestones = activePathData.milestones;
  const currentMilestone = milestones[activeMilestoneIdx];

  // Callback to parent if selected
  useEffect(() => {
    if (onSelectMilestone) {
      onSelectMilestone(currentMilestone);
    }
  }, [currentMilestone, onSelectMilestone]);

  // Handle D3 Chart Rendering
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 500;
    const height = 240;

    // Define curves and points
    const points: [number, number][] = milestones.map(m => [m.x, m.y]);

    // Create custom smooth curve generator
    const lineGenerator = d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveCardinal.tension(0.1));

    const pathData = lineGenerator(points);

    // Filter/Gradient Definitions
    const defs = svg.append('defs');

    // Glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'blur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Gradient definitions
    const gradient = defs.append('linearGradient')
      .attr('id', 'path-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#3b82f6'); // blue-500

    gradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#8b5cf6'); // violet-500

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ec4899'); // pink-500

    // Draw background dashed path
    svg.append('path')
      .attr('d', pathData || '')
      .attr('fill', 'none')
      .attr('stroke', '#1e1a3e')
      .attr('stroke-width', 6)
      .attr('stroke-linecap', 'round');

    // Draw main glowing gradient path
    const mainPath = svg.append('path')
      .attr('d', pathData || '')
      .attr('fill', 'none')
      .attr('stroke', 'url(#path-grad)')
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('class', 'main-journey-path');

    // Path draw-in animation
    const totalLength = (mainPath.node() as SVGPathElement)?.getTotalLength() || 1000;
    mainPath
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1000)
      .ease(d3.easeQuadOut)
      .attr('stroke-dashoffset', 0);

    // Draw connector halos & rings for each point
    const nodeGroups = svg.selectAll('.milestone-node')
      .data(milestones)
      .enter()
      .append('g')
      .attr('class', 'milestone-node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .style('cursor', 'pointer');

    // Outer interactive invisible catch circles
    nodeGroups.append('circle')
      .attr('r', 24)
      .attr('fill', 'transparent');

    // Outer pulsate glowing ring for the active node
    nodeGroups.append('circle')
      .attr('r', d => d.id === currentMilestone.id ? 14 : 10)
      .attr('fill', 'none')
      .attr('stroke', (d, i) => i === activeMilestoneIdx ? '#f59e0b' : '#6366f1')
      .attr('stroke-width', d => d.id === currentMilestone.id ? 2.5 : 1.5)
      .attr('stroke-dasharray', d => d.id === currentMilestone.id ? '3 1' : 'none')
      .attr('class', d => d.id === currentMilestone.id ? 'active-pulse-ring' : '')
      .style('filter', d => d.id === currentMilestone.id ? 'url(#glow)' : 'none');

    // Inner core circle
    nodeGroups.append('circle')
      .attr('r', d => d.id === currentMilestone.id ? 7 : 5)
      .attr('fill', d => d.id === currentMilestone.id ? '#f59e0b' : '#312e81')
      .attr('stroke', d => d.id === currentMilestone.id ? '#fff' : '#6366f1')
      .attr('stroke-width', 2);

    // Simple tooltip label backgrounds for text
    nodeGroups.append('rect')
      .attr('x', -50)
      .attr('y', d => d.y > 110 ? -42 : 14)
      .attr('width', 100)
      .attr('height', 20)
      .attr('rx', 6)
      .attr('fill', '#09061a')
      .attr('stroke', d => d.id === currentMilestone.id ? '#f59e0b' : '#221e42')
      .attr('stroke-width', 1);

    // Labels for stages
    nodeGroups.append('text')
      .text(d => d.stage)
      .attr('x', 0)
      .attr('y', d => d.y > 110 ? -28 : 28)
      .attr('text-anchor', 'middle')
      .attr('fill', d => d.id === currentMilestone.id ? '#fbbf24' : '#94a3b8')
      .attr('font-size', '8px')
      .attr('font-family', 'ui-sans-serif, system-ui, sans-serif')
      .attr('font-weight', 'bold');

    // Title label below the stage
    nodeGroups.append('text')
      .text(d => d.title.length > 18 ? d.title.slice(0, 16) + '...' : d.title)
      .attr('x', 0)
      .attr('y', d => d.y > 110 ? -52 : 44)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '8px')
      .attr('font-weight', 'medium')
      .attr('opacity', 0.85);

    // Click behavior
    nodeGroups.on('click', (event, d) => {
      const idx = milestones.findIndex(m => m.id === d.id);
      if (idx !== -1) {
        setActiveMilestoneIdx(idx);
      }
    });

    // Hover tooltip/focus adjustments
    nodeGroups.on('mouseover', function(event, d) {
      d3.select(this).select('circle:nth-of-type(2)')
        .transition()
        .duration(150)
        .attr('r', 16)
        .attr('stroke', '#fbbf24');
    });

    nodeGroups.on('mouseout', function(event, d) {
      const isCurrent = d.id === currentMilestone.id;
      d3.select(this).select('circle:nth-of-type(2)')
        .transition()
        .duration(150)
        .attr('r', isCurrent ? 14 : 10)
        .attr('stroke', isCurrent ? '#f59e0b' : '#6366f1');
    });

  }, [selectedField, activeMilestoneIdx, milestones, currentMilestone]);

  return (
    <div className="bg-gradient-to-br from-[#120c2a] via-[#070514] to-[#1c1240] border border-[#2d2163] rounded-3xl p-5 sm:p-7 shadow-2xl text-left space-y-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Title & Path selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#211b42] pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1 bg-[#7c3aed]/10 text-[#c084fc] border border-[#7c3aed]/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Compass className="w-3 h-3 text-[#a78bfa] animate-spin" style={{ animationDuration: '6s' }} /> Interactive Pathway Navigator
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">Interactive Milestone Explorer</h3>
          <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
            Select a pathway to explore typical career progressions from <span className="text-emerald-400">Entry</span> to <span className="text-amber-400">Senior positions</span> in India.
          </p>
        </div>

        {/* Dynamic Selector Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {Object.values(ROADMAP_DATA).map((path) => (
            <button
              key={path.field}
              onClick={() => {
                setSelectedField(path.field);
                setActiveMilestoneIdx(0);
                if (onFieldChange) {
                  onFieldChange(path.field);
                }
              }}
              className={`text-[10px] font-extrabold py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                selectedField === path.field
                  ? 'bg-[#7c3aed] border-[#c084fc]/50 text-white shadow-lg'
                  : 'bg-[#18133a]/80 border-[#2b1f5c] text-slate-300 hover:border-[#4c3997] hover:text-white'
              }`}
            >
              {path.label}
            </button>
          ))}
        </div>
      </div>

      {/* D3 SVG Canvas Container */}
      <div className="bg-[#09061c]/80 border border-[#211b4a] rounded-2xl p-2 md:p-4 flex items-center justify-center relative shadow-inner">
        <div className="absolute top-2 left-3 flex items-center gap-1.5 bg-[#0f0b26] px-2 py-0.5 rounded border border-[#241a52]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Active SVG Path Engine</span>
        </div>

        <svg
          ref={svgRef}
          viewBox="0 0 500 240"
          className="w-full max-w-[500px] h-auto text-white select-none transition-all"
        ></svg>

        {/* Mini legend indicators */}
        <div className="absolute bottom-2 right-3 flex items-center gap-3 text-[8px] font-bold text-slate-400 uppercase tracking-wider bg-[#0f0b26] px-2.5 py-1 rounded border border-[#241a52]">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span> Selected
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]"></span> Step
          </div>
        </div>
      </div>

      {/* Highlighted Selected Milestone Deep-dive card */}
      <div className="bg-[#0d0924] border border-[#291f58] rounded-2xl p-5 text-left relative overflow-hidden transition-all">
        {/* Glow border line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        <div className="space-y-4">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#211949] pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] to-[#a855f7] text-white flex items-center justify-center font-black text-sm uppercase shadow-md shrink-0">
                {currentMilestone.stage.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black bg-[#fbbf24]/10 text-yellow-400 border border-[#fbbf24]/20 px-2 py-0.5 rounded-md uppercase">
                    Stage: {currentMilestone.stage}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">• {currentMilestone.experience}</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white tracking-tight">{currentMilestone.title}</h4>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-extrabold px-3 py-1.5 rounded-xl shrink-0 text-left">
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-black mb-0.5">Avg compensation</span>
              {currentMilestone.salary}
            </div>
          </div>

          {/* Grid Information details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
            
            {/* Left side column */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider block">Key Focus & Milestones</span>
                <p className="text-slate-200 leading-relaxed text-[11px] font-medium">{currentMilestone.keyFocus}</p>
              </div>

              <div className="bg-[#120c2d] border border-[#231a4e] p-3 rounded-xl space-y-1.5">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> AROHI Coach Tip
                </span>
                <p className="text-slate-300 leading-relaxed text-[10.5px] italic font-medium">"{currentMilestone.arohiTip}"</p>
              </div>
            </div>

            {/* Right side column */}
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> High-Value Credentials
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentMilestone.certifications.map((cert, index) => (
                    <span key={index} className="bg-[#18133b] border border-[#2b1e5a] text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#00e676]" /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Recommended Study Curriculums
                </span>
                <div className="grid grid-cols-1 gap-1">
                  {currentMilestone.resources.map((res, index) => (
                    <div key={index} className="bg-[#0f0a28] hover:bg-[#1a123f] border border-[#211847] p-2 rounded-xl transition-colors flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 font-bold truncate">{res}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
