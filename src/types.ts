export type CategoryType = 'latest-jobs' | 'admit-card' | 'results' | 'answer-key' | 'syllabus' | 'admission';

export interface VacancyDetail {
  postName: string;
  totalPosts: number;
  eligibility: string;
}

export interface Posting {
  id: string;
  title: string; // e.g., "SSC MTS 2026 Online Form"
  organization: string; // e.g., "Staff Selection Commission (SSC)"
  postDate: string; // e.g., "2026-06-15"
  postUpdateDate?: string;
  shortInfo: string;
  category: CategoryType;
  tags: string[]; // e.g., ["SSC", "10th Pass", "Latest Job"]
  department: string; // e.g., "SSC", "Railway", "UPSC", "Bank", "Defence", "State PSC", "Teaching"
  isNew?: boolean;
  state?: string; // e.g., "Odisha", "All India", "Bihar", "Uttar Pradesh", etc.
  jobType?: 'government' | 'private'; // default is 'government'
  sector?: string; // e.g., "IT & Software", "Logistics", "Manufacturing", "Hospitality", etc.
  
  // Important Dates
  dates: {
    applicationBegin: string;
    lastDateApply: string;
    lastDateFee: string;
    examDate?: string;
    admitCardAvailable?: string;
    resultDeclared?: string;
  };

  // Application Fee
  fees: {
    generalOBC: string;
    scST: string;
    female?: string;
    paymentMode: string;
  };

  // Age Limit (As on Date)
  ageLimit: {
    asOnDate: string;
    minAge: string;
    maxAge: string;
    relaxationInfo: string;
  };

  // Vacancies Info
  totalVacancies: number;
  vacancies: VacancyDetail[];

  // Useful links
  links: {
    applyOnline?: string;
    downloadNotification?: string;
    downloadSyllabus?: string;
    officialWebsite?: string;
  };
}

export interface Application {
  id: string;
  postingId: string;
  postingTitle: string;
  candidateName: string;
  fatherName: string;
  dob: string;
  gender: string;
  category: string; // General, OBC, SC, ST, EWS
  email: string;
  phone: string;
  qualification: string;
  address: string;
  photoUrl?: string;
  signatureUrl?: string;
  registrationNumber: string;
  appliedDate: string;
  status: 'Submitted' | 'Approved' | 'Rejected';
}
