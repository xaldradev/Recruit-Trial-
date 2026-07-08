import React, { useState } from 'react';
import { Sparkles, Users, Briefcase, Plus, Calendar, CheckSquare, TrendingUp, ShieldAlert, FileText, Check, X } from 'lucide-react';

interface Candidate {
  id: number;
  name: string;
  role: string;
  score: number;
  status: 'Applied' | 'Shortlisted' | 'Interview Scheduled' | 'Rejected';
  date: string;
}

export default function EmployerPortal() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 1, name: 'Rajesh Kumar Singh', role: 'Full Stack Web Developer', score: 84, status: 'Shortlisted', date: '22 June 2026' },
    { id: 2, name: 'Neha Deshmukh', role: 'Software Engineer', score: 72, status: 'Applied', date: '23 June 2026' },
    { id: 3, name: 'Rohan Sharma', role: 'Database Administrator', score: 65, status: 'Applied', date: '24 June 2026' }
  ]);

  const [jobTitle, setJobTitle] = useState('');
  const [jobVacancies, setJobVacancies] = useState(2);
  const [jobEligibility, setJobEligibility] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // Hiring pipeline counters
  const totalApplied = candidates.length;
  const totalShortlisted = candidates.filter(c => c.status === 'Shortlisted').length;

  const handleStatusChange = (id: number, status: any) => {
    setCandidates(candidates.map((c) => c.id === id ? { ...c, status } : c));
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobEligibility) return;
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      setJobTitle('');
      setJobEligibility('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Upper banner */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-850">
        <span className="bg-blue-600/20 text-blue-400 text-[11px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-500/30">AROHI Employer Portal</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2 tracking-tight">Employer Recruitment Dashboard</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xl">Post opportunities directly onto the Recruit.org.in directory. Track applicant resumes, evaluate compatibility index scores, and organize hiring loops.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Openings', value: '3 Jobs' },
          { label: 'Total Candidates', value: `${totalApplied} Applied` },
          { label: 'Shortlisted Profiles', value: `${totalShortlisted} Profiles` },
          { label: 'AROHI Auto Matches', value: '1 Match' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-150 shadow-sm p-4 rounded-xl text-center">
            <span className="block text-[10px] text-slate-400 font-black uppercase tracking-wider leading-none">{item.label}</span>
            <span className="block text-xl font-black text-slate-900 mt-1.5">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Post Job Left */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <Plus className="w-4.5 h-4.5 text-blue-600" /> Post New Opportunity
            </h3>

            {successMsg && (
              <div className="mb-4 bg-emerald-50 text-emerald-800 p-3.5 rounded-xl border border-emerald-100 text-xs font-bold animate-pulse">
                🎉 Job opportunity posted successfully to the Recruit.org.in active board!
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Opportunity / Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Associate Web Designer"
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Total Vacancies</label>
                  <input
                    type="number"
                    value={jobVacancies}
                    onChange={(e) => setJobVacancies(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Average Salary</label>
                  <input
                    type="text"
                    defaultValue="₹4.5 LPA"
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Eligibility Criteria & Skills</label>
                <textarea
                  value={jobEligibility}
                  onChange={(e) => setJobEligibility(e.target.value)}
                  placeholder="e.g. Any 12th standard or BCA degree holder with familiarity with CSS and Figma mockup standards."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl p-3 text-xs md:text-sm font-medium focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Post Listing Active
              </button>
            </form>

          </div>
        </div>

        {/* Applicant Management Right */}
        <div className="lg:col-span-7">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <Users className="w-4.5 h-4.5 text-blue-600" /> Manage Candidates Applications
            </h3>

            <div className="space-y-4">
              {candidates.map((c) => (
                <div key={c.id} className="border border-slate-150 rounded-xl p-4.5 hover:border-blue-200 transition-colors">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="text-left">
                      <h4 className="font-extrabold text-xs md:text-sm text-slate-800 leading-snug">{c.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{c.role} • {c.date}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-black text-slate-400">ATS Match Score:</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        c.score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.score}% Match
                      </span>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 mt-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                    
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-[10px] text-slate-400 font-black uppercase">Status:</span>
                      <span className="text-blue-700 font-extrabold uppercase">{c.status}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleStatusChange(c.id, 'Shortlisted')}
                        className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 cursor-pointer"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleStatusChange(c.id, 'Interview Scheduled')}
                        className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 cursor-pointer"
                      >
                        Schedule
                      </button>
                      <button
                        onClick={() => handleStatusChange(c.id, 'Rejected')}
                        className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
