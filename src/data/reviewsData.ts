export interface Review {
  id: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  comment: string;
  date: string;
}

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Debasish Mohanty',
    city: 'Bhubaneswar',
    state: 'Odisha',
    rating: 5,
    comment: "The Drone Piloting & Agri-Spraying certification course was incredibly comprehensive! Arohi's AI-Guided Auto-Pilot study modes made the technical mapping formulas extremely simple to master.",
    date: '24 Jun 2026'
  },
  {
    id: 'rev-2',
    name: 'Priyanka Sen',
    city: 'Kolkata',
    state: 'West Bengal',
    rating: 5,
    comment: "I used the ATS Resume evaluation tool to check my application for the Railway RRB Assistant Loco Pilot (ALP) posting. It flagged three missing high-impact engineering keywords. Highly recommended!",
    date: '21 Jun 2026'
  },
  {
    id: 'rev-3',
    name: 'Subrata Sahoo',
    city: 'Cuttack',
    state: 'Odisha',
    rating: 5,
    comment: "Excellent startup resources on Udyam registrations and Mudra Loans. The business checklist helped us secure our Shishu microfinance verification seamlessly.",
    date: '18 Jun 2026'
  },
  {
    id: 'rev-4',
    name: 'Ananya Rao',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 5,
    comment: "The quantitative aptitude preparation guides are top-notch. Arohi's mock exam preparation suggestions feel like having a private career counselor sitting next to you.",
    date: '15 Jun 2026'
  },
  {
    id: 'rev-5',
    name: 'Meera Patnaik',
    city: 'Berhampur',
    state: 'Odisha',
    rating: 5,
    comment: "It is extremely hard to find accurate local state schemes. The Matchmaker in this app instantly found active central subsidies and Mukhyamantri schemes that saved us lakhs in initial setup costs.",
    date: '12 Jun 2026'
  },
  {
    id: 'rev-6',
    name: 'Rohan Das',
    city: 'Balasore',
    state: 'Odisha',
    rating: 4,
    comment: "Very smooth interface. The automated application slips print perfectly with computer-generated security codes. Best next-gen recruitment platform in India.",
    date: '10 Jun 2026'
  },
  {
    id: 'rev-7',
    name: 'Vikram Malhotra',
    city: 'New Delhi',
    state: 'Delhi',
    rating: 5,
    comment: "The mock interview simulator gave me the direct feedback I needed to refine my answers. Having realistic AI assessments before face-to-face panels is a massive advantage.",
    date: '08 Jun 2026'
  },
  // Hindi (हिन्दी) Reviews
  {
    id: 'rev-8',
    name: 'Amit Sharma',
    city: 'Patna',
    state: 'Bihar',
    rating: 5,
    comment: "आरोही का इंटरव्यू सिम्युलेटर कमाल का है! मैंने बिहार लोक सेवा आयोग (BPSC) की तैयारी के लिए इसका उपयोग किया, और प्रतिक्रिया अत्यंत व्यावहारिक थी।",
    date: '07 Jun 2026'
  },
  {
    id: 'rev-9',
    name: 'Sunita Verma',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    rating: 5,
    comment: "यूपीएससी सिविल सेवा परीक्षा के लिए इसमें जो मार्गदर्शन और स्टडी प्लानर मिलता है, वह लाजवाब है। लाइव उत्तर लेखन में बहुत सुधार हुआ। धन्यवाद!",
    date: '06 Jun 2026'
  },
  {
    id: 'rev-10',
    name: 'Rahul Mishra',
    city: 'Indore',
    state: 'Madhya Pradesh',
    rating: 4,
    comment: "सरकारी योजनाओं की जानकारी हिंदी में बहुत सरल शब्दों में दी गई है। पीएम मुद्रा लोन के लिए आवेदन करना अब बहुत आसान हो गया है।",
    date: '05 Jun 2026'
  },
  {
    id: 'rev-11',
    name: 'Rajesh Kumar',
    city: 'Ranchi',
    state: 'Jharkhand',
    rating: 5,
    comment: "मुझे इस ऐप के माध्यम से कंप्यूटर साक्षरता पाठ्यक्रम करने का अवसर मिला। लाइव वीडियो और हैंड्स-ऑन कोडिंग लैब बेहद उपयोगी हैं।",
    date: '04 Jun 2026'
  },
  {
    id: 'rev-12',
    name: 'Deepika Joshi',
    city: 'Jaipur',
    state: 'Rajasthan',
    rating: 5,
    comment: "आरोही एआई से करियर पर चर्चा करना बेहद अद्भुत अनुभव है। इसने मुझे सही करियर चुनने और आवश्यक कौशल विकसित करने में सही दिशा दिखाई।",
    date: '03 Jun 2026'
  },
  // Odia (ଓଡ଼ିଆ) Reviews
  {
    id: 'rev-13',
    name: 'Satyabrata Pradhan',
    city: 'Sambalpur',
    state: 'Odisha',
    rating: 5,
    comment: "ଆରୋହୀ ଏଆଇ ମାଧ୍ୟମରେ ଓଡ଼ିଶା ସରକାରଙ୍କ ବିଭିନ୍ନ ଯୋଜନା ବିଷୟରେ ଜାଣିବା ବହୁତ ସହଜ ହୋଇଗଲା। ମୁଁ ସଫଳତାର ସହ ମୋର ଉଦ୍ୟମ ପଞ୍ଜୀକରଣ କରିପାରିଲି।",
    date: '02 Jun 2026'
  },
  {
    id: 'rev-14',
    name: 'Rashmita Behera',
    city: 'Rourkela',
    state: 'Odisha',
    rating: 5,
    comment: "ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି ପାଇଁ ଏହି ଆପ୍‌ରେ ଥିବା ପ୍ରଶ୍ନୋତ୍ତର ଗୁଡିକ ବହୁତ ଉନ୍ନତମାନର। ମକ ଇଣ୍ଟରଭ୍ୟୁ ସେସନ ମୋର ଆତ୍ମବିଶ୍ୱାସ ବହୁତ ବଢ଼ାଇ ଦେଇଛି।",
    date: '01 Jun 2026'
  },
  {
    id: 'rev-15',
    name: 'Soumya Ranjan Das',
    city: 'Puri',
    state: 'Odisha',
    rating: 4,
    comment: "କୃଷି ଏବଂ ଡ୍ରୋନ୍ ଟେକ୍ନୋଲୋଜି ପାଠ୍ୟକ୍ରମ ପାଇଁ ଓଡ଼ିଆ ଭାଷାରେ ଯେଉଁ ଟିউটୋରିଆଲ୍ ମିଳୁଛି ତାହା ବହୁତ ଲାଭଦାୟକ। ଆରୋହୀ ମେଣ୍ଟରଶିପ୍ ବହୁତ ଭଲ।",
    date: '31 May 2026'
  },
  {
    id: 'rev-16',
    name: 'Lipsa Mohapatra',
    city: 'Jeypore',
    state: 'Odisha',
    rating: 5,
    comment: "ରିଜ୍ୟୁମ୍ ବିଲ୍ଡର ଟୁଲ୍ ଅତି ଚମତ୍କାର! ଏହା ମୋ ରିଜ୍ୟୁମକୁ ଏଟିଏସ-ଅନୁକୂଳ କରିବା ସହ ଉଚ୍ଚ ମାନ୍ୟତା ଦେବାରେ ସାହାଯ୍ୟ କଲା।",
    date: '30 May 2026'
  },
  {
    id: 'rev-17',
    name: 'Chinmayee Ratha',
    city: 'Baripada',
    state: 'Odisha',
    rating: 5,
    comment: "ଭାରତୀୟ ରେଳବାଇ ଏବଂ ବ୍ୟାଙ୍କିଙ୍ଗ୍ ପରୀକ୍ଷା ପାଇଁ ଏହି ଆପ୍ ମୋତେ ପ୍ରତିଦିନ ସଠିକ୍ ପରାମର୍ଶ ଦେଉଛି। ମୋର ସମସ୍ତ ପାଠ୍ୟ ପ୍ରଗତି ସୁରକ୍ଷିତ ଭାବେ ରହୁଛି।",
    date: '29 May 2026'
  },
  // Bengali (বাংলা) Reviews
  {
    id: 'rev-18',
    name: 'Subhashish Roy',
    city: 'Siliguri',
    state: 'West Bengal',
    rating: 5,
    comment: "আ রোহী কৃত্রিম বুদ্ধিমত্তা মেন্টর সত্যি অসাধারণ। রেজিউমে মূল্যায়নের সময় যে গাইডলাইন দিয়েছে তা আমার চাকরি পাওয়ার সম্ভাবনা বাড়িয়ে দিয়েছে।",
    date: '28 May 2026'
  },
  {
    id: 'rev-19',
    name: 'Tanushree Banik',
    city: 'Asansol',
    state: 'West Bengal',
    rating: 5,
    comment: "পরীক্ষার প্রস্তুতির জন্য মক টেস্ট এবং উত্তর বিশ্লেষণের প্রক্রিয়াটি দারুণ। পরীক্ষার ভয় কাটিয়ে উঠতে সাহায্য করেছে।",
    date: '27 May 2026'
  },
  {
    id: 'rev-20',
    name: 'Debojyoti Sen',
    city: 'Howrah',
    state: 'West Bengal',
    rating: 4,
    comment: "স্থানীয় সরকারি ঋণ প্রকল্প এবং স্কিমগুলির বিবরণ খুব স্পষ্ট ও নির্ভুল। উদ্যোক্তাদের জন্য এই অ্যাপ্লিকেশনটি একটি চমৎকার উপহার।",
    date: '26 May 2026'
  },
  // Marathi (मराठी) Reviews
  {
    id: 'rev-21',
    name: 'Amol Deshmukh',
    city: 'Pune',
    state: 'Maharashtra',
    rating: 5,
    comment: "आरोही एआय मेंटॉर मराठी आणि हिंदीमध्ये देखील उत्तम मार्गदर्शन करते. यामुळे रेल्वे भरती आणि बँकिंग परीक्षांच्या तयारीला खूप मदत झाली.",
    date: '25 May 2026'
  },
  {
    id: 'rev-22',
    name: 'Snehal Patil',
    city: 'Nagpur',
    state: 'Maharashtra',
    rating: 5,
    comment: "माझ्या स्टार्टअपसाठी एमएसएमई नोंदणी कशी करावी, याबद्दलची माहिती आणि चेकलिस्ट मला या ॲपवर मिळाली. अत्यंत उपयुक्त आणि सोपे इंटरफेस!",
    date: '24 May 2026'
  },
  {
    id: 'rev-23',
    name: 'Vijay Shinde',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 5,
    comment: "इंटरव्ह्यू प्रॅक्टिससाठी या ॲपसारखा पर्याय दुसरा नाही. प्रत्यक्ष एआय मुलाखतीचे फीडबॅक खूप फायदेशीर ठरतात.",
    date: '23 May 2026'
  },
  // Telugu (తెలుగు) Reviews
  {
    id: 'rev-24',
    name: 'Srinivas Reddy',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    rating: 5,
    comment: "ఆరోహి కెరీర్ అసిస్టెంట్ చాలా చక్కగా పనిచేస్తుంది. ముద్ర లోన్స్ మరియు ప్రభుత్వ స్కీమ్స్ సమాచారం ఇక్కడ లభించడం చాలా ఆనందంగా ఉంది.",
    date: '22 May 2026'
  },
  {
    id: 'rev-25',
    name: 'Kavitha Naidu',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    rating: 5,
    comment: "నా రెజ్యూమ్ స్కోర్‌ను మెరుగుపరచడానికి ఈ యాప్ ఎంతో సహాయపడింది. ఎఐ సూచించిన మార్పుల వల్ల మంచి ఉద్యోగావకాశాలు వస్తున్నాయి.",
    date: '21 May 2026'
  },
  {
    id: 'rev-26',
    name: 'Prasad Rao',
    city: 'Warangal',
    state: 'Telangana',
    rating: 4,
    comment: "ఈ యాప్ డిజైన్ మరియు నావిగేషన్ చాలా అద్భుతంగా ఉన్నాయి. ముఖ్యంగా విద్యార్థులకు ఇది ఒక వరప్రసాదం లాంటిది.",
    date: '20 May 2026'
  },
  // Tamil (தமிழ்) Reviews
  {
    id: 'rev-27',
    name: 'Karthik Subramanian',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "அரோஹி ஏஐ மெண்டர் மிகவும் பயனுள்ளதாக இருக்கிறது. எனது நேர்காணல் திறன்களை மேம்படுத்த இந்த செயலி பெரிதும் உதவியது.",
    date: '19 May 2026'
  },
  {
    id: 'rev-28',
    name: 'Priya Sundaram',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "அரசு வேலை வாய்ப்புகள் மற்றும் அதற்கான தேர்வு தயாரிப்புகளுக்கு ஏற்ற சிறந்த செயலி. மிகவும் துல்லியமான தகவல்கள் கிடைக்கின்றன.",
    date: '18 May 2026'
  },
  {
    id: 'rev-29',
    name: 'Saravanan Palani',
    city: 'Madurai',
    state: 'Tamil Nadu',
    rating: 4,
    comment: "தொழில்முனைவோருக்கான ஸ்டார்ட்-அப் வழிகாட்டுதல்கள் மற்றும் எம்.எஸ்.எம்.இ கடன்கள் பற்றிய எளிய விளக்கங்கள் அருமை.",
    date: '17 May 2026'
  },
  // Kannada (ಕನ್ನಡ) Reviews
  {
    id: 'rev-30',
    name: 'Mahesh Kumar',
    city: 'Bengaluru',
    state: 'Karnataka',
    rating: 5,
    comment: "ಆರೋಹಿ ಎಐ ನಮ್ಮ ಪ್ರಗತಿಯನ್ನು ತುಂಬಾ ಚೆನ್ನಾಗಿ ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ. ಆಪ್ಟಿಟ್ಯೂಡ್ ತಯಾರಿಗಾಗಿ ಸಿಗುವ ಉದಾಹರಣೆಗಳು ಅತ್ಯುತ್ತಮವಾಗಿವೆ.",
    date: '16 May 2026'
  },
  {
    id: 'rev-31',
    name: 'Asha Hegde',
    city: 'Mysuru',
    state: 'Karnataka',
    rating: 5,
    comment: "ಕನ್ನಡದಲ್ಲಿಯೂ ಸಹ ಸರಳವಾಗಿ ಕೆರಿಯರ್ ಗೈಡೆನ್ಸ್ ಪಡೆಯಬಹುದು. ರೆಸ್ಯೂಮ್ ವಿಶ್ಲೇಷಣೆ ತುಂಬಾ ನಿಖರವಾಗಿದೆ. ಧನ್ಯವಾದಗಳು!",
    date: '15 May 2026'
  },
  // Gujarati (ગુજરાતી) Reviews
  {
    id: 'rev-32',
    name: 'Jayesh Patel',
    city: 'Ahmedabad',
    state: 'Gujarat',
    rating: 5,
    comment: "સ્ટાર્ટઅપ લોન અને રજીસ્ટ્રેશન માટે આ એપ્લિકેશન ખૂબ જ સરસ છે. આરોહીના એઆઈ સૂચનોથી વ્યવસાય શરૂ કરવો સરળ બન્યો.",
    date: '14 May 2026'
  },
  {
    id: 'rev-33',
    name: 'Hina Shah',
    city: 'Surat',
    state: 'Gujarat',
    rating: 5,
    comment: "રેલ્વે અને સરકારી પરીક્ષાઓની તૈયારી માટેની ટેસ્ટ સીરીઝ અને આરોહી મેન્ટરનું માર્ગદર્શન ઉત્તમ છે.",
    date: '13 May 2026'
  },
  // Punjabi (ਪੰਜਾਬੀ) Reviews
  {
    id: 'rev-34',
    name: 'Gurpreet Singh',
    city: 'Amritsar',
    state: 'Punjab',
    rating: 5,
    comment: "ਇੰਟਰਵਿਊ ਦੀ ਤਿਆਰੀ ਲਈ ਇਹ ਐਪ ਬਹੁਤ ਹੀ ਸ਼ਾਨਦਾਰ ਹੈ। ਇਸ ਨਾਲ ਮੇਰਾ ਆਤਮ ਵਿਸ਼ਵਾਸ ਬਹੁਤ ਵਧਿਆ ਹੈ।",
    date: '12 May 2026'
  },
  {
    id: 'rev-35',
    name: 'Harman Kaur',
    city: 'Ludhiana',
    state: 'Punjab',
    rating: 5,
    comment: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਬਾਰੇ ਸਾਰੀ ਜਾਣਕਾਰੀ ਬਹੁਤ ਹੀ ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ ਮਿਲਦੀ ਹੈ। ਹਰ ਨੌਜਵਾਨ ਨੂੰ ਇਹ ਐਪ ਵਰਤਣੀ ਚਾਹੀਦੀ ਹੈ।",
    date: '11 May 2026'
  },
  // Additional English Reviews to cross 50 reviews total
  {
    id: 'rev-36',
    name: 'Arjun Swaminathan',
    city: 'Chennai',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "I landed a software engineering role after practicing with the live code compiler and Arohi's system design mock interviews. Outstanding response accuracy!",
    date: '10 May 2026'
  },
  {
    id: 'rev-37',
    name: 'Nisha Pillai',
    city: 'Kochi',
    state: 'Kerala',
    rating: 5,
    comment: "The speech-to-text pronunciation assessment is incredible. It really helped boost my voice modulation for customer service mock interviews.",
    date: '09 May 2026'
  },
  {
    id: 'rev-38',
    name: 'Amanpreet Juneja',
    city: 'Chandigarh',
    state: 'Punjab',
    rating: 4,
    comment: "The portal organizes multi-state vacancies very cleanly. Submitting applications and tracking the generated PDF confirmation slips is very fluid.",
    date: '08 May 2026'
  },
  {
    id: 'rev-39',
    name: 'Tanmay Dasgupta',
    city: 'Guwahati',
    state: 'Assam',
    rating: 5,
    comment: "Arohi explained several startup subsidies specific to Northeast India. The platform is truly empowering and inclusive.",
    date: '07 May 2026'
  },
  {
    id: 'rev-40',
    name: 'Sagarika Jena',
    city: 'Rourkela',
    state: 'Odisha',
    rating: 5,
    comment: "Best digital platform for training. The interactive labs on MSME Accounting and GST filing let me learn practical skills at my own pace.",
    date: '06 May 2026'
  },
  {
    id: 'rev-41',
    name: 'Yashwant Rao',
    city: 'Nagpur',
    state: 'Maharashtra',
    rating: 5,
    comment: "The daily study planner is highly dynamic. It customizes the workload based on your previous day's quiz performance. Super smart AI!",
    date: '05 May 2026'
  },
  {
    id: 'rev-42',
    name: 'Meenakshi Iyer',
    city: 'Palakkad',
    state: 'Kerala',
    rating: 5,
    comment: "Clean UI, premium visuals, and incredibly detailed answers from the chat mentor. I highly recommend the speech interview modules.",
    date: '04 May 2026'
  },
  {
    id: 'rev-43',
    name: 'Suhas Kulkarni',
    city: 'Solapur',
    state: 'Maharashtra',
    rating: 4,
    comment: "I registered my local agro-processing plant through the step-by-step MSME guidelines. Securing low-interest bank validation was direct.",
    date: '03 May 2026'
  },
  {
    id: 'rev-44',
    name: 'Payal Sengupta',
    city: 'Durgapur',
    state: 'West Bengal',
    rating: 5,
    comment: "The platform's accessibility and support for Indian regional languages are top tier. I love the Odia and Bengali translation quality.",
    date: '02 May 2026'
  },
  {
    id: 'rev-45',
    name: 'Abhishek Mishra',
    city: 'Gorakhpur',
    state: 'Uttar Pradesh',
    rating: 5,
    comment: "Excellent preparation modules for State SSC exams. The previous year patterns matched perfectly with Arohi's custom mock tests.",
    date: '01 May 2026'
  },
  {
    id: 'rev-46',
    name: 'Sushant Nayak',
    city: 'Angul',
    state: 'Odisha',
    rating: 5,
    comment: "The Drone operation simulator in this app teaches you exact angle calculations and throttle configurations. Unbelievable content depth!",
    date: '30 Apr 2026'
  },
  {
    id: 'rev-47',
    name: 'Venkata Krishna',
    city: 'Nellore',
    state: 'Andhra Pradesh',
    rating: 5,
    comment: "Very safe and encrypted. My certification logs and bookmarks are fully synced to my secure profile. No spam, only genuine value.",
    date: '29 Apr 2026'
  },
  {
    id: 'rev-48',
    name: 'Shreya Saxena',
    city: 'Dehradun',
    state: 'Uttarakhand',
    rating: 5,
    comment: "The resume ATS analyzer gave me an instant score breakdown and suggested specific active verbs to use. Got twice the callbacks!",
    date: '28 Apr 2026'
  },
  {
    id: 'rev-49',
    name: 'Kshitij Marathe',
    city: 'Kolhapur',
    state: 'Maharashtra',
    rating: 4,
    comment: "I spent hours trying to understand Mudra Loan requirements. Arohi synthesized the absolute prerequisites in 5 bullets instantly.",
    date: '27 Apr 2026'
  },
  {
    id: 'rev-50',
    name: 'Anjali Patnaik',
    city: 'Bhadrak',
    state: 'Odisha',
    rating: 5,
    comment: "It's so encouraging to have an AI mentor like Arohi. Her friendly voice, encouraging tone, and accurate guidance make career planning a joy.",
    date: '26 Apr 2026'
  },
  {
    id: 'rev-51',
    name: 'Deepak Thapa',
    city: 'Darjeeling',
    state: 'West Bengal',
    rating: 5,
    comment: "Superb course curation! The hospitality management and tourist guiding modules are perfectly tailored to current industrial norms.",
    date: '25 Apr 2026'
  },
  {
    id: 'rev-52',
    name: 'Pratima Hazarika',
    city: 'Jorhat',
    state: 'Assam',
    rating: 5,
    comment: "The offline local storage support means I never lose my mock test progress even during unstable internet connections in tea garden areas.",
    date: '24 Apr 2026'
  },
  {
    id: 'rev-53',
    name: 'Ranganathan Chettiar',
    city: 'Trichy',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "Outstanding aptitude quiz system. The speed-solving tips provided by Arohi are absolute game changers for competitive banking exams.",
    date: '23 Apr 2026'
  },
  {
    id: 'rev-54',
    name: 'Narendra Jha',
    city: 'Darbhanga',
    state: 'Bihar',
    rating: 5,
    comment: "The complete recruitment pipeline database is fully updated. I verified central and state vacancies with ease. A must-have app!",
    date: '22 Apr 2026'
  },
  {
    id: 'rev-55',
    name: 'Soudamini Dash',
    city: 'Ganjam',
    state: 'Odisha',
    rating: 5,
    comment: "The self-paced MSME GST certification course is excellent. It explains complex tax filings using extremely simple, relatable analogies.",
    date: '21 Apr 2026'
  }
];
