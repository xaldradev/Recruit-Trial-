import { useEffect } from 'react';

interface SEOHeadProps {
  activeTab?: string;
  selectedState?: string;
  selectedAudience?: string;
}

const TAB_SEO_TITLES: Record<string, { title: string; desc: string }> = {
  chat: {
    title: "Arohi AI Assistant - Live Voice Call & Multilingual Chat in 150+ Languages (arohiai.com)",
    desc: "Speak with Arohi AI in Odia, Hindi, English, Bengali, Tamil, Telugu, Marathi & 150+ languages. Get real-time answers for career, business, exams, and daily queries."
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
    title: "Arohi AI Opportunity Board - Latest Govt & Private Jobs in India & Odisha",
    desc: "Explore verified job vacancies, Sarkari result updates, Railway, SSC, OPSC, Bank PO, and tech hiring in Odisha (Bhubaneswar), Bengaluru, Mumbai, Delhi, and worldwide."
  },
  schemes: {
    title: "India Government Schemes & Odisha Subhadra Yojana AI Guide | Arohi AI",
    desc: "Find and apply for top Central and State government schemes across Odisha (Subhadra Yojana, KALIA), Maharashtra, UP, Bihar, Tamil Nadu, and Karnataka with step-by-step AI help."
  },
  business: {
    title: "MSME Udyam Registration & Business Setup Helper | Arohi AI",
    desc: "Start and scale your business with Arohi AI. Get MSME registration steps, GST filing info, Startup Odisha grants, MUDRA loans, and pitch deck builder."
  },
  courses: {
    title: "Top Free Skill Certification Courses & Syllabus Helper | Arohi AI",
    desc: "Master Python, AI, Digital Marketing, Data Science, Spoken English, and CHSE/CBSE syllabus with Arohi AI structured roadmaps."
  },
  school: {
    title: "School Syllabus & Competitive Exam Guide for CHSE Odisha & CBSE | Arohi AI",
    desc: "Tailored educational syllabus notes, mock quizzes, and study guidance for Class 10th, 12th, NEET, JEE, and state board students."
  }
};

export default function SEOHead({ activeTab, selectedState, selectedAudience }: SEOHeadProps) {
  useEffect(() => {
    let title = "Arohi AI - World & India's #1 Multilingual Opportunity Engine (arohiai.com)";
    let desc = "Arohi AI empowers Students, Job Seekers, MSMEs, Teachers, Scientists, Engineers, and Doctors with live voice calling in 150+ languages across Odisha, India, and globally.";

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

    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }

    // Update OG Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);

  }, [activeTab, selectedState, selectedAudience]);

  return null;
}
