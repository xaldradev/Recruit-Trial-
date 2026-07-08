import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { ArrowLeft, Printer, Download, CheckCircle2, ShieldCheck, Upload, AlertCircle, FileText, Globe, Calendar, CreditCard, User, Landmark, Sparkles, Share2, IndianRupee, TrendingUp, Coins } from 'lucide-react';
import { Posting, Application } from '../types';

export function getEstimatedSalary(posting: Posting) {
  const title = (posting.title || '').toLowerCase();
  const shortInfo = (posting.shortInfo || '').toLowerCase();
  const org = (posting.organization || '').toLowerCase();
  const dept = (posting.department || '').toLowerCase();
  
  // Combine post names for matching
  const postNames = (posting.vacancies || []).map(v => (v.postName || '').toLowerCase());
  const allText = `${title} ${shortInfo} ${org} ${dept} ${postNames.join(' ')}`;

  let min = 25000;
  let max = 45000;
  let level = "Level 3";
  let type = posting.jobType === 'private' ? 'Private Industry Standard' : '7th CPC Pay Matrix';
  let allowances = posting.jobType === 'private' ? 'Includes PF, ESIC & Performance Bonus' : 'Plus DA, HRA, Transport Allowance & Medical benefits';
  let basis = 'Typical entry-level role standards';

  if (allText.includes('mts') || allText.includes('multi tasking') || allText.includes('peon') || allText.includes('attendant') || allText.includes('helper') || allText.includes('safaiwala') || allText.includes('group d') || allText.includes('chowkidar')) {
    min = 18000;
    max = 28000;
    level = "Level 1";
    basis = "7th Central Pay Commission Level-1 Pay Scale for Group 'C' Central Government staff.";
  } else if (allText.includes('cgl') || allText.includes('inspector') || allText.includes('officer') || allText.includes('sub inspector') || allText.includes('si ') || allText.includes('assistant section officer') || allText.includes('aso') || allText.includes('superintendent')) {
    min = 44900;
    max = 142400;
    level = "Level 7";
    basis = "7th Central Pay Commission Level-7 Pay Scale for Group 'B' Gazetted/Non-Gazetted officers.";
  } else if (allText.includes('chsl') || allText.includes('clerk') || allText.includes('ldc') || allText.includes('typist') || allText.includes('data entry') || allText.includes('deo') || allText.includes('junior assistant') || allText.includes('clerical')) {
    min = 19900;
    max = 63200;
    level = "Level 2";
    basis = "7th Central Pay Commission Level-2 Pay Scale for Lower Division Clerks & Assistant staff.";
  } else if (allText.includes('constable') || allText.includes('police') || allText.includes('guard') || allText.includes('soldier') || allText.includes('gd') || allText.includes('security')) {
    min = 21700;
    max = 69100;
    level = "Level 3";
    basis = "7th Central Pay Commission Level-3 Pay Scale for Constables & Central Armed Police Forces (CAPFs).";
  } else if (allText.includes('stenographer') || allText.includes('steno')) {
    min = 25500;
    max = 81100;
    level = "Level 4";
    basis = "7th Central Pay Commission Level-4 Pay Scale for Stenographers Grade 'D'.";
  } else if (allText.includes('assistant engineer') || allText.includes('ae ') || allText.includes('scientist') || allText.includes('lecturer') || allText.includes('assistant professor') || allText.includes('commissioned officer')) {
    min = 56100;
    max = 177500;
    level = "Level 10";
    basis = "7th Central Pay Commission Level-10 Entry Scale for Group 'A' Gazetted / Class-1 services.";
  } else if (allText.includes('junior engineer') || allText.includes('je ') || allText.includes('section engineer') || allText.includes('sub engineer')) {
    min = 35400;
    max = 112400;
    level = "Level 6";
    basis = "7th Central Pay Commission Level-6 Pay Scale for Technical Junior Engineers.";
  } else if (allText.includes('teacher') || allText.includes('tgt') || allText.includes('pgt') || allText.includes('prt') || allText.includes('educator') || allText.includes('principal')) {
    if (allText.includes('pgt') || allText.includes('principal')) {
      min = 47600;
      max = 151100;
      level = "Level 8";
      basis = "7th Central Pay Commission Level-8 Pay Scale for Senior Post Graduate school teachers & lecturers.";
    } else {
      min = 35400;
      max = 112400;
      level = "Level 6";
      basis = "7th Central Pay Commission Level-6 trained graduate teacher (TGT) scales.";
    }
  } else if (allText.includes('nurse') || allText.includes('medical officer') || allText.includes('pharmacist') || allText.includes('lab technician') || allText.includes('doctor')) {
    min = 29200;
    max = 92300;
    level = "Level 5";
    basis = "7th Central Pay Commission Level-5 standard medical & health services department scales.";
  } else if (allText.includes('bank po') || allText.includes('probationary officer') || allText.includes('management trainee') || allText.includes('scale i')) {
    min = 41960;
    max = 64000;
    level = "Officer Scale I";
    type = "IBA Bank Pay Scales";
    allowances = "Plus DA, HRA, Special Allowance, Leased Accommodation & perks";
    basis = "Indian Banks' Association (IBA) 12th Bipartite Settlement scales for Bank Probationary Officers.";
  } else if (allText.includes('bank clerk') || allText.includes('single window') || allText.includes('assistant (multipurpose)') || allText.includes('clerical cadre')) {
    min = 19900;
    max = 47920;
    level = "Clerical Cadre";
    type = "IBA Bank Pay Scales";
    allowances = "Plus DA, HRA, Transport Allowance, medical & local benefits";
    basis = "Indian Banks' Association (IBA) 12th Bipartite Settlement scales for public sector Bank Clerks.";
  } else if (allText.includes('driver')) {
    min = 19900;
    max = 35000;
    level = "Level 2 / Standard";
    basis = "7th Central Pay Commission Level-2 pay scale or public department heavy/light motor vehicle driver benchmarks.";
  } else if (posting.jobType === 'private') {
    if (allText.includes('developer') || allText.includes('software') || allText.includes('engineer') || allText.includes('it ') || allText.includes('tech') || allText.includes('programmer')) {
      min = 35000;
      max = 85000;
      level = "Grade A Technical";
      basis = "Average standard entry to mid-level IT/Software engineer salaries in metropolitan Indian tech hubs.";
    } else if (allText.includes('sales') || allText.includes('marketing') || allText.includes('business development') || allText.includes('bde') || allText.includes('executive')) {
      min = 20000;
      max = 45000;
      level = "Grade B Business";
      allowances = "Plus monthly/quarterly target performance-linked incentives & travel DA";
      basis = "Private corporate average CTC package benchmarks for business development and sales roles.";
    } else {
      min = 18000;
      max = 40000;
      level = "Grade C General";
      basis = "Indian corporate private sector average starting salaries for corresponding roles.";
    }
  }

  // Helper to format currency
  const formatSalary = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return {
    range: `${formatSalary(min)} – ${formatSalary(max)}`,
    minVal: formatSalary(min),
    maxVal: formatSalary(max),
    level,
    type,
    allowances,
    basis
  };
}

interface PostingDetailProps {
  posting: Posting;
  onBack: () => void;
  onAddApplication: (app: Application) => void;
}

export default function PostingDetail({ posting, onBack, onAddApplication }: PostingDetailProps) {
  const salaryData = getEstimatedSalary(posting);
  const [activeTab, setActiveTab] = useState<'details' | 'apply' | 'notification' | 'syllabus'>('details');
  
  // Scroll smoothly to the top of the container immediately upon loading a job
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [posting]);
  
  // Apply form state
  const [candidateName, setCandidateName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [category, setCategory] = useState('General');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qualification, setQualification] = useState('High School (10th)');
  const [boardName, setBoardName] = useState('');
  const [marks, setMarks] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  
  const printRef = useRef<HTMLDivElement>(null);

  // Handle Photo & Signature mock uploads
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!candidateName || !fatherName || !email || !phone) {
      alert('Please fill all mandatory personal details.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const regNumber = `REC-${posting.id.toUpperCase().substring(0, 5)}-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const newApp: Application = {
        id: Math.random().toString(36).substring(2, 9),
        postingId: posting.id,
        postingTitle: posting.title,
        candidateName,
        fatherName,
        dob,
        gender,
        category,
        email,
        phone,
        qualification: `${qualification} (${boardName || 'CBSE'}) - Marks: ${marks}%`,
        address,
        photoUrl: photo || undefined,
        signatureUrl: signature || undefined,
        registrationNumber: regNumber,
        appliedDate: new Date().toLocaleDateString('en-IN'),
        status: 'Submitted'
      };

      onAddApplication(newApp);
      setSubmittedApp(newApp);
      setIsSubmitting(false);
      setFormStep(4); // Slip page
    }, 1200);
  };

  const triggerPrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      // Open a print window to allow elegant offline confirmation slip printing
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>Application Slip - ${posting.title}</title>
              <style>
                body { font-family: 'Inter', sans-serif; padding: 20px; color: #1e293b; }
                .border-box { border: 2px solid #000; padding: 20px; }
                .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .header-table td { border: 1px solid #000; padding: 8px; }
                .detail-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                .detail-table td { border: 1px solid #ccc; padding: 6px 12px; }
                .bold { font-weight: bold; }
                .text-center { text-align: center; }
                .stamp { border: 2px dashed #059669; color: #059669; font-weight: bold; text-align: center; padding: 10px; width: 150px; margin-left: auto; }
              </style>
            </head>
            <body onload="window.print(); window.close();">
              ${printContent}
            </body>
          </html>
        `);
        win.document.close();
      }
    }
  };

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: posting.title,
      text: `Check out this job opportunity: ${posting.title} at ${posting.organization}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button and Print/Share buttons */}
        <div className="mb-5 flex flex-wrap justify-between items-center gap-3 print:hidden">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-bold text-sm bg-white border border-rose-200 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Updates Board</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-slate-700 hover:text-rose-600 hover:border-rose-300 font-bold text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
              id="print-posting-btn"
            >
              <Printer className="w-4 h-4 text-rose-600" />
              <span>Print Posting Details</span>
            </button>

            <button
              onClick={handleShare}
              className={`inline-flex items-center gap-2 font-bold text-sm bg-white border px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer ${
                copied 
                  ? 'text-emerald-600 border-emerald-200 bg-emerald-50/50' 
                  : 'text-slate-700 hover:text-rose-600 hover:border-rose-300 border-slate-200'
              }`}
              id="share-posting-btn"
            >
              <Share2 className={`w-4 h-4 ${copied ? 'text-emerald-600 animate-bounce' : 'text-rose-600'}`} />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Header Block of Posting */}
        <div className="bg-white rounded-xl shadow-md border-l-8 border-rose-600 p-6 mb-6">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase border border-slate-200">
                {posting.organization}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                {posting.title}
              </h2>
              <div className="flex flex-wrap gap-2.5 mt-3">
                {posting.tags.map((t, idx) => (
                  <span key={idx} className="bg-rose-50 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded border border-rose-100">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg py-1 px-2.5 w-fit text-[11px] font-bold text-emerald-800 shadow-sm animate-[pulse_3s_infinite]">
                <Coins className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Estimated Pay Range: <span className="text-emerald-950 font-black">{salaryData.range}</span>/mo</span>
              </div>
            </div>
            <div className="text-right bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[150px]">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Post Date</p>
              <p className="text-sm font-extrabold text-slate-800">{posting.postDate}</p>
              {posting.postUpdateDate && (
                <div className="mt-1.5 pt-1 border-t border-slate-200">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Update</p>
                  <p className="text-xs font-semibold text-rose-600">{posting.postUpdateDate}</p>
                </div>
              )}
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-100 italic">
            <strong>Short Description:</strong> {posting.shortInfo}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl overflow-hidden shadow-sm print:hidden">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 md:flex-none px-6 py-3.5 text-sm font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'border-rose-600 text-rose-600 bg-rose-50/20'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📋 Official Recruitment Details
          </button>
          {posting.links.applyOnline && (
            <button
              onClick={() => {
                setActiveTab('apply');
                setFormStep(submittedApp ? 4 : 1);
              }}
              className={`flex-1 md:flex-none px-6 py-3.5 text-sm font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
                activeTab === 'apply'
                  ? 'border-rose-600 text-rose-600 bg-rose-50/20'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              ✍️ Apply Online Form
            </button>
          )}
          <button
            onClick={() => setActiveTab('notification')}
            className={`flex-1 md:flex-none px-6 py-3.5 text-sm font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === 'notification'
                ? 'border-rose-600 text-rose-600 bg-rose-50/20'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            📖 Notification Summary
          </button>
        </div>

        {/* Tab Content 1: Official Recruitment Table Grid (Exact Copy Style of Recruit.org.in) */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-b-xl shadow-md p-6 border-x border-b border-slate-200">
            
            <div className="overflow-x-auto border-2 border-rose-900 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-rose-900 text-white text-center">
                    <th colSpan={2} className="py-3 px-4 font-black uppercase tracking-wider text-base border-b-2 border-rose-950">
                      {posting.organization} (GOVT. OF INDIA)
                    </th>
                  </tr>
                  <tr className="bg-rose-800 text-white text-center border-b border-rose-900">
                    <th colSpan={2} className="py-2 px-4 font-bold uppercase text-sm">
                      {posting.title}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Two Column Layout for Dates & Fees inside Table */}
                  <tr className="align-top border-b border-slate-200">
                    <td className="w-1/2 p-4 border-r border-slate-200">
                      <div className="flex items-center gap-2 mb-3 text-rose-800 font-extrabold uppercase tracking-wide text-xs">
                        <Calendar className="w-4 h-4 text-rose-700" />
                        <span>Important Dates</span>
                      </div>
                      <ul className="space-y-2 text-xs font-semibold text-slate-700">
                        <li className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Application Begin:</span>
                          <span className="text-slate-900">{posting.dates.applicationBegin}</span>
                        </li>
                        <li className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-500 font-bold text-rose-600">Last Date to Apply:</span>
                          <span className="text-rose-600 font-extrabold">{posting.dates.lastDateApply}</span>
                        </li>
                        <li className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-500">Last Date for Online Fee:</span>
                          <span className="text-slate-900">{posting.dates.lastDateFee}</span>
                        </li>
                        {posting.dates.examDate && (
                          <li className="flex justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Written Exam Date:</span>
                            <span className="text-blue-700 font-bold">{posting.dates.examDate}</span>
                          </li>
                        )}
                        {posting.dates.admitCardAvailable && (
                          <li className="flex justify-between pb-1.5">
                            <span className="text-slate-500">Admit Card Release:</span>
                            <span className="text-green-600 font-bold">{posting.dates.admitCardAvailable}</span>
                          </li>
                        )}
                      </ul>
                    </td>
                    <td className="w-1/2 p-4">
                      <div className="flex items-center gap-2 mb-3 text-rose-800 font-extrabold uppercase tracking-wide text-xs">
                        <CreditCard className="w-4 h-4 text-rose-700" />
                        <span>Application Fee</span>
                      </div>
                      <ul className="space-y-2 text-xs font-semibold text-slate-700">
                        <li className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-500">General / OBC / EWS:</span>
                          <span className="text-slate-900 font-bold">{posting.fees.generalOBC}</span>
                        </li>
                        <li className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-500">SC / ST / PH:</span>
                          <span className="text-slate-900 font-bold">{posting.fees.scST}</span>
                        </li>
                        {posting.fees.female && (
                          <li className="flex justify-between pb-1.5 border-b border-slate-100">
                            <span className="text-slate-500">Female Candidates (All Cat):</span>
                            <span className="text-slate-900 font-bold">{posting.fees.female}</span>
                          </li>
                        )}
                        <li className="flex flex-col pt-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Payment Gateway Modes:</span>
                          <span className="text-[11px] text-slate-600 mt-0.5 leading-tight italic">{posting.fees.paymentMode}</span>
                        </li>
                      </ul>
                    </td>
                  </tr>

                  {/* Age Limit details */}
                  <tr className="bg-slate-50/50 align-top border-b border-slate-200">
                    <td colSpan={2} className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-rose-800 font-extrabold uppercase tracking-wide text-xs">
                        <User className="w-4 h-4 text-rose-700" />
                        <span>Age Limit Details (As on {posting.ageLimit.asOnDate})</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold mt-2.5">
                        <div className="bg-white p-3 rounded border border-slate-150">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Minimum Age</span>
                          <span className="text-slate-800 text-sm font-extrabold">{posting.ageLimit.minAge}</span>
                        </div>
                        <div className="bg-white p-3 rounded border border-slate-150">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Maximum Age</span>
                          <span className="text-slate-800 text-sm font-extrabold">{posting.ageLimit.maxAge}</span>
                        </div>
                        <div className="bg-white p-3 rounded border border-slate-150 col-span-1 md:col-span-1">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Age Relaxation Rules</span>
                          <span className="text-slate-600 leading-normal text-[11px] font-normal">{posting.ageLimit.relaxationInfo}</span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Estimated Pay Scale & Salary Range (Industry standard) */}
                  <tr className="bg-emerald-50/20 align-top border-b border-slate-200">
                    <td colSpan={2} className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-emerald-800 font-extrabold uppercase tracking-wide text-xs">
                        <TrendingUp className="w-4 h-4 text-emerald-700" />
                        <span>Estimated Industry Pay Scale & Benefits</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold mt-2.5">
                        <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Monthly Scale</span>
                          <span className="text-emerald-700 text-sm font-black tracking-tight flex items-center gap-1 mt-0.5">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {salaryData.range}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Pay Matrix Grade</span>
                          <span className="text-slate-800 text-xs font-extrabold block mt-0.5">{salaryData.level}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({salaryData.type})</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-sm md:col-span-2">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Allowances & Core Benefits</span>
                          <span className="text-slate-600 leading-normal text-[11px] font-medium block mt-0.5">{salaryData.allowances}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2.5 leading-relaxed bg-white/60 p-2.5 rounded border border-slate-100">
                        <strong>Estimation Basis:</strong> {salaryData.basis} Note that these are industry & commission standards. The actual in-hand salary may vary slightly depending on posting location, HRA slab (X, Y, Z cities), and pension deductions.
                      </p>
                    </td>
                  </tr>

                  {/* Vacancy Details Title Row */}
                  <tr className="bg-rose-900 text-white text-center">
                    <th colSpan={2} className="py-2 px-4 font-bold uppercase text-xs tracking-wider">
                      Vacancy Details : Total {posting.totalVacancies > 0 ? `${posting.totalVacancies} Posts` : 'Eligibility Specified'}
                    </th>
                  </tr>

                  {/* Vacancies breakdown list */}
                  <tr className="align-top border-b border-slate-200">
                    <td colSpan={2} className="p-4">
                      <div className="overflow-hidden border border-slate-200 rounded-lg">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                              <th className="py-2 px-3 border-r border-slate-200">Post Name</th>
                              <th className="py-2 px-3 border-r border-slate-200 text-center w-36">Total Post count</th>
                              <th className="py-2 px-3">Recruitment Qualification Eligibility Criteria</th>
                            </tr>
                          </thead>
                          <tbody>
                            {posting.vacancies.map((vac, vIdx) => (
                              <tr key={vIdx} className="hover:bg-slate-50/50 border-b border-slate-150 last:border-b-0">
                                <td className="py-2.5 px-3 border-r border-slate-200 font-extrabold text-slate-900">{vac.postName}</td>
                                <td className="py-2.5 px-3 border-r border-slate-200 text-center font-mono font-bold text-slate-800">
                                  {vac.totalPosts > 0 ? vac.totalPosts : 'Not Specified'}
                                </td>
                                <td className="py-2.5 px-3 text-slate-600 leading-relaxed font-medium">{vac.eligibility}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>

                  {/* Important Links Section - The Soul of Sarkari Result Websites */}
                  <tr className="bg-rose-950 text-yellow-300 text-center">
                    <th colSpan={2} className="py-2.5 px-4 font-extrabold uppercase text-xs tracking-wider border-t-2 border-rose-900">
                      🔥 USEFUL IMPORTANT DIRECT LINKS TABLE
                    </th>
                  </tr>

                  {/* Links Row 1: Apply Online */}
                  {posting.links.applyOnline && (
                    <tr className="border-b border-slate-200 hover:bg-rose-50/20">
                      <td className="p-3.5 font-bold text-rose-900 w-1/2 border-r border-slate-200">
                        👉 Apply Online Registration & Login
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => {
                            setActiveTab('apply');
                            setFormStep(submittedApp ? 4 : 1);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-2.5 rounded border border-rose-700 uppercase tracking-widest shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Click Here to Apply
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* Links Row 2: Download Official Notification */}
                  <tr className="border-b border-slate-200 hover:bg-rose-50/20">
                    <td className="p-3.5 font-bold text-rose-900 w-1/2 border-r border-slate-200">
                      👉 Download Detailed Official Notification Summary
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setActiveTab('notification')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs px-5 py-2.5 rounded border border-blue-700 uppercase tracking-widest shadow-sm hover:shadow-md transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Click Here
                      </button>
                    </td>
                  </tr>

                  {/* Links Row 3: Official Site */}
                  {posting.links.officialWebsite && (
                    <tr className="hover:bg-rose-50/20">
                      <td className="p-3.5 font-bold text-rose-900 w-1/2 border-r border-slate-200">
                        👉 Connect to Department Official Website
                      </td>
                      <td className="p-3.5 text-center">
                        <a
                          href={posting.links.officialWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-slate-700 hover:bg-slate-800 text-white font-black text-xs px-5 py-2.5 rounded border border-slate-800 uppercase tracking-widest shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1 hover:no-underline"
                        >
                          <Globe className="w-3.5 h-3.5" /> Click Here
                        </a>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Verification Watermark Footer */}
            <div className="mt-6 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4" /> Official Verified Job Details by Recruit.org.in Team
              </span>
              <span>Ref ID: SR-REC-2026-{posting.id.toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* Tab Content 2: Multi-step Interactive Apply Form */}
        {activeTab === 'apply' && posting.links.applyOnline && (
          <div className="bg-white rounded-b-xl shadow-md p-6 border-x border-b border-slate-200">
            
            {/* Form Step Status Header */}
            {formStep < 4 && (
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2 uppercase">
                  <span>Step {formStep} of 3</span>
                  <span>{formStep === 1 ? 'Personal Profile' : formStep === 2 ? 'Education Profile' : 'Upload Documents'}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-600 h-full transition-all duration-300"
                    style={{ width: `${(formStep / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Step 1: Personal Profile Form */}
            {formStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setFormStep(2); }}>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5 text-xs text-rose-800 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Important Note: Please fill out all educational and identity fields matching your matriculation (10th) certificate exactly to prevent rejection during verification.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-semibold text-slate-700">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Candidate Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name as in Matric Certificate"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Father's Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter father's name"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender *</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full border border-slate-350 px-3 py-2 rounded-lg font-medium text-slate-900 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-slate-350 px-3 py-2 rounded-lg font-medium text-slate-900 bg-white"
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Candidate Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="candidate@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Candidate Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correspondence Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter complete postal address with PIN code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg border border-rose-700 uppercase cursor-pointer"
                  >
                    Save & Next step
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Educational Details Form */}
            {formStep === 2 && (
              <form onSubmit={(e) => { e.preventDefault(); setFormStep(3); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-semibold text-slate-700">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Highest Academic Level *</label>
                    <select
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full border border-slate-350 px-3 py-2 rounded-lg font-medium text-slate-900 bg-white"
                    >
                      <option value="High School (10th)">High School (10th)</option>
                      <option value="Intermediate (12th)">Intermediate (12th)</option>
                      <option value="Graduation Degree">Graduation Degree</option>
                      <option value="Post Graduation Master">Post Graduation Master</option>
                      <option value="Engineering Diploma/BE">Engineering Diploma/BE</option>
                      <option value="ITI Technical pass">ITI Technical pass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Board / University Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., CBSE, ICSE, UP Board, State University"
                      value={boardName}
                      onChange={(e) => setBoardName(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aggregate Marks Percentage (%) *</label>
                    <input
                      type="number"
                      required
                      min="33"
                      max="100"
                      step="0.01"
                      placeholder="e.g., 84.50"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full border border-slate-350 px-3.5 py-2 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between gap-3 mt-8 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormStep(1)}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-lg uppercase cursor-pointer"
                  >
                    Previous step
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg border border-rose-700 uppercase cursor-pointer"
                  >
                    Save & Next step
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Document Upload (Displaying the files live!) */}
            {formStep === 3 && (
              <form onSubmit={handleApplySubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-semibold text-slate-700">
                  
                  {/* Photo Upload Box */}
                  <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-250 p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-800 font-extrabold text-sm mb-1.5 flex items-center gap-1">
                      Candidate Passport Photo *
                    </p>
                    <p className="text-[10px] text-slate-400 mb-4 uppercase">Format: JPG, JPEG (Size limit: 50KB)</p>
                    
                    {photo ? (
                      <div className="relative mb-4 group border-4 border-white shadow-md rounded">
                        <img src={photo} alt="Passport Photo" className="w-32 h-40 object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhoto(null)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs cursor-pointer shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-200/60 w-32 h-40 flex items-center justify-center text-slate-400 border border-slate-300 rounded mb-4">
                        <Upload className="w-10 h-10 stroke-[1.5]" />
                      </div>
                    )}
                    
                    <label className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg border border-slate-300 shadow-sm cursor-pointer transition-all inline-flex items-center gap-1.5">
                      <Upload className="w-4 h-4" /> Choose File
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Signature Upload Box */}
                  <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-250 p-6 flex flex-col items-center justify-center text-center">
                    <p className="text-slate-800 font-extrabold text-sm mb-1.5 flex items-center gap-1">
                      Candidate Signature *
                    </p>
                    <p className="text-[10px] text-slate-400 mb-4 uppercase">Format: JPG, JPEG (Size limit: 20KB)</p>
                    
                    {signature ? (
                      <div className="relative mb-4 group border-4 border-white shadow-md rounded">
                        <img src={signature} alt="Signature" className="w-48 h-16 object-contain" />
                        <button
                          type="button"
                          onClick={() => setSignature(null)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs cursor-pointer shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-200/60 w-48 h-16 flex items-center justify-center text-slate-400 border border-slate-300 rounded mb-4">
                        <Upload className="w-8 h-8 stroke-[1.5]" />
                      </div>
                    )}
                    
                    <label className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg border border-slate-300 shadow-sm cursor-pointer transition-all inline-flex items-center gap-1.5">
                      <Upload className="w-4 h-4" /> Choose File
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                    </label>
                  </div>

                </div>

                <div className="flex justify-between gap-3 mt-8 pt-5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-lg uppercase cursor-pointer"
                  >
                    Previous step
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-sm px-8 py-2.5 rounded-lg border border-emerald-700 uppercase cursor-pointer inline-flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Verifying Documents...</span>
                      </>
                    ) : (
                      <span>Submit Application Slip</span>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 4: High fidelity registration slip */}
            {formStep === 4 && submittedApp && (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                {/* Success Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 text-center">
                  <div className="inline-flex items-center justify-center bg-emerald-100 p-2.5 rounded-full mb-3 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-950">CONGRATULATIONS! Application Form Submitted Successfully</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your unique registration number has been generated. Please print or download the confirmation slip below.
                  </p>
                </div>

                {/* Printable Confirmation Slip Component */}
                <div className="border border-slate-300 rounded-xl bg-slate-50/50 p-3 mb-6">
                  <div ref={printRef} className="bg-white border-2 border-slate-800 p-6 shadow rounded-lg text-slate-900 max-w-3xl mx-auto">
                    
                    {/* Slip Header */}
                    <div className="border-b-2 border-slate-800 pb-4 text-center">
                      <div className="flex justify-center items-center gap-2 mb-1.5">
                        <div className="bg-slate-900 p-1.5 rounded text-white text-xs font-black font-mono">REC</div>
                        <h2 className="text-xl font-extrabold tracking-tight">RECRUIT.ORG.IN</h2>
                      </div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Government of India Recruitment Processing Portal</p>
                      <h3 className="text-sm font-black text-rose-800 uppercase mt-2 border-y border-slate-200 py-1.5 bg-slate-50">
                        APPLICATION CONFIRMATION SLIP (PROVISIONAL)
                      </h3>
                    </div>

                    {/* Master Info Row (Barcode Pattern & Registration ID) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 py-3 bg-slate-50 border border-slate-200 px-4 rounded">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Provisional Reg Number</span>
                        <span className="text-base font-mono font-black text-slate-900 tracking-wider">
                          {submittedApp.registrationNumber}
                        </span>
                      </div>
                      <div className="text-left md:text-right flex flex-col justify-center items-start md:items-end">
                        <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Applied Timestamp</span>
                        <span className="text-xs font-bold text-slate-700">{submittedApp.appliedDate}</span>
                      </div>
                    </div>

                    {/* Table-based Candidate Details */}
                    <div className="mt-5">
                      <h4 className="text-xs font-black text-slate-500 uppercase border-l-4 border-slate-800 pl-2 mb-3 tracking-wide">
                        1. Candidate Personal Profile
                      </h4>
                      <table className="w-full text-xs border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500 w-1/3">Candidate's Name:</td>
                            <td className="py-2 font-extrabold text-slate-900 uppercase">{submittedApp.candidateName}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500">Father's Name:</td>
                            <td className="py-2 font-bold text-slate-900 uppercase">{submittedApp.fatherName}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500">Applied For:</td>
                            <td className="py-2 font-bold text-rose-800">{submittedApp.postingTitle}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500">Date of Birth / Gender:</td>
                            <td className="py-2 text-slate-800">{submittedApp.dob} | {submittedApp.gender}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500">Category Status:</td>
                            <td className="py-2 text-slate-800 font-bold">{submittedApp.category}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500">Candidate Email & Phone:</td>
                            <td className="py-2 text-slate-800">{submittedApp.email} | +91 {submittedApp.phone}</td>
                          </tr>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500">Correspondence Address:</td>
                            <td className="py-2 text-slate-600 leading-tight">{submittedApp.address}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Education section */}
                    <div className="mt-6">
                      <h4 className="text-xs font-black text-slate-500 uppercase border-l-4 border-slate-800 pl-2 mb-3 tracking-wide">
                        2. Academic Qualification Summary
                      </h4>
                      <table className="w-full text-xs border-collapse">
                        <tbody>
                          <tr className="border-b border-slate-100">
                            <td className="py-2 font-semibold text-slate-500 w-1/3">Qualification Entered:</td>
                            <td className="py-2 font-extrabold text-slate-800">{submittedApp.qualification}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Captured Attachments */}
                    <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-end gap-6">
                      <div className="flex gap-4">
                        {submittedApp.photoUrl ? (
                          <div className="text-center">
                            <img
                              src={submittedApp.photoUrl}
                              alt="Uploaded Passport"
                              className="w-20 h-24 object-cover border border-slate-300 rounded shadow-sm bg-slate-50"
                            />
                            <span className="text-[9px] text-slate-400 uppercase font-bold mt-1.5 block">Photo</span>
                          </div>
                        ) : (
                          <div className="w-20 h-24 bg-slate-100 flex items-center justify-center text-slate-300 border rounded">
                            Photo
                          </div>
                        )}

                        {submittedApp.signatureUrl ? (
                          <div className="text-center">
                            <img
                              src={submittedApp.signatureUrl}
                              alt="Uploaded Signature"
                              className="w-28 h-10 object-contain border border-slate-300 rounded shadow-sm bg-slate-50 mt-14"
                            />
                            <span className="text-[9px] text-slate-400 uppercase font-bold mt-1.5 block">Signature</span>
                          </div>
                        ) : (
                          <div className="w-28 h-10 bg-slate-100 flex items-center justify-center text-slate-300 border rounded mt-14">
                            Sign
                          </div>
                        )}
                      </div>

                      {/* Official Digital Stamp */}
                      <div className="text-center shrink-0">
                        <div className="border-2 border-dashed border-emerald-600 text-emerald-600 font-extrabold uppercase px-3.5 py-1.5 rounded rotate-[-4deg] text-[11px] tracking-widest bg-emerald-50">
                          PROVISIONAL
                          <br />
                          ACCEPTED
                        </div>
                        <span className="text-[9px] text-slate-400 uppercase font-bold mt-2 block">Processing Signature</span>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-8 border-t border-slate-200 pt-3 text-[10px] text-slate-400 text-center italic">
                      This is a computer-generated provisional application slip processed on Recruit.org.in. No physical signature is required. Subject to certificate verification.
                    </div>

                  </div>
                </div>

                {/* Print and Export Buttons */}
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={triggerPrint}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm px-6 py-2.5 rounded-lg border border-slate-950 uppercase cursor-pointer flex items-center gap-2 shadow"
                  >
                    <Printer className="w-4 h-4" /> Print Application Slip
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedApp(null);
                      setFormStep(1);
                      setActiveTab('details');
                    }}
                    className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-2.5 rounded-lg uppercase cursor-pointer"
                  >
                    Apply for Another Job
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab Content 3: Notification summary */}
        {activeTab === 'notification' && (
          <div className="bg-white rounded-b-xl shadow-md p-6 border-x border-b border-slate-200">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-250 font-mono text-xs text-slate-700 leading-relaxed overflow-x-auto max-w-full">
              <div className="border-b border-slate-300 pb-4 mb-4 text-center">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase">OFFICIAL NOTIFICATION DETAILS (SUMMARY REPLICA)</h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">RECRUITMENT REF ID: NT-{posting.id.toUpperCase()}-2026</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-rose-900 font-bold uppercase underline">1. PAY SCALE & SALARY DETAILS:</h4>
                  <p className="mt-1 pl-3">• Pay Band 1 / Pay Level 4 according to the 7th Central Pay Commission (CPC) recommendations.</p>
                  <p className="pl-3">• Pay scale matrix: ₹ 25,500 - ₹ 81,100 per month with applicable Dearness Allowance (DA), House Rent Allowance (HRA), and Transport Allowance.</p>
                </div>

                <div>
                  <h4 className="text-rose-900 font-bold uppercase underline">2. WRITTEN EXAM SCHEME & SYLLABUS GRID:</h4>
                  <p className="mt-1 pl-3">• Objective Type Multiple Choice Questions (MCQ) administered online (Computer Based Test - CBT).</p>
                  <p className="pl-3">• Subject details:</p>
                  <table className="border border-slate-300 text-[11px] mt-2 ml-3">
                    <thead>
                      <tr className="bg-slate-200">
                        <th className="border border-slate-300 p-1.5">Subject</th>
                        <th className="border border-slate-300 p-1.5 text-center">Questions</th>
                        <th className="border border-slate-300 p-1.5 text-center">Max Marks</th>
                        <th className="border border-slate-300 p-1.5 text-center">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-1.5">General Intelligence & Reasoning</td>
                        <td className="border border-slate-300 p-1.5 text-center">25</td>
                        <td className="border border-slate-300 p-1.5 text-center">50</td>
                        <td className="border border-slate-300 p-1.5 text-center" rowSpan={4}>90 Minutes</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5">Quantitative Aptitude</td>
                        <td className="border border-slate-300 p-1.5 text-center">25</td>
                        <td className="border border-slate-300 p-1.5 text-center">50</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5">General English Language</td>
                        <td className="border border-slate-300 p-1.5 text-center">25</td>
                        <td className="border border-slate-300 p-1.5 text-center">50</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-1.5">General Awareness / GK</td>
                        <td className="border border-slate-300 p-1.5 text-center">25</td>
                        <td className="border border-slate-300 p-1.5 text-center">50</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-2 pl-3 text-rose-700 font-bold">* Negative Marking: There is a penalty of 0.25 marks for each incorrect response.</p>
                </div>

                <div>
                  <h4 className="text-rose-900 font-bold uppercase underline">3. SELECTION PROCEDURE STAGES:</h4>
                  <p className="mt-1 pl-3">Stage I: Online Written Test (CBT-1) consisting of quantitative, logic, and general knowledge matrices.</p>
                  <p className="pl-3">Stage II: Physical Endurance Standard Test (PET/PST) if applicable for field postings.</p>
                  <p className="pl-3">Stage III: Main Detailed Document Verification (DV) check.</p>
                  <p className="pl-3">Stage IV: Medical Board Fitness Clearance examination.</p>
                </div>

                <div>
                  <h4 className="text-rose-900 font-bold uppercase underline">4. STEPS TO FILL ONLINE FORM:</h4>
                  <p className="mt-1 pl-3">Step 1: Go to the "Apply Online" tab on Recruit.org.in or click the click here link.</p>
                  <p className="pl-3">Step 2: Enter personal details including candidate name, email address, and active mobile number.</p>
                  <p className="pl-3">Step 3: State highest academic level achievements and input corresponding percentages.</p>
                  <p className="pl-3">Step 4: Upload scanned clear images of passport photograph (size limit 50kb) and signature (size limit 20kb).</p>
                  <p className="pl-3">Step 5: Verify all fields thoroughly in application slip, then proceed with the submission trigger.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
