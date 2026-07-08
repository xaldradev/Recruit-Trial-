import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Award, CheckCircle2, Bookmark, FileText, Bot, Briefcase, Landmark, ExternalLink, Sparkles, AlertCircle, ShieldCheck, Edit3, Save, LogIn, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserDashboardProps {
  subscriptions?: Record<string, boolean>;
  onSubscribe?: (pathId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenAuth?: () => void;
}


export default function UserDashboard({ subscriptions = { path1: false, path2: false, path3: false }, onSubscribe, onNavigateTab, onOpenAuth }: UserDashboardProps) {
  const { user, userData, updateUserProfile, updateBookmarks } = useAuth();

  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar Singh',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    education: 'B.Tech in Computer Science (2026)',
    activeGoal: 'Full-Stack Web Developer / Software Engineer'
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedEducation, setEditedEducation] = useState('');
  const [editedGoal, setEditedGoal] = useState('');

  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // Sync profile & other lists in real time
  useEffect(() => {
    if (user && userData) {
      if (userData.profile) {
        setProfile(userData.profile);
        setEditedName(userData.profile.name || '');
        setEditedPhone(userData.profile.phone || '');
        setEditedLocation(userData.profile.location || '');
        setEditedEducation(userData.profile.education || '');
        setEditedGoal(userData.profile.activeGoal || '');
      } else {
        setProfile({
          name: user.displayName || 'Honored Guest',
          email: user.email || 'user@example.com',
          phone: '',
          location: '',
          education: '',
          activeGoal: ''
        });
        setEditedName(user.displayName || 'Honored Guest');
        setEditedPhone('');
        setEditedLocation('');
        setEditedEducation('');
        setEditedGoal('');
      }
      
      if (userData.applications) {
        // Map raw applications into dynamic list
        const mappedApps = userData.applications.map((app: any, idx: number) => ({
          id: app.id || idx,
          title: app.postingTitle || 'Government Opportunity',
          org: app.postingId?.includes('ssc') ? 'Staff Selection Commission' : app.postingId?.includes('rrb') ? 'Railway Recruitment Board' : 'Ecosystem Match',
          status: app.status || 'Submitted',
          date: app.appliedDate || '2026-06-29',
          color: app.status === 'Approved' ? 'text-emerald-700 bg-emerald-100' : app.status === 'Rejected' ? 'text-red-700 bg-red-100' : 'text-blue-700 bg-blue-100'
        }));
        setAppliedJobs(mappedApps);
      } else {
        setAppliedJobs([]);
      }

      if (userData.savedItems) {
        setSavedItems(userData.savedItems);
      } else {
        setSavedItems([]);
      }
    } else {
      // Guest fallbacks
      setProfile({
        name: localStorage.getItem('recruit_user_name') || 'Honored Guest',
        email: 'guest@recruitindia.org',
        phone: '+91 98765 43210',
        location: 'Delhi NCR',
        education: 'Graduate Degree (Patna University)',
        activeGoal: 'Government & Public Sector Career'
      });
      setAppliedJobs([
        { id: 1, title: 'SSC MTS & Havaldar 2026', org: 'Staff Selection Commission', status: 'Application Submitted', date: '22 June 2026', color: 'text-blue-700 bg-blue-100' },
        { id: 2, title: 'IBPS Clerk XVI CRP', org: 'Institute of Banking Personnel Selection', status: 'Exam Prep Phase', date: '23 June 2026', color: 'text-amber-700 bg-amber-100' }
      ]);
      setSavedItems([
        { id: '1', title: 'PM Mudra Loan Scheme', type: 'Scheme', desc: 'Collateral free funding' },
        { id: '2', title: 'Full-Stack JavaScript certification', type: 'Course', desc: '12 Weeks upskilling path' }
      ]);
    }
  }, [user, userData]);

  const handleSaveProfile = async () => {
    try {
      if (user) {
        await updateUserProfile({
          name: editedName,
          phone: editedPhone,
          location: editedLocation,
          education: editedEducation,
          activeGoal: editedGoal
        });
        setIsEditingProfile(false);
      } else {
        localStorage.setItem('recruit_user_name', editedName);
        setProfile(prev => ({
          ...prev,
          name: editedName,
          phone: editedPhone,
          location: editedLocation,
          education: editedEducation,
          activeGoal: editedGoal
        }));
        setIsEditingProfile(false);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    if (user) {
      await updateBookmarks(updated).catch(err => console.error("Firebase sync error:", err));
    }
  };

  const badges = [
    { name: 'ATS Optimized', desc: 'Achieved >70% ATS compatibility score.', icon: '🏆' },
    { name: 'Interview Ready', desc: 'Evaluated mock responses in 2 tracks.', icon: '🗣️' },
    { name: 'MSME Registered', desc: 'Validated startup launch report.', icon: '🚀' }
  ];

  const pathsDetail = [
    {
      id: 'path1',
      title: 'Path 1: Career, Jobs & Resume Assistance',
      desc: 'Sarkari & Private matching, ATS analyzer, and live mock interview practice.',
      price: '₹399/mo',
      perks: ['AI-backed resume grading', 'Live exam portal alerts', 'Unlimited mock interviews', 'Instant agent assistance']
    },
    {
      id: 'path2',
      title: 'Path 2: Economical Skill Upgradation',
      desc: 'Industry-oriented courses. Pay only for the course in monthly breakups, getting Arohi Free!',
      price: 'FREE with Course',
      perks: ['Full software & business modules', 'Government verified certificates', 'Hands-on practice exercises', 'Direct mentorship help']
    },
    {
      id: 'path3',
      title: 'Path 3: Udyam Business Launchpad',
      desc: 'If not interested in jobs, transform your vision into an MSME business.',
      price: '₹399/mo',
      perks: ['PMEGP & Mudra loan checklist', 'Odisha state startup benefits', 'Validating business scalability', 'Udyam micro registration steps']
    }
  ];

  const hasAnyActive = Object.values(subscriptions).some(Boolean);

  return (
    <div className="space-y-6">
      
      {/* Guest warning banner if not logged in */}
      {!user && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">Guest Mode Active</h4>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-relaxed">
                Connect with Firebase to persistently back up your career bookmarks, enrolled courses, module steps, and exam registration histories!
              </p>
            </div>
          </div>
          <button 
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Link My Account
          </button>
        </div>
      )}

      {/* Upper banner profile summary */}
      <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl -translate-y-12 translate-x-12"></div>
        
        <div className="relative flex flex-col md:flex-row gap-6 items-center">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shrink-0">
            {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'HI'}
          </div>

          <div className="text-center md:text-left flex-1 space-y-3 w-full">
            {isEditingProfile ? (
              <div className="space-y-3 max-w-xl text-left bg-slate-900/50 p-4 rounded-xl border border-slate-850">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 mb-1">Edit Professional profile</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={editedName} 
                      onChange={e => setEditedName(e.target.value)}
                      className="w-full bg-[#16122d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={editedPhone} 
                      onChange={e => setEditedPhone(e.target.value)}
                      className="w-full bg-[#16122d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Location</label>
                    <input 
                      type="text" 
                      value={editedLocation} 
                      onChange={e => setEditedLocation(e.target.value)}
                      className="w-full bg-[#16122d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Academic Education</label>
                    <input 
                      type="text" 
                      value={editedEducation} 
                      onChange={e => setEditedEducation(e.target.value)}
                      className="w-full bg-[#16122d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Primary Career Goal</label>
                  <input 
                    type="text" 
                    value={editedGoal} 
                    onChange={e => setEditedGoal(e.target.value)}
                    className="w-full bg-[#16122d] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button 
                    onClick={handleSaveProfile}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Profile
                  </button>
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-extrabold uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h2 className="text-xl md:text-2xl font-black">{profile.name || 'Honored Guest'}</h2>
                      <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase leading-none mt-1 shrink-0 self-start sm:self-center">
                        Active Student Profile
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 text-slate-400 text-xs font-semibold">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-400" /> {profile.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-400" /> {profile.phone || 'No phone set'}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-400" /> {profile.location || 'No location set'}</span>
                    </div>

                    <div className="text-xs text-slate-300 font-bold pt-1">
                      🏫 Education: <span className="text-white font-black">{profile.education || 'Not specified'}</span>
                    </div>

                    <p className="text-xs text-emerald-400 font-extrabold mt-1">
                      🎓 Goal: {profile.activeGoal || 'Set your primary goal'}
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setEditedName(profile.name || '');
                      setEditedPhone(profile.phone || '');
                      setEditedLocation(profile.location || '');
                      setEditedEducation(profile.education || '');
                      setEditedGoal(profile.activeGoal || '');
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1 px-3.5 py-1.5 bg-[#17143a] hover:bg-[#25215c] border border-slate-800 rounded-xl text-xs font-black uppercase text-slate-300 hover:text-white transition-all cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* MONTHLY SUBSCRIPTIONS CONTROL AREA */}
      <div className="bg-[#120e2b] border border-[#2d2163] p-6 rounded-2xl text-left text-white shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#211b4d] pb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse" /> My Assistance Subscription Plans (₹399/Month)
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Active subscription holders receive continuous real-time support and professional guidelines.
            </p>
          </div>
          <div className="bg-[#1c183a] px-3.5 py-1.5 rounded-xl border border-[#3b2a80] text-xs font-extrabold text-[#c084fc] flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Budget Plan: ₹399/mo each
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pathsDetail.map((path) => {
            const isActive = subscriptions[path.id];
            return (
              <div 
                key={path.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#1e1545] border-[#a78bfa] shadow-[0_0_15px_rgba(167,139,250,0.25)]' 
                    : 'bg-[#0f0b24] border-[#221a4f] hover:border-[#382b7c]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-extrabold text-white leading-snug">{path.title}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal">{path.desc}</p>
                  
                  <div className="space-y-1 pt-1.5">
                    {path.perks.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-[#10b981] shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#231a4d] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-violet-300">{path.price}</span>
                  <button
                    onClick={() => onSubscribe && onSubscribe(path.id)}
                    className={`text-[9px] font-black uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30' 
                        : 'bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white hover:from-[#6d28d9] shadow-sm'
                    }`}
                  >
                    {isActive ? 'Cancel Plan' : 'Subscribe'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PROGRESS BLOCK FOR ACTIVE SUBSCRIPTIONS */}
        {hasAnyActive ? (
          <div className="bg-[#17123a] border border-[#302470] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#a855f7] block">Your Ecosystem Growth Tracker</span>
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>📈 Progress Status: 3 active support tracks</span>
                <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Premium Access Enabled</span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-snug">
                Your career requests are being priority processed. Unlimited chat workspace access active. Renewals automatic.
              </p>
            </div>
            <div className="w-full sm:w-48 text-right space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Monthly Term Completion</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-[#2a1d52] h-2 rounded-full overflow-hidden border border-[#3b2b73]">
                <div className="bg-gradient-to-r from-[#a855f7] to-[#10b981] h-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1122] border border-amber-500/20 p-4 rounded-xl flex items-center gap-3 text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">No Active Assistance Subscription</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Please subscribe to any path above or on the front page to unlock premium 24/7 priority agent help for ₹399/mo.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column applications */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <Briefcase className="w-4.5 h-4.5 text-blue-600" /> My Active Applications ({appliedJobs.length})
            </h3>

            <div className="space-y-3">
              {appliedJobs.map((job) => (
                <div key={job.id} className="border border-slate-150 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:border-blue-200 transition-colors">
                  <div className="text-left">
                    <h4 className="font-extrabold text-xs md:text-sm text-slate-800 leading-snug">{job.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold">{job.org}</span>
                    <span className="block text-[9px] text-slate-400 font-medium mt-1">Applied Date: {job.date}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${job.color}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarked items */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <Bookmark className="w-4.5 h-4.5 text-rose-500" /> Saved Opportunities & Courses ({savedItems.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedItems.length === 0 ? (
                <p className="text-slate-400 text-xs font-semibold py-4 col-span-2 text-center">No saved opportunities or courses yet.</p>
              ) : (
                savedItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-left flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        item.type === 'Scheme' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>{item.type}</span>
                      <h4 className="font-extrabold text-xs text-slate-800 truncate leading-snug mt-1.5">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer" />
                      <button 
                        onClick={() => handleDeleteBookmark(item.id)}
                        className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column achievements and stats */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <Bot className="w-4.5 h-4.5 text-blue-600" /> AROHI Diagnostics Scores
            </h3>

            <div className="space-y-3.5 text-xs font-semibold">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500">Resume ATS Rating:</span>
                <span className="bg-blue-100 text-blue-800 font-black px-2 py-0.5 rounded">74% Compatibility</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-50 pb-2.5">
                <span className="text-slate-500">Interview Readiness:</span>
                <span className="bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">Good Progress</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500">Business Viability Score:</span>
                <span className="bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded">84% Feasible</span>
              </div>
            </div>
          </div>

          {/* Gamified Achievements badges */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-md">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-amber-500" /> Career Milestones Badges
            </h3>

            <div className="space-y-3">
              {badges.map((b, idx) => (
                <div key={idx} className="flex gap-3 items-center text-left">
                  <div className="text-2xl bg-slate-50 p-2 rounded-xl border border-slate-150 shadow-sm shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 leading-snug">{b.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">{b.desc}</p>
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

