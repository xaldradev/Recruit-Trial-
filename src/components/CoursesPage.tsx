import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  Award, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  User, 
  Layers, 
  ShieldCheck, 
  X, 
  CreditCard,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  BookOpenCheck,
  BrainCircuit,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingUp,
  AwardIcon,
  Flame,
  Check,
  Send,
  Lock,
  Search,
  History,
  Trash2
} from 'lucide-react';
import { initialCourses, Course } from '../data/coursesData';
import ArohiAvatar from './ArohiAvatar';

// Interactive Lesson Content Generator for Integrated Classroom Experience
function getModuleContent(courseId: string, topicName: string, index: number) {
  // Base tech specific
  const isTech = courseId.includes('js') || courseId.includes('react') || courseId.includes('flutter') || courseId.includes('python') || courseId.includes('aws') || courseId.includes('cyber') || courseId.includes('ai') || courseId.includes('cloud') || courseId.includes('sql');
  const isBusiness = courseId.includes('finance') || courseId.includes('mudra') || courseId.includes('gst') || courseId.includes('retail') || courseId.includes('accounting') || courseId.includes('biz') || courseId.includes('management') || courseId.includes('sales');

  let overview = `Welcome to Unit ${index + 1}: ${topicName}. In this interactive module, we focus on modular structures, standard lifecycle guidelines, correct parameters, and compliance audits.`;
  let keyPoints = [
    "Understanding core concepts prevents rendering or system operation failures.",
    "Always run sandbox tests in simulated staging workspaces before final sign-off.",
    "Verify safety measures or structural parameters regularly."
  ];
  let checklist = [
    "Setup workspace environment and review key definitions",
    "Run practical simulated laboratory exercises",
    "Complete module micro-assessment test"
  ];
  let quiz = {
    question: "What is the primary operational focus of this module?",
    options: [
      "Maximizing efficiency and compliance using industry-standard guidelines",
      "Avoiding manual labor completely through automatic cloud scripts",
      "Developing basic prototype models without security configurations",
      "None of the above"
    ],
    answerIdx: 0,
    explanation: "Standard industrial frameworks prioritize structural efficiency and compliance to scale operations safely."
  };

  // Tech Challenges
  let techChallenge = {
    instructions: `Write a clean TypeScript script or configuration block for "${topicName}". Complete the core module definition with parameters and export it properly.`,
    starterCode: `// Active Workspace: ${topicName}\n// Task: Declare a constant name 'isApproved' as true.\n\nconst isApproved = false;\nexport { isApproved };`,
    expectedKeywords: ["isApproved", "true"],
    successMsg: `TypeScript modules for "${topicName}" compiled cleanly with zero warnings.`
  };

  // Business Tasks
  let businessTask = {
    instructions: `Balance your MSME account books for "${topicName}". Ensure your operating profit margins are sufficient to unlock collateral-free bank funding (minimum ₹50,000 profit required).`,
    targetInflow: 120000,
    targetProfit: 50000,
    ledgerItemName: topicName
  };

  // Vocational Labs
  let vocationalLab = {
    instructions: `Safety check: Calibrate testing instruments for "${topicName}". Measure the ground-resistance using a Multimeter set to the Ω (Resistance) dial.`,
    correctTool: 'multimeter',
    correctNode: 'ground-resistance',
    correctDial: 'resistance',
    expectedVal: '0.18 Ohms (SAFE)',
    okLogs: [
      '[Auditing] Inspecting ground connection terminal rods...',
      '[Reading] Multimeter probes connected securely.'
    ]
  };

  // Customizing based on topics
  if (isTech) {
    overview = `Welcome to Unit ${index + 1}: ${topicName}. In this technical classroom lecture, we dissect modular syntax, component declarations, parameters handling, and security protocols. Mastering these guidelines is crucial to building robust, modern software systems.`;
    keyPoints = [
      "Modular components isolate layout failures and optimize render workloads.",
      "Strict type assertions contract clean data structures without run-time crashes.",
      "Hidden keys must be proxied via server-side APIs to prevent security exploits."
    ];
    checklist = [
      "Verify code structure against standard TypeScript rules",
      "Write actual component code inside the live coding sandbox",
      "Pass the interactive compiler unit test assertions"
    ];

    // Specific tech challenges
    if (topicName.toLowerCase().includes('html') || topicName.toLowerCase().includes('tailwind') || topicName.toLowerCase().includes('css')) {
      techChallenge = {
        instructions: `Complete the Tailwind CSS structural container layout. Set the display utility to flex and center-align the items with responsive padding of 6 units.`,
        starterCode: `// Tailwind CSS Component Sandbox\nimport React from 'react';\n\nexport function CardContainer() {\n  return (\n    <div className="/* TODO: Add flex, items-center, p-6 */">\n      <h3 className="text-sm font-bold text-slate-100">Lab Title</h3>\n    </div>\n  );\n}`,
        expectedKeywords: ["flex", "items-center", "p-6"],
        successMsg: "Tailwind layout compiled! Alignment properties centered cleanly."
      };
      quiz = {
        question: "Which Tailwind utility class applies a flexbox layout to an element?",
        options: ["block", "grid", "flex", "inline-block"],
        answerIdx: 2,
        explanation: "The 'flex' utility class applies a flexible box layout model to center, align, and wrap items seamlessly."
      };
    } else if (topicName.toLowerCase().includes('typescript') || topicName.toLowerCase().includes('type')) {
      techChallenge = {
        instructions: `Define an interface contract named 'Candidate' with a read-only string parameter named 'id' and a string parameter named 'name'.`,
        starterCode: `// TypeScript Interface Sandbox\n\n// TODO: Complete the Candidate interface below\ninterface Candidate {\n  readonly id: string;\n  name: string;\n}`,
        expectedKeywords: ["readonly id", "name", "string"],
        successMsg: "TypeScript compiler checked interface. Strict type safety validated!"
      };
      quiz = {
        question: "What is the advantage of using 'readonly' keyword on a TypeScript property?",
        options: [
          "It makes the property invisible to other components",
          "It prevents reassignment after initial instantiation",
          "It compiles the property to static HTML tags",
          "It removes the variable entirely at run-time"
        ],
        answerIdx: 1,
        explanation: "Properties flagged with 'readonly' can only be set during initialization and cannot be mutated afterwards, preserving pure structures."
      };
    } else if (topicName.toLowerCase().includes('react') || topicName.toLowerCase().includes('hook') || topicName.toLowerCase().includes('state')) {
      techChallenge = {
        instructions: `Declare a React state count variable and updater function named 'count' and 'setCount' using the useState hook, initializing it to 0.`,
        starterCode: `// React State Hook Sandbox\nimport React, { useState } from 'react';\n\nexport function Clicker() {\n  // TODO: Declare 'count' and 'setCount' hook here\n  \n  return (\n    <p>Clicks: {count}</p>\n  );\n}`,
        expectedKeywords: ["useState(0)", "count", "setCount"],
        successMsg: "React hook compiled! Component re-renders are successfully optimized."
      };
      quiz = {
        question: "What must you avoid to prevent infinite render loops inside React functional components?",
        options: [
          "Calling useState updaters directly inside the component render body",
          "Writing sub-functions inside the main component",
          "Utilizing external libraries",
          "Declaring helper variables above the export line"
        ],
        answerIdx: 0,
        explanation: "Updating state directly in the component body schedules another render immediately, leading to an infinite recursive loop."
      };
    } else if (topicName.toLowerCase().includes('express') || topicName.toLowerCase().includes('api') || topicName.toLowerCase().includes('route')) {
      techChallenge = {
        instructions: `Create an Express GET route handler on path '/api/health' that returns a JSON payload: { status: "ok" }.`,
        starterCode: `// Express REST API Sandbox\nimport express from 'express';\nconst app = express();\n\n// TODO: Add app.get route for '/api/health' returning status ok\n`,
        expectedKeywords: ["app.get", "'/api/health'", "res.json", "status:", "ok"],
        successMsg: "Express route mounted! Port 3000 mapping is ready for telemetry checks."
      };
      quiz = {
        question: "Which Express response method is preferred for returning data models to API clients?",
        options: ["res.send()", "res.write()", "res.json()", "res.redirect()"],
        answerIdx: 2,
        explanation: "res.json() automatically formats the passed models to JSON strings and sets the correct application/json headers."
      };
    } else {
      techChallenge = {
        instructions: `Write a standard export module returning a strict check value named 'systemOk' as true.`,
        starterCode: `// General Software Sandbox\nexport function checkSystem() {\n  // TODO: Declare systemOk constant as true and return it\n  \n}`,
        expectedKeywords: ["systemOk", "true", "return"],
        successMsg: "Test completed successfully! Sandbox code compiles."
      };
    }
  } else if (isBusiness) {
    overview = `Welcome to Unit ${index + 1}: ${topicName}. This MSME vocational session covers trade registration portals, legal forms, commercial ledgers, cash flows, and GST audit filings. Mastering these financial foundations prevents operating bottlenecks in small local enterprises.`;
    keyPoints = [
      "Maintaining an accurate general ledger prevents tax penalties during government audits.",
      "GST HSN classifications determine direct rate liability and input tax credit claims.",
      "Collateral-free Mudra financing requires a viable, high debt-service coverage ratio."
    ];
    checklist = [
      "Review official central portal registration requirements",
      "Build a balanced operating ledger inside our MSME worksheet",
      "Pass the business compliance micro-assessment quiz"
    ];

    if (topicName.toLowerCase().includes('udyam') || topicName.toLowerCase().includes('register')) {
      businessTask = {
        instructions: `Calculate the financial project plan for Udyam MSME eligibility. Input monthly revenues of at least ₹1,50,000 and operating costs under ₹1,00,000 to show positive credit standing.`,
        targetInflow: 150000,
        targetProfit: 50000,
        ledgerItemName: "Udyam Licensing & Filing Fee"
      };
      quiz = {
        question: "Which portal is the official, zero-fee gateway authorized by the Govt of India for MSME registration?",
        options: ["Startup India Portal", "GST Common Portal", "Udyam Registration Portal", "Mudra Scheme Portal"],
        answerIdx: 2,
        explanation: "The Udyam Registration Portal is the free, completely online, paperless single-window gateway for MSME classification."
      };
    } else if (topicName.toLowerCase().includes('gst') || topicName.toLowerCase().includes('tax') || topicName.toLowerCase().includes('filing')) {
      businessTask = {
        instructions: `Estimate GST tax returns. Enter business turnover revenues of ₹2,50,000 and operating costs of ₹1,20,000 to determine 18% HSN filing compliance.`,
        targetInflow: 250000,
        targetProfit: 100000,
        ledgerItemName: "HSN Code 18% Service Filings"
      };
      quiz = {
        question: "What is the threshold exemption limit of annual turnover for GST registration for service providers in India?",
        options: ["₹10 Lakhs", "₹20 Lakhs", "₹40 Lakhs", "₹75 Lakhs"],
        answerIdx: 1,
        explanation: "For service providers, GST registration is mandatory if annual aggregate turnover exceeds ₹20 Lakhs (₹10 Lakhs for special hill states)."
      };
    } else if (topicName.toLowerCase().includes('mudra') || topicName.toLowerCase().includes('loan') || topicName.toLowerCase().includes('cgtmse')) {
      businessTask = {
        instructions: `Test financial feasibility for Mudra credit approval. Input monthly inflow of ₹3,00,000 and costs of ₹1,80,000 (minimum profit target: ₹1,20,000) to ensure collateral-free approval.`,
        targetInflow: 300000,
        targetProfit: 120000,
        ledgerItemName: "Mudra Loan Feasibility Ledger"
      };
      quiz = {
        question: "Under the PM Mudra Scheme, what is the maximum loan limit available under the 'Kishor' category?",
        options: ["Up to ₹50,000", "From ₹50,000 up to ₹5 Lakhs", "From ₹5 Lakhs up to ₹10 Lakhs", "Up to ₹20 Lakhs"],
        answerIdx: 1,
        explanation: "The Kishor category covers loans above ₹50,000 and up to ₹5 Lakhs to support small businesses that require starting capital."
      };
    } else {
      businessTask = {
        instructions: `Simulate cashflow. Put starting monthly revenue of ₹1,20,000 and expenses under ₹70,000 to generate compliance margin.`,
        targetInflow: 120000,
        targetProfit: 50000,
        ledgerItemName: "Operating Cash Balance Sheet"
      };
    }
  } else {
    // Vocational & Trades
    overview = `Welcome to Unit ${index + 1}: ${topicName}. This field lecture reviews wiring schematics, testing protocols, digital measurement tools, and personal protective guidelines. Safety is our absolute highest priority.`;
    keyPoints = [
      "Always shut down power grids and test ground resistances before conducting physical repairs.",
      "Calibrate digital multimeter dials to correct settings to prevent equipment damage.",
      "Maintain tidy field service logs to comply with ISO workshop guidelines."
    ];
    checklist = [
      "Verify safety equipment, insulated gloves, and goggles are active",
      "Perform wiring resistance telemetry scans in our Diagnostic schematic lab",
      "Submit the unit safety and diagnostic micro-assessment quiz"
    ];

    if (topicName.toLowerCase().includes('solar') || topicName.toLowerCase().includes('photovoltaic') || topicName.toLowerCase().includes('inverter')) {
      vocationalLab = {
        instructions: `Solar Panel Calibration: Test the solar panel power inverter feedback line. Set your tool to Multimeter, choose the dial for Voltage, target 'inverter-controller', and run scan.`,
        correctTool: 'multimeter',
        correctNode: 'inverter-controller',
        correctDial: 'voltage',
        expectedVal: '230V AC (STABLE) - Sine Frequency: 50.0Hz',
        okLogs: [
          '[Inspecting] Solar photovoltaic arrays are clean and facing south.',
          '[Reading] Inverter power output syncer is active.'
        ]
      };
      quiz = {
        question: "Which device is mandatory in solar grid installations to convert direct current (DC) to household alternating current (AC)?",
        options: ["Step-down Transformer", "Power Inverter", "Digital Rheostat", "Thermal Fuse Controller"],
        answerIdx: 1,
        explanation: "Solar panels generate DC power, which must pass through a Power Inverter to convert it to standard utility AC power."
      };
    } else if (topicName.toLowerCase().includes('drone') || topicName.toLowerCase().includes('sensor') || topicName.toLowerCase().includes('calibration')) {
      vocationalLab = {
        instructions: `Drone Avionics Lab: Verify the gyroscope and accelerometer sensor nodes. Choose the Thermal Scanner tool, target 'sensor-array', dial set to Temperature, and scan.`,
        correctTool: 'thermal',
        correctNode: 'sensor-array',
        correctDial: 'temperature',
        expectedVal: '34.2 °C (NOMINAL) - Gyro scope axis: aligned',
        okLogs: [
          '[Calibrating] Booting drone flight controller firmware...',
          '[Reading] Accelerometer telemetry stream syncer online.'
        ]
      };
      quiz = {
        question: "What is the primary function of an ESC (Electronic Speed Controller) in a quadcopter drone?",
        options: [
          "To transmit live video signals to the ground team",
          "To regulate motor RPMs based on flight controller instructions",
          "To measure wind speed and barometer pressure",
          "To lock GPS coordinates before landing"
        ],
        answerIdx: 1,
        explanation: "ESCs interpret flight controller signals to regulate individual motor speeds dynamically, maintaining stability."
      };
    } else if (topicName.toLowerCase().includes('battery') || topicName.toLowerCase().includes('ev') || topicName.toLowerCase().includes('circuit')) {
      vocationalLab = {
        instructions: `EV Battery Diagnostic: Conduct safety scan on Battery Cell Block #4. Use the Thermal Scanner, dial set to Temperature, target 'battery-cells', and run scan.`,
        correctTool: 'thermal',
        correctNode: 'battery-cells',
        correctDial: 'temperature',
        expectedVal: '28.5 °C (NOMINAL) - Cell balance: 3.75V',
        okLogs: [
          '[Safety Audit] Evacuating residual current discharges...',
          '[Reading] High-resolution thermal scanner aligned.'
        ]
      };
      quiz = {
        question: "What failure state occurs when an EV lithium-ion battery cell overheats rapidly, triggering neighboring cells to ignite?",
        options: ["Coulombic Leakage", "Thermal Runaway", "Ohmic Saturation", "Galvanic Corrosion"],
        answerIdx: 1,
        explanation: "Thermal Runaway is a high-temperature chain-reaction loop that can destroy battery packs if thermal dissipaters fail."
      };
    } else {
      vocationalLab = {
        instructions: `Standard Safety Audit: Test wire resistance on terminal ground nodes. Use the Multimeter set to the Resistance dial, target 'ground-resistance', and scan.`,
        correctTool: 'multimeter',
        correctNode: 'ground-resistance',
        correctDial: 'resistance',
        expectedVal: '0.14 Ohms (SAFE)',
        okLogs: [
          '[Auditing] Testing probe secured to ground terminal connector.',
          '[Reading] Resistance readout established.'
        ]
      };
    }
  }

  return {
    overview,
    keyPoints,
    checklist,
    quiz,
    techChallenge,
    businessTask,
    vocationalLab
  };
}

function renderMarkdown(content: string) {
  // Helper to parse inline styles: **bold**, *italic*, `code`
  const parseInline = (text: string): React.ReactNode[] => {
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
    const pieces = text.split(regex);
    
    return pieces.map((piece, idx) => {
      if (piece.startsWith('**') && piece.endsWith('**')) {
        return <strong key={idx} className="font-extrabold text-[#c084fc]">{piece.slice(2, -2)}</strong>;
      } else if (piece.startsWith('*') && piece.endsWith('*')) {
        return <em key={idx} className="italic text-slate-200">{piece.slice(1, -1)}</em>;
      } else if (piece.startsWith('`') && piece.endsWith('`')) {
        return <code key={idx} className="bg-slate-950/60 px-1.5 py-0.5 rounded text-xs font-mono text-emerald-400 border border-slate-800">{piece.slice(1, -1)}</code>;
      }
      return piece;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const pushList = (key: number) => {
    if (currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`ul-${key}`} className="list-disc pl-5 my-2 space-y-1 text-slate-200">
            {...currentList}
          </ul>
        );
      } else if (listType === 'ol') {
        elements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-5 my-2 space-y-1 text-slate-200">
            {...currentList}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (listType !== 'ul') {
        pushList(idx);
        listType = 'ul';
      }
      currentList.push(
        <li key={idx} className="leading-relaxed">
          {parseInline(trimmed.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (listType !== 'ol') {
        pushList(idx);
        listType = 'ol';
      }
      const match = trimmed.match(/^\d+\.\s(.*)/);
      const content = match ? match[1] : trimmed;
      currentList.push(
        <li key={idx} className="leading-relaxed">
          {parseInline(content)}
        </li>
      );
    } else {
      pushList(idx);
      if (trimmed) {
        elements.push(
          <p key={idx} className="my-1.5 leading-relaxed">
            {parseInline(line)}
          </p>
        );
      } else {
        elements.push(<div key={idx} className="h-2" />);
      }
    }
  });

  pushList(lines.length);
  return <div className="space-y-1">{elements}</div>;
}

export default function CoursesPage() {
  const { user, userData, updateCareerProgress } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDashboard, setShowDashboard] = useState<boolean>(true);
  const [hoveredChartDay, setHoveredChartDay] = useState<number | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    const saved = localStorage.getItem('recruit_enrolled_courses');
    return saved ? JSON.parse(saved) : [];
  });


  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [candidateName, setCandidateName] = useState('Rajesh Kumar Singh');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('recruit_course_search_history');
    return saved ? JSON.parse(saved) : ['Drone', 'Welding', 'Udyam MSME', 'Aptitude', 'Accounting'];
  });

  const addToSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8); // Keep up to 8 unique search items
      localStorage.setItem('recruit_course_search_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('recruit_course_search_history');
  };

  // Integrated Classroom State variables
  const [activeLearningCourse, setActiveLearningCourse] = useState<Course | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [completedModules, setCompletedModules] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('recruit_completed_modules');
    return saved ? JSON.parse(saved) : {};
  });
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('recruit_checked_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  const [classroomTab, setClassroomTab] = useState<'lecture' | 'sandbox' | 'quiz'>('lecture');
  
  // Audio guidance overlay simulations
  const [isAudioLecturePlaying, setIsAudioLecturePlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);

  // Technical Sandbox Sandbox states
  const [editorCode, setEditorCode] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [techTaskPassed, setTechTaskPassed] = useState<boolean>(false);

  // Business Sandbox states
  const [bizName, setBizName] = useState<string>('Om MSME Enterprises');
  const [bizInflow, setBizInflow] = useState<string>('240000');
  const [bizOutflow, setBizOutflow] = useState<string>('115000');
  const [bizTaxScheme, setBizTaxScheme] = useState<string>('GST-Composition');
  const [bizLedgerResult, setBizLedgerResult] = useState<any>(null);

  // Vocational Sandbox states
  const [vocationalTool, setVocationalTool] = useState<string>('multimeter');
  const [vocationalNode, setVocationalNode] = useState<string>('ground-resistance');
  const [vocationalDials, setVocationalDials] = useState<string>('resistance');
  const [vocationalConsole, setVocationalConsole] = useState<string[]>(['[System] Diagnostic hardware simulator online. Ready to scan hardware circuitry.']);

  // Quiz States
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizIsCorrect, setQuizIsCorrect] = useState<boolean>(false);

  // Earned Certificates
  const [earnedCertificates, setEarnedCertificates] = useState<string[]>(() => {
    const saved = localStorage.getItem('recruit_earned_certificates');
    return saved ? JSON.parse(saved) : [];
  });

  // Show customized Certificate of Completion
  const [showCertificateId, setShowCertificateId] = useState<string | null>(null);

  // Scroll to top of window whenever a course is selected or the active learning player is loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedCourse, activeLearningCourse]);

  // Live AI Tutor Companion chat inside learning player
  const [tutorMessages, setTutorMessages] = useState<Array<{ id: string; sender: 'user' | 'tutor'; text: string }>>([]);
  const [tutorInput, setTutorInput] = useState('');
  const [tutorIsLoading, setTutorIsLoading] = useState(false);

  // Auto-Launch Celebration & Interstitial Animation states
  const [isAutoLaunching, setIsAutoLaunching] = useState<boolean>(false);
  const [launchProgress, setLaunchProgress] = useState<number>(0);
  const [launchStepText, setLaunchStepText] = useState<string>('Authorizing Secure UPI Session...');
  const [launchedCourseObj, setLaunchedCourseObj] = useState<Course | null>(null);
  const [wasAutoLaunched, setWasAutoLaunched] = useState<boolean>(false);
  const [isCoursesExpanded, setIsCoursesExpanded] = useState<boolean>(false);

  // Synchronize with Firebase Firestore in real time if user is authenticated
  useEffect(() => {
    if (user && userData) {
      if (userData.enrolledCourses) setEnrolledCourses(userData.enrolledCourses);
      if (userData.completedModules) setCompletedModules(userData.completedModules);
      if (userData.checkedChecklist) setCheckedChecklistItems(userData.checkedChecklist);
      if (userData.earnedCertificates) setEarnedCertificates(userData.earnedCertificates);
    }
  }, [user, userData]);

  // Persist enrolled courses
  const handleEnroll = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      const updated = [...enrolledCourses, courseId];
      setEnrolledCourses(updated);
      if (user) {
        updateCareerProgress({ enrolledCourses: updated }).catch(err => console.error("Firebase enroll sync error:", err));
      } else {
        localStorage.setItem('recruit_enrolled_courses', JSON.stringify(updated));
      }
    }
  };

  const handleAuthorizePaymentAndAutoLaunch = (course: Course) => {
    // 1. Enroll the course
    handleEnroll(course.id);
    
    // 2. Open full-screen auto-launch loader
    setIsAutoLaunching(true);
    setLaunchProgress(0);
    setLaunchStepText('Establishing Secure UPI Bank Connection...');
    setLaunchedCourseObj(course);
    
    // 3. Incrementally animate progress and step description
    let currentProg = 0;
    const interval = setInterval(() => {
      currentProg += 5;
      if (currentProg >= 100) {
        clearInterval(interval);
        setLaunchProgress(100);
        setLaunchStepText('Ecosystem Synced! Launching Player Workspace...');
        
        setTimeout(() => {
          setIsAutoLaunching(false);
          setSelectedCourse(null);
          setIsCheckoutOpen(false);
          setWasAutoLaunched(true);
          
          // Seamlessly switch directly to the active learning player!
          setActiveLearningCourse(course);
          setActiveModuleIndex(0);
          setSelectedQuizOption(null);
          setQuizSubmitted(false);
          setClassroomTab('lecture');
          setIsAudioLecturePlaying(false);
          setAudioProgress(0);
          setTechTaskPassed(false);

          // Populate starter code if it is a tech course
          const firstTopic = course.syllabus[0];
          const content = getModuleContent(course.id, firstTopic, 0);
          if (course.category === 'tech' && content.techChallenge) {
            setEditorCode(content.techChallenge.starterCode);
            setConsoleLogs(['[System] Compiler workspace loaded. Write code below and click Execute.']);
          } else {
            setEditorCode('');
            setConsoleLogs([]);
          }
          setBizLedgerResult(null);
        }, 500);
      } else {
        setLaunchProgress(currentProg);
        if (currentProg < 25) {
          setLaunchStepText('Validating transaction token with National Payments Gateway...');
        } else if (currentProg < 50) {
          setLaunchStepText('Payment Authorized! Syncing Academic Registry...');
        } else if (currentProg < 75) {
          setLaunchStepText('Generating ISO Verification Keys...');
        } else {
          setLaunchStepText('Calibrating Arohi AI Live Mentorship module...');
        }
      }
    }, 100);
  };

  const handleUnenroll = (courseId: string) => {
    const updated = enrolledCourses.filter(id => id !== courseId);
    setEnrolledCourses(updated);
    if (user) {
      updateCareerProgress({ enrolledCourses: updated }).catch(err => console.error("Firebase unenroll sync error:", err));
    } else {
      localStorage.setItem('recruit_enrolled_courses', JSON.stringify(updated));
    }
    
    // Cleanup active learning if unenrolling
    if (activeLearningCourse?.id === courseId) {
      setActiveLearningCourse(null);
    }
  };

  // Complete a specific module topic
  const toggleModuleCompletion = (courseId: string, topicName: string) => {
    const currentCompleted = completedModules[courseId] || [];
    let updated: string[];
    if (currentCompleted.includes(topicName)) {
      updated = currentCompleted.filter(t => t !== topicName);
    } else {
      updated = [...currentCompleted, topicName];
    }
    const newCompleted = { ...completedModules, [courseId]: updated };
    setCompletedModules(newCompleted);
    if (user) {
      updateCareerProgress({ completedModules: newCompleted }).catch(err => console.error("Firebase modules sync error:", err));
    } else {
      localStorage.setItem('recruit_completed_modules', JSON.stringify(newCompleted));
    }
  };

  // Toggle a checklist item verified state
  const toggleChecklistItem = (courseId: string, topicName: string, itemIdx: number) => {
    const key = `${courseId}-${topicName}-${itemIdx}`;
    const updated = { ...checkedChecklistItems, [key]: !checkedChecklistItems[key] };
    setCheckedChecklistItems(updated);
    if (user) {
      updateCareerProgress({ checkedChecklist: updated }).catch(err => console.error("Firebase checklist sync error:", err));
    } else {
      localStorage.setItem('recruit_checked_checklist', JSON.stringify(updated));
    }
  };

  // Claim a certificate if all modules are completed
  const handleClaimCertificate = (courseId: string) => {
    if (!earnedCertificates.includes(courseId)) {
      const updated = [...earnedCertificates, courseId];
      setEarnedCertificates(updated);
      if (user) {
        updateCareerProgress({ earnedCertificates: updated }).catch(err => console.error("Firebase certificate sync error:", err));
      } else {
        localStorage.setItem('recruit_earned_certificates', JSON.stringify(updated));
      }
    }
    setShowCertificateId(courseId);
  };

  const pushTutorMessage = (text: string) => {
    setTutorMessages(prev => [
      ...prev,
      { id: `tutor-guided-${Date.now()}-${Math.random()}`, sender: 'tutor', text }
    ]);
  };

  const handleMilestoneMessage = (milestone: string, progress: number, currentModuleIdx: number) => {
    if (!activeLearningCourse) return;
    const currentTopic = activeLearningCourse.syllabus[currentModuleIdx];
    const activeContent = getModuleContent(activeLearningCourse.id, currentTopic, currentModuleIdx);

    let message = '';
    switch (milestone) {
      case 'intro':
        message = `📚 **Unit ${currentModuleIdx + 1} - AI Guided Study Starting!**\n\nLet us dive into the core details of **"${currentTopic}"**. As your personal trainer, I will guide you through this module step-by-step.\n\nFirst, take a look at the **Active Learning Canvas** where the chapter overview is loaded. It introduces our topics and prepares you for real-world scenarios. Read through the primary instructions before we proceed!`;
        break;
      case 'concepts':
        message = `💡 **Core Concept Breakdown (Progress: ${progress}%)**\n\nExcellent progress! We are now analyzing the theoretical pillars under **"Key Concepts Summary"**.\n\nTake note of these critical points:\n${activeContent.keyPoints.map(pt => `* **${pt}**`).join('\n')}\n\nUnderstanding these foundations replaces the need for a physical classroom trainer! Take 15 seconds to review them.`;
        break;
      case 'practical':
        message = `🛠️ **Practical Staging & Sandbox (Progress: ${progress}%)**\n\nMoving on to the **"Practical Sandbox Checklist"**! Active hands-on testing is crucial for professional exams in India.\n\nHere are our focus tasks:\n${activeContent.checklist.map(chk => `* ${chk}`).join('\n')}\n\nIn our workspace, we simulate these steps to ensure complete readiness. Try to think how you would execute each step in a real project environment.`;
        break;
      case 'assessment':
        message = `📝 **Tutor Coaching: Assessment Ready (Progress: ${progress}%)**\n\nWe have covered the syllabus details! Now, let us tackle the **"Module Micro-Assessment"** together.\n\n**Tutor Advice**: The quiz asks:\n*"${activeContent.quiz.question}"*\n\nReview the provided options carefully. Look for answers that emphasize standard industrial best practices, compliance, and maximum system integrity!`;
        break;
      case 'complete':
        message = `🎓 **Guided Lesson Complete!**\n\nI have finished explaining **"${currentTopic}"** in detail. You have successfully gone through all study phases!\n\n⏸️ *Auto-Pilot Mode has paused.* Now, it's your turn to prove your knowledge! \n\n**Action Required**: Click on the correct option in the **Module Micro-Assessment Quiz** below, and click **"Submit Answer"** to officially complete this unit and unlock the next lesson!`;
        break;
    }

    if (message) {
      pushTutorMessage(message);
    }
  };

  // Class audio guidance timeline simulator
  useEffect(() => {
    let interval: any = null;
    if (isAudioLecturePlaying) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsAudioLecturePlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isAudioLecturePlaying]);

  // Update Arohi Chat when switching classroom tabs to provide active mentorship guidance
  useEffect(() => {
    if (!activeLearningCourse) return;
    const currentTopic = activeLearningCourse.syllabus[activeModuleIndex];
    let mentorMessage = '';

    if (classroomTab === 'lecture') {
      mentorMessage = `📖 **Lecture Deck Loaded**: I have opened the theoretical outline for **"${currentTopic}"**. Read through the core operational guidelines and key concept definitions. You can click **"🔊 Play Audio Lecture"** above to listen to my voiceover podcast summary!`;
    } else if (classroomTab === 'sandbox') {
      const cat = activeLearningCourse.category;
      if (cat === 'tech') {
        mentorMessage = `💻 **Coding Sandbox Active**: Try writing the required script inside our online code editor. Once done, click **"Execute Script ⚡"** to run compiler unit tests. I will audit your code structure and syntax parameters in real-time!`;
      } else if (cat === 'business') {
        mentorMessage = `📊 **MSME Balance Sheet Builder**: I have initialized your micro-business ledger! Adjust the revenues and expenses, choose your filing tax scheme, and click **"Generate Audited Ledger Sheet"** to test structural financial compliance.`;
      } else {
        mentorMessage = `🛠️ **Vocational Schematic Desk**: Welcome to the hardware simulation workbench! Select your diagnostic probe, dial your testing meter, and target the specific circuit node to take high-voltage measurements safely.`;
      }
    } else if (classroomTab === 'quiz') {
      mentorMessage = `📝 **Chapter Quiz Ready**: Let's test your competency on **"${currentTopic}"**! Select the correct option below and submit. If you're unsure, feel free to switch back to the **Lecture** or **Sandbox Lab** to double-check!`;
    }

    if (mentorMessage) {
      setTutorMessages(prev => {
        // Only append if it doesn't already end with a similar message type
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.text.includes(classroomTab)) return prev;
        return [
          ...prev,
          { id: `tutor-tab-shift-${Date.now()}`, sender: 'tutor', text: mentorMessage }
        ];
      });
    }
  }, [classroomTab, activeModuleIndex, activeLearningCourse]);

  // Handle module click inside player
  const handleSelectModule = (index: number) => {
    setActiveModuleIndex(index);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setClassroomTab('lecture');
    setIsAudioLecturePlaying(false);
    setAudioProgress(0);
    setTechTaskPassed(false);
    setBizLedgerResult(null);

    // Initialize sandbox challenge code/data for this unit
    if (activeLearningCourse) {
      const topic = activeLearningCourse.syllabus[index];
      const content = getModuleContent(activeLearningCourse.id, topic, index);
      if (activeLearningCourse.category === 'tech' && content.techChallenge) {
        setEditorCode(content.techChallenge.starterCode);
        setConsoleLogs(['[System] Compiler workspace loaded. Write code below and click Execute.']);
      } else if (activeLearningCourse.category === 'vocational' && content.vocationalLab) {
        setVocationalTool('multimeter');
        setVocationalNode('ground-resistance');
        setVocationalDials('resistance');
        setVocationalConsole(['[System] Diagnostic hardware simulator online. Ready to scan hardware circuitry.']);
      }
    }
  };

  // Submit assessment quiz
  const handleQuizSubmit = (correctAnswerIdx: number) => {
    if (selectedQuizOption === null) return;
    setQuizSubmitted(true);
    const correct = selectedQuizOption === correctAnswerIdx;
    setQuizIsCorrect(correct);

    if (correct && activeLearningCourse) {
      const currentTopic = activeLearningCourse.syllabus[activeModuleIndex];
      const currentCompleted = completedModules[activeLearningCourse.id] || [];
      if (!currentCompleted.includes(currentTopic)) {
        toggleModuleCompletion(activeLearningCourse.id, currentTopic);
      }
    }
  };

  // Execute coding script challenge
  const handleExecuteTechCode = (expectedKeywords: string[], successMsg: string) => {
    setConsoleLogs(prev => [...prev, '[Compiling] Verifying code syntax against TypeScript guidelines...', '[Testing] Running mock assertion tests...']);
    setTimeout(() => {
      const codeLower = editorCode.toLowerCase();
      const allPassed = expectedKeywords.every(keyword => codeLower.includes(keyword.toLowerCase()));

      if (allPassed) {
        setConsoleLogs(prev => [
          ...prev,
          `[Success] Test assertions passed!`,
          `[System] ${successMsg}`,
          `[System] Checklist verification: Completed!`
        ]);
        setTechTaskPassed(true);
        // Also mark checklist item completed automatically
        const itemKey = `${activeLearningCourse?.id}-${activeLearningCourse?.syllabus[activeModuleIndex]}-2`;
        setCheckedChecklistItems(prev => ({ ...prev, [itemKey]: true }));
        handleSendTutorMessage(`Hi Arohi! I've successfully completed the coding challenge for "${activeLearningCourse?.syllabus[activeModuleIndex]}". The compiler output reports 100% success!`);
      } else {
        setConsoleLogs(prev => [
          ...prev,
          `[Error] Compilation failed! Missing key structural definitions: ${expectedKeywords.filter(k => !codeLower.includes(k.toLowerCase())).join(', ')}.`,
          `[System] Please refine your implementation and try again.`
        ]);
        setTechTaskPassed(false);
      }
    }, 1000);
  };

  // Generate MSME business ledger sheet
  const handleGenerateBusinessLedger = (targetInflow: number, targetProfit: number, itemName: string) => {
    const rev = parseFloat(bizInflow) || 0;
    const cost = parseFloat(bizOutflow) || 0;
    const profit = rev - cost;
    const margin = rev > 0 ? Math.round((profit / rev) * 100) : 0;
    const isOk = rev >= targetInflow && profit >= targetProfit;

    const result = {
      ledgerNo: `LGR-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      revenue: rev,
      costs: cost,
      profit,
      margin,
      isOk,
      feedback: isOk
        ? `✓ Compliant! Net profit of ₹${profit.toLocaleString()} meets criteria for collateral-free MSME bank credit lines.`
        : `✗ Warning: Capital margins are below target benchmarks (Target Profit: ₹${targetProfit.toLocaleString()}). Audit flag raised.`
    };

    setBizLedgerResult(result);
    if (isOk) {
      const itemKey = `${activeLearningCourse?.id}-${activeLearningCourse?.syllabus[activeModuleIndex]}-1`;
      setCheckedChecklistItems(prev => ({ ...prev, [itemKey]: true }));
      handleSendTutorMessage(`Hi Arohi! I've audited the ledger balance sheet for "${activeLearningCourse?.syllabus[activeModuleIndex]}". Operating profit is ₹${profit.toLocaleString()}, satisfying MSME compliance parameters!`);
    }
  };

  // Execute vocational hardware diagnostic probe
  const handleExecuteVocationalDiagnostic = (correctTool: string, correctNode: string, correctDial: string, expectedVal: string, okLogs: string[]) => {
    setVocationalConsole(prev => [...prev, `[Calibrating] Initializing diagnostics on node: ${vocationalNode}...`, `[Diagnosing] Aligning instrument probe using ${vocationalTool}...`]);
    
    setTimeout(() => {
      // Check for node safety scan matches
      const isCorrect = vocationalTool === correctTool && (vocationalNode === correctNode || correctNode === 'ground-resistance') && vocationalDials === correctDial;

      if (isCorrect) {
        setVocationalConsole(prev => [
          ...prev,
          ...okLogs,
          `[Success] Telemetry lock established! Reading: ${expectedVal}`,
          `[System] Circuit integrity: SECURE & NOMINAL ✓`
        ]);
        const itemKey = `${activeLearningCourse?.id}-${activeLearningCourse?.syllabus[activeModuleIndex]}-1`;
        setCheckedChecklistItems(prev => ({ ...prev, [itemKey]: true }));
        handleSendTutorMessage(`Hi Arohi! I ran live diagnostic checks on the circuit at "${vocationalNode}" node. Reading is stable at ${expectedVal}!`);
      } else {
        setVocationalConsole(prev => [
          ...prev,
          `[Telemetry Failure] Out of boundary bounds detected. Check tool selections or dial calibration settings.`,
          `[System] Target expected: ${correctTool.toUpperCase()} on node ${correctNode.toUpperCase()} with dial ${correctDial.toUpperCase()}.`
        ]);
      }
    }, 1000);
  };

  // Send a message to the AI Study Tutor Companion
  const handleSendTutorMessage = (presetText?: string) => {
    const textToSend = presetText || tutorInput;
    if (!textToSend.trim() || !activeLearningCourse) return;

    const userMsg = { id: `u-${Date.now()}`, sender: 'user' as const, text: textToSend };
    setTutorMessages(prev => [...prev, userMsg]);
    setTutorInput('');
    setTutorIsLoading(true);

    // Simulate smart responses based on course content
    setTimeout(() => {
      let replyText = `I have received your query about **"${textToSend}"**. As your personal upskilling mentor, here is a professional breakdown:

1. **Active Core Principle**: Ensure all modules are completed and micro-quizzes are answered correctly.
2. **Industry Best Practice**: Apply this technique inside our mock project sandboxes.
3. **Continuous Review**: Feel free to play our **Class Podcast Guide** to listen to my voiceover summary!`;

      if (textToSend.toLowerCase().includes('explain') || textToSend.toLowerCase().includes('guide')) {
        replyText = `Excellent question! In Unit ${activeModuleIndex + 1} (**${activeLearningCourse.syllabus[activeModuleIndex]}**), we prioritize structural safety, correct syntax parameters, and optimization protocols. 

Keep in mind:
* Always verify input arguments before running commands.
* Practice using our mock sandbox layouts.
* Click 'Claim Certificate' once your course completion progress bar reaches 100%!`;
      }

      const tutorMsg = { id: `t-${Date.now()}`, sender: 'tutor' as const, text: replyText };
      setTutorMessages(prev => [...prev, tutorMsg]);
      setTutorIsLoading(false);
    }, 1200);
  };

  // Preset quick questions for tutor
  const handleQuickQuestion = (actionType: string, topicName: string) => {
    let query = '';
    if (actionType === 'explain') query = `Explain the core concepts of "${topicName}" simply.`;
    if (actionType === 'interview') query = `Give me a mock interview question about "${topicName}".`;
    if (actionType === 'guide') query = `Give me a step-by-step implementation guide for "${topicName}".`;
    handleSendTutorMessage(query);
  };

  // Setup default welcome message when course is loaded
  useEffect(() => {
    if (activeLearningCourse) {
      if (wasAutoLaunched) {
        setTutorMessages([
          {
            id: 'welcome',
            sender: 'tutor',
            text: `🎉 **Congratulations, ${candidateName}!** Your enrollment payment of **${activeLearningCourse.price}** has been verified, and the curriculum is successfully unlocked!\n\nNamaste! I am **Arohi**, your AI Classroom Mentor. I have pre-loaded Unit 1: **"${activeLearningCourse.syllabus[0]}"** for you.\n\nWe will be studying **topic-by-topic** and **chapter-by-chapter** for a smooth learning experience:\n\n1. **📖 Lecture Slide**: Review the core operational details and click **"🔊 Play Audio Lecture"** above to hear my audio notes.\n2. **💻 Sandbox Lab**: Open our interactive sandbox to write code, balance MSME cash flows, or conduct schematic diagnostics.\n3. **✍️ Micro-Quiz**: Complete the final test to verify your mastery and unlock the next chapter!`
          }
        ]);
        setWasAutoLaunched(false);
      } else {
        setTutorMessages([
          {
            id: 'welcome',
            sender: 'tutor',
            text: `Namaste ${candidateName}! I am **Arohi**, your upskilling mentor. We are starting Unit ${activeModuleIndex + 1}: **"${activeLearningCourse.syllabus[activeModuleIndex]}"** inside the **"${activeLearningCourse.title}"** program.\n\nUse the tabs in the middle desk to study this topic smoothly. Let me know if you have any questions or need a detailed cheat sheet!`
          }
        ]);
      }
    }
  }, [activeLearningCourse, activeModuleIndex]);

  // Compute filtering
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.skillsAcquired.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // RENDER INTERACTIVE AUTO-LEARNING PLAYER WORKSPACE
  if (activeLearningCourse) {
    const course = activeLearningCourse;
    const topics = course.syllabus;
    const currentTopic = topics[activeModuleIndex];
    const completedList = completedModules[course.id] || [];
    const percentComplete = Math.round((completedList.length / topics.length) * 100);
    const activeContent = getModuleContent(course.id, currentTopic, activeModuleIndex);

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Navigation Bar / Control Panel */}
        <div className="bg-[#120e2a] border border-[#2d2163] p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white shadow-xl">
          <div className="flex items-center gap-3 text-left">
            <button
              onClick={() => {
                setActiveLearningCourse(null);
                setIsAudioLecturePlaying(false);
              }}
              className="px-4 py-2 bg-[#1b143c] hover:bg-[#251e54] text-slate-300 hover:text-white border border-[#2d2163] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              ← Back to Catalog
            </button>
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-black text-[#a78bfa] tracking-widest block">Arohi Integrated Online Classroom</span>
              <h3 className="text-sm font-black text-white truncate leading-tight mt-0.5">{course.title}</h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Audio guided lecture player */}
            <button
              onClick={() => {
                setIsAudioLecturePlaying(!isAudioLecturePlaying);
                if (!isAudioLecturePlaying) {
                  setAudioProgress(0);
                  handleSendTutorMessage(`Hi Arohi! I've started the audio guide. Can you narrate the core theoretical focus for "${currentTopic}" in our digital classroom?`);
                }
              }}
              className={`px-3.5 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                isAudioLecturePlaying 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                  : 'bg-[#1b143c] hover:bg-[#231a54] text-slate-300 border-[#2d2163]'
              }`}
            >
              {isAudioLecturePlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  🔊 Audio Guide: Playing ({audioProgress}%)
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-[#00e676]" />
                  🔊 Play Class Podcast Guide
                </>
              )}
            </button>

            {/* Claim Certificate button */}
            {percentComplete === 100 ? (
              <button
                onClick={() => handleClaimCertificate(course.id)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-[#00e676] text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-[0_4px_15px_rgba(0,230,118,0.35)] cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1"
              >
                <Award className="w-4 h-4 text-white" /> Claim ISO Certificate
              </button>
            ) : (
              <div className="bg-[#181338] border border-[#2c1f6b] px-3.5 py-2 rounded-xl text-[10px] font-black text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-slate-500" /> Complete course to earn Certificate
              </div>
            )}
          </div>
        </div>

        {/* Animated Audio Equalizer Waveform overlay */}
        {isAudioLecturePlaying && (
          <div className="bg-gradient-to-r from-[#171239] to-[#0c0824] border border-emerald-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <span className="text-emerald-400 font-bold text-xs animate-pulse">●</span>
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#00e676]">Arohi Classroom Podcast Stream</span>
                <p className="text-xs font-bold text-slate-200 mt-0.5">Narrating core lecture guidelines for Unit {activeModuleIndex + 1}...</p>
              </div>
            </div>
            {/* Audio waveform */}
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite_0.1s]" style={{ height: '70%' }}></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_0.3s]" style={{ height: '40%' }}></span>
              <span className="w-1 bg-[#00e676] rounded-full animate-[bounce_0.8s_infinite_0.2s]" style={{ height: '90%' }}></span>
              <span className="w-1 bg-emerald-500 rounded-full animate-[bounce_0.8s_infinite_0.5s]" style={{ height: '50%' }}></span>
              <span className="w-1 bg-emerald-400 rounded-full animate-[bounce_0.8s_infinite_0.4s]" style={{ height: '80%' }}></span>
            </div>
          </div>
        )}

        {/* Learning Workspace Progress tracking bar */}
        <div className="bg-[#120e2a] border border-[#2d2163] p-4 rounded-2xl text-left text-white space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Course Progress</span>
            <span className="text-xs font-black text-[#00e676]">{percentComplete}% Complete ({completedList.length}/{topics.length} Units)</span>
          </div>
          <div className="w-full bg-[#1b143c] h-3 rounded-full overflow-hidden border border-[#2d2163]">
            <div 
              className="bg-gradient-to-r from-[#7c3aed] to-[#00e676] h-full transition-all duration-500 shadow-inner" 
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
        </div>

        {/* Dual Pane Studio layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Syllabus Navigation tree */}
          <div className="lg:col-span-3 space-y-4 text-left">
            <div className="bg-[#120e2a] border border-[#2d2163] p-4 rounded-3xl shadow-xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Course Units ({topics.length})</span>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {topics.map((topic, idx) => {
                  const isCompleted = completedList.includes(topic);
                  const isActive = idx === activeModuleIndex;
                  const isLocked = idx > 0 && !completedList.includes(topics[idx - 1]);

                  return (
                    <button
                      key={idx}
                      disabled={isLocked}
                      onClick={() => handleSelectModule(idx)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex gap-3 items-start ${
                        isLocked
                          ? 'opacity-40 bg-slate-950/40 border-slate-900 cursor-not-allowed'
                          : isActive
                            ? 'bg-[#1e1545] border-[#7c3aed] shadow-[0_4px_12px_rgba(124,58,237,0.15)] cursor-pointer'
                            : 'bg-[#181338] hover:bg-[#20184b] border-[#251a54] cursor-pointer'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isLocked ? (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center">
                            <Lock className="w-2.5 h-2.5 text-slate-500" />
                          </div>
                        ) : isCompleted ? (
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-emerald-400 stroke-[3]" />
                          </div>
                        ) : (
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold ${
                            isActive ? 'border-[#a78bfa] text-[#a78bfa]' : 'border-slate-500 text-slate-400'
                          }`}>
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 text-left">
                        <span className={`block text-[11px] font-black leading-snug ${isLocked ? 'text-slate-500' : isActive ? 'text-yellow-200' : 'text-white'}`}>
                          {topic}
                        </span>
                        <span className="block text-[9px] font-bold mt-0.5 uppercase tracking-wider">
                          {isLocked ? (
                            <span className="text-amber-500/80 flex items-center gap-1">🔒 Locked</span>
                          ) : isCompleted ? (
                            <span className="text-emerald-400">Completed ✓</span>
                          ) : isActive ? (
                            <span className="text-[#a78bfa]">Active Lesson</span>
                          ) : (
                            <span className="text-slate-400">Pending Study</span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Interactive Online Classroom Desk */}
          <div className="lg:col-span-6 space-y-4 text-left">
            
            {/* Integrated Classroom Tabs Header */}
            <div className="bg-[#120e2a] border border-[#2d2163] rounded-2xl p-1.5 flex items-center justify-between gap-1 shadow-xl">
              <button 
                onClick={() => setClassroomTab('lecture')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  classroomTab === 'lecture'
                    ? 'bg-[#7c3aed] text-white shadow-md'
                    : 'hover:bg-[#1b143c] text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                1. Lecture Deck
              </button>
              <button 
                onClick={() => setClassroomTab('sandbox')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  classroomTab === 'sandbox'
                    ? 'bg-[#7c3aed] text-white shadow-md'
                    : 'hover:bg-[#1b143c] text-slate-400 hover:text-slate-200'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                2. Sandbox Lab
              </button>
              <button 
                onClick={() => setClassroomTab('quiz')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  classroomTab === 'quiz'
                    ? 'bg-[#7c3aed] text-white shadow-md'
                    : 'hover:bg-[#1b143c] text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                3. Micro-Quiz
              </button>
            </div>

            {/* CLASSROOM TAB 1: LECTURE DECK */}
            {classroomTab === 'lecture' && (
              <div className="bg-[#120e2a] border border-[#2d2163] p-6 rounded-3xl shadow-xl space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#21184a] pb-3">
                  <span className="text-[10px] font-black uppercase text-[#a78bfa] tracking-widest block">Classroom Theory Slide</span>
                  <span className="text-xs font-black text-slate-400">Unit {activeModuleIndex + 1} of {topics.length}</span>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-base font-black text-white">{currentTopic}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed">
                    {activeContent.overview}
                  </p>
                </div>

                {/* Key Concepts Summary Card */}
                <div className="bg-[#18133a] border border-[#2c2063] p-4 rounded-2xl space-y-2.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#a78bfa] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" /> Core Academic Pillars
                  </span>
                  <div className="space-y-2">
                    {activeContent.keyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs font-semibold text-slate-200">
                        <span className="text-[#a78bfa] shrink-0 font-black">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mentor Tip Card */}
                <div className="bg-gradient-to-r from-[#171339] to-[#0c0824] border border-[#30216b] p-4 rounded-2xl flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#3b2a80] shrink-0">
                    <ArohiAvatar className="w-full h-full" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider block">Arohi's Classroom Insights</span>
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed mt-0.5">
                      "Make sure to read through this unit carefully! In our next sandbox, we will perform hands-on tests to verify these parameters. Let me know if any definition feels tricky!"
                    </p>
                  </div>
                </div>

                {/* Progress controls */}
                <button
                  onClick={() => setClassroomTab('sandbox')}
                  className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                >
                  <BrainCircuit className="w-4 h-4 text-emerald-400" /> Next Step: Open Interactive Lab Sandbox 💻
                </button>
              </div>
            )}

            {/* CLASSROOM TAB 2: SANDBOX LAB */}
            {classroomTab === 'sandbox' && (
              <div className="bg-[#120e2a] border border-[#2d2163] p-6 rounded-3xl shadow-xl space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#21184a] pb-3">
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Interactive Sandbox Environment
                  </span>
                  <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-1 rounded font-bold text-[10px] uppercase">
                    Lab {activeModuleIndex + 1} active
                  </span>
                </div>

                {/* RENDER DYNAMIC LAB BASED ON CATEGORY */}
                {course.category === 'tech' && activeContent.techChallenge && (
                  <div className="space-y-4">
                    <div className="bg-[#19143d] border border-[#35286e] p-3.5 rounded-2xl text-xs text-slate-200">
                      <p className="font-bold text-white mb-1">💻 Code Challenge Objective:</p>
                      <p className="font-semibold text-slate-300 leading-normal">{activeContent.techChallenge.instructions}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      {/* Left: IDE Editor */}
                      <div className="md:col-span-7 flex flex-col">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Interactive Script Editor</label>
                        <textarea
                          value={editorCode}
                          onChange={(e) => setEditorCode(e.target.value)}
                          className="w-full h-48 bg-[#0c0822] border border-[#2b215e] focus:border-[#7c3aed] focus:outline-none p-3 rounded-2xl font-mono text-[11px] text-emerald-300 leading-relaxed resize-none shadow-inner"
                        ></textarea>
                      </div>

                      {/* Right: UNIX Terminal Console */}
                      <div className="md:col-span-5 flex flex-col">
                        <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Build Console Output</label>
                        <div className="w-full h-48 bg-[#070518] border border-[#1e1742] p-3 rounded-2xl font-mono text-[9px] text-slate-300 space-y-1 overflow-y-auto shadow-inner text-left">
                          {consoleLogs.map((log, i) => (
                            <p key={i} className={
                              log.includes('[Success]') || log.includes('passed') ? 'text-emerald-400 font-bold' :
                              log.includes('[Error]') || log.includes('failed') ? 'text-rose-400 font-bold' :
                              log.includes('[Compiling]') || log.includes('[Testing]') ? 'text-amber-400' : 'text-slate-400'
                            }>
                              {log}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleExecuteTechCode(activeContent.techChallenge.expectedKeywords, activeContent.techChallenge.successMsg)}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                      >
                        Execute Script ⚡
                      </button>
                      <button
                        onClick={() => {
                          setEditorCode(activeContent.techChallenge.starterCode);
                          setConsoleLogs(['[System] Workspace reset to starter code template.']);
                          setTechTaskPassed(false);
                        }}
                        className="bg-[#1b143c] border border-[#2d2163] hover:bg-[#251e54] text-slate-300 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reset Template
                      </button>
                    </div>
                  </div>
                )}

                {course.category === 'business' && activeContent.businessTask && (
                  <div className="space-y-4">
                    <div className="bg-[#19143d] border border-[#35286e] p-3.5 rounded-2xl text-xs text-slate-200">
                      <p className="font-bold text-white mb-1">📈 General Ledger Audit Task:</p>
                      <p className="font-semibold text-slate-300 leading-normal">{activeContent.businessTask.instructions}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">MSME Business Name</label>
                        <input
                          type="text"
                          value={bizName}
                          onChange={(e) => setBizName(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-3 py-2 rounded-xl text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">GST filing scheme</label>
                        <select
                          value={bizTaxScheme}
                          onChange={(e) => setBizTaxScheme(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-3 py-2 rounded-xl text-white font-semibold focus:outline-none"
                        >
                          <option value="GST-Composition">GST Composition (1%)</option>
                          <option value="Regular-18%">Regular Service filing (18%)</option>
                          <option value="ITR-4-Presumptive">Presumptive Business ITR (Section 44AD)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Projected Monthly Revenue (₹)</label>
                        <input
                          type="number"
                          value={bizInflow}
                          onChange={(e) => setBizInflow(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-3 py-2 rounded-xl text-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 mb-1">Estimated Expenses (₹)</label>
                        <input
                          type="number"
                          value={bizOutflow}
                          onChange={(e) => setBizOutflow(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-3 py-2 rounded-xl text-white font-semibold"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleGenerateBusinessLedger(activeContent.businessTask.targetInflow, activeContent.businessTask.targetProfit, activeContent.businessTask.ledgerItemName)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      Generate Audited Cash Flow & Tax Statement 📊
                    </button>

                    {/* Audited Statement Invoice mock */}
                    {bizLedgerResult && (
                      <div className="bg-white text-slate-900 p-5 rounded-2xl font-mono text-[10px] text-left border-4 border-double border-slate-300 relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#00e676]/10 rounded-full flex items-center justify-center border-l border-b border-dashed border-[#00e676]">
                          <span className="text-[8px] font-black uppercase text-emerald-600 tracking-wider rotate-12">Audited</span>
                        </div>
                        <h5 className="font-black text-center text-xs border-b border-slate-300 pb-1.5 uppercase">ODISHA MSME REVENUE COMPLIANCE LEDGER</h5>
                        <div className="grid grid-cols-2 gap-2 mt-3 text-[9px] font-bold text-slate-600">
                          <div>Enterprise: {bizName}</div>
                          <div className="text-right">Ledger ID: {bizLedgerResult.ledgerNo}</div>
                          <div>Audit Date: {bizLedgerResult.timestamp}</div>
                          <div className="text-right">Filing: {bizTaxScheme}</div>
                        </div>

                        <div className="border-t border-b border-slate-200 my-3 py-2 space-y-1 font-bold text-slate-800 text-[10px]">
                          <div className="flex justify-between">
                            <span>Projected Monthly Revenue:</span>
                            <span>₹{bizLedgerResult.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Operating Expenses:</span>
                            <span>- ₹{bizLedgerResult.costs.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t border-slate-200 pt-1.5 font-black text-slate-950">
                            <span>Net Operating Margin ({bizLedgerResult.margin}%):</span>
                            <span className={bizLedgerResult.profit > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                              ₹{bizLedgerResult.profit.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className={`p-2.5 rounded-xl border font-sans text-[10px] font-semibold leading-relaxed ${
                          bizLedgerResult.isOk 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' 
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-800'
                        }`}>
                          {bizLedgerResult.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {course.category === 'vocational' && activeContent.vocationalLab && (
                  <div className="space-y-4">
                    <div className="bg-[#19143d] border border-[#35286e] p-3.5 rounded-2xl text-xs text-slate-200">
                      <p className="font-bold text-white mb-1">🛠️ Diagnostic Hardware Task:</p>
                      <p className="font-semibold text-slate-300 leading-normal">{activeContent.vocationalLab.instructions}</p>
                    </div>

                    {/* Schematic map visualization */}
                    <div className="bg-[#09061a] border border-[#231752] p-4 rounded-2xl space-y-3 relative select-none">
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider absolute top-2 left-3 block">CIRCUIT SCHEMATIC MAP</span>
                      
                      <div className="flex flex-wrap justify-center items-center gap-6 py-6 font-mono text-[9px] font-bold">
                        <div className={`px-3 py-2 rounded-lg border transition-all ${vocationalNode === 'positive-terminal' ? 'bg-amber-500/10 border-amber-500 text-amber-200 scale-105' : 'bg-[#120e2a] border-[#221752] text-slate-400'}`}>
                          [ + V IN ]<br/>Cell Node
                        </div>
                        <span className="text-slate-700">───</span>
                        <div className={`px-3 py-2 rounded-lg border transition-all ${vocationalNode === 'inverter-controller' ? 'bg-amber-500/10 border-amber-500 text-amber-200 scale-105' : 'bg-[#120e2a] border-[#221752] text-slate-400'}`}>
                          [ INVERTER REG ]<br/>Grid Controller
                        </div>
                        <span className="text-slate-700">───</span>
                        <div className={`px-3 py-2 rounded-lg border transition-all ${vocationalNode === 'sensor-array' ? 'bg-amber-500/10 border-amber-500 text-amber-200 scale-105' : 'bg-[#120e2a] border-[#221752] text-slate-400'}`}>
                          [ SENSOR GYRO ]<br/>Bus Feedback
                        </div>
                        <span className="text-slate-700">───</span>
                        <div className={`px-3 py-2 rounded-lg border transition-all ${vocationalNode === 'ground-resistance' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200 scale-105' : 'bg-[#120e2a] border-[#221752] text-slate-400'}`}>
                          [ GND ROD ]<br/>0.0V Return
                        </div>
                      </div>
                    </div>

                    {/* Diagnostic configurations */}
                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Select Tool</label>
                        <select
                          value={vocationalTool}
                          onChange={(e) => setVocationalTool(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-2.5 py-2 rounded-xl text-white font-semibold text-[11px]"
                        >
                          <option value="multimeter">Digital Multimeter (V/Ω)</option>
                          <option value="thermal">Thermal Scanner (°C)</option>
                          <option value="pressure">Pressure Manometer (Bar)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Target Node</label>
                        <select
                          value={vocationalNode}
                          onChange={(e) => setVocationalNode(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-2.5 py-2 rounded-xl text-white font-semibold text-[11px]"
                        >
                          <option value="positive-terminal">Cell Node (+V IN)</option>
                          <option value="inverter-controller">Grid Inverter Controller</option>
                          <option value="sensor-array">Sensor Gyro Bus</option>
                          <option value="ground-resistance">Ground Rod (GND Return)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-black uppercase text-slate-400 mb-1">Dial Setting</label>
                        <select
                          value={vocationalDials}
                          onChange={(e) => setVocationalDials(e.target.value)}
                          className="w-full bg-[#18133a] border border-[#2d2163] px-2.5 py-2 rounded-xl text-white font-semibold text-[11px]"
                        >
                          <option value="voltage">Voltage (V / AC-DC)</option>
                          <option value="resistance">Resistance (Ω)</option>
                          <option value="temperature">Temperature (°C)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => handleExecuteVocationalDiagnostic(activeContent.vocationalLab.correctTool, activeContent.vocationalLab.correctNode, activeContent.vocationalLab.correctDial, activeContent.vocationalLab.expectedVal, activeContent.vocationalLab.okLogs)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                    >
                      Conduct Live Circuit Diagnostics ⚡
                    </button>

                    {/* Vocational console telemetry */}
                    <div className="w-full h-32 bg-[#070518] border border-[#1e1742] p-3 rounded-2xl font-mono text-[9px] text-slate-300 space-y-1 overflow-y-auto shadow-inner text-left">
                      {vocationalConsole.map((log, i) => (
                        <p key={i} className={
                          log.includes('[Success]') || log.includes('SAFE') || log.includes('NOMINAL') ? 'text-emerald-400 font-bold' :
                          log.includes('[Telemetry Failure]') || log.includes('Incorrect') ? 'text-rose-400 font-bold' :
                          log.includes('[Diagnosing]') || log.includes('[Calibrating]') ? 'text-amber-400' : 'text-slate-400'
                        }>
                          {log}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Checklist Integrated under sandbox */}
                <div className="space-y-3 pt-2.5 border-t border-[#231a4f]">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Practical Sandbox Checklist</span>
                  <div className="grid grid-cols-1 gap-2">
                    {activeContent.checklist.map((item, idx) => {
                      const itemKey = `${course.id}-${currentTopic}-${idx}`;
                      const isItemChecked = !!checkedChecklistItems[itemKey];

                      return (
                        <button
                          key={idx}
                          onClick={() => toggleChecklistItem(course.id, currentTopic, idx)}
                          className="w-full text-left bg-[#140f33] border border-[#231a4f] hover:border-[#3d2c8c] p-3 rounded-xl flex items-center justify-between gap-2 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <span className="text-slate-200">{item}</span>
                          <div className="shrink-0">
                            {isItemChecked ? (
                              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                Verified ✓
                              </span>
                            ) : (
                              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-[#120e2a] px-2 py-0.5 rounded">
                                Pending
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Next Step procedurals */}
                <button
                  onClick={() => setClassroomTab('quiz')}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                >
                  <HelpCircle className="w-4 h-4 text-slate-950" /> Next Step: Open Chapter Micro-Quiz 📝
                </button>
              </div>
            )}

            {/* CLASSROOM TAB 3: MICRO-QUIZ */}
            {classroomTab === 'quiz' && (
              <div className="bg-[#120e2a] border border-[#2d2163] p-6 rounded-3xl shadow-xl space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 border-b border-[#21184a] pb-3">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 leading-none">Module Micro-Assessment</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Test your unit competency to progress cleanly.</p>
                  </div>
                </div>

                {/* Gentle study prompt reminder */}
                {course.category === 'tech' && !techTaskPassed && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-semibold text-amber-300">
                    💡 Mentor Suggestion: Have you executed your code successfully in the **Sandbox Lab** yet? Try trying the lab challenge to verify code logic first!
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-xs sm:text-sm font-black text-white leading-relaxed">
                    {activeContent.quiz.question}
                  </p>

                  <div className="space-y-2">
                    {activeContent.quiz.options.map((option, idx) => {
                      const isSelected = selectedQuizOption === idx;
                      return (
                        <button
                          key={idx}
                          disabled={quizSubmitted}
                          onClick={() => setSelectedQuizOption(idx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? 'bg-[#22154c] border-[#7c3aed] text-[#c084fc] font-bold'
                              : 'bg-[#18133a] hover:bg-[#20184b] border-[#251a54] text-slate-300'
                          }`}
                        >
                          <span>{option}</span>
                          <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]' : 'border-slate-500'
                          }`}>
                            {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit Feedback panel */}
                  {quizSubmitted ? (
                    <div className={`p-4 rounded-xl border text-xs font-semibold ${
                      quizIsCorrect 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    }`}>
                      <p className="font-bold uppercase tracking-wider text-[10px]">
                        {quizIsCorrect ? 'Correct Answer! Verified ✓' : 'Incorrect Answer. Please retry!'}
                      </p>
                      <p className="mt-1 leading-normal font-semibold">{activeContent.quiz.explanation}</p>
                      
                      {quizIsCorrect && activeModuleIndex < topics.length - 1 && (
                        <button
                          onClick={() => handleSelectModule(activeModuleIndex + 1)}
                          className="mt-3.5 w-full bg-emerald-500 hover:bg-[#00c853] text-white font-black text-[10px] uppercase tracking-widest py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                        >
                          Unlock Next Unit: Proceed Chapter-by-Chapter →
                        </button>
                      )}

                      {quizIsCorrect && activeModuleIndex === topics.length - 1 && (
                        <div className="mt-3.5 p-3.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-xl space-y-2 text-center animate-bounce">
                          <span className="text-lg block">🏆</span>
                          <p className="font-black text-[11px] uppercase tracking-wide">Course Completed!</p>
                          <p className="text-[10px] font-semibold text-slate-300">You have successfully mastered all topics and practical sandboxes in this program! Claim your ISO certification now in the top-right corner of the workspace.</p>
                        </div>
                      )}

                      {!quizIsCorrect && (
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setSelectedQuizOption(null);
                          }}
                          className="mt-3 text-[10px] font-black uppercase tracking-wider text-rose-400 hover:underline cursor-pointer"
                        >
                          Retry assessment
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      disabled={selectedQuizOption === null}
                      onClick={() => handleQuizSubmit(activeContent.quiz.answerIdx)}
                      className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-[#1a1435] disabled:text-slate-500 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-md disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Interactive AI Study Tutor Companion */}
          <div className="lg:col-span-3 space-y-4 text-left">
            
            <div className="bg-[#120e2a] border border-[#2d2163] rounded-3xl shadow-xl flex flex-col h-[75vh] overflow-hidden">
              
              {/* Tutor Header */}
              <div className="bg-[#1a143c] border-b border-[#2a1d59] p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#3b2a80] shrink-0">
                    <ArohiAvatar className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white leading-none">Arohi Study Tutor</h4>
                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block mt-0.5">Online Guidance</span>
                  </div>
                </div>
              </div>

              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0e0a24]">
                {tutorMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-xl text-xs font-medium max-w-[90%] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#7c3aed] text-white rounded-tr-none'
                        : 'bg-[#181338] border border-[#2d2163] text-slate-100 rounded-tl-none'
                    }`}>
                      {renderMarkdown(msg.text)}
                    </div>
                  </div>
                ))}

                {tutorIsLoading && (
                  <div className="text-[10px] text-slate-400 font-semibold italic animate-pulse">
                    Arohi is researching notes...
                  </div>
                )}
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-[#120e2a] border-t border-[#231a4f] p-3.5 shrink-0 space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Tutor Quick Commands</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleQuickQuestion('explain', currentTopic)}
                    className="bg-[#18133a] hover:bg-[#20194a] border border-[#251c54] text-slate-300 text-[10px] py-1.5 px-2 rounded-lg font-black uppercase tracking-wider cursor-pointer text-center"
                  >
                    💡 Explain Concept
                  </button>
                  <button
                    onClick={() => handleQuickQuestion('guide', currentTopic)}
                    className="bg-[#18133a] hover:bg-[#20194a] border border-[#251c54] text-slate-300 text-[10px] py-1.5 px-2 rounded-lg font-black uppercase tracking-wider cursor-pointer text-center"
                  >
                    🛠️ Study Guide
                  </button>
                </div>
              </div>

              {/* Send message form */}
              <div className="bg-[#151030] border-t border-[#2a1d59] p-3 shrink-0 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Arohi about this unit..."
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTutorMessage()}
                  className="flex-1 bg-[#18133a] border border-[#2d2163] rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-[#7c3aed] text-white placeholder-slate-500"
                />
                <button
                  onClick={() => handleSendTutorMessage()}
                  className="p-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // STANDARD UP-SKILLING CATALOG PREVIEW
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#120e2a] to-[#0a0715] border border-[#2d2163] text-white rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-[#a78bfa]/20 shadow-md">
              ✨ Arohi Auto-Learning Academy
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white leading-none">
              Subsidized Job-Ready Courses
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed font-semibold">
              Gain industry-accredited certifications at highly subsidized, pocket-friendly Indian rates. Accelerate your job readiness in software development, core business, or skilled hands-on vocational trades with our **⚡ Auto-Learning Player Engine**!
            </p>
          </div>

          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="shrink-0 bg-[#251b54] hover:bg-[#34247c] border border-[#443093]/60 text-[#c084fc] hover:text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            {showDashboard ? "Collapse Charts 📊" : "Show Analytics Dashboard 📊"}
          </button>
        </div>
      </div>

      {/* NEW COURSE PROGRESS & INTERACTIVE ANALYTICS DASHBOARD */}
      {showDashboard && (() => {
        const totalEnrolled = enrolledCourses.length;
        const totalCompletedModules = (Object.values(completedModules) as string[][]).reduce((acc, curr) => acc + curr.length, 0);
        const earnedCertCount = earnedCertificates.length;

        const enrolledCoursesList = enrolledCourses.map(id => {
          const c = courses.find(item => item.id === id);
          if (!c) return null;
          const completedList = completedModules[id] || [];
          const percentComplete = Math.round((completedList.length / c.syllabus.length) * 100);
          return { ...c, percentComplete, completedCount: completedList.length };
        }).filter((x): x is NonNullable<typeof x> => x !== null);

        const avgCompletion = enrolledCoursesList.length > 0
          ? Math.round(enrolledCoursesList.reduce((acc, curr) => acc + curr.percentComplete, 0) / enrolledCoursesList.length)
          : 0;

        const studyHoursByDay = [1.8, 3.5, 2.1, 4.2, 3.8, 5.5, 4.0];
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const totalStudyHours = totalEnrolled > 0 ? studyHoursByDay.reduce((a, b) => a + b, 0).toFixed(1) : "0.0";

        const linePoints = studyHoursByDay.map((h, i) => {
          const x = 35 + i * (430 / 6);
          const y = 100 - (h / 6.5) * 80;
          return { x, y, val: h, day: daysOfWeek[i] };
        });

        const dLinePath = linePoints.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');
        const dAreaPath = linePoints.length > 0 
          ? `M 35 100 ` + linePoints.map(p => `L ${p.x} ${p.y}`).join(' ') + ` L 465 100 Z` 
          : '';

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-top-4 duration-300">
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-b from-[#18133c] to-[#0d0924] border border-[#2d2163] p-4 rounded-2xl text-left">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider block">Registered Programs</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">{totalEnrolled}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-semibold">active tracks</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#18133c] to-[#0d0924] border border-[#2d2163] p-4 rounded-2xl text-left">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider block">Completed Units</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">{totalCompletedModules}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-semibold">completed</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#18133c] to-[#0d0924] border border-[#2d2163] p-4 rounded-2xl text-left">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider block">Average Mastery Index</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">{avgCompletion}%</span>
                  <span className="text-[10px] font-bold text-slate-400 font-semibold">aggregate</span>
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#18133c] to-[#0d0924] border border-[#2d2163] p-4 rounded-2xl text-left">
                <span className="text-[9px] font-black uppercase text-[#a78bfa] tracking-wider block">Earned Credentials</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-white">{earnedCertCount}</span>
                  <span className="text-[10px] font-bold text-slate-400 font-semibold">claimed</span>
                </div>
              </div>
            </div>

            {/* WEEKLY STUDY TIME CHART */}
            <div className="lg:col-span-7 bg-[#120e2a] border border-[#2d2163] p-5 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Weekly Auto-Learning Study Intensity
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      Hover points to inspect live simulated time-logs.
                    </p>
                  </div>
                  <span className="text-xs bg-[#19133c] border border-[#3b2b73] px-2.5 py-1 rounded-lg font-bold text-white">
                    🔥 {totalStudyHours} Total Hours
                  </span>
                </div>

                <div className="relative w-full h-32 mt-2 select-none">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#00e676" />
                      </linearGradient>
                    </defs>

                    <line x1="35" y1="20" x2="465" y2="20" stroke="#221752" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="35" y1="60" x2="465" y2="60" stroke="#221752" strokeWidth="1" strokeDasharray="3,3" />
                    <line x1="35" y1="100" x2="465" y2="100" stroke="#221752" strokeWidth="1" />

                    {totalEnrolled > 0 && <path d={dAreaPath} fill="url(#chart-glow)" />}
                    {totalEnrolled > 0 && <path d={dLinePath} fill="none" stroke="url(#line-grad)" strokeWidth="3" strokeLinecap="round" />}

                    {daysOfWeek.map((day, idx) => {
                      const x = 35 + idx * (430 / 6);
                      return (
                        <text key={idx} x={x} y="115" fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
                          {day}
                        </text>
                      );
                    })}

                    {totalEnrolled > 0 && linePoints.map((pt, idx) => (
                      <g key={idx}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="#120e2a"
                          stroke={hoveredChartDay === idx ? "#00e676" : "#7c3aed"}
                          strokeWidth="3"
                          className="transition-colors cursor-pointer"
                          onMouseEnter={() => setHoveredChartDay(idx)}
                          onMouseLeave={() => setHoveredChartDay(null)}
                        />
                        {hoveredChartDay === idx && (
                          <circle cx={pt.x} cy={pt.y} r="10" fill="#00e676" opacity="0.2" className="animate-ping pointer-events-none" />
                        )}
                      </g>
                    ))}
                  </svg>

                  {hoveredChartDay !== null && totalEnrolled > 0 && (
                    <div 
                      className="absolute bg-[#1a133c] border border-emerald-500/40 text-white rounded-xl p-2 z-30 pointer-events-none text-xs text-left animate-in fade-in duration-150"
                      style={{
                        left: `${Math.min(Math.max((hoveredChartDay * (100 / 6)) - 10, 2), 78)}%`,
                        bottom: '50px'
                      }}
                    >
                      <p className="font-extrabold text-white text-[11px]">
                        ⚡ {studyHoursByDay[hoveredChartDay]} Hours Studied
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SYLLABUS MASTERY BREAKDOWN */}
            <div className="lg:col-span-5 bg-[#120e2a] border border-[#2d2163] p-5 rounded-3xl text-left flex flex-col justify-between">
              <div className="space-y-3.5 w-full">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-yellow-300" /> Syllabus Course Mastery Breakdown
                </h4>

                {enrolledCoursesList.length === 0 ? (
                  <div className="py-8 text-center bg-[#171239]/50 border border-[#2a1d59] rounded-2xl p-4 space-y-2.5">
                    <span className="text-xl block">🎓</span>
                    <p className="text-xs text-slate-300 font-bold">No Active Enrolled Syllabus Paths</p>
                    <p className="text-[10px] text-slate-400 leading-normal max-w-xs mx-auto">
                      Enroll in any of our subsidized courses listed below. Your active syllabus metrics will plot here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
                    {enrolledCoursesList.map((c) => (
                      <div key={c.id} className="space-y-1.5 border-b border-[#20184c] pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-[11px] font-extrabold text-white truncate max-w-[180px]">
                            {c.title}
                          </span>
                          <span className="text-[10px] font-black text-emerald-400 shrink-0">
                            {c.percentComplete}% Completed
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 bg-[#18133a] h-2 rounded-full overflow-hidden border border-[#281c5a]/60">
                            <div 
                              className="bg-gradient-to-r from-[#7c3aed] to-[#00e676] h-full transition-all duration-500" 
                              style={{ width: `${c.percentComplete}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold shrink-0">
                            {c.completedCount}/{c.syllabus.length} Units
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Filter and Stats Panel */}
        <div className="lg:col-span-3 space-y-4 text-left">
          <div className="bg-[#120e2a] border border-[#2d2163] p-5 rounded-3xl shadow-xl space-y-5">
            
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Search Catalog</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tools, skills, or titles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addToSearchHistory(searchQuery);
                    }
                  }}
                  className="w-full bg-[#18133a] border border-[#2b1f5c] text-white rounded-xl pl-9 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-[#7c3aed]"
                />
                <button 
                  onClick={() => addToSearchHistory(searchQuery)}
                  title="Save Search Query"
                  className="absolute left-1 top-1 w-7 h-7 rounded-lg hover:bg-[#20184b] text-slate-400 hover:text-[#a78bfa] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 w-5 h-5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Dynamic Search History Section */}
              <div className="space-y-2 pt-1 border-t border-[#1f1847]/60">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <span className="flex items-center gap-1">
                    <History className="w-3 h-3 text-violet-400" /> Recent Searches
                  </span>
                  {searchHistory.length > 0 && (
                    <button
                      onClick={clearSearchHistory}
                      className="text-[#f43f5e] hover:text-[#f43f5e]/80 transition-colors flex items-center gap-0.5 cursor-pointer font-bold uppercase text-[9px] tracking-wider"
                    >
                      <Trash2 className="w-2.5 h-2.5" /> Clear
                    </button>
                  )}
                </div>
                
                {searchHistory.length === 0 ? (
                  <p className="text-[10px] text-slate-500 font-semibold italic">No search history yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {searchHistory.map((historyItem, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(historyItem);
                          addToSearchHistory(historyItem);
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                          searchQuery.toLowerCase() === historyItem.toLowerCase()
                            ? 'bg-[#2e1d6c] border-[#7c3aed] text-white shadow-sm'
                            : 'bg-[#140f35] border-[#20194e] text-slate-300 hover:border-[#3c2a85] hover:text-white'
                        }`}
                      >
                        <span>{historyItem}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Department Tracks</label>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Skill Programs', count: courses.length },
                  { id: 'tech', label: 'Technical & Coding', count: courses.filter(c => c.category === 'tech').length },
                  { id: 'business', label: 'Business & MSME Trades', count: courses.filter(c => c.category === 'business').length },
                  { id: 'vocational', label: 'Vocational & Skilled Trades', count: courses.filter(c => c.category === 'vocational').length }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedCategory(item.id)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs font-black transition-all cursor-pointer flex justify-between items-center ${
                      selectedCategory === item.id
                        ? 'bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white border-[#a78bfa]/30 shadow-md'
                        : 'bg-[#18133a] hover:bg-[#20194a] border-[#251b54] text-slate-300'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${selectedCategory === item.id ? 'bg-white/20' : 'bg-[#120e2a]'}`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Academy Progress info */}
            <div className="bg-[#18133a] border border-[#251b54] p-4 rounded-2xl space-y-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#a78bfa] block">Arohi Academy Progress</span>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400">Enrolled Certificates:</span>
                <span className="text-emerald-400 font-extrabold">{enrolledCourses.length} Programs</span>
              </div>
              <div className="w-full bg-[#120e2a] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-400 to-[#00e676] h-full transition-all duration-500" 
                  style={{ width: `${Math.min((enrolledCourses.length / 8) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Get AROHI AI priority classroom mentoring completely <strong>FREE of cost</strong> with your course package! Enroll in any program and pay in easy monthly breakups.
              </p>
            </div>

          </div>
        </div>

        {/* Right courses display grid */}
        <div className="lg:col-span-9 space-y-4 text-left">
          
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-slate-400">
              Showing <span className="text-white font-extrabold">{isCoursesExpanded ? filteredCourses.length : Math.min(3, filteredCourses.length)}</span> of <span className="text-white font-extrabold">{filteredCourses.length}</span> high-demand upskilling courses
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(isCoursesExpanded ? filteredCourses : filteredCourses.slice(0, 3)).map((c) => {
              const isEnrolled = enrolledCourses.includes(c.id);
              const completedList = completedModules[c.id] || [];
              const percentComplete = Math.round((completedList.length / c.syllabus.length) * 100);

              const cleanPrice = c.price.replace('/mo', '');
              const subsidySavings = (cleanPrice === '₹2,999' ? '₹9,999' :
                                      cleanPrice === '₹3,499' ? '₹11,499' :
                                      cleanPrice === '₹3,999' ? '₹12,999' :
                                      cleanPrice === '₹4,499' ? '₹14,499' :
                                      cleanPrice === '₹4,999' ? '₹15,999' :
                                      cleanPrice === '₹5,999' ? '₹17,999' :
                                      cleanPrice === '₹6,499' ? '₹19,499' :
                                      cleanPrice === '₹6,999' ? '₹20,999' :
                                      cleanPrice === '₹7,499' ? '₹22,499' :
                                      cleanPrice === '₹7,999' ? '₹23,999' :
                                      cleanPrice === '₹8,499' ? '₹25,499' :
                                      cleanPrice === '₹8,999' ? '₹26,999' : '₹29,999') + '/mo';

              return (
                <div 
                  key={c.id} 
                  className="bg-gradient-to-b from-[#18123c] to-[#0c0825] border border-[#2d2165] hover:border-[#7c3aed]/80 shadow-[0_8px_30px_rgba(0,0,0,0.4)] rounded-[1.85rem] p-5 flex flex-col justify-between transition-all duration-300 group hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(124,58,237,0.22)] relative overflow-hidden select-none"
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#7c3aed]/8 rounded-full blur-2xl pointer-events-none group-hover:bg-[#7c3aed]/12 transition-all duration-300"></div>

                  <div className="space-y-3.5 relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                      <span className={`px-2.5 py-0.5 rounded-full border ${
                        c.category === 'tech' ? 'bg-blue-500/10 text-blue-300 border-blue-500/30' :
                        c.category === 'business' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {c.category} program
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-bold text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {c.duration}
                        </span>
                        <span className="bg-[#1b123d] text-yellow-300 border border-yellow-500/15 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-0.5">
                          ★ {c.rating}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-yellow-200 transition-colors leading-snug duration-300">
                        {c.title}
                      </h4>
                      <p className="text-[10px] text-purple-300 font-extrabold flex items-center gap-1">
                        🏢 {c.provider}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-3 bg-[#130d2e]/60 border border-[#21184a]/30 p-2.5 rounded-xl">
                      {c.shortDesc}
                    </p>

                    <div className="space-y-1.5 pt-0.5">
                      <span className="block text-[9px] text-slate-400 font-black uppercase tracking-wider">Target Skills Acquired</span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.skillsAcquired.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="bg-[#1e154a] text-[#c084fc] text-[9px] font-extrabold px-2 py-1 rounded-lg border border-[#2c1d68] shadow-sm">
                            {skill}
                          </span>
                        ))}
                        {c.skillsAcquired.length > 3 && (
                          <span className="text-[9px] text-[#a78bfa] font-black self-center bg-[#171139] border border-[#271d5c] px-1.5 py-0.5 rounded-md">
                            +{c.skillsAcquired.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {isEnrolled ? (
                      <div className="space-y-1.5 pt-2 border-t border-[#1e164a]/80">
                        <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                          <span className="flex items-center gap-1 text-[#00e676]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse"></span>
                            Auto-Learning Progress
                          </span>
                          <span className="text-emerald-400 font-black">{percentComplete}% Mastered</span>
                        </div>
                        <div className="w-full bg-[#19113a] h-2 rounded-full overflow-hidden border border-[#241a54] relative">
                          <div 
                            className="bg-gradient-to-r from-[#7c3aed] via-indigo-500 to-[#00e676] h-full rounded-full transition-all duration-300" 
                            style={{ width: `${percentComplete}%` }}
                          ></div>
                        </div>
                        <span className="block text-[8.5px] text-slate-400 font-bold">
                          {completedList.length} of {c.syllabus.length} units unlocked in syllabus
                        </span>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-[#1e164a]/50 text-[9.5px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span> Not yet registered in your upskilling catalog
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#231a4f] mt-4 flex justify-between items-center gap-2 relative z-10">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs sm:text-sm font-black text-white">{c.price}</span>
                        <span className="text-[9px] text-slate-500 line-through font-bold">{subsidySavings}</span>
                      </div>
                      <span className="block text-[8.5px] font-extrabold text-[#00e676] uppercase tracking-wider mt-0.5">
                        🔥 90% Subsidy Active
                      </span>
                    </div>

                    <div className="flex gap-1.5">
                      {isEnrolled ? (
                        <button
                          onClick={() => {
                            setActiveLearningCourse(c);
                            setActiveModuleIndex(0);
                          }}
                          className="px-3 py-2 bg-gradient-to-r from-[#00e676] to-[#05b35c] hover:from-[#09f381] hover:to-[#07ca69] text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-[#00e676]/15 hover:scale-[1.03] active:scale-95 flex items-center gap-1"
                        >
                          🚀 Launch
                        </button>
                      ) : null}

                      <button
                        onClick={() => {
                          setSelectedCourse(c);
                          setIsCheckoutOpen(false);
                        }}
                        className="px-3.5 py-2 bg-[#21154c] hover:bg-[#342078] text-[#c084fc] hover:text-white border border-[#3f2590] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-95"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredCourses.length > 3 && (
            <div className="flex justify-center pt-6 pb-2">
              <button
                onClick={() => setIsCoursesExpanded(!isCoursesExpanded)}
                className="px-6 py-3 bg-[#17113c] hover:bg-[#201854] text-[#a78bfa] hover:text-white border border-[#302170] hover:border-[#4c34af] text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-95"
              >
                {isCoursesExpanded ? (
                  <>
                    <span>Show Less Courses</span>
                    <ChevronUp className="w-4 h-4 text-yellow-300 animate-bounce" />
                  </>
                ) : (
                  <>
                    <span>Expand & View All Program Modules (+{filteredCourses.length - 3})</span>
                    <ChevronDown className="w-4 h-4 text-yellow-300 animate-bounce" />
                  </>
                )}
              </button>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 bg-[#120e2a] border border-[#231a4f] rounded-3xl space-y-2">
              <p className="text-xs font-bold text-slate-400">No upskilling program matching your keyword was found.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                className="text-xs text-[#a78bfa] font-black uppercase tracking-wider hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* DETAILED VIEW MODAL */}
      {selectedCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-[#120e2a] border border-[#2d2163] text-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => {
                setSelectedCourse(null);
                setIsCheckoutOpen(false);
              }}
              className="absolute top-4 right-4 p-2 bg-[#1b143c] hover:bg-[#251e54] text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            {!isCheckoutOpen ? (
              <>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-purple-900/40 text-[#c084fc] border border-purple-800/40 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {selectedCourse.category} program
                    </span>
                    <span className="bg-[#1a143c] text-yellow-300 border border-yellow-500/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" /> {selectedCourse.rating} / 5.0
                    </span>
                    <span className="bg-slate-900/40 text-slate-300 border border-slate-800/40 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                      {selectedCourse.level} Level
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-semibold">{selectedCourse.provider}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#19133c] border border-[#2a1d59] p-4 rounded-2xl text-xs">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400 font-bold">Duration</span>
                      <span className="font-bold text-white">{selectedCourse.duration}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-400 font-bold">Modules</span>
                      <span className="font-bold text-white">{selectedCourse.modules} Academic Units</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block text-[9px] uppercase text-slate-400 font-bold">Subsidy Price</span>
                      <span className="font-black text-[#00e676]">{selectedCourse.price} <span className="text-[10px] text-slate-300 font-semibold">(Monthly subscription)</span></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Course Overview</h4>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-semibold">
                      {selectedCourse.shortDesc}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Skills */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Target Skills Acquired</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedCourse.skillsAcquired.map((skill, idx) => (
                          <span key={idx} className="bg-[#181338] text-[#c084fc] border border-[#2e206b] text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="space-y-2 bg-[#161138]/50 border border-[#281c5c]/40 p-3 rounded-2xl">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-[#a78bfa]" /> Directing Instructor
                      </h4>
                      <p className="text-xs font-bold text-white mt-1">{selectedCourse.instructor}</p>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                        Receive direct review guidelines from the instructor during specialized Arohi QA office sessions.
                      </p>
                    </div>
                  </div>

                  {/* Syllabus / Curriculum list */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Course Curriculum & Syllabus</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedCourse.syllabus.map((topic, index) => (
                        <div key={index} className="bg-[#151134] border border-[#231a4f] p-3 rounded-xl flex items-start gap-2 text-xs font-semibold text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-[#231a4f] pt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 uppercase font-black">Subsidized Pricing Plan</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white">{selectedCourse.price}</span>
                        <span className="text-xs font-semibold text-slate-400">per month (Cancel anytime)</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {enrolledCourses.includes(selectedCourse.id) ? (
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleUnenroll(selectedCourse.id)}
                            className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/35 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all shrink-0"
                          >
                            Remove
                          </button>
                          <button
                            onClick={() => {
                              setActiveLearningCourse(selectedCourse);
                              setActiveModuleIndex(0);
                              setSelectedCourse(null);
                            }}
                            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-[#00e676] hover:from-emerald-600 hover:to-emerald-400 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                          >
                            🚀 Open Player
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsCheckoutOpen(true)}
                          className="px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-black text-[11px] uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(124,58,237,0.3)] cursor-pointer transition-all hover:scale-[1.02]"
                        >
                          Purchase & Enroll Now
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </>
            ) : (
              /* SECURE PAYMENT SIMULATOR */
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="bg-[#fbbf24]/10 text-[#fcd34d] border border-[#fbbf24]/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider w-fit mx-auto flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Odisha Education Gateway
                  </div>
                  <h3 className="text-xl font-black text-white">Course Purchase Checkout</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-md mx-auto">
                    Activate your certification track. All learning modules, interactive mock exams, and Arohi AI mentor guidelines are unlocked immediately.
                  </p>
                </div>

                <div className="bg-[#18133a] border border-[#2b1f5c] rounded-2xl p-4 space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-[#a78bfa] font-black uppercase tracking-wider block">Course Title</span>
                      <p className="text-sm font-black text-white mt-0.5">{selectedCourse.title}</p>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded font-bold shrink-0">
                      {selectedCourse.price}
                    </span>
                  </div>

                  <div className="border-t border-[#231a4f] pt-2.5 grid grid-cols-2 gap-4 text-xs font-bold text-slate-300">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">Instructor Support</span>
                      <span className="text-slate-200">Continuous via Arohi AI</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">Credential Status</span>
                      <span className="text-slate-200">ISO Verified Certificate</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Mock Payment Interface</label>
                    <div className="bg-[#19143d] border border-[#3b2b73] rounded-xl p-3.5 flex items-center justify-between text-xs font-bold text-slate-300">
                      <span className="flex items-center gap-2">🇮🇳 UPI / Direct Net Banking Mockway</span>
                      <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">Active</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Candidate Name on Certificate</label>
                    <input 
                      type="text" 
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      className="w-full bg-[#19143d] border border-[#3b2b73] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-[#7c3aed]"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium text-center leading-normal">
                    This is a sandbox educational simulation. Clicking "Authorize Payment" charges no real money but immediately updates your workspace dashboard and assigns your enrolled course track.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="w-full bg-[#1a153b] hover:bg-[#251e54] text-white border border-[#2b215e] font-black text-[11px] uppercase tracking-wider py-3.5 rounded-xl cursor-pointer transition-all"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={() => {
                      handleAuthorizePaymentAndAutoLaunch(selectedCourse);
                    }}
                    className="w-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white font-black text-[11px] uppercase tracking-wider py-3.5 rounded-xl shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Authorize Payment
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* FULLY FUNCTIONAL ISO CERTIFICATE OF COMPLETION MODAL */}
      {showCertificateId && (
        (() => {
          const certCourse = courses.find(c => c.id === showCertificateId);
          if (!certCourse) return null;
          return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-[#120e2a] border-4 border-double border-yellow-500/40 text-white rounded-[2rem] max-w-2xl w-full p-8 space-y-6 shadow-2xl relative text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-yellow-500/20 rounded-tl-xl pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-yellow-500/20 rounded-br-xl pointer-events-none"></div>
                
                <button 
                  onClick={() => setShowCertificateId(null)}
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
                      {candidateName}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold max-w-md mx-auto">
                      for outstandingly completing all educational syllabus units, mock exams, and practical sandbox code challenges under the program
                    </p>
                    <h4 className="text-base font-black text-yellow-100 max-w-lg mx-auto">
                      "{certCourse.title}"
                    </h4>
                  </div>

                  <div className="flex justify-between items-center text-left text-[10px] font-semibold text-slate-400">
                    <div>
                      <span className="block text-slate-500 uppercase font-bold text-[8px]">Verification ID</span>
                      <span className="font-mono text-slate-300">CERT-{certCourse.id.toUpperCase()}-{Date.now().toString().slice(-6)}</span>
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
                      onClick={() => setShowCertificateId(null)}
                      className="px-5 py-2.5 bg-[#1b143c] border border-[#2d2163] text-slate-300 hover:text-white font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })()
      )}

      {/* CREATIVE AUTO-LAUNCH LOADER OVERLAY */}
      {isAutoLaunching && launchedCourseObj && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#0a0715]/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-[#120e2a] border border-[#3c2a82]/60 rounded-3xl p-8 shadow-[0_0_50px_rgba(124,58,237,0.3)] text-center relative overflow-hidden space-y-6">
            {/* Glowing background highlights */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#7c3aed]/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#00e676]/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#00e676] flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00e676] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                🔒 Security Verified
              </span>
              <h3 className="text-xl font-black text-white tracking-tight">
                Course Enrolled!
              </h3>
              <p className="text-xs text-slate-300 font-bold max-w-xs mx-auto truncate">
                {launchedCourseObj.title}
              </p>
            </div>

            {/* Simulated terminal logs style or steps */}
            <div className="bg-[#0c0824] border border-[#231a4f] rounded-2xl p-4 text-left font-mono space-y-2 text-[10px] text-slate-300 relative">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-bold uppercase">Arohi Live Syncer:</span>
              </div>
              <p className="leading-relaxed font-semibold min-h-[30px] text-[#a78bfa]">
                {launchStepText}
              </p>
            </div>

            {/* Custom Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400">
                <span>Ecosystem Handshake</span>
                <span className="text-[#00e676]">{launchProgress}%</span>
              </div>
              <div className="w-full bg-[#1c1642] h-2.5 rounded-full overflow-hidden border border-[#2e2166] p-0.5">
                <div 
                  className="bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#00e676] h-full rounded-full transition-all duration-100" 
                  style={{ width: `${launchProgress}%` }}
                ></div>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 font-medium">
              Initializing personalized interactive learning workspace. Please don't close this window.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
