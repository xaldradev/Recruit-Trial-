export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'Active' | 'Suspended' | 'VIP';
  permissions: {
    canEditJobs: boolean;
    canApproveApps: boolean;
    canViewFinance: boolean;
  };
  services: {
    path1: boolean; // Career, Jobs & Resume Plan
    path2: boolean; // Economical Skill Upgrade Plan
    path3: boolean; // Udyam Business Plan
  };
  takenCourses: string[];
  usage: {
    chatsWithArohi: number;
    resumeScans: number;
    mockInterviews: number;
  };
  customizedSettings: {
    tutoringSlot: string;
    priorityLevel: 'Standard' | 'High' | 'Critical';
    assignedMentor: string;
  };
}

export interface PaymentTransaction {
  id: string;
  userEmail: string;
  amount: number;
  planName: string;
  method: 'UPI' | 'GooglePlay' | 'NetBanking';
  date: string;
  status: 'Verified' | 'Pending' | 'Refunded';
}

export interface ArohiChatLog {
  id: string;
  userEmail: string;
  userName: string;
  topic: string;
  sentiment: 'Positive' | 'Neutral' | 'Urgent';
  messages: {
    sender: 'user' | 'arohi';
    text: string;
    time: string;
  }[];
}

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-001',
    email: 'elitetraderjunoon@gmail.com',
    name: 'Commander Junoon',
    role: 'Super Administrator',
    status: 'VIP',
    permissions: {
      canEditJobs: true,
      canApproveApps: true,
      canViewFinance: true
    },
    services: {
      path1: true,
      path2: true,
      path3: true
    },
    takenCourses: ['MSME Business Fundamentals', 'Drone Piloting & Agri-Spraying'],
    usage: {
      chatsWithArohi: 142,
      resumeScans: 28,
      mockInterviews: 12
    },
    customizedSettings: {
      tutoringSlot: 'Every Tuesday 18:00 IST',
      priorityLevel: 'Critical',
      assignedMentor: 'Dr. Debasish Mohanty (Senior Fellow)'
    }
  },
  {
    id: 'user-002',
    email: 'rajesh.kumar@example.com',
    name: 'Rajesh Kumar Singh',
    role: 'Premium Candidate',
    status: 'Active',
    permissions: {
      canEditJobs: false,
      canApproveApps: false,
      canViewFinance: false
    },
    services: {
      path1: true,
      path2: false,
      path3: false
    },
    takenCourses: ['Drone Piloting & Agri-Spraying'],
    usage: {
      chatsWithArohi: 45,
      resumeScans: 6,
      mockInterviews: 4
    },
    customizedSettings: {
      tutoringSlot: 'Every Saturday 10:00 IST',
      priorityLevel: 'High',
      assignedMentor: 'Meera Patnaik (Aviation Expert)'
    }
  },
  {
    id: 'user-003',
    email: 'amit.patil@example.com',
    name: 'Amit Suresh Patil',
    role: 'Standard Applicant',
    status: 'Active',
    permissions: {
      canEditJobs: false,
      canApproveApps: false,
      canViewFinance: false
    },
    services: {
      path1: false,
      path2: false,
      path3: false
    },
    takenCourses: [],
    usage: {
      chatsWithArohi: 12,
      resumeScans: 2,
      mockInterviews: 1
    },
    customizedSettings: {
      tutoringSlot: 'None Scheduled',
      priorityLevel: 'Standard',
      assignedMentor: 'Automated AI Guide'
    }
  },
  {
    id: 'user-004',
    email: 'subhasish.sen@example.com',
    name: 'Subhasish Sen',
    role: 'MSME Entrepreneur',
    status: 'Active',
    permissions: {
      canEditJobs: false,
      canApproveApps: false,
      canViewFinance: false
    },
    services: {
      path1: false,
      path2: false,
      path3: true
    },
    takenCourses: ['MSME Business Fundamentals'],
    usage: {
      chatsWithArohi: 68,
      resumeScans: 0,
      mockInterviews: 0
    },
    customizedSettings: {
      tutoringSlot: 'Every Monday 14:00 IST',
      priorityLevel: 'High',
      assignedMentor: 'Subrata Sahoo (Business Advisor)'
    }
  },
  {
    id: 'user-005',
    email: 'meera.patnaik@example.com',
    name: 'Meera Patnaik',
    role: 'VIP Member',
    status: 'VIP',
    permissions: {
      canEditJobs: false,
      canApproveApps: true,
      canViewFinance: false
    },
    services: {
      path1: true,
      path2: true,
      path3: false
    },
    takenCourses: ['Drone Piloting & Agri-Spraying'],
    usage: {
      chatsWithArohi: 110,
      resumeScans: 15,
      mockInterviews: 9
    },
    customizedSettings: {
      tutoringSlot: 'Every Thursday 11:00 IST',
      priorityLevel: 'Critical',
      assignedMentor: 'Dr. Debasish Mohanty (Senior Fellow)'
    }
  }
];

export const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'TXN-984102',
    userEmail: 'elitetraderjunoon@gmail.com',
    amount: 399,
    planName: 'Path 3: Udyam Business Assistance Plan',
    method: 'UPI',
    date: '29/06/2026',
    status: 'Verified'
  },
  {
    id: 'TXN-894103',
    userEmail: 'rajesh.kumar@example.com',
    amount: 399,
    planName: 'Path 1: Career, Jobs & Resume Plan',
    method: 'GooglePlay',
    date: '28/06/2026',
    status: 'Verified'
  },
  {
    id: 'TXN-150492',
    userEmail: 'meera.patnaik@example.com',
    amount: 399,
    planName: 'Path 1: Career, Jobs & Resume Plan',
    method: 'UPI',
    date: '28/06/2026',
    status: 'Verified'
  },
  {
    id: 'TXN-385012',
    userEmail: 'subhasish.sen@example.com',
    amount: 399,
    planName: 'Path 3: Udyam Business Assistance Plan',
    method: 'GooglePlay',
    date: '26/06/2026',
    status: 'Pending'
  },
  {
    id: 'TXN-492104',
    userEmail: 'amit.patil@example.com',
    amount: 99,
    planName: 'Professional ATS Resume Builder',
    method: 'UPI',
    date: '24/06/2026',
    status: 'Verified'
  }
];

export const INITIAL_CHAT_LOGS: ArohiChatLog[] = [
  {
    id: 'chat-001',
    userEmail: 'rajesh.kumar@example.com',
    userName: 'Rajesh Kumar Singh',
    topic: 'SSC MTS Eligibility',
    sentiment: 'Neutral',
    messages: [
      { sender: 'user', text: 'Am I eligible for SSC MTS and Havaldar exam if I am 26 years old?', time: '28/06 14:10' },
      { sender: 'arohi', text: 'Yes, Rajesh! The maximum age limit for SSC MTS general posts is 25 years, but for certain posts like Havaldar inside CBIC & CBN and specific departments, it is 27 years. Since you are 26, you can definitely apply for those posts! Would you like me to share the educational criteria?', time: '28/06 14:11' },
      { sender: 'user', text: 'Yes, please share the eligibility too.', time: '28/06 14:12' },
      { sender: 'arohi', text: 'Excellent! The minimum educational qualification is Matriculation (Class 10th pass) or equivalent from a recognized board inside India. Since you hold a Graduate Degree from Patna University, you are fully over-qualified and highly eligible!', time: '28/06 14:12' }
    ]
  },
  {
    id: 'chat-002',
    userEmail: 'subhasish.sen@example.com',
    userName: 'Subhasish Sen',
    topic: 'Mudra Loan Kishor Category',
    sentiment: 'Urgent',
    messages: [
      { sender: 'user', text: 'I want to apply for a Mudra loan of 4 Lakhs to purchase inventory for my handloom retail shop. Which category is best?', time: '27/06 10:15' },
      { sender: 'arohi', text: 'Hello Subhasish! For a capital loan of ₹4 Lakhs, the **Kishor Category** is the perfect fit. Mudra Kishor covers loans from ₹50,000 up to ₹5 Lakhs. It requires basic business registration (like Udyam MSME) and a simple project report. Would you like me to map out the required documents?', time: '27/06 10:16' },
      { sender: 'user', text: 'Yes, please list the documents. I have my Udyam cert.', time: '27/06 10:17' },
      { sender: 'arohi', text: 'Wonderful! Having your Udyam Certificate is a massive headstart. You will also need: 1) Last 6 months bank statements, 2) Identity and address proof, 3) Business address proof, and 4) Quotation for the inventory you wish to purchase. Since it is collateral-free, you do not need to pledge any property!', time: '27/06 10:18' }
    ]
  },
  {
    id: 'chat-003',
    userEmail: 'elitetraderjunoon@gmail.com',
    userName: 'Commander Junoon',
    topic: 'Custom Preparation Strategy',
    sentiment: 'Positive',
    messages: [
      { sender: 'user', text: 'Generate an intensive daily study roadmap for cracking civil service banking exams.', time: '29/06 09:30' },
      { sender: 'arohi', text: 'Pranam, Commander Junoon! To crack prestigious examinations like IBPS PO or RBI Assistant, here is your high-impact daily study block:\n\n* **Morning Block (2 Hours):** Quantitative Aptitude & Data Interpretation formulas.\n* **Noon Block (1.5 Hours):** Logical Reasoning puzzles and blood-relation drills.\n* **Evening Block (2 Hours):** General Awareness & Financial Current Affairs.\n* **Night Block (1 Hour):** Speed-reading English comprehension practice.\n\nI have locked this custom schedule to your dashboard tracker. Shall we perform a mock aptitude evaluation now?', time: '29/06 09:31' }
    ]
  }
];
