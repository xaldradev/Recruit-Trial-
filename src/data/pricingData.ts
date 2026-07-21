export interface PricingTier {
  price: number;
  name: string;
  margin: number; // 50% of price
  callHoursText: string;
  tokenUsageText: string;
  limits: {
    path1: {
      atsScans: string;
      mockInterviews: string;
      jobMatches: string;
      highlights: string[];
    };
    path2: {
      activeCourses: string;
      mentorHours: string;
      certificates: string;
      highlights: string[];
    };
    path3: {
      msmeFilings: string;
      mudraChecks: string;
      startupReports: string;
      highlights: string[];
    };
    path4: {
      chapterDownloads: string;
      aiQueries: string;
      highlights: string[];
    };
  };
}

export const PATH_DETAILS = {
  path1: {
    title: "Path 1: Career, Jobs & Resume Assistance",
    shortTitle: "Career & Resume Path",
    desc: "Sarkari & Private matching, ATS analyzer, and live mock interview practice.",
    icon: "🎓"
  },
  path2: {
    title: "Path 2: Economical Skill Upgradation",
    shortTitle: "Skill Upgradation Path",
    desc: "Industry-oriented courses. Access high-end AI tutoring and professional syllabus modules.",
    icon: "📖"
  },
  path3: {
    title: "Path 3: Udyam Business Launchpad",
    shortTitle: "Udyam Business Plan",
    desc: "Master MSME business filings, Mudra loan compliance, and Odisha subsidy claims.",
    icon: "🚀"
  },
  path4: {
    title: "Path 4: Class 1-10 Student Support",
    shortTitle: "School Support Path",
    desc: "NCERT-mapped multi-language textbooks, unique chapter notes, and parent-monitored dashboard.",
    icon: "📚"
  }
};

export const PRICING_TIERS: PricingTier[] = [
  {
    price: 399,
    name: "Starter Plan",
    margin: 199.50,
    callHoursText: "5 Hours of AI Calls / mo",
    tokenUsageText: "10,000 AI Tokens",
    limits: {
      path1: {
        atsScans: "5 ATS scans / mo",
        mockInterviews: "2 live simulation runs / mo",
        jobMatches: "15 premium job listings / mo",
        highlights: ["Sarkari application link routing", "Basic resume scoring", "Standard interview guidelines"]
      },
      path2: {
        activeCourses: "1 active course enrollment",
        mentorHours: "5 AI Arohi mentor hours / mo",
        certificates: "1 verified certificate / mo",
        highlights: ["Core interactive software modules", "Chapter progress syncing", "Printable completion digital badges"]
      },
      path3: {
        msmeFilings: "2 business filings / mo",
        mudraChecks: "5 Mudra credit evaluations / mo",
        startupReports: "1 custom startup roadmap",
        highlights: ["MSME Udyam application guide", "Arohi financial advisory chat", "PMEGP subsidy guidelines checklist"]
      },
      path4: {
        chapterDownloads: "10 high-quality chapter downloads / mo",
        aiQueries: "30 Homework AI tutor queries / mo",
        highlights: ["Class 1-10 syllabus guidelines", "Languages & Sciences chapter notes", "Basic subject quiz feedback"]
      }
    }
  },
  {
    price: 699,
    name: "Professional Plan",
    margin: 349.50,
    callHoursText: "10 Hours of AI Calls / mo",
    tokenUsageText: "15,000 AI Tokens",
    limits: {
      path1: {
        atsScans: "15 ATS scans / mo",
        mockInterviews: "8 live simulation runs / mo",
        jobMatches: "50 premium job listings / mo",
        highlights: ["Detailed ATS feedback report", "Interactive Voice Call feedback", "Salary negotiation coaching guidelines"]
      },
      path2: {
        activeCourses: "3 active course enrollments",
        mentorHours: "15 AI Arohi mentor hours / mo",
        certificates: "3 verified certificates / mo",
        highlights: ["Advanced technical modules included", "Arohi active real-time coding help", "Downloadable workspace certificate PDFs"]
      },
      path3: {
        msmeFilings: "6 business filings / mo",
        mudraChecks: "15 Mudra credit evaluations / mo",
        startupReports: "3 custom startup roadmaps",
        highlights: ["PMEGP portal document upload guides", "Odisha state scheme mapping", "MSME tax-saving incentives lookup"]
      },
      path4: {
        chapterDownloads: "30 high-quality chapter downloads / mo",
        aiQueries: "100 Homework AI tutor queries / mo",
        highlights: ["Bilingual explanation keys", "Mathematics & Arts syllabus expansion", "Parent progress dashboard email summaries"]
      }
    }
  },
  {
    price: 1699,
    name: "Growth Business Plan",
    margin: 849.50,
    callHoursText: "25 Hours of AI Calls / mo",
    tokenUsageText: "35,000 AI Tokens",
    limits: {
      path1: {
        atsScans: "50 ATS scans / mo",
        mockInterviews: "25 live simulation runs / mo",
        jobMatches: "150 premium job listings / mo",
        highlights: ["Industry expert resume remodeling", "Tailored corporate interview loops", "Priority vacancy alert notifications"]
      },
      path2: {
        activeCourses: "10 active course enrollments",
        mentorHours: "40 AI Arohi mentor hours / mo",
        certificates: "10 verified certificates / mo",
        highlights: ["Priority live voice classroom access", "Customized skill assessment paths", "Verified recruiter network sharing link"]
      },
      path3: {
        msmeFilings: "20 business filings / mo",
        mudraChecks: "50 Mudra credit evaluations / mo",
        startupReports: "10 custom startup roadmaps",
        highlights: ["Bankable Project Report template generator", "State-level PMEGP subsidy matching", "Startup India pitch-deck helper tools"]
      },
      path4: {
        chapterDownloads: "100 high-quality chapter downloads / mo",
        aiQueries: "350 Homework AI tutor queries / mo",
        highlights: ["Advanced Olympiad test preparations", "Personalized subject-by-subject study schedules", "One-click teacher review reports"]
      }
    }
  },
  {
    price: 3999,
    name: "Elite Executive Plan",
    margin: 1999.50,
    callHoursText: "60 Hours of AI Calls / mo",
    tokenUsageText: "80,000 AI Tokens",
    limits: {
      path1: {
        atsScans: "150 ATS scans / mo",
        mockInterviews: "75 live simulation runs / mo",
        jobMatches: "500 premium job listings / mo",
        highlights: ["Executive search and direct placement pipeline", "Personalized human-led resume audit call", "Pre-screen mock reviews by HR experts"]
      },
      path2: {
        activeCourses: "30 active course enrollments",
        mentorHours: "100 AI Arohi mentor hours / mo",
        certificates: "25 verified certificates / mo",
        highlights: ["Full agency syllabus integration", "One-on-one virtual project assistance", "Enterprise digital badge credentials"]
      },
      path3: {
        msmeFilings: "60 business filings / mo",
        mudraChecks: "150 Mudra credit evaluations / mo",
        startupReports: "30 custom startup roadmaps",
        highlights: ["Full commercial legal entity compliance", "Direct Bank manager loan profiling desk", "Dedicated MSME mentor-assigned manager"]
      },
      path4: {
        chapterDownloads: "300 high-quality chapter downloads / mo",
        aiQueries: "1000 Homework AI tutor queries / mo",
        highlights: ["Elite school curriculum integration", "Interactive VR science lab modules", "Live weekly group mentorship classes"]
      }
    }
  },
  {
    price: 4999,
    name: "Ultimate Premium Plan",
    margin: 2499.50,
    callHoursText: "80 Hours of AI Calls / mo",
    tokenUsageText: "100,000 AI Tokens",
    limits: {
      path1: {
        atsScans: "Unlimited scans",
        mockInterviews: "Unlimited live runs",
        jobMatches: "Unlimited job matching",
        highlights: ["Unlimited premium capabilities", "Direct Recruiter matching priority pass", "24/7 dedicated counselor support"]
      },
      path2: {
        activeCourses: "Unlimited active enrollments",
        mentorHours: "Unlimited AI mentor hours",
        certificates: "Unlimited verified certificates",
        highlights: ["Unlimited course accessibility", "Priority server allocation for instant AI responses", "Digital CV credentials repository"]
      },
      path3: {
        msmeFilings: "Unlimited filings",
        mudraChecks: "Unlimited Evaluations",
        startupReports: "Unlimited startup roadmaps",
        highlights: ["Unlimited legal/MSME documentation filings", "Unlimited loan project reports generator", "Startup Odisha pitch panel access"]
      },
      path4: {
        chapterDownloads: "Unlimited chapter downloads",
        aiQueries: "Unlimited Homework AI queries",
        highlights: ["Unlimited learning chapters access", "Direct tutor messaging board integrated", "High-school competitive exams explorer"]
      }
    }
  }
];

export function getTokenLimitForPrice(price: number): number {
  if (price === 399) return 10000;
  if (price === 699) return 15000;
  if (price === 1699) return 35000;
  if (price === 3999) return 80000;
  if (price === 4999) return 100000;
  return 10000; // default Starter
}
