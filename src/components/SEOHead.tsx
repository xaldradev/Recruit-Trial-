import { useEffect } from 'react';
import { GLOBAL_LANGUAGES } from '../data/seoLocationsData';
import { Language } from '../translations';

interface SEOHeadProps {
  activeTab?: string;
  selectedState?: string;
  selectedAudience?: string;
  currentLanguage?: Language;
}

const TAB_SEO_TITLES: Record<string, { title: string; desc: string }> = {
  chat: {
    title: "Arohi AI Assistant - Live Voice Call & Multilingual Chat in 150+ Languages (arohiai.com)",
    desc: "Speak with Arohi AI in Odia, Hindi, English, Russian, Spanish, French, Bengali, Tamil, Telugu, Marathi & 150+ languages. Real-time answers for career, business, and exams."
  },
  jobs: {
    title: "Arohi AI Jobs & Vacancies Board - Verified Govt & Corporate Job Openings (arohiai.com)",
    desc: "Find verified Sarkari Naukri, SSC, UPSC, Railway, OPSC, Bank PO, and global tech jobs in India and worldwide with instant AI application assistance."
  },
  resume: {
    title: "Free AI Resume Checker & ATS Score Calculator | Arohi AI (arohiai.com)",
    desc: "Analyze your CV with Arohi AI. Get instant ATS compatibility score, formatting fixes, bullet point suggestions, and regional job matching across India and globally."
  },
  interview: {
    title: "AI Mock Interview Simulator & Voice Practice | Arohi AI (arohiai.com)",
    desc: "Practice real-time voice mock interviews for IT, Govt Exams, OPSC, SSC, UPSC, Banking, Medical, and Sales with Arohi AI instant feedback and scoring."
  },
  career: {
    title: "Arohi AI Career Intelligence & Opportunity Portal | Arohi AI (arohiai.com)",
    desc: "Explore verified job vacancies, Sarkari result updates, Railway, SSC, OPSC, Bank PO, and tech hiring in Odisha, India, and worldwide."
  },
  schemes: {
    title: "India Government Schemes & Subhadra Yojana AI Guide | Arohi AI (arohiai.com)",
    desc: "Find and apply for top Central and State government schemes across Odisha (Subhadra Yojana, KALIA), Maharashtra, UP, Bihar, Tamil Nadu, and Karnataka with AI step-by-step help."
  },
  business: {
    title: "MSME Udyam Registration & Business Setup Helper | Arohi AI (arohiai.com)",
    desc: "Start and scale your business with Arohi AI. Get MSME registration steps, GST filing info, Startup Odisha grants, MUDRA loans, and pitch deck builder."
  },
  courses: {
    title: "Top Free Skill Certification Courses & Syllabus Helper | Arohi AI (arohiai.com)",
    desc: "Master Python, AI, Digital Marketing, Data Science, Spoken English, and CHSE/CBSE syllabus with Arohi AI structured roadmaps."
  },
  syllabus: {
    title: "School Syllabus Class 1-10 & Exam Guide (CBSE & State Boards) | Arohi AI",
    desc: "Tailored educational syllabus notes, mock quizzes, and study guidance for Class 1 to 10th students in Odia, Hindi, English, and regional languages."
  }
};

export default function SEOHead({ activeTab, selectedState, selectedAudience, currentLanguage = 'en' }: SEOHeadProps) {
  useEffect(() => {
    let title = "Arohi AI - World & India's #1 Multilingual Opportunity Engine (arohiai.com)";
    let desc = "Arohi AI empowers Students, Job Seekers, MSMEs, Teachers, Scientists, Engineers, and Doctors with live voice calling in 150+ languages globally and regionally.";

    if (selectedState) {
      title = `Arohi AI ${selectedState} Career & Opportunity Portal | Arohi AI (arohiai.com)`;
      desc = `Explore top jobs, competitive exam prep, MSME setup, and government schemes tailored for ${selectedState} students, job seekers, and entrepreneurs with Arohi AI.`;
    } else if (selectedAudience) {
      title = `Arohi AI for ${selectedAudience} - Tailored Opportunities & Growth Guide`;
      desc = `Custom AI voice guidance, career roadmaps, tools, and opportunities crafted specifically for ${selectedAudience} on Arohi AI (arohiai.com).`;
    } else if (activeTab && TAB_SEO_TITLES[activeTab]) {
      title = TAB_SEO_TITLES[activeTab].title;
      desc = TAB_SEO_TITLES[activeTab].desc;
    }

    if (currentLanguage !== 'en') {
      const langNameMap: Record<string, string> = {
        ru: 'Russian', es: 'Spanish', fr: 'French', de: 'German', ja: 'Japanese',
        zh: 'Chinese', ar: 'Arabic', pt: 'Portuguese', it: 'Italian', ko: 'Korean',
        tr: 'Turkish', id: 'Indonesian', hi: 'Hindi', or: 'Odia', bn: 'Bengali',
        te: 'Telugu', mr: 'Marathi', ta: 'Tamil', gu: 'Gujarati', ur: 'Urdu',
        kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', as: 'Assamese'
      };
      const langName = langNameMap[currentLanguage] || currentLanguage.toUpperCase();
      title = `[${langName}] ${title}`;
    }

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', desc);

    // Update OG Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

    // Dynamic Canonical Link Insertion
    const protocol = window.location.protocol;
    const host = window.location.host;
    const currentPath = window.location.pathname;
    const canonicalUrl = `${protocol}//${host}${currentPath}`;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Clean up old hreflangs and re-inject
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach((el) => el.remove());

    // Inject x-default
    const xDefault = document.createElement('link');
    xDefault.setAttribute('rel', 'alternate');
    xDefault.setAttribute('hreflang', 'x-default');
    xDefault.setAttribute('href', `${protocol}//${host}${activeTab && activeTab !== 'home' ? `/${activeTab}` : '/'}`);
    document.head.appendChild(xDefault);

    // Inject all supported language hreflang links
    GLOBAL_LANGUAGES.forEach((lang) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang.code);
      const targetSubPath = lang.code === 'en' ? '' : `/${lang.code}`;
      const tabSubPath = activeTab && activeTab !== 'home' ? `/${activeTab}` : '';
      link.setAttribute('href', `${protocol}//${host}${targetSubPath}${tabSubPath}`);
      document.head.appendChild(link);
    });

  }, [activeTab, selectedState, selectedAudience, currentLanguage]);

  return null;
}
