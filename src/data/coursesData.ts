export interface Course {
  id: string;
  title: string;
  provider: string;
  category: 'tech' | 'business' | 'vocational';
  duration: string;
  modules: number;
  rating: number;
  shortDesc: string;
  skillsAcquired: string[];
  enrolled: boolean;
  syllabus: string[];
  price: string;
  instructor: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const initialCourses: Course[] = [
  // TECH CATEGORY (17 Courses)
  {
    id: 'fullstack-js',
    title: 'Full-Stack JavaScript & TypeScript Program',
    provider: 'Arohi Elite Academy',
    category: 'tech',
    duration: '12 Weeks',
    modules: 8,
    rating: 4.9,
    shortDesc: 'Master modern frontend & backend architectures. Learn React.js, TailwindCSS, Node.js, Express, and cloud database integration.',
    skillsAcquired: ['React.js', 'TypeScript', 'Node.js/Express', 'PostgreSQL', 'Deployment'],
    enrolled: false,
    syllabus: [
      'HTML5, CSS3, & Modern Tailwind Utility Layouts',
      'TypeScript Essentials & Interface Contracting',
      'React Components, State Management & Hooks',
      'Express REST API Routing & Middlewares',
      'PostgreSQL Schema Modeling & Query Optimization',
      'Continuous Integration & Production Deployment'
    ],
    price: '₹799',
    instructor: 'Dr. Alok Mohanty (Senior Software Architect)',
    level: 'Intermediate'
  },
  {
    id: 'aws-cloud',
    title: 'AWS Certified Cloud Practitioner Mastery',
    provider: 'Cloud Operations Institute',
    category: 'tech',
    duration: '6 Weeks',
    modules: 4,
    rating: 4.8,
    shortDesc: 'Prep course for AWS Cloud Practitioner certification. Learn virtual servers, S3, IAM security, and cost estimation.',
    skillsAcquired: ['AWS EC2', 'Amazon S3', 'VPC Networking', 'Cloud Security'],
    enrolled: false,
    syllabus: [
      'Cloud Paradigm Models & Global Infrastructure',
      'AWS Core Compute Services (EC2, Lambda, ECS)',
      'IAM Users, Group Security Policies & Roles',
      'S3 Storage Classes & Bucket Versioning Policies',
      'VPC Subnetting, Security Groups & Gateways',
      'Billing Budgets, AWS Cost Explorer, & Cost Saving Plans'
    ],
    price: '₹599',
    instructor: 'Rohan Sharma (AWS Solutions Architect)',
    level: 'Beginner'
  },
  {
    id: 'python-ai',
    title: 'Python for Beginners & Script Automation',
    provider: 'FutureTech Labs',
    category: 'tech',
    duration: '5 Weeks',
    modules: 5,
    rating: 4.7,
    shortDesc: 'Learn modern Python programming from scratch and master automation scripts with open web API integration.',
    skillsAcquired: ['Python Basic', 'Web APIs', 'Script Automation', 'Data Parsing'],
    enrolled: false,
    syllabus: [
      'Python Syntax, Variables, Loops, & Data Structures',
      'Writing Functions, Modules, and Error Handling',
      'Connecting to Public Web APIs & Managing Keys',
      'Designing JSON Schemas, Payloads & API Requests',
      'Building a Text Processor & Notification Automation Script'
    ],
    price: '₹499',
    instructor: 'Pooja Patnaik (Researcher)',
    level: 'Beginner'
  },
  {
    id: 'cyber-sec',
    title: 'Cyber Security Essentials & Ethical Hacking',
    provider: 'Defenders Security Corp',
    category: 'tech',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.8,
    shortDesc: 'Understand network defense, firewall architectures, OWASP Top 10 vulnerabilities, and security auditing.',
    skillsAcquired: ['Nmap Scanning', 'Wireshark Analysis', 'OWASP Top 10', 'Firewall Config'],
    enrolled: false,
    syllabus: [
      'Introduction to Security Paradigms & Linux Basics',
      'Network Protocols & Wireshark Packet Sniffing',
      'Vulnerability Scanning with Nmap & Nessus',
      'OWASP Top 10: XSS, SQL Injection, CSRF Auditing',
      'Configuring Active Firewalls & Intrusion Detection Systems',
      'Incident Response & Post-Mortem Analysis'
    ],
    price: '₹699',
    instructor: 'Vikram Jeet Singh (Ethical Hacker)',
    level: 'Intermediate'
  },
  {
    id: 'data-analytics',
    title: 'Data Science & Analytics with Power BI',
    provider: 'Kalinga Analytics Academy',
    category: 'tech',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.6,
    shortDesc: 'Clean real-world data and build interactive dashboards using Excel and Power BI for enterprise decision making.',
    skillsAcquired: ['Excel Pivot Tables', 'DAX Queries', 'Power BI Desktop', 'Data Cleansing'],
    enrolled: false,
    syllabus: [
      'Advanced Excel: VLOOKUP, INDEX-MATCH, Pivot Tables',
      'Power Query: Extract, Transform, & Load (ETL) Data',
      'Modeling Relationships & Writing DAX Expressions',
      'Creating Interactive Visuals: Charts, Cards, & Maps',
      'Publishing Dashboards & Generating Automated Reports'
    ],
    price: '₹449',
    instructor: 'Sanjay Mishra (Business Analyst)',
    level: 'Beginner'
  },
  {
    id: 'mobile-flutter',
    title: 'Mobile App Development with Flutter & Dart',
    provider: 'AppDev Guild',
    category: 'tech',
    duration: '10 Weeks',
    modules: 7,
    rating: 4.8,
    shortDesc: 'Build gorgeous, high-performance native iOS and Android apps using a single codebase with Flutter.',
    skillsAcquired: ['Dart Programming', 'Flutter SDK', 'State Management', 'REST Integration'],
    enrolled: false,
    syllabus: [
      'Introduction to Dart: Object-Oriented Programming',
      'Flutter Widgets Tree, Styling & Layout Architecture',
      'Handling User Inputs, Form Validations & Gestures',
      'State Management using Provider / Bloc',
      'Connecting to REST APIs & Local SQLite Database',
      'Building, Testing & Deploying to App Stores'
    ],
    price: '₹899',
    instructor: 'Deepak Dash (Mobile Engineer)',
    level: 'Intermediate'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Masterclass with Figma',
    provider: 'Visual Craft Studio',
    category: 'tech',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.9,
    shortDesc: 'Master wireframing, prototyping, typography pairing, and user flow architectures inside Figma.',
    skillsAcquired: ['Figma Tooling', 'Wireframing', 'Prototyping', 'Design Systems'],
    enrolled: false,
    syllabus: [
      'UI/UX Design Principles: Contrast, Alignment, Spacing',
      'Wireframing & Designing Low-Fidelity Layouts',
      'Advanced Figma Features: Auto-Layout & Component Variants',
      'Creating High-Fidelity Prototypes & Transitions',
      'User Testing, Feedback Gathering, & Developer Handoff'
    ],
    price: '₹399',
    instructor: 'Nisha Nayak (Lead Product Designer)',
    level: 'Beginner'
  },
  {
    id: 'sql-db-admin',
    title: 'Database Management (SQL, Postgres, MongoDB)',
    provider: 'Data Science Academy',
    category: 'tech',
    duration: '5 Weeks',
    modules: 4,
    rating: 4.5,
    shortDesc: 'Design database systems, write advanced queries, execute migrations, and optimize slow indexes.',
    skillsAcquired: ['SQL Queries', 'NoSQL Docs', 'Postgres Schema', 'Database Indexing'],
    enrolled: false,
    syllabus: [
      'Relational Theory & SQL Syntax (SELECT, JOIN, GROUP BY)',
      'Designing Normal Forms (1NF, 2NF, 3NF) & Schema Modeling',
      'PostgreSQL Admin: Roles, Backups, and Security Rules',
      'NoSQL Fundamentals with MongoDB: Collections & Aggregations',
      'Performance Tuning: Indexing, Query Plans, and Explain Analysis'
    ],
    price: '₹349',
    instructor: 'Subrat Acharya (DBA Manager)',
    level: 'Intermediate'
  },
  {
    id: 'salesforce-admin',
    title: 'Salesforce Administrator Certification',
    provider: 'Sarkari Tech Academy',
    category: 'tech',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.7,
    shortDesc: 'Configure Salesforce environments, manage user profiles, create custom workflows, and deploy reports.',
    skillsAcquired: ['Salesforce Org', 'Flow Builder', 'Security Policies', 'Reports & Charts'],
    enrolled: false,
    syllabus: [
      'Salesforce Architecture, Navigation & User Setup',
      'Customizing Standard Objects & Creating Custom Fields',
      'Implementing Security: Profiles, Roles, and Permission Sets',
      'Automating Processes using Flow Builder & Approval Processes',
      'Designing Custom Dashboards, Reports, & KPI Tracking Charts'
    ],
    price: '₹749',
    instructor: 'Manas Ranjan (Certified Salesforce Consultant)',
    level: 'Beginner'
  },
  {
    id: 'java-enterprise',
    title: 'Java Enterprise Web Apps with Spring Boot',
    provider: 'National Software Institute',
    category: 'tech',
    duration: '10 Weeks',
    modules: 7,
    rating: 4.6,
    shortDesc: 'Build resilient, scalable backend architectures using Java 17 and Spring Boot for high-transaction environments.',
    skillsAcquired: ['Java Core', 'Spring Boot', 'Hibernate JPA', 'REST API Design'],
    enrolled: false,
    syllabus: [
      'Java Fundamentals & OOP Principles',
      'Spring Framework Architecture & Dependency Injection',
      'Spring Boot Starter Web & Building RESTful Endpoints',
      'Spring Data JPA with Hibernate: Entity Mapping & Repositories',
      'Securing Services with Spring Security & JWT Tokens',
      'Deploying Spring Boot Applications with Docker Containers'
    ],
    price: '₹849',
    instructor: 'Amit Kumar Tripathy (Staff Software Architect)',
    level: 'Intermediate'
  },
  {
    id: 'qa-automation',
    title: 'Software Testing & Selenium Automation',
    provider: 'Quality Labs',
    category: 'tech',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.6,
    shortDesc: 'Learn manual testing principles and write automated UI test scripts using Selenium and Java/Python.',
    skillsAcquired: ['Manual Testing', 'Selenium WebDriver', 'TestNG', 'Bug Lifecycle'],
    enrolled: false,
    syllabus: [
      'Software Testing Life Cycle (STLC) & Test Case Design',
      'Manual Testing: Sanity, Regression, and Boundary Value Testing',
      'Selenium Web Driver Setup & Locating Elements (XPath/CSS)',
      'Designing Test Automation Frameworks (Page Object Model)',
      'Integrating Automation with CI/CD Pipelines'
    ],
    price: '₹399',
    instructor: 'Preeti Samal (Quality Assurance Lead)',
    level: 'Beginner'
  },
  {
    id: 'game-unity',
    title: 'Game Development with Unity & C#',
    provider: 'GameCraft Academy',
    category: 'tech',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.8,
    shortDesc: 'Build interactive 2D & 3D games, script rigid-body physics, design game loops, and launch on Web & Android.',
    skillsAcquired: ['C# Scripting', 'Unity UI Engine', '2D/3D Rigging', 'Game Deployment'],
    enrolled: false,
    syllabus: [
      'Introduction to Unity Interface & Project Structure',
      'C# Scripting for Game Logic: Vectors, Inputs, & Collision Hooks',
      'Designing Interactive UI, Health Bars & Main Menus',
      'Particle Systems, Ambient Lighting, & Audio Controllers',
      'Exporting Game Builds for WebGL and Mobile Android Formats'
    ],
    price: '₹649',
    instructor: 'Rajat Patra (Lead Indie Game Developer)',
    level: 'Intermediate'
  },
  {
    id: 'cyber-audit',
    title: 'Cybersecurity Audit & ISO 27001 Compliance',
    provider: 'Enterprise Risk Academy',
    category: 'tech',
    duration: '5 Weeks',
    modules: 4,
    rating: 4.5,
    shortDesc: 'Learn the principles of enterprise IT compliance, system auditing, asset classification, and security frameworks.',
    skillsAcquired: ['ISO 27001 Audit', 'Risk Management', 'Security Audits', 'IT Compliance'],
    enrolled: false,
    syllabus: [
      'Introduction to Cybersecurity Frameworks (NIST, ISO 27001)',
      'Conducting Risk Assessments & Threat Modeling Scenarios',
      'Auditing Core IT Controls: Access Management & Backups',
      'Drafting Audit Reports & Directing Remediation Plans'
    ],
    price: '₹499',
    instructor: 'Siddharth Behera (Lead Compliance Officer)',
    level: 'Advanced'
  },
  {
    id: 'office-excel',
    title: 'Office Productivity (Advanced Excel & G-Suite)',
    provider: 'Corporate Training Group',
    category: 'tech',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.7,
    shortDesc: 'Maximize administrative efficiency. Master spreadsheet formulas, automated mails, and team Google workspace.',
    skillsAcquired: ['Pivot Tables', 'Mail Merge', 'Google Forms', 'G-Suite Admin'],
    enrolled: false,
    syllabus: [
      'Excel Formulas: VLOOKUP, XLOOKUP, Nested IF, SUMIFS',
      'Interactive Charting, Conditional Formatting, & Print Scaling',
      'Google Sheets & Forms: Automating Data Entry Workflows',
      'Gmail Filters, Google Calendar Scheduling, and Google Drive Security'
    ],
    price: '₹299',
    instructor: 'Swati Senapati (Operations Coordinator)',
    level: 'Beginner'
  },
  {
    id: 'devops-ci-cd',
    title: 'DevOps Engineering, Docker & Jenkins',
    provider: 'Cloud Operations Institute',
    category: 'tech',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.8,
    shortDesc: 'Learn to build automated pipelines, manage containerized microservices, and deploy continuously to servers.',
    skillsAcquired: ['Docker', 'Jenkins Pipelines', 'Linux Admin', 'Git Versioning'],
    enrolled: false,
    syllabus: [
      'Linux Command Line, Shell Scripting, and Cron Automation',
      'Git Version Control: Branching, Merging & Pull Requests',
      'Dockerizing Web Applications: Writing Clean Dockerfiles',
      'Setting up Jenkins & Creating Continuous Integration Pipelines',
      'Deploying Containerized Apps and Monitoring Server Health Metrics'
    ],
    price: '₹799',
    instructor: 'Tushar Panda (Principal DevOps Architect)',
    level: 'Advanced'
  },
  {
    id: 'ai-prompt-biz',
    title: 'Generative AI & LLM Prompting for Business',
    provider: 'FutureTech Labs',
    category: 'tech',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.8,
    shortDesc: 'Learn to utilize state-of-the-art AI models for generating marketing copy, translating documents, and automating customer support.',
    skillsAcquired: ['Prompt Engineering', 'AI Copywriting', 'Summarization', 'AI Office Tools'],
    enrolled: false,
    syllabus: [
      'Understanding Large Language Models & How They Generalize',
      'Structuring Effective Prompts with Role, Context, and Output limits',
      'Using AI for Rapid Content Creation, Blog Posts, & Press Releases',
      'Automating Basic Email Drafting & Analysis of Customer Feedback Files'
    ],
    price: '₹349',
    instructor: 'Aditya Dash (AI Prompt Engineer)',
    level: 'Beginner'
  },
  {
    id: 'react-native-apps',
    title: 'Cross-Platform React Native App Development',
    provider: 'AppDev Guild',
    category: 'tech',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.7,
    shortDesc: 'Leverage JavaScript & React knowledge to build native mobile application interfaces with deep camera and geolocator access.',
    skillsAcquired: ['React Native', 'Mobile UI Design', 'Native Hooks', 'Device Storage'],
    enrolled: false,
    syllabus: [
      'React Native Environment Setup & Native Components Hierarchy',
      'Styling Responsive Screens using Flexbox Utilities',
      'Navigation Structures: Tabs, Stack, & Drawer Routing',
      'Accessing Native Sensors: Camera, Geolocation, and Storage',
      'Publishing Beta Builds via Expo & Generating Standalone APKs'
    ],
    price: '₹699',
    instructor: 'Subhashish Rout (Senior Mobile Architect)',
    level: 'Intermediate'
  },

  // BUSINESS & MSME TRADES (16 Courses)
  {
    id: 'msme-finance',
    title: 'MSME Business Operations & Finance',
    provider: 'National Small Scale Industries Academy',
    category: 'business',
    duration: '4 Weeks',
    modules: 5,
    rating: 4.7,
    shortDesc: 'Understand basic business book-keeping, Udyam registration, Mudra loan compliance, and capital flow budgeting.',
    skillsAcquired: ['MSME compliance', 'Cashflow balancing', 'Mudra banking prep', 'GST rules'],
    enrolled: false,
    syllabus: [
      'Udyam & Business Registration Portals',
      'Cashbook & Accounting Ledger Balancing',
      'GST Filing Threshold Rules & HSN Codes',
      'Collateral-Free Banking Structures (Mudra/PMEGP)',
      'Securing Subsidies for Rural & Urban Startups'
    ],
    price: '₹399',
    instructor: 'Niranjan Biswal (Chartered Accountant & MSME Consultant)',
    level: 'Beginner'
  },
  {
    id: 'digital-seo',
    title: 'Local Digital Marketing & Shop SEO',
    provider: 'StartUp India Hub',
    category: 'business',
    duration: '5 Weeks',
    modules: 4,
    rating: 4.6,
    shortDesc: 'Scale your local retail shop or startup. Learn Google My Business setup, local keywords targeting, and Instagram ads.',
    skillsAcquired: ['Google My Business SEO', 'Meta Ads tracking', 'Copywriting for sales', 'Target demographics'],
    enrolled: false,
    syllabus: [
      'Local Search Optimization Algorithms & Maps SEO',
      'Setting up Business Profiles, Reviews & Photos',
      'Social Media Ad Targeting Pipelines (Meta & Instagram Ads)',
      'Budgeting Local Marketing Campaigns with Low Capital',
      'WhatsApp Business Automations for Customer Retention'
    ],
    price: '₹349',
    instructor: 'Laxmi Priyadarsini (Digital Marketing Specialist)',
    level: 'Beginner'
  },
  {
    id: 'gst-tally',
    title: 'GST, ITR & Tally Prime Tax Practitioner',
    provider: 'Indian Institute of Commerce',
    category: 'business',
    duration: '6 Weeks',
    modules: 6,
    rating: 4.8,
    shortDesc: 'Launch your career as an independent tax advisor or business accountant. Master Tally Prime and Indian GST filings.',
    skillsAcquired: ['Tally Prime Ledger', 'GSTR 1/3B Filings', 'Income Tax Returns', 'Invoicing'],
    enrolled: false,
    syllabus: [
      'Setting up Companies & Chart of Accounts in Tally Prime',
      'Recording Vouchers: Purchase, Sales, Receipts, and Payments',
      'Configuring CGST, SGST, IGST, and e-Way Bills in Tally',
      'Preparing and Filing GST Returns (GSTR-1, GSTR-3B) on Live Portals',
      'Income Tax Basics: Filing ITR-1 and ITR-2 for Salaried & Small Traders'
    ],
    price: '₹499',
    instructor: 'Ramesh Chandra Sahoo (Senior Tax Advisor)',
    level: 'Beginner'
  },
  {
    id: 'retail-management',
    title: 'Retail Store Operations & Inventory Control',
    provider: 'National Small Scale Industries Academy',
    category: 'business',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.5,
    shortDesc: 'Master modern supermarket and retail shop management. Learn inventory forecasting, supplier sourcing, and checkout systems.',
    skillsAcquired: ['Inventory Tracking', 'Point of Sale (POS)', 'Supplier Sourcing', 'Staff Scheduling'],
    enrolled: false,
    syllabus: [
      'Layout Planning & Visual Merchandising Strategies',
      'Inventory Control: FIFO/LIFO, Stock Taking, and Minimizing Leakage',
      'Point of Sale (POS) Software & Billing Hardware Integrations',
      'Sourcing Distributors & Negotiating Credit Terms',
      'Customer Loyalty Programs & Festive Discount Marketing'
    ],
    price: '₹299',
    instructor: 'Kedar Nath Senapati (Former Retail Operations Head)',
    level: 'Beginner'
  },
  {
    id: 'mudra-loan-expert',
    title: 'Mudra Bank Loan & MSME Business Setup Guide',
    provider: 'Odisha Startup Association',
    category: 'business',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.8,
    shortDesc: 'Write complete bankable Project Reports to secure Shishu, Kishor, or Tarun Mudra loans up to ₹10 Lakhs.',
    skillsAcquired: ['Project Report Writing', 'Loan Eligibility Audit', 'Interest Subventions', 'CMA Data Prep'],
    enrolled: false,
    syllabus: [
      'Types of Mudra Loans: Shishu (up to 50k), Kishor (5L), Tarun (10L)',
      'Structuring Bankable Business Project Reports with Cash Flows',
      'Understanding Collateral-Free Guarantees (CGTMSE)',
      'Applying via Udyami Mitra Portal and Navigating Bank Audits'
    ],
    price: '₹349',
    instructor: 'Hrushikesh Panda (Retired Bank General Manager)',
    level: 'Beginner'
  },
  {
    id: 'logistics-warehouse',
    title: 'Logistics & E-Commerce Warehouse Operations',
    provider: 'Indian Institute of Logistics',
    category: 'business',
    duration: '5 Weeks',
    modules: 5,
    rating: 4.6,
    shortDesc: 'Prepare for high-demand roles in Amazon, Flipkart, or local logistics hubs. Learn dispatching and supply chain flows.',
    skillsAcquired: ['Warehouse Management', 'Supply Chain Logic', 'Barcode Scanning', 'Dispatch Tracking'],
    enrolled: false,
    syllabus: [
      'Basics of Warehouse Operations & Layout Design',
      'Inbound Operations: Goods Receipt, Quality Checks, and Binning',
      'Outbound Operations: Order Picking, Packing, & Dispatch Routing',
      'Using Warehouse Management Systems (WMS) & Barcoding Tools',
      'Managing Last-Mile Delivery Drivers and Cash-on-Delivery Reconciliation'
    ],
    price: '₹399',
    instructor: 'Santosh Kumar Behera (Logistics Operations Manager)',
    level: 'Beginner'
  },
  {
    id: 'real-estate-broking',
    title: 'Real Estate Sales & Odisha RERA Compliance',
    provider: 'Odisha Property Realtors Guild',
    category: 'business',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.7,
    shortDesc: 'Become a registered, high-earning property advisor. Master RERA rules, sales pitching, and land registration processes.',
    skillsAcquired: ['RERA Compliance', 'Property Valuation', 'Lead Generation', 'Sales Negotiation'],
    enrolled: false,
    syllabus: [
      'Understanding Real Estate Laws: RERA Act and State Amendments',
      'Verifying Land Records (Bhulekh Odisha) & Title Clearances',
      'Lead Generation: Digital Property Ads and Network Building',
      'Closing Sales: Negotiating Commissions & Handling Buyers',
      'Documentation: Sale Deeds, Agreement for Sale, & Registration Filing'
    ],
    price: '₹599',
    instructor: 'Prasant Mohapatra (RERA Legal Expert)',
    level: 'Intermediate'
  },
  {
    id: 'hr-payroll-compliance',
    title: 'HR Management, Payroll & PF/ESI Filing',
    provider: 'National Management Institute',
    category: 'business',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.7,
    shortDesc: 'Master corporate administrative compliance. Learn salary structure calculation, Provident Fund (PF) and ESI portal filing.',
    skillsAcquired: ['Payroll Structuring', 'PF Portal Filings', 'ESI Filings', 'Labor Laws compliance'],
    enrolled: false,
    syllabus: [
      'Components of Indian Salary Structures: Basic, HRA, DA, Special Allowance',
      'Provident Fund (PF) Rules: Registering Workers, Monthly Filings, & Withdrawals',
      'Employee State Insurance (ESI) Compliance & Benefit Claims',
      'Indian Labor Laws: Gratuity, Bonus, and Maternity Benefits Rules',
      'Using HRMS Tools & Advanced Payroll Software Packages'
    ],
    price: '₹449',
    instructor: 'Debasish Mohanty (HR Director)',
    level: 'Intermediate'
  },
  {
    id: 'prod-management',
    title: 'Digital Product Management Essentials',
    provider: 'StartUp India Hub',
    category: 'business',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.6,
    shortDesc: 'Learn to define product vision, construct agile backlogs, analyze user cohorts, and coordinate engineering cycles.',
    skillsAcquired: ['Agile Backlogs', 'User Cohorts', 'Product Metrics', 'Jira Tooling'],
    enrolled: false,
    syllabus: [
      'Role of Product Manager: Discovery, Definition, & Execution',
      'Market Research: Crafting User Personas & Value Propositions',
      'Agile Frameworks: Writing Epics, User Stories, and Sprint Planning',
      'Product Metrics: Analytics Tools and Cohort Engagement Tracking'
    ],
    price: '₹499',
    instructor: 'Anjali Dash (Senior Product Manager)',
    level: 'Beginner'
  },
  {
    id: 'banking-ssc-prep',
    title: 'General Aptitude Prep for Banking & SSC',
    provider: 'Sarkari Tech Academy',
    category: 'business',
    duration: '10 Weeks',
    modules: 8,
    rating: 4.8,
    shortDesc: 'Crack government and banking exams. Master quantitative aptitude, reasoning shortcuts, and English grammar patterns.',
    skillsAcquired: ['Quantitative Aptitude', 'Logical Reasoning', 'General Awareness', 'Exam Speed Hacks'],
    enrolled: false,
    syllabus: [
      'Quantitative Aptitude: Shortcuts for Ratio, Percentage, & Profit/Loss',
      'Logical Reasoning: Coding-Decoding, Seating Arrangements, & Syllogisms',
      'English Grammar: Sentence Corrections, Comprehension Patterns',
      'General Awareness: Government Schemes, Financial Sector Reforms'
    ],
    price: '₹349',
    instructor: 'Satyajit Ray (Govt Exams Coach - 12+ Years Experience)',
    level: 'Beginner'
  },
  {
    id: 'import-export-agent',
    title: 'Import-Export & Customs Clearing Agent Guide',
    provider: 'Indian Institute of Commerce',
    category: 'business',
    duration: '5 Weeks',
    modules: 5,
    rating: 4.5,
    shortDesc: 'Unlock international trade. Master IEC registration, letters of credit, customs documentation, and sea freight cargo routing.',
    skillsAcquired: ['IEC Registration', 'Letters of Credit', 'Customs Declarations', 'Incoterms 2020'],
    enrolled: false,
    syllabus: [
      'How to Obtain Import Export Code (IEC) on DGFT Portal',
      'Understanding Incoterms 2020 (FOB, CIF, EXW, DDP)',
      'Financial Instruments: Letters of Credit (LC) and Bank Guarantees',
      'Customs Clearance Process: Bills of Entry, Shipping Bills, and Tariffs'
    ],
    price: '₹599',
    instructor: 'Capt. Ashok Samantaray (Maritime Trade Advisor)',
    level: 'Intermediate'
  },
  {
    id: 'crm-customer-relations',
    title: 'Call Center & Customer Relations Management',
    provider: 'Corporate Training Group',
    category: 'business',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.6,
    shortDesc: 'Learn the core communication, conflict management, and software skills required for professional voice and non-voice call center jobs.',
    skillsAcquired: ['CRM Software', 'Voice Modulation', 'Active Listening', 'Conflict Resolution'],
    enrolled: false,
    syllabus: [
      'Customer Support Mindset & Active Listening Methodologies',
      'Handling Difficult Customers & Conflict Resolution Scenarios',
      'Working with Enterprise CRM Tools (Salesforce, Zendesk)',
      'Voice & Accent Grooming: Clear English and Hindi Pronunciation Guides'
    ],
    price: '₹299',
    instructor: 'Jyoti Rekha Sen (Director of Call Operations)',
    level: 'Beginner'
  },
  {
    id: 'stock-market-trading',
    title: 'Stock Market & Mutual Funds Basics',
    provider: 'Indian Institute of Commerce',
    category: 'business',
    duration: '5 Weeks',
    modules: 5,
    rating: 4.8,
    shortDesc: 'Navigate Indian financial markets safely. Understand NSE/BSE stock investing, mutual funds, and technical analysis.',
    skillsAcquired: ['Technical Charts', 'Mutual Funds Audit', 'Portfolio Balancing', 'Stock Valuations'],
    enrolled: false,
    syllabus: [
      'Introduction to Financial Ecosystems: SEBI, BSE, NSE, & Depositories',
      'How to Open Demat Accounts & Execute Buy/Sell Orders',
      'Fundamental Analysis: Reading Balance Sheets, PE Ratio, & Dividend Yields',
      'Technical Analysis: Candlestick Patterns, Support & Resistance Levels',
      'Mutual Funds: Analyzing Large Cap, Mid Cap, & Debt Fund Metrics'
    ],
    price: '₹449',
    instructor: 'Sameer Senapati (Certified Wealth Manager)',
    level: 'Beginner'
  },
  {
    id: 'event-wedding-mgmt',
    title: 'Event Management & Wedding Planning',
    provider: 'Visual Craft Studio',
    category: 'business',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.7,
    shortDesc: 'Build a profitable business coordination career. Learn budgeting, decorator coordination, vendor sourcing, and stage lighting design.',
    skillsAcquired: ['Event Budgeting', 'Vendor Coordination', 'Stage Styling', 'Crisis Planning'],
    enrolled: false,
    syllabus: [
      'Event Conception: Theme Design, Blueprinting, & Timelines',
      'Sourcing & Negotiating with Caterers, Decorators, and Technicians',
      'Constructing Clear Budgets & Fee Proposals for Clients',
      'Execution: Event Day Checklists, Stage Management, and Security Audits'
    ],
    price: '₹349',
    instructor: 'Rinky Swain (Lead Celebrations Planner)',
    level: 'Beginner'
  },
  {
    id: 'lic-insurance-agent',
    title: 'Insurance Sales Agent & LIC Advisor Program',
    provider: 'Enterprise Risk Academy',
    category: 'business',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.6,
    shortDesc: 'Prepare for IRDAI exams and learn modern sales funnel techniques to sell insurance products and health policies successfully.',
    skillsAcquired: ['IRDAI Exam Prep', 'Insurance Funnels', 'Policy Valuations', 'Trust-Based Selling'],
    enrolled: false,
    syllabus: [
      'Principles of Risk & Insurance: Life, Health, and Motor Coverages',
      'Cracking the IRDAI IC38 Agent Certification Exam',
      'Building a Lead Funnel: Referrals, Digital Outreach, & Local Ads',
      'Analyzing Client Wealth Needs and Customizing Insurance Portfolios'
    ],
    price: '₹299',
    instructor: 'Madhusudan Rout (Senior Development Officer)',
    level: 'Beginner'
  },
  {
    id: 'agritech-business',
    title: 'Agri-Tech Startup & Supply Chain Business',
    provider: 'Odisha Startup Association',
    category: 'business',
    duration: '5 Weeks',
    modules: 5,
    rating: 4.8,
    shortDesc: 'Connect farmers directly with urban markets. Master logistics, cold storage supply chain management, and online agri-store portals.',
    skillsAcquired: ['Agri-Supply Logistics', 'Cold Storage Control', 'B2B Sourcing', 'Agri-Portal Setup'],
    enrolled: false,
    syllabus: [
      'Indian Agriculture Supply Chain: Sourcing from Mandis & Farmer Producer Orgs',
      'Cold Chain Operations: Keeping Fruits & Vegetables Fresh',
      'B2B Wholesale Pitching: Supplying to Restaurants and Supermarkets',
      'Launching an Online Store: Order Placement and Delivery Route Optimization'
    ],
    price: '₹499',
    instructor: 'Dr. Ramesh Jena (Agribusiness Professor)',
    level: 'Intermediate'
  },

  // VOCATIONAL & SKILLED TRADES (17 Courses)
  {
    id: 'ev-maintenance',
    title: 'Electric Vehicle (EV) Maintenance & Repair',
    provider: 'National Skill Development Hub',
    category: 'vocational',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.9,
    shortDesc: 'Highly demanded trade program. Learn EV motor controller architectures, Lithium-ion battery diagnostics, and wiring faults.',
    skillsAcquired: ['EV Motor repair', 'Battery Management', 'Wiring Diagnostics', 'Charging Circuits'],
    enrolled: false,
    syllabus: [
      'EV Safety protocols & High-Voltage Warning Systems',
      'Lithium-Ion Battery Cell Testing & BMS Diagnostics',
      'Brushless DC (BLDC) Motor Operations and Controller Faults',
      'Regenerative Braking Systems & Charging Port Diagnostics',
      'Troubleshooting EV Wiring Harnesses & Instrument Clusters'
    ],
    price: '₹499',
    instructor: 'Er. Sujit Pradhan (EV Powertrain Specialist)',
    level: 'Intermediate'
  },
  {
    id: 'solar-technician',
    title: 'Solar Panel Installation & Grid Maintenance',
    provider: 'Renewable Energy Institute',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.8,
    shortDesc: 'Become a certified solar rooftop installer. Master panel mounting, off-grid inverter configurations, and solar net metering.',
    skillsAcquired: ['Solar Panel Mounting', 'Inverter Sizing', 'Battery Banking', 'Net Metering Config'],
    enrolled: false,
    syllabus: [
      'Solar Radiation Basics, Angle of Incidence, & Rooftop Loading',
      'Mounting Solar Panels: Metal Structures & Wind Load Calculations',
      'Sizing Batteries, Off-Grid Inverters, and Solar Charge Controllers',
      'On-Grid Solar Systems & Coordinating State Net-Metering Paperwork',
      'Annual Maintenance: Testing Panels for Hotspots & Inverter Alarms'
    ],
    price: '₹399',
    instructor: 'Siddharth Patnaik (Director of Solar Infrastructure)',
    level: 'Beginner'
  },
  {
    id: 'mobile-repair',
    title: 'Smartphone & Tablet Hardware Repairing',
    provider: 'National Skill Development Hub',
    category: 'vocational',
    duration: '5 Weeks',
    modules: 5,
    rating: 4.7,
    shortDesc: 'Practical hands-on masterclass. Learn screen/folder replacing, battery testing, charging pin soldering, and IC testing.',
    skillsAcquired: ['Display Replacement', 'SMD Soldering', 'IC Troubleshooting', 'Charging Jack Fix'],
    enrolled: false,
    syllabus: [
      'Tools of the Trade: Screwdrivers, Spudgers, Heat Plates, & SMD Stations',
      'Replacing Screen Folders, Tempered Glasses, and Display Backlights',
      'Soldering Micro-Components: Charging Jacks, Microphones, and Speakers',
      'Lithium Battery Health Diagnosis & Jump-starting Dead Batteries',
      'Basic Circuit Board Troubleshooting & Water Damage Diagnostics'
    ],
    price: '₹349',
    instructor: 'Rajib Lochan Dey (Expert Hardware Technician)',
    level: 'Beginner'
  },
  {
    id: 'cctv-automation',
    title: 'CCTV & Smart Home Automation Installer',
    provider: 'Defenders Security Corp',
    category: 'vocational',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.6,
    shortDesc: 'Install CCTV cameras, program DVR/NVR network systems, configure IP camera remote viewing on mobile apps.',
    skillsAcquired: ['IP Camera Setup', 'DVR/NVR Configuration', 'Cat6 Cabling', 'Remote Viewing Apps'],
    enrolled: false,
    syllabus: [
      'Types of CCTV: Analog High Definition vs IP Digital Cameras',
      'Cabling: Cat6 Punching, RJ45 crimping, & BNC Balun installation',
      'DVR/NVR Hard Drive Setup, Scheduling Continuous & Motion Recording',
      'Configuring Routers, Port Forwarding, & Remote Mobile Viewing Apps',
      'Integrating Smart Locks, Wi-Fi Bulbs, and Motion Sensors'
    ],
    price: '₹299',
    instructor: 'Gopal Chandra Das (Security Integration Specialist)',
    level: 'Beginner'
  },
  {
    id: 'cnc-operator',
    title: 'CNC Machine Operations & Programming',
    provider: 'Heavy Industries Training Center',
    category: 'vocational',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.7,
    shortDesc: 'Prepare for high-paying manufacturing sector jobs. Master G-code, tooling setup, micrometer calibrations, and CNC lathe operations.',
    skillsAcquired: ['G-Code Programming', 'CNC Lathe Setup', 'Micrometer Caliper', 'Machining Safety'],
    enrolled: false,
    syllabus: [
      'Reading Engineering Blueprints & Orthographic Projections',
      'Using Precision Instruments: Vernier Calipers, Micrometers, & Gauges',
      'Introduction to CNC Lathes & Mills: Axis Identifications',
      'Writing G-Code and M-Code Programs for Basic Machining Operations',
      'Setting Machine Offsets, Tool Selection, & Monitoring Coolants'
    ],
    price: '₹449',
    instructor: 'Bijay Kumar Das (Senior CNC Programmer)',
    level: 'Intermediate'
  },
  {
    id: 'ac-fridge-repair',
    title: 'AC & Refrigeration Repair Specialist',
    provider: 'Heavy Industries Training Center',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.8,
    shortDesc: 'Launch a self-employed repair trade. Master Split AC installation, copper tube gas charging, and compressor diagnostics.',
    skillsAcquired: ['Split AC Installation', 'Copper Pipe Brazing', 'Gas Charging R32/R22', 'Compressor Audit'],
    enrolled: false,
    syllabus: [
      'Principles of Refrigeration Cycle: Evaporation, Compression, Condensation',
      'Split & Window AC Installation: Mounting, Flare Connections, & Vacuuming',
      'Copper Tube Handling: Cutting, Bending, Swaging, & Gas Brazing',
      'Gas Charging: Measuring Pressures & Filling R32, R410, and R22 Refrigerant',
      'Electrical Troubleshooting: Testing Capacitors, Relays, & Compressors'
    ],
    price: '₹399',
    instructor: 'Debabrata Rout (Master HVAC Engineer)',
    level: 'Beginner'
  },
  {
    id: 'autocad-civil',
    title: 'Auto CAD & 3D Drafting for Civil Engineers',
    provider: 'Visual Craft Studio',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.7,
    shortDesc: 'Learn the architectural drafting skills required by builders and real estate designers. Master 2D plans and 3D elevations.',
    skillsAcquired: ['AutoCAD Layouts', 'Blueprint Drafting', '3D Elevations', 'Building Bye-laws'],
    enrolled: false,
    syllabus: [
      'AutoCAD Interface: Navigation, Workspace Setup, and Coordinates',
      'Drawing Tools: Lines, Poly-lines, Layers, and Dimensioning',
      'Creating Residential Floor Plans & Column Layout Blueprints',
      'Understanding Local Municipal Bye-Laws & Standard Scale Ratios',
      'Generating Simple 3D Structural Elevations & Rendering Outputs'
    ],
    price: '₹449',
    instructor: 'Biswajit Mohanty (Structural Designer)',
    level: 'Beginner'
  },
  {
    id: 'organic-farming',
    title: 'Organic Farming & Agri-Business Adviser',
    provider: 'National Skill Development Hub',
    category: 'vocational',
    duration: '5 Weeks',
    modules: 4,
    rating: 4.8,
    shortDesc: 'Master biological vermicomposting, soil testing, organic pest controls, state agricultural subsidies, and wholesale farm business.',
    skillsAcquired: ['Soil Nutrient Audit', 'Vermicomposting', 'Organic Pest Control', 'Subsidy Audits'],
    enrolled: false,
    syllabus: [
      'Evaluating Soil Health: Testing pH, Nitrogen, Phosphorus, Potassium',
      'Setting up Vermicomposting Beds & Producing Liquid Bio-fertilizers',
      'Biological Pest Control Methods: Neem-oil formulations, Sticky Traps',
      'Coordinating Organic Farm Certifications & Accessing State Subsidies'
    ],
    price: '₹299',
    instructor: 'Krushaka Bandhu Jena (Senior Agricultural Extension Officer)',
    level: 'Beginner'
  },
  {
    id: 'culinary-catering',
    title: 'Culinary Arts & Bakery Masterclass',
    provider: 'Hotel Association Academy',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.9,
    shortDesc: 'Prepare for professional kitchen and bakery positions. Learn commercial baking, bulk catering food safety, and menu pricing.',
    skillsAcquired: ['Commercial Baking', 'Kitchen Hygiene', 'Bulk Catering Sizing', 'Menu Costing'],
    enrolled: false,
    syllabus: [
      'Knife Skills & Setting up Mise-en-place for Bulk Cooking',
      'Baking Basics: Bread doughs, Cakes, Pastries, and Cookies',
      'Indian & International Gravies: Base Preparations & Slow-Cooking',
      'Kitchen Food Safety Standards (FSSAI Guidelines) & Sanitization',
      'Cost Sizing: Setting Competitive Event Menu Prices & Portions'
    ],
    price: '₹349',
    instructor: 'Chef Sanjeev Mishra (Executive Chef)',
    level: 'Beginner'
  },
  {
    id: 'beauty-salon',
    title: 'Professional Beauty & Salon Styling',
    provider: 'Visual Craft Studio',
    category: 'vocational',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.7,
    shortDesc: 'Start your own neighborhood parlor. Learn professional makeup, hair styling, skin care therapies, and bridal packages.',
    skillsAcquired: ['Bridal Makeup', 'Hair Designing', 'Skin Care Facials', 'Salon Operations'],
    enrolled: false,
    syllabus: [
      'Skin Anatomy, Tone Identification & Product Selection Guides',
      'Step-by-step Bridal Makeup Protocols & HD Product Application',
      'Hair Styling: Hair-cuts, Blow-dry, Perming, & Bridal Updos',
      'Managing Salon Safety, Cleanliness, & Sourcing Wholesale Products'
    ],
    price: '₹299',
    instructor: 'Minakshi Swain (Bridal Salon Owner)',
    level: 'Beginner'
  },
  {
    id: 'fashion-tailoring',
    title: 'Fashion Designing & Apparel Tailoring',
    provider: 'Visual Craft Studio',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.6,
    shortDesc: 'Learn precise apparel cutting, measurements, sewing machine operations, and custom neck/sleeves styling for boutique shops.',
    skillsAcquired: ['Pattern Drafting', 'Sewing Machine Ops', 'Boutique Cutting', 'Embroidery Basics'],
    enrolled: false,
    syllabus: [
      'Operating & Maintaining Industrial Sewing Machines',
      'Taking Accurate Body Measurements & Translating onto Drafting Paper',
      'Fabric Cutting Protocols for Salwar Suits, Blouses, & Modern Tunics',
      'Stitching & Finishing Techniques: Collars, Zippers, & Interlocking',
      'Basic Hand Embroidery & Attaching Zari/Lace Border Trims'
    ],
    price: '₹299',
    instructor: 'Geetanjali Acharya (Senior Boutique Director)',
    level: 'Beginner'
  },
  {
    id: 'medical-lab-tech',
    title: 'Medical Lab Technician Assistant Program',
    provider: 'National Healthcare Institute',
    category: 'vocational',
    duration: '8 Weeks',
    modules: 6,
    rating: 4.8,
    shortDesc: 'Get prepared for diagnostic lab roles. Learn blood collection procedures (phlebotomy), slide preparation, and microscope operations.',
    skillsAcquired: ['Phlebotomy Blood Drawing', 'Slide Preparation', 'Medical Sanitization', 'Report Records'],
    enrolled: false,
    syllabus: [
      'Human Anatomy & Blood Component Basics',
      'Phlebotomy Training: Safe Blood Draw, Tube Colors, & Labeling',
      'Preparing Blood Smears and Conducting Basic Centrifuge Operations',
      'Sanitizing Labs, Safe Disposal of Bio-Hazardous Waste (BMWM Rules)',
      'Recording Lab Findings & Entering Patient Data into Diagnostic Software'
    ],
    price: '₹499',
    instructor: 'Dr. Smruti Rekha Das (Pathologist)',
    level: 'Beginner'
  },
  {
    id: 'drone-piloting',
    title: 'Drone Piloting, Mapping & Agri-Spraying',
    provider: 'Aviation Technologies Center',
    category: 'vocational',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.9,
    shortDesc: 'High-paying modern trade. Learn drone flight controls, agricultural crop-spraying patterns, and multispectral camera operations.',
    skillsAcquired: ['Drone Flight Controls', 'Agricultural Spraying', 'Flight Plan Design', 'DGCA Guidelines'],
    enrolled: false,
    syllabus: [
      'Understanding Aerodynamics & Drone Hardware Component Blocks',
      'Designing Autonomous Flight Plans with GPS Waypoints',
      'Configuring Nozzle Flows for Efficient Agricultural Fertilizer Spraying',
      'DGCA Laws, Airspace Zone Maps (Red/Yellow/Green), & Digital Sky Rules'
    ],
    price: '₹899',
    instructor: 'Wing Commander Subodh Kumar (Retired IAF Pilot)',
    level: 'Intermediate'
  },
  {
    id: 'commercial-plumbing',
    title: 'Commercial Plumbing & Water Flow Engineering',
    provider: 'Heavy Industries Training Center',
    category: 'vocational',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.6,
    shortDesc: 'Learn sanitary piping blueprints, PVC solvent bonding, drainage slopes, water pump pressure fittings, and water heater repairs.',
    skillsAcquired: ['PVC Solvent Bonding', 'Water Pressure Pumps', 'Drainage Plumbing', 'Blueprint Pipe Plans'],
    enrolled: false,
    syllabus: [
      'Reading Sanitary Layout Blueprints & Standard Symbol Keys',
      'PVC, CPVC, and GI Pipe Jointing: Threading, Heat Welding, & Solvents',
      'Installing Overhead Tanks, Booster Pumps, and Pressure Regulators',
      'Troubleshooting Blocked Drain Lines, Traps, and Toilet Flush Tanks'
    ],
    price: '₹299',
    instructor: 'Maheswar Behera (Senior Maintenance Engineer)',
    level: 'Beginner'
  },
  {
    id: 'industrial-wiring',
    title: 'Electrician & Industrial Wiring Certification',
    provider: 'Heavy Industries Training Center',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.7,
    shortDesc: 'Learn domestic and industrial electrical wiring. Master main board distribution wiring, MCB sizing, earthing pits, and inverter wiring.',
    skillsAcquired: ['Distribution Board Wiring', 'MCB Sizing', 'Copper Earthing Pit', 'Inverter Battery Backup'],
    enrolled: false,
    syllabus: [
      'Electrical Safety Protocols: Using Insulated Tools, Gloves, and Testers',
      'Single-Phase vs Three-Phase Wiring Layouts & Color Codes',
      'Sizing Copper Cables, MCBs, ELCBs, and Main Switches',
      'Constructing a Safe Plate Earthing Pit & Testing Leakage Resistance',
      'Installing Home Inverters, Solar Panel Connections, and Fault Analysis'
    ],
    price: '₹399',
    instructor: 'Yashwant Rao (Chief Electrical Auditor)',
    level: 'Beginner'
  },
  {
    id: 'first-aid-assistant',
    title: 'Medical Assistant & First-Aid Nursing Essentials',
    provider: 'National Healthcare Institute',
    category: 'vocational',
    duration: '6 Weeks',
    modules: 5,
    rating: 4.8,
    shortDesc: 'Understand clinical assistant procedures, measuring vital signs (BP, SpO2), dressing wounds, CPR, and elder patient care.',
    skillsAcquired: ['Measuring Vitals', 'CPR Administration', 'Wound Dressings', 'Patient Grooming'],
    enrolled: false,
    syllabus: [
      'Roles & Professional Code of Conduct of a Ward/Clinic Assistant',
      'Measuring and Recording Blood Pressure, Heart Rate, SpO2, & Temperature',
      'Performing Cardiopulmonary Resuscitation (CPR) & Managing Choking',
      'Sterile Techniques: Cleaning, Dressing, & Bandaging Cuts and Burns',
      'Assisting Geriatric/Elderly Patients with Mobility and Daily Hydration'
    ],
    price: '₹349',
    instructor: 'Sister Mary Joseph (Nursing Superintendent)',
    level: 'Beginner'
  },
  {
    id: 'hotel-frontdesk',
    title: 'Hospitality & Hotel Front Desk Management',
    provider: 'Hotel Association Academy',
    category: 'vocational',
    duration: '4 Weeks',
    modules: 4,
    rating: 4.6,
    shortDesc: 'Build a high-profile guest management career. Learn check-in software, billing registers, guest relations, and telephone communication.',
    skillsAcquired: ['Check-in Software', 'Telephone Etiquettes', 'Guest Billing Registers', 'Crisis Escalations'],
    enrolled: false,
    syllabus: [
      'Guest Lifecycle: Pre-Arrival, Check-In, Active Stay, & Express Checkout',
      'Professional Speaking Skills & Telephone Switchboard Etiquettes',
      'Using Modern Property Management Systems (PMS) for Room Booking',
      'Reconciling Cash Registers, Room Service Charges, & Card Invoicing'
    ],
    price: '₹299',
    instructor: 'Siddharth Sahoo (Front Office Director)',
    level: 'Beginner'
  }
].map(course => {
  const cleanPrice = course.price.replace('/mo', '');
  const fullPrice = cleanPrice === '₹299' ? '₹2,999' :
                    cleanPrice === '₹349' ? '₹3,499' :
                    cleanPrice === '₹399' ? '₹3,999' :
                    cleanPrice === '₹449' ? '₹4,499' :
                    cleanPrice === '₹499' ? '₹4,999' :
                    cleanPrice === '₹599' ? '₹5,999' :
                    cleanPrice === '₹649' ? '₹6,499' :
                    cleanPrice === '₹699' ? '₹6,999' :
                    cleanPrice === '₹749' ? '₹7,499' :
                    cleanPrice === '₹799' ? '₹7,999' :
                    cleanPrice === '₹849' ? '₹8,499' :
                    cleanPrice === '₹899' ? '₹8,999' : '₹9,999';
  return {
    ...course,
    price: `${fullPrice}/mo`
  } as Course;
});

