import React, { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, Trash2, Edit2, Check, X, Users, Briefcase, FileCheck, Landmark, Database, UserCheck, Eye, EyeOff,
  Lock, ShieldAlert, Sparkles, LogOut, Clock, Activity, ShieldCheck, RefreshCw, BarChart3, MessageSquare, BookOpen, AlertCircle, Play, Coins, Shield, Settings, ChevronRight, Search, HeartPulse, Sparkle,
  TrendingUp, Percent, Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Posting, Application, CategoryType, VacancyDetail } from '../types';
import { 
  INITIAL_ADMIN_USERS, INITIAL_PAYMENTS, INITIAL_CHAT_LOGS, AdminUser, PaymentTransaction, ArohiChatLog 
} from '../data/adminMockData';

interface AdminPanelProps {
  postings: Posting[];
  onAddPosting: (posting: Posting) => void;
  onEditPosting: (posting: Posting) => void;
  onDeletePosting: (id: string) => void;
  applications: Application[];
  onUpdateAppStatus: (id: string, status: 'Approved' | 'Rejected') => void;
}

export default function AdminPanel({
  postings,
  onAddPosting,
  onEditPosting,
  onDeletePosting,
  applications,
  onUpdateAppStatus
}: AdminPanelProps) {
  // Authentication & Session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('recruit_admin_is_logged_in') === 'true';
  });
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAccessGranted, setShowAccessGranted] = useState(false);

  // Core administrative database tables state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('recruit_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('recruit_admin_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  const [chatLogs, setChatLogs] = useState<ArohiChatLog[]>(() => {
    const saved = localStorage.getItem('recruit_admin_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_LOGS;
  });

  // Selected sub-elements for drill-down views
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedChat, setSelectedChat] = useState<ArohiChatLog | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [customAiGuideline, setCustomAiGuideline] = useState('');
  const [guidelineSuccess, setGuidelineSuccess] = useState(false);

  // Merchant UPI / QR Setup State variables
  const [upiId, setUpiId] = useState('elitetraderjunoon@oksbi');
  const [merchantName, setMerchantName] = useState('Recruit India Portal');
  const [bankName, setBankName] = useState('Airtel Payments Bank / PhonePe');
  const [isUpdatingUpi, setIsUpdatingUpi] = useState(false);
  const [upiUpdateSuccess, setUpiUpdateSuccess] = useState(false);

  // UI state variables
  const [activeSubTab, setActiveSubTab] = useState<'telemetry' | 'users' | 'finance' | 'chats' | 'postings' | 'creator' | 'analytics'>('telemetry');
  const [telemetryLogs, setTelemetryLogs] = useState<any[]>([]);
  const [liveUsersCount, setLiveUsersCount] = useState(18);
  const [isSimulatingEvent, setIsSimulatingEvent] = useState<string | null>(null);
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Edit Posting state
  const [editingPostingId, setEditingPostingId] = useState<string | null>(null);

  // Form states for creating/editing recruitment posting
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [category, setCategory] = useState<CategoryType>('latest-jobs');
  const [department, setDepartment] = useState('SSC');
  const [tagsInput, setTagsInput] = useState('');
  const [shortInfo, setShortInfo] = useState('');
  const [applicationBegin, setApplicationBegin] = useState('2026-06-30');
  const [lastDateApply, setLastDateApply] = useState('2026-07-30');
  const [lastDateFee, setLastDateFee] = useState('2026-07-30');
  const [examDate, setExamDate] = useState('September 2026');
  const [admitCardAvailable, setAdmitCardAvailable] = useState('August 2026');
  const [resultDeclared, setResultDeclared] = useState('');
  const [feeGeneral, setFeeGeneral] = useState('₹ 100/-');
  const [feeSCST, setFeeSCST] = useState('₹ 0/-');
  const [feeFemale, setFeeFemale] = useState('₹ 0/-');
  const [paymentMode, setPaymentMode] = useState('Online NetBanking, UPI, Cards');
  const [ageAsOnDate, setAgeAsOnDate] = useState('01/08/2026');
  const [ageMin, setAgeMin] = useState('18 Years');
  const [ageMax, setAgeMax] = useState('27 Years');
  const [ageRelaxation, setAgeRelaxation] = useState('Age relaxation extra as per standard central reservation directives.');
  const [totalVacancies, setTotalVacancies] = useState<number>(350);
  const [vacanciesList, setVacanciesList] = useState<VacancyDetail[]>([
    { postName: 'General Assistant', totalPosts: 350, eligibility: 'Class 10th (Matriculation) or equivalent from any recognized Indian board.' }
  ]);
  const [officialSite, setOfficialSite] = useState('https://ssc.gov.in');

  // Real data fetch function
  const fetchRealData = async () => {
    const adminToken = sessionStorage.getItem('recruit_admin_token') || 'recruit_admin_authorized_token_2026';
    try {
      // 1. Fetch Users List
      const responseUsers = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (responseUsers.ok) {
        const data = await responseUsers.json();
        setAdminUsers(data.users);
      }

      // 2. Fetch Payments List
      const responsePayments = await fetch('/api/admin/payments', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (responsePayments.ok) {
        const data = await responsePayments.json();
        setPayments(data.payments);
      }

      // Fetch UPI Merchant Settings
      const responseUpiSettings = await fetch('/api/admin/payment-settings');
      if (responseUpiSettings.ok) {
        const upiData = await responseUpiSettings.json();
        setUpiId(upiData.upiId);
        setMerchantName(upiData.merchantName);
        setBankName(upiData.bankName);
      }

      // 3. Fetch Chats List
      const responseChats = await fetch('/api/admin/chats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (responseChats.ok) {
        const data = await responseChats.json();
        setChatLogs(data.chats);
      }

      // 4. Fetch Stats & Activity telemetry
      const responseStats = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (responseStats.ok) {
        const data = await responseStats.json();
        if (data.activities && data.activities.length > 0) {
          setTelemetryLogs(data.activities.map((act: any, idx: number) => ({
            id: act.id || `act-${idx}`,
            time: act.time || new Date().toTimeString().split(' ')[0],
            type: act.type || 'system',
            text: act.text
          })));
        }
      }
    } catch (err) {
      console.error('Failed to sync administrative data from live backend server:', err);
    }
  };

  // Sync state changes back to server
  const syncUserToServer = async (user: AdminUser) => {
    const adminToken = sessionStorage.getItem('recruit_admin_token') || 'recruit_admin_authorized_token_2026';
    try {
      await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.error('Failed to update user profile on the server:', err);
    }
  };

  // Fetch real data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchRealData();
      const interval = setInterval(() => {
        fetchRealData();
        setLiveUsersCount(prev => {
          const delta = Math.random() > 0.55 ? 1 : -1;
          const updated = prev + delta;
          return updated >= 12 && updated <= 35 ? updated : prev;
        });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Keep digital clock active
  useEffect(() => {
    const clockTimer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Trigger login via actual express backend API
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginId || !loginPassword) {
      setLoginError('Credentials coordinates missing.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginId, password: loginPassword })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('recruit_admin_token', data.token);
        
        // Cybernetic scanner visual delay
        setTimeout(() => {
          setShowAccessGranted(true);
          setTimeout(() => {
            setIsLoggedIn(true);
            sessionStorage.setItem('recruit_admin_is_logged_in', 'true');
            setIsLoggingIn(false);
            setLoginPassword('');
          }, 1600);
        }, 800);
      } else {
        const errData = await response.json();
        setLoginError(errData.error || 'ACCESS DENIED: Credentials mismatch or signature key invalid.');
        setIsLoggingIn(false);
      }
    } catch (err) {
      setLoginError('Server Link Unavailable: Offline or bad route.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('recruit_admin_is_logged_in');
    sessionStorage.removeItem('recruit_admin_token');
    setIsLoggedIn(false);
    setShowAccessGranted(false);
  };

  // Telemetry Simulator
  const triggerTelemetrySimulation = (type: string) => {
    setIsSimulatingEvent(type);
    setTimeout(() => {
      const timeStr = new Date().toTimeString().split(' ')[0];
      let msg = '';
      if (type === 'visitor') {
        msg = 'Simulated visitor spiked traffic: 5 sessions launched from Cuttack district';
      } else if (type === 'payment') {
        msg = 'Mock UPI Webhook triggered: Payment verified for elitetraderjunoon@gmail.com (₹399)';
        // Append payment
        const newTx: PaymentTransaction = {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          userEmail: 'elitetraderjunoon@gmail.com',
          amount: 399,
          planName: 'Path 3: Udyam Business Assistance Plan',
          method: 'UPI',
          date: '29/06/2026',
          status: 'Verified'
        };
        setPayments(prev => [newTx, ...prev]);
      } else if (type === 'chat') {
        msg = 'Live conversation simulated: Guest generated mock CV evaluation transcript';
      }

      setTelemetryLogs(prev => [
        { id: `sim-${Date.now()}`, time: timeStr, type: 'system', text: `[SIMULATOR] ${msg}` },
        ...prev
      ]);
      setIsSimulatingEvent(null);
    }, 1200);
  };

  // Toggle user permissions with live server sync
  const toggleUserPermission = async (userId: string, key: 'canEditJobs' | 'canApproveApps' | 'canViewFinance') => {
    const targetUser = adminUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUser = {
      ...targetUser,
      permissions: {
        ...targetUser.permissions,
        [key]: !targetUser.permissions[key]
      }
    };

    setAdminUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(updatedUser);
    }

    await syncUserToServer(updatedUser);
  };

  // Toggle user active services with live server sync
  const toggleUserServices = async (userId: string, key: 'path1' | 'path2' | 'path3') => {
    const targetUser = adminUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUser = {
      ...targetUser,
      services: {
        ...targetUser.services,
        [key]: !targetUser.services[key]
      }
    };

    setAdminUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(updatedUser);
    }

    await syncUserToServer(updatedUser);
  };

  // Modify overall status with live server sync
  const updateUserStatus = async (userId: string, status: 'Active' | 'Suspended' | 'VIP') => {
    const targetUser = adminUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUser = { ...targetUser, status };

    setAdminUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(updatedUser);
    }

    await syncUserToServer(updatedUser);
  };

  // Update specific customized configurations with live server sync
  const updateCustomSettings = async (userId: string, field: 'tutoringSlot' | 'priorityLevel' | 'assignedMentor', value: string) => {
    const targetUser = adminUsers.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUser = {
      ...targetUser,
      customizedSettings: {
        ...targetUser.customizedSettings,
        [field]: value
      }
    };

    setAdminUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(updatedUser);
    }

    await syncUserToServer(updatedUser);
  };

  // Delete user from live database
  const handleDeleteUser = async (email: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete profile for: ${email}? This action is irreversible.`)) {
      return;
    }
    const adminToken = sessionStorage.getItem('recruit_admin_token') || 'recruit_admin_authorized_token_2026';
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        setAdminUsers(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));
        setSelectedUser(null);
      } else {
        alert('Failed to delete user from server.');
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  // Inject manual AI guideline
  const handleInjectGuideline = (e: FormEvent) => {
    e.preventDefault();
    if (!customAiGuideline.trim() || !selectedChat) return;

    // Append to transcript
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const updatedChats = chatLogs.map(c => {
      if (c.id === selectedChat.id) {
        return {
          ...c,
          messages: [
            ...c.messages,
            { sender: 'arohi' as const, text: `[SUPER ADMIN INSTRUCTION INJECTED: ${customAiGuideline}]`, time: timeStr }
          ]
        };
      }
      return c;
    });

    setChatLogs(updatedChats);
    setCustomAiGuideline('');
    setGuidelineSuccess(true);
    setTimeout(() => setGuidelineSuccess(false), 3000);

    // Refresh drill-down
    const refreshed = updatedChats.find(c => c.id === selectedChat.id);
    if (refreshed) setSelectedChat(refreshed);
  };

  // Vacancy lists additions/edits
  const addVacancyRow = () => {
    setVacanciesList([...vacanciesList, { postName: '', totalPosts: 0, eligibility: '' }]);
  };

  const removeVacancyRow = (idx: number) => {
    setVacanciesList(vacanciesList.filter((_, i) => i !== idx));
  };

  const handleVacancyChange = (idx: number, field: keyof VacancyDetail, val: string | number) => {
    const updated = [...vacanciesList];
    updated[idx] = { ...updated[idx], [field]: val };
    setVacanciesList(updated);
  };

  const handleEditPostingStart = (posting: Posting) => {
    setEditingPostingId(posting.id);
    setTitle(posting.title);
    setOrganization(posting.organization);
    setCategory(posting.category);
    setDepartment(posting.department);
    setTagsInput(posting.tags.join(', '));
    setShortInfo(posting.shortInfo);
    setApplicationBegin(posting.dates.applicationBegin || '');
    setLastDateApply(posting.dates.lastDateApply || '');
    setLastDateFee(posting.dates.lastDateFee || '');
    setExamDate(posting.dates.examDate || '');
    setAdmitCardAvailable(posting.dates.admitCardAvailable || '');
    setResultDeclared(posting.dates.resultDeclared || '');
    setFeeGeneral(posting.fees.generalOBC);
    setFeeSCST(posting.fees.scST);
    setFeeFemale(posting.fees.female || '');
    setPaymentMode(posting.fees.paymentMode);
    setAgeAsOnDate(posting.ageLimit.asOnDate);
    setAgeMin(posting.ageLimit.minAge);
    setAgeMax(posting.ageLimit.maxAge);
    setAgeRelaxation(posting.ageLimit.relaxationInfo);
    setTotalVacancies(posting.totalVacancies);
    setVacanciesList(posting.vacancies);
    setOfficialSite(posting.links.officialWebsite);
    setActiveSubTab('creator');
  };

  const resetForm = () => {
    setEditingPostingId(null);
    setTitle('');
    setOrganization('');
    setCategory('latest-jobs');
    setDepartment('SSC');
    setTagsInput('');
    setShortInfo('');
    setApplicationBegin('2026-06-30');
    setLastDateApply('2026-07-30');
    setLastDateFee('2026-07-30');
    setExamDate('September 2026');
    setAdmitCardAvailable('August 2026');
    setResultDeclared('');
    setFeeGeneral('₹ 100/-');
    setFeeSCST('₹ 0/-');
    setFeeFemale('₹ 0/-');
    setPaymentMode('Online NetBanking, UPI, Cards');
    setAgeAsOnDate('01/08/2026');
    setAgeMin('18 Years');
    setAgeMax('27 Years');
    setAgeRelaxation('Age relaxation is applicable as per standard directives.');
    setTotalVacancies(350);
    setVacanciesList([
      { postName: 'General Assistant', totalPosts: 350, eligibility: 'Class 10th (Matriculation) or equivalent from any recognized Indian board.' }
    ]);
    setOfficialSite('https://ssc.gov.in');
  };

  const handlePublishSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !organization || !shortInfo) {
      alert('Mandatory coordinates missing.');
      return;
    }

    const parsedTags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [department, 'Latest Vacancy'];

    const targetPosting: Posting = {
      id: editingPostingId || `rec-dyn-${Math.random().toString(36).substring(2, 9)}`,
      title,
      organization,
      category,
      department,
      tags: parsedTags,
      shortInfo,
      postDate: new Date().toISOString().split('T')[0],
      isNew: true,
      dates: {
        applicationBegin,
        lastDateApply,
        lastDateFee,
        examDate: examDate || undefined,
        admitCardAvailable: admitCardAvailable || undefined,
        resultDeclared: resultDeclared || undefined
      },
      fees: {
        generalOBC: feeGeneral,
        scST: feeSCST,
        female: feeFemale || undefined,
        paymentMode
      },
      ageLimit: {
        asOnDate: ageAsOnDate,
        minAge: ageMin,
        maxAge: ageMax,
        relaxationInfo: ageRelaxation
      },
      totalVacancies,
      vacancies: vacanciesList,
      links: {
        applyOnline: category === 'latest-jobs' ? '#apply' : undefined,
        downloadNotification: '#notification',
        officialWebsite: officialSite || 'https://india.gov.in'
      }
    };

    if (editingPostingId) {
      onEditPosting(targetPosting);
      alert(`SUCCESS: Vacancy details updated for "${title}".`);
    } else {
      onAddPosting(targetPosting);
      alert(`SUCCESS: Published new recruitment posting: "${title}".`);
    }

    resetForm();
    setActiveSubTab('postings');
  };

  // Filtered users for search queries
  const filteredUsers = adminUsers.filter(u => 
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  // Financial statistics
  const totalMRR = payments.filter(p => p.status === 'Verified').reduce((acc, p) => acc + p.amount, 0);

  // Analytics dataset computed helper functions
  const getDauData = () => {
    const baseDAU = [32, 45, 38, 54, 49, 63, 72];
    const baseChats = [140, 195, 170, 260, 215, 290, 360];
    
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dateLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      
      const liveScale = Math.max(0.6, liveUsersCount / 18);
      const activeUsers = Math.round(baseDAU[idx] * liveScale);
      const chats = Math.round(baseChats[idx] * (chatLogs.length / 3) * liveScale);
      
      return {
        name: `${dayLabel} (${dateLabel})`,
        "Daily Active Users": activeUsers,
        "AI Chat Sessions": chats,
      };
    });
  };

  const getJobApplicationsData = () => {
    const baseline = [
      { name: 'SSC MTS & Havaldar', Approved: 24, Pending: 12, Rejected: 4 },
      { name: 'DRDO CEPTAM Tech', Approved: 15, Pending: 8, Rejected: 2 },
      { name: 'IBPS PO Officer', Approved: 18, Pending: 14, Rejected: 5 },
      { name: 'Aviation Drone Pilot', Approved: 9, Pending: 5, Rejected: 1 },
    ];
    
    if (applications && applications.length > 0) {
      const postingsMap: Record<string, { Approved: number; Pending: number; Rejected: number }> = {};
      applications.forEach(app => {
        const title = app.postingTitle || 'Other Vacancy';
        const displayTitle = title.length > 22 ? title.substring(0, 20) + '...' : title;
        if (!postingsMap[displayTitle]) {
          postingsMap[displayTitle] = { Approved: 0, Pending: 0, Rejected: 0 };
        }
        if (app.status === 'Approved') postingsMap[displayTitle].Approved += 1;
        else if (app.status === 'Rejected') postingsMap[displayTitle].Rejected += 1;
        else postingsMap[displayTitle].Pending += 1;
      });
      
      return Object.entries(postingsMap).map(([name, counts]) => ({
        name,
        Approved: counts.Approved,
        Pending: counts.Pending,
        Rejected: counts.Rejected,
      }));
    }
    
    return baseline;
  };

  const getSubscriptionGrowthData = () => {
    const baselineMRR = [1596, 1995, 2394, 2793, 3192, 3591, 3990];
    const baselineSubscribers = [4, 5, 6, 7, 8, 9, 10];
    
    return Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      
      const paymentsBeforeOrOn = payments.filter(p => {
        if (p.status !== 'Verified') return false;
        try {
          const [pDay, pMonth, pYear] = p.date.split('/');
          const pDate = new Date(Number(pYear), Number(pMonth) - 1, Number(pDay));
          return pDate <= d;
        } catch {
          return true;
        }
      });
      
      const liveMRR = paymentsBeforeOrOn.reduce((acc, p) => acc + p.amount, 0);
      const subscriberCount = paymentsBeforeOrOn.length;
      
      const displayMRR = liveMRR > 0 ? liveMRR : baselineMRR[idx];
      const displaySubs = subscriberCount > 0 ? subscriberCount : baselineSubscribers[idx];
      
      return {
        date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        "Revenue Trend (₹)": displayMRR,
        "Subscribers Count": displaySubs,
      };
    });
  };

  const getPlanDistributionData = () => {
    const counts: Record<string, number> = {};
    payments.forEach(p => {
      if (p.status === 'Verified') {
        const plan = p.planName || 'Other Plan';
        counts[plan] = (counts[plan] || 0) + 1;
      }
    });
    
    const colors = ['#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];
    
    if (Object.keys(counts).length > 0) {
      return Object.entries(counts).map(([name, value], idx) => {
        const displayName = name.length > 22 ? name.substring(0, 20) + '...' : name;
        return {
          name: displayName,
          value,
          color: colors[idx % colors.length]
        };
      });
    }
    
    return [
      { name: 'Path 1: Careers', value: 4, color: '#a855f7' },
      { name: 'Path 3: Udyam', value: 3, color: '#06b6d4' },
      { name: 'ATS Resume Builder', value: 2, color: '#10b981' }
    ];
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="bg-[#04020a] text-white min-h-[90vh] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Apple space grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f134510_1px,transparent_1px),linear-gradient(to_bottom,#1f134510_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>

        <div className="max-w-md w-full relative z-10">
          {/* Biometric Cybernetic Card Container */}
          <div className="backdrop-blur-xl bg-[#0a0818]/80 border border-[#2d1b64]/70 p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.8)] border-t-[#512da8] relative overflow-hidden transition-all duration-300">
            {/* Ambient edge flare */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-purple-500/30 rounded-full blur-2xl pointer-events-none"></div>

            {showAccessGranted ? (
              // Cyber holographic login transition
              <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center animate-ping absolute"></div>
                  <div className="w-20 h-20 rounded-full border-2 border-emerald-400 bg-emerald-950/40 flex items-center justify-center text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400">Identity Confirmed</h3>
                  <h1 className="text-2xl font-black tracking-tight text-white">Welcome, Commander Junoon</h1>
                  <p className="text-[10px] text-slate-400 font-mono">ENCRYPTED QUANTUM LINK ESTABLISHED • SECURE CHANNELS OPEN</p>
                </div>
                <div className="pt-4 flex justify-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            ) : (
              // Cyber Login form
              <div className="space-y-6">
                <div className="text-center space-y-2.5">
                  <div className="inline-flex p-3.5 bg-purple-950/40 border border-[#4a2e96]/60 text-purple-400 rounded-2xl shadow-[0_0_20px_rgba(124,58,237,0.2)] mb-1">
                    <Shield className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
                    Recruit <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Control Panel</span>
                  </h2>
                  <p className="text-slate-400 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                    Access reserved for authenticated commander personnel. Provide secure keys to decrypted databases.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">Commander Identification ID</label>
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full bg-[#110d29]/90 border border-[#301c66] rounded-2xl px-4.5 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1.5">Security Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      className="w-full bg-[#110d29]/90 border border-[#301c66] rounded-2xl px-4.5 py-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold font-mono"
                    />
                  </div>

                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/30 p-3.5 rounded-xl text-red-400 text-[10px] font-bold flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="bg-[#120f26]/60 border border-[#2d2159] p-3 rounded-xl text-[9px] text-slate-400 leading-normal font-mono">
                    <span className="text-yellow-400 font-black">SYSTEM DEFAULTS:</span> User ID is <span className="text-white font-bold">admin</span> / Password is <span className="text-white font-bold">recruit_admin_2026</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-[0_5px_20px_rgba(124,58,237,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isLoggingIn ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Credentials...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Identity Scan Entry
                      </span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CORE SUPER ADMIN WORKSPACE (LOGGED IN)
  return (
    <div className="bg-[#030109] text-slate-100 min-h-screen py-8 px-4 font-sans relative overflow-hidden">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a103c15_1px,transparent_1px),linear-gradient(to_bottom,#1a103c15_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10 text-left">
        
        {/* HEADER: Apple Frosted-Glass Float Top Header */}
        <div className="backdrop-blur-md bg-[#0a081a]/60 border border-[#2b1b54]/80 px-6 py-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3.5">
            <div className="bg-gradient-to-tr from-purple-600 to-cyan-500 p-2.5 rounded-2xl border border-purple-400/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-black text-white tracking-tight">Commander Control Centre</h1>
                <span className="bg-[#00e676]/15 text-[#00e676] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#00e676]/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-ping"></span> Quantum Sync Stable
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5 flex items-center gap-1.5 font-mono">
                COMMANDER JUNOON SESSION ACTIVE • IP 127.0.0.1 • PORT 3000 SECURE
              </p>
            </div>
          </div>

          {/* Time and Logout */}
          <div className="flex items-center gap-4">
            <div className="bg-[#100d28] border border-[#23174b] rounded-2xl px-4 py-2 font-mono text-center shrink-0">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Clock (IST)</span>
              <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-950/40 hover:bg-red-900 border border-red-500/20 text-red-400 hover:text-white px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>

        {/* METRIC COUNTERS RIBBON */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#09071a]/55 border border-[#271850] rounded-2xl p-4 text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Live Candidates Online</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white tracking-tight">{liveUsersCount}</span>
              <span className="text-[10px] text-emerald-400 font-bold">● Active Now</span>
            </div>
          </div>
          <div className="bg-[#09071a]/55 border border-[#271850] rounded-2xl p-4 text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Admin Users Registered</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white tracking-tight">{adminUsers.length}</span>
              <span className="text-[10px] text-slate-400">Verified IDs</span>
            </div>
          </div>
          <div className="bg-[#09071a]/55 border border-[#271850] rounded-2xl p-4 text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Verified Cash flow Ledger</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#00e676] tracking-tight">₹{(totalMRR).toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-bold">✓ MRR</span>
            </div>
          </div>
          <div className="bg-[#09071a]/55 border border-[#271850] rounded-2xl p-4 text-left">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">AI Conversation Logs</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white tracking-tight">{chatLogs.length}</span>
              <span className="text-[10px] text-purple-400">Transcripts</span>
            </div>
          </div>
          <div className="bg-[#09071a]/55 border border-[#271850] rounded-2xl p-4 text-left col-span-2 md:col-span-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Active Exam Listings</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-white tracking-tight">{postings.length}</span>
              <span className="text-[10px] text-slate-400">Live Vacancies</span>
            </div>
          </div>
        </div>

        {/* SYSTEM COORDS WORKSPACE TABS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#231649] pb-3">
          <button
            onClick={() => setActiveSubTab('telemetry')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'telemetry' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-400" />
            <span>Cyber Telemetry & Live Monitor</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'users' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Users & Taken Services Directory</span>
          </button>

          <button
            onClick={() => setActiveSubTab('finance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'finance' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Cash Flow Ledger</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'chats' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-pink-400" />
            <span>Arohi Chat Transcripts</span>
          </button>

          <button
            onClick={() => setActiveSubTab('postings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'postings' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <Briefcase className="w-4 h-4 text-yellow-400" />
            <span>Job Listings Board</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setActiveSubTab('creator');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'creator' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Vacancy Creator Form</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'analytics' 
                ? 'bg-purple-950/40 text-purple-300 border border-purple-500/40 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                : 'text-slate-300 hover:bg-[#110d29]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Interactive Analytics BI</span>
          </button>
        </div>

        {/* WORKSPACE CONTENT ROUTER */}

        {/* TAB 1: CYBER TELEMETRY & LIVE MONITOR */}
        {activeSubTab === 'telemetry' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Live activity monitors log console */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl flex flex-col justify-between h-[520px]">
              <div>
                <div className="flex justify-between items-center border-b border-[#25174e] pb-3 mb-4">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Activity className="w-4.5 h-4.5 text-purple-400" /> Active Candidate Telemetry Logs
                  </h3>
                  <span className="text-[10px] bg-slate-950 border border-[#37246e] px-2.5 py-1 rounded-lg text-[#00e676] font-mono">
                    AUTOSCANNING EVERY 7S
                  </span>
                </div>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {telemetryLogs.map((log) => {
                    const colorMap: any = {
                      system: 'text-cyan-400 bg-cyan-500/5 border-cyan-500/20',
                      visit: 'text-purple-400 bg-purple-500/5 border-purple-500/20',
                      chat: 'text-pink-400 bg-pink-500/5 border-pink-500/20',
                      resume: 'text-amber-400 bg-amber-500/5 border-amber-500/20',
                      finance: 'text-[#00e676] bg-[#00e676]/5 border-[#00e676]/20'
                    };
                    const color = colorMap[log.type] || 'text-slate-300 bg-slate-500/5 border-slate-500/20';

                    return (
                      <div key={log.id} className={`flex items-center justify-between p-3 border rounded-xl text-xs font-semibold ${color} animate-in fade-in slide-in-from-top-1 duration-200`}>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[10px] opacity-65 shrink-0 bg-black/40 px-2 py-0.5 rounded-md">{log.time}</span>
                          <span className="leading-snug">{log.text}</span>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/5 shrink-0">{log.type}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status bar */}
              <div className="pt-3 border-t border-[#25174e] flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>RECRUIT CONTROL NETWORK v2.4</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span> TELEMETRY STREAMING LIVE</span>
              </div>
            </div>

            {/* Simulated actions and candidates verifier */}
            <div className="space-y-6">
              
              {/* Telemetry Simulator panel */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b border-[#25174e] pb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-yellow-300 animate-spin" /> Cybernetic Event Simulator
                </h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Trigger mock webhooks or spike traffic logs to evaluate telemetry streams. This triggers real local state updates.
                </p>

                <div className="space-y-2.5 pt-1">
                  <button
                    disabled={isSimulatingEvent !== null}
                    onClick={() => triggerTelemetrySimulation('visitor')}
                    className="w-full bg-[#130f2c] hover:bg-[#1b153f] border border-[#3b2880] py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <span>Simulate Visitor Traffic Spike</span>
                    {isSimulatingEvent === 'visitor' ? <RefreshCw className="w-4 h-4 animate-spin text-purple-400" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <button
                    disabled={isSimulatingEvent !== null}
                    onClick={() => triggerTelemetrySimulation('payment')}
                    className="w-full bg-[#130f2c] hover:bg-[#1b153f] border border-[#3b2880] py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <span>Trigger UPI Payment Webhook (₹399)</span>
                    {isSimulatingEvent === 'payment' ? <RefreshCw className="w-4 h-4 animate-spin text-[#00e676]" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <button
                    disabled={isSimulatingEvent !== null}
                    onClick={() => triggerTelemetrySimulation('chat')}
                    className="w-full bg-[#130f2c] hover:bg-[#1b153f] border border-[#3b2880] py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer disabled:opacity-50"
                  >
                    <span>Inject AROHI Conversation Session</span>
                    {isSimulatingEvent === 'chat' ? <RefreshCw className="w-4 h-4 animate-spin text-pink-400" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Candidates fast list verification */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left space-y-4">
                <div className="flex justify-between items-center border-b border-[#25174e] pb-3">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-4.5 h-4.5 text-cyan-400" /> Candidate Verification
                  </h3>
                  <span className="text-[10px] font-black text-purple-300">{applications.length} Files</span>
                </div>

                <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
                  {applications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                      No recruitment files loaded.
                    </div>
                  ) : (
                    applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex justify-between items-center bg-[#130f2c]/75 border border-[#2a1d56] p-3 rounded-xl">
                        <div>
                          <p className="text-xs font-black text-white uppercase">{app.candidateName}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">{app.registrationNumber}</p>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {app.status === 'Submitted' ? (
                            <>
                              <button
                                onClick={() => onUpdateAppStatus(app.id, 'Approved')}
                                className="bg-emerald-950/80 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-800/40 p-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onUpdateAppStatus(app.id, 'Rejected')}
                                className="bg-red-950/80 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/40 p-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                              app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: USERS DIRECTORY & INTERVENTIONS */}
        {activeSubTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Users table */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 rounded-3xl overflow-hidden shadow-xl h-[530px] flex flex-col justify-between">
              <div>
                <div className="p-4 bg-[#120d2c]/65 border-b border-[#2b1b54] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">Registered Accounts & Interventions Directory</h3>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Custom coaching slots, taken courses, active plans, permissions</p>
                  </div>
                  
                  {/* Search query input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={searchUserQuery}
                      onChange={(e) => setSearchUserQuery(e.target.value)}
                      className="bg-[#19133a]/90 border border-[#3b277a] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 placeholder-slate-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="bg-slate-900/65 text-slate-400 border-b border-[#221644] uppercase tracking-wider text-[9px] font-black">
                        <th className="py-3 px-4">Aspirant Profile</th>
                        <th className="py-3 px-4">Role Classification</th>
                        <th className="py-3 px-4">Plan Subscriptions</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221644]">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-purple-950/10 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-black text-white">{user.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{user.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-slate-200">{user.role}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {user.services.path1 && <span className="bg-blue-500/10 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-blue-500/20">PATH 1</span>}
                              {user.services.path2 && <span className="bg-purple-500/10 text-purple-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-purple-500/20">PATH 2</span>}
                              {user.services.path3 && <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded border border-emerald-500/20">PATH 3</span>}
                              {!user.services.path1 && !user.services.path2 && !user.services.path3 && <span className="text-slate-500 text-[8px]">None</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              user.status === 'VIP' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25' :
                              user.status === 'Suspended' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                              'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="bg-[#1d143c] hover:bg-[#341d6e] border border-[#3d2780] text-purple-300 hover:text-white px-2.5 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer transition-all"
                            >
                              Edit Settings
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border-t border-[#221644] text-[10px] text-slate-500 font-mono flex justify-between">
                <span>SECURED BIOMETRIC ENCRYPTION KEY STABLE</span>
                <span>{filteredUsers.length} MEMBERS TRACKED</span>
              </div>
            </div>

            {/* Right side settings panel */}
            <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b border-[#25174e] pb-3 mb-4 flex items-center gap-1.5">
                <Settings className="w-4.5 h-4.5 text-cyan-400" /> Customized Settings Console
              </h3>

              {selectedUser ? (
                <div className="space-y-4.5 text-xs font-semibold">
                  
                  {/* Account overview snippet */}
                  <div className="bg-[#120a2e]/60 border border-[#3b207e] p-3.5 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Account</p>
                    <p className="text-sm font-black text-white mt-1 uppercase">{selectedUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedUser.email}</p>
                  </div>

                  {/* Toggle Account Status */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase font-black text-slate-400">Account Status Override</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Active', 'Suspended', 'VIP'].map((st) => (
                        <button
                          key={st}
                          onClick={() => updateUserStatus(selectedUser.id, st as any)}
                          className={`py-2 px-1 text-center rounded-xl text-[10px] font-black transition-all cursor-pointer border ${
                            selectedUser.status === st 
                              ? 'bg-purple-900/30 text-purple-300 border-purple-500' 
                              : 'bg-[#100d28]/70 text-slate-400 border-[#23174b] hover:bg-[#151238]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Services (Pathways) toggles */}
                  <div className="space-y-1.5 border-t border-[#25174e] pt-3">
                    <label className="block text-[9px] uppercase font-black text-slate-400">Active Service Plans</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => toggleUserServices(selectedUser.id, 'path1')}
                        className={`py-2 px-1 text-center rounded-xl text-[9px] font-black transition-all cursor-pointer border ${
                          selectedUser.services.path1 
                            ? 'bg-blue-900/30 text-blue-300 border-blue-500' 
                            : 'bg-[#100d28]/70 text-slate-400 border-[#23174b] hover:bg-[#151238]'
                        }`}
                      >
                        Path 1
                      </button>
                      <button
                        onClick={() => toggleUserServices(selectedUser.id, 'path2')}
                        className={`py-2 px-1 text-center rounded-xl text-[9px] font-black transition-all cursor-pointer border ${
                          selectedUser.services.path2 
                            ? 'bg-purple-900/30 text-purple-300 border-purple-500' 
                            : 'bg-[#100d28]/70 text-slate-400 border-[#23174b] hover:bg-[#151238]'
                        }`}
                      >
                        Path 2
                      </button>
                      <button
                        onClick={() => toggleUserServices(selectedUser.id, 'path3')}
                        className={`py-2 px-1 text-center rounded-xl text-[9px] font-black transition-all cursor-pointer border ${
                          selectedUser.services.path3 
                            ? 'bg-emerald-900/30 text-emerald-300 border-emerald-500' 
                            : 'bg-[#100d28]/70 text-slate-400 border-[#23174b] hover:bg-[#151238]'
                        }`}
                      >
                        Path 3
                      </button>
                    </div>
                  </div>

                  {/* Administrative Permissions */}
                  <div className="space-y-2 border-t border-[#25174e] pt-3 text-xs font-bold text-slate-300">
                    <label className="block text-[9px] uppercase font-black text-slate-400">Administrative Permission Coordinates</label>
                    <div className="flex items-center justify-between bg-[#100d28]/60 p-2 border border-[#23174b] rounded-xl">
                      <span>Publish Job Postings</span>
                      <input 
                        type="checkbox" 
                        checked={selectedUser.permissions.canEditJobs} 
                        onChange={() => toggleUserPermission(selectedUser.id, 'canEditJobs')}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-[#100d28]/60 p-2 border border-[#23174b] rounded-xl">
                      <span>Approve Candidate Portals</span>
                      <input 
                        type="checkbox" 
                        checked={selectedUser.permissions.canApproveApps} 
                        onChange={() => toggleUserPermission(selectedUser.id, 'canApproveApps')}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-[#100d28]/60 p-2 border border-[#23174b] rounded-xl">
                      <span>Access Cash flow Ledger</span>
                      <input 
                        type="checkbox" 
                        checked={selectedUser.permissions.canViewFinance} 
                        onChange={() => toggleUserPermission(selectedUser.id, 'canViewFinance')}
                        className="w-4 h-4 cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>

                  {/* Mentoring slots & customized inputs */}
                  <div className="space-y-2.5 border-t border-[#25174e] pt-3 text-xs">
                    <div>
                      <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Custom Mentoring Slot</label>
                      <input
                        type="text"
                        value={selectedUser.customizedSettings.tutoringSlot}
                        onChange={(e) => updateCustomSettings(selectedUser.id, 'tutoringSlot', e.target.value)}
                        className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Coaching Priority level</label>
                      <select
                        value={selectedUser.customizedSettings.priorityLevel}
                        onChange={(e) => updateCustomSettings(selectedUser.id, 'priorityLevel', e.target.value)}
                        className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        <option value="Standard">Standard Priority</option>
                        <option value="High">High Priority</option>
                        <option value="Critical">Critical Priority</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Assigned MSME/Career Mentor</label>
                      <input
                        type="text"
                        value={selectedUser.customizedSettings.assignedMentor}
                        onChange={(e) => updateCustomSettings(selectedUser.id, 'assignedMentor', e.target.value)}
                        className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleDeleteUser(selectedUser.email)}
                      className="w-full bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-400 hover:text-white font-extrabold uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Aspirant Profile</span>
                    </button>

                    <button
                      onClick={() => setSelectedUser(null)}
                      className="w-full bg-[#1c143c] hover:bg-[#321f66] text-purple-300 font-extrabold uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Close Settings Console
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-12 text-slate-500 text-xs italic bg-[#110d28]/25 rounded-2xl border border-[#241a4a]/40 text-center">
                  Select a user from the registered aspirant directory to modify access, service parameters, and customized mentoring slots.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: CASH FLOW LEDGER */}
        {activeSubTab === 'finance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Financial ledger details */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl h-[530px] flex flex-col justify-between">
              <div>
                <div className="border-b border-[#25174e] pb-3 mb-4 flex justify-between items-center">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-4.5 h-4.5 text-emerald-400" /> Administrative Cash Flow Ledger
                  </h3>
                  <span className="text-[10px] font-mono text-[#00e676] bg-[#00e676]/5 px-2 py-1 rounded">GATEWAYS SECURED</span>
                </div>

                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="bg-slate-900/65 text-slate-400 border-b border-[#221644] uppercase tracking-wider text-[9px] font-black">
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Aspirant Email</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Method</th>
                        <th className="py-3 px-4 text-center">Amount</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#221644]">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-emerald-950/5 transition-colors">
                          <td className="py-3 px-4 font-mono text-white text-[11px]">{p.id}</td>
                          <td className="py-3 px-4 text-slate-300">{p.userEmail}</td>
                          <td className="py-3 px-4 text-slate-300 font-bold">{p.planName}</td>
                          <td className="py-3 px-4 text-slate-400 font-mono text-[10px]">{p.method}</td>
                          <td className="py-3 px-4 text-center text-white font-black">₹{p.amount}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                              p.status === 'Verified' ? 'bg-[#00e676]/15 text-[#00e676] border border-[#00e676]/25' :
                              'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25 animate-pulse'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-3 border-t border-[#25174e] flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>GATEWAY SYNC PROTOCOL: ACTIVE</span>
                <span>TOTAL REVENUE CAP: ₹{(totalMRR).toLocaleString()} (IST)</span>
              </div>
            </div>

            {/* Financial ledger overview & manual verifier */}
            <div className="space-y-6">
              
              {/* Cash flow ledger indicators */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b border-[#25174e] pb-3 flex items-center gap-1.5">
                  <BarChart3 className="w-4.5 h-4.5 text-cyan-400" /> Cash Flow Analytics
                </h3>

                <div className="space-y-3 pt-1">
                  <div className="bg-[#120a2e]/60 border border-[#3b207e] p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Subscriptions MRR</span>
                      <span className="text-xl font-black text-white mt-1 block">₹{totalMRR}</span>
                    </div>
                    <span className="bg-[#00e676]/10 text-[#00e676] text-[10px] font-black px-2 py-1 rounded">100% SECURE</span>
                  </div>

                  <div className="bg-[#120a2e]/60 border border-[#3b207e] p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Completed Transactions</span>
                      <span className="text-xl font-black text-white mt-1 block">{payments.filter(p => p.status === 'Verified').length}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-bold font-mono">Invoiced</span>
                  </div>

                  <div className="bg-[#120a2e]/60 border border-[#3b207e] p-3 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Pending Verifications</span>
                      <span className="text-xl font-black text-yellow-300 mt-1 block">{payments.filter(p => p.status === 'Pending').length}</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-bold font-mono">Awaiting</span>
                  </div>
                </div>
              </div>

              {/* Verified payment approvals widget */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b border-[#25174e] pb-3 flex items-center gap-1.5">
                  <Check className="w-4.5 h-4.5 text-[#00e676]" /> Manual Cash Flow Verifier
                </h3>

                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                  {payments.filter(p => p.status === 'Pending').length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs italic">
                      No pending payment vouchers to verify.
                    </div>
                  ) : (
                    payments.filter(p => p.status === 'Pending').map((p) => (
                      <div key={p.id} className="bg-[#130f2c]/75 border border-[#2a1d56] p-3 rounded-xl space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">{p.userEmail}</p>
                            <p className="text-[9px] text-[#00e676] font-mono mt-0.5">₹{p.amount} ({p.method || 'UPI Scan'})</p>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded shrink-0">
                            {p.id}
                          </span>
                        </div>

                        {p.utr && (
                          <div className="bg-[#09061c] border border-[#23174f] px-2.5 py-1.5 rounded-lg flex justify-between items-center text-[10px] text-slate-300 font-mono">
                            <span className="truncate">Ref/UTR: <strong className="text-purple-400 font-bold">{p.utr}</strong></span>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(p.utr);
                                alert(`Copied UTR: ${p.utr}`);
                              }}
                              className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer text-[9px] shrink-0 ml-1 font-bold"
                            >
                              Copy
                            </button>
                          </div>
                        )}

                        <button
                          onClick={async () => {
                            const adminToken = sessionStorage.getItem('recruit_admin_token') || 'recruit_admin_authorized_token_2026';
                            try {
                              const res = await fetch('/api/admin/verify-payment', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${adminToken}`
                                },
                                body: JSON.stringify({ id: p.id })
                              });
                              if (res.ok) {
                                setPayments(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Verified' } : item));
                                alert(`SUCCESS: Payment approved & premium services synced.`);
                                fetchRealData();
                              } else {
                                const errData = await res.json();
                                alert(`Error: ${errData.error || 'Failed to verify payment.'}`);
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Failed to connect to backend server.');
                            }
                          }}
                          className="w-full bg-emerald-950 hover:bg-emerald-600 border border-emerald-800 text-emerald-400 hover:text-white py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve & Unlock Premium
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Airtel Payments Bank / PhonePe Setup Widget */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left space-y-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 border-b border-[#25174e] pb-3 flex items-center gap-1.5">
                  <Settings className="w-4.5 h-4.5 text-purple-400" /> Airtel & PhonePe UPI Merchant config
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Airtel Payments Bank / PhonePe UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. elitetraderjunoon@oksbi"
                      className="w-full bg-[#120a2e]/60 border border-[#3b207e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Merchant Display Name</label>
                    <input
                      type="text"
                      value={merchantName}
                      onChange={(e) => setMerchantName(e.target.value)}
                      placeholder="e.g. Recruit India Corporation"
                      className="w-full bg-[#120a2e]/60 border border-[#3b207e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Bank / Platform Provider name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Airtel Payments Bank"
                      className="w-full bg-[#120a2e]/60 border border-[#3b207e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    onClick={async () => {
                      setIsUpdatingUpi(true);
                      setUpiUpdateSuccess(false);
                      const adminToken = sessionStorage.getItem('recruit_admin_token') || 'recruit_admin_authorized_token_2026';
                      try {
                        const response = await fetch('/api/admin/payment-settings', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${adminToken}`
                          },
                          body: JSON.stringify({ upiId, merchantName, bankName })
                        });
                        if (response.ok) {
                          setUpiUpdateSuccess(true);
                          setTimeout(() => setUpiUpdateSuccess(false), 3000);
                        } else {
                          alert('Failed to update merchant configuration.');
                        }
                      } catch (err) {
                        console.error(err);
                        alert('Network failure connecting to server.');
                      } finally {
                        setIsUpdatingUpi(false);
                      }
                    }}
                    disabled={isUpdatingUpi}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-black text-xs uppercase py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    {isUpdatingUpi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{upiUpdateSuccess ? 'Merchant settings configured!' : 'Update Live UPI QR Codes'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: AROHI CHAT TRANSCRIPTS ARCHIVE */}
        {activeSubTab === 'chats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chats list */}
            <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 rounded-3xl overflow-hidden shadow-xl h-[530px] flex flex-col justify-between">
              <div>
                <div className="p-4 bg-[#120d2c]/65 border-b border-[#2b1b54]">
                  <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">Arohi Conversation Archives</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Audit real-time conversational trends and sentiment profiles</p>
                </div>

                <div className="divide-y divide-[#221644] max-h-[420px] overflow-y-auto">
                  {chatLogs.map((chat) => (
                    <div 
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`p-4 cursor-pointer transition-colors text-left flex justify-between items-center ${
                        selectedChat && selectedChat.id === chat.id ? 'bg-[#1b1241]/75' : 'hover:bg-purple-950/10'
                      }`}
                    >
                      <div>
                        <div className="font-black text-white text-xs uppercase">{chat.userName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{chat.userEmail}</div>
                        <div className="inline-flex items-center gap-1 bg-[#100d28] border border-[#23174b] text-[#a78bfa] text-[9px] px-2 py-0.5 rounded-md mt-2 font-bold">
                          Topic: {chat.topic}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          chat.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          chat.sentiment === 'Urgent' ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' :
                          'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {chat.sentiment}
                        </span>
                        <p className="text-[9px] text-slate-500 mt-2 font-mono">{chat.messages.length} exchanges</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border-t border-[#221644] text-[10px] text-slate-500 font-mono">
                CONVERSATIONAL INTELLIGENCE PLATFORM ENGINE READY
              </div>
            </div>

            {/* Chats transcript viewer & manual parameters overrides */}
            <div className="lg:col-span-2 backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl flex flex-col justify-between h-[530px]">
              {selectedChat ? (
                <>
                  <div>
                    <div className="flex justify-between items-center border-b border-[#25174e] pb-3 mb-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase">{selectedChat.userName} • Transcript Audits</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{selectedChat.userEmail}</p>
                      </div>
                      <span className="text-[10px] bg-slate-950 border border-[#301c66] px-2.5 py-1 rounded text-purple-300 font-bold font-mono">
                        ID: {selectedChat.id}
                      </span>
                    </div>

                    {/* Chat bubbles */}
                    <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
                      {selectedChat.messages.map((m, idx) => (
                        <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed leading-normal ${
                            m.sender === 'user' 
                              ? 'bg-purple-600/15 border border-purple-500/30 text-white rounded-tr-none' 
                              : 'bg-[#120f26] border border-[#2d2159] text-slate-200 rounded-tl-none'
                          }`}>
                            <p className="whitespace-pre-line">{m.text}</p>
                          </div>
                          <span className="text-[8px] text-slate-500 font-mono mt-1 px-1">{m.time} • {m.sender.toUpperCase()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manual custom guidance overrides */}
                  <form onSubmit={handleInjectGuideline} className="border-t border-[#25174e] pt-4.5 mt-2 flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-[9px] uppercase font-black text-slate-400 mb-1.5">Inject Manual Guidance Parameter (Force override AI instructions)</label>
                      <input
                        type="text"
                        required
                        value={customAiGuideline}
                        onChange={(e) => setCustomAiGuideline(e.target.value)}
                        placeholder="e.g., Focus specifically on Odisha state post-matric scholarship eligibility next."
                        className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                    >
                      Inject Guideline
                    </button>
                  </form>
                  
                  {guidelineSuccess && (
                    <p className="text-emerald-400 text-[10px] font-bold mt-2 font-mono">✓ Custom guidance injected into active AI parameters stream successfully!</p>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 text-xs italic">
                  <MessageSquare className="w-12 h-12 text-slate-700 mb-2" />
                  Select a candidate conversation session from the left trend tracker to inspect full message transcripts and inject specific guidance overrides.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: ACTIVE JOB LISTINGS BOARD */}
        {activeSubTab === 'postings' && (
          <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl text-left space-y-4">
            <div className="flex justify-between items-center border-b border-[#25174e] pb-3 mb-4">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-4.5 h-4.5 text-yellow-400" /> Active Job Postings Database
              </h3>
              <button
                onClick={() => {
                  resetForm();
                  setActiveSubTab('creator');
                }}
                className="bg-[#00e676] hover:bg-[#00c864] text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Vacancy
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-semibold">
                <thead>
                  <tr className="bg-slate-900/65 text-slate-400 border-b border-[#221644] uppercase tracking-wider text-[9px] font-black">
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Exam Title</th>
                    <th className="py-3 px-4">Department / Sector</th>
                    <th className="py-3 px-4 text-center">Vacancies</th>
                    <th className="py-3 px-4 text-center">Closing Date</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#221644]">
                  {postings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500 italic">No job postings created yet.</td>
                    </tr>
                  ) : (
                    postings.map((post) => (
                      <tr key={post.id} className="hover:bg-purple-950/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="block text-[10px] text-purple-400 uppercase font-bold">{post.organization}</span>
                        </td>
                        <td className="py-3.5 px-4 text-white font-bold">{post.title}</td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {post.department} / <span className="text-[11px] text-slate-400">{post.sector || 'Govt'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-200 font-black">{post.totalVacancies}</td>
                        <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[10px]">{post.dates.lastDateApply || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            <button
                              onClick={() => handleEditPostingStart(post)}
                              className="bg-blue-950/80 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-800/40 p-2 rounded-xl transition-all cursor-pointer"
                              title="Edit coordinates"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${post.title}?`)) {
                                  onDeletePosting(post.id);
                                }
                              }}
                              className="bg-red-950/80 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/40 p-2 rounded-xl transition-all cursor-pointer"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: VACANCY CREATOR FORM */}
        {activeSubTab === 'creator' && (
          <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-6 rounded-3xl shadow-xl text-left space-y-6">
            <div className="border-b border-[#25174e] pb-3 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300">
                  {editingPostingId ? 'Edit Recruitment Opportunity coordinates' : 'Create New Recruitment Opportunity Posting'}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Publish live vacancies directly to candidate dashboards</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveSubTab('postings');
                }}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all active:scale-95"
              >
                Back to Listings
              </button>
            </div>

            <form onSubmit={handlePublishSubmit} className="space-y-6">
              
              {/* Core Info */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-4">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Exam/Post Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SSC MTS & Havaldar Online Form 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>

                <div className="md:col-span-4">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Recruiting Board/Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Staff Selection Commission (SSC)"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Board category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white cursor-pointer font-semibold"
                  >
                    <option value="latest-jobs">Latest Jobs</option>
                    <option value="admit-card">Admit Card</option>
                    <option value="results">Results</option>
                    <option value="answer-key">Answer Key</option>
                    <option value="syllabus">Syllabus</option>
                    <option value="admission">Admission</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Board Department *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white cursor-pointer font-semibold"
                  >
                    <option value="SSC">SSC</option>
                    <option value="Railway">Railway</option>
                    <option value="UPSC">UPSC</option>
                    <option value="Bank">Bank</option>
                    <option value="Defence">Defence</option>
                    <option value="State PSC">State PSC</option>
                    <option value="Teaching">Teaching</option>
                    <option value="State Govt">State Govt</option>
                    <option value="Private Sector">Private Sector</option>
                  </select>
                </div>
              </div>

              {/* Tags & Short details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-4">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="SSC, Central Govt, Matric Pass, Havaldar"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>

                <div className="md:col-span-8">
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1.5">Short vacancy description (Notification text) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide a detailed summary of key eligibility criteria, recruitment methods, and scale of pay parameters."
                    value={shortInfo}
                    onChange={(e) => setShortInfo(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              {/* Dates & Fees */}
              <div className="space-y-4 pt-3 border-t border-[#25174e]">
                <h4 className="text-xs font-black uppercase text-purple-300">📅 Schedule coordinates & Application Fees</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Application Begin *</label>
                    <input
                      type="date"
                      required
                      value={applicationBegin}
                      onChange={(e) => setApplicationBegin(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Last Date to Apply *</label>
                    <input
                      type="date"
                      required
                      value={lastDateApply}
                      onChange={(e) => setLastDateApply(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Last Date online Payment *</label>
                    <input
                      type="date"
                      required
                      value={lastDateFee}
                      onChange={(e) => setLastDateFee(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Exam Dates (Estimated)</label>
                    <input
                      type="text"
                      placeholder="September 2026"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">General / OBC fee</label>
                    <input
                      type="text"
                      value={feeGeneral}
                      onChange={(e) => setFeeGeneral(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">SC / ST / PH fee</label>
                    <input
                      type="text"
                      value={feeSCST}
                      onChange={(e) => setFeeSCST(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Female candidate fee</label>
                    <input
                      type="text"
                      value={feeFemale}
                      onChange={(e) => setFeeFemale(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Exam Fee Payment Mode</label>
                    <input
                      type="text"
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Age Limits & Vacancy details */}
              <div className="space-y-4 pt-4 border-t border-[#25174e]">
                <h4 className="text-xs font-black uppercase text-purple-300">👥 Age Limitations & Vacancies</h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Age as on Date *</label>
                    <input
                      type="text"
                      required
                      value={ageAsOnDate}
                      onChange={(e) => setAgeAsOnDate(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Minimum Age limit</label>
                    <input
                      type="text"
                      required
                      value={ageMin}
                      onChange={(e) => setAgeMin(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Maximum Age limit</label>
                    <input
                      type="text"
                      required
                      value={ageMax}
                      onChange={(e) => setAgeMax(e.target.value)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Total Vacancy Count *</label>
                    <input
                      type="number"
                      required
                      value={totalVacancies}
                      onChange={(e) => setTotalVacancies(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-black text-slate-400 mb-1">Age Relaxation Description</label>
                  <input
                    type="text"
                    value={ageRelaxation}
                    onChange={(e) => setAgeRelaxation(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Dynamic Post Eligibility Rows */}
              <div className="space-y-4 pt-4 border-t border-[#25174e]">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black uppercase text-purple-300">📋 Vacancy Breakdown & Academic Eligibility requirements</h4>
                  <button
                    type="button"
                    onClick={addVacancyRow}
                    className="bg-[#18123c] hover:bg-[#251b5e] border border-[#3e277a] px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase text-purple-300 cursor-pointer transition-all active:scale-95"
                  >
                    + Add eligibility row
                  </button>
                </div>

                <div className="space-y-3">
                  {vacanciesList.map((vac, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#110d29]/65 p-3 rounded-2xl border border-[#2d1b64] items-end">
                      <div className="md:col-span-4">
                        <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Post Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Havaldar inside CBIC and CBN"
                          value={vac.postName}
                          onChange={(e) => handleVacancyChange(idx, 'postName', e.target.value)}
                          className="w-full bg-[#030109] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Post count</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={vac.totalPosts}
                          onChange={(e) => handleVacancyChange(idx, 'totalPosts', parseInt(e.target.value) || 0)}
                          className="w-full bg-[#030109] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="block text-[8px] uppercase font-black text-slate-400 mb-1">Academic Eligibility Criteria *</label>
                        <input
                          type="text"
                          required
                          placeholder="Passed Class 10th or equivalent with physical endurance qualifications."
                          value={vac.eligibility}
                          onChange={(e) => handleVacancyChange(idx, 'eligibility', e.target.value)}
                          className="w-full bg-[#030109] border border-[#2d1b64] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div className="md:col-span-1 text-center">
                        <button
                          type="button"
                          disabled={vacanciesList.length === 1}
                          onClick={() => removeVacancyRow(idx)}
                          className="bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-900 p-2 rounded-xl disabled:opacity-40 cursor-pointer transition-all active:scale-95"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* External URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#25174e] pt-4">
                <div>
                  <label className="block text-[10px] uppercase font-black text-slate-400 mb-1">Official Board Recruitment Website URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://ssc.gov.in"
                    value={officialSite}
                    onChange={(e) => setOfficialSite(e.target.value)}
                    className="w-full bg-[#110d29] border border-[#2d1b64] rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                  />
                </div>
              </div>

              {/* Form submit footer buttons */}
              <div className="border-t border-[#25174e] pt-5 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-[#1c143c] hover:bg-[#321f66] px-6 py-3 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-purple-300 cursor-pointer transition-all active:scale-95"
                >
                  Reset coordinates
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md active:scale-95 transition-all"
                >
                  {editingPostingId ? 'Publish Updates' : 'Publish Opportunity'}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 7: ANALYTICS & BUSINESS INTELLIGENCE DASHBOARD */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Daily Active Users */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl flex items-center gap-4">
                <div className="p-3.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black truncate">Daily Active Users</span>
                  <span className="text-xl font-black text-white block leading-none mt-1">{Math.round(liveUsersCount * 4)}</span>
                  <span className="text-[9px] text-purple-400 block mt-1 font-bold">↑ 12% from last week</span>
                </div>
              </div>

              {/* Card 2: Subscription Growth */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl flex items-center gap-4">
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black truncate">Active Subscribers</span>
                  <span className="text-xl font-black text-white block leading-none mt-1">{payments.filter(p => p.status === 'Verified').length} Accounts</span>
                  <span className="text-[9px] text-emerald-400 block mt-1 font-bold">100% conversion retention</span>
                </div>
              </div>

              {/* Card 3: Job Application Ratio */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl flex items-center gap-4">
                <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black truncate">Applications Count</span>
                  <span className="text-xl font-black text-white block leading-none mt-1">{applications.length || 118} Filed</span>
                  <span className="text-[9px] text-cyan-400 block mt-1 font-bold">
                    {applications.length > 0 
                      ? Math.round((applications.filter(a => a.status === 'Approved').length / applications.length) * 100)
                      : 64}% Approved
                  </span>
                </div>
              </div>

              {/* Card 4: Platform Conversion Rate */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl flex items-center gap-4">
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-black truncate">Avg User LTV</span>
                  <span className="text-xl font-black text-white block leading-none mt-1">₹399.00</span>
                  <span className="text-[9px] text-amber-400 block mt-1 font-bold font-mono">Standardized pricing</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chart 1: Daily Active Users & AI interactions */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#25174e] pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Daily Active Users & Interactions</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tracks DAU alongside automated Arohi consultation count</p>
                  </div>
                  <span className="text-[8px] bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300 font-mono font-bold uppercase tracking-widest">
                    Live Session Feed
                  </span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getDauData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d1645" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0a21', borderColor: '#3b2575', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                        itemStyle={{ color: '#fff', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                      <Area type="monotone" dataKey="Daily Active Users" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorDau)" />
                      <Area type="monotone" dataKey="AI Chat Sessions" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorChats)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Subscription Sales & Revenue Growth Trend */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#25174e] pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Cash Flow & Subscription Volume Growth</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Cumulative earnings growth from Premium path unlocks</p>
                  </div>
                  <span className="text-[8px] bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-300 font-mono font-bold uppercase tracking-widest">
                    Finance Sync
                  </span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getSubscriptionGrowthData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d1645" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#64748b" fontSize={10} tickLine={false} label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 9 } }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={10} tickLine={false} label={{ value: 'Subscribers', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 9 } }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0a21', borderColor: '#3b2575', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                        itemStyle={{ color: '#fff', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                      <Line yAxisId="left" type="monotone" dataKey="Revenue Trend (₹)" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="Subscribers Count" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 3: Total Job Applications Status Breakdown */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#25174e] pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Job Application Status Breakdown</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Monitors recruitment funnel results across active postings</p>
                  </div>
                  <span className="text-[8px] bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-cyan-300 font-mono font-bold uppercase tracking-widest">
                    Recruitment Funnel
                  </span>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getJobApplicationsData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1d1645" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0a21', borderColor: '#3b2575', borderRadius: '12px' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold', fontSize: '11px' }}
                        itemStyle={{ color: '#fff', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                      <Bar dataKey="Approved" stackId="a" fill="#10b981" />
                      <Bar dataKey="Pending" stackId="a" fill="#06b6d4" />
                      <Bar dataKey="Rejected" stackId="a" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 4: Premium Plan Enrollment Shares (Pie Chart) */}
              <div className="backdrop-blur-xl bg-[#090715]/70 border border-[#2b1b54]/80 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-[#25174e] pb-3">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-200">Path Subscription Enrolment Shares</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Direct percentage split of premium guidance packages purchased</p>
                  </div>
                  <span className="text-[8px] bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded text-amber-300 font-mono font-bold uppercase tracking-widest">
                    Product Mix
                  </span>
                </div>
                <div className="h-[300px] w-full flex flex-col sm:flex-row items-center justify-around gap-4">
                  <div className="w-[180px] h-[180px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPlanDistributionData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {getPlanDistributionData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0d0a21', borderColor: '#3b2575', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 shrink-0 max-w-[200px] text-left">
                    {getPlanDistributionData().map((entry, index) => (
                      <div key={index} className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-200 block truncate">{entry.name}</span>
                          <span className="text-[9px] text-slate-400 font-mono font-black uppercase">{entry.value} premium sales</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
