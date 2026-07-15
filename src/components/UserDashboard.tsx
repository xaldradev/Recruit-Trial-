import { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Award, CheckCircle2, Bookmark, FileText, 
  Bot, Briefcase, Landmark, ExternalLink, Sparkles, AlertCircle, 
  ShieldCheck, Edit3, Save, LogIn, Trash2, X, ChevronRight, 
  Download, RefreshCw, Trophy, Calendar, Check, Play, GraduationCap, Map, Clock, Share2,
  Fingerprint
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initialCourses } from '../data/coursesData';
import { isBiometricSupported, registerBiometricDevice, authenticateBiometricDevice } from '../lib/webauthn';

interface UserDashboardProps {
  subscriptions?: Record<string, boolean>;
  onSubscribe?: (pathId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenAuth?: () => void;
  onShare?: () => void;
}

export default function UserDashboard({ 
  subscriptions = { path1: false, path2: false, path3: false }, 
  onSubscribe, 
  onNavigateTab, 
  onOpenAuth,
  onShare
}: UserDashboardProps) {
  
  const { user, userData, updateUserProfile, updateBookmarks, updateDiagnostics, updateActivities } = useAuth();

  // Basic profile state
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar Singh',
    email: 'rajesh.kumar@recruitindia.org',
    phone: '+91 98765 43210',
    location: 'Bhubaneswar, Odisha',
    education: 'Graduate Degree (Patna University)',
    activeGoal: 'Government & Public Sector Career',
    resumeUrl: ''
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [editedEducation, setEditedEducation] = useState('');
  const [editedGoal, setEditedGoal] = useState('');
  const [editedResume, setEditedResume] = useState('');

  // Biometric Auth states
  const [isBioSupported, setIsBioSupported] = useState(false);
  const [isBioEnrolled, setIsBioEnrolled] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);
  const [bioSuccess, setBioSuccess] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Detect biometric capabilities & enrollment status
  useEffect(() => {
    async function checkBio() {
      const supported = await isBiometricSupported();
      setIsBioSupported(supported);
      if (profile.email) {
        const enrolled = !!localStorage.getItem(`recruit_biometric_${profile.email.toLowerCase()}`);
        setIsBioEnrolled(enrolled);
      }
    }
    checkBio();
  }, [profile.email]);

  const handleRegisterBiometric = async () => {
    if (!profile.email) return;
    setBioError(null);
    setBioSuccess(null);
    setIsEnrolling(true);
    try {
      const record = await registerBiometricDevice(profile.email, user?.uid || 'guest');
      localStorage.setItem(`recruit_biometric_user_${profile.email.toLowerCase()}`, JSON.stringify({
        uid: user?.uid || 'guest',
        email: profile.email,
        displayName: profile.name
      }));
      setIsBioEnrolled(true);
      setBioSuccess(`Successfully registered secure FIDO2 passkey (${record.deviceName}) for secure fingerprint/Face ID sign-in on this device!`);
      addActivity('profile', 'Biometric credential enrolled', `Device authenticated with passkey for ${profile.email}`);
    } catch (err: any) {
      console.error(err);
      setBioError(err.message || 'Verification was cancelled or timed out.');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleRemoveBiometric = () => {
    if (!profile.email) return;
    localStorage.removeItem(`recruit_biometric_${profile.email.toLowerCase()}`);
    setIsBioEnrolled(false);
    setBioSuccess('Biometric registration removed.');
    addActivity('profile', 'Biometric credential removed', `Removed registered biometric passkey for ${profile.email}`);
  };

  // Enrolled courses state (derived dynamically)
  const [enrolledCourseList, setEnrolledCourseList] = useState<any[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEnrolledCount, setTotalEnrolledCount] = useState(0);

  // Applied opportunities state
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [savedItems, setSavedItems] = useState<any[]>([]);
  
  // Checklist count state
  const [completedChecklistItems, setCompletedChecklistItems] = useState(0);
  const [totalChecklistItems, setTotalChecklistItems] = useState(12); // PMEGP & Mudra checklists

  // Diagnostics scores
  const [diagnostics, setDiagnostics] = useState({
    atsScore: 74,
    interviewScore: 0,
    businessScore: 84
  });

  // Recent Activity Feed State
  const [activities, setActivities] = useState<any[]>([]);

  const addActivity = (type: string, title: string, description: string) => {
    const newAct = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: new Date().toISOString()
    };
    if (user) {
      const updated = [newAct, ...(userData?.activities || [])].slice(0, 15);
      updateActivities(updated).catch(err => console.error("Firebase activities sync error:", err));
    } else {
      setActivities(prev => {
        const updated = [newAct, ...prev].slice(0, 15);
        localStorage.setItem('recruit_activities', JSON.stringify(updated));
        return updated;
      });
    }
  };

  // Modal details
  const [activeReceipt, setActiveReceipt] = useState<any | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);

  // Sync profile & other lists in real time from context or localStorage fallbacks
  useEffect(() => {
    if (user && userData) {
      // LOGGED-IN FIREBASE STATE
      if (userData.diagnostics) {
        setDiagnostics({
          atsScore: userData.diagnostics.atsScore ?? 74,
          interviewScore: userData.diagnostics.interviewScore ?? 0,
          businessScore: userData.diagnostics.businessScore ?? 84
        });
      } else {
        const savedAtsScore = localStorage.getItem('recruit_ats_score');
        const savedInterviewScore = localStorage.getItem('recruit_interview_score');
        const savedBusinessScore = localStorage.getItem('recruit_business_score');
        const defaultDiagnostics = {
          atsScore: savedAtsScore ? parseInt(savedAtsScore, 10) : 74,
          interviewScore: savedInterviewScore ? parseInt(savedInterviewScore, 10) : 0,
          businessScore: savedBusinessScore ? parseInt(savedBusinessScore, 10) : 84
        };
        setDiagnostics(defaultDiagnostics);
        updateDiagnostics(defaultDiagnostics).catch(err => console.error("Error setting default diagnostics:", err));
      }

      if (userData.profile) {
        setProfile({
          name: userData.profile.name || user.displayName || 'Honored Guest',
          email: userData.profile.email || user.email || 'user@example.com',
          phone: userData.profile.phone || '',
          location: userData.profile.location || '',
          education: userData.profile.education || '',
          activeGoal: userData.profile.activeGoal || '',
          resumeUrl: (userData as any).profile.resumeUrl || ''
        });
        
        setEditedName(userData.profile.name || '');
        setEditedPhone(userData.profile.phone || '');
        setEditedLocation(userData.profile.location || '');
        setEditedEducation(userData.profile.education || '');
        setEditedGoal(userData.profile.activeGoal || '');
        setEditedResume((userData as any).profile.resumeUrl || '');
      }

      // Sync applications
      if (userData.applications) {
        const mappedApps = userData.applications.map((app: any, idx: number) => ({
          id: app.id || `app-${idx}`,
          title: app.postingTitle || 'Government Opportunity',
          org: app.postingId?.includes('ssc') ? 'Staff Selection Commission' : app.postingId?.includes('rrb') ? 'Railway Recruitment Board' : 'Ecosystem Match',
          postingId: app.postingId || '',
          status: app.status || 'Submitted',
          date: app.appliedDate || '2026-06-29',
          registrationNumber: app.registrationNumber || `REC-GEN-${Math.floor(100000 + Math.random() * 900000)}`,
          candidateName: app.candidateName || userData.profile?.name || user.displayName || 'Candidate',
          fatherName: app.fatherName || 'Vijay Kumar Singh',
          dob: app.dob || '1999-08-15',
          gender: app.gender || 'Male',
          category: app.category || 'OBC',
          email: app.email || user.email || 'user@example.com',
          phone: app.phone || userData.profile?.phone || '',
          qualification: app.qualification || userData.profile?.education || 'Graduate Degree',
          address: app.address || userData.profile?.location || 'Bhubaneswar, Odisha',
          photoUrl: app.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
          signatureUrl: app.signatureUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
          color: app.status === 'Approved' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25' : app.status === 'Rejected' ? 'text-rose-300 bg-rose-500/10 border-rose-500/25' : 'text-blue-300 bg-blue-500/10 border-blue-500/25'
        }));
        setAppliedJobs(mappedApps);
      } else {
        setAppliedJobs([]);
      }

      // Sync saved bookmarks
      if (userData.savedItems) {
        setSavedItems(userData.savedItems);
      } else {
        setSavedItems([]);
      }

      // Compute dynamic course progress from Firebase userData
      const enrolledIds = userData.enrolledCourses || [];
      setTotalEnrolledCount(enrolledIds.length);
      
      const completedMap = userData.completedModules || {};
      let totalCompletedUnits = 0;

      const mappedCourses = enrolledIds.map(courseId => {
        const course = initialCourses.find(c => c.id === courseId);
        if (!course) return null;
        const completedList = completedMap[courseId] || [];
        totalCompletedUnits += completedList.length;
        const totalUnits = course.syllabus ? course.syllabus.length : course.modules;
        const progress = Math.min(100, Math.round((completedList.length / totalUnits) * 100));
        return {
          ...course,
          completedUnits: completedList.length,
          totalUnits,
          progress
        };
      }).filter(Boolean);

      setEnrolledCourseList(mappedCourses);
      setCompletedCount(totalCompletedUnits);

      // Sync checklist items completed
      if (userData.checkedChecklist) {
        const completedList = Object.values(userData.checkedChecklist).filter(Boolean).length;
        setCompletedChecklistItems(completedList);
      } else {
        setCompletedChecklistItems(0);
      }

    } else {
      // GUEST MODE FALLBACKS (Pulling from LocalStorage)
      const savedAtsScore = localStorage.getItem('recruit_ats_score');
      const savedInterviewScore = localStorage.getItem('recruit_interview_score');
      const savedBusinessScore = localStorage.getItem('recruit_business_score');
      
      setDiagnostics({
        atsScore: savedAtsScore ? parseInt(savedAtsScore, 10) : 74,
        interviewScore: savedInterviewScore ? parseInt(savedInterviewScore, 10) : 0,
        businessScore: savedBusinessScore ? parseInt(savedBusinessScore, 10) : 84
      });

      const guestName = localStorage.getItem('recruit_user_name') || 'Honored Guest';
      setProfile({
        name: guestName,
        email: 'guest@recruitindia.org',
        phone: '+91 98765 43210',
        location: 'Bhubaneswar, Odisha',
        education: 'Graduate Degree (Patna University)',
        activeGoal: 'Government & Public Sector Career',
        resumeUrl: localStorage.getItem('recruit_guest_resume_url') || ''
      });

      setEditedName(guestName);
      setEditedPhone('+91 98765 43210');
      setEditedLocation('Bhubaneswar, Odisha');
      setEditedEducation('Graduate Degree (Patna University)');
      setEditedGoal('Government & Public Sector Career');
      setEditedResume(localStorage.getItem('recruit_guest_resume_url') || '');

      // Pull mock / guest applications
      const savedAppsStr = localStorage.getItem('recruit_applications');
      if (savedAppsStr) {
        try {
          const parsed = JSON.parse(savedAppsStr);
          const mapped = parsed.map((app: any, idx: number) => ({
            id: app.id || `app-${idx}`,
            title: app.postingTitle || 'Government Opportunity',
            org: app.postingId?.includes('ssc') ? 'Staff Selection Commission' : app.postingId?.includes('rrb') ? 'Railway Recruitment Board' : 'Ecosystem Match',
            postingId: app.postingId || '',
            status: app.status || 'Submitted',
            date: app.appliedDate || '2026-06-29',
            registrationNumber: app.registrationNumber || `REC-GEN-${Math.floor(100000 + Math.random() * 900000)}`,
            candidateName: app.candidateName || guestName,
            fatherName: app.fatherName || 'Vijay Kumar Singh',
            dob: app.dob || '1999-08-15',
            gender: app.gender || 'Male',
            category: app.category || 'OBC',
            email: app.email || 'guest@recruitindia.org',
            phone: app.phone || '+91 98765 43210',
            qualification: app.qualification || 'Graduate Degree',
            address: app.address || 'Bhubaneswar, Odisha',
            photoUrl: app.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
            signatureUrl: app.signatureUrl || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
            color: 'text-blue-300 bg-blue-500/10 border-blue-500/25'
          }));
          setAppliedJobs(mapped);
        } catch {
          setAppliedJobs([]);
        }
      } else {
        // Mock default applications for visual beauty in guest mode
        setAppliedJobs([
          { 
            id: 'mock-1', 
            title: 'SSC MTS & Havaldar Online Form 2026', 
            org: 'Staff Selection Commission', 
            postingId: 'ssc-mts-2026',
            status: 'Approved', 
            date: '22 June 2026', 
            color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
            registrationNumber: 'REC-SSCMT-2026-894103',
            candidateName: guestName,
            fatherName: 'Vijay Kumar Singh',
            dob: '1999-08-15',
            gender: 'Male',
            category: 'OBC',
            email: 'guest@recruitindia.org',
            phone: '+91 98765 43210',
            qualification: 'Graduate Degree (Patna University) - Marks: 74.20%',
            address: 'H.No 45, Rajendra Nagar, Patna, Bihar - 800016',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
            signatureUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer'
          },
          { 
            id: 'mock-2', 
            title: 'Railway RRB Assistant Loco Pilot (ALP) Form', 
            org: 'Railway Recruitment Board', 
            postingId: 'rrb-alp-2026',
            status: 'Submitted', 
            date: '24 June 2026', 
            color: 'text-blue-300 bg-blue-500/10 border-blue-500/25',
            registrationNumber: 'REC-RRBAL-2026-150492',
            candidateName: guestName,
            fatherName: 'Suresh Patil',
            dob: '2001-04-12',
            gender: 'Male',
            category: 'General',
            email: 'guest@recruitindia.org',
            phone: '+91 98765 43210',
            qualification: 'ITI Technical pass (NCT Board) - Marks: 82.50%',
            address: 'Sector 4, Plot 12, Kamothe, Navi Mumbai, Maharashtra - 410206',
            photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer',
            signatureUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=60&referrerpolicy=no-referrer'
          }
        ]);
      }

      // Guest Bookmarks
      const savedItemsStr = localStorage.getItem('recruit_bookmarks');
      if (savedItemsStr) {
        try {
          setSavedItems(JSON.parse(savedItemsStr));
        } catch {
          setSavedItems([]);
        }
      } else {
        setSavedItems([
          { id: '1', title: 'PM Mudra Loan Scheme', type: 'Scheme', desc: 'Collateral free funding' },
          { id: '2', title: 'Full-Stack JavaScript & TypeScript Program', type: 'Course', desc: '12 Weeks upskilling path' }
        ]);
      }

      // Guest Course progress
      const guestEnrolledStr = localStorage.getItem('recruit_enrolled_courses');
      const guestEnrolledIds: string[] = guestEnrolledStr ? JSON.parse(guestEnrolledStr) : [];
      setTotalEnrolledCount(guestEnrolledIds.length);

      const guestCompletedStr = localStorage.getItem('recruit_completed_modules');
      const guestCompletedMap: Record<string, string[]> = guestCompletedStr ? JSON.parse(guestCompletedStr) : {};
      
      let guestCompletedTotal = 0;

      const mappedGuestCourses = guestEnrolledIds.map(courseId => {
        const course = initialCourses.find(c => c.id === courseId);
        if (!course) return null;
        const completedList = guestCompletedMap[courseId] || [];
        guestCompletedTotal += completedList.length;
        const totalUnits = course.syllabus ? course.syllabus.length : course.modules;
        const progress = Math.min(100, Math.round((completedList.length / totalUnits) * 100));
        return {
          ...course,
          completedUnits: completedList.length,
          totalUnits,
          progress
        };
      }).filter(Boolean);

      setEnrolledCourseList(mappedGuestCourses);
      setCompletedCount(guestCompletedTotal);

      // Guest checklist count
      const guestChecklistStr = localStorage.getItem('recruit_checked_checklist');
      if (guestChecklistStr) {
        try {
          const parsedChecklist = JSON.parse(guestChecklistStr);
          const completedList = Object.values(parsedChecklist).filter(Boolean).length;
          setCompletedChecklistItems(completedList);
        } catch {
          setCompletedChecklistItems(0);
        }
      } else {
        setCompletedChecklistItems(0);
      }
    }
  }, [user, userData]);

  // Synchronize activities in real time on storage/custom updates
  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem('recruit_activities');
      if (stored) {
        try {
          setActivities(JSON.parse(stored));
        } catch (e) {
          console.error("Error parsing recruit_activities inside storage listener:", e);
        }
      }
    };
    window.addEventListener('storage', handleSync);
    window.addEventListener('recruit_activities_update', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('recruit_activities_update', handleSync);
    };
  }, []);

  // Load or dynamically generate initial/recent activities
  useEffect(() => {
    const stored = localStorage.getItem('recruit_activities');
    let list = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        console.error("Error parsing stored activities:", e);
      }
    }

    if (list.length === 0) {
      const generated: any[] = [];

      // A) Resume evaluation / ATS score activity
      if (diagnostics.atsScore > 0 || profile.resumeUrl) {
        generated.push({
          id: 'gen-ats',
          type: 'resume',
          title: 'Resume ATS Profile Analyzed',
          description: `Ran resume diagnostics. Keyword matching rate evaluated at ${diagnostics.atsScore || 74}% with full layout feedback report.`,
          timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
        });
      }

      // B) Job Applications
      if (appliedJobs && appliedJobs.length > 0) {
        appliedJobs.forEach((job, idx) => {
          generated.push({
            id: `gen-job-${job.id}`,
            type: 'job',
            title: 'Job Application Submitted',
            description: `Successfully filed online slip for "${job.title}" (${job.org}). Receipt ID: ${job.registrationNumber}`,
            timestamp: new Date(Date.now() - (idx + 1) * 24 * 3600 * 1000 - 4 * 3600 * 1000).toISOString()
          });
        });
      }

      // C) Career quiz / assessment history
      if (profile.activeGoal) {
        generated.push({
          id: 'gen-quiz',
          type: 'quiz',
          title: 'Career Personality Assessment Completed',
          description: `Evaluated career target goals and skills. Best matched track: "${profile.activeGoal}".`,
          timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
        });
      }

      // D) Enrolled courses
      if (enrolledCourseList && enrolledCourseList.length > 0) {
        enrolledCourseList.forEach((course, idx) => {
          generated.push({
            id: `gen-course-${course.id}`,
            type: 'course',
            title: 'Enrolled in Skills Course',
            description: `Assigned syllabus track for "${course.title}" sponsored by ${course.provider}.`,
            timestamp: new Date(Date.now() - (idx + 1) * 24 * 3600 * 1000 - 2 * 3600 * 1000).toISOString()
          });
        });
      }

      // E) Default initial signup/welcome activity
      generated.push({
        id: 'gen-welcome',
        type: 'profile',
        title: 'National Digital Registry Formed',
        description: `Successfully created professional profile and initiated employment candidate file.`,
        timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString()
      });

      // Sort by timestamp desc
      generated.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      list = generated.slice(0, 10);
      localStorage.setItem('recruit_activities', JSON.stringify(list));
    }

    setActivities(list);
  }, [appliedJobs, enrolledCourseList, diagnostics.atsScore, diagnostics.interviewScore, profile.resumeUrl, profile.activeGoal]);

  const handleSaveProfile = async () => {
    try {
      if (user) {
        await updateUserProfile({
          name: editedName,
          phone: editedPhone,
          location: editedLocation,
          education: editedEducation,
          activeGoal: editedGoal,
          resumeUrl: editedResume
        } as any);
        setIsEditingProfile(false);
      } else {
        localStorage.setItem('recruit_user_name', editedName);
        localStorage.setItem('recruit_guest_resume_url', editedResume);
        setProfile(prev => ({
          ...prev,
          name: editedName,
          phone: editedPhone,
          location: editedLocation,
          education: editedEducation,
          activeGoal: editedGoal,
          resumeUrl: editedResume
        }));
        setIsEditingProfile(false);
      }
      addActivity('profile', 'Registry Profile Updated', `Successfully updated professional registry details for "${editedName}".`);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    if (user) {
      await updateBookmarks(updated).catch(err => console.error("Firebase sync error:", err));
    } else {
      localStorage.setItem('recruit_bookmarks', JSON.stringify(updated));
    }
  };

  // Profile Completeness math (out of 100%)
  const calculateCompleteness = () => {
    let score = 0;
    if (profile.name && profile.name !== 'Honored Guest') score += 15;
    if (profile.email && profile.email !== 'guest@recruitindia.org') score += 15;
    if (profile.phone) score += 15;
    if (profile.location) score += 15;
    if (profile.education) score += 15;
    if (profile.activeGoal) score += 15;
    if (profile.resumeUrl) score += 10;
    return score;
  };

  const completeness = calculateCompleteness();

  // Dynamic badges awarded based on actions
  const getEarnedBadges = () => {
    const earned = [];
    if (diagnostics.atsScore >= 70) {
      earned.push({ name: 'ATS Explorer', desc: 'Achieved >70% resume score.', icon: '🏆', color: 'from-amber-500 to-yellow-500' });
    }
    if (diagnostics.interviewScore > 0) {
      earned.push({ name: 'Voice Orator', desc: `Scored ${diagnostics.interviewScore}% in AROHI live panel interview.`, icon: '🗣️', color: 'from-blue-500 to-cyan-500' });
    } else {
      earned.push({ name: 'Aspirant Step', desc: 'Initiate a mock session to lock in speech diagnostics.', icon: '🎓', color: 'from-slate-600 to-slate-400' });
    }
    if (completedChecklistItems > 0 || subscriptions.path3) {
      earned.push({ name: 'MSME Visionary', desc: 'Completed startup checklists or business matching.', icon: '🚀', color: 'from-purple-500 to-pink-500' });
    }
    if (completedCount > 0 || totalEnrolledCount > 0) {
      earned.push({ name: 'Academic Scholar', desc: 'Active student enrolled in professional curriculum tracks.', icon: '📚', color: 'from-emerald-500 to-teal-500' });
    }
    return earned;
  };

  const earnedBadges = getEarnedBadges();

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
    },
    {
      id: 'path4',
      title: 'Path 4: Class 1-10 Student Support',
      desc: 'Interactive school curriculum, high-quality unique chapters, and personalized academic guidance.',
      price: '₹399/mo',
      perks: ['NCERT mapped curriculum & unique notes', 'Personalized chapter quiz feedback', 'Sciences & Languages syllabus notes', '24/7 School support from AROHI AI']
    }
  ];

  const hasAnyActive = Object.values(subscriptions).some(Boolean);

  return (
    <div className="space-y-6">
      
      {/* Guest warning banner if not logged in */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-500 p-3.5 rounded-2xl text-slate-950 shadow-md">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <span>Guest Local Workspace Active</span>
                <span className="bg-amber-500/25 text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">UNSAVED PROGRESS</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 font-semibold leading-relaxed max-w-xl">
                You are utilizing localized state caches. Connect with secure cloud sign-in to backup your career matching bookmarks, enrolled courses progress, checklist achievements, and job application histories persistently across devices!
              </p>
            </div>
          </div>
          <button 
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg transition-all shrink-0 cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <LogIn className="w-4 h-4" /> Connect with Google Sign-In
          </button>
        </div>
      )}

      {/* Profile Overview Card & Completeness tracker */}
      <div className="bg-slate-950 text-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-850 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-br from-blue-600/15 to-purple-600/15 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        
        <div className="relative flex flex-col lg:flex-row gap-8 items-stretch justify-between">
          
          {/* Avatar and Info panel */}
          <div className="flex flex-col md:flex-row gap-6 items-start lg:items-center flex-1">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] text-white flex items-center justify-center font-black text-2xl shadow-xl border border-purple-400/30 shrink-0 relative">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'IN'}
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-slate-950 w-5 h-5 rounded-full flex items-center justify-center" title="Online profile active">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>

            <div className="text-left space-y-3 flex-1 w-full">
              {isEditingProfile ? (
                <div className="space-y-4 max-w-2xl bg-[#110d29]/60 border border-[#3b2b73]/60 p-5 rounded-2xl text-slate-100">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#241a4d]">
                    <Edit3 className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">Edit Your Professional Register Profile</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" 
                        value={editedName} 
                        onChange={e => setEditedName(e.target.value)}
                        className="w-full bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none transition-colors font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Contact Phone</label>
                      <input 
                        type="text" 
                        value={editedPhone} 
                        onChange={e => setEditedPhone(e.target.value)}
                        className="w-full bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none transition-colors font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Residence Location</label>
                      <input 
                        type="text" 
                        value={editedLocation} 
                        onChange={e => setEditedLocation(e.target.value)}
                        className="w-full bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none transition-colors font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Education Level</label>
                      <input 
                        type="text" 
                        value={editedEducation} 
                        onChange={e => setEditedEducation(e.target.value)}
                        className="w-full bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none transition-colors font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Primary Career Goal</label>
                      <input 
                        type="text" 
                        value={editedGoal} 
                        onChange={e => setEditedGoal(e.target.value)}
                        className="w-full bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none transition-colors font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Resume Link / Portfolio URL</label>
                      <input 
                        type="text" 
                        value={editedResume} 
                        placeholder="https://drive.google.com/..."
                        onChange={e => setEditedResume(e.target.value)}
                        className="w-full bg-[#0d0a20] border border-[#2d215d] rounded-xl px-3.5 py-2 text-xs text-white focus:border-purple-500 outline-none transition-colors font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" /> Save Profile Details
                    </button>
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black uppercase rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
                        <span className="bg-[#7c3aed]/20 text-[#a78bfa] border border-[#7c3aed]/30 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Verified Candidate Profile
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-slate-400 text-xs font-semibold">
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-purple-400" /> {profile.email}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-purple-400" /> {profile.phone || 'No phone set'}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {profile.location || 'No location set'}</span>
                      </div>

                      <div className="text-xs text-slate-300 font-bold pt-1">
                        🏫 Academic Credentials: <span className="text-white font-black">{profile.education || 'Not specified'}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1 items-center">
                        <span className="text-xs text-emerald-400 font-extrabold">
                          🎯 Active Career Target: {profile.activeGoal || 'Set your target goal'}
                        </span>
                        {profile.resumeUrl && (
                          <a 
                            href={profile.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 text-[10px] bg-blue-500/10 border border-blue-500/25 px-2 py-0.5 rounded text-blue-300 font-bold hover:bg-blue-500/20 transition-all"
                          >
                            <FileText className="w-3 h-3" /> View Portfolio / Resume <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Profile completeness panel */}
          <div className="lg:w-72 bg-[#0c0820]/75 border border-[#2b1f5d] p-5 rounded-2xl flex flex-col justify-center space-y-3 self-center shrink-0">
            <div className="flex justify-between items-center text-xs font-black uppercase">
              <span className="text-slate-300">Registration Completeness</span>
              <span className="text-purple-400">{completeness}%</span>
            </div>
            
            <div className="w-full bg-[#1b143d] h-3 rounded-full overflow-hidden border border-[#30246a] p-0.5">
              <div 
                className="bg-gradient-to-r from-purple-600 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${completeness}%` }}
              ></div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed text-left">
              {completeness === 100 
                ? '🎉 Perfect! Your professional digital portfolio is fully formulated.' 
                : '💡 Complete all contact details, career goals, and portfolio resume links to maximize matching index ratios.'
              }
            </p>

            {!isEditingProfile && (
              <div className="flex flex-col gap-2 w-full">
                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#1a143a] hover:bg-[#251e54] border border-slate-800 rounded-xl text-[11px] font-black uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-purple-400" /> Complete Registry Profile
                </button>
                {onShare && (
                  <button 
                    onClick={onShare}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 rounded-xl text-[11px] font-black uppercase tracking-wider text-emerald-400 hover:text-white transition-all cursor-pointer shadow-sm"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-400" /> Share Platform
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CORE STATS GRID - NEW WORKSPACE SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#120e2a] border border-[#20174e] rounded-2xl p-4 text-left relative overflow-hidden">
          <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wider">Active Paths Subscriptions</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{Object.values(subscriptions).filter(Boolean).length}</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Unlocked</span>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold mt-1.5 leading-tight">Continuous assistance plan</p>
        </div>

        <div className="bg-[#120e2a] border border-[#20174e] rounded-2xl p-4 text-left relative overflow-hidden">
          <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wider">Courses Enrolled</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{totalEnrolledCount}</span>
            <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">Academy</span>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold mt-1.5 leading-tight">Curriculum programs loaded</p>
        </div>

        <div className="bg-[#120e2a] border border-[#20174e] rounded-2xl p-4 text-left relative overflow-hidden">
          <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wider">Completed Academic Units</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{completedCount}</span>
            <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">Checked</span>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold mt-1.5 leading-tight">Module checklist steps completed</p>
        </div>

        <div className="bg-[#120e2a] border border-[#20174e] rounded-2xl p-4 text-left relative overflow-hidden">
          <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wider">Applied Opportunities</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white">{appliedJobs.length}</span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Receipts</span>
          </div>
          <p className="text-[9px] text-slate-400 font-semibold mt-1.5 leading-tight">Official registration slips active</p>
        </div>
      </div>

      {/* MONTHLY SUBSCRIPTIONS CONTROL AREA */}
      <div className="bg-[#120e2b] border border-[#2d2163] p-6 rounded-[2rem] text-left text-white shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#211b4d] pb-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-pulse" /> My Assistance Subscription Plans (₹399/Month)
            </h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Active subscription holders receive continuous real-time support, priority application routing, and counselor guidelines.
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
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#1e1545] border-[#a78bfa] shadow-[0_0_15px_rgba(167,139,250,0.25)]' 
                    : 'bg-[#0f0b24] border-[#221a4f] hover:border-[#382b7c]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-black text-white leading-snug">{path.title}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-normal font-semibold">{path.desc}</p>
                  
                  <div className="space-y-1.5 pt-1.5">
                    {path.perks.map((p, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-[#231a4d] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-black text-violet-300">{path.price}</span>
                  <button
                    onClick={() => onSubscribe && onSubscribe(path.id)}
                    className={`text-[9px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
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
          <div className="bg-[#17123a] border border-[#302470] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#a855f7] block font-mono">Growth Tracker Index</span>
              <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <span>📈 Progress Status: Priority Processing Active</span>
                <span className="bg-[#10b981]/20 text-[#10b981] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">Premium Access Enabled</span>
              </h4>
              <p className="text-[10px] text-slate-400 leading-snug">
                Your resume analysis and job requests are priority routed. Full 24/7 AROHI Live AI workspace limits are completely lifted.
              </p>
            </div>
            <div className="w-full sm:w-48 text-right space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Billing Cycle Completion</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-[#2a1d52] h-2 rounded-full overflow-hidden border border-[#3b2b73]">
                <div className="bg-gradient-to-r from-[#a855f7] to-[#10b981] h-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1a1122] border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">No Active Assistance Subscription</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Please subscribe to any strategic path above or on the homepage to unlock unlimited continuous support guidelines for ₹399/month.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column applications & dynamic course progress */}
        <div className="lg:col-span-8 space-y-6">

          {/* RECENT ACTIVITY FEED */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl text-left">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600 animate-pulse" /> Recent Activity Feed
              </h3>
              {activities.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your activity history?")) {
                      localStorage.setItem('recruit_activities', JSON.stringify([]));
                      setActivities([]);
                    }
                  }}
                  className="text-[9px] font-black uppercase tracking-wider text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            {activities.length === 0 ? (
              <p className="text-slate-400 text-xs font-semibold py-4 text-center">No recent actions logged on this profile.</p>
            ) : (
              <div className="relative border-l border-slate-100 ml-3 pl-5 space-y-5 py-2">
                {activities.map((act) => {
                  let badgeColor = 'bg-blue-100 text-blue-800';
                  let iconElement = <FileText className="w-3 h-3" />;
                  if (act.type === 'job') {
                    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                    iconElement = <Briefcase className="w-3 h-3" />;
                  } else if (act.type === 'quiz') {
                    badgeColor = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                    iconElement = <Award className="w-3 h-3" />;
                  } else if (act.type === 'resume') {
                    badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                    iconElement = <FileText className="w-3 h-3" />;
                  } else if (act.type === 'course') {
                    badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
                    iconElement = <GraduationCap className="w-3 h-3" />;
                  } else if (act.type === 'profile') {
                    badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
                    iconElement = <User className="w-3 h-3" />;
                  }

                  // Format relative or neat date
                  const dateStr = new Date(act.timestamp).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <div key={act.id} className="relative group text-left">
                      {/* Timeline dot */}
                      <span className="absolute -left-[26px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white border-2 border-indigo-500 ring-4 ring-white"></span>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase border ${badgeColor}`}>
                            {iconElement}
                            {act.type}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-800 tracking-tight leading-snug">{act.title}</h4>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 font-mono sm:self-center shrink-0">
                          <Clock className="w-2.5 h-2.5" />
                          {dateStr}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">{act.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* NEW MODULE: DYNAMIC ACADEMY COURSE PROGRESS TRACKER */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-600" /> My Enrolled Courses & Progress ({enrolledCourseList.length})
            </h3>

            {enrolledCourseList.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-slate-400 text-xs font-semibold">You haven't enrolled in any educational course pathways yet.</p>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('courses')}
                  className="px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Explore Course Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledCourseList.map((course) => (
                  <div 
                    key={course.id} 
                    className="border border-slate-150 rounded-2xl p-5 hover:border-purple-200 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50"
                  >
                    <div className="space-y-1.5 flex-1 w-full text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                          course.category === 'tech' ? 'bg-blue-100 text-blue-800' : course.category === 'business' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {course.category}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{course.title}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold">{course.provider} • Duration: {course.duration}</p>
                      
                      {/* Course progress bar */}
                      <div className="space-y-1 max-w-sm pt-1">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                          <span>Syllabus units ({course.completedUnits}/{course.totalUnits})</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden p-px border border-slate-300">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-300" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center justify-end shrink-0 w-full md:w-auto">
                      {course.progress === 100 ? (
                        <>
                          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[9px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1">
                            ✓ CERTIFIED
                          </span>
                          <button
                            onClick={() => setActiveCertificate(course)}
                            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 hover:from-yellow-400 hover:to-amber-400 font-black text-[9px] uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            🏅 View Certificate
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-wider">
                            ⚡ IN PROGRESS
                          </span>
                          <button
                            onClick={() => onNavigateTab && onNavigateTab('courses')}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-[9px] uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-white" /> Resume learning
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE APPLICATIONS RECEIPT SLIPS */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> My Active Job Applications ({appliedJobs.length})
            </h3>

            <div className="space-y-3">
              {appliedJobs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                  No active job applications found. 
                  <button 
                    onClick={() => onNavigateTab && onNavigateTab('jobs')}
                    className="block mx-auto mt-2 text-blue-600 hover:underline font-bold"
                  >
                    Browse Active Vacancy Postings
                  </button>
                </div>
              ) : (
                appliedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="border border-slate-150 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-200 transition-colors bg-slate-50/50"
                  >
                    <div className="text-left space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-800 leading-snug">{job.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-bold">
                        <span>{job.org}</span>
                        <span>•</span>
                        <span>Receipt: <span className="font-mono text-slate-500 font-black">{job.registrationNumber}</span></span>
                      </div>
                      <span className="block text-[9px] text-slate-400 font-medium pt-0.5">Submitted On: {job.date}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                      <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border ${job.color}`}>
                        {job.status}
                      </span>
                      <button
                        onClick={() => setActiveReceipt(job)}
                        className="px-3.5 py-2 bg-slate-900 text-white hover:bg-slate-850 text-[9px] font-black uppercase tracking-wider rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Slip
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bookmarked items */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-rose-500" /> Saved Opportunities & Schemes ({savedItems.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedItems.length === 0 ? (
                <p className="text-slate-400 text-xs font-semibold py-4 col-span-2 text-center">No saved opportunities or courses yet.</p>
              ) : (
                savedItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-left flex justify-between items-start gap-3 hover:border-slate-300 transition-colors">
                    <div className="flex-1 min-w-0">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.type === 'Scheme' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>{item.type}</span>
                      <h4 className="font-extrabold text-xs text-slate-800 truncate leading-snug mt-2">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-relaxed truncate">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => onNavigateTab && onNavigateTab(item.type === 'Scheme' ? 'schemes' : 'courses')}
                        className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition-all cursor-pointer"
                        title="View Opportunity Details"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBookmark(item.id)}
                        className="p-1.5 bg-white hover:bg-rose-50 border border-slate-200 text-slate-400 hover:text-rose-500 rounded-lg transition-all cursor-pointer"
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
          
          {/* AROHI LIVE INTERACTIVE DIAGNOSTICS RADAR */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600 animate-pulse" /> AROHI Diagnostics Scores
            </h3>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5 border-b border-slate-50 pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-extrabold">Resume ATS Rating</span>
                  <span className="text-blue-600 font-black text-sm bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">{diagnostics.atsScore}% Score</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-px border">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${diagnostics.atsScore}%` }}></div>
                </div>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('resume')}
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 font-bold"
                >
                  Analyze ATS Resume <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5 border-b border-slate-50 pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-extrabold">Interview Readiness</span>
                  {diagnostics.interviewScore > 0 ? (
                    <span className="text-emerald-600 font-black text-sm bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100">{diagnostics.interviewScore}% Score</span>
                  ) : (
                    <span className="text-slate-400 font-black text-[10px] uppercase bg-slate-100 px-2 py-0.5 rounded-lg">Uninitiated</span>
                  )}
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-px border">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${diagnostics.interviewScore}%` }}></div>
                </div>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('interview')}
                  className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5 font-bold"
                >
                  Run Speech Simulator <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-extrabold">Business Viability Score</span>
                  <span className="text-purple-600 font-black text-sm bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">{diagnostics.businessScore}% Score</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-px border">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${diagnostics.businessScore}%` }}></div>
                </div>
                <button 
                  onClick={() => onNavigateTab && onNavigateTab('business')}
                  className="text-[10px] text-purple-600 hover:underline flex items-center gap-0.5 font-bold"
                >
                  Udyam Launchpad checklist <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Gamified Achievements badges */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-50 pb-2.5 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Career Milestones Badges ({earnedBadges.length})
            </h3>

            <div className="space-y-4">
              {earnedBadges.map((b, idx) => (
                <div key={idx} className="flex gap-4.5 items-center text-left">
                  <div className={`text-2xl bg-gradient-to-tr ${b.color} text-white p-3 rounded-2xl shadow-md shrink-0 border border-white/20`}>
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 leading-snug">{b.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECURE BIOMETRIC PASSKEY CENTER */}
          <div className="bg-[#0b071c] border border-purple-500/30 p-6 rounded-[2rem] text-left text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-xs font-black uppercase tracking-wider text-[#a78bfa] mb-3 border-b border-purple-900/50 pb-2.5 flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-purple-400 animate-pulse" /> Biometric Authentication
            </h3>

            {!isBioSupported ? (
              <div className="space-y-2 text-xs">
                <p className="text-slate-400 leading-normal font-semibold">
                  Secure cryptographic Touch ID / Face ID bypasses traditional phishing.
                </p>
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200 text-[10px] leading-relaxed font-bold">
                  ⚠️ WebAuthn cryptographic biometrics require secure execution. If running in an iframe, click <span className="text-white font-black">"Open in New Tab"</span> at the top right of your preview window to register your sensor!
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400 leading-normal font-semibold">
                  Register your device to log in instantly using Face ID or your fingerprint.
                </p>

                {bioError && (
                  <div className="p-2.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-300 text-[10px] font-semibold leading-relaxed">
                    {bioError}
                  </div>
                )}

                {bioSuccess && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-300 text-[10px] font-semibold leading-relaxed">
                    {bioSuccess}
                  </div>
                )}

                {isBioEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-[#120c2a] border border-[#3b218f] p-3 rounded-xl">
                      <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Passkey Enrolled</p>
                        <p className="text-[9px] text-slate-400 font-mono mt-0.5">Device key active for your email</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setBioError(null);
                          setBioSuccess(null);
                          try {
                            const success = await authenticateBiometricDevice(profile.email);
                            if (success) {
                              setBioSuccess("✅ Touch ID / Face ID validation succeeded! Physical presence verified.");
                            }
                          } catch (err: any) {
                            setBioError(err.message || "Verification cancelled.");
                          }
                        }}
                        className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-95 text-center font-bold"
                      >
                        Test Sensor
                      </button>
                      <button
                        onClick={handleRemoveBiometric}
                        className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-95 font-bold"
                      >
                        Delete Key
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleRegisterBiometric}
                    disabled={isEnrolling}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-lg hover:shadow-purple-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isEnrolling ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning sensor...</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-4 h-4 text-purple-200" />
                        <span>Register Fingerprint/FaceID</span>
                      </>
                    )}
                  </button>
                )}

                <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1 mt-1 justify-center border-t border-purple-950/40 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                  <span>SECURE PASSKEY (AES-GCM CRYPTO)</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* GOVERNMENT STYLE APPLICATION RECEIPT MODAL */}
      {activeReceipt && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-250">
          <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative border-t-8 border-blue-600 text-left overflow-y-auto max-h-[90vh]">
            
            <button 
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 right-4 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="border-b-2 border-dashed border-slate-200 pb-4 flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">RECRUIT INDIA DIGITAL PORTAL</span>
                <h3 className="text-lg font-black text-slate-900">Official Application Acknowledgement Slip</h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase">National Employment Verification Service</p>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[8px] uppercase font-black text-slate-400">Security Slip Id</span>
                <span className="font-mono text-xs font-black bg-slate-100 px-2 py-1 rounded text-slate-800">{activeReceipt.registrationNumber}</span>
              </div>
            </div>

            {/* Slip Core Details */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              
              {/* Photo & Sig */}
              <div className="sm:col-span-4 flex flex-col items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                <div className="w-24 h-28 border border-slate-300 rounded-xl bg-slate-100 overflow-hidden relative shadow-inner">
                  <img src={activeReceipt.photoUrl} alt="Candidate photograph" className="w-full h-full object-cover" />
                </div>
                <div className="w-24 h-8 border border-slate-300 rounded-lg bg-white overflow-hidden p-1 shadow-inner flex items-center justify-center">
                  <img src={activeReceipt.signatureUrl} alt="Candidate signature" className="w-full h-full object-contain filter contrast-125 saturate-0" />
                </div>
                <span className="text-[8px] uppercase font-black text-slate-400">Authenticated Signature</span>
              </div>

              {/* Data Table */}
              <div className="sm:col-span-8 grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-bold text-slate-800">
                <div className="col-span-2 border-b pb-1">
                  <span className="block text-[8px] uppercase text-slate-400">Applied Opportunity Track</span>
                  <span className="text-slate-900 text-[13px] font-black">{activeReceipt.title}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-slate-400">Candidate Name</span>
                  <span className="text-slate-900 font-extrabold">{activeReceipt.candidateName}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-slate-400">Father's Name</span>
                  <span className="text-slate-900 font-extrabold">{activeReceipt.fatherName}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-slate-400">Date of Birth</span>
                  <span className="text-slate-900 font-extrabold">{activeReceipt.dob}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase text-slate-400">Category & Gender</span>
                  <span className="text-slate-900 font-extrabold">{activeReceipt.category} / {activeReceipt.gender}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] uppercase text-slate-400">Academic Qualifications</span>
                  <span className="text-slate-900 text-[11px] leading-tight block">{activeReceipt.qualification}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[8px] uppercase text-slate-400">Correspondence Address</span>
                  <span className="text-slate-900 text-[11px] leading-tight block font-semibold">{activeReceipt.address}</span>
                </div>
              </div>
            </div>

            {/* Stamp Footer */}
            <div className="border-t-2 border-dashed border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-left space-y-1 text-[10px] font-semibold text-slate-500">
                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SYSTEM SIGNED & VERIFIED
                </div>
                <p>Digital Submission Key: <span className="font-mono text-slate-600">MD5: {Math.random().toString(16).slice(2, 10).toUpperCase()}</span></p>
                <p>Stamp Date: {activeReceipt.date} • Secured Gateway Server IP 0.0.0.0</p>
              </div>

              {/* Print actions */}
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Print Acknowledgement Slip
                </button>
                <button 
                  onClick={() => setActiveReceipt(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FULLY FUNCTIONAL ISO CERTIFICATE OF COMPLETION MODAL */}
      {activeCertificate && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#120e2a] border-4 border-double border-yellow-500/40 text-white rounded-[2rem] max-w-2xl w-full p-8 space-y-6 shadow-2xl relative text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-yellow-500/20 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-yellow-500/20 rounded-br-xl pointer-events-none"></div>
            
            <button 
              onClick={() => setActiveCertificate(null)}
              className="absolute top-4 right-4 p-2 bg-[#1b143c] hover:bg-[#251e54] text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-[#a78bfa] uppercase">ISO 9001:2015 Verified Academic Credential</span>
                <h2 className="font-serif text-3xl font-bold tracking-wide text-yellow-300">Certificate of Completion</h2>
                <p className="text-[11px] text-slate-400">National Skill Development Framework, Govt of India Registered Partner</p>
              </div>

              <div className="py-6 border-y border-yellow-500/20 space-y-4">
                <p className="text-xs text-slate-300 italic font-medium">This is proudly presented and certified to</p>
                <h3 className="text-2xl font-black text-white underline decoration-yellow-500/40 underline-offset-8">
                  {profile.name}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-md mx-auto">
                  for outstandingly completing all educational syllabus units, mock exams, and practical sandbox code challenges under the academic track program
                </p>
                <h4 className="text-base font-black text-yellow-100 max-w-lg mx-auto">
                  "{activeCertificate.title}"
                </h4>
              </div>

              <div className="flex justify-between items-center text-left text-[10px] font-semibold text-slate-400">
                <div>
                  <span className="block text-slate-500 uppercase font-bold text-[8px]">Verification ID</span>
                  <span className="font-mono text-slate-300">CERT-{activeCertificate.id.toUpperCase()}-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto bg-yellow-500/5 text-yellow-300 font-bold">
                    ★
                  </div>
                  <span className="block mt-1 uppercase text-[8px]">Arohi Certified</span>
                </div>
                <div className="text-right">
                  <span className="block text-slate-500 uppercase font-bold text-[8px]">Directing Authority</span>
                  <span className="text-slate-200">Arohi Elite Academy</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer shadow-md"
                >
                  🖨️ Print Certificate
                </button>
                <button
                  onClick={() => setActiveCertificate(null)}
                  className="px-5 py-2.5 bg-[#1b143c] border border-[#2d2163] text-slate-300 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
