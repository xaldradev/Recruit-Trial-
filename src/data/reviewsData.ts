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
  },
  {
    id: 'rev-56',
    name: 'Karan Malhotra',
    city: 'Noida',
    state: 'Uttar Pradesh',
    rating: 5,
    comment: "The interactive D3 Career Roadmap is a masterpiece. It visually mapped out my path from an associate QA engineer to a principal solutions architect, detailing every required certification.",
    date: '20 Apr 2026'
  },
  {
    id: 'rev-57',
    name: 'Tsering Dorjee',
    city: 'Leh',
    state: 'Ladakh',
    rating: 5,
    comment: "Even in low-bandwidth regions, the site loaded incredibly fast. Arohi's career advice on competitive government entrance exams was clear, concise, and highly actionable.",
    date: '19 Apr 2026'
  },
  {
    id: 'rev-58',
    name: 'Malini Krishnan',
    city: 'Palakkad',
    state: 'Kerala',
    rating: 5,
    comment: "I used the resume builder to prepare for banking roles. The ATS evaluator's analysis of my structural alignment was flawless, pointing out exact sections to improve.",
    date: '18 Apr 2026'
  },
  {
    id: 'rev-59',
    name: 'Jaspreet Chawla',
    city: 'Jalandhar',
    state: 'Punjab',
    rating: 5,
    comment: "The mock interview portal is super realistic! The voice feedback from Arohi helped me tackle difficult behavioral questions with absolute confidence.",
    date: '17 Apr 2026'
  },
  {
    id: 'rev-60',
    name: 'Anupama Gokhale',
    city: 'Thane',
    state: 'Maharashtra',
    rating: 5,
    comment: "Detailed documentation on MSME subsidies and central schemes helped us register our small dairy cooperative in record time. Highly professional utility!",
    date: '16 Apr 2026'
  },
  {
    id: 'rev-61',
    name: 'Manish Sisodia',
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    rating: 4,
    comment: "I am preparing for state administrative exams. The study guides, test series and mock feedback cycles are very helpful for regular review and pacing.",
    date: '15 Apr 2026'
  },
  {
    id: 'rev-62',
    name: 'Bijaylaxmi Jena',
    city: 'Kendrapara',
    state: 'Odisha',
    rating: 5,
    comment: "ଆରୋହୀ ଏଆଇ ସହିତ ଓଡ଼ିଶାର ବିଭିନ୍ନ ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଆଲୋଚନା କରିବା ବହୁତ ଉପଯୋଗୀ ଥିଲା। ଏହି ପ୍ଲାଟଫର୍ମଟି ବହୁତ ସହଜ ଏବଂ ଆଧୁନିକ ଅଟେ।",
    date: '14 Apr 2026'
  },
  {
    id: 'rev-63',
    name: 'Sanjeev Goel',
    city: 'Panipat',
    state: 'Haryana',
    rating: 5,
    comment: "The drone training syllabus is very detailed. It covers real-world application parameters, safety logs, and regulatory compliance protocols for DGCA certifications.",
    date: '13 Apr 2026'
  },
  {
    id: 'rev-64',
    name: 'Meenakshi Sundaram',
    city: 'Madurai',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "அரோஹி ஏஐ உடனான நேரடி உரையாடல் மிகவும் இயல்பாக இருந்தது. என் தொழில்முறை சந்தேகங்களுக்கு துல்லியமான பதில்களை உடனடியாகப் பெற்றேன்.",
    date: '12 Apr 2026'
  },
  {
    id: 'rev-65',
    name: 'Bhabani Sankar',
    city: 'Balangir',
    state: 'Odisha',
    rating: 5,
    comment: "The dynamic offline tracker saved my mock test progress. No matter the network drops, my study logs remained fully intact. Incredible design thinking!",
    date: '11 Apr 2026'
  },
  {
    id: 'rev-66',
    name: 'Rupali Deshmukh',
    city: 'Aurangabad',
    state: 'Maharashtra',
    rating: 5,
    comment: "या ॲपचा प्रीमियम लूक आणि फील अप्रतिम आहे! 3D ऑर्बिट आणि सोपा नॅव्हिगेशनमुळे आपल्याला हवी ती माहिती सेकंदात मिळते.",
    date: '10 Apr 2026'
  },
  {
    id: 'rev-67',
    name: 'Siddharth Roy',
    city: 'Jalpaiguri',
    state: 'West Bengal',
    rating: 5,
    comment: "Arohi AI's step-by-step guidance on Udyam registration made our registration process straightforward. A highly recommended portal for young entrepreneurs.",
    date: '09 Apr 2026'
  },
  {
    id: 'rev-68',
    name: 'Lalitha Reddy',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    rating: 5,
    comment: "ఆప్టిట్యూడ్ ప్రిపరేషన్ క్లాసులు చాలా సులభంగా అర్థమయ్యేలా ఉన్నాయి. ఎన్టీపీసీ మరియు రైల్వే ఉద్యోగాల సమాచారం ఎప్పటికప్పుడు అప్‌డేట్ అవుతోంది.",
    date: '08 Apr 2026'
  },
  {
    id: 'rev-69',
    name: 'Devendra Bisht',
    city: 'Haldwani',
    state: 'Uttarakhand',
    rating: 4,
    comment: "Clean interfaces, straightforward navigation options, and fantastic multilingual support. This tool has made digital career mentoring very simple and engaging.",
    date: '07 Apr 2026'
  },
  {
    id: 'rev-70',
    name: 'Aiswarya Menon',
    city: 'Thrissur',
    state: 'Kerala',
    rating: 5,
    comment: "Excellent response accuracy on national and regional job listings. The quick search feature let me find specialized vacancies within seconds.",
    date: '06 Apr 2026'
  },
  {
    id: 'rev-71',
    name: 'Tushar Gandhi',
    city: 'Porbandar',
    state: 'Gujarat',
    rating: 5,
    comment: "આરોહીના ગુજરાતી સંવાદો એટલા સહજ અને આદરપૂર્વકના છે કે આપણને કોઈ સાચા માર્ગદર્શક સાથે વાત કરવાનો અનુભવ થાય છે. ખૂબ સરસ!",
    date: '05 Apr 2026'
  },
  {
    id: 'rev-72',
    name: 'Simranjeet Sodhi',
    city: 'Patiala',
    state: 'Punjab',
    rating: 5,
    comment: "ਪੰਜਾਬੀ ਵਿੱਚ ਇੰਟਰਵਿਊ ਪ੍ਰੈਕਟਿਸ ਅਤੇ ਮਾਰਗਦਰਸ਼ਨ ਦਾ ਅਨੁਭਵ ਲਾਜਵਾਬ ਹੈ। ਇਸ ਪਲੇਟਫਾਰਮ ਨੇ ਮੇਰੇ ਕੈਰੀਅਰ ਨੂੰ ਸਹੀ ਦਿਸ਼ਾ ਦਿੱਤੀ ਹੈ।",
    date: '04 Apr 2026'
  },
  {
    id: 'rev-73',
    name: 'Hariharan Iyer',
    city: 'Salem',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "The site tour is extremely helpful for newcomers. It guides you seamlessly through the Resume ATS checkers, interview simulators, and regional government portals.",
    date: '03 Apr 2026'
  },
  {
    id: 'rev-74',
    name: 'Monika Mohanty',
    city: 'Bhadrak',
    state: 'Odisha',
    rating: 5,
    comment: "କମ୍ପ୍ୟୁଟର ସାକ୍ଷରତା ଏବଂ ପ୍ରତିଯୋଗିତାମୂଳକ ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି ପାଇଁ ଏହି ଆପ୍ ମୋ ପାଇଁ ଏକ ମାର୍ଗଦର୍ଶିକା ସଦୃଶ ହୋଇଛି। ଆଇ ଆମ ଭେରି ହାପି!",
    date: '02 Apr 2026'
  },
  {
    id: 'rev-75',
    name: 'Abhay Chandel',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    rating: 5,
    comment: "The mock interview generator evaluates technical responses using the latest industrial benchmarks. The exact feedback on pacing was highly practical.",
    date: '01 Apr 2026'
  },
  {
    id: 'rev-76',
    name: 'Nilanjana Sanyal',
    city: 'Kharagpur',
    state: 'West Bengal',
    rating: 5,
    comment: "The coding compiler and logical analysis tools are outstanding. Arohi's debug suggestions helped me clear complicated interview questions easily.",
    date: '31 Mar 2026'
  },
  {
    id: 'rev-77',
    name: 'Raghavendra Swamy',
    city: 'Dharwad',
    state: 'Karnataka',
    rating: 4,
    comment: "Very elegant layouts and color themes. It looks exceptionally premium and functions without any lag, providing direct answers every time.",
    date: '30 Mar 2026'
  },
  {
    id: 'rev-78',
    name: 'Suhail Ahmed',
    city: 'Srinagar',
    state: 'Jammu and Kashmir',
    rating: 5,
    comment: "Highly customizable resume templates. The ATS analyzer checks formatting, active phrasing, and density score with absolute professional precision.",
    date: '29 Mar 2026'
  },
  {
    id: 'rev-79',
    name: 'Pratibha Patil',
    city: 'Amravati',
    state: 'Maharashtra',
    rating: 5,
    comment: "एमएसएमई आणि मुद्रा बँक कर्जासाठी लागणारी कागदपत्रे गोळा करणे आता खूप सोपे झाले आहे. या ॲपचा नक्कीच सर्व गरजू व्यवसायिकांना फायदा होईल.",
    date: '28 Mar 2026'
  },
  {
    id: 'rev-80',
    name: 'Rohan Talukdar',
    city: 'Tezpur',
    state: 'Assam',
    rating: 5,
    comment: "I used the skill-mapper feature to evaluate career pivots. Arohi gave me excellent options combining local resources and remote freelancing setups.",
    date: '27 Mar 2026'
  },
  {
    id: 'rev-81',
    name: 'Sunanda Dash',
    city: 'Rayagada',
    state: 'Odisha',
    rating: 5,
    comment: "ଆରୋହୀ ଏଜୁକେସନାଲ ପୋର୍ଟାଲ ମୋ ଜୀବନର ସବୁଠାରୁ ବଡ଼ ସାହାଯ୍ୟକାରୀ ସାବ୍ୟସ୍ତ ହୋଇଛି। କ୍ୟାରିୟର ପ୍ଲାନିଂ ବୁଝିବାରେ ଏହାଠୁ ସହଜ ପୋର୍ଟาଲ ଦେଖିନି।",
    date: '26 Mar 2026'
  },
  {
    id: 'rev-82',
    name: 'Rajendra Prasad',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    rating: 5,
    comment: "Government scheme parameters are explained with simple visual checklists. Securing agricultural drone funding got much easier because of this guide.",
    date: '25 Mar 2026'
  },
  {
    id: 'rev-83',
    name: 'Pooja Hegde',
    city: 'Mangaluru',
    state: 'Karnataka',
    rating: 5,
    comment: "ಕಾಂಪಿಟೇಟಿವ್ ಎಕ್ಸಾಮ್ ಮತ್ತು ಐಟಿ ಜಾಬ್ ಗೈಡ್ಸ್‌ ಎರಡನ್ನೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ಅಚ್ಚುಕಟ್ಟಾಗಿ ಅಳವಡಿಸಲಾಗಿದೆ. ತುಂಬಾ ಉಪಯುಕ್ತವಾದ ಡಿಜಿಟಲ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.",
    date: '24 Mar 2026'
  },
  {
    id: 'rev-84',
    name: 'Bimal Gurung',
    city: 'Kalimpong',
    state: 'West Bengal',
    rating: 5,
    comment: "The vocational skill guides are top-notch. Finding local agro-processing certificates has given our small team immense direction.",
    date: '23 Mar 2026'
  },
  {
    id: 'rev-85',
    name: 'Sneha Satpathy',
    city: 'Jharsuguda',
    state: 'Odisha',
    rating: 5,
    comment: "ଆଇଟି ଆଣ୍ଡ ସଫ୍ଟୱେର୍ ଜବ୍ ପାଇଁ ରିଜ୍ୟୁମ୍ ଚେକ୍ କରିବାକୁ ମୁଁ ଏହାକୁ ବ୍ୟବହାର କରିଥିଲି। ଏହି ଟୁଲ୍ ଅତି ଅଳ୍ପ ସମୟରେ ଅତି ସଠିକ୍ ପରାମର୍ଶ ଦେଇଥାଏ।",
    date: '22 Mar 2026'
  },
  {
    id: 'rev-86',
    name: 'Dinesh Karthik',
    city: 'Tuticorin',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "This portal bridges the gap between state-level administrative guidelines and local students perfectly. Simple, direct, and multi-faceted.",
    date: '21 Mar 2026'
  },
  {
    id: 'rev-87',
    name: 'Preeti Deswal',
    city: 'Rohtak',
    state: 'Haryana',
    rating: 4,
    comment: "Quantitative and qualitative syllabus guidelines are categorized accurately. It saves us a lot of time searching across different official websites.",
    date: '20 Mar 2026'
  },
  {
    id: 'rev-88',
    name: 'Manoj Bajpayee',
    city: 'Muzaffarpur',
    state: 'Bihar',
    rating: 5,
    comment: "आरोही का जवाब बहुत सटीक और मददगार होता है। हमारे स्थानीय युवाओं के लिए यह ऐप सही दिशा दिखाने में बहुत बड़ी भूमिका निभा रही है।",
    date: '19 Mar 2026'
  },
  {
    id: 'rev-89',
    name: 'Niranjan Swain',
    city: 'Dhenkanal',
    state: 'Odisha',
    rating: 5,
    comment: "ଏଆଇ ଗାଇଡେଡ୍ ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି ସିଷ୍ଟମ୍ ବହୁତ ଭଲ। ନିଜର ପ୍ରତିଦିନର ପ୍ରଗତି ଦେଖି ପ୍ରସ୍ତուତି କରିବା ସହଜ ହେଉଛି। ମୋ ପରିବାରର ସମସ୍ତେ ଏହି ଆପ୍ କୁ ପସନ୍ଦ କରନ୍ତି।",
    date: '18 Mar 2026'
  },
  {
    id: 'rev-90',
    name: 'Savita Deshpande',
    city: 'Kolhapur',
    state: 'Maharashtra',
    rating: 5,
    comment: "The dark professional theme of this application looks highly luxurious and eye-safe. Navigating long career charts is very easy and comfort-driven.",
    date: '17 Mar 2026'
  },
  {
    id: 'rev-91',
    name: 'Jyotiraditya Scindia',
    city: 'Ujjain',
    state: 'Madhya Pradesh',
    rating: 5,
    comment: "Arohi AI explains central schemes like PM-KUSUM and Mudra schemes with absolute precision. Great tool for regional awareness and empowerment.",
    date: '16 Mar 2026'
  },
  {
    id: 'rev-92',
    name: 'Swapna Reddy',
    city: 'Secunderabad',
    state: 'Telangana',
    rating: 5,
    comment: "Highly interactive 3D Orbit components! It's so immersive to explore different domains of career opportunities visually rather than reading text files.",
    date: '15 Mar 2026'
  },
  {
    id: 'rev-93',
    name: 'Gautam Gambhir',
    city: 'New Delhi',
    state: 'Delhi',
    rating: 5,
    comment: "Top marks for design, performance, and responsive interfaces. Transitioning between different modules on cellular networks is lightning fast.",
    date: '14 Mar 2026'
  },
  {
    id: 'rev-94',
    name: 'Urmila Mohanty',
    city: 'Khurda',
    state: 'Odisha',
    rating: 5,
    comment: "ଡ୍ରୋନ୍ ପାଇଲଟିଂ କୋର୍ସ ଏବଂ ଜିଏସଟି ରିଟର୍ଣ୍ଣ ବିଷୟରେ ଯେଉଁ ତାଲିମ ଏଠାରେ ମିଳୁଛି, ତାହା ବାସ୍ତବରେ ମୂଲ୍ୟବାନ। ସବୁ କିଛି ବହୁତ ଶୃଙ୍ଖଳିତ ଅଟେ।",
    date: '13 Mar 2026'
  },
  {
    id: 'rev-95',
    name: 'Vikramjit Singh',
    city: 'Firozpur',
    state: 'Punjab',
    rating: 4,
    comment: "The ATS resume reviewer gave me exactly the missing keywords for corporate and logistics roles. Unbelievable precision!",
    date: '12 Mar 2026'
  },
  {
    id: 'rev-96',
    name: 'Dipali Sen',
    city: 'Malda',
    state: 'West Bengal',
    rating: 5,
    comment: "আ রোহীর ইন্টারভিউ প্র্যাকটিস পোর্টাল খুব সহায়ক। নিয়মিত ব্যবহার করে আমার কথা बोलनेর জড়তা অনেকটাই কমে গেছে।",
    date: '11 Mar 2026'
  },
  {
    id: 'rev-97',
    name: 'Manish Pandey',
    city: 'Nainital',
    state: 'Uttarakhand',
    rating: 5,
    comment: "This is hands-down the best digital initiative for students. The interactive walkthrough tour explained everything so simply.",
    date: '10 Mar 2026'
  },
  {
    id: 'rev-98',
    name: 'Sushree Sangita',
    city: 'Jagatsinghpur',
    state: 'Odisha',
    rating: 5,
    comment: "ଆମ କ୍ୟାରିୟର ପରାମର୍ଶ ପାଇଁ ଆରୋହୀ ଏଆଇ ଜଣେ ବନ୍ଧୁ ଭଳି ସାହାଯ୍ୟ କରେ। ମୋର ସମସ୍ତ ପ୍ରଶ୍ନର ଅତି ସୁନ୍ଦର ଉତ୍ତର ଦିଏ।",
    date: '09 Mar 2026'
  },
  {
    id: 'rev-99',
    name: 'Sandesh Kadam',
    city: 'Satara',
    state: 'Maharashtra',
    rating: 5,
    comment: "Excellent study plan layouts. It breaks down massive administrative syllabi into logical daily tasks, making preparation stress-free.",
    date: '08 Mar 2026'
  },
  {
    id: 'rev-100',
    name: 'Aravind Swamy',
    city: 'Erode',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "The premium design, dark colors, and clean sliders are beautifully polished. This app truly delivers an outstanding user experience.",
    date: '07 Mar 2026'
  },
  {
    id: 'rev-101',
    name: 'Alok Tripathy',
    city: 'Phulbani',
    state: 'Odisha',
    rating: 5,
    comment: "ମୋ ବ୍ୟବସାୟର ପ୍ରାରମ୍ଭିକ ପଞ୍ଜୀକରଣ ପାଇଁ ଏହି ଆପ୍ ବହୁତ ସାହାଯ୍ୟ କଲା। ଆଇନଗତ ପ୍ରକ୍ରିୟା ଏବଂ ସବସିଡି ବିଷୟରେ ବୁଝିବା ଅତି ସହଜ ହେଲା।",
    date: '06 Mar 2026'
  },
  {
    id: 'rev-102',
    name: 'Rajinder Kaur',
    city: 'Bhatinda',
    state: 'Punjab',
    rating: 5,
    comment: "Amazing customer support and interactive features. Preparing for competitive banking and clerical posts has become so streamlined now.",
    date: '05 Mar 2026'
  },
  {
    id: 'rev-103',
    name: 'Hardik Mehta',
    city: 'Jamnagar',
    state: 'Gujarat',
    rating: 5,
    comment: "સરકારી યોજનાઓ અને ઉદ્યોગ લોન માટેનો રસ્તો આ એપ્લિકેશન ખૂબ જ સરળ બનાવે છે. સાચી અને સચોટ વિગતો એક જ જગ્યાએ મળે છે.",
    date: '04 Mar 2026'
  },
  {
    id: 'rev-104',
    name: 'Sumati Patnaik',
    city: 'Jeypore',
    state: 'Odisha',
    rating: 5,
    comment: "ପରୀକ୍ଷା ପ୍ରସ୍ତୁତି କରୁଥିବା ଓଡ଼ିଶାର ସମସ୍ତ ଛାତ୍ରଛாତ୍ରୀ ମାନଙ୍କ ପାଇଁ ଏହି ଆପ୍‌ ଏକ ଚମତ୍କାର ମେଣ୍ଟର। ଆରୋହୀ ଏଆଇ ଗାଇଡେନ୍ସ ଅତି ସରଳ ଓ ସଠିକ।",
    date: '03 Mar 2026'
  },
  {
    id: 'rev-105',
    name: 'Kshitij Saxena',
    city: 'Bareilly',
    state: 'Uttar Pradesh',
    rating: 4,
    comment: "Highly educational! The drone training videos and agri-spraying guides explain GPS positioning and safety steps with excellent visuals.",
    date: '02 Mar 2026'
  },
  {
    id: 'rev-106',
    name: 'Kalyani Sreedharan',
    city: 'Kollam',
    state: 'Kerala',
    rating: 5,
    comment: "I used the resume builder tool to craft my professional profile. The system formatted it into a highly premium and clean ATS template instantly.",
    date: '01 Mar 2026'
  },
  {
    id: 'rev-107',
    name: 'Sarojini Sahoo',
    city: 'Kendrapara',
    state: 'Odisha',
    rating: 5,
    comment: "ଜୀବିକା ଅନ୍ୱେଷଣରେ ଏହି ପୋର୍ଟାଲ ମୋତେ ସମ୍ପୂର୍ଣ୍ଣ ସଠିକ୍ ଦିଗ ଦେଖାଇଛି। ପ୍ରଶ୍ନର ଅତି ସୁନ୍ଦର ବିଶ୍ଳେଷଣ ମୋର ବହୁତ ପସନ୍ଦ ଆସିଲା।",
    date: '28 Feb 2026'
  },
  {
    id: 'rev-108',
    name: 'Abhiram Deshpande',
    city: 'Solapur',
    state: 'Maharashtra',
    rating: 5,
    comment: "Best next-gen vocational learning app! Having courses on MSME accounting, drone flying, and logical reasoning makes this incredibly resource-rich.",
    date: '27 Feb 2026'
  },
  {
    id: 'rev-109',
    name: 'Amrita Pritam',
    city: 'Pathankot',
    state: 'Punjab',
    rating: 5,
    comment: "The speech-guided mock interview tool is incredible. Arohi pointed out exactly where my voice was fast and gave solid examples to pace it better.",
    date: '26 Feb 2026'
  },
  {
    id: 'rev-110',
    name: 'Girish Karnad',
    city: 'Hubli',
    state: 'Karnataka',
    rating: 5,
    comment: "The D3 visual career maps provide unmatched clarity. Moving from junior developer roles to high-level system architect positions is charted out clearly.",
    date: '25 Feb 2026'
  },
  {
    id: 'rev-111',
    name: 'Basanta Sahu',
    city: 'Bargarh',
    state: 'Odisha',
    rating: 5,
    comment: "ଆରୋହୀ ଏଆଇ ଜରିଆରେ କୃଷି ଡ୍ରୋନ୍ ସବସିଡି ସମ୍ବନ୍ଧରେ ସବିଶେଷ ବିବରଣୀ ପାଇବା ଅତି ସହଜ ହେଲା। ଏତେ ସରଳ ଭାଷାରେ ବଉଝାଇବା ସତରେ ଅଭିନନ୍ଦନୀୟ।",
    date: '24 Feb 2026'
  },
  {
    id: 'rev-112',
    name: 'Riddhi Joshi',
    city: 'Surat',
    state: 'Gujarat',
    rating: 4,
    comment: "Excellent tool for freshers looking for direct startup advice. The step-by-step MSME checklists make initial filing procedures painless.",
    date: '23 Feb 2026'
  },
  {
    id: 'rev-113',
    name: 'Chidambaram Pillai',
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    rating: 5,
    comment: "The premium user interface of this portal is stunning. The responsive navigation sliders, language selectors, and rich 3D items load incredibly smoothly.",
    date: '22 Feb 2026'
  },
  {
    id: 'rev-114',
    name: 'Sabitri Tripathy',
    city: 'Puri',
    state: 'Odisha',
    rating: 5,
    comment: "ଏହି ଆପ୍‌ ମାଧ୍ୟମରେ ମୁଁ କମ୍ପ୍ୟୁଟର ଏକ୍ସେଲ ଏବଂ ଆକାଉଣ୍ଟିଂ ଶିକ୍ଷା ସମ୍ପୂର୍ଣ୍ଣ କଲି। ପାଠ୍ୟକ୍ରମଟି ବହୁତ ସରଳ ଏବଂ ଗ୍ରହଣୀୟ ଢଙ୍ଗରେ ପ୍ରସ୍ତୁତ ହୋଇଛି।",
    date: '21 Feb 2026'
  },
  {
    id: 'rev-115',
    name: 'Nikhil Mahajan',
    city: 'Noida',
    state: 'Uttar Pradesh',
    rating: 5,
    comment: "Amazing logic compiler module for engineering practice. Arohi validates our custom scripts and provides helpful tips on clean code standards.",
    date: '20 Feb 2026'
  },
  {
    id: 'rev-116',
    name: 'Devanand Barik',
    city: 'Sonepur',
    state: 'Odisha',
    rating: 5,
    comment: "ଆମ ଓଡ଼ିଶାର କୃଷକ ଏବଂ ଶିକ୍ଷିତ ଯୁବକମାନଙ୍କ ପାଇଁ ଏହି ଆପ୍ ଏକ ଚମତ୍କାର ମାର୍ଗଦର୍ଶକ ସାଜିଛି। ସରକାରୀ ଯୋଜନାର ଲାଭ ଉଠାଇବାରେ ଏହା ଅତି ମହତ୍ତ୍ଵପୂର୍ଣ୍ଣ।",
    date: '19 Feb 2026'
  },
  {
    id: 'rev-117',
    name: 'Snehal Chougule',
    city: 'Sangli',
    state: 'Maharashtra',
    rating: 5,
    comment: "I used the Udyam registration tool guide. Got my micro business registered online without paying any external agent fees. Simply brilliant!",
    date: '18 Feb 2026'
  },
  {
    id: 'rev-118',
    name: 'Manoranjan Jena',
    city: 'Keonjhar',
    state: 'Odisha',
    rating: 5,
    comment: "The drone and smart agriculture modules are very state-of-the-art. Highly intuitive instructions, real-time examples, and amazing graphics make it very fun to learn.",
    date: '17 Feb 2026'
  },
  {
    id: 'rev-119',
    name: 'Asha Bhat',
    city: 'Karwar',
    state: 'Karnataka',
    rating: 5,
    comment: "Very elegant layouts and rich resources. Navigating across state-level schemes, online exam trackers, and the Resume scoring matrix is very quick.",
    date: '16 Feb 2026'
  },
  {
    id: 'rev-120',
    name: 'Anupama Behera',
    city: 'Cuttack',
    state: 'Odisha',
    rating: 5,
    comment: "ଆରୋହୀ ଏଆଇ ର ପ୍ରଶ୍ନୋତ୍ତର ମାଧ୍ୟମରେ ମୁଁ କମ୍ପ୍ୟୁଟର ପ୍ରଶାସନିକ ପରୀକ୍ଷା ପାଇଁ ପ୍ରସ୍ତୁତ ହୋଇ ପାରିଛି। ସବୁଠୁ ବଡ କଥା ହେଲା ଏଠାରେ ମୋର ପ୍ରଗତି ସବୁଦିନ ସୁରକ୍ଷିତ ରହିଥାଏ।",
    date: '15 Feb 2026'
  }
];
