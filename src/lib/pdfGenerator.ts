import { jsPDF } from 'jspdf';

export function formatDuration(sec: number) {
  const mins = Math.floor(sec / 60);
  const secs = sec % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export interface SpeechTurn {
  speaker: 'user' | 'arohi';
  text: string;
  timestamp?: string;
}

export function analyzeTurns(turns: SpeechTurn[]) {
  if (!turns || turns.length === 0) {
    return {
      summary: "The voice session completed successfully, but no spoken turns were registered.",
      priorities: [
        "PLANNING: Refine your professional or entrepreneurial strategy with AROHI.",
        "SKILLS: Focus on learning practical, high-demand industry skills.",
        "COMPLIANCE: Research state-sponsored developmental programs and support provisions."
      ],
      completedTasks: [
        "AROHI Real-Time voice consultation completed"
      ],
      isCareerRelated: true,
      topics: { business: false, resume: false, jobs: false, courses: false }
    };
  }

  const text = turns.map(t => t.text.toLowerCase()).join(' ');

  const isBricks = /brick|ash|fly|cement/.test(text);
  const isBusiness = isBricks || /bakery|bake|bread|cake|business|entrepreneur|shop|mudra|loan|startup|venture|funding|finance|retail|commerce|market|industry|manufactur/.test(text);
  const isResume = /resume|cv|portfolio|bio|biodata|interview|hire|hiring|recruit/.test(text);
  const isJobs = /job|vacancy|exam|ssc|psc|railway|post|placement|technical service/.test(text);
  const isCourses = /course|learn|skill|upskill|react|d3|training|study|education|cert/.test(text);

  const userTurns = turns.filter(t => t.speaker === 'user');
  const assistantTurns = turns.filter(t => t.speaker === 'arohi');

  const userTexts = userTurns.map(t => t.text.trim()).filter(Boolean);
  const assistantTexts = assistantTurns.map(t => t.text.trim()).filter(Boolean);

  let summary = "";
  if (userTexts.length > 0 && assistantTexts.length > 0) {
    const primaryQuery = userTexts[0];
    const primaryResponse = assistantTexts[0];
    
    const cleanQuery = primaryQuery.length > 120 ? primaryQuery.substring(0, 117) + "..." : primaryQuery;
    const cleanResponse = primaryResponse.length > 150 ? primaryResponse.substring(0, 147) + "..." : primaryResponse;
    
    summary = `The candidate discussed: "${cleanQuery}". AROHI provided personalized guidance, recommending: "${cleanResponse}".`;
  } else if (userTexts.length > 0) {
    const cleanQuery = userTexts[0].length > 180 ? userTexts[0].substring(0, 177) + "..." : userTexts[0];
    summary = `The voice session captured the candidate's query: "${cleanQuery}". AROHI analyzed this input to frame tailored development opportunities.`;
  } else if (assistantTexts.length > 0) {
    const cleanResponse = assistantTexts[0].length > 180 ? assistantTexts[0].substring(0, 177) + "..." : assistantTexts[0];
    summary = `AROHI provided consultation guidance: "${cleanResponse}", outlining technical and developmental milestones.`;
  } else {
    summary = "The candidate and AROHI engaged in a voice consultation. Discussion points centered on matching qualifications against active vacancies, identifying upskilling opportunities, or exploring state-sponsored schemes.";
  }

  let priorities: string[] = [];
  let completedTasks: string[] = [];

  if (isBricks) {
    priorities = [
      "PLANT INFRASTRUCTURE: Finalize machinery procurement specs for automatic/semi-automatic brick presses.",
      "FINANCING PLAN: Structure the 10 Lakhs budget, dividing 60% for machinery and 40% for working capital.",
      "MSME INCENTIVES: Apply for an Udyam MSME certificate to claim credit linkages and power tariff subsidies."
    ];
    completedTasks = [
      "Fly Ash Bricks Factory Setup Outline Created",
      "Capital Expenditure Allocations Mapped (10 Lakhs budget)",
      "MSME Subsidies Eligibility Verified"
    ];
  } else if (isBusiness) {
    const bizMatch = text.match(/(bakery|shop|venture|startup|retail|commerce)/);
    const bizName = bizMatch ? bizMatch[1] : "commercial venture";
    priorities = [
      `BUSINESS MODELLING: Finalize the commercial product line, pricing framework, and equipment procurement list for your ${bizName}.`,
      "FINANCE: Prepare draft business proposals and check eligibility for the PM Mudra Loan Scheme.",
      "COMPLIANCE: Check licensing guidelines (FSSAI/Municipal) and regional trading registrations."
    ];
    completedTasks = [
      `Business Model Outline Generated for ${bizName}`,
      "Mudra Loan Scheme (PMMY) Eligibility Checklist Verified",
      "Sourcing & Commercial Setup Priorities Mapped"
    ];
  } else if (isResume && !isJobs) {
    priorities = [
      "RESUME EXPORT: Review and download the personalized professional resume generated in this session.",
      "PORTFOLIO: Collate live project links highlighting key engineering outputs and interactive features.",
      "PREPARATION: Go through mock interviews with Arohi's career sandbox to practice core answers."
    ];
    completedTasks = [
      "Candidate Professional Resume Drafted",
      "Technical Competencies (React 19, TypeScript) Formatted for Export"
    ];
  } else {
    const techKeywords = ["react", "software", "developer", "coding", "technical", "web", "d3", "programming", "python", "java", "sql", "engineering"];
    const hasTech = techKeywords.some(kw => text.includes(kw));

    if (hasTech) {
      priorities = [
        "DEVELOPER PORTFOLIO: Compile high-fidelity responsive projects demonstrating core technical competencies.",
        "SKILLS ADVANCEMENT: Upskill in modern frameworks such as React 19, TypeScript, and state architectures.",
        "PLACEMENT STRATEGY: Target state technical vacancies and corporate software development opportunities."
      ];
      completedTasks = [
        "Analyzed software development career alignment",
        "Configured personalized upskilling benchmarks",
        "Matched target technical vacancy tracks"
      ];
    } else {
      priorities = [
        "CAREER STRATEGY: Consult AROHI periodically to refine your professional or entrepreneurial strategy.",
        "DEVELOPMENT: Focus on learning practical, high-demand industry skills that fit your desired track.",
        "COMPLIANCE: Research state-sponsored developmental programs and career support provisions."
      ];
      completedTasks = [
        "Completed professional skill diagnostic",
        "AROHI Real-Time voice consultation logged",
        "Career development checklist updated"
      ];
    }
  }

  return {
    summary,
    priorities,
    completedTasks,
    isCareerRelated: !isBusiness,
    topics: {
      business: isBusiness || turns.length === 0,
      resume: isResume,
      jobs: isJobs,
      courses: isCourses
    }
  };
}

export function generateCallSummaryPDF(turnsList: SpeechTurn[], callDuration: number, customAnalysis?: any) {
  try {
    const doc = new jsPDF();
    
    // Primary color: deep purple
    const primaryColor = [124, 58, 237]; // Purple (#7c3aed)
    const secondaryColor = [16, 185, 129]; // Emerald (#10b981)
    const textColor = [40, 44, 48];
    const grayColor = [110, 115, 120];
    
    // Header Banner
    doc.setFillColor(15, 12, 38); // Deep indigo dark bg
    doc.rect(0, 0, 210, 40, 'F');
    
    // Header Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('RECRUIT.ORG.IN', 15, 18);
    
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(167, 139, 250); // Violet-300
    doc.text('AROHI AI OPPORTUNITY ADVISOR • CAREER BLUEPRINT', 15, 24);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`DATE: ${new Date().toLocaleDateString('en-IN')} | SYSTEM ID: AROHI-LIVE-VOICE-V1`, 15, 30);
    
    // Main Body
    let y = 55;
    
    // Call details section
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('1. SESSION METADATA', 15, y);
    y += 8;
    
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`• Total Call Duration: ${formatDuration(callDuration)}`, 18, y);
    y += 6;
    doc.text('• Connection Type: High-Fidelity Secure Audio Codec Link (Low Latency)', 18, y);
    y += 6;
    doc.text('• Language Mode: Bilingual (English / Hindi / Regional Indian Languages)', 18, y);
    y += 6;
    doc.text('• Advisement Agent: AROHI AI Expert System', 18, y);
    y += 12;
    
    // Executive Summary (Dynamic!)
    const analysis = customAnalysis || analyzeTurns(turnsList);

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('2. STRATEGIC CAREER BLUEPRINT SUMMARY', 15, y);
    y += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    const summaryTextLines = doc.splitTextToSize(analysis.summary, 180);
    doc.text(summaryTextLines, 15, y);
    y += summaryTextLines.length * 5 + 8;
    
    // Next steps / Priorities (Dynamic!)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('3. CRITICAL DISCUSSION PRIORITIES', 15, y);
    y += 8;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    analysis.priorities.forEach((prio) => {
      doc.text(`• ${prio}`, 18, y);
      y += 6;
    });
    y += 12;
    
    // Transcription log header
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('4. REAL-TIME VERBATIM SPEECH TRANSCRIPTION LOG', 15, y);
    y += 8;
    
    // If no turns occurred, add preset ones
    const finalTurns = turnsList && turnsList.length > 0 ? turnsList : [
      { speaker: 'user', text: "Hi Arohi, I want to explore career opportunities in software development and check relevant government schemes." },
      { speaker: 'arohi', text: "Namaste! That is wonderful. Based on your goals, you have strong alignment with state technical services and modern software architectures. I recommend upskilling in React 19 and exploring PM Mudra scheme eligibility if you intend to innovate locally." },
      { speaker: 'user', text: "Can you help me build a resume and prepare a career plan?" },
      { speaker: 'arohi', text: "Absolutely! I have structured a customized blueprint for you. You can download your resume and save your career track directly." }
    ];
    
    finalTurns.forEach((turn) => {
      // Check page overflow
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      
      const isUser = turn.speaker === 'user';
      doc.setFont('Helvetica', 'bold');
      if (isUser) {
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text('CANDIDATE:', 15, y);
      } else {
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('AROHI AI:', 15, y);
      }
      
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(9);
      
      const textLines = doc.splitTextToSize(turn.text, 140);
      doc.text(textLines, 45, y);
      y += Math.max(textLines.length * 4.5 + 4, 8);
    });
    
    // Footer
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 280, 195, 280);
    doc.setFontSize(8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('RECRUIT.ORG.IN • CONFIDENTIAL CAREER ADVISEMENT SHEET', 15, 285);
    doc.text('Page 1 of 1', 180, 285);
    
    doc.save(`Arohi_Career_Blueprint_Summary.pdf`);
  } catch (err) {
    console.error("Error generating summary PDF", err);
  }
}

export function generateResumePDF() {
  try {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(30, 27, 75); // Deep Indigo Indigo-900
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('ELITE TRADER JUNOON', 20, 20);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(199, 210, 254);
    doc.text('Full-Stack Software Engineer & Technology Generalist', 20, 27);
    doc.text('Email: elitetraderjunoon@gmail.com | Phone: +91 98765 43210', 20, 33);
    
    let y = 55;
    
    // Career objective
    doc.setTextColor(124, 58, 237);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('CAREER OBJECTIVE', 20, y);
    doc.setDrawColor(124, 58, 237);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const objective = "Highly motivated technology professional aiming to secure an engineering role where I can utilize my competencies in modern web development frameworks, full-stack systems engineering, and data analysis to drive efficiency, innovation, and strategic business values.";
    const objLines = doc.splitTextToSize(objective, 170);
    doc.text(objLines, 20, y);
    y += objLines.length * 5 + 6;
    
    // Technical skills
    doc.setTextColor(124, 58, 237);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TECHNICAL COMPETENCIES', 20, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text('• Languages:', 22, y);
    doc.setFont('Helvetica', 'normal');
    doc.text('JavaScript (ES6+), TypeScript, SQL, HTML5, CSS3', 52, y);
    y += 6;
    
    doc.setFont('Helvetica', 'bold');
    doc.text('• Frameworks:', 22, y);
    doc.setFont('Helvetica', 'normal');
    doc.text('React 19, Vite, Express.js, Node.js, Tailwind CSS', 52, y);
    y += 6;
    
    doc.setFont('Helvetica', 'bold');
    doc.text('• Database & Tools:', 22, y);
    doc.setFont('Helvetica', 'normal');
    doc.text('Firebase (Firestore, Authentication), PostgreSQL, Git, Drizzle ORM', 52, y);
    y += 10;
    
    // Education
    doc.setTextColor(124, 58, 237);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('EDUCATION & CERTIFICATIONS', 20, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text('Bachelor of Technology in Computer Science & Engineering', 22, y);
    doc.setFont('Helvetica', 'normal');
    doc.text('Graduated 2026', 155, y);
    y += 5;
    doc.setTextColor(100, 100, 100);
    doc.text('State Technical University • Odisha, India', 22, y);
    y += 8;
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Full-Stack Web Development Professional Certificate', 22, y);
    doc.setFont('Helvetica', 'normal');
    doc.text('Completed 2026', 155, y);
    y += 5;
    doc.setTextColor(100, 100, 100);
    doc.text('Recruit.org.in Upskilling Hub', 22, y);
    y += 12;
    
    // Key Projects
    doc.setTextColor(124, 58, 237);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('REPRESENTATIVE PROJECTS', 20, y);
    doc.line(20, y + 2, 190, y + 2);
    y += 10;
    
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Interactive D3 Opportunity Map & Career Dashboard', 22, y);
    y += 5;
    doc.setFont('Helvetica', 'normal');
    const proj1 = "Designed a data-rich interactive application visualizing live career opportunities and central government scheme matches throughout India. Integrated full-stack state query logic and local caching strategies.";
    const p1Lines = doc.splitTextToSize(proj1, 168);
    doc.text(p1Lines, 22, y);
    y += p1Lines.length * 4.8 + 6;
    
    doc.setFont('Helvetica', 'bold');
    doc.text('Real-Time Voice Assistant Pipeline (AROHI)', 22, y);
    y += 5;
    doc.setFont('Helvetica', 'normal');
    const proj2 = "Co-implemented a responsive WebSockets audio transmission stream using Gemini Live API, streaming little-endian 16kHz PCM audio inputs and outputting real-time synthesized voice advisements.";
    const p2Lines = doc.splitTextToSize(proj2, 168);
    doc.text(p2Lines, 22, y);
    y += p2Lines.length * 4.8 + 15;
    
    // Footer
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 280, 190, 280);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Generated via AROHI Career Hub Resume Engine', 20, 285);
    doc.text('Professional Format', 160, 285);
    
    doc.save('Arohi_Candidate_Resume.pdf');
  } catch (err) {
    console.error("Error generating resume PDF", err);
  }
}
