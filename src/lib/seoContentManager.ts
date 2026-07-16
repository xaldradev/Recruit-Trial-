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
      title: "ଓଡ଼ିଶା ରାଜ୍ୟ ସରକାରୀ ଚାକିରି ଏବଂ ପରୀକ୍ଷା ପ୍ରସ୍ତուତି ମାର୍ଗଦର୍ଶିକା",
      description: "ଓଡ଼ିଶା କର୍ମଚାରୀ ଚୟନ ଆୟୋଗ (OSSC), ଓଡ଼ିଶା ଅଧସ୍ତନ କର୍ਮଚାରୀ ଚୟନ ଆୟୋଗ (OSSSC) ଏବଂ ଓଡ଼ିଶା ଲୋକ ସେବା ଆୟୋਗ (OPSC) ପରୀକ୍ଷା ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରସ୍ତուତି ମଡେଲ।",
      eligibility: "ଓଡ଼ିଆ ଭାଷାରେ ଯୋଗ୍ୟତା ସହିତ ସର୍ବନିମ୍ନ ଦଶମ ଶ୍ରေଣୀ, କାର୍ଯ୍ୟନିର୍ବାหୀ ଅଧିକାରୀ ଏବଂ ବ୍ଲକ ସ୍ତରୀୟ ପଦବୀ ପାଇଁ ଦ୍ୱାଦଶ/+୩ ସ୍ନାତକ ଶ୍ରେଣୀ ପାସ।",
      preparationStrategy: "ଓଡ଼ିଶା ସାଧାରଣ ଜ୍ଞାନ (Odisha GK), ଇତିହାସ, ଭୂଗୋଳ ଏବଂ ସାମ୍ପ୍ରତିକ ରାଜ୍ୟ ଯୋଜନା (MUKTA, KALIA, BSKY) ଉପରେ ବିଶେष ଧ୍ୟାନ ଦିଅନ୍ତୁ। OSSSC କନିଷ୍ଠ ସହାୟକ ପାଇଁ ଦୈନିକ ଗଣିତ ଏବଂ କମ୍ପ୍ୟୁଟର ଜ୍ଞାନ ଅଭ୍ୟାସ ଅତ୍ୟନ୍ତ ଜରୁରୀ।",
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
    },
    bn: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ওড়িশা রাজ্য ক্যারিয়ার রেজিস্ট্রি এবং প্রতিযোগিতামূলক পরীক্ষার গাইড",
      description: "ওড়িশা স্টাফ সিলেকশন কমিশন (OSSC), ওড়িশা সাব-অর্ডিনেট স্টাফ সিলেকশন কমিশন (OSSSC) এবং ওড়িশা পাবলিক সার্ভিস কমিশন (OPSC) পরীক্ষার সম্পূর্ণ প্রস্তুতি মডেল।",
      eligibility: "ওড়িয়া ভাষায় দক্ষতাসহ ন্যূনতম ১০ম শ্রেণী এবং অন্যান্য পদের জন্য দ্বাদশ/+৩ স্নাতক শ্রেণী পাস।",
      preparationStrategy: "ওড়িশার সাধারণ জ্ঞান (Odisha GK), ইতিহাস, ভূগোল এবং বর্তমান রাজ্য সরকারি প্রকল্পের (MUKTA, KALIA, BSKY) ওপর বিশেষ জোর দিন। দৈনিক পাটিগণিত এবং কম্পিউটার সচেতনতা অত্যন্ত জরুরি।",
      keyAgencies: ["OSSC (স্টাফ সিলেকশন)", "OSSSC (অধস্তন কর্মী চয়ন)", "OPSC (পাবলিক সার্ভিস)"],
      trendingKeywords: ["ওড়িশা সরকারি চাকরি ২০২৬", "OSSSC জুনিয়র অ্যাসিস্ট্যান্ট সিলেবাস", "ওড়িশা আমীন পরীক্ষা প্রস্তুতি"]
    },
    te: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ఒడిశా రాష్ట్ర కెరీర్ రిజిస్ట్రీ & పోటీ పరీక్షల గైడ్",
      description: "ఒడిశా స్టాఫ్ సెలక్షన్ కమిషన్ (OSSC), ఒడిశా సబ్-ఆర్డినేట్ స్టాఫ్ సెలక్షన్ కమిషన్ (OSSSC) మరియు ఒడిశా పబ్లిక్ సర్వీస్ కమిషన్ (OPSC) పరీక్షల సమగ్ర ప్రిపరేషన్ మోడల్స్.",
      eligibility: "ఒడియా భాషా ప్రావీణ్యంతో కనీసం 10వ తరగతి, ఎగ్జిక్యూటివ్ మరియు డిగ్రీ ఉత్తీర్ణత.",
      preparationStrategy: "ఒడిశా జనరల్ నాలెడ్జ్, చరిత్ర, భూగోళశాస్త్రం మరియు స్థానిక ప్రభుత్వ పథకాలపై (MUKTA, KALIA, BSKY) ప్రత్యేకంగా దృష్టి పెట్టండి.",
      keyAgencies: ["OSSC (స్టాఫ్ సెలక్షన్)", "OSSSC (సబ్-ఆర్డినేట్ స్టాఫ్)", "OPSC (పబ్లిక్ సర్వీస్)"],
      trendingKeywords: ["ఒడిశా ప్రభుత్వ ఉద్యోగాలు", "OSSSC జూనియర్ అసిస్టెంట్ సిలబస్", "ఒడిశా RI AMIN పరీక్షలు"]
    },
    mr: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ओडिशा राज्य करिअर नोंदणी आणि स्पर्धा परीक्षा मार्गदर्शक",
      description: "ओडिशा कर्मचारी निवड आयोग (OSSC), ओडिशा अधीनस्थ कर्मचारी निवड आयोग (OSSSC) आणि ओडिशा लोकसेवा आयोग (OPSC) स्पर्धा परीक्षांसाठी व्यापक तयारी मॉडेल.",
      eligibility: "ओडिया भाषा प्राविण्यासह किमान १० वी उत्तीर्ण, कार्यकारी अधिकारी आणि ब्लॉक स्तरावरील पदांसाठी १२ वी/+३ पदवीधर.",
      preparationStrategy: "ओडिशाचे सामान्य ज्ञान (Odisha GK), इतिहास, भूगोल आणि राज्यातील चालू योजनांवर (MUKTA, KALIA, BSKY) लक्ष केंद्रित करा.",
      keyAgencies: ["OSSC (कर्मचारी निवड आयोग)", "OSSSC (अधीनस्थ कर्मचारी आयोग)", "OPSC (लोकसेवा आयोग)"],
      trendingKeywords: ["ओडिशा सरकारी नोकरी २०२६", "OSSSC लिपिक परीक्षा", "ओडिशा वनरक्षक भरती मार्गदर्शक"]
    },
    ta: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ஒடிசா மாநில தொழில் பதிவேடு & போட்டித் தேர்வு வழிகாட்டி",
      description: "ஒடிசா அரசுப் பணியாளர் தேர்வாணையம் (OSSC), ஒடிசா துணைப் பணியாளர் தேர்வாணையம் (OSSSC) மற்றும் ஒடிசா பொதுச் சேவை ஆணையம் (OPSC) தேர்வுகளுக்கான விரிவான வழிகாட்டி.",
      eligibility: "ஒடியா மொழித் திறனுடன் குறைந்தபட்சம் 10-ஆம் வகுப்பு தேர்ச்சி, நிர்வாக அதிகாரி மற்றும் பிற பதவிகளுக்கு 12-ஆம் வகுப்பு/+3 பட்டப்படிப்பு தேர்ச்சி.",
      preparationStrategy: "ஒடிசா பொது அறிவு, வரலாறு, புவியியல் மற்றும் தற்போதைய உள்ளூர் அரசு திட்டங்களில் (MUKTA, KALIA, BSKY) கவனம் செலுத்துங்கள்.",
      keyAgencies: ["OSSC (ஒடிசா பணியாளர் தேர்வு)", "OSSSC (துணைப் பணியாளர் தேர்வு)", "OPSC (பொதுச் சேவை)"],
      trendingKeywords: ["ஒடிசா அரசு வேலைகள் 2026", "OSSSC ஜூனியர் அசிஸ்டெண்ட் தேர்வு", "ஒடிசா வனக் காப்பாளர் பாடத்திட்டம்"]
    },
    gu: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ઓડિશા રાજ્ય કરિયર રજિસ્ટ્રી અને સ્પર્ધાત્મક પરીક્ષા માર્ગદર્શિકા",
      description: "ઓડિશા સ્ટાફ સિલેક્શન કમિશન (OSSC), ઓડિશા સબ-ઓર્ડિનેટ સ્ટાફ સિલેક્શન કમિશન (OSSSC) અને ઓડિશા પબ્લિક સર્વિસ કમિશન (OPSC) પરીક્ષાઓ માટે વિસ્તૃત તૈયારી મોડેલ.",
      eligibility: "ઓડિયા ભાષાની યોગ્યતા સાથે ન્યૂનતમ 10મું ધોરણ, વહીવટી અને બ્લોક સ્તરના પદો માટે 12મું ધોરણ/+3 સ્નાતક.",
      preparationStrategy: "ઓડિશા સામાન્ય જ્ઞાન, ઇતિહાસ, ભૂગોળ અને વર્તમાન સ્થાનિક યોજનાઓ (MUKTA, KALIA, BSKY) પર ઊંડાણપૂર્વક ધ્યાન આપો.",
      keyAgencies: ["OSSC (સ્ટાફ સિલેક્શન)", "OSSSC (અધીનસ્થ સ્ટાફ)", "OPSC (જાહેર સેવા આયોગ)"],
      trendingKeywords: ["ઓડિશા સરકારી નોકરીઓ 2026", "OSSSC જુનિયર આસિસ્ટન્ટ સિલેબસ", "ઓડિશા ફોરેસ્ટ ગાર્ડ ભરતી"]
    },
    ur: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "اوڈیشہ ریاستی کیریئر رجسٹری اور مسابقتی امتحان کی گائیڈ",
      description: "اوڈیشہ اسٹاف سلیکشن کمیشن (OSSC)، اوڈیشہ سب آرڈینیٹ اسٹاف سلیکشن کمیشن (OSSSC) اور اوڈیشہ پبلک سروس کمیشن (OPSC) کے امتحانات کا جامع ماڈલ۔",
      eligibility: "اوڈیا زبان کی مہارت کے ساتھ کم از کم دسویں جماعت, بلاک اور انتظامی عہدوں کے لیے بارہویں جماعت یا گریجویشن।",
      preparationStrategy: "اوڈیشہ کے عمومی معلومات، تاریخ، اور مقامی اسکیموں (MUKTA, KALIA, BSKY) پر توجہ دیں۔",
      keyAgencies: ["OSSC (اسٹاف سلیکشن)", "OSSSC (ذیلی اسٹاف سلیکشن)", "OPSC (پبلک سروس)"],
      trendingKeywords: ["اوڈیشہ سرکاری نوکریاں", "OSSSC امتحانی نصاب", "اوڈیشہ پبلک سروس بھرتی"]
    },
    kn: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ಒಡಿಶಾ ರಾಜ್ಯ ವೃತ್ತಿ ನೋಂದಣಿ ಮತ್ತು ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ಮಾರ್ಗದರ್ಶಿ",
      description: "ಒಡಿಶಾ ಸಿಬ್ಬಂದಿ ನೇಮಕಾತಿ ಆಯೋಗ (OSSC) ಮತ್ತು ಒಡಿಶಾ ಸಾರ್ವಜನಿಕ ಸೇವಾ ಆಯೋಗ (OPSC) ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಮಗ್ರ ಸಿದ್ಧತೆ ಮಾದರಿಗಳು.",
      eligibility: "ಒಡಿಯಾ ಭಾಷಾ ಪ್ರಾವೀಣ್ಯತೆಯೊಂದಿಗೆ ಕನಿಷ್ಠ 10 ನೇ ತರಗತಿ, ಬ್ಲಾಕ್ ಮಟ್ಟದ ಅಧಿಕಾರಿ ಹುದ್ದೆಗಳಿಗೆ ಪದವಿ.",
      preparationStrategy: "ಒಡಿಶಾ ಸಾಮಾನ್ಯ ಜ್ಞಾನ, ಇತಿಹಾಸ, ಭೂಗೋಳ ಮತ್ತು ಪ್ರಸ್ತುತ ಸ್ಥಳೀಯ ಯೋಜನೆಗಳ (MUKTA, KALIA, BSKY) ಮೇಲೆ ವಿಶೇಷ ಗಮನ ಹರಿಸಿ.",
      keyAgencies: ["OSSC (ಸಿಬ್ಬಂದಿ ಆಯೋಗ)", "OSSSC (ಅಧೀನ ಸಿಬ್ಬಂದಿ ಆಯೋಗ)", "OPSC (ಸಾರ್ವಜನಿಕ ಸೇವೆ)"],
      trendingKeywords: ["ಒಡಿಶಾ ಸರ್ಕಾರಿ ಹುದ್ದೆಗಳು", "OSSSC ಕಿರಿಯ ಸಹಾಯಕ ಪರೀಕ್ಷೆ", "ಒಡಿಶಾ ಅರಣ್ಯ ರಕ್ಷಕ ನೇಮಕಾತಿ"]
    },
    ml: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ഒഡീഷ സംസ്ഥാന കരിയർ രജിസ്ട്രിയും മത്സര പരീക്ഷാ സഹായിയും",
      description: "ഒഡീഷ സ്റ്റാഫ് സെലക്ഷൻ കമ്മീഷൻ (OSSC), ഒഡീഷ പബ്ലിക് സർവീസ് കമ്മീഷൻ (OPSC) പരീക്ഷകൾക്കുള്ള സമഗ്രമായ തയ്യാറെടുപ്പ് മോഡൽ.",
      eligibility: "ഒഡിയ ഭാഷാ പ്രാവീണ്യത്തോടെയുള്ള പത്താം ക്ലാസ്സ് വിജയം, എക്സിക്യൂട്ടീവ് തസ്തികകൾക്ക് പന്ത്രണ്ടാം ക്ലാസ്സ് അല്ലെങ്കിൽ ബിരുദം.",
      preparationStrategy: "ഒഡീഷ പൊതുവിജ്ഞാനം, ചരിത്രം, ഭൂമിശാസ്ത്രം, പ്രാദേശിക പദ്ധതികൾ (MUKTA, KALIA, BSKY) എന്നിവയ്ക്ക് മുൻഗണന നൽകുക.",
      keyAgencies: ["OSSC (സ്റ്റാഫ് സെലക്ഷൻ)", "OSSSC (സബ്-ഓർഡിനേറ്റ് സ്റ്റാഫ്)", "OPSC (പബ്ലിക് സർവീസ്)"],
      trendingKeywords: ["ഒഡീഷ സർക്കാർ ജോലികൾ", "OSSSC ജൂനിയർ അസിസ്റ്റന്റ് സിലബസ്", "ഒഡീഷ ഫോറസ്റ്റ് ഗാർഡ് അഡ്മിറ്റ് കാർഡ്"]
    },
    pa: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ਓਡੀਸ਼ਾ ਰਾਜ ਕਰੀਅਰ ਰਜਿਸਟਰੀ ਅਤੇ ਪ੍ਰਤੀਯੋਗੀ ਪ੍ਰੀਖਿਆ ਗਾਈਡ",
      description: "ਓਡੀਸ਼ਾ ਸਟਾਫ ਸਿਲੈਕਸ਼ਨ ਕਮਿਸ਼ਨ (OSSC) ਅਤੇ ਓਡੀਸ਼ਾ ਪਬਲਿਕ ਸਰਵਿਸ ਕਮਿਸ਼ਨ (OPSC) ਪ੍ਰੀਖਿਆਵਾਂ ਲਈ ਸੰਪੂርਨ ਤਿਆਰੀ ਮਾਡਲ।",
      eligibility: "ਓਡੀਆ ਭਾਸ਼ਾ ਦੀ ਯੋਗਤਾ ਨਾਲ ਘੱਟੋ-ਘੱਟ 10ਵੀਂ ਪਾਸ, ਹੋਰ ਅਹੁਦਿਆਂ ਲਈ 12ਵੀਂ ਜਾਂ ਗ੍ਰੈਜੂਏਸ਼ਨ ਪਾਸ।",
      preparationStrategy: "ਓਡੀਸ਼ਾ ਜਨਰਲ ਗਿਆਨ, ਇਤਿਹਾਸ, ਭੂਗੋਲ ਅਤੇ ਸਥਾਨਕ ਰਾਜ ਸਕੀਮਾਂ (MUKTA, KALIA, BSKY) 'ਤੇ ਵਿਸ਼ੇਸ਼ ਧਿਆਨ ਦਿਓ।",
      keyAgencies: ["OSSC (ਸਟਾਫ ਸਿਲੈਕਸ਼ਨ)", "OSSSC (ਅਧੀਨ ਸਟਾਫ)", "OPSC (ਲੋਕ ਸେਵਾ ਕਮਿਸ਼ਨ)"],
      trendingKeywords: ["ਓਡੀਸ਼ਾ ਸਰਕਾਰੀ ਨੌਕਰੀਆਂ 2026", "OSSSC ਜੂਨੀਅਰ ਸਹਾਇਕ ਸਿਲੇਬਸ", "ਓਡੀਸ਼ਾ ਆਮੀਨ ਭਰਤੀ"]
    },
    as: {
      state: "Odisha",
      nativeState: "ଓଡ଼ିଶା",
      title: "ওড়িশা ৰাজ্য কেৰিয়াৰ পঞ্জীয়ন আৰু প্ৰতিযোগিতামূলক পৰীক্ষাৰ নিৰ্দেশিকা",
      description: "ওড়িশা কৰ্মচাৰী চয়ন আয়োগ (OSSC) আৰু ওড়িশা লোক সেৱা আয়োগ (OPSC) পৰীক্ষাসমূহৰ বাবে সম্পূৰ্ণ প্ৰস্তুতিৰ গাইড।",
      eligibility: "ওড়িয়া ভাষাৰ যোগ্যতাসহ ন্যূনতম ১০ম শ্ৰেণী আৰু উচ্চ পদসমূহৰ বাবে স্নাতক ডিগ্ৰীধাৰী।",
      preparationStrategy: "ওড়িশা সাধাৰণ জ্ঞান, বুৰঞ্জী, ভূগোল আৰু সাম্প্ৰতিক ৰাজ্যিক আঁচনিসমূহৰ (MUKTA, KALIA, BSKY) ওপৰত গুৰুত্ব দিয়ক।",
      keyAgencies: ["OSSC (কৰ্মচাৰী চয়ন)", "OSSSC (অধীন কৰ্মচাৰী)", "OPSC (লোক সেৱা)"],
      trendingKeywords: ["ওড়িশা চৰকাৰী চাকৰি ২০২৬", "OSSSC জুনিয়ৰ এচিচটেন্ট সিলেবাচ", "ওড়িশা আমিন পৰীক্ষা"]
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
      title: "ସଂଘ ଏବଂ ସମଗ୍ର ଭାରତ ସରକାରୀ ଚାକିରି ପ୍ରସ୍ତուତି କୋଷ",
      description: "ଷ୍ଟାଫ୍ ସିଲେକସନ୍ କମିଶନ (SSC CGL/CHSL), ରେଲୱେ ନିଯուକ୍ତି ବୋର୍ଡ (RRB NTPC) ଏବଂ ବ୍ୟାଙ୍କିଙ୍ଗ୍ (IBPS, SBI) ପରୀକ୍षा ପାଇଁ ଗାଇଡ୍।",
      eligibility: "ଦଶମ ଶ୍ରେଣୀ ପାସ ଠାରୁ ଆରମ୍ଭ କରି ଯେକୌଣସି ବିଷୟରେ ସ୍ନାତକ ଡିଗ୍ରୀ ହାସଲ କରିଥିବା ପ୍ରାର୍ଥୀ ଯୋଗ୍ୟ।",
      preparationStrategy: "ଆରିଥମେଟିକ୍, ରିଜନିଙ୍ଗ୍, ଇଂରାଜୀ ବ୍ୟାକରଣ ଏବଂ ଜାତୀୟ ସାମ୍ପ୍ରତିକ ଘଟଣାବଳୀ ଉପରେ ବିଶେଷ ଦକ୍ଷତା ପ୍ରତିପାଦନ କରନ୍ତု। ପ୍ରତି ସପ୍ତାହରେ କମ୍ପ୍ୟୁଟର ଆଧାରିତ ମକ୍ ଟେଷ୍ଟ ଦିଅନ୍ତု।",
      keyAgencies: ["SSC (ଷ୍ଟାଫ୍ ସିଲେକସନ୍)", "RRB (ରେଲୱେ ନିଯուକ୍ତି ବୋର୍ଡ)", "IBPS (ବ୍ୟାଙ୍କ ନିଯୁକ୍ତି ସଂସ୍ଥା)"],
      trendingKeywords: ["କେନ୍ଦ୍ର ସରକାରୀ ଚାକିରି ୨୦୨୬", "ରେଲୱେ ଏନଟିପିସି ପରୀକ୍ଷา", "ଭାରତୀୟ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ସିଲାବସ"]
    },
    bn: {
      state: "All India / Central",
      nativeState: "भारत",
      title: "কেন্দ্রীয় ও সর্বভারতীয় সরকারি ক্যারিয়ার কাঠামো",
      description: "স্টাফ সিলেকশন কমিশন (SSC CGL/CHSL), রেলওয়ে রিক্রুটমেন্ট বোর্ড (RRB NTPC/Group D) এবং ব্যাংকিং (IBPS, SBI) পরীক্ষার অফিসিয়াল গাইড এবং তথ্যসমগ্র।",
      eligibility: "মাল্টি-টাস্কিং স্টাফের জন্য ১০ম শ্রেণী থেকে শুরু করে অফিসার পদের জন্য स्नातक ডিগ্রি পর্যন্ত প্রয়োজনীয় যোগ্যতা।",
      preparationStrategy: "গণিত, রিজনিং, ইংরেজি দক্ষতা এবং জাতীয় ও আন্তর্জাতিক সমসাময়িক খবরের ওপর ভালো দখল আনুন। প্রতি সপ্তাহে কম্পিউটার ভিত্তিক মক টেস্ট দিন।",
      keyAgencies: ["SSC (স্টাফ সিলেকশন কমিশন)", "RRB (रेलवे रिक्रूटमेंट बोर्ड)", "IBPS (ব্যাংকিং ইনস্টিটিউট)"],
      trendingKeywords: ["এসএসসি সিজিএল অনলাইন ফর্ম", "রেলওয়ে এনটিপিসি ভ্যাকেন্সি ২০২৬", "ব্যাংক পিও পরীক্ষার সিলেবাস"]
    },
    te: {
      state: "All India / Central",
      nativeState: "భారతదేశం",
      title: "యూనియన్ మరియు ఆల్ ఇండియా ప్రభుత్వ కెరీర్ ఫ్రేమ్‌వర్క్",
      description: "స్టాఫ్ సెలక్షన్ కమిషన్ (SSC CGL/CHSL), రైల్వే రిక్రూట్‌మెంట్ బోర్డులు (RRB NTPC/Group D), మరియు బ్యాంకింగ్ (IBPS, SBI) పరీక్షల సమాచారం మరియు సిలబస్ వివరాలు.",
      eligibility: "మల్టీ-టాస్కింగ్ స్టాఫ్ కోసం 10వ తరగతి నుండి ఆఫీసర్ కేడర్ పోస్టుల కోసం ఏదైనా సబ్జెక్టులో డిగ్రీ వరకు.",
      preparationStrategy: "క్ವಾంటిటేటివ్ ఆప్టిట్యూడ్, లాజికల్ రీజనింగ్, ఇంగ్లీష్ మరియు నేషనల్ కరెంట్ అఫైర్స్‌లో పట్టు సాధించండి. క్రమం తప్పకుండా కంప్యూటర్ ఆధారిత మాక్ టెస్ట్‌లు రాయండి.",
      keyAgencies: ["SSC (స్టాఫ్ సెలక్షన్)", "RRB (రైల్വേ రిక్రూట్‌మెంట్)", "IBPS (బ్యాంకింగ్ పరీక్షలు)"],
      trendingKeywords: ["SSC CGL ఆన్‌లైన్ అప్లికేషన్", "రైల్వే ఉద్యోగాల క్యాలెండర్ 2026", "బ్యాంక్ పోస్ట్స్ సిలబస్"]
    },
    mr: {
      state: "All India / Central",
      nativeState: "भारत",
      title: "केंद्रीय आणि अखिल भारतीय सरकारी करिअर संरचना",
      description: "कर्मचारी निवड आयोग (SSC CGL/CHSL), रेल्वे भरती बोर्ड (RRB NTPC) आणि बँकिंग स्पर्धा परीक्षांसाठी अधिकृत अभ्यासक्रम माहिती.",
      eligibility: "१० वी उत्तीर्ण उमेदवारांपासून ते कोणत्याही शाखेतील पदवीधरांपर्यंत सर्व शैक्षणिक पात्रता असलेल्यांसाठी विविध संधी.",
      preparationStrategy: "अंकगणित, बुद्धिमत्ता चाचणी, इंग्रजी व्याकरण आणि राष्ट्रीय चालू घडामोडींवर प्रभुत्व मिळवा. दर आठवड्याला ऑनलाइन मॉक टेस्ट सोडवा.",
      keyAgencies: ["SSC (कर्मचारी निवड आयोग)", "RRB (रेल्वे भरती बोर्ड)", "IBPS (बँकिंग संस्था)"],
      trendingKeywords: ["एसएससी परीक्षा फॉर्म", "रेल्वे रिक्रूटमेंट नोटिफिकेशन", "बँक पीओ परीक्षा अभ्यासक्रम"]
    },
    ta: {
      state: "All India / Central",
      nativeState: "இந்தியா",
      title: "மத்திய மற்றும் அகில இந்திய அரசு வேலைவாய்ப்பு கட்டமைப்பு",
      description: "மத்திய பணியாளர் தேர்வாணையம் (SSC), இரயில்வே பணியாளர் தேர்வு வாரியம் (RRB) மற்றும் வங்கித் தேர்வுகளுக்கான (IBPS, SBI) அதிகாரப்பூர்வ வழிகாட்டுதல்கள் மற்றும் பாடத்திட்டங்கள்.",
      eligibility: "மல்டி-டாஸ்கிங் பணியாளர்களுக்கு 10-ஆம் வகுப்பு முதல், உயர் பதவிகளுக்கு அங்கீகரிக்கப்பட்ட பல்கலைக்கழக பட்டப்படிப்பு வரை தகுதி.",
      preparationStrategy: "ஆப்திடியூட், லாஜிக்கல் ரீசனிங், ஆங்கில இலக்கணம் மற்றும் தேசிய நடப்பு நிகழ்வுகளில் முழுத் திறன் பெறுங்கள். வாரந்தோறும் ஆன்லைன் மாதிரித் தேர்வு எழுதுங்கள்.",
      keyAgencies: ["SSC (மத்திய பணியாளர் தேர்வு)", "RRB (இரயில்வே பணியாளர் தேர்வு)", "IBPS (வங்கித் தேர்வு முகமை)"],
      trendingKeywords: ["SSC தேர்வுகள் 2026", "இரயில்வே என்டிபிசி வேலைவாய்ப்புகள்", "வங்கித் தேர்வு பாடத்திட்டம் PDF"]
    },
    gu: {
      state: "All India / Central",
      nativeState: "ભારત",
      title: "કેન્દ્રીય અને અખિલ ભારતીય સરકારી કરિયર માળખું",
      description: "સ્ટાફ સિલેક્શન કમિશન (SSC CGL/CHSL), રેલવે ભરતી બોર્ડ (RRB NTPC) અને બેંકિંગ (IBPS, SBI) માટે સત્તાવાર સલાહ અને પરીક્ષા અભ્યાસક્રમ વિગતો.",
      eligibility: "મલ્ટી-ટાસ્કિંગ સ્ટાફ માટે 10મું પાસથી લઈને બેંક ઓફિસર માટે સ્નાતક ડિગ્રી સુધીની પાત્રતા.",
      preparationStrategy: "ગણિત, તાર્કિક ક્ષમતા, અંગ્રેજી વ્યાકરણ અને રાષ્ટ્રીય કરંટ અફેર્સ પર પકડ મેળવો. સાપ્તાહિક કમ્પ્યુટર આધારિત ટેસ્ટ આપો.",
      keyAgencies: ["SSC (સ્ટાફ સિલેક્શન કમિશન)", "RRB (રેલવે ભરતી બોર્ડ)", "IBPS (બેંકિંગ સંસ્થા)"],
      trendingKeywords: ["SSC ઓનલાઇન અરજી", "રેલવે ભરતી કેલેન્ડર 2026", "સરકારી પરીક્ષાઓ ઇન્ડિયા"]
    },
    ur: {
      state: "All India / Central",
      nativeState: "بھارت",
      title: "وفاقی اور کل ہند سرکاری کیریئر کا فریم ورک",
      description: "اسٹاف سلیکشن کمیشن (SSC)، ریلوے بھرتی بورڈز (RRB) اور بینکنگ امتحانات کی تیاری کا جامع گائیڈ اور نصاب۔",
      eligibility: "دسویں جماعت سے لے کر گریजोیشن کے حامل امیدواران اہل ہیں۔",
      preparationStrategy: "ریاضی, منطقی سوچ، انگریزی زبان اور قومی حالات حاضرہ پر مکمل مہارت حاصل کریں۔ ہفتہ وار فرضی ٹیسٹ دیں۔",
      keyAgencies: ["SSC (اسٹاف سلیکشن کمیشن)", "RRB (ریلوے بھرتی بورڈ)", "IBPS (بینکنگ انسٹی ٹیوٹ)"],
      trendingKeywords: ["ایس ایس سی امتحان رجسٹریشن", "ریلوے نوکریاں 2026", "سرکاری امتحانات الرٹ"]
    },
    kn: {
      state: "All India / Central",
      nativeState: "ಭಾರತ",
      title: "ಕೇಂದ್ರ ಮತ್ತು ಅಖಿల ಭಾರತ ಸರ್ಕಾರಿ ವೃತ್ತಿ ಚೌಕಟ್ಟು",
      description: "ಸಿಬ್ಬಂದಿ ನೇಮಕಾತಿ ಆಯೋಗ (SSC CGL/CHSL), ರೈಲ್ವೆ ನೇಮಕಾತಿ ಮಂಡಳಿ (RRB NTPC) ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ಪರೀಕ್ಷೆಗಳ ಅಧಿಕೃತ ಮಾಹಿತಿ ಮತ್ತು ಪಠ್ಯಕ್ರಮ.",
      eligibility: "ಕನಿಷ್ಠ 10 ನೇ ತರಗತಿ ಪಾಸಿನಿಂದ ಹಿಡಿದು ಪದವಿ ಹೊಂದಿರುವ ಅಭ್ಯರ್ಥಿಗಳು ಅರ್ಹರು.",
      preparationStrategy: "ಗಣಿತ ಆಪ್ಟಿಟ್ಯೂಡ್, ಲಾಜಿಕಲ್ ರೀಸನಿಂಗ್, ಇಂಗ್ಲಿಷ್ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಮಾನಗಳ ಮೇಲೆ ಹಿಡಿತ ಸಾಧಿಸಿ. ವಾರಕ್ಕೊಮ್ಮೆ ಆನ್‌ಲೈನ್ ಮಾಕ್ ಟೆಸ್ಟ್ ತೆಗೆದುಕೊಳ್ಳಿ.",
      keyAgencies: ["SSC (ಸಿಬ್ಬಂದಿ ನೇಮಕಾತಿ ಆಯೋಗ)", "RRB (ರೈಲ್ವೆ ನೇಮಕಾತಿ ಮಂಡಳಿ)", "IBPS (ಬ್ಯಾಂಕಿಂಗ್ ಪರೀಕ್ಷಾ ಸಂಸ್ಥೆ)"],
      trendingKeywords: ["SSC CGL ಆನ್‌ಲೈನ್ ಅರ್ಜಿ", "ರೈಲ್ವೆ ಉದ್ಯೋಗಗಳ ಮಾಹಿತಿ 2026", "ಬ್ಯಾಂಕಿಂಗ್ ಸಿಲಬಸ್ PDF"]
    },
    ml: {
      state: "All India / Central",
      nativeState: "ഭാരതം",
      title: "കേന്ദ്ര, അഖിലേന്ത്യാ സർക്കാർ കരിയർ ചട്ടക്കൂട്",
      description: "സ്റ്റാഫ് സെലക്ഷൻ കമ്മീഷൻ (SSC), റെയിൽവേ റിക്രൂട്ട്‌മെന്റ് ബോർഡ് (RRB), ബാങ്കിംഗ് പരീക്ഷകൾ എന്നിവയ്ക്കായുള്ള ഔദ്യോഗിക വിവരങ്ങളും സിലബസും.",
      eligibility: "പത്താം ക്ലാസ്സ് യോഗ്യതയുള്ള മൾട്ടി-ടാസ്കിംഗ് സ്റ്റാഫ് മുതൽ വിവിധ തസ്തികകളിലേക്ക് ബിരുദധാരികൾ വരെ യോഗ്യരാണ്.",
      preparationStrategy: "ക്വാണ്ടിറ്റേറ്റീവ് ആപ്റ്റിറ്റീയൂഡ്, ലോജിക്കൽ റീസണിംഗ്, ഇംഗ്ലീഷ്, ദേശീയ കറന്റ് അഫയേഴ്സ് എന്നിവയിൽ വൈദഗ്ധ്യം നേടുക. ഓൺലൈൻ മോക്ക് ടെസ്റ്റുകൾ പതിവാക്കുക.",
      keyAgencies: ["SSC (സ്റ്റാഫ് സെലക്ഷൻ കമ്മീഷൻ)", "RRB (റെയിൽവേ റിക്രൂട്ട്മെന്റ് ബോർഡ്)", "IBPS (ബാങ്കിംഗ് ഇൻസ്റ്റിറ്റ്യൂട്ട്)"],
      trendingKeywords: ["എസ്എസ്‌സി ഓൺലൈൻ അപേക്ഷ", "റെയിൽവേ എൻടിപിസി ഒഴിവുകൾ 2026", "സെൻട്രൽ ഗവൺമെന്റ് ജോബ്സ്"]
    },
    pa: {
      state: "All India / Central",
      nativeState: "ਭਾਰਤ",
      title: "ਕੇਂਦਰੀ ਅਤੇ ਅਖਿਲ ਭਾਰਤੀ ਸਰਕਾਰੀ ਕਰੀਅਰ ਢਾਂਚਾ",
      description: "ਸਟਾਫ ਸਿਲੈਕਸ਼ਨ ਕਮਿਸ਼ਨ (SSC), ਰੇਲਵੇ ਭਰਤੀ ਬੋਰਡ (RRB) ਅਤੇ ਬੈਂਕਿੰਗ ਪ੍ਰਤੀਯੋਗੀ ਪ੍ਰੀਖਿਆਵਾਂ ਦੀ ਤਿਆਰੀ ਲਈ ਅਧਿਕਾਰਤ ਸਲਾਹ।",
      eligibility: "10ਵੀਂ ਪਾਸ ਮਲਟੀ-ਟਾਸਕਿੰਗ ਸਟਾਫ ਤੋਂ ਲੈ ਕੇ ਬੈਂਕ ਅਫਸਰਾਂ ਲਈ ਗ੍ਰੈਜੂਏਸ਼ਨ ਡਿਗਰੀ ਤੱਕ ਦੀ ਯੋਗਤਾ।",
      preparationStrategy: "ਗਣਿਤ, ਤਾਰਕਿਕ ਯੋਗਤਾ, ਅੰಗਰੇਜ਼ੀ ਅਤੇ ਰਾਸ਼ਟਰੀ ਕਰੰਟ ਅਫੇਅਰਸ ਉੱਤੇ ਮੁਹਾਰਤ ਹਾਸਲ ਕਰੋ। ਹਫ਼ਤਾਵਾਰੀ ਕੰਪਿਊਟਰ ਆਧਾਰਿਤ ਟੈਸਟ ਦਿਓ।",
      keyAgencies: ["SSC (ਸਟਾਫ ਸਿਲੈקਸ਼ਨ ਕਮਿਸ਼ਨ)", "RRB (ਰੇਲਵੇ ਭਰਤੀ ਬੋਰਡ)", "IBPS (ਬੈਂਕਿੰਗ ਸੰਸਥา)"],
      trendingKeywords: ["ਐਸਐਸਸੀ ਆਨਲਾਈਨ ਅਪਲਾਈ", "ਰੇਲਵੇ ਭਰਤੀ ਨੋਟੀਫਿਕੇਸ਼ਨ 2026", "ਸਰਕਾਰੀ ਨੌਕਰੀ ਅਲਰਟ"]
    },
    as: {
      state: "All India / Central",
      nativeState: "ভাৰত",
      title: "কেন্দ্ৰীয় আৰু সৰ্বভাৰতীয় চৰকাৰী কেৰিয়াৰ গাঁথনি",
      description: "কৰ্মচাৰী চয়ন আয়োগ (SSC), ৰে’লৱে নিযুক্তি ব’ৰ্ড (RRB) আৰু বেংক নিযুক্তি (IBPS) পৰীক্ষাসমূহৰ বাবে চৰকাৰী গাইড আৰু সিলেবাচৰ সবিশেষ।",
      eligibility: "১০ম শ্ৰေণী উত্তীৰ্ণ মাল্টি-টাস্কিং কৰ্মচাৰীৰ পৰা স্নাতক ডিগ্ৰীধাৰীলৈকে আবেদনৰ সুযোগ।",
      preparationStrategy: "অংক, যুক্তিবিদ্যা, ইংৰাজী ভাষাৰ দক্ষতা আৰু ৰাষ্ট্ৰীয় সাম্প্ৰতিক ঘটনাৱলী আয়ত্ত কৰক। কম্পিউটাৰ ভিত্তিক মক টেষ্ট দিয়ক।",
      keyAgencies: ["SSC (কৰ্মচাৰী চয়ন আয়োগ)", "RRB (ৰে’লৱে নিযুক্তি বোৰ্ড)", "IBPS (বেংক নিযুক্তি সংস্থা)"],
      trendingKeywords: ["SSC অনলাইন আবেদন", "ৰে’লৱে এনটিপিসি নিযুক্তি ২০২৬", "বেংক পিঅ’ চিলেবাচ"]
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
