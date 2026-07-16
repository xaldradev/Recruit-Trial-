/**
 * Recruit.org.in - Localized SEO Content Management Utility
 * Optimized for 2026 Google Core Web Vitals and Indian Regional Search Queries.
 * Provides rich, search-engine crawlable career advice, exam blueprints,
 * and state-specific metadata in native Indian languages.
 */

export interface CareerAdviceItem {
  state: string;
  nativeState: string;
  title: string;
  description: string;
  eligibility: string;
  preparationStrategy: string;
  keyAgencies: string[];
  trendingKeywords: string[];
}

export const regionalSeoAdvice: Record<string, Record<string, CareerAdviceItem>> = {
  OdishaGovt: {
    en: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "Odisha State Career Registry & Competitive Exam Guide",
      description: "Comprehensive preparation models for Odisha Staff Selection Commission (OSSC), Odisha Sub-Ordinate Staff Selection Commission (OSSSC), and Odisha Public Service Commission (OPSC) gazetted entries.",
      eligibility: "Minimum 10th/Matriculation with Odia language competency, 12th/+3 Arts/Science/Commerce graduation for Executive officer and block positions.",
      preparationStrategy: "Focus deeply on Odisha General Knowledge, history, geography, and current local schemes (MUKTA, KALIA, BSKY). Daily arithmetic practice and standard computer awareness models are mandatory for OSSSC Junior Clerks.",
      keyAgencies: ["OSSC (Staff Selection)", "OSSSC (Sub-ordinate Staff)", "OPSC (Civil Services)", "OSRTC (Transport)"],
      trendingKeywords: ["OSSSC Junior Assistant preparation", "Odisha RI AMIN syllabus 2026", "OSSC exam dates Odisha", "Odisha forest guard admit card"]
    },
    or: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ଓଡ଼ିଶା ରାଜ୍ୟ ସରକାରୀ ଚାକିରି ଏବଂ ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି ମାର୍ଗଦର୍ଶିକା",
      description: "ଓଡ଼ିଶା କର୍ମଚାରୀ ଚୟନ ଆୟୋଗ (OSSC), ଓଡ଼ିଶା ଅଧସ୍ତନ କର୍ମଚାରୀ ଚୟନ ଆୟୋଗ (OSSSC) ଏବଂ ଓଡ଼ିଶା ଲୋକ ସେବା ଆୟୋଗ (OPSC) ପରୀକ୍ଷା ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରସ୍ତୁତି ମଡେଲ।",
      eligibility: "ଓଡ଼ିଆ ଭାଷାରେ ଯୋଗ୍ୟତା ସହିତ ସର୍ବନିମ୍ନ ଦଶମ ଶ୍ରେଣୀ, କାର୍ଯ୍ୟନିର୍ବାହୀ ଅଧିକାରୀ ଏବଂ ବ୍ଲକ ସ୍ତରୀୟ ପଦବୀ ପାଇଁ ଦ୍ୱାଦଶ/+୩ ସ୍ନାତକ ଶ୍ରେଣୀ ପାସ।",
      preparationStrategy: "ଓଡ଼ିଶା ସାଧାରଣ ଜ୍ଞାନ (Odisha GK), ଇତିହାସ, ଭୂଗୋଳ ଏବଂ ସାମ୍ପ୍ରତିକ ରାଜ୍ୟ ଯୋଜନା (MUKTA, KALIA, BSKY) ଉପରେ ବିଶେଷ ଧ୍ୟାନ ଦିଅନ୍ତୁ। OSSSC କନିଷ୍ଠ ସହାୟକ ପାଇଁ ଦୈନିକ ଗଣିତ ଏବଂ କମ୍ପ୍ୟୁଟର ଜ୍ଞାନ ଅଭ୍ୟାସ ଅତ୍ୟନ୍ତ ଜରୁରୀ।",
      keyAgencies: ["OSSC (କର୍ମଚାରୀ ଚୟନ ଆୟୋଗ)", "OSSSC (ଅଧସ୍ତନ କର୍ମଚାରୀ ଆୟୋଗ)", "OPSC (ଲୋକ ସେବା ଆୟୋଗ)"],
      trendingKeywords: ["ଓଡ଼ିଶା ସରକାରୀ ଚାକିରି ୨୦୨୬", "OSSSC କନିଷ୍ଠ ସହାୟକ ପରୀକ୍ଷା", "ଓଡ଼ିଶା ରାଜସ୍ୱ ନିରୀକ୍ଷକ (RI) ସିଲାବସ"]
    },
    hi: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ओडिशा राज्य करियर रजिस्ट्री और प्रतियोगी परीक्षा गाइड",
      description: "ओडिशा कर्मचारी चयन आयोग (OSSC), ओडिशा अधीनस्थ कर्मचारी चयन आयोग (OSSSC) और ओडिशा लोक सेवा आयोग (OPSC) राजपत्रित प्रविष्टियों के लिए व्यापक तैयारी मॉडल।",
      eligibility: "उड़िया भाषा दक्षता के साथ न्यूनतम 10वीं/मैट्रिकुलेशन, कार्यकारी अधिकारी और ब्लॉक पदों के लिए 12वीं/+3 कला/विज्ञान/वाणिज्य स्नातक।",
      preparationStrategy: "ओडिशा सामान्य ज्ञान, इतिहास, भूगोल और वर्तमान स्थानीय योजनाओं (MUKTA, KALIA, BSKY) पर गहराई से ध्यान केंद्रित करें। दैनिक अंकगणित अभ्यास और मानक कंप्यूटर जागरूकता मॉडल OSSSC जूनियर क्लर्क के लिए अनिवार्य हैं।",
      keyAgencies: ["OSSC (कर्मचारी चयन)", "OSSSC (अधीनस्थ कर्मचारी)", "OPSC (सिविल सेवा)"],
      trendingKeywords: ["ओडिशा सरकारी नौकरी", "OSSSC जूनियर क्लर्क एडमिट कार्ड", "ओडिशा वन रक्षक भर्ती 2026"]
    }
  },
  AllIndiaGovt: {
    en: {
      state: "All India / Central",
      nativeState: "भारत",
      title: "Union and All India Government Career Framework",
      description: "Official advisory, recruitment cycles, and syllabus details for Staff Selection Commission (SSC CGL/CHSL), Railway Recruitment Boards (RRB NTPC/Group D), and Banking (IBPS, SBI).",
      eligibility: "Ranges from Matriculation (10th) for Multi-Tasking Staff to Bachelor's Degree in any discipline for Officers/Probationary Officers.",
      preparationStrategy: "Master quantitative aptitude, logical reasoning, verbal English competency, and comprehensive National Current Affairs. Practice CBT (Computer Based Test) mock assessments weekly.",
      keyAgencies: ["SSC (Staff Selection Commission)", "RRB (Railway Recruitment Board)", "IBPS (Institute of Banking)", "UPSC (Union Public Services)"],
      trendingKeywords: ["SSC CGL online application", "RRB NTPC vacancy calendar 2026", "IBPS PO syllabus PDF", "Sarkari Exam Notification India"]
    },
    hi: {
      state: "All India / Central",
      nativeState: "भारत",
      title: "केंद्रीय एवं अखिल भारतीय सरकारी करियर ढांचा",
      description: "कर्मचारी चयन आयोग (SSC CGL/CHSL), रेलवे भर्ती बोर्ड (RRB NTPC/Group D), और बैंकिंग (IBPS, SBI) के लिए आधिकारिक सलाह, भर्ती चक्र और पाठ्यक्रम विवरण।",
      eligibility: "मल्टी-टास्किंग स्टाफ के लिए मैट्रिकुलेशन (10वीं) से लेकर अधिकारियों/परिवीक्षाधीन अधिकारियों के लिए किसी भी विषय में स्नातक डिग्री तक।",
      preparationStrategy: "मात्रात्मक योग्यता, तार्किक विचार, मौखिक अंग्रेजी क्षमता और व्यापक राष्ट्रीय करंट अफेयर्स में महारत हासिल करें। साप्ताहिक रूप से कंप्यूटर आधारित टेस्ट (CBT) मॉक टेस्ट का अभ्यास करें।",
      keyAgencies: ["SSC (कर्मचारी चयन आयोग)", "RRB (रेलवे भर्ती बोर्ड)", "IBPS (बैंकिंग संस्थान)", "UPSC (संघ लोक सेवा आयोग)"],
      trendingKeywords: ["एसएससी सीजीएल ऑनलाइन आवेदन", "रेलवे भर्ती अधिसूचना 2026", "सरकारी नौकरी अलर्ट इंडिया"]
    },
    or: {
      state: "All India / Central",
      nativeState: "भारत",
      title: "ସଂଘ ଏବଂ ସମଗ୍ର ଭାରତ ସରକାରୀ ଚାକିରି ପ୍ରସ୍ତୁତି କୋଷ",
      description: "ଷ୍ଟାଫ୍ ସିଲେକସନ୍ କମିଶନ (SSC CGL/CHSL), ରେଲୱେ ନିଯୁକ୍ତି ବୋର୍ଡ (RRB NTPC) ଏବଂ ବ୍ୟାଙ୍କିଙ୍ଗ୍ (IBPS, SBI) ପରୀକ୍ଷା ପାଇଁ ଗାଇଡ୍।",
      eligibility: "ଦଶମ ଶ୍ରେଣୀ ପାସ ଠାରୁ ଆରମ୍ଭ କରି ଯେକୌଣସି ବିଷୟରେ ସ୍ନାତକ ଡିଗ୍ରୀ ହାସଲ କରିଥିବା ପ୍ରାର୍ଥୀ ଯୋଗ୍ୟ।",
      preparationStrategy: "ଆରିଥମେଟିକ୍, ରିଜନିଙ୍ଗ୍, ଇଂରାଜୀ ବ୍ୟାକରଣ ଏବଂ ଜାତୀୟ ସାମ୍ପ୍ରତିକ ଘଟଣାବଳୀ ଉପରେ ବିଶେଷ ଦକ୍ଷତା ପ୍ରତିପାଦନ କରନ୍ତୁ। ପ୍ରତି ସପ୍ତାହରେ କମ୍ପ୍ୟୁଟର ଆଧାରିତ ମକ୍ ଟେଷ୍ଟ ଦିଅନ୍ତୁ।",
      keyAgencies: ["SSC (ଷ୍ଟାଫ୍ ସିଲେକସନ୍)", "RRB (ରେଲୱେ ନିଯୁକ୍ତି ବୋର୍ଡ)", "IBPS (ବ୍ୟାଙ୍କ ନିଯୁକ୍ତି ସଂସ୍ଥା)"],
      trendingKeywords: ["କେନ୍ଦ୍ର ସରକାରୀ ଚାକିରି ୨୦୨୬", "ରେଲୱେ ଏନଟିପିସି ପରୀକ୍ଷା", "ଭାରତୀୟ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ସିଲାବସ"]
    }
  }
};

/**
 * Returns localized career advice tailored to a specific state or central region, 
 * falling back to AllIndiaGovt and English if not defined.
 */
export function getRegionalCareerAdvice(region: string, language: string): CareerAdviceItem {
  const targetRegion = regionalSeoAdvice[region] || regionalSeoAdvice['AllIndiaGovt'];
  const targetAdvice = targetRegion[language] || targetRegion['en'] || targetRegion[Object.keys(targetRegion)[0]];
  return targetAdvice;
}

/**
 * Generates rich HTML schema markup to boost Google rich snippet visibility.
 */
export function generateFAQSchema(advice: CareerAdviceItem) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the eligibility for ${advice.state} government jobs?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": advice.eligibility
        }
      },
      {
        "@type": "Question",
        "name": `How should I prepare for competitive examinations in ${advice.state}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": advice.preparationStrategy
        }
      }
    ]
  };
}
