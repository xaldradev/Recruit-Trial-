import { Posting } from '../types';

export const initialPostings: Posting[] = [
  {
    id: 'ssc-mts-2026',
    title: 'SSC MTS & Havaldar Online Form 2026',
    organization: 'Staff Selection Commission (SSC)',
    postDate: '2026-06-20',
    postUpdateDate: '2026-06-23',
    shortInfo: 'Staff Selection Commission (SSC) has released the notification for Multi Tasking Staff (MTS) and Havaldar Recruitment 2026. All eligible candidates who are interested in this SSC Matric Level vacancy can apply online from 20th June 2026 to 25th July 2026. Please read the detailed notification for complete information regarding eligibility, age limit, selection procedure, and salary details.',
    category: 'latest-jobs',
    tags: ['SSC', '10th Pass', 'MTS', 'Havaldar'],
    department: 'SSC',
    isNew: true,
    dates: {
      applicationBegin: '2026-06-20',
      lastDateApply: '2026-07-25',
      lastDateFee: '2026-07-26',
      examDate: 'September - October 2026',
      admitCardAvailable: 'August 2026'
    },
    fees: {
      generalOBC: '₹ 100/-',
      scST: '₹ 0/- (Exempted)',
      female: '₹ 0/- (Exempted)',
      paymentMode: 'Debit Card, Credit Card, Net Banking or UPI Mode Only'
    },
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: '18 Years',
      maxAge: '25 - 27 Years (Post Wise)',
      relaxationInfo: 'Age relaxation is applicable as per SSC Multi Tasking Staff and Havaldar recruitment rules 2026.'
    },
    totalVacancies: 11439,
    vacancies: [
      {
        postName: 'Multi Tasking Staff (MTS) Non-Technical',
        totalPosts: 8120,
        eligibility: 'Passed Class 10th (High School) Exam from any recognized board in India.'
      },
      {
        postName: 'Havaldar (CBIC & CBN)',
        totalPosts: 3319,
        eligibility: 'Passed Class 10th (High School) Exam. Walking: Male: 1600 meters in 15 minutes, Female: 1 km in 20 minutes. Height: Male 157.5 cm, Female 152 cm.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      downloadSyllabus: '#syllabus',
      officialWebsite: 'https://ssc.gov.in'
    }
  },
  {
    id: 'rrb-alp-2026',
    title: 'Railway RRB Assistant Loco Pilot (ALP) Form',
    organization: 'Railway Recruitment Board (RRB)',
    postDate: '2026-06-18',
    shortInfo: 'Railway Recruitment Board (RRB) has invited online applications for the recruitment of Assistant Loco Pilot (ALP) under CEN 01/2026. Candidates holding ITI, Diploma or B.E/B.Tech in relevant engineering streams can apply online.',
    category: 'latest-jobs',
    tags: ['Railway', 'ITI', 'Diploma', 'Engineering'],
    department: 'Railway',
    isNew: true,
    dates: {
      applicationBegin: '2026-06-18',
      lastDateApply: '2026-07-30',
      lastDateFee: '2026-07-30',
      examDate: 'November 2026',
      admitCardAvailable: 'October 2026'
    },
    fees: {
      generalOBC: '₹ 500/- (Refundable after CBT-1)',
      scST: '₹ 250/- (Refundable after CBT-1)',
      female: '₹ 250/-',
      paymentMode: 'Online Net Banking, UPI, Credit Card or Debit Card'
    },
    ageLimit: {
      asOnDate: '01/07/2026',
      minAge: '18 Years',
      maxAge: '33 Years',
      relaxationInfo: 'Age relaxation is extra as per RRB Assistant Loco Pilot recruitment rules.'
    },
    totalVacancies: 5696,
    vacancies: [
      {
        postName: 'Assistant Loco Pilot (ALP)',
        totalPosts: 5696,
        eligibility: 'Class 10th (Matric) with ITI (NCVT/SCVT) in Fitter, Electrician, Instrument Mechanic, Millwright, Radio/TV, Electronics, Motor Vehicle, Turner, Machinist, or 3-Year Diploma in Mechanical, Electrical, Electronics, Automobile Engineering, or B.E/B.Tech Degree.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      downloadSyllabus: '#syllabus',
      officialWebsite: 'https://www.rrcb.gov.in'
    }
  },
  {
    id: 'upsc-nda-ii-2026-admit',
    title: 'UPSC NDA II Exam Admit Card 2026',
    organization: 'Union Public Service Commission (UPSC)',
    postDate: '2026-06-22',
    shortInfo: 'Union Public Service Commission (UPSC) has released the E-Admit Card for National Defence Academy & Naval Academy Examination (II) 2026. Candidates who have registered for this NDA-2 examination can download their admit card from the direct links provided below.',
    category: 'admit-card',
    tags: ['UPSC', 'NDA', 'Admit Card', 'Defence'],
    department: 'UPSC',
    isNew: true,
    dates: {
      applicationBegin: '2026-05-15',
      lastDateApply: '2026-06-04',
      lastDateFee: '2026-06-04',
      examDate: '06/09/2026',
      admitCardAvailable: '22/06/2026'
    },
    fees: {
      generalOBC: '₹ 100/-',
      scST: '₹ 0/- (Exempted)',
      female: '₹ 0/-',
      paymentMode: 'Net Banking, Debit/Credit Card or E-Challan'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '16.5 Years',
      maxAge: '19.5 Years',
      relaxationInfo: 'Candidates must not be born earlier than 2nd January 2007 and not later than 1st January 2010.'
    },
    totalVacancies: 404,
    vacancies: [
      {
        postName: 'Army (NDA)',
        totalPosts: 208,
        eligibility: 'Passed / Appearing Class 12th (Intermediate) Exam from any recognized board.'
      },
      {
        postName: 'Navy (NDA)',
        totalPosts: 42,
        eligibility: 'Passed / Appearing Class 12th Exam with Physics and Mathematics.'
      },
      {
        postName: 'Air Force (NDA)',
        totalPosts: 120,
        eligibility: 'Passed / Appearing Class 12th Exam with Physics and Mathematics.'
      },
      {
        postName: 'Naval Academy (10+2 Cadet Entry Scheme)',
        totalPosts: 34,
        eligibility: 'Passed / Appearing Class 12th Exam with Physics and Mathematics.'
      }
    ],
    links: {
      applyOnline: undefined,
      downloadNotification: '#notification',
      downloadSyllabus: '#syllabus',
      officialWebsite: 'https://upsc.gov.in'
    }
  },
  {
    id: 'ssc-chsl-tier-1-result',
    title: 'SSC CHSL 10+2 Tier I Exam Result 2026',
    organization: 'Staff Selection Commission (SSC)',
    postDate: '2026-06-23',
    shortInfo: 'Staff Selection Commission (SSC) has declared the written examination results of Combined Higher Secondary Level (10+2) Exam 2026 Tier I. Candidates who have appeared in this recruitment exam can download the Merit List PDF and Cut-off marks list from the link below.',
    category: 'results',
    tags: ['SSC', 'CHSL', 'Result', '10+2'],
    department: 'SSC',
    isNew: true,
    dates: {
      applicationBegin: '2026-03-10',
      lastDateApply: '2026-04-08',
      lastDateFee: '2026-04-09',
      examDate: '01-12 June 2026',
      admitCardAvailable: 'May 2026',
      resultDeclared: '23/06/2026'
    },
    fees: {
      generalOBC: '₹ 100/-',
      scST: '₹ 0/-',
      female: '₹ 0/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '27 Years',
      relaxationInfo: 'Age relaxation is extra as per Rules.'
    },
    totalVacancies: 3712,
    vacancies: [
      {
        postName: 'Lower Division Clerk (LDC) / Junior Secretariat Assistant (JSA)',
        totalPosts: 2100,
        eligibility: 'Must have passed 12th Standard or equivalent examination from a recognized Board.'
      },
      {
        postName: 'Data Entry Operator (DEO) / DEO Grade A',
        totalPosts: 1612,
        eligibility: '12th Standard pass in Science stream with Mathematics as a subject from a recognized Board.'
      }
    ],
    links: {
      applyOnline: undefined,
      downloadNotification: '#notification',
      downloadSyllabus: undefined,
      officialWebsite: 'https://ssc.gov.in'
    }
  },
  {
    id: 'ibps-clerk-xvi-form',
    title: 'IBPS Clerk XVI Online Form 2026',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    postDate: '2026-06-22',
    shortInfo: 'Institute of Banking Personnel Selection (IBPS) is conducting the Common Recruitment Process (CRP) for the recruitment of Clerical Cadre (Clerk XVI) in Public Sector Banks. Any Indian graduate can register online.',
    category: 'latest-jobs',
    tags: ['IBPS', 'Banking', 'Graduate Pass', 'Clerk'],
    department: 'Bank',
    isNew: true,
    dates: {
      applicationBegin: '2026-06-22',
      lastDateApply: '2026-07-15',
      lastDateFee: '2026-07-15',
      examDate: 'August 2026 (Prelims)',
      admitCardAvailable: 'August 2026'
    },
    fees: {
      generalOBC: '₹ 850/-',
      scST: '₹ 175/- (including GST)',
      female: '₹ 850/-',
      paymentMode: 'Online Payment Gateway (Debit Card, Credit Card, Internet Banking, IMPS, Cash Cards, Mobile Wallets)'
    },
    ageLimit: {
      asOnDate: '01/06/2026',
      minAge: '20 Years',
      maxAge: '28 Years',
      relaxationInfo: 'OBC: 3 years, SC/ST: 5 years, PwD: 10 years relaxation.'
    },
    totalVacancies: 6128,
    vacancies: [
      {
        postName: 'Clerk CRP XVI',
        totalPosts: 6128,
        eligibility: 'A Bachelor Degree (Graduation) in any discipline from a University recognized by the Govt. of India or any equivalent qualification. Operating and working knowledge in computer systems is mandatory.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      downloadSyllabus: '#syllabus',
      officialWebsite: 'https://www.ibps.in'
    }
  },
  {
    id: 'sbi-po-2025-final-result',
    title: 'SBI PO 2025 Final Result with Cutoff',
    organization: 'State Bank of India (SBI)',
    postDate: '2026-06-15',
    shortInfo: 'State Bank of India (SBI) has officially released the Final Result, Interview marks, and Cut-off marks of Probationary Officers (PO) Recruitment 2025. Candidates who cleared the main written examination and interview rounds can check their roll number in the list.',
    category: 'results',
    tags: ['SBI', 'Banking', 'PO', 'Result'],
    department: 'Bank',
    isNew: false,
    dates: {
      applicationBegin: '2025-09-07',
      lastDateApply: '2025-09-27',
      lastDateFee: '2025-09-27',
      examDate: 'Nov 2025 & Jan 2026',
      admitCardAvailable: 'Nov 2025',
      resultDeclared: '15/06/2026'
    },
    fees: {
      generalOBC: '₹ 750/-',
      scST: '₹ 0/-',
      female: '₹ 750/-',
      paymentMode: 'Online Only'
    },
    ageLimit: {
      asOnDate: '01/04/2025',
      minAge: '21 Years',
      maxAge: '30 Years',
      relaxationInfo: 'Standard bank recruitment age relaxation guidelines.'
    },
    totalVacancies: 2000,
    vacancies: [
      {
        postName: 'Probationary Officers (PO)',
        totalPosts: 2000,
        eligibility: 'Graduation degree in any discipline from a recognized University or any equivalent qualification recognized as such by the Central Government.'
      }
    ],
    links: {
      applyOnline: undefined,
      downloadNotification: '#notification',
      officialWebsite: 'https://sbi.co.in'
    }
  },
  {
    id: 'upsc-civil-services-pre-admit',
    title: 'UPSC Civil Services Pre Admit Card 2026',
    organization: 'Union Public Service Commission (UPSC)',
    postDate: '2026-06-10',
    shortInfo: 'Union Public Service Commission (UPSC) has issued the Civil Services (Preliminary) Exam 2026 Admit Card. Registered applicants can download their call letters by using their Registration ID or Roll Number.',
    category: 'admit-card',
    tags: ['UPSC', 'Civil Services', 'IAS', 'IPS'],
    department: 'UPSC',
    isNew: false,
    dates: {
      applicationBegin: '2026-02-14',
      lastDateApply: '2026-03-05',
      lastDateFee: '2026-03-05',
      examDate: '15/07/2026',
      admitCardAvailable: '10/06/2026'
    },
    fees: {
      generalOBC: '₹ 100/-',
      scST: '₹ 0/-',
      female: '₹ 0/-',
      paymentMode: 'Online / Offline Bank Challan'
    },
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: '21 Years',
      maxAge: '32 Years',
      relaxationInfo: 'Relaxable as per rules (OBC: 3 Years, SC/ST: 5 Years, PwD: up to 10 Years).'
    },
    totalVacancies: 1056,
    vacancies: [
      {
        postName: 'IAS / IPS / IFS and Group A/B Central Services',
        totalPosts: 1056,
        eligibility: 'Candidate must hold a Graduate degree of any of the Universities incorporated by an Act of the Central or State Legislature in India.'
      }
    ],
    links: {
      applyOnline: undefined,
      downloadNotification: '#notification',
      officialWebsite: 'https://upsc.gov.in'
    }
  },
  {
    id: 'ssc-cgl-2026-syllabus',
    title: 'SSC CGL Tier I & II Detailed Syllabus PDF',
    organization: 'Staff Selection Commission (SSC)',
    postDate: '2026-06-22',
    shortInfo: 'Get detailed subject-wise syllabus and exam pattern for the Staff Selection Commission Combined Graduate Level (CGL) 2026 examination. Includes latest changes, marking scheme, sectional timing, and sample papers for Tier 1 and Tier 2 written stages.',
    category: 'syllabus',
    tags: ['SSC', 'CGL', 'Syllabus', 'Exam Pattern'],
    department: 'SSC',
    isNew: true,
    dates: {
      applicationBegin: '2026-06-11',
      lastDateApply: '2026-07-10',
      lastDateFee: '2026-07-12',
      examDate: 'Sept 2026'
    },
    fees: {
      generalOBC: '₹ 100/-',
      scST: '₹ 0/-',
      paymentMode: 'Debit Card, Credit Card'
    },
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: '18 Years',
      maxAge: '32 Years',
      relaxationInfo: 'Post-wise age limit details are mentioned in notification.'
    },
    totalVacancies: 17727,
    vacancies: [
      {
        postName: 'Group B and C Various Graduate Posts',
        totalPosts: 17727,
        eligibility: 'Bachelor Degree in any stream from a recognized university.'
      }
    ],
    links: {
      downloadSyllabus: '#syllabus',
      officialWebsite: 'https://ssc.gov.in'
    }
  },
  {
    id: 'ctet-july-2026-admit-card',
    title: 'CBSE CTET July 2026 Exam Admit Card',
    organization: 'Central Board of Secondary Education (CBSE)',
    postDate: '2026-06-23',
    shortInfo: 'Central Board of Secondary Education (CBSE) has uploaded the admit cards for the Central Teacher Eligibility Test (CTET) July 2026 Exam. Registered candidates can check their exam date, center details, and shift timings by logging in with their application number.',
    category: 'admit-card',
    tags: ['CBSE', 'CTET', 'Teaching', 'Admit Card'],
    department: 'Teaching',
    isNew: true,
    dates: {
      applicationBegin: '2026-04-05',
      lastDateApply: '2026-05-02',
      lastDateFee: '2026-05-02',
      examDate: '07/07/2026',
      admitCardAvailable: '23/06/2026'
    },
    fees: {
      generalOBC: '₹ 1000/- (Single Paper) | ₹ 1200/- (Both)',
      scST: '₹ 500/- (Single Paper) | ₹ 600/- (Both)',
      paymentMode: 'Debit Card/Credit Card/Net Banking'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '17 Years',
      maxAge: 'No Upper Age Limit',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 0,
    vacancies: [
      {
        postName: 'Primary Teacher Eligibility (Class I to V)',
        totalPosts: 0,
        eligibility: 'Senior Secondary (or its equivalent) with at least 50% marks and passed or appearing in final year of 2-year Diploma in Elementary Education.'
      },
      {
        postName: 'Junior Teacher Eligibility (Class VI to VIII)',
        totalPosts: 0,
        eligibility: 'Graduation and passed or appearing in final year of 2-year Diploma in Elementary Education or 1-year B.Ed.'
      }
    ],
    links: {
      downloadNotification: '#notification',
      officialWebsite: 'https://ctet.nic.in'
    }
  },
  {
    id: 'ssc-cpo-si-2026-answer-key',
    title: 'SSC CPO SI Paper I Answer Key 2026',
    organization: 'Staff Selection Commission (SSC)',
    postDate: '2026-06-24',
    shortInfo: 'Staff Selection Commission has uploaded the tentative Answer Keys along with Candidates Response Sheets for Paper-I of Sub-Inspector (SI) in Delhi Police and Central Armed Police Forces (CAPFs) Exam 2026. Objections can be submitted online.',
    category: 'answer-key',
    tags: ['SSC', 'CPO', 'Delhi Police', 'Answer Key'],
    department: 'Defence',
    isNew: true,
    dates: {
      applicationBegin: '2026-03-04',
      lastDateApply: '2026-03-28',
      lastDateFee: '2026-03-29',
      examDate: '20-22 June 2026',
      admitCardAvailable: 'June 2026'
    },
    fees: {
      generalOBC: '₹ 100/-',
      scST: '₹ 0/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: '20 Years',
      maxAge: '25 Years',
      relaxationInfo: 'Age relaxation is permissible as per govt policies.'
    },
    totalVacancies: 4187,
    vacancies: [
      {
        postName: 'Sub-Inspector in Delhi Police & CAPFs',
        totalPosts: 4187,
        eligibility: 'For Delhi Police SI: Bachelor Degree in any stream with Valid Driving License. For CAPFs SI: Bachelor Degree in any stream.'
      }
    ],
    links: {
      applyOnline: undefined,
      downloadNotification: '#notification',
      officialWebsite: 'https://ssc.gov.in'
    }
  },
  {
    id: 'neet-ug-result-2026',
    title: 'NTA NEET UG Score Card & Cutoff Marks 2026',
    organization: 'National Testing Agency (NTA)',
    postDate: '2026-06-14',
    shortInfo: 'National Testing Agency (NTA) has announced the results and score cards for the National Eligibility cum Entrance Test (NEET UG) 2026. Students who have appeared for this prestigious medical entrance exam can now download their results.',
    category: 'results',
    tags: ['NTA', 'NEET', 'Medical Entrance', 'Result'],
    department: 'Teaching',
    isNew: false,
    dates: {
      applicationBegin: '2026-02-09',
      lastDateApply: '2026-03-16',
      lastDateFee: '2026-03-16',
      examDate: '05/05/2026',
      resultDeclared: '14/06/2026'
    },
    fees: {
      generalOBC: '₹ 1700/-',
      scST: '₹ 1000/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      asOnDate: '31/12/2009',
      minAge: '17 Years',
      maxAge: 'No Upper Age Limit',
      relaxationInfo: 'Should be born on or before 31/12/2009.'
    },
    totalVacancies: 100000,
    vacancies: [
      {
        postName: 'MBBS / BDS / BAMS / BHMS Admissions',
        totalPosts: 110000,
        eligibility: 'Passed or appearing in 10+2 (Intermediate) exam with Physics, Chemistry, Biology (PCB) group with minimum 50% marks.'
      }
    ],
    links: {
      downloadNotification: '#notification',
      officialWebsite: 'https://exams.nta.ac.in/NEET'
    }
  },
  {
    id: 'up-bed-2026-syllabus',
    title: 'UP B.Ed Joint Entrance Exam Syllabus PDF',
    organization: 'Bundelkhand University Jhansi',
    postDate: '2026-06-12',
    shortInfo: 'Download the comprehensive syllabus and exam schema for Uttar Pradesh B.Ed Joint Entrance Examination 2026. The syllabus lists Paper 1 (General Knowledge, Language) and Paper 2 (General Aptitude, Subject Specialization).',
    category: 'syllabus',
    tags: ['UP B.Ed', 'Admission', 'Syllabus'],
    department: 'State PSC',
    isNew: false,
    dates: {
      applicationBegin: '2026-02-10',
      lastDateApply: '2026-04-30',
      lastDateFee: '2026-05-07',
      examDate: '09/06/2026'
    },
    fees: {
      generalOBC: '₹ 1400/-',
      scST: '₹ 700/-',
      paymentMode: 'Online'
    },
    ageLimit: {
      asOnDate: '01/07/2026',
      minAge: '15 Years',
      maxAge: 'N/A',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 200000,
    vacancies: [
      {
        postName: 'UP B.Ed 2-Year Course Admission',
        totalPosts: 200000,
        eligibility: 'Bachelor or Master Degree in Science / Social Science / Humanities with 50% Marks, or BE/B.Tech with Specialization in Science & Math with 55% Marks.'
      }
    ],
    links: {
      downloadSyllabus: '#syllabus',
      officialWebsite: 'https://www.bujhansi.ac.in'
    }
  },
  {
    id: 'navy-ssr-mr-2026-form',
    title: 'Indian Navy Agniveer SSR & MR 02/2026 Form',
    organization: 'Indian Navy (Nausena Bharti)',
    postDate: '2026-06-21',
    shortInfo: 'Indian Navy (Join Indian Navy) has declared the recruitment notification for Agniveer (SSR) & Agniveer (MR) for batch 02/2026. Interested unmarried male and female candidates can fill out the form online.',
    category: 'latest-jobs',
    tags: ['Indian Navy', '12th Pass', '10th Pass', 'Agniveer'],
    department: 'Defence',
    isNew: true,
    dates: {
      applicationBegin: '2026-06-21',
      lastDateApply: '2026-07-10',
      lastDateFee: '2026-07-10',
      examDate: 'August 2026',
      admitCardAvailable: 'August 2026'
    },
    fees: {
      generalOBC: '₹ 550/- (Plus 18% GST)',
      scST: '₹ 550/-',
      paymentMode: 'Net Banking, Visa, Master, RuPay Credit/Debit Cards, UPI'
    },
    ageLimit: {
      asOnDate: '01/11/2005',
      minAge: '17.5 Years',
      maxAge: '21 Years',
      relaxationInfo: 'Candidate should be born between 01/11/2005 to 30/04/2009 (Both dates inclusive).'
    },
    totalVacancies: 1500,
    vacancies: [
      {
        postName: 'Agniveer (SSR) - Senior Secondary Recruit',
        totalPosts: 1200,
        eligibility: '10+2 (Intermediate) exam with Mathematics & Physics and at least one of these subjects: Chemistry/Biology/Computer Science from a recognized Board.'
      },
      {
        postName: 'Agniveer (MR) - Matric Recruit',
        totalPosts: 300,
        eligibility: 'Passed Class 10th (Matriculation) Exam from any recognized Board of School Education.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://joinindiannavy.gov.in'
    }
  },
  {
    id: 'iit-jee-advanced-result-2026',
    title: 'JEE Advanced Exam Result & Rank Card 2026',
    organization: 'Indian Institute of Technology (IIT Kanpur)',
    postDate: '2026-06-09',
    shortInfo: 'Indian Institute of Technology, IIT Kanpur has published the Joint Entrance Exam (JEE Advanced) 2026 results. Qualified students can check their ranks and apply for JoSAA counseling program.',
    category: 'results',
    tags: ['JEE Advanced', 'IIT', 'Result', 'Engineering'],
    department: 'Teaching',
    isNew: false,
    dates: {
      applicationBegin: '2026-04-27',
      lastDateApply: '2026-05-07',
      lastDateFee: '2026-05-08',
      examDate: '26/05/2026',
      resultDeclared: '09/06/2026'
    },
    fees: {
      generalOBC: '₹ 3200/-',
      scST: '₹ 1600/-',
      female: '₹ 1600/-',
      paymentMode: 'Online Gateway'
    },
    ageLimit: {
      asOnDate: '01/10/2001',
      minAge: '17 Years',
      maxAge: '24 Years',
      relaxationInfo: 'Standard IIT JEE relaxation rules.'
    },
    totalVacancies: 17385,
    vacancies: [
      {
        postName: 'IIT Admissions (B.Tech / Integrated M.Tech)',
        totalPosts: 17385,
        eligibility: 'Should be among the top 2,50,000 successful candidates in BE/B.Tech paper of JEE (Main) 2026.'
      }
    ],
    links: {
      downloadNotification: '#notification',
      officialWebsite: 'https://jeeadv.ac.in'
    }
  },
  {
    id: 'ignou-admission-july-2026',
    title: 'IGNOU July Admission Online Form 2026',
    organization: 'Indira Gandhi National Open University (IGNOU)',
    postDate: '2026-06-19',
    shortInfo: 'Indira Gandhi National Open University (IGNOU) has opened the admission registration portal for all Bachelor, Master, Diploma, PG Diploma, Certificate and semester-based programs for the July 2026 session. Direct link to apply and prospectus details are available here.',
    category: 'admission',
    tags: ['IGNOU', 'Distance Education', 'Admission', 'University'],
    department: 'Teaching',
    isNew: true,
    dates: {
      applicationBegin: '2026-06-15',
      lastDateApply: '2026-07-31',
      lastDateFee: '2026-07-31',
      examDate: 'N/A'
    },
    fees: {
      generalOBC: '₹ 300/- (Registration Fee)',
      scST: '₹ 300/- (Registration Fee)',
      paymentMode: 'Credit Card, Debit Card, Net Banking'
    },
    ageLimit: {
      asOnDate: 'N/A',
      minAge: 'No Age Bar',
      maxAge: 'No Age Bar',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 0,
    vacancies: [
      {
        postName: 'Under Graduate Courses (BA, B.Com, B.Sc, BCA etc)',
        totalPosts: 0,
        eligibility: 'Class 12th (Intermediate) Passed from any recognized Board.'
      },
      {
        postName: 'Post Graduate Courses (MA, M.Com, M.Sc, MCA, MBA etc)',
        totalPosts: 0,
        eligibility: 'Bachelor Degree in any stream from any recognized University.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://ignouadmission.samarth.edu.in'
    }
  },
  {
    id: 'opsc-mo-2026',
    title: 'OPSC Medical Officer (Group A) Online Form 2026',
    organization: 'Odisha Public Service Commission (OPSC)',
    postDate: '2026-06-24',
    shortInfo: 'Odisha Public Service Commission (OPSC) has invited online applications for recruitment of Medical Officers in Group A (Junior Branch) of Odisha Medical and Health Services Cadre. Eligible candidates with MBBS degree can apply online.',
    category: 'latest-jobs',
    tags: ['OPSC', 'Odisha Govt', 'MBBS', 'Medical Officer', 'State Govt'],
    department: 'State PSC',
    isNew: true,
    state: 'Odisha',
    jobType: 'government',
    sector: 'Healthcare & Medical',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-25',
      lastDateFee: '2026-07-25',
      examDate: 'August 2026'
    },
    fees: {
      generalOBC: '₹ 500/-',
      scST: '₹ 0/- (Exempted for SC/ST/PwD of Odisha)',
      paymentMode: 'Online via Net Banking/Debit Card/Credit Card'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '21 Years',
      maxAge: '38 Years',
      relaxationInfo: 'Age relaxation is applicable as per Odisha state reservation rules (5 years for SC/ST/SEBC/Women).'
    },
    totalVacancies: 727,
    vacancies: [
      {
        postName: 'Medical Officer (Group A)',
        totalPosts: 727,
        eligibility: 'Must possess an MBBS or equivalent degree from a Medical College recognized by the Medical Council of India.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://opsc.gov.in'
    }
  },
  {
    id: 'odisha-police-si-2026',
    title: 'Odisha Police Sub Inspector Form 2026',
    organization: 'Odisha Police Recruitment Board (OPRB)',
    postDate: '2026-06-23',
    shortInfo: 'Odisha Police Recruitment Board has launched online applications for recruitment of Sub-Inspectors of Police. Candidates must have a Bachelor Degree and good physical stamina.',
    category: 'latest-jobs',
    tags: ['Odisha Police', 'Odisha Govt', 'Graduate Pass', 'Sub Inspector', 'State Govt'],
    department: 'State Govt',
    isNew: true,
    state: 'Odisha',
    jobType: 'government',
    sector: 'Security & Defence',
    dates: {
      applicationBegin: '2026-06-23',
      lastDateApply: '2026-07-22',
      lastDateFee: '2026-07-22',
      examDate: 'September 2026'
    },
    fees: {
      generalOBC: '₹ 0/- (Free for all categories)',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '21 Years',
      maxAge: '25 Years',
      relaxationInfo: 'Upper age limit relaxation up to 5 years for SC/ST/SEBC/Women candidates.'
    },
    totalVacancies: 412,
    vacancies: [
      {
        postName: 'Sub-Inspector of Police',
        totalPosts: 412,
        eligibility: 'Must have passed a Bachelor Degree in any discipline from a recognized University. Candidate must be able to read, write, and speak Odia language fluently.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://odishapolice.gov.in'
    }
  },
  {
    id: 'osssc-forester-2026',
    title: 'OSSSC Livestock Inspector & Forester Form 2026',
    organization: 'Odisha Sub-Ordinate Staff Selection Commission (OSSSC)',
    postDate: '2026-06-22',
    shortInfo: 'Odisha Sub-Ordinate Staff Selection Commission is inviting online applications for the combined recruitment of Forester, Forest Guard, and Livestock Inspectors across Odisha forest circles.',
    category: 'latest-jobs',
    tags: ['OSSSC', 'Odisha Govt', '12th Pass', 'Forester', 'Forest Guard', 'State Govt'],
    department: 'State Govt',
    isNew: true,
    state: 'Odisha',
    jobType: 'government',
    sector: 'Forestry & Environment',
    dates: {
      applicationBegin: '2026-06-22',
      lastDateApply: '2026-07-28',
      lastDateFee: '2026-07-28',
      examDate: 'October 2026'
    },
    fees: {
      generalOBC: '₹ 0/- (Exempted)',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '38 Years',
      relaxationInfo: 'Age relaxation is permissible as per Govt. guidelines.'
    },
    totalVacancies: 1240,
    vacancies: [
      {
        postName: 'Forester',
        totalPosts: 316,
        eligibility: 'Must have passed +2 Science (Intermediate) from any recognized Council with basic knowledge in computer systems.'
      },
      {
        postName: 'Forest Guard',
        totalPosts: 802,
        eligibility: 'Must have passed Matriculation (Class 10th) exam or equivalent from a recognized board.'
      },
      {
        postName: 'Livestock Inspector',
        totalPosts: 122,
        eligibility: 'Must have passed +2 Vocational courses in the field of Animal Husbandry or Dairy or Poultry.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://osssc.gov.in'
    }
  },
  {
    id: 'ossc-cgl-2026',
    title: 'OSSC Combined Graduate Level (CGL) Recruitment 2026',
    organization: 'Odisha Staff Selection Commission (OSSC)',
    postDate: '2026-06-24',
    shortInfo: 'Odisha Staff Selection Commission (OSSC) has notified the massive CGL recruitment for Inspectors, Auditors, and Assistant Officers. Graduates from any stream can register.',
    category: 'latest-jobs',
    tags: ['OSSC', 'Odisha Govt', 'Graduate Pass', 'CGL', 'Inspector', 'Auditor'],
    department: 'State PSC',
    isNew: true,
    state: 'Odisha',
    jobType: 'government',
    sector: 'Administration',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-29',
      lastDateFee: '2026-07-29',
      examDate: 'December 2026'
    },
    fees: {
      generalOBC: '₹ 0/- (Free for all categories as per Odisha guidelines)',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '21 Years',
      maxAge: '38 Years',
      relaxationInfo: 'Maximum age is relaxed up to 5 years for SC/ST/SEBC and Women.'
    },
    totalVacancies: 540,
    vacancies: [
      {
        postName: 'Inspector of Cooperative Societies',
        totalPosts: 145,
        eligibility: 'Passed Graduate Degree in any stream with basic computer certification.'
      },
      {
        postName: 'Auditor in State Finances',
        totalPosts: 190,
        eligibility: 'Graduation in Commerce, Arts, or Science with mathematical background preferred.'
      },
      {
        postName: 'Junior Assistant (Headquarters)',
        totalPosts: 205,
        eligibility: 'Passed Graduation with solid command on computer and spreadsheet tools.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://ossc.gov.in'
    }
  },
  {
    id: 'odisha-teacher-2026',
    title: 'Odisha School Junior Teacher (Schematic) Form 2026',
    organization: 'Odisha School Education Programme Authority (OSEPA)',
    postDate: '2026-06-23',
    shortInfo: 'OSEPA is organizing CBT-based tests to fill thousands of Junior Teacher vacancies in primary & upper-primary schools of Odisha. CT, D.El.Ed, or B.Ed qualified applicants can register.',
    category: 'latest-jobs',
    tags: ['OSEPA', 'Odisha Govt', 'Teacher', 'B.Ed', 'D.El.Ed', 'OTET'],
    department: 'Teaching',
    isNew: true,
    state: 'Odisha',
    jobType: 'government',
    sector: 'Education & Academics',
    dates: {
      applicationBegin: '2026-06-23',
      lastDateApply: '2026-07-25',
      lastDateFee: '2026-07-25',
      examDate: 'September 2026'
    },
    fees: {
      generalOBC: '₹ 0/- (Exempted)',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/06/2026',
      minAge: '18 Years',
      maxAge: '38 Years',
      relaxationInfo: 'Age relaxed by 5 years for SEBC, SC, ST, and Female candidates.'
    },
    totalVacancies: 20000,
    vacancies: [
      {
        postName: 'Junior Teacher Primary (Class I to V)',
        totalPosts: 11000,
        eligibility: 'Passed Higher Secondary (+2) with 50% marks and 2-year Diploma in Elementary Education, must clear OTET-I.'
      },
      {
        postName: 'Junior Teacher Upper Primary (Class VI to VIII)',
        totalPosts: 9000,
        eligibility: 'Passed Graduation and 2-year Diploma in Elementary Education or 1-year B.Ed, must clear OTET-II.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://osepa.odisha.gov.in'
    }
  },
  {
    id: 'upp-constable-2026',
    title: 'UP Police Constable Online Recruitment 2026',
    organization: 'Uttar Pradesh Police Recruitment Board (UPPRPB)',
    postDate: '2026-06-20',
    shortInfo: 'Uttar Pradesh Police Recruitment and Promotion Board (UPPRPB) invites online applications for Class 12th pass applicants to join the UP Police Force as Police Constables.',
    category: 'latest-jobs',
    tags: ['UP Police', '12th Pass', 'Constable', 'State Govt', 'UP Govt'],
    department: 'State Govt',
    isNew: true,
    state: 'Uttar Pradesh',
    jobType: 'government',
    sector: 'Security & Defence',
    dates: {
      applicationBegin: '2026-06-20',
      lastDateApply: '2026-07-20',
      lastDateFee: '2026-07-20',
      examDate: 'November 2026'
    },
    fees: {
      generalOBC: '₹ 400/-',
      scST: '₹ 400/-',
      paymentMode: 'Online Net Banking, Debit/Credit Card, UPI, or Bank Challan'
    },
    ageLimit: {
      asOnDate: '01/07/2026',
      minAge: '18 Years',
      maxAge: '22 Years (Male) | 25 Years (Female)',
      relaxationInfo: 'Age relaxation is extra as per Uttar Pradesh state government guidelines.'
    },
    totalVacancies: 60244,
    vacancies: [
      {
        postName: 'Police Constable Citizen Police',
        totalPosts: 60244,
        eligibility: 'Passed Intermediate (Class 12th) Exam from any recognized board in India.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://uppbpb.gov.in'
    }
  },
  {
    id: 'bpsc-prof-2026',
    title: 'BPSC Assistant Professor & Lecturer Form 2026',
    organization: 'Bihar Public Service Commission (BPSC)',
    postDate: '2026-06-24',
    shortInfo: 'Bihar Public Service Commission (BPSC) invites applications for recruitment of Assistant Professors and Lecturers in government engineering and polytechnic colleges across Bihar state.',
    category: 'latest-jobs',
    tags: ['BPSC', 'B.Tech/M.Tech', 'State PSC', 'Lecturer', 'Bihar Govt'],
    department: 'State PSC',
    isNew: true,
    state: 'Bihar',
    jobType: 'government',
    sector: 'Education & Academics',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-24',
      lastDateFee: '2026-07-24',
      examDate: 'Written & Interview Schedule TBA'
    },
    fees: {
      generalOBC: '₹ 750/-',
      scST: '₹ 200/- (For Bihar Domicile)',
      female: '₹ 200/- (For Bihar Domicile)',
      paymentMode: 'Online Payment Mode only'
    },
    ageLimit: {
      asOnDate: '01/08/2026',
      minAge: '22 Years',
      maxAge: '45 Years',
      relaxationInfo: 'Relaxation benefits for reserve candidates of Bihar state.'
    },
    totalVacancies: 220,
    vacancies: [
      {
        postName: 'Assistant Professor / Lecturer',
        totalPosts: 220,
        eligibility: 'Master Degree in relevant engineering branch with First Class, or B.E/B.Tech/M.Tech with appropriate UGC/AICTE research clearances.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://bpsc.bih.nic.in'
    }
  },
  {
    id: 'railway-rpf-2026',
    title: 'Railway Protection Force (RPF) Constable Form 2026',
    organization: 'Ministry of Railways (RRB)',
    postDate: '2026-06-24',
    shortInfo: 'Railway Recruitment Boards (RRB) have published online applications for massive Constable and Sub-Inspector recruitments inside the Railway Protection Force (RPF). Open for all-India candidates.',
    category: 'latest-jobs',
    tags: ['RPF', 'Railway', 'Constable', '10th Pass', 'All India Govt'],
    department: 'Railway',
    isNew: true,
    state: 'All India',
    jobType: 'government',
    sector: 'Security & Defence',
    dates: {
      applicationBegin: '2026-06-15',
      lastDateApply: '2026-07-28',
      lastDateFee: '2026-07-28',
      examDate: 'December 2026'
    },
    fees: {
      generalOBC: '₹ 500/-',
      scST: '₹ 250/-',
      paymentMode: 'Online via Netbanking/UPI/Credit-Debit card'
    },
    ageLimit: {
      asOnDate: '01/07/2026',
      minAge: '18 Years',
      maxAge: '28 Years',
      relaxationInfo: 'Relaxation benefits of 5 years for SC/ST, 3 years for OBC.'
    },
    totalVacancies: 4208,
    vacancies: [
      {
        postName: 'RPF Constable',
        totalPosts: 4208,
        eligibility: 'Passed Class 10th (Matric) exam from any recognized educational board in India.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://rrcb.gov.in'
    }
  },
  {
    id: 'ibps-po-2026',
    title: 'IBPS PO/MT XVI Online Recruitment Form 2026',
    organization: 'Institute of Banking Personnel Selection (IBPS)',
    postDate: '2026-06-24',
    shortInfo: 'Institute of Banking Personnel Selection invites online applications for the recruitment of Probationary Officers (PO) and Management Trainees (MT) in public sector banks of India.',
    category: 'latest-jobs',
    tags: ['IBPS', 'Bank PO', 'Graduate Pass', 'Banking', 'All India Govt'],
    department: 'Bank',
    isNew: true,
    state: 'All India',
    jobType: 'government',
    sector: 'Banking & Finance',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-22',
      lastDateFee: '2026-07-22',
      examDate: 'October 2026 (Prelims)'
    },
    fees: {
      generalOBC: '₹ 850/-',
      scST: '₹ 175/-',
      paymentMode: 'Online Payment gateway (Netbanking/UPI/Cards)'
    },
    ageLimit: {
      asOnDate: '01/06/2026',
      minAge: '20 Years',
      maxAge: '30 Years',
      relaxationInfo: 'OBC gets 3 years; SC/ST gets 5 years age relaxation.'
    },
    totalVacancies: 3850,
    vacancies: [
      {
        postName: 'Probationary Officer (PO) / MT',
        totalPosts: 3850,
        eligibility: 'Must hold a Bachelor Degree in any discipline from a recognized university.'
      }
    ],
    links: {
      applyOnline: '#apply',
      downloadNotification: '#notification',
      officialWebsite: 'https://ibps.in'
    }
  },
  {
    id: 'bbsr-swe-private-2026',
    title: 'Graduate Software Developer (Bhubaneswar IT Park)',
    organization: 'Infolink Solutions Odisha',
    postDate: '2026-06-24',
    shortInfo: 'Join a rapidly expanding IT solutions provider at Infocity, Bhubaneswar. We are hiring Junior & Graduate developers to work on custom ERP, database solutions, and web application pipelines.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Software', 'Bhubaneswar', 'Graduate Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'IT & Software',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-30',
      lastDateFee: '₹ 0/- (No Fee)',
      examDate: 'Interviews on rolling basis'
    },
    fees: {
      generalOBC: '₹ 0/- (No Application Fee)',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '20 Years',
      maxAge: '30 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 45,
    vacancies: [
      {
        postName: 'Junior Software Engineer',
        totalPosts: 30,
        eligibility: 'B.E, B.Tech, MCA, BCA or B.Sc in Computer Science/IT. Basic familiarity with Javascript, Java, Python or web databases.'
      },
      {
        postName: 'Technical Support Associate',
        totalPosts: 15,
        eligibility: 'Any graduation degree. Good communication, basic troubleshooting, and client interfacing skills.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://infolinkodisha.co.in'
    }
  },
  {
    id: 'cuttack-logistics-private-2026',
    title: 'Operations Supervisor & Supply Chain Lead (Cuttack)',
    organization: 'Mahanadi Express Logistics',
    postDate: '2026-06-23',
    shortInfo: 'Mahanadi Express Logistics is recruiting warehouse, transport coordinator, and operation supervisors for the central Cuttack logistics terminal.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Operations', 'Logistics', 'Cuttack', 'Graduate Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'Logistics & Supply Chain',
    dates: {
      applicationBegin: '2026-06-23',
      lastDateApply: '2026-07-25',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '35 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 20,
    vacancies: [
      {
        postName: 'Operations Supervisor',
        totalPosts: 15,
        eligibility: 'Passed Bachelor Degree in any stream. Basic computer skills to record dispatches and coordinate route updates.'
      },
      {
        postName: 'Supply Chain Lead',
        totalPosts: 5,
        eligibility: 'Bachelor Degree or PG Diploma in Logistics / Supply Chain Management. 1-2 years experience preferred.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://mahanadilogs.com'
    }
  },
  {
    id: 'rourkela-mechanical-private-2026',
    title: 'Plant Mechanical Maintenance Engineer (Rourkela)',
    organization: 'Utkal Metallurgicals Private Ltd',
    postDate: '2026-06-22',
    shortInfo: 'Utkal Metallurgicals has vacancies for mechanical engineers and plant maintenance technicians for our heavy structural manufacturing plant near Rourkela.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Mechanical', 'Engineering', 'Rourkela', 'B.Tech/Diploma'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'Manufacturing & Core Eng',
    dates: {
      applicationBegin: '2026-06-22',
      lastDateApply: '2026-07-20',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '40 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 15,
    vacancies: [
      {
        postName: 'Mechanical Maintenance Engineer',
        totalPosts: 5,
        eligibility: 'B.Tech or Diploma in Mechanical Engineering. Sound knowledge of hydraulics, valves, and rotating machinery.'
      },
      {
        postName: 'Plant Supervisor / Technicians',
        totalPosts: 10,
        eligibility: 'ITI in Fitter / Turner / Machinist trade with minimum 1 year industrial apprenticeship.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://utkalmetals.com'
    }
  },
  {
    id: 'puri-hospitality-private-2026',
    title: 'Guest Services & Hospitality Associate (Puri Beach)',
    organization: 'Jagannath Heritage Hotels Ltd',
    postDate: '2026-06-24',
    shortInfo: 'Looking for enthusiastic, hospitality-minded staff members for guest relation executive and front office assistant roles at beachfront hotel chains in Puri, Odisha.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Hospitality', 'Puri', '12th Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'Hospitality & Tourism',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-15',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '28 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 25,
    vacancies: [
      {
        postName: 'Guest Relations Executive',
        totalPosts: 10,
        eligibility: 'Graduate pass. Good spoken communication skills in Odia, Hindi, and English.'
      },
      {
        postName: 'Front Office Assistant',
        totalPosts: 15,
        eligibility: 'Class 12th (Intermediate) or Diploma in Hotel Management. Professional appearance and positive attitude.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://jagannathheritagehotels.com'
    }
  },
  {
    id: 'bbsr-finance-private-2026',
    title: 'Retail Banking Relationship Associate (Bhubaneswar Branch)',
    organization: 'FinGrow Microfinance & Banking Co.',
    postDate: '2026-06-24',
    shortInfo: 'Grow your career in private sector microfinance and commercial banking. FinGrow is hiring customer relationship associates to manage operations across Odisha branches.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Finance', 'Bhubaneswar', 'Graduate Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'Banking & Finance',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-28',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '20 Years',
      maxAge: '32 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 35,
    vacancies: [
      {
        postName: 'Relationship Officer',
        totalPosts: 25,
        eligibility: 'Passed Graduate Degree in any stream (Commerce or Economics preferred). Friendly interpersonal skills and basic numerical ability.'
      },
      {
        postName: 'Branch Cashier / Accountant',
        totalPosts: 10,
        eligibility: 'B.Com graduate with knowledge in Tally and basic computer bookkeeping tools.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://fingrowindia.com'
    }
  },
  {
    id: 'cuttack-nurse-private-2026',
    title: 'Staff Nurse & Medical Laboratory Technician (Cuttack)',
    organization: 'Kalinga Superspeciality Hospital',
    postDate: '2026-06-23',
    shortInfo: 'A state-of-the-art healthcare setup in Cuttack, Odisha is hiring certified Staff Nurses and Lab Technicians for immediate placement.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Healthcare', 'Nursing', 'Cuttack', 'B.Sc Nursing'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'Healthcare & Medical',
    dates: {
      applicationBegin: '2026-06-23',
      lastDateApply: '2026-07-20',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '35 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 50,
    vacancies: [
      {
        postName: 'Registered Staff Nurse',
        totalPosts: 35,
        eligibility: 'Passed B.Sc Nursing or GNM (General Nursing & Midwifery) course from a recognized medical institution.'
      },
      {
        postName: 'Laboratory Technician',
        totalPosts: 15,
        eligibility: 'Passed DMLT (Diploma in Medical Laboratory Technology) or BMLT from a recognized state board.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://kalingahospitalcuttack.co.in'
    }
  },
  {
    id: 'sambalpur-tutor-private-2026',
    title: 'High School Math & Physics Faculty (Sambalpur Academy)',
    organization: 'Sambalpur Career Academy',
    postDate: '2026-06-22',
    shortInfo: 'Odisha private learning coaching classes are hiring secondary high school level educators for math, physics, and general science subjects.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Odisha Private', 'Teaching', 'Sambalpur', 'Tutor', 'Graduate Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Odisha',
    jobType: 'private',
    sector: 'Education & Academics',
    dates: {
      applicationBegin: '2026-06-22',
      lastDateApply: '2026-07-25',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '21 Years',
      maxAge: '45 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 12,
    vacancies: [
      {
        postName: 'Mathematics Lecturer',
        totalPosts: 6,
        eligibility: 'M.Sc or B.Sc in Mathematics, Physics or Engineering with good teaching communication skills.'
      },
      {
        postName: 'Physics/Science Trainer',
        totalPosts: 6,
        eligibility: 'Graduation in Science streams. Capable of explaining CBSE and Odisha board matric level concepts.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://sambalpuracademy.co.in'
    }
  },
  {
    id: 'blr-frontend-private-2026',
    title: 'Senior Frontend Developer (React) - Bengaluru Hub',
    organization: 'TechNexus Software India',
    postDate: '2026-06-24',
    shortInfo: 'We are seeking an experienced Frontend Developer with deep React, Vite, Tailwind CSS expertise to build interactive, fast SaaS client portals in Bengaluru.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'React', 'IT', 'Bengaluru', 'Software'],
    department: 'Private Sector',
    isNew: true,
    state: 'Karnataka',
    jobType: 'private',
    sector: 'IT & Software',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-08-10',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '21 Years',
      maxAge: '45 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 30,
    vacancies: [
      {
        postName: 'Senior Frontend Engineer',
        totalPosts: 15,
        eligibility: 'B.E/B.Tech/BCA/MCA. 3+ years writing professional React systems. Solid comprehension of state management and API design.'
      },
      {
        postName: 'React Developer',
        totalPosts: 15,
        eligibility: 'Graduation in IT stream. Knowledge of Tailwind CSS and modern JS frameworks.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://technexusindia.co.in'
    }
  },
  {
    id: 'hyd-pharma-private-2026',
    title: 'Quality Assurance & Lab Chemist (Hyderabad Pharma Hub)',
    organization: 'AuroPharma Labs Ltd',
    postDate: '2026-06-24',
    shortInfo: 'AuroPharma is hiring laboratory chemists and QA assistants for its pharmaceutical formulations plant located near Hyderabad, Telangana.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Pharma', 'Chemist', 'Hyderabad', 'B.Sc Chemistry'],
    department: 'Private Sector',
    isNew: true,
    state: 'Telangana',
    jobType: 'private',
    sector: 'Healthcare & Medical',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-07-31',
      lastDateFee: '₹ 0/- (No Fee)'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '19 Years',
      maxAge: '35 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 40,
    vacancies: [
      {
        postName: 'Quality Control Lab Chemist',
        totalPosts: 25,
        eligibility: 'B.Sc or M.Sc in Chemistry / Bio-Technology or Pharmacy (B.Pharm). Prior exposure to chromatography tools is helpful.'
      },
      {
        postName: 'Data Documentation Executive',
        totalPosts: 15,
        eligibility: 'Any science graduate. Basic computer filing and document logs record maintenance.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://auropharmalabs.co.in'
    }
  },
  {
    id: 'mumbai-finance-private-2026',
    title: 'Credit Risk Analyst & Equity Research Associate',
    organization: 'Bandra Capital Management',
    postDate: '2026-06-24',
    shortInfo: 'Bandra Capital in Mumbai seeks finance professionals to analyze portfolio risk structures, coordinate commercial banking metrics and write equity reports.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Finance', 'Analyst', 'Mumbai', 'MBA Finance'],
    department: 'Private Sector',
    isNew: true,
    state: 'Maharashtra',
    jobType: 'private',
    sector: 'Banking & Finance',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-08-05',
      lastDateFee: '₹ 0/-'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '22 Years',
      maxAge: '38 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 15,
    vacancies: [
      {
        postName: 'Credit Risk Analyst',
        totalPosts: 8,
        eligibility: 'MBA in Finance, PGDM, CA or CFA candidate. Command over spreadsheet models and financial reports evaluation.'
      },
      {
        postName: 'Equity Research Associate',
        totalPosts: 7,
        eligibility: 'Passed graduation with 1 year relevant analysis or data modeling experience.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://bandracapital.co.in'
    }
  },
  {
    id: 'pune-auto-private-2026',
    title: 'Automotive CAD Design Engineer (Pune Auto Hub)',
    organization: 'Chakan Auto Components Ltd',
    postDate: '2026-06-23',
    shortInfo: 'Chakan Auto Components is recruiting CAD modelers and product design quality engineers to create engine and body structural diagrams in Pune.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Automotive', 'CAD', 'Pune', 'B.Tech Mechanical'],
    department: 'Private Sector',
    isNew: true,
    state: 'Maharashtra',
    jobType: 'private',
    sector: 'Manufacturing & Core Eng',
    dates: {
      applicationBegin: '2026-06-23',
      lastDateApply: '2026-07-28',
      lastDateFee: '₹ 0/-'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '20 Years',
      maxAge: '35 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 22,
    vacancies: [
      {
        postName: 'Junior CAD Draftsman',
        totalPosts: 12,
        eligibility: 'B.E/B.Tech or Diploma in Mechanical / Production Engineering with training in CATIA, SolidWorks or AutoCAD.'
      },
      {
        postName: 'Quality Inspection Engineer',
        totalPosts: 10,
        eligibility: 'Graduation or ITI with mechanical apprenticeship experience.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://chakanautocomponents.co.in'
    }
  },
  {
    id: 'chennai-logistics-private-2026',
    title: 'Shipping Coordinator & Customs Documentation Specialist',
    organization: 'Coromandel Sea Freight Logistics',
    postDate: '2026-06-23',
    shortInfo: 'Coromandel Logistics in Chennai Port is hiring shipping assistants and port coordinators to handle customs entries and load tracking sheets.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Logistics', 'Shipping', 'Chennai', 'Graduate Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Tamil Nadu',
    jobType: 'private',
    sector: 'Logistics & Supply Chain',
    dates: {
      applicationBegin: '2026-06-23',
      lastDateApply: '2026-07-30',
      lastDateFee: '₹ 0/-'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '35 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 25,
    vacancies: [
      {
        postName: 'Customs Doc Associate',
        totalPosts: 15,
        eligibility: 'Passed Graduate Degree in any stream. Basic computer proficiency and attention to administrative guidelines.'
      },
      {
        postName: 'Port Loader Coordinator',
        totalPosts: 10,
        eligibility: 'Passed 12th class (Intermediate) with capacity to read and file dispatch reports.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://coromandelseafreight.com'
    }
  },
  {
    id: 'delhi-marketing-private-2026',
    title: 'Digital Marketing & Content Copywriter Associate',
    organization: 'WebScale Media Delhi-NCR',
    postDate: '2026-06-24',
    shortInfo: 'WebScale Media is recruiting SEO copywriters and content promoters to support client campaigns at our Gurugram-Noida corporate setups.',
    category: 'latest-jobs',
    tags: ['Private Sector', 'Marketing', 'SEO', 'Noida', 'Graduate Pass'],
    department: 'Private Sector',
    isNew: true,
    state: 'Delhi-NCR',
    jobType: 'private',
    sector: 'Marketing & Digital Media',
    dates: {
      applicationBegin: '2026-06-24',
      lastDateApply: '2026-08-10',
      lastDateFee: '₹ 0/-'
    },
    fees: {
      generalOBC: '₹ 0/-',
      scST: '₹ 0/-',
      paymentMode: 'N/A'
    },
    ageLimit: {
      asOnDate: '01/01/2026',
      minAge: '18 Years',
      maxAge: '32 Years',
      relaxationInfo: 'N/A'
    },
    totalVacancies: 18,
    vacancies: [
      {
        postName: 'SEO Content Writer',
        totalPosts: 10,
        eligibility: 'Passed Graduate Degree. Good command of written English grammar, blog drafting or marketing scripts.'
      },
      {
        postName: 'Social Media Optimizer',
        totalPosts: 8,
        eligibility: 'Passed graduation. Basic familiarity with Canva, content scheduling, and community boards.'
      }
    ],
    links: {
      applyOnline: '#apply',
      officialWebsite: 'https://webscalemediadelhi.co.in'
    }
  }
];
