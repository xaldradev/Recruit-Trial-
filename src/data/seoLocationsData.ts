export interface GlobalLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  path: string;
  region: string;
}

export interface IndianState {
  slug: string;
  name: string;
  nativeName: string;
  capital: string;
  code: string;
  path: string;
}

export interface WorldCountry {
  code: string;
  name: string;
  flag: string;
  path: string;
  primaryLang: string;
}

export const GLOBAL_LANGUAGES: GlobalLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', path: '/', region: 'Global' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', path: '/hi', region: 'India' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳', path: '/or', region: 'India (Odisha)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', path: '/bn', region: 'India / Bangladesh' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', path: '/te', region: 'India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', path: '/mr', region: 'India' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', path: '/ta', region: 'India / Sri Lanka' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', path: '/gu', region: 'India' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', path: '/ur', region: 'Global / India' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', path: '/kn', region: 'India' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', path: '/ml', region: 'India' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', path: '/pa', region: 'India' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳', path: '/as', region: 'India' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', path: '/ru', region: 'Russia & CIS' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', path: '/es', region: 'Spain & Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', path: '/fr', region: 'France & Francophonie' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', path: '/de', region: 'Germany & Europe' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', path: '/ja', region: 'Japan' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', path: '/zh', region: 'China & East Asia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', path: '/ar', region: 'Middle East & North Africa' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', path: '/pt', region: 'Brazil & Portugal' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', path: '/it', region: 'Italy' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', path: '/ko', region: 'South Korea' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', path: '/tr', region: 'Turkey' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', path: '/id', region: 'Indonesia' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', path: '/sw', region: 'East Africa' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', path: '/am', region: 'Horn of Africa' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', path: '/ha', region: 'West Africa' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', path: '/yo', region: 'West Africa' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', flag: '🇿🇦', path: '/zu', region: 'Southern Africa' }
];

export const INDIAN_STATES: IndianState[] = [
  // 28 States
  { slug: 'andhra-pradesh', name: 'Andhra Pradesh', nativeName: 'ఆంధ్రప్రదేశ్', capital: 'Amaravati', code: 'AP', path: '/state/andhra-pradesh' },
  { slug: 'arunachal-pradesh', name: 'Arunachal Pradesh', nativeName: 'अरुणाचल प्रदेश', capital: 'Itanagar', code: 'AR', path: '/state/arunachal-pradesh' },
  { slug: 'assam', name: 'Assam', nativeName: 'অসম', capital: 'Dispur', code: 'AS', path: '/state/assam' },
  { slug: 'bihar', name: 'Bihar', nativeName: 'बिहार', capital: 'Patna', code: 'BR', path: '/state/bihar' },
  { slug: 'chhattisgarh', name: 'Chhattisgarh', nativeName: 'छत्तीसगढ़', capital: 'Raipur', code: 'CG', path: '/state/chhattisgarh' },
  { slug: 'goa', name: 'Goa', nativeName: 'गोवा', capital: 'Panaji', code: 'GA', path: '/state/goa' },
  { slug: 'gujarat', name: 'Gujarat', nativeName: 'ગુજરાત', capital: 'Gandhinagar', code: 'GJ', path: '/state/gujarat' },
  { slug: 'haryana', name: 'Haryana', nativeName: 'हरियाणा', capital: 'Chandigarh', code: 'HR', path: '/state/haryana' },
  { slug: 'himachal-pradesh', name: 'Himachal Pradesh', nativeName: 'हिमाचल प्रदेश', capital: 'Shimla', code: 'HP', path: '/state/himachal-pradesh' },
  { slug: 'jharkhand', name: 'Jharkhand', nativeName: 'झारखंड', capital: 'Ranchi', code: 'JH', path: '/state/jharkhand' },
  { slug: 'karnataka', name: 'Karnataka', nativeName: 'ಕರ್ನಾಟಕ', capital: 'Bengaluru', code: 'KA', path: '/state/karnataka' },
  { slug: 'kerala', name: 'Kerala', nativeName: 'കേരളം', capital: 'Thiruvananthapuram', code: 'KL', path: '/state/kerala' },
  { slug: 'madhya-pradesh', name: 'Madhya Pradesh', nativeName: 'मध्य प्रदेश', capital: 'Bhopal', code: 'MP', path: '/state/madhya-pradesh' },
  { slug: 'maharashtra', name: 'Maharashtra', nativeName: 'महाराष्ट्र', capital: 'Mumbai', code: 'MH', path: '/state/maharashtra' },
  { slug: 'manipur', name: 'Manipur', nativeName: 'মণিপুর', capital: 'Imphal', code: 'MN', path: '/state/manipur' },
  { slug: 'meghalaya', name: 'Meghalaya', nativeName: 'Meghalaya', capital: 'Shillong', code: 'ML', path: '/state/meghalaya' },
  { slug: 'mizoram', name: 'Mizoram', nativeName: 'Mizoram', capital: 'Aizawl', code: 'MZ', path: '/state/mizoram' },
  { slug: 'nagaland', name: 'Nagaland', nativeName: 'Nagaland', capital: 'Kohima', code: 'NL', path: '/state/nagaland' },
  { slug: 'odisha', name: 'Odisha', nativeName: 'ଓଡ଼ିଆ', capital: 'Bhubaneswar', code: 'OR', path: '/state/odisha' },
  { slug: 'punjab', name: 'Punjab', nativeName: 'ਪੰਜਾਬ', capital: 'Chandigarh', code: 'PB', path: '/state/punjab' },
  { slug: 'rajasthan', name: 'Rajasthan', nativeName: 'राजस्थान', capital: 'Jaipur', code: 'RJ', path: '/state/rajasthan' },
  { slug: 'sikkim', name: 'Sikkim', nativeName: 'सिक्किम', capital: 'Gangtok', code: 'SK', path: '/state/sikkim' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', nativeName: 'தமிழ்நாடு', capital: 'Chennai', code: 'TN', path: '/state/tamil-nadu' },
  { slug: 'telangana', name: 'Telangana', nativeName: 'తెలంగాణ', capital: 'Hyderabad', code: 'TG', path: '/state/telangana' },
  { slug: 'tripura', name: 'Tripura', nativeName: 'ত্রিপুরা', capital: 'Agartala', code: 'TR', path: '/state/tripura' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', nativeName: 'उत्तर प्रदेश', capital: 'Lucknow', code: 'UP', path: '/state/uttar-pradesh' },
  { slug: 'uttarakhand', name: 'Uttarakhand', nativeName: 'उत्तराखंड', capital: 'Dehradun', code: 'UK', path: '/state/uttarakhand' },
  { slug: 'west-bengal', name: 'West Bengal', nativeName: 'পশ্চিমবঙ্গ', capital: 'Kolkata', code: 'WB', path: '/state/west-bengal' },

  // 8 Union Territories
  { slug: 'andaman-nicobar', name: 'Andaman & Nicobar Islands', nativeName: 'अंडमान और निकोबार', capital: 'Port Blair', code: 'AN', path: '/state/andaman-nicobar' },
  { slug: 'chandigarh', name: 'Chandigarh UT', nativeName: 'चंडीगढ़ UT', capital: 'Chandigarh', code: 'CH', path: '/state/chandigarh' },
  { slug: 'dadra-nagar-haveli-daman-diu', name: 'Dadra & Nagar Haveli & Daman & Diu', nativeName: 'दादरा नगर हवेली एवं दमन दीव', capital: 'Daman', code: 'DN', path: '/state/dadra-nagar-haveli-daman-diu' },
  { slug: 'delhi', name: 'Delhi NCR (UT)', nativeName: 'दिल्ली NCR', capital: 'New Delhi', code: 'DL', path: '/state/delhi' },
  { slug: 'jammu-kashmir', name: 'Jammu & Kashmir (UT)', nativeName: 'जम्मू और कश्मीर', capital: 'Srinagar / Jammu', code: 'JK', path: '/state/jammu-kashmir' },
  { slug: 'ladakh', name: 'Ladakh (UT)', nativeName: 'लद्दाख', capital: 'Leh', code: 'LA', path: '/state/ladakh' },
  { slug: 'lakshadweep', name: 'Lakshadweep (UT)', nativeName: 'लक्षद्वीप', capital: 'Kavaratti', code: 'LD', path: '/state/lakshadweep' },
  { slug: 'puducherry', name: 'Puducherry (UT)', nativeName: 'புதுச்சேரி', capital: 'Puducherry', code: 'PY', path: '/state/puducherry' }
];

export const WORLD_COUNTRIES: WorldCountry[] = [
  // Asia & Pacific
  { code: 'IN', name: 'India', flag: '🇮🇳', path: '/country/in', primaryLang: 'hi' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', path: '/country/jp', primaryLang: 'ja' },
  { code: 'CN', name: 'China', flag: '🇨🇳', path: '/country/cn', primaryLang: 'zh' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', path: '/country/kr', primaryLang: 'ko' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', path: '/country/sg', primaryLang: 'en' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', path: '/country/id', primaryLang: 'id' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', path: '/country/th', primaryLang: 'en' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', path: '/country/vn', primaryLang: 'en' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', path: '/country/my', primaryLang: 'en' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', path: '/country/ph', primaryLang: 'en' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', path: '/country/bd', primaryLang: 'bn' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', path: '/country/lk', primaryLang: 'ta' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', path: '/country/np', primaryLang: 'hi' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', path: '/country/bt', primaryLang: 'en' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', path: '/country/mv', primaryLang: 'en' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', path: '/country/tw', primaryLang: 'zh' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', path: '/country/hk', primaryLang: 'zh' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', path: '/country/kh', primaryLang: 'en' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', path: '/country/la', primaryLang: 'en' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', path: '/country/mm', primaryLang: 'en' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', path: '/country/mn', primaryLang: 'en' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', path: '/country/kz', primaryLang: 'ru' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', path: '/country/uz', primaryLang: 'ru' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', path: '/country/tm', primaryLang: 'ru' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', path: '/country/kg', primaryLang: 'ru' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', path: '/country/tj', primaryLang: 'ru' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', path: '/country/bn', primaryLang: 'en' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱', path: '/country/tl', primaryLang: 'en' },

  // Middle East & North Africa
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', path: '/country/ae', primaryLang: 'ar' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', path: '/country/sa', primaryLang: 'ar' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', path: '/country/qa', primaryLang: 'ar' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', path: '/country/kw', primaryLang: 'ar' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', path: '/country/om', primaryLang: 'ar' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', path: '/country/bh', primaryLang: 'ar' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', path: '/country/jo', primaryLang: 'ar' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', path: '/country/il', primaryLang: 'en' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', path: '/country/eg', primaryLang: 'ar' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', path: '/country/ma', primaryLang: 'ar' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', path: '/country/tr', primaryLang: 'tr' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', path: '/country/lb', primaryLang: 'ar' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', path: '/country/iq', primaryLang: 'ar' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', path: '/country/ir', primaryLang: 'en' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', path: '/country/tn', primaryLang: 'ar' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', path: '/country/dz', primaryLang: 'ar' },

  // Europe
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', path: '/country/gb', primaryLang: 'en' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', path: '/country/de', primaryLang: 'de' },
  { code: 'FR', name: 'France', flag: '🇫🇷', path: '/country/fr', primaryLang: 'fr' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', path: '/country/it', primaryLang: 'it' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', path: '/country/es', primaryLang: 'es' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', path: '/country/ru', primaryLang: 'ru' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', path: '/country/ch', primaryLang: 'de' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', path: '/country/nl', primaryLang: 'en' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', path: '/country/se', primaryLang: 'en' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', path: '/country/no', primaryLang: 'en' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', path: '/country/dk', primaryLang: 'en' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', path: '/country/fi', primaryLang: 'en' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', path: '/country/pl', primaryLang: 'en' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', path: '/country/pt', primaryLang: 'en' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', path: '/country/be', primaryLang: 'fr' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', path: '/country/at', primaryLang: 'de' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', path: '/country/ie', primaryLang: 'en' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', path: '/country/gr', primaryLang: 'en' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', path: '/country/cz', primaryLang: 'en' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', path: '/country/hu', primaryLang: 'en' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', path: '/country/ro', primaryLang: 'en' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', path: '/country/ua', primaryLang: 'ru' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', path: '/country/hr', primaryLang: 'en' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', path: '/country/rs', primaryLang: 'en' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', path: '/country/bg', primaryLang: 'en' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', path: '/country/sk', primaryLang: 'en' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', path: '/country/si', primaryLang: 'en' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', path: '/country/ee', primaryLang: 'en' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', path: '/country/lv', primaryLang: 'en' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', path: '/country/lt', primaryLang: 'en' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', path: '/country/is', primaryLang: 'en' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', path: '/country/lu', primaryLang: 'fr' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', path: '/country/mt', primaryLang: 'en' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', path: '/country/cy', primaryLang: 'en' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', path: '/country/ge', primaryLang: 'en' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', path: '/country/am', primaryLang: 'en' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', path: '/country/az', primaryLang: 'en' },

  // Americas
  { code: 'US', name: 'United States', flag: '🇺🇸', path: '/country/us', primaryLang: 'en' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', path: '/country/ca', primaryLang: 'en' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', path: '/country/mx', primaryLang: 'es' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', path: '/country/br', primaryLang: 'pt' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', path: '/country/ar', primaryLang: 'es' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', path: '/country/cl', primaryLang: 'es' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', path: '/country/co', primaryLang: 'es' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', path: '/country/pe', primaryLang: 'es' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', path: '/country/ve', primaryLang: 'es' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', path: '/country/uy', primaryLang: 'es' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', path: '/country/ec', primaryLang: 'es' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', path: '/country/py', primaryLang: 'es' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', path: '/country/bo', primaryLang: 'es' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', path: '/country/cr', primaryLang: 'es' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', path: '/country/pa', primaryLang: 'es' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', path: '/country/do', primaryLang: 'es' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', path: '/country/gt', primaryLang: 'es' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', path: '/country/jm', primaryLang: 'en' },
  { code: 'TT', name: 'Trinidad & Tobago', flag: '🇹🇹', path: '/country/tt', primaryLang: 'en' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', path: '/country/bs', primaryLang: 'en' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', path: '/country/bb', primaryLang: 'en' },

  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', path: '/country/za', primaryLang: 'zu' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', path: '/country/ng', primaryLang: 'ha' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', path: '/country/ke', primaryLang: 'sw' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', path: '/country/gh', primaryLang: 'en' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', path: '/country/et', primaryLang: 'am' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', path: '/country/tz', primaryLang: 'sw' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', path: '/country/ug', primaryLang: 'sw' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', path: '/country/rw', primaryLang: 'en' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', path: '/country/mu', primaryLang: 'en' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', path: '/country/sc', primaryLang: 'en' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', path: '/country/sn', primaryLang: 'fr' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', path: '/country/ci', primaryLang: 'fr' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', path: '/country/cm', primaryLang: 'fr' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', path: '/country/zw', primaryLang: 'en' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', path: '/country/zm', primaryLang: 'en' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', path: '/country/na', primaryLang: 'en' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', path: '/country/bw', primaryLang: 'en' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', path: '/country/ao', primaryLang: 'pt' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', path: '/country/mz', primaryLang: 'pt' },

  // Oceania
  { code: 'AU', name: 'Australia', flag: '🇦🇺', path: '/country/au', primaryLang: 'en' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', path: '/country/nz', primaryLang: 'en' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', path: '/country/fj', primaryLang: 'en' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', path: '/country/pg', primaryLang: 'en' }
];
