import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Download, 
  CheckCircle, 
  Compass, 
  ChevronRight, 
  HelpCircle, 
  ArrowRight, 
  Search, 
  Star, 
  Award, 
  BookOpenCheck, 
  Flame, 
  Calendar,
  Layers,
  MessageSquare,
  Bot,
  Heart,
  ChevronDown,
  ChevronUp,
  Clock,
  ThumbsUp,
  MapPin,
  ClipboardList
} from 'lucide-react';

interface Chapter {
  name: string;
  weightage: string;
  description: string;
  topics: string[];
}

interface Subject {
  id: string;
  name: string;
  odiaName?: string;
  icon: string;
  chapters: Chapter[];
  resources: string[];
}

interface SyllabusData {
  [key: string]: { // Board: 'odia', 'cbse', 'icse', 'china2070'
    [key: number]: Subject[]; // Class: 1 to 10
  }
}

// Complete realistic syllabus dataset for BSE Odisha (Odia Medium), CBSE, and ICSE
const BOARD_SUBJECTS = {
  odia: [
    { id: 'odia', name: 'Odia Language', icon: '✍️', odiaName: 'ମାତୃଭାଷା' },
    { id: 'maths', name: 'Mathematics', icon: '📐', odiaName: 'ଗଣିତ' },
    { id: 'science', name: 'Science', icon: '🔬', odiaName: 'ବିଜ୍ଞାନ' },
    { id: 'social', name: 'Social Science', icon: '🗺️', odiaName: 'ସାମାଜିକ ବିଜ୍ଞାନ' },
    { id: 'english', name: 'English', icon: '📖', odiaName: 'ଇଂରାଜୀ ଭାଷା' }
  ],
  cbse: [
    { id: 'english', name: 'English Language & Lit', icon: '📖' },
    { id: 'maths', name: 'Mathematics', icon: '📐' },
    { id: 'science', name: 'Science', icon: '🔬' },
    { id: 'social', name: 'Social Science', icon: '🗺️' },
    { id: 'hindi', name: 'Hindi Reader (L2)', icon: '✍️' }
  ],
  icse: [
    { id: 'english', name: 'English Language & Lit', icon: '📖' },
    { id: 'maths', name: 'Mathematics', icon: '📐' },
    { id: 'physics', name: 'Physics (Concise)', icon: '⚡' },
    { id: 'chemistry', name: 'Chemistry (Concise)', icon: '🧪' },
    { id: 'biology', name: 'Biology (Concise)', icon: '🌿' },
    { id: 'history', name: 'History & Civics', icon: '🏛️' },
    { id: 'geography', name: 'Geography Spec', icon: '🌍' }
  ],
  china2070: [
    { id: 'abacus_math', name: 'Soroban Abacus & Extreme Math', icon: '🧮' },
    { id: 'micro_robotics', name: 'Microcontrollers, IoT & Robotics', icon: '🤖' },
    { id: 'ai_cognition', name: 'AI Engineering & Neural Cognition', icon: '🧠' },
    { id: 'quantum_phys', name: 'Quantum Computing & Semiconductor Physics', icon: '⚛️' },
    { id: 'bio_tech', name: 'CRISPR Bio-Hacking & Genetics', icon: '🧬' },
    { id: 'space_rocketry', name: 'Aerospace Engineering & Rocketry', icon: '🚀' }
  ]
};

const TRANSLATIONS: { [key: string]: string } = {
  "Basic Letters and Phonetic Sounds": "ସ୍ଵରବର୍ଣ୍ଣ ଓ ବ୍ୟଞ୍ଜନବର୍ଣ୍ଣ ଶିକ୍ଷା",
  "Learning vowels, consonants, stroke orders, and sound pronunciations": "ଓଡ଼ିଆ ଅକ୍ଷରମାଳା, ସୁନ୍ଦର ହସ୍ତାକ୍ଷର ଓ ଶବ୍ଦ ଲେଖନ ପ୍ରଣାଳୀ।",
  "Sight Words & Vocabulary Building": "ସରଳ ଜୁକ୍ତାକ୍ଷର ଓ ଶବ୍ଦକୋଷ ଶିକ୍ଷା",
  "Reading two and three-letter words, simple pronunciation patterns": "ଓଡ଼ିଆ ଯୁକ୍ତାକ୍ଷର ଗଠନ, ସରଳ ପଦ ପଠନ ଓ ବାକ୍ୟ ରଚନା।",
  "Joyful Nursery Rhymes": "ଆମ ପଲ୍ଲୀ କବିତା ଓ ଗୀତ",
  "Reciting simple lyrics with rhythmic comprehension": "ଓଡ଼ିଶାର ପାରମ୍ପରିକ ପଲ୍ଲୀଗୀତ ଓ କବିତା ଆବୃତ୍ତି।",
  "Picture Sentence Writing": "ଚିତ୍ର ଦେଖି ସରଳ ବାକ୍ୟ ରଚନା",
  "Constructing simple descriptive phrases from visual cards": "ଦୃଶ୍ୟ ମାଧ୍ୟମରେ ସରଳ ବାକ୍ୟ ଗଠନ ଓ ଭାଷା ବିକାଶ।",
  "Grammar: Basic Parts of Speech": "ଓଡ଼ିଆ ଶବ୍ଦ ପରିଚୟ (ବ୍ୟାକରଣ)",
  "Understanding Nouns, Pronouns, Verbs, and Adjectives in sentence structures": "ବିଶେଷ୍ୟ, ବିଶେଷଣ, ସର୍ବନାମ ଓ ସରଳ ବ୍ୟାକରଣ ନିୟମ।",
  "The Honest Woodcutter & Short Stories": "ନୈତିକ ସରଳ କାହାଣୀ ଓ ଗଦ୍ୟ ପାଠ",
  "Reading classic moral stories to improve comprehension and vocabulary": "ମହାନ ବ୍ୟକ୍ତିଙ୍କ ଜୀବନୀ ଓ ଗୁରୁ ଶିଷ୍ୟ ପରମ୍ପରା ପଠନ।",
  "Sentences & Punctuation": "ଓଡ଼ିଆ ବ୍ୟାକରଣ ଓ ବିଶ୍ରାମ ଚିହ୍ନ",
  "Using capital letters, commas, question marks, and full stops correctly": "ଲିଙ୍ଗ, ବଚନ, କାରକ ଓ ସନ୍ଧି ନିୟମ ଶିକ୍ଷା।",
  "Creative Composition & Paragraphs": "ଅନୁଚ୍ଛେଦ ଓ ସରଳ ପତ୍ର ଲିଖନ",
  "Learning to write clean, cohesive paragraphs and letters to friends": "ଆମ ଓଡ଼ିଶା ବିଷୟରେ ରଚନା ଓ ପ୍ରାକୃତିକ ପଦ ଗଠନ।",
  "Grammar: Tenses & Voice Transformations": "ଓଡ଼ିଆ ବ୍ୟାକରଣ: ସନ୍ଧି ଓ ସମାସ",
  "Detailed study of active and passive voice, simple and continuous tenses": "କ୍ରିୟା ପଦ, ସ୍ୱରସନ୍ଧି, ବ୍ୟଞ୍ଜନସନ୍ଧି ଓ ସମାସ ର ପ୍ରକାରଭେଦ।",
  "Poetry & Literary Comprehension": "ମୈତ୍ରୀ ଭାବ ଓ ଦେଶଭକ୍ତି କବିତା",
  "Reading and analyzing classical poems for theme, rhyme, and imagery": "ଓଡ଼ିଶାର ବରପୁତ୍ରମାନଙ୍କ ମହାନ ଜୀବନୀ ଓ କବିଙ୍କ ବାଣୀ।",
  "Grammar: Direct and Indirect Speech": "ଶବ୍ଦ ଭଣ୍ଡାର ଓ କୃଦନ୍ତ-ତଦ୍ଧିତ",
  "Reporting conversations with precise tense-shifting rules": "ତତ୍ସମ, ତଦ୍ଭବ, ଦେଶଜ ଓ ବୈଦେଶିକ ଶବ୍ଦ ବିଚାର।",
  "Notice, Email & Report Writing": "ସଭା ବିବରଣୀ ଓ ଆବେଦନ ପତ୍ର ଲିଖନ",
  "Standard templates of writing official notices, formal emails, and reports": "ଶିକ୍ଷା ଓ ଶୃଙ୍ଖଳା ବିଷୟକ ଆବେଦନ ପତ୍ର।",
  "Classical Drama & Plays": "ନାଟକ ଓ ସାହିତ୍ୟ ସୌରଭ",
  "Detailed line-by-line analysis of classic Indian and Shakespearean drama": "ନାଟକର କଥାବସ୍ତୁ ଓ ମାନବିକ ସମ୍ବେଦନଶୀଳତା।",
  "Grammar: Clause Synthesis & Transformations": "ସନ୍ଧି, କାରକ, ବିଭକ୍ତି ଓ ଅଳଙ୍କାର",
  "Combining complex sentences using relative clauses, noun clauses, and prepositions": "କାରକ ଓ ବିଭକ୍ତି, ସମାସ ଓ ଅଳଙ୍କାର ରୂଢ଼ି ପ୍ରୟୋଗ।",
  "Treasury of Poems & Short Stories": "ମାତୃଭାଷା ସାହିତ୍ୟ ଓ କାହାଣୀ ସଂଗ୍ରହ",
  "Detailed study of iconic prose and poems on human nature and heritage": "ବନ୍ଦେ ଉତ୍କଳ ଜନନୀ, ଜନ୍ମଭୂମି ଓ ସର୍ବଂସହା ମାଟି ର ପଠନ।",
  "Academic Writing": "ରଚନା, ବ୍ୟାକରଣ ଓ ପତ୍ର ଲିଖନ",
  "Developing 350-word structured essays with logical topic arguments": "ଓଡ଼ିଶା ଇତିହାସ ବିଷୟକ ମୌଳିକ ରଚନା।",
  "Numbers & Counting (1 to 100)": "ସଂଖ୍ୟା ପରିଚୟ ଓ ଗଣତି (୧ ରୁ ୧୦୦)",
  "Read, write, compare, and understand numbers with place values up to 100": "ସଂଖ୍ୟା ଲେଖିବା, ଚିହ୍ନିବା ଏବଂ ବୃହତ୍ତମ ଓ କ୍ଷୁଦ୍ରତମ ସଂଖ୍ୟା ନିରୂପଣ।",
  "Addition & Subtraction Basics": "ସରଳ ମିଶାଣ ଓ ଫେଡ଼ାଣ ପ୍ରକ୍ରିୟା",
  "Single-digit and double-digit carry-over addition and subtraction with visual aids": "ଏକକ ଓ ଦଶକ ଘରର ସରଳ ମିଶାଣ, ବିୟୋଗ ଓ ହାତରଖା ମିଶାଣ।",
  "Shapes, Sizes & Patterns": "ଆକୃତି, ସଜ୍ଜା ଓ ଜ୍ୟାମିତିକ ଚିତ୍ର",
  "Identifying 2D and 3D shapes and understanding simple repeating sequences": "ସରଳ ଜ୍ୟାମିତିକ ଚିତ୍ର ଏବଂ ସେମାନଙ୍କର ଗୁଣଧର୍ମ।",
  "Introductory Money & Time": "ମୁଦ୍ରା ଓ ସମୟ ଜ୍ଞାନ ଶିକ୍ଷା",
  "Recognizing Indian coins and notes, reading clocks, and days of the week": "ଓଡ଼ିଆ ମୁଦ୍ରା ଚିହ୍ନଟ, ଘଣ୍ଟା ପାଠ ଓ କ୍ୟାଲେଣ୍ଡର ଦିନ।",
  "Large Numbers & Operations": "ବୃହତ୍ ସଂଖ୍ୟା ଓ ଗୁଣନ ପ୍ରକ୍ରିୟା",
  "Understanding numbers up to lakhs, large additions, subtractions, and multiplication": "ଲକ୍ଷ ପର୍ଯ୍ୟନ୍ତ ସଂଖ୍ୟାର ବିଶ୍ଲେଷଣ, ସ୍ଥାନୀୟ ମାନ ଓ ଗୁଣଫଳ।",
  "Division & Multiples": "ହରଣ ଓ ଗୁଣନୀୟକ (LCM & HCF)",
  "Divisibility tests, prime and composite numbers, and long division methods": "ଦୀର୍ଘ ହରଣ, ଭାଗଶେଷ, ଗୁଣନୀୟକ ଓ ସାଧାରଣ ଗୁଣିତକ।",
  "Fractions & Decimals Basics": "ସାଧାରଣ ଭଗ୍ନାଂଶ ଓ ଦଶମିକ ଗଣିତ",
  "Understanding numerator, denominator, equivalent fractions, and decimal conversions": "ଲବ ଓ ହର ର ଗୁଣ, ସମହର ଭଗ୍ନାଂଶ ଓ ଯୋଗଫଳ।",
  "Basic Geometry & Angles": "ସରଳ ଜ୍ୟାମିତି ଓ କୋଣ ପରିମାପ",
  "Constructing simple angles using protractor, understanding radius and circle properties": "କୋଣ ମାପ, ବୃତ୍ତର ବ୍ୟାସାର୍ଦ୍ଧ ଓ ଜ୍ୟାମିତିକ ଚିତ୍ର।",
  "Perimeter, Area & Volume": "ପରିମିତି (ପରିସୀମା ଓ କ୍ଷେତ୍ରଫଳ)",
  "Formulas for perimeter, area of rectangle and square, and volume of cuboids": "ତ୍ରିଭୁଜ, ଚତୁର୍ଭୁଜର କ୍ଷେତ୍ରଫଳ ଏବଂ ପରିସୀମା ନିର୍ଣ୍ଣୟ।",
  "Integers & Rational Numbers": "ପୂର୍ଣ୍ଣ ସଂଖ୍ୟା ଓ ପରିମେୟ ସଂଖ୍ୟା",
  "Properties of positive and negative integers, BODMAS rules, and rational number operations": "ଋଣାତ୍ମକ ସଂଖ୍ୟା, ଶୂନ ଓ ପରିମେୟ ସଂଖ୍ୟା ର ସରଳୀକରଣ।",
  "Algebraic Equations & Variables": "ବୀଜଗଣିତର ପ୍ରାରମ୍ଭ (Algebra)",
  "Understanding variables, coefficients, linear equations, and algebraic expressions": "ଅଜ୍ଞାତ ଚଳରାଶି, ସରଳ ସହଗ ଓ ବୀଜଗାଣିତିକ ପରିପ୍ରକାଶ।",
  "Commercial Maths & Interest": "ସୁଧକଷା, ଶତକଡ଼ା ଓ ଅନୁପାତ",
  "Ratio and proportion, speed-time-distance calculations, percentages, profit and loss, and simple interest": "ଶତକଡା ହାର, ଲାଭ-କ୍ଷତି, ସରଳ ସୁଧ ଓ ବେଗ-ସମୟ।",
  "Geometric Proofs & Congruency": "ଉପପାଦ୍ୟ ଓ ଜ୍ୟାମିତିକ ପ୍ରମାଣ",
  "Triangles properties, congruency criteria (SSS, SAS, ASA), and Pythagoras theorem": "ତ୍ରିଭୁଜର ସର୍ବସମତା, ସର୍ବଭୁଜ ଗୁଣ ଓ ପାଇଥାଗୋରାସ ସୂତ୍ର।",
  "Mensuration & Cylinders": "ପରିମିତି, କ୍ଷେତ୍ରଫଳ ଓ ଆୟତନ",
  "Calculating area of trapezium, rhombus, and surface areas/volumes of cylinders": "ସମାନ୍ତରିକ କ୍ଷେତ୍ର, ରମ୍ବସ ଓ ଘନଫଳର କ୍ଷେତ୍ରଫଳ।",
  "Simultaneous Linear Equations": "ସରଳ ସହସମୀକରଣ (Linear Equations)",
  "Solving pairs of linear equations graphically, by substitution, and by elimination methods": "ଦୁଇଟି ଅଜ୍ଞାତ ରାଶି ବିଶିଷ୍ଟ ସରଳ ସହସମୀକରଣର ସମାଧାନ।",
  "Quadratic Equations": "ଦ୍ଵିଘାତ ସମୀକରଣ (Quadratic Equations)",
  "Solving quadratic equations by factorization, completing the square, and using the quadratic formula": "ଦ୍ଵିଘାତ ସମୀକରଣର ସ୍ୱରୂପ, ସମାଧାନ ସୂତ୍ର ଓ ପୂର୍ଣ୍ଣବର୍ଗ।",
  "Arithmetic Progression (AP)": "ସମାନ୍ତର ପ୍ରଗତି (Arithmetic Progression)",
  "Finding the n-th term of an AP and calculating the sum of the first n terms": "A.P. ର ସାଧାରଣ ପଦ ଓ n ସଂଖ୍ୟକ ପଦର ସମଷ୍ଟି ନିର୍ଣ୍ଣୟ।",
  "Trigonometry & Heights": "ତ୍ରିକୋଣମିତି (Trigonometry)",
  "Trigonometric ratios, proving identities, and solving heights and distances problems": "ତ୍ରିକୋଣମିତିକ ଅନୁପାତ ଏବଂ ଉଚ୍ଚତା ଓ ଦୂରତା ମାପ।",
  "Statistics & Probability": "ପରିସଂଖ୍ୟାନ ଓ ସମ୍ଭାବିତତା",
  "Calculating mean, median, and mode for grouped data, and evaluating classical probabilities": "ମାଧ୍ୟମାନ, ମଧ୍ୟମା, ଗରିଷ୍ଠକ ଓ ସମ୍ଭାବ୍ୟତା।",
  "Co-ordinate Geometry & Circles": "ଜ୍ୟାମିତିରେ ସାଦୃଶ୍ୟ ଓ ସ୍ଥାନାଙ୍କ",
  "Distance formula, section formula, equation of a line, and circular tangent properties": "ଥେଲିସଙ୍କ ଉପପାଦ୍ୟ, ସଦୃଶ ତ୍ରିଭୁଜ ଓ ପାର୍ଶ୍ଵିକ ଅନୁପାତ।",
  "My Wonderful Body & Senses": "ଆମ ଜ୍ଞାନେନ୍ଦ୍ରିୟ ଓ ଶରୀର ଯତ୍ନ",
  "Understanding our sensory organs (eyes, ears, nose, tongue, skin) and basic healthy habits": "ଆଖି, କାନ, ନାକ, ଜିଭ ଓ ଚର୍ମ ର ଯତ୍ନ ଏବଂ ପ୍ରାରମ୍ଭିକ ପରିଷ୍କାର ପରିଚ୍ଛନ୍ନତା।",
  "Plants & Nature Around Us": "ଆମ ଚାରିପାଖର ଗଛଲତା (Plants)",
  "Identifying parts of plants, types of leaves, and learning about trees and flowers": "ଉଦ୍ଭିଦର ବିଭିନ୍ନ ଅଂଶ, ଫୁଲ, ଫଳ ଓ ସେମାନଙ୍କର ଉପକାରିତା।",
  "Animal Diversity & Care": "ପାଳିତ ଓ ବନ୍ୟ ପଶୁପକ୍ଷୀ (Animals)",
  "Discovering different types of domestic and wild animals, their food, and habitats": "ଜୀବଜନ୍ତୁଙ୍କ ବାସସ୍ଥାନ, ଖାଦ୍ୟାଭ୍ୟାସ ଓ ସେମାନଙ୍କର ରକ୍ଷଣାବେକ୍ଷଣ।",
  "Water and Air in Our Life": "ଜଳ ଏବଂ ବାୟୁର ଉପଯୋଗ",
  "Understanding importance of fresh water, clean air, and the water cycle basics": "ଜୀବନ ଧାରଣ ପାଇଁ ଶୁଦ୍ଧ ଜଳ ଓ ଅମ୍ଳଜାନର ମହତ୍ତ୍ବ।",
  "Food, Nutrition & Healthy Diet": "ଖାଦ୍ୟର ଉପାଦାନ ଓ ସୁଷମ ଖାଦ୍ୟ",
  "Testing foods for starch, fats, proteins, and understanding balanced diets and deficiency": "ଶ୍ୱେତସାର, ପୁଷ୍ଟିସାର, ସ୍ନେହସାର, ଜୀବସାର ଓ ଧାତୁସାରର ଭୂମିକା।",
  "Human Body Organs & Systems": "ଶାରୀରିକ ସଂସ୍ଥାନ ଓ ଅଙ୍ଗ (Human Systems)",
  "Introduction to skeletal system, digestive system, and circulatory system": "ମାନବ କଙ୍କାଳ ତନ୍ତ୍ର, ମାଂସପେଶୀ ଓ ପାଚନ ତନ୍ତ୍ରର ପ୍ରାରମ୍ଭିକ ଶିକ୍ଷା।",
  "States of Matter & Changes": "ପଦାର୍ଥର ଗୁଣ ଓ ପରିବର୍ତ୍ତନ",
  "Solids, liquids, and gases properties, dissolving substances, physical vs chemical changes": "ପ୍ରାକୃତିକ ଓ ମନୁଷ୍ୟକୃତ ପରିବର୍ତ୍ତନ, ଦ୍ରବଣ ଓ ମିଶ୍ରଣ।",
  "Plant Biology & Photosynthesis": "ଉଦ୍ଭିଦ ଶରୀର ଓ ଆଲୋକଶ୍ଳେଷଣ",
  "Detailed structure of leaves, functions of roots, and food preparation in green leaves": "ପତ୍ରର ଗଠନ, ଚେରର କାର୍ଯ୍ୟ ଏବଂ ସବୁଜ ଗଛର ଖାଦ୍ୟ ପ୍ରସ୍ତୁତି।",
  "Our Eco-System & Conservation": "ଆମ ପରିବେଶ ଓ ପରିସଂସ୍ଥାନ (Ecology)",
  "Understanding food chains, eco-balance, recycling, and avoiding plastic waste": "ଖାଦ୍ୟ ଶୃଙ୍ଖଳା, ପରିବେଶ ସନ୍ତୁଳନ ଓ ବର୍ଜ୍ୟବସ୍ତୁ ପରିଚାଳନା।",
  "Cell Biology & Cell Structure": "ଉଦ୍ଭିଦ ଓ ପ୍ରାଣୀ କୋଷ (Cell Biology)",
  "Understanding plant and animal cells, cell organelles, and historical cell discoveries": "କୋଷଜୀବକ, ପ୍ଲାଷ୍ଟିଡ୍ ଏବଂ କୋଷବିଭାଜନର ମୌଳିକ ଜ୍ଞାନ।",
  "Chemical Properties of Metals": "ଧାତୁ ଓ ଅଧାତୁ ର ରସାୟନ",
  "Reactions of metals with acids, water, and understanding replacement series of metals": "ଲୁହା, ତମ୍ବା, ଆଲୁମିନିୟମ ର ଗୁଣଧର୍ମ ଓ ସେମାନଙ୍କର ଉପଯୋଗ।",
  "Force, Pressure & Friction Laws": "ବଳ, ଚାପ ଓ ଘର୍ଷଣ (Force & Friction)",
  "Ohm's law, friction, sliding and rolling resistance, and atmospheric pressure dynamics": "ବିଭିନ୍ନ ପ୍ରକାରର ବଳ, ସ୍ଥିତିଜ ଚାପ ଓ ଘର୍ଷଣର ସୁଫଳ-କୁଫଳ।",
  "Light Reflection & Human Eye": "ଆଲୋକର ପ୍ରତିଫଳନ (Optics)",
  "Refraction, Snell's law, rectilinear propagation, pinhole camera, and human eye lenses": "ସରଳ ଦର୍ପଣରେ ଆଲୋକର ପ୍ରତିଫଳନ ନିୟମ ଓ ପ୍ରତିବିମ୍ବ ଗଠନ।",
  "Microorganisms & Diseases": "ଅଣୁଜୀବ ସଂସାର (Microorganisms)",
  "Beneficial and harmful bacteria, viruses, fungi, vaccine creation, and food poisoning": "ବ୍ୟାକ୍ଟେରିଆ, ଭାଇରସ ଓ ପ୍ରୋଟୋଜୋଆର ମହତ୍ତ୍ବ ଓ ରୋଗ କାରଣ।",
  "Chemical Reactions & Equations": "ରାସାୟନିକ ପ୍ରତିକ୍ରିୟା ଓ ସମୀକରଣ",
  "Types of chemical reactions, balancing equations, combination, and decomposition": "ରାସାୟନିକ ପ୍ରତିକ୍ରିୟାର ପ୍ରକାରଭେଦ ଏବଂ ସମତୁଲ ସମୀକରଣ।",
  "Carbon & Its Covalent Compounds": "ଅମ୍ଳ, କ୍ଷାରକ ଓ ଲବଣ (Acids, Bases & Salts)",
  "Covalent bonding in carbon, versatile nature, homologous series, and saponification": "pH ର ମହତ୍ତ୍ବ, ଅମ୍ଳ ଓ କ୍ଷାରର ଭୌତିକ ଓ ରାସାୟନିକ ଗୁଣ।",
  "Life Processes & Circulation": "ପୋଷଣ, ଶ୍ଵସନ ଓ ପରିବହନ",
  "Autotrophic nutrition, respiration, human transport, circulatory system, and excretion": "ଖାଦ୍ୟର ପ୍ରକାର ଓ ପରିପାକ ତନ୍ତ୍ର, ଗ୍ଲୁକୋଜ୍ ବିଘଟନ।",
  "Light: Reflection & Refraction": "ଆଲୋକ- ପ୍ରତିଫଳନ ଓ ପ୍ରତିସରଣ",
  "Mirror formula, lens formula, Snell's law, refractive index, and power of a lens": "ଦର୍ପଣ ଓ ଲେନ୍ସର ସୂତ୍ର, ପ୍ରତିଫଳନର ନିୟମ, ଲେନ୍ସ ସୂତ୍ର।",
  "Electricity & Circuits": "ପରିବହନ ଓ ସଞ୍ଚାଳନ (Transportation)",
  "Ohm's law, electric current, potential difference, resistors in series and parallel, and power": "ଉଦ୍ଭିଦ ଓ ପ୍ରାଣୀ ଶରୀରରେ ଜଳ, ଖାଦ୍ୟ ଓ ରକ୍ତ ସଞ୍ଚାଳନ।",
  "Control, Coordination & Hormones": "ନିୟନ୍ତ୍ରଣ ଓ ସମନ୍ୱୟ (Control & Coordination)",
  "Human brain structure, reflex arc, and plant/animal hormones in coordination": "ମସ୍ତିଷ୍କର ସଂରଚନା ଏବଂ ବିଭିନ୍ନ ହରମୋନ୍ ର ଭୂମିକା।",
  "Ecosystem & Energy Flow": "ପରିବେଶ ଓ ଜୈବ ବିବର୍ତ୍ତନ (Evolution)",
  "Food webs, trophic levels, 10% law of energy flow, and ozone layer depletion": "ମେଣ୍ଡେଲଙ୍କ ନିୟମ ଏବଂ ପୃଥିବୀରେ ଜୀବନର କ୍ରମବିକାଶ।",
  "Our Beautiful State & Culture": "ଆମ ଗର୍ବ ଓଡ଼ିଶା (Our Odisha)",
  "Discovering our rich culture, traditional festivals, dances, and monuments": "ଓଡ଼ିଶାର ସୁନ୍ଦର କଳା ସଂସ୍କୃତି, ରଥଯାତ୍ରା ଏବଂ ଓଡ଼ିଶୀ ନୃତ୍ୟ।",
  "My Compass Directions & Map": "ମାନଚିତ୍ର ସହ ବନ୍ଧୁତା (My First Map)",
  "Learning cardinal directions (North, South, East, West) and basic map keys": "ଦିଗ ନିର୍ଣ୍ଣୟ, ମାନଚିତ୍ର ର ମୌଳିକ ସୂଚନା ଏବଂ ଭାରତର ପତାକା।",
  "Our Community Helpers": "ଆମ ସାମାଜିକ ବନ୍ଧୁ (Our Helpers)",
  "Understanding the roles of doctors, teachers, police officers, and firefighters": "ଡାକ୍ତର, ପୋଲିସ, ଶିକ୍ଷକ, ଚାଷୀ ଏବଂ ସଫେଇ କର୍ମଚାରୀଙ୍କ ଭୂମିକା।",
  "Happy Homes and Family Ties": "ଆମ ସୁରକ୍ଷିତ ଘର ଓ ପରିବାର",
  "Caring for parents, grandparents, and maintaining order in the household": "ଶୃଙ୍ଖଳିତ ପରିବାର ଗଠନ, ପିତାମାତା ଓ ବୁଢ଼ାବୁଢ଼ୀଙ୍କ ସେବା।",
  "Geography: Our Country India": "ଭାରତ ର ଭୌଗୋଳିକ ସ୍ବରୂପ",
  "Himalayan ranges, coastal plains, Deccan peninsula, and climate zones of India": "ହିମାଳୟ ପର୍ବତମାଳା, ଗାଙ୍ଗେୟ ସମତଳ ଭୂମି ଓ ଭାରତୀୟ ମରୁଭୂମି।",
  "Ancient Empires & Emperors": "ପ୍ରାଚୀନ କୀର୍ତ୍ତି ଓ ଅଶୋକ ସାମ୍ରାଜ୍ୟ",
  "Harappan town planning, Ashoka's Dhamma, and the rise of early civilizations": "ஹରପ୍ପା ସଭ୍ୟତା, କଳିଙ୍ଗ ଯୁଦ୍ଧ ଓ ପ୍ରାଚୀନ ଶାସନ।",
  "Indian Constitution & Democracy": "ଆମ ମୌଳିକ ଅଧିକାର ଓ ସମ୍ବିଧାନ",
  "Drafting of the constitution, local government, Gram Panchayat, and rights": "ଭାରତୀୟ ସମ୍ବିଧାନ ର ପ୍ରାରୂପ ଓ ନାଗରିକଙ୍କ ମୌଳିକ ଅଧିକାର।",
  "Odisha Tourism & Heritage": "ଓଡ଼ିଶାର ପ୍ରାକୃତିକ ସୌନ୍ଦର୍ଯ୍ୟ ଓ ପର୍ଯ୍ୟଟନ",
  "Konark Sun Temple, Chilika Lake biodiversity, and historic caves": "କୋଣାର୍କ ମନ୍ଦିର, ପୁରୀ, ଶିମିଳିପାଳ ଅଭୟାରଣ୍ୟ ଓ ଚିଲିକା।",
  "Maps and Globals Interpretation": "ମାନଚିତ୍ର ଅଧ୍ୟୟନ ଓ ପ୍ରାକୃତିକ ଦ୍ରବ୍ୟ",
  "Understanding scale, meridians of longitude, and parallels of latitude": "ଜଙ୍ଗଲ, ମୃତ୍ତିକା ଓ ନଦୀବନ୍ଧ ମାନଚିତ୍ରରେ ଚିହ୍ନଟ।",
  "The Delhi Sultanate & Mughals": "ଦିଲ୍ଲୀ ସୁଲତାନୀ ଓ ମୋଗଲ ଶାସନ କାଳ",
  "Political developments from Qutbuddin Aibak up to Aurangzeb's expansion": "ଇଲ୍‌ତୁତ୍‌ମିସ୍‌, ରଜିଆ ସୁଲତାନା, ଆଲାଉଦ୍ଦିନ ଖିଲିଜି ଓ ମୋଗଲ ଶାସନ।",
  "The Earth's Atmosphere & Water": "ବାୟୁମଣ୍ଡଳ ଓ ବାରିମଣ୍ଡଳ (Earth Geography)",
  "Layers of atmosphere, ocean currents, tides, and the complete water cycle": "ବାୟୁମଣ୍ଡଳର ସ୍ତର, ଜଳ ଚକ୍ର ଓ ସମୁଦ୍ର ସ୍ରୋତ ର ସମ୍ପୂର୍ଣ୍ଣ ବିଶ୍ଳେଷଣ।",
  "Civics: Parliamentary Democracy": "ସଂସଦୀୟ ଶାସନ ବ୍ୟବସ୍ଥା (Civics)",
  "Structure of parliament, bill-passing processes, and role of judiciary": "ଭାରତରେ କିପରି ଆଇନ ପ୍ରଣୟନ ହୁଏ, ରାଷ୍ଟ୍ରପତିଙ୍କ ଭୂମିକା।",
  "Natural Resources & Industries": "ସମ୍ବଳ ଓ ଶିଳ୍ପାୟନ (Industrialization)",
  "Farming types, iron and steel plants, mineral resources and transport": "ଭାରତର ମୁଖ୍ୟ ଲୁହା-ଇସ୍ପାତ ଶିଳ୍ପ, କୃଷିଜାତ ଦ୍ରବ୍ୟ ଓ ପରିବହନ।",
  "Regional Freedom Struggles": "ଓଡ଼ିଶାର ସ୍ଵାଧୀନତା ଆନ୍ଦୋଳନ ଇତିହାସ",
  "History of Paika Bidroha (1817), Satyabadi School, and salt satyagraha": "ଓଡ଼ିଶାରେ ବକ୍ସି ଜଗବନ୍ଧୁଙ୍କ ପାଇକ ବିଦ୍ରୋହ ଓ ଗୋପବନ୍ଧୁ ଦାସଙ୍କ ଭୂମିକା।",
  "Rise of European Nationalism": "ଭାରତୀୟ ଜାତୀୟ ଆନ୍ଦୋଳନ (History)",
  "French Revolution estates, unification of Italy/Germany, and Balkan crisis": "ଗାନ୍ଧୀଜୀଙ୍କ ନେତୃତ୍ଵରେ ଭାରତର ସ୍ୱାଧୀନତା ସଂଗ୍ରାମ।",
  "Nationalism in India & Movements": "ସ୍ୱାଧୀନତା ପରବର୍ତ୍ତୀ ଓଡ଼ିଶାର ବିକାଶ",
  "Non-cooperation, Civil disobedience, Rowlatt Act, Dandi march, and Netaji": "ସ୍ୱତନ୍ତ୍ର ଓଡ଼ିଶା ପ୍ରଦେଶ ଗଠନ ଓ ବିଭିନ୍ନ ମୁଖ୍ୟମନ୍ତ୍ରୀଙ୍କ ଅବଦାନ।",
  "Resource & Mineral Geographics": "ଓଡ଼ିଶା ଓ ଭାରତର ଅର୍ଥନୀତି",
  "Alluvial, black, red soils, sustained development, and mineral mapping": "ଭାରତର ଅର୍ଥନୈତିକ ସୁଧାର, ବେକାରୀ ଓ ଦାରିଦ୍ର୍ୟ ଦୂରୀକରଣ।",
  "Power Sharing & Federalism": "ମୃତ୍ତିକା, ଜଳ ଓ ସମ୍ବଳ (Geography)",
  "Belgian model, decentralization in India, and center-state schedules": "ସମ୍ବଳର ପ୍ରକାରଭେଦ ଏବଂ ଓଡ଼ିଶାରେ ଖଣିଜ ସମ୍ପଦ ସଂରକ୍ଷଣ।",
  "Sectors of the Indian Economy": "ଭାରତୀୟ ସମ୍ବିଧାନ ଓ ଗଣତନ୍ତ୍ର (Civics)",
  "Primary, secondary, and tertiary sectors, GDP evaluation, and unemployment": "ସମ୍ବିଧାନର ପ୍ରାରମ୍ଭିକ ପ୍ରାବଧାନ ଓ ନିର୍ବାଚନ ଆୟୋଗ।"
};

const CHAPTER_TEMPLATES: {
  [category: string]: {
    [stage: string]: { name: string; description: string; topics: string[] }[]
  }
} = {
  language: {
    primary: [
      { name: "Basic Letters and Phonetic Sounds", description: "Learning vowels, consonants, stroke orders, and sound pronunciations", topics: ["Vowels & Consonants", "Stroke directions", "Alphabet phonics", "Picture matching"] },
      { name: "Sight Words & Vocabulary Building", description: "Reading two and three-letter words, simple pronunciation patterns", topics: ["Word families", "Syllable blending", "Sight spelling", "Classroom objects"] },
      { name: "Joyful Nursery Rhymes", description: "Reciting simple lyrics with rhythmic comprehension", topics: ["Poem recitation", "Rhyming word pairs", "Moral short stories", "Action greetings"] },
      { name: "Picture Sentence Writing", description: "Constructing simple descriptive phrases from visual cards", topics: ["Family member names", "Color naming", "Simple verb actions", "Picture matching"] }
    ],
    elementary: [
      { name: "Grammar: Basic Parts of Speech", description: "Understanding Nouns, Pronouns, Verbs, and Adjectives in sentence structures", topics: ["Proper and Common Nouns", "Action Verbs", "Descriptive Adjectives", "Subject Pronouns"] },
      { name: "The Honest Woodcutter & Short Stories", description: "Reading classic moral stories to improve comprehension and vocabulary", topics: ["Moral deduction", "Contextual meanings", "Punctuation basics", "Past tense verbs"] },
      { name: "Sentences & Punctuation", description: "Using capital letters, commas, question marks, and full stops correctly", topics: ["Sentence types", "Capitalization rules", "Exclamation markers", "Paragraph spacing"] },
      { name: "Creative Composition & Paragraphs", description: "Learning to write clean, cohesive paragraphs and letters to friends", topics: ["Topic sentences", "Friendly letter layout", "Conjunction linkers", "Adjective pairings"] }
    ],
    middle: [
      { name: "Grammar: Tenses & Voice Transformations", description: "Detailed study of active and passive voice, simple and continuous tenses", topics: ["Present & Past tenses", "Active to Passive swap", "Auxiliary verbs usage", "Modals of duty"] },
      { name: "Poetry & Literary Comprehension", description: "Reading and analyzing classical poems for theme, rhyme, and imagery", topics: ["Poetry appreciation", "Imagery & metaphors", "Stanza-wise summary", "Rhyme scheme"] },
      { name: "Grammar: Direct and Indirect Speech", description: "Reporting conversations with precise tense-shifting rules", topics: ["Tense shifting laws", "Reporting verb swap", "Pronoun modifications", "Imperatives reporting"] },
      { name: "Notice, Email & Report Writing", description: "Standard templates of writing official notices, formal emails, and reports", topics: ["Notice layout standards", "Structured email format", "Report news writing", "Topic headers"] }
    ],
    high: [
      { name: "Classical Drama & Plays", description: "Detailed line-by-line analysis of classic Indian and Shakespearean drama", topics: ["Character profiles", "Theme evaluation", "Contextual dialogue", "Play acts critical summary"] },
      { name: "Grammar: Clause Synthesis & Transformations", description: "Combining complex sentences using relative clauses, noun clauses, and prepositions", topics: ["Relative clauses", "Synthesis rules", "Preposition placement", "Transformations"] },
      { name: "Treasury of Poems & Short Stories", description: "Detailed study of iconic prose and poems on human nature and heritage", topics: ["Poem interpretations", "Metaphorical analysis", "Irony in short stories", "Theme summaries"] },
      { name: "Academic Writing", description: "Developing 350-word structured essays with logical topic arguments", topics: ["Analytical trends", "Letter to Editor", "Descriptive composition", "Argument writing"] }
    ]
  },
  maths: {
    primary: [
      { name: "Numbers & Counting (1 to 100)", description: "Read, write, compare, and understand numbers with place values up to 100", topics: ["Numbers 1-100", "Tens and Ones", "Comparison charts", "Skip counting"] },
      { name: "Addition & Subtraction Basics", description: "Single-digit and double-digit carry-over addition and subtraction with visual aids", topics: ["Single digit sums", "Double digit subtraction", "Word sums", "Horizontal layouts"] },
      { name: "Shapes, Sizes & Patterns", description: "Identifying 2D and 3D shapes and understanding simple repeating sequences", topics: ["Circles & Squares", "Symmetry lines", "Pattern repeating", "Color matching"] },
      { name: "Introductory Money & Time", description: "Recognizing Indian coins and notes, reading clocks, and days of the week", topics: ["Indian Currency", "Reading clock dial", "Days of the week", "Twelve Months"] }
    ],
    elementary: [
      { name: "Large Numbers & Operations", description: "Understanding numbers up to lakhs, large additions, subtractions, and multiplication", topics: ["Numbers to Lakhs", "Multiplication tables", "Real-world word sums", "Value estimations"] },
      { name: "Division & Multiples", description: "Divisibility tests, prime and composite numbers, and long division methods", topics: ["Long division rules", "Prime vs Composite", "Divisibility criteria", "Prime factorization"] },
      { name: "Fractions & Decimals Basics", description: "Understanding numerator, denominator, equivalent fractions, and decimal conversions", topics: ["Proper vs Improper", "Decimal operations", "Simplifying fractions", "Decimal fraction convert"] },
      { name: "Basic Geometry & Angles", description: "Constructing simple angles using protractor, understanding radius and circle properties", topics: ["Acute/Obtuse/Right angles", "Segment measures in cm", "Radius and diameter relation", "Compass angles"] },
      { name: "Perimeter, Area & Volume", description: "Formulas for perimeter, area of rectangle and square, and volume of cuboids", topics: ["Composite fencing", "Area of floor plans", "Volume formulas", "Tank capacity"] }
    ],
    middle: [
      { name: "Integers & Rational Numbers", description: "Properties of positive and negative integers, BODMAS rules, and rational number operations", topics: ["Number line integers", "BODMAS order", "Rational operations", "Decimals division"] },
      { name: "Algebraic Equations & Variables", description: "Understanding variables, coefficients, linear equations, and algebraic expressions", topics: ["Like and Unlike terms", "Variable coefficients", "Linear equations", "Evaluating values"] },
      { name: "Commercial Maths & Interest", description: "Ratio and proportion, speed-time-distance calculations, percentages, profit and loss, and simple interest", topics: ["Speed-time-distance", "Percentages calculation", "Simple interest equations", "Profit-loss percentage"] },
      { name: "Geometric Proofs & Congruency", description: "Triangles properties, congruency criteria (SSS, SAS, ASA), and Pythagoras theorem", topics: ["Congruency theorems", "Pythagoras application", "Parallel lines angles", "Polygon angle sum"] },
      { name: "Mensuration & Cylinders", description: "Calculating area of trapezium, rhombus, and surface areas/volumes of cylinders", topics: ["Area formulas", "Trapezium layout", "Cylinder volume", "Surface area metric"] }
    ],
    high: [
      { name: "Simultaneous Linear Equations", description: "Solving pairs of linear equations graphically, by substitution, and by elimination methods", topics: ["Substitution method", "Elimination method", "Graphical solutions", "Consistency tests"] },
      { name: "Quadratic Equations", description: "Solving quadratic equations by factorization, completing the square, and using the quadratic formula", topics: ["Discriminant check", "Quadratic formula", "Nature of roots", "Factoring equations"] },
      { name: "Arithmetic Progression (AP)", description: "Finding the n-th term of an AP and calculating the sum of the first n terms", topics: ["Common difference d", "n-th term formula", "Sum of arithmetic terms", "Practical models"] },
      { name: "Trigonometry & Heights", description: "Trigonometric ratios, proving identities, and solving heights and distances problems", topics: ["Trigonometry identities", "Elevation angle", "Depression angle", "Double angles heights"] },
      { name: "Statistics & Probability", description: "Calculating mean, median, and mode for grouped data, and evaluating classical probabilities", topics: ["Grouped mean standard", "Cumulative curve", "Coins and cards probability", "Maturity RD values"] },
      { name: "Co-ordinate Geometry & Circles", description: "Distance formula, section formula, equation of a line, and circular tangent properties", topics: ["Section formula", "Equation of lines", "Circle tangents properties", "Chord theorems"] }
    ]
  },
  science: {
    primary: [
      { name: "My Wonderful Body & Senses", description: "Understanding our sensory organs (eyes, ears, nose, tongue, skin) and basic healthy habits", topics: ["Sensory organs", "Body parts naming", "Cleanliness habits", "First aid basics"] },
      { name: "Plants & Nature Around Us", description: "Identifying parts of plants, types of leaves, and learning about trees and flowers", topics: ["Stem and Roots", "Green leaf functions", "Fruit & flower naming", "Our plant buddies"] },
      { name: "Animal Diversity & Care", description: "Discovering different types of domestic and wild animals, their food, and habitats", topics: ["Pets & Farms", "Jungle animals", "Animal food groups", "Birds & Nests"] },
      { name: "Water and Air in Our Life", description: "Understanding importance of fresh water, clean air, and the water cycle basics", topics: ["Sources of Water", "Air is everywhere", "Conserving water", "Seasons changes"] }
    ],
    elementary: [
      { name: "Food, Nutrition & Healthy Diet", description: "Testing foods for starch, fats, proteins, and understanding balanced diets and deficiency", topics: ["Food nutrients", "Balanced food wheel", "Starch iodine test", "Deficiency diseases"] },
      { name: "Human Body Organs & Systems", description: "Introduction to skeletal system, digestive system, and circulatory system", topics: ["Skeletal bones", "Digestive path", "Heart & Blood vessels", "Respiratory lungs"] },
      { name: "States of Matter & Changes", description: "Solids, liquids, and gases properties, dissolving substances, physical vs chemical changes", topics: ["Three states", "Solubility index", "Vaporization", "Chemical changes"] },
      { name: "Plant Biology & Photosynthesis", description: "Detailed structure of leaves, functions of roots, and food preparation in green leaves", topics: ["Photosynthesis steps", "Transpiration loss", "Taproot vs Fibrous", "Pollination basic"] },
      { name: "Our Eco-System & Conservation", description: "Understanding food chains, eco-balance, recycling, and avoiding plastic waste", topics: ["Food Web", "Ozone layer protection", "3R waste management", "Air & Water pollution"] }
    ],
    middle: [
      { name: "Cell Biology & Cell Structure", description: "Understanding plant and animal cells, cell organelles, and historical cell discoveries", topics: ["Cell membrane & wall", "Mitochondria role", "Hooke cell discovery", "Organelles compare"] },
      { name: "Chemical Properties of Metals", description: "Reactions of metals with acids, water, and understanding replacement series of metals", topics: ["Displacement series", "Rusting reactions", "Metal with acid", "Non-metals like sulfur"] },
      { name: "Force, Pressure & Friction Laws", description: "Ohm's law, friction, sliding and rolling resistance, and atmospheric pressure dynamics", topics: ["Pascal pressure unit", "Frictional drag", "Streamlining", "Solenoid pattern"] },
      { name: "Light Reflection & Human Eye", description: "Refraction, Snell's law, rectilinear propagation, pinhole camera, and human eye lenses", topics: ["Reflection rules", "Mirrors optics", "Dispersion VIBGYOR", "Human eye parts"] },
      { name: "Microorganisms & Diseases", description: "Beneficial and harmful bacteria, viruses, fungi, vaccine creation, and food poisoning", topics: ["Good Bacteria", "Viruses vs Fungi", "Antibodies vaccines", "Preserving foods"] }
    ],
    high: [
      { name: "Chemical Reactions & Equations", description: "Types of chemical reactions, balancing equations, combination, and decomposition", topics: ["Equation balancing", "Reaction classes", "Displacement redox", "Rancidity protection"] },
      { name: "Carbon & Its Covalent Compounds", description: "Covalent bonding in carbon, versatile nature, homologous series, and saponification", topics: ["Covalent bond", "Versatile carbon", "Nomenclature chains", "Esterification soap"] },
      { name: "Life Processes & Circulation", description: "Autotrophic nutrition, respiration, human transport, circulatory system, and excretion", topics: ["Heart chambers", "Xylem phloem", "Kidney excretion", "Glucose breakdown"] },
      { name: "Light: Reflection & Refraction", description: "Mirror formula, lens formula, Snell's law, refractive index, and power of a lens", topics: ["Lens formula", "Index of refraction", "Spherical optics", "Snell's Law"] },
      { name: "Electricity & Circuits", description: "Ohm's law, electric current, potential difference, resistors in series and parallel, and power", topics: ["Series resistors", "Parallel circuits", "Joule heating law", "Watt electrical power"] },
      { name: "Control, Coordination & Hormones", description: "Human brain structure, reflex arc, and plant/animal hormones in coordination", topics: ["Cerebrum & Cerebellum", "Reflex arc", "Plant Auxins", "Thyroid hormones"] },
      { name: "Ecosystem & Energy Flow", description: "Food webs, trophic levels, 10% law of energy flow, and ozone layer depletion", topics: ["Trophic levels", "10% Energy law", "Ozone hole issues", "Waste control"] }
    ]
  },
  physics: {
    primary: [
      { name: "Force, Pull and Push", description: "Identifying mechanical forces, magnetic force, gravity and friction", topics: ["What is force", "Pull and push examples", "Magnet attraction", "Friction basics"] }
    ],
    elementary: [
      { name: "Matter: States and Kinetic Properties", description: "Molecular arrangement in solids, liquids, and gases", topics: ["Molecular spacing", "Attraction force", "Kinetic motion", "Change of state"] },
      { name: "Physical Quantities & Measurement", description: "Measuring volume, area of irregular shapes, density of liquids", topics: ["Density bottle", "Eureka can measure", "Relative density", "Measuring cylinders"] }
    ],
    middle: [
      { name: "Matter & Kinetic Theory (Detailed)", description: "Intermolecular attraction, sublimation, vaporization, boiling physics", topics: ["Kinetic model", "Sublimation camphor", "Vapor pressure", "Boiling points"] },
      { name: "Force, Turning Effects & Pulleys", description: "Center of gravity, moment of force, single fixed pulley mechanical advantage", topics: ["Moment of a force", "Fixed pulley MA", "CG calculations", "Levers three classes"] }
    ],
    high: [
      { name: "Force, Work, Power and Energy", description: "Turning effect of force, center of gravity, simple machines", topics: ["Moment of a Force", "Pulleys & Levers", "Mechanical Advantage", "Center of gravity"] },
      { name: "Light (Refraction & Lenses)", description: "Refraction through a prism, critical angle, total internal reflection", topics: ["Prism deviation", "Critical angle values", "Lenses magnification", "Spectrum prism"] },
      { name: "Electricity and Magnetism", description: "Ohm's law, household circuits, electromagnetic induction", topics: ["Ohm's law verification", "Ring household circuit", "Lenz's induction", "Transformer basics"] },
      { name: "Modern Physics & Radioactivity", description: "Structure of atom, alpha, beta, gamma radioactive rays", topics: ["Alpha particle loss", "Fission and fusion", "Radioisotopes", "Safety standards"] }
    ]
  },
  chemistry: {
    primary: [
      { name: "Air and Water Properties", description: "Discovering composition of air, uses of water, and solid/liquid mixtures", topics: ["Air has weight", "Water states", "Mixing things", "Float or sink"] }
    ],
    elementary: [
      { name: "Introductory Chemistry & Matter", description: "Elements, compounds, physical mixing, and separating methods", topics: ["Pure substances", "Compounds", "Filtration methods", "Winnowing"] }
    ],
    middle: [
      { name: "Atoms, Molecules & Radicals", description: "Symbols, valency, writing chemical formulas of daily salts", topics: ["Symbols elements", "Valency chart", "Formula writing", "Chemical names"] },
      { name: "Water and Solution Chemistry", description: "Saturated solutions, crystallization, hard and soft water", topics: ["Saturated point", "Hardness of water", "Crystallization", "Distilled water"] }
    ],
    high: [
      { name: "Language of Chemistry", description: "Chemical equations, balancing equations, and radical naming conventions", topics: ["Balancing methods", "Radicals valencies", "State symbols", "Law of conservation"] },
      { name: "Atomic Structure & Chemical Bonding", description: "Rutherford scattering, Bohr model, electrovalent and covalent bonding", topics: ["Rutherford alpha scat", "Bohr shell model", "Ionic electrovalent", "Covalent sharing"] },
      { name: "Study of Acid Compounds", description: "Properties of Hydrochloric Acid, Nitric Acid, and Sulphuric Acid", topics: ["HCl preparations", "Nitric acid redox", "Sulphuric dehydrates", "Industrial contact proc"] },
      { name: "Organic Chemistry Spec", description: "Nomenclature of alkanes, alkenes, alkynes, and key functional groups", topics: ["Alkanes saturation", "IUPAC nomenclature", "Esterification", "Isomerism introduction"] }
    ]
  },
  biology: {
    primary: [
      { name: "Nature Studies & Animal Diversity", description: "Exploring plants, pets, crawling insects and birds in our gardens", topics: ["Pet matching", "Garden plants", "Insects identification", "Beaks of birds"] }
    ],
    elementary: [
      { name: "Human Skeletal & Digestive System", description: "Overview of bone counts, joints, and organs of the alimentary canal", topics: ["Joints classification", "Alimentary organs", "Enzyme functions", "Digestion stages"] }
    ],
    middle: [
      { name: "Leaf and Flower Botany", description: "Detailed parts of a flower, cross vs self pollination, seed germination", topics: ["Pistil and stamen", "Self vs cross pollination", "Hypogeal germination", "Seed structure"] },
      { name: "Circulatory & Nervous System", description: "Human heart structure, blood composition, and central nervous system coordination", topics: ["Heart chambers", "Red white blood cells", "Brain cerebrum", "Nerve impulses"] }
    ],
    high: [
      { name: "Cell: Structural & Functional Unit", description: "Detailed cell biology, chromosomes structure, and mitosis cell division", topics: ["Cell cycle mitosis", "Chromosomes genes", "Meiosis difference", "Karyotype chart"] },
      { name: "Plant Physiology & Photosynthesis", description: "Absorption of water, transpiration pull, and photosynthesis light-dark reactions", topics: ["Light and Dark reactions", "Transpiration pull", "Osmotic root pressure", "Plasmolysis"] },
      { name: "Human Digestive & Excretory System", description: "Anatomy of stomach, liver, pancreas, and nephrons function in kidneys", topics: ["Enzyme catalog", "Kidney nephrons", "Urea formation", "Dialysis principles"] },
      { name: "Endocrine & Nervous System Coordination", description: "Pituitary, thyroid, adrenal hormones and synapse transmission", topics: ["Hormone feedback loops", "Neuron structure", "Synapse chemical transmission", "Brain lobes functions"] }
    ]
  },
  social: {
    primary: [
      { name: "Our Beautiful State & Culture", description: "Discovering our rich culture, traditional festivals, dances, and monuments", topics: ["State Festivals", "Folk dances", "Caring neighbors", "National symbols"] },
      { name: "My Compass Directions & Map", description: "Learning cardinal directions (North, South, East, West) and basic map keys", topics: ["North-South-East-West", "State outline", "Finding places", "Flag coloring"] },
      { name: "Our Community Helpers", description: "Understanding the roles of doctors, teachers, police officers, and firefighters", topics: ["Emergency numbers", "Police Station", "Farming values", "Post Office"] },
      { name: "Happy Homes and Family Ties", description: "Caring for parents, grandparents, and maintaining order in the household", topics: ["Helping parents", "Sharing chores", "Family history", "Clean room habits"] }
    ],
    elementary: [
      { name: "Geography: Our Country India", description: "Himalayan ranges, coastal plains, Deccan peninsula, and climate zones of India", topics: ["Himalayas", "Indian peninsula", "Coastal lines", "Sunderban forests"] },
      { name: "Ancient Empires & Emperors", description: "Harappan town planning, Ashoka's Dhamma, and the rise of early civilizations", topics: ["Indus Valley", "Great Bath", "Emperor Ashoka", "Dhamma rules"] },
      { name: "Indian Constitution & Democracy", description: "Drafting of the constitution, local government, Gram Panchayat, and rights", topics: ["Dr. B.R. Ambedkar", "Preamble basic", "Gram Panchayat", "Right to Education"] },
      { name: "Odisha Tourism & Heritage", description: "Konark Sun Temple, Chilika Lake biodiversity, and historic caves", topics: ["Konark Temple", "Chilika Birds", "Udayagiri Caves", "Eco-Tourism"] },
      { name: "Maps and Globals Interpretation", description: "Understanding scale, meridians of longitude, and parallels of latitude", topics: ["Political vs Physical Map", "Equator", "Latitude & Longitude", "Time calculation"] }
    ],
    middle: [
      { name: "The Delhi Sultanate & Mughals", description: "Political developments from Qutbuddin Aibak up to Aurangzeb's expansion", topics: ["Iqta tax system", "Akbar administration", "Taj Mahal architecture", "Mansabdari system"] },
      { name: "The Earth's Atmosphere & Water", description: "Layers of atmosphere, ocean currents, tides, and the complete water cycle", topics: ["Troposphere", "Ocean currents", "Tides mechanics", "Water cycle grid"] },
      { name: "Civics: Parliamentary Democracy", description: "Structure of parliament, bill-passing processes, and role of judiciary", topics: ["Lok Sabha vs Rajya Sabha", "Presidential power", "Supreme Court", "Bill processing"] },
      { name: "Natural Resources & Industries", description: "Farming types, iron and steel plants, mineral resources and transport", topics: ["Steel Plants", "Commercial farming", "Mineral deposits", "National Highways"] },
      { name: "Regional Freedom Struggles", description: "History of Paika Bidroha (1817), Satyabadi School, and salt satyagraha", topics: ["Paika Bidroha", "Gopabandhu Das", "Salt Satyagraha", "Baxi Jagabandhu"] }
    ],
    high: [
      { name: "Rise of European Nationalism", description: "French Revolution estates, unification of Italy/Germany, and Balkan crisis", topics: ["French Estates", "Napoleonic Code", "Bismarck Unification", "Bastille fall"] },
      { name: "Nationalism in India & Movements", description: "Non-cooperation, Civil disobedience, Rowlatt Act, Dandi march, and Netaji", topics: ["Rowlatt Act", "Dandi March", "Non-cooperation", "Netaji Bose"] },
      { name: "Resource & Mineral Geographics", description: "Alluvial, black, red soils, sustained development, and mineral mapping", topics: ["Soil classification", "Sustained development", "Resource mapping", "Mining zones"] },
      { name: "Power Sharing & Federalism", description: "Belgian model, decentralization in India, and center-state schedules", topics: ["Federalism principles", "Union & State lists", "Belgian power sharing", "Municipalities"] },
      { name: "Sectors of the Indian Economy", description: "Primary, secondary, and tertiary sectors, GDP evaluation, and unemployment", topics: ["Three sectors", "Unemployment types", "NREGA 2005", "GDP assessment"] }
    ]
  },
  history: {
    primary: [
      { name: "Early Story of Shelter", description: "How ancient humans lived in caves, constructed tree shelters, and gathered foods", topics: ["Cave drawings", "Fruit gatherers", "Invention of Fire", "Simple stone tools"] }
    ],
    elementary: [
      { name: "Great Kings of India", description: "History of Chandragupta Maurya, Ashoka the Great, and Emperor Samudragupta", topics: ["Maurya reign", "Inscriptions", "Pataliputra capital", "Golden Gupta period"] }
    ],
    middle: [
      { name: "The Harappan Civilization", description: "Sumerian connections, drainage patterns, seals, and artifacts of Indus valley", topics: ["Mohenjo-daro layout", "Bronze Dancing girl", "Dockyard of Lothal", "Deciphering script"] }
    ],
    high: [
      { name: "The First World War & League of Nations", description: "Causes of 1914 war, Treaty of Versailles, and establishing the League of Nations", topics: ["Sarajevo assassination", "Triple Entente", "Treaty of Versailles clauses", "League structure"] },
      { name: "Rise of Dictatorships & World War II", description: "Adolf Hitler in Germany, Benito Mussolini in Italy, and attack on Pearl Harbor", topics: ["Nazism principles", "Fascist March on Rome", "Axis vs Allies", "United Nations birth"] },
      { name: "The Indian Freedom Struggle & Partition", description: "Partition of Bengal, Jallianwala Bagh massacre, and Independence Act 1947", topics: ["Swadeshi movement", "Mountbatten Plan", "Cabinet Mission", "Indian Independence Act"] }
    ]
  },
  geography: {
    primary: [
      { name: "Our Neighbors and Earth", description: "Understanding mountains, oceans, forests, and matching maps to states", topics: ["Oceans naming", "Highest peaks", "Forest types", "State color maps"] }
    ],
    elementary: [
      { name: "Map Scale & Topography", description: "Calculating distances using map scales, symbols, and color legends", topics: ["Scale ratio 1:50000", "Physical symbols", "Water blue representations", "Climatic colors"] }
    ],
    middle: [
      { name: "Earth's Internal Structure", description: "Crust, mantle, core, plate tectonics, volcano and earthquake types", topics: ["Sial and Sima layers", "Tectonic plate movements", "Seismograph Richter scale", "Magma vents"] }
    ],
    high: [
      { name: "Location, Size & Physical Features", description: "Latitudinal & longitudinal span of India, Standard Meridian, and geological sectors", topics: ["Standard Meridian 82°30'E", "Indian subcontinent border", "Himalayan range divisions", "Deccan plateau boundaries"] },
      { name: "Climate of India & Monsoon", description: "Factors affecting Indian climate, mechanism of monsoon winds, and rainfall distributions", topics: ["South-West Monsoon path", "Western disturbances", "Jet Streams", "Rain-shadow regions"] },
      { name: "Water Resources & Multipurpose Projects", description: "Major dams, canals, rain water harvesting techniques, and water table restorations", topics: ["Bhakra Nangal Dam", "Hirakud Reservoir", "Drip irrigation systems", "Rainwater conservation"] },
      { name: "Topographical Sheets Interpretation", description: "Analyzing contour patterns, reading grid coordinates, and identifying human settlements", topics: ["Contour intervals", "Six-figure grid reference", "Drainage patterns (Dendritic)", "Settlement classifications"] }
    ]
  }
};

const translateToOdia = (text: string): string => {
  return TRANSLATIONS[text] || text;
};

const getTopicEducationalData = (board: string, subjectId: string, chapterName: string, topicName: string) => {
  const tLower = topicName.toLowerCase();
  const sLower = subjectId.toLowerCase();

  let gist = "";
  let clarity = "";

  if (sLower.includes('odia') || tLower.includes('odia') || tLower.includes('ସ୍ଵର') || tLower.includes('ବ୍ୟଞ୍ଜନ') || tLower.includes('ଶବ୍ଦ') || tLower.includes('ବ୍ୟାକରଣ')) {
    gist = "ଓଡ଼ିଆ ଭାଷା ଓ ବ୍ୟାକରଣର ମୌଳିକ ନିୟମ ଏବଂ ଏହାର ସାହିତ୍ୟିକ ପ୍ରୟୋଗ (The core rules of Odia grammar, spelling, pronunciation, and literary structure).";
    clarity = "ଓଡ଼ିଆ ଭାଷାର ସୁଦୃଢ଼ ଭିତ୍ତିଭୂମି ଗଠନ ପାଇଁ ସ୍ୱରବର୍ଣ୍ଣ, ବ୍ୟଞ୍ଜନବର୍ଣ୍ଣ ଓ ଯୁକ୍ତାକ୍ଷରର ସଠିକ ଉଚ୍ଚାରଣ ଏବଂ ପ୍ରୟୋଗ ଅତ୍ୟନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ। ଏହି ଅଧ୍ୟାୟରେ ବ୍ୟାକରଣ ବିଚାର ଯେପରିକି ବିଶେଷ୍ୟ, ବିଶେଷଣ, ସର୍ବନାମ, କାରକ, ବିଭକ୍ତି ଓ ସନ୍ଧି ନିୟମକୁ ଅତି ସରଳ ଶୈଳୀରେ ବୁଝାଯାଇଛି। ସାହିତ୍ୟ ପଠନ ଦ୍ୱାରା ଶବ୍ଦକୋଷର ବିକାଶ ଘଟିବା ସହିତ ଛାତ୍ରଛାତ୍ରୀମାନେ ଶୁଦ୍ଧ ଭାଷା ଶିକ୍ଷା କରିପାରିବେ। ଏହା ବୋର୍ଡ ପରୀକ୍ଷାରେ ଉତ୍ତମ ନମ୍ବର ରଖିବାରେ ସହାୟକ ହେବ।";
  }
  else if (tLower.includes('abacus') || tLower.includes('soroban') || tLower.includes('bead')) {
    gist = "Mental projection of physical Soroban abacus beads for hyper-speed mental arithmetic and cognitive mapping.";
    clarity = "The Soroban abacus is a classical Japanese calculation tool configured with a 1:4 bead ratio. By visualizing the physical movement of beads on a vertical axis, students create a spatial memory matrix in the brain. This enables them to perform addition, subtraction, and multi-digit multiplication at sub-second speeds, shifting numerical processing from the left-brain linguistic center to the right-brain spatial-visual cortex.";
  }
  else if (tLower.includes('binary') || tLower.includes('boolean') || tLower.includes('gate') || tLower.includes('bit')) {
    gist = "Representation of information using base-2 digits (0 and 1) governed by mathematical boolean algebra.";
    clarity = "In modern computer systems, all data is compiled into binary bits of high and low electronic voltages. Boolean algebra regulates how these signals interact through logical operators such as AND, OR, and NOT gates. Understanding how combinations of these gates build complex arithmetic logic units (ALUs) is the fundamental bedrock of computer hardware engineering and digital circuit design.";
  }
  else if (tLower.includes('ai') || tLower.includes('neural') || tLower.includes('machine learning') || tLower.includes('model') || tLower.includes('cognition')) {
    gist = "Computational models inspired by biological neural pathways designed to approximate complex non-linear functions.";
    clarity = "Artificial Neural Networks (ANNs) consist of layers of interconnected artificial neurons (nodes). Input features are passed through hidden layers where weights and biases are iteratively tuned using gradient descent and backpropagation. By analyzing statistical errors, the model optimizes its internal parameters, enabling complex predictions, natural language processing, computer vision pattern recognition, and real-time autonomous systems.";
  }
  else if (tLower.includes('quantum') || tLower.includes('semiconductor') || tLower.includes('physics')) {
    gist = "Exploring quantum superposition, entanglement, and atomic wave-particle duality applied to sub-micron solid-state electronics.";
    clarity = "Classical transistors are reaching physical thermodynamic scaling limits. Semiconductor quantum physics leverages the quantum tunneling effects and electron spin states to design next-generation logic elements. In quantum computing, information is held in qubits, which exist in superpositions of both 0 and 1 simultaneously. This enables exponential parallel computational paths, solving specialized cryptographic and molecular simulation algorithms in minutes instead of millennia.";
  }
  else if (tLower.includes('crispr') || tLower.includes('gene') || tLower.includes('dna') || tLower.includes('bio') || tLower.includes('genetic')) {
    gist = "Precision biological gene editing utilizing the CRISPR-Cas9 enzyme system as molecular scissors.";
    clarity = "CRISPR-Cas9 is a revolutionary gene-editing technology derived from biological adaptive immune systems. Guided by a custom-designed RNA sequence, the Cas9 endonuclease targets and cleaves precise matching sequences within double-stranded genomic DNA. Once cut, the cell's natural repair pathways can either disrupt the gene or insert a functional donor sequence. This enables targeted correction of genetic mutations, agriculture crop optimization, and disease therapies.";
  }
  else if (tLower.includes('aerospace') || tLower.includes('rocket') || tLower.includes('orbital') || tLower.includes('ballistic')) {
    gist = "Applying Newton's classical laws of motion and fluid mechanics to rocket propulsion and orbital mechanics.";
    clarity = "Rocketry is governed by conservation of momentum (Tsiolkovsky rocket equation), where high-velocity gas exhaust from chemical combustion creates opposite forward thrust. To reach stable Earth orbit, a payload must achieve precise escape or orbital velocities, balancing gravitational pull with centripetal force. Understanding thrust-to-weight ratios, drag coefficients, specific impulse, and Hohmann orbital transfer trajectories is critical to space flight and spacecraft navigation.";
  }
  else if (sLower.includes('math') || tLower.includes('addition') || tLower.includes('subtraction') || tLower.includes('division') || tLower.includes('algebra') || tLower.includes('equation') || tLower.includes('number')) {
    gist = "Developing quantitative reasoning, structural logic, and operational mastery of mathematical principles.";
    clarity = "Mathematics is the universal language of physical patterns. Starting from basic counting and place values, students progress to multi-digit arithmetic, fractions, decimals, and algebraic variables. Representing unknown quantities as variables allows us to formulate and solve complex simultaneous and quadratic equations. These principles form the computational backbone for modern statistics, algorithm design, engineering physics, and business accounting models.";
  }
  else if (sLower.includes('science') || tLower.includes('chemical') || tLower.includes('reaction') || tLower.includes('atom') || tLower.includes('cell') || tLower.includes('physics') || tLower.includes('biology') || tLower.includes('chemistry')) {
    gist = "Empirical examination of the physical, chemical, and biological laws organizing our natural world.";
    clarity = "Scientific inquiry relies on rigorous observation, experimentation, and peer-reviewed modeling. In physics, we analyze forces, energy, and thermodynamics; in chemistry, we examine atomic bonding, valence configurations, and chemical reactions; in biology, we explore cellular structures, metabolic pathways, and ecosystems. Gaining clarity in these concepts allows us to engineer green energy solutions, discover medical therapies, and understand the fundamental materials forming our universe.";
  }
  else if (sLower.includes('social') || sLower.includes('history') || sLower.includes('geography') || sLower.includes('civics') || tLower.includes('history') || tLower.includes('geography') || tLower.includes('civics') || tLower.includes('social')) {
    gist = "Chronological analysis of human civilizations, geopolitical maps, resource distributions, and democratic rights.";
    clarity = "Social science bridges the past and present to explain how cultures, economic systems, and governments interact. Geography studies Earth's physical landforms, climate zones, and resource distributions. History examines the turning points of human struggle, treaties, and socio-political movements. Civics empowers students with knowledge of constitutional bodies, direct democratic rights, and legal guidelines to foster active, responsible global citizenship.";
  }
  else {
    gist = `Comprehensive core syllabus guidelines mapping the key parameters and operational definitions of "${topicName}".`;
    clarity = `This module explores "${topicName}" with a deep focus on foundational principles and real-world compliance. By examining the structural layout, historical contexts, and mathematical/physical rules that govern this topic, students gain complete conceptual clarity. Regular self-assessment, diagrammatic analysis, and formula applications ensure high retention, paving a smooth path for academic excellence under all national and regional evaluation boards.`;
  }

  return { gist, clarity };
};

const getChaptersForClass = (catKey: string, classNum: number, board: string): { name: string; description: string; topics: string[]; weightage: string }[] => {
  const cat = classNum <= 2 ? 'primary' : classNum <= 5 ? 'elementary' : classNum <= 8 ? 'middle' : 'high';
  const baseChapters = CHAPTER_TEMPLATES[catKey]?.[cat] || CHAPTER_TEMPLATES[catKey]?.high || CHAPTER_TEMPLATES.language.primary;

  return baseChapters.map((ch, idx) => {
    let name = ch.name;
    let description = ch.description;
    let topics = [...ch.topics];
    let weightage = idx === 0 ? '12 Marks' : idx === 1 ? '15 Marks' : idx === 2 ? '10 Marks' : idx === 3 ? '12 Marks' : '10 Marks';

    if (catKey === 'maths') {
      if (classNum === 1) {
        if (idx === 0) { name = "Numbers & Counting (1 to 50)"; description = "Read, write, compare, and understand numbers with place values up to 50."; topics = ["Numbers 1-50", "Tens and Ones", "Single-digit comparison", "Simple skip counting"]; }
        else if (idx === 1) { name = "Single-Digit Addition & Subtraction"; description = "Basic single-digit addition and subtraction using visual lines and fingers."; topics = ["Sums up to 9", "Subtracting from 9", "Count-on methods", "Picture math sums"]; }
        else if (idx === 2) { name = "Basic Shapes & Pattern Repeats"; description = "Identifying flat 2D shapes like circles, squares, and triangles, and repeating color series."; topics = ["Circles & Squares", "Symmetry basics", "Color pattern repeating", "Shape matching"]; }
        else if (idx === 3) { name = "Introductory Indian Coins & Hours"; description = "Recognizing standard 1, 2, 5, 10 rupee coins and reading o'clock times."; topics = ["Rupee coins identification", "Reading full hours", "Days of the week", "Seasons of the year"]; }
      } else if (classNum === 2) {
        if (idx === 0) { name = "Numbers & Counting (51 to 100)"; description = "Read, write, and compare numbers up to 100 with double-digit place values."; topics = ["Numbers 51-100", "Hundreds place introduction", "Comparison charts > < =", "Skip counting by 2s and 5s"]; }
        else if (idx === 1) { name = "Double-Digit Sums (No Carry)"; description = "Horizontal and vertical double-digit addition and subtraction without carry-over."; topics = ["Double-digit sums", "Two-digit subtraction", "Real-world toys word sums", "Addition grid lines"]; }
        else if (idx === 2) { name = "3D Solids & Spatial Patterns"; description = "Recognizing 3D solid shapes like cubes, spheres, and cylinders in daily life."; topics = ["Cubes & Spheres", "Cylinders & Cones", "Spatial orientation (above/below)", "Advanced repeating shapes"]; }
        else if (idx === 3) { name = "Paper Currency & Digital Clocks"; description = "Understanding 10, 20, 50, 100 rupee notes and reading half-hour analog times."; topics = ["Indian Rupee Notes", "Reading half-hours (e.g. 4:30)", "Twelve months of the year", "Simple pocket money sums"]; }
      } else if (classNum === 3) {
        if (idx === 0) { name = "Numbers up to Lakhs & Place Values"; description = "Understanding 4-digit numbers, expanded forms, and comparing heavy numbers."; topics = ["Numbers up to 10,000", "Expanded notation", "Greater than / Less than", "Place value face value"]; }
        else if (idx === 1) { name = "Three-Digit Carry-Over Addition"; description = "Mastering vertical carry-over addition and borrow subtraction with three-digit numbers."; topics = ["Vertical column carry-overs", "Borrowing across zeros", "Dynamic word problems", "Estimation of sums"]; }
        else if (idx === 2) { name = "Basic Fractions: Halves & Quarters"; description = "Visual introduction to dividing shapes and objects into equal fractional parts."; topics = ["Understanding Half (1/2)", "Understanding Quarters (1/4)", "Shading fractional grids", "Comparing simple fractions"]; }
        else if (idx === 3) { name = "Introduction to Angles & Protractor"; description = "Measuring and identifying simple angles using physical or visual protractors."; topics = ["What is an angle?", "Identifying right angles", "Using a protractor", "Vertex and arms"]; }
        else if (idx === 4) { name = "Perimeters of Simple Polygons"; description = "Calculating the outer boundary length of squares, rectangles, and triangles."; topics = ["Perimeter definition", "Sum of sides of triangle", "Rectangle outer boundary", "Fencing grid fields"]; }
      } else if (classNum === 4) {
        if (idx === 0) { name = "Large Numbers & Lakhs Notation"; description = "Extending place values to 6-digit figures and learning Indian numbering formats."; topics = ["Place value up to Lakhs", "Multiplication tables up to 15", "Estimating large sums", "Word problem math modeling"]; }
        else if (idx === 1) { name = "Long Division & Equal Sharing"; description = "Performing multi-digit division, calculating quotients, remainders, and divisibility rules."; topics = ["Long division algorithms", "Divisibility tests for 2, 5, 10", "Finding quotients & remainders", "Equal distribution puzzles"]; }
        else if (idx === 2) { name = "Proper & Improper Fractions"; description = "Understanding mixed numbers, equivalent fractions, and basic decimal conversions."; topics = ["Proper vs Improper", "Mixed fraction layouts", "Equivalent fraction scaling", "Decimal-to-fraction conversions"]; }
        else if (idx === 3) { name = "Circle Properties: Radius & Diameter"; description = "Using a compass to draw circles and understanding the radius-diameter relationship."; topics = ["Drawing with compass", "Radius & Diameter formula", "Chord and Center", "Semicircles"]; }
        else if (idx === 4) { name = "Area of Square & Rectangular Floors"; description = "Calculating flat surface area in square centimeters and square meters."; topics = ["Area of rectangle formula", "Area of square formula", "Tile placement layouts", "Floor plan area sums"]; }
      } else if (classNum === 5) {
        if (idx === 0) { name = "Numbers up to Crores & Operations"; description = "Extending place values to 8-digit figures and learning international numbering formats."; topics = ["Place value up to Crores", "Multiplication of 4-digit numbers", "International vs Indian systems", "Large-scale financial sums"]; }
        else if (idx === 1) { name = "LCM, HCF & Prime Factorization"; description = "Finding Lowest Common Multiple, Highest Common Factor, and prime factorization tree structures."; topics = ["Prime factorization tree", "Finding HCF of 3 numbers", "Finding LCM with division", "Real-world matching bell alarms"]; }
        else if (idx === 2) { name = "Decimal Arithmetic Operations"; description = "Adding, subtracting, multiplying, and dividing decimal numbers with precision."; topics = ["Decimal point alignment", "Multiplying decimals by tenths", "Dividing decimals by integers", "Simplifying decimal equations"]; }
        else if (idx === 3) { name = "Compass Angles & Segment Construction"; description = "Constructing precise line segments in centimeters and drawing exact angles of 60°, 90°, and 120°."; topics = ["Line segment ruler measures", "Drawing 60° and 120°", "Angle bisection drawing", "Using standard geometry boxes"]; }
        else if (idx === 4) { name = "Volume of Cubes and Cuboids"; description = "Calculating space capacity of 3D boxes and liquids in liters and cubic centimeters."; topics = ["Volume of cube formula", "Volume of cuboid formula", "Water tank capacity", "Liters to cubic cm conversions"]; }
      } else if (classNum === 6) {
        if (idx === 0) { name = "Integers & Number Lines (Class 6)"; description = "Introduction to positive and negative integers and locating them on horizontal axes."; topics = ["Negative integers concept", "Locating on number line", "Comparing negative values", "Absolute values"]; }
        else if (idx === 1) { name = "Introductory Variables & Coefficients"; description = "Learning algebraic notations, constants, variables, and forming simple equations."; topics = ["Constants vs Variables", "Like and Unlike terms", "Writing expressions", "Simple replacement tests"]; }
        else if (idx === 2) { name = "Ratio, Proportion & Unitary Method"; description = "Comparing quantities using ratios, verifying proportions, and solving unitary problems."; topics = ["Ratio of two quantities", "Proportion checks (extreme/mean)", "Unitary method steps", "Speed ratio models"]; }
        else if (idx === 3) { name = "Basic Triangle Congruence Concepts"; description = "Understanding congruent shapes and the fundamental criteria of triangle equality."; topics = ["Congruent figures", "Side-Side-Side (SSS) concept", "Side-Angle-Side (SAS) concept", "Pythagorean triples intro"]; }
        else if (idx === 4) { name = "Area of Trapeziums & Complex Grids"; description = "Decomposing irregular shapes into rectangles and triangles to find total area."; topics = ["Trapezium boundary formula", "Grid box area approximations", "Decomposing irregular polygons", "Fencing costs calculations"]; }
      } else if (classNum === 7) {
        if (idx === 0) { name = "Rational Numbers & BODMAS Rules"; description = "Performing fractions arithmetic under strict BODMAS bracket operation orders."; topics = ["BODMAS precedence laws", "Rational numbers properties", "Additive and Multiplicative inverses", "Negative fraction products"]; }
        else if (idx === 1) { name = "Linear Equations in One Variable"; description = "Solving algebraic equations by transposing constants and variables to opposite sides."; topics = ["Transposition techniques", "Solving x+a = b", "Age-related word equations", "Fractional variable models"]; }
        else if (idx === 2) { name = "Percentages & Commercial Applications"; description = "Calculating profit, loss, discount percentages, and introductory simple interest."; topics = ["Profit and Loss percentage", "Discount & Marked Price", "Simple Interest formula I=PRT/100", "Finding rate and time variables"]; }
        else if (idx === 3) { name = "Properties of Parallel Lines & Angles"; description = "Understanding alternate interior angles, corresponding angles, and co-interior angles."; topics = ["Transversal line properties", "Alternate interior angles", "Corresponding angles", "Angle sum of a triangle proof"]; }
        else if (idx === 4) { name = "Surface Area & Volume of Prisms"; description = "Calculating the lateral surface area and volume of triangular and rectangular prisms."; topics = ["Prism net structures", "Lateral surface area", "Volume of rectangular prisms", "Comparing prism capacities"]; }
      } else if (classNum === 8) {
        if (idx === 0) { name = "Rational Number Sets & Properties"; description = "Exploring closure, commutative, associative, and distributive properties of rational numbers."; topics = ["Rational number closure laws", "Distributive property", "Density of rational numbers", "Irrational number introduction"]; }
        else if (idx === 1) { name = "Quadratic Polynomials & Factoring"; description = "Factoring trinomials of the form ax^2 + bx + c by splitting the middle term."; topics = ["Splitting middle terms", "Common factors extraction", "Difference of two squares", "Algebraic identities (a+b)^2"]; }
        else if (idx === 2) { name = "Speed-Time-Distance & Direct Proportions"; description = "Solving direct and inverse variation problems regarding speed, time, and work completions."; topics = ["Direct variation equations", "Inverse variation models", "Work done per day calculations", "Relative speed trains crossing"]; }
        else if (idx === 3) { name = "Triangles: Congruency & Theorems"; description = "Proving triangle congruences using ASA, AAS, and RHS theorems systematically."; topics = ["Angle-Side-Angle (ASA) proof", "Right-angle Hypotenuse Side (RHS)", "Isosceles triangle theorems", "Angle bisector locus"]; }
        else if (idx === 4) { name = "Surface Area & Volume of Cylinders"; description = "Calculating total surface area, curved surface area, and volume of cylindrical tanks."; topics = ["Curved surface area 2πrh", "Total surface area 2πr(h+r)", "Cylinder fluid capacity πr^2h", "Hollow metal pipe volumes"]; }
      } else if (classNum === 9) {
        if (idx === 0) { name = "Linear Equations in Two Variables"; description = "Solving pairs of equations using graphical representations and substitution methods."; topics = ["Platting linear lines", "Substitution methods", "Consistency of linear pairs", "Unique vs infinite solutions"]; }
        else if (idx === 1) { name = "Quadratic Equations & Roots (Class 9)"; description = "Introduction to solving quadratic equations by standard factoring and root checking."; topics = ["Roots of quadratic equations", "Factoring by grouping", "Product and sum of roots", "Real-world physics trajectory roots"]; }
        else if (idx === 2) { name = "Arithmetic Progression Series"; description = "Learning sequence notations, common differences, and formulating the n-th term of an AP."; topics = ["Common difference d", "n-th term formula a_n = a + (n-1)d", "Verifying AP sequences", "Daily savings AP series"]; }
        else if (idx === 3) { name = "Trigonometry Ratios & Values"; description = "Learning sine, cosine, tangent ratios and standard values for 0°, 30°, 45°, 60°, and 90°."; topics = ["SOH CAH TOA definitions", "Trig ratios of complementary angles", "Standard trig table values", "Trigonometric ratios of unit circles"]; }
        else if (idx === 4) { name = "Grouped Data Statistics & Mean"; description = "Organizing raw data into grouped frequency distributions and calculating standard arithmetic mean."; topics = ["Grouped frequency tables", "Direct mean calculation method", "Class mark determination", "Frequency polygon drawing"]; }
        else if (idx === 5) { name = "Distance & Section Coordinate Geometry"; description = "Calculating distances between two coordinate points on Cartesian grids."; topics = ["Cartesian coordinate quadrants", "Distance formula proof", "Collinearity of three points", "Midpoint formula layout"]; }
      }
    } else if (catKey === 'science') {
      if (classNum === 1) {
        if (idx === 0) { name = "My Five Senses & Healthy Self"; description = "Learning how eyes, ears, nose, tongue, and skin help us explore our home environment."; topics = ["Our sensory organs", "Healthy eating habits", "Brushing and washing", "First aid basics"]; }
        else if (idx === 1) { name = "Plants & Green Leaves Around Us"; description = "Discovering the simple structure of garden plants, flowers, and trees."; topics = ["Stem and green leaves", "Naming colorful flowers", "Watering small plants", "Recognizing tree barks"]; }
        else if (idx === 2) { name = "Happy Pets & Wild Animals"; description = "Identifying domestic dogs, cats, cows, and major wild animals like tigers and bears."; topics = ["Farms and pets", "Jungle animals", "Animal food habits", "Insects and birds"]; }
        else if (idx === 3) { name = "Fresh Air & Safe Water Sources"; description = "Understanding the importance of drinking clean water and breathing fresh country air."; topics = ["Drinking water sources", "Air is everywhere", "Simple rain observations", "Seasons of the year"]; }
      } else if (classNum === 2) {
        if (idx === 0) { name = "Our Wonderful Skeletal Structure"; description = "Learning about bones, muscles, posture, and simple physical exercises."; topics = ["Bones and joints", "Muscle movements", "Correct sitting posture", "Healthy playtime"]; }
        else if (idx === 1) { name = "Seeds and Plant Growth Cycle"; description = "How small seeds germinate into healthy green saplings using soil and sunlight."; topics = ["Seed planting", "Sunlight for plants", "Root water absorption", "Fruits and vegetables"]; }
        else if (idx === 2) { name = "Animal Shelters & Nests"; description = "Exploring where animals live, bird nest constructions, and caring for animal buddies."; topics = ["Birds and nests", "Stables and kennels", "Animal sound calls", "Protecting stray animals"]; }
        else if (idx === 3) { name = "Water Cycle Basics & Rain Clouds"; description = "Simple explanations of evaporation, condensation, rainfall, and puddle formations."; topics = ["How clouds form", "Conserving well water", "Puddles evaporation", "Snow and ice properties"]; }
      } else if (classNum === 3) {
        if (idx === 0) { name = "Food, Nutrients & Energy"; description = "Testing our food for starch, fats, and understanding healthy balanced diet circles."; topics = ["Carbohydrates and proteins", "Balanced nutrition plate", "Starch iodine test", "Avoiding junk foods"]; }
        else if (idx === 1) { name = "Our Alimentary Canal & Digestions"; description = "Journey of food from mouth, stomach, small intestine, and digestive enzymes."; topics = ["Skeletal bones layout", "Mouth chewing functions", "Stomach acid roles", "Intestine water absorption"]; }
        else if (idx === 2) { name = "Solids, Liquids & Gases (Matter)"; description = "Comparing properties of ice, water, and steam, and dissolving kitchen salts."; topics = ["Three states of water", "Solubility of sugar", "Evaporating steam", "Solid/liquid mixtures"]; }
        else if (idx === 3) { name = "Green Chlorophyll & Photosynthesis"; description = "Detailed look at leaf stomata, transpiration, and how plants manufacture starch."; topics = ["Photosynthesis equation", "Transpiration in leaves", "Taproot vs fibrous roots", "Pollination basics"]; }
        else if (idx === 4) { name = "Eco-Systems & Food Chains"; description = "Understanding producer, consumer, decomposer roles, and protecting local forests."; topics = ["Food web links", "Recycling leaf waste", "Avoiding plastic bags", "Air and water pollution"]; }
      } else if (classNum === 4) {
        if (idx === 0) { name = "Balanced Diets & Deficiency Diseases"; description = "Analyzing vitamins, minerals, and diseases caused by lacking healthy nutrients."; topics = ["Vitamin A, B, C, D sources", "Scurvy and Rickets", "Protein malnutrition", "Goiter and Anemia"]; }
        else if (idx === 1) { name = "Human Respiration & Circulatory Organs"; description = "Understanding lung oxygen exchange and heart pumping blood vessels."; topics = ["Lungs bronchial tubes", "Heart chambers intro", "Oxygenated blood flow", "Pulse rate checks"]; }
        else if (idx === 2) { name = "Physical vs Chemical Changes"; description = "Differentiating temporary melting of wax from permanent chemical burning of wood."; topics = ["Melting and freezing", "Rusting of iron", "Chemical reactions basic", "Making salt solutions"]; }
        else if (idx === 3) { name = "Flower Anatomy & Pollinations"; description = "Identifying petals, sepals, stamens, and pistils, and insect pollination."; topics = ["Pistils and stamens", "Self vs cross pollination", "Insect pollinators (bees)", "Seed structures"]; }
        else if (idx === 4) { name = "Pollution Types & Ozone Protections"; description = "Studying smoke, toxic water wastes, recycling, and the protective ozone layer."; topics = ["Ozone layer filter", "Biodegradable wastes", "3R waste management", "Industrial water smoke"]; }
      } else if (classNum === 5) {
        if (idx === 0) { name = "Plant Nutrients & Organic Manure"; description = "Understanding nitrogen, potassium, phosphorus inputs, and composing organic fertilizers."; topics = ["NPK plant feeds", "Vermicomposting methods", "Nitrogen-fixing bacteria", "Crop rotation values"]; }
        else if (idx === 1) { name = "Nervous Coordination & Brain Lobes"; description = "Introduction to the brain, spinal cord, sensory neurons, and reflex actions."; topics = ["Cerebrum and cerebellum", "Spinal cord reflex arc", "Optic nerve signals", "Synapse signals basics"]; }
        else if (idx === 2) { name = "Solubility Indices & Crystallization"; description = "Creating saturated solutions, examining crystal structures, and water hardness properties."; topics = ["Saturated solutions charts", "Crystallizing copper sulfate", "Hard vs soft tap water", "Distillation setups"]; }
        else if (idx === 3) { name = "Seed Germination Mechanics"; description = "Analyzing hypogeal and epigeal seed germination, moisture, and temperature triggers."; topics = ["Epigeal vs hypogeal", "Moisture seed triggers", "Cotyledons storage", "Root shoot directions"]; }
        else if (idx === 4) { name = "Atmospheric Layers & Greenhouses"; description = "Layers of the atmosphere, greenhouse effect gases, and global warming impacts."; topics = ["Troposphere to exosphere", "Carbon dioxide heat trapping", "Rising global temperature", "Alternative energy solutions"]; }
      } else if (classNum === 6) {
        if (idx === 0) { name = "Plant and Animal Cell Organelles"; description = "Comparing cell membrane, cell wall, nucleus, vacuole, and mitochondria."; topics = ["Cell wall vs membrane", "Mitochondria cellular power", "Chloroplast plant cells", "Cytoplasm fluids"]; }
        else if (idx === 1) { name = "Metals Reactions with Acids"; description = "Testing how magnesium, zinc, and iron react with diluted hydrochloric acid."; topics = ["Metal-acid reactions", "Hydrogen gas bubble test", "Displacement series intro", "Rust prevention coating"]; }
        else if (idx === 2) { name = "Mechanical Friction & Air Drag"; description = "Analyzing friction coefficients, sliding resistance, and streamlining fast vehicles."; topics = ["Static vs kinetic friction", "Lubricants application", "Air resistance streamlines", "Spring balance force tests"]; }
        else if (idx === 3) { name = "Light Reflection & Ray Optics"; description = "Proving light travels in straight lines and investigating flat mirror reflections."; topics = ["Rectilinear propagation", "Incident and reflected rays", "Pinhole camera mechanics", "Lateral inversions"]; }
        else if (idx === 4) { name = "Pathogenic Microbes & Vaccinations"; description = "Differentiating bacteria, viruses, fungi, and understanding vaccine immune defenses."; topics = ["Bacteria vs virus sizes", "Antibiotic discoveries", "Vaccine antigen triggers", "Preserving milk pasteurization"]; }
      } else if (classNum === 7) {
        if (idx === 0) { name = "Cell Division: Mitosis & Meiosis"; description = "Comparing somatic cell mitosis division with gamete cell meiosis reduction division."; topics = ["Prophase metaphase phases", "Chromosome duplication", "Meiosis reduction stages", "Growth vs reproduction cells"]; }
        else if (idx === 1) { name = "Metal Displacement Series & Corrosion"; description = "Testing reactive metal replacements and analyzing electrochemical iron rusting."; topics = ["Reactivity series ranking", "Zinc replacing copper sulfate", "Salt water rusting acceleration", "Anodizing and galvanizing"]; }
        else if (idx === 2) { name = "Ohm's Electrical Law & Current Flow"; description = "Verifying the relationship between voltage, electrical current, and resistance."; topics = ["Ohm's Law equation V=IR", "Ammeter and voltmeter setups", "Resistor conductor variables", "Short circuit protections"]; }
        else if (idx === 3) { name = "Mirrors Optics & Lenses Refractions"; description = "Investigating light refraction rules, Snell's law, and focal points."; topics = ["Concave and convex mirrors", "Lenses focal distance", "Snell's refractive index", "Dispersion rainbow patterns"]; }
        else if (idx === 4) { name = "Immune White Blood Cells & Vaccines"; description = "Deconstructing phagocytes, lymphocytes, antibody creation, and standard vaccinations."; topics = ["Phagocytosis mechanics", "T-cells and B-cells", "Active vs passive immunity", "Eradicating polio vaccine"]; }
      } else if (classNum === 8) {
        if (idx === 0) { name = "Cell Organelles & Cell Nuclei Code"; description = "Detailed structure of chromosomes, chromatin threads, nuclear pores, and DNA strands."; topics = ["Nuclear envelope pores", "Histone proteins chromosomes", "Nucleolus ribosomes synthesis", "Comparing eukaryotic cell nucleoids"]; }
        else if (idx === 1) { name = "Non-Metals Chemistry & Acids Rain"; description = "Reactions of sulfur, carbon, and nitrogen with oxygen forming acidic oxides."; topics = ["Sulfur dioxide synthesis", "Carbonic and sulfuric acid rains", "Testing pH with indicator paper", "Scrubbing industrial exhaust smoke"]; }
        else if (idx === 2) { name = "Atmospheric Pressure & Pascal's Fluids"; description = "Measuring air pressure using barometers and demonstrating Pascal's fluid pressure transfer."; topics = ["Torricelli mercury barometer", "Pascal's fluid pistons multipliers", "Water pressure with depths", "Suction cup vacuum mechanics"]; }
        else if (idx === 3) { name = "Human Eye Optics & Lens Corrections"; description = "Anatomy of the retina, cornea, and correcting myopia and hypermetropia using lenses."; topics = ["Cornea and crystalline lens", "Retinal rod and cone photoreceptors", "Myopia concave correction", "Hypermetropia convex correction"]; }
        else if (idx === 4) { name = "Antigen-Antibody Locks & Vaccines"; description = "Studying molecular locking models of antigens and antibodies to prevent pandemics."; topics = ["Antigen receptor matches", "Memory cells immune recalls", "mRNA vaccine principles", "Herd immunity percentages"]; }
      } else if (classNum === 9) {
        if (idx === 0) { name = "Chemical Formula Synthesis Rules"; description = "Balancing multi-compound chemical equations using valency, radicals, and molecular weight."; topics = ["Valency crosses of radicals", "Balancing chemical equations", "Conservation of molecular mass", "Reactants state symbols"]; }
        else if (idx === 1) { name = "Carbon Compounds & HOMOLOGOUS Series"; description = "Nomenclature of saturated alkanes and unsaturated alkenes and saponification steps."; topics = ["Carbon carbon covalent bonds", "Homologous alkane chains", "IUPAC prefixes (Meth Eth Prop)", "Saponification soap making"]; }
        else if (idx === 2) { name = "Life Processes & Blood Transports"; description = "Deconstructing the human heart, xylem and phloem transport, and kidney nephron actions."; topics = ["Heart auricles and ventricles", "Double circulation system", "Xylem water suction pull", "Nephron urine filtration"]; }
        else if (idx === 3) { name = "Lenses Optics & Snell's Refractions"; description = "Applying mirror and lens formulas to calculate magnification and focal centers."; topics = ["Lens formula 1/f = 1/v - 1/u", "Magnification ratios", "Critical angle total reflection", "Prism angle of deviation"]; }
        else if (idx === 4) { name = "Electricity, Series & Parallel Resistors"; description = "Analyzing total resistance inside series and parallel circuit loops."; topics = ["Series resistors R1+R2+R3", "Parallel equations 1/R", "Joule's heating law", "Fuses and circuit breakers"]; }
        else if (idx === 5) { name = "Hormones Coordination & Reflex Arc"; description = "Detailed study of brain hemispheres, spinal reflexes, and hormone loops."; topics = ["Cerebral cortex functions", "Reflex arc synapse speed", "Thyroxine insulin loops", "Plant auxins growth directions"]; }
      }
    } else if (catKey === 'social') {
      if (classNum === 1) {
        if (idx === 0) { name = "Our Beautiful Family & Community Helpers"; description = "Learning about doctors, teachers, police officers, and firefighters."; topics = ["My loving parents", "Police officers and doctors", "Emergency call numbers", "Helpful postal workers"]; }
        else if (idx === 1) { name = "Directions: North, South, East, West"; description = "Finding locations around school and home using four cardinal directions."; topics = ["Cardinal directions basic", "Locating my home", "Reading a map key", "Coloring our national flag"]; }
        else if (idx === 2) { name = "Caring For Our Neighbors & Animals"; description = "Understanding local neighborhood greetings and being kind to animals."; topics = ["Caring for friends", "Greeting our elders", "Feeding hungry birds", "Keeping streets clean"]; }
        else if (idx === 3) { name = "Happy Household & Family Chores"; description = "Sharing simple household responsibilities and respecting grandparents."; topics = ["Helping wipe dishes", "Cleaning study desks", "Family history trees", "Sharing toys fairly"]; }
      } else if (classNum === 2) {
        if (idx === 0) { name = "Our Town Helpers & Panchayats"; description = "Learning how local post offices, banks, and municipal offices operate."; topics = ["Local Post Office functions", "Primary health clinics", "How banks keep money safe", "Traffic police safety rules"]; }
        else if (idx === 1) { name = "Map Scales & Drawing Simple Rooms"; description = "Making grid maps of study bedrooms and classrooms with ratio scales."; topics = ["Ratios on paper", "Measuring tables in inches", "Compass directions", "Blue water representations"]; }
        else if (idx === 2) { name = "Clean Parks & Neighborhood Gardens"; description = "Organizing local clean-ups and planting saplings in neighborhood parks."; topics = ["Dumping trash in bins", "Planting garden shrubs", "Protecting park benches", "Sharing public swings"]; }
        else if (idx === 3) { name = "Family Celebrations & Festivals"; description = "Learning about traditional Indian festivals, harvest celebrations, and seasonal songs."; topics = ["National festivals days", "Harvest holidays (Pongal/Bihu)", "Traditional clothing wear", "Respecting all faiths"]; }
      } else if (classNum === 3) {
        if (idx === 0) { name = "Our Country India: Physical Divisions"; description = "Introduction to Himalayan ranges, coastal plains, Deccan peninsula, and major rivers."; topics = ["Himalayas snow peaks", "Ganges and Yamuna paths", "Deccan plateau", "Sunderban tiger deltas"]; }
        else if (idx === 1) { name = "Ancient Civilizations: Indus Valley"; description = "Discovering Mohenjo-daro street grids, brick sewers, and public bath designs."; topics = ["Indus Valley town plans", "Great Bath structures", "Harappan seals", "Clay terracotta toys"]; }
        else if (idx === 2) { name = "Indian Constitution & Fundamental Rights"; description = "Understanding who drafts our constitution, voting rights, and child education."; topics = ["Dr. B.R. Ambedkar assembly", "What is Preamble?", "Gram Panchayat duties", "Right to Education Act"]; }
        else if (idx === 3) { name = "Odisha Heritage & Konark Sun Temple"; description = "History of Emperor Narasimhadeva I, Chilika Lake, and Khandagiri caves."; topics = ["Konark Temple architecture", "Chilika birds sanctuary", "Khandagiri caves", "Odisha maritime histories"]; }
        else if (idx === 4) { name = "Globe Coordinates: Latitudes & Longitudes"; description = "Understanding the equator, prime meridian, and calculating simple time differences."; topics = ["Equator zero degrees", "Parallels of latitude", "Meridians of longitude", "Calculations of time zones"]; }
      } else if (classNum === 4) {
        if (idx === 0) { name = "Himalayan Forest Reserves & Climates"; description = "Studying alpine vegetation, evergreen forests, and extreme weather zones in India."; topics = ["Alpine trees conifers", "Evergreen vs deciduous trees", "Monsoon cloud pathways", "Rain shadow desert dry zones"]; }
        else if (idx === 1) { name = "Emperor Ashoka the Great & Dhamma"; description = "The Kalinga War, rock inscriptions, and spreading peaceful Dhamma rules."; topics = ["Kalinga War history", "Buddhist pillars inscriptions", "Ashoka's peaceful edicts", "Spread of Buddhism paths"]; }
        else if (idx === 2) { name = "Municipal Corporations & State Assemblies"; description = "Understanding local city mayors, MLC/MLA roles, and law-making bodies."; topics = ["City Municipal Mayor duties", "State Assembly structures", "Governor and Chief Minister", "Solving local water disputes"]; }
        else if (idx === 3) { name = "Odisha Maritime Trade & Boita Bandana"; description = "Historic trade routes with Bali, Sumatra, Java, and traditional festivals."; topics = ["Sadhabas merchant ships", "Boita Bandana festival", "Spices and silk trade", "Odisha ancient ports"]; }
        else if (idx === 4) { name = "Reading Standard Topographical Maps"; description = "Analyzing contour lines, physical color codings, and road symbol legends."; topics = ["Contour lines heights", "Ruler scale calculations", "Physical brown colors peaks", "Road network symbols"]; }
      } else if (classNum === 5) {
        if (idx === 0) { name = "Deccan Plateau Soil & Mineral Mapping"; description = "Exploring black cotton soil, iron ore mines, coal basins, and resource distribution."; topics = ["Deccan volcanic rocks", "Black cotton soils", "Chota Nagpur iron mines", "Conserving rich minerals"]; }
        else if (idx === 1) { name = "Golden Gupta Empire & Art"; description = "Historical reign of Samudragupta, metallurgy, Ayurvedic medical advancements, and mathematics."; topics = ["Samudragupta gold coins", "Iron Pillar of Delhi", "Aryabhata decimal math", "Classical Sanskrit dramas"]; }
        else if (idx === 2) { name = "Parliamentary Lok Sabha & Bills"; description = "Studying the structure of Lok Sabha and Rajya Sabha, and bill passing stages."; topics = ["Speaker of Lok Sabha", "Bill reading processes", "Presidential approvals", "Constitutional amendment rules"]; }
        else if (idx === 3) { name = "Odisha Freedom Struggles & Paika Rebel"; description = "Analyzing Baxi Jagabandhu, Paika Rebellion (1817), and Satyabadi school."; topics = ["Paika Bidroha rebellion", "Baxi Jagabandhu leaders", "Satyabadi Vana Vidyalaya", "Salt Satyagraha Odisha"]; }
        else if (idx === 4) { name = "Time Zone Math & Prime Meridians"; description = "Calculating exact local times across global cities using longitude offsets."; topics = ["Prime Meridian 0° GMT", "15 degrees equals one hour", "East-west longitude math", "International Date Line"]; }
      } else if (classNum === 6) {
        if (idx === 0) { name = "The Delhi Sultanate & Slave Dynasty"; description = "Political rule of Qutbuddin Aibak, Razia Sultana, and administrative taxation."; topics = ["Slave dynasty Qutbuddin", "Razia Sultana first queen", "Iqta tax land distribution", "Qutb Minar architecture"]; }
        else if (idx === 1) { name = "Atmospheric Troposphere & Air Cycles"; description = "Deconstructing nitrogen, oxygen ratios, troposphere heights, and wind directions."; topics = ["Atmospheric gas composition", "Troposphere weather changes", "High-low pressure winds", "Global temperature convection"]; }
        else if (idx === 2) { name = "Lok Sabha, Rajya Sabha & Judiciary"; description = "Detailed study of parliamentary members, bills, and Supreme Court protections."; topics = ["MPs election criteria", "Rajya Sabha tenure", "Supreme Court judges", "Independent judiciary power"]; }
        else if (idx === 3) { name = "Steel Plants & Heavy Metal Deposits"; description = "Mapping major public sector steel industries, iron mines, and transport highways."; topics = ["Rourkela Steel Plant", "Bhilai heavy industries", "National Highway grids", "Export cargo ports"]; }
        else if (idx === 4) { name = "Satyabadi School & Gopabandhu Das"; description = "Historic contribution of Utkalmani Gopabandhu Das and salt satyagraha marches."; topics = ["Utkalmani Gopabandhu Das", "Satyabadi school open air", "Samaja newspaper origins", "Salt satyagraha Inchudi"]; }
      } else if (classNum === 7) {
        if (idx === 0) { name = "The Mughal Empire: Akbar & Administrations"; description = "Reigns of Babur, Akbar, Shah Jahan, and details of Mansabdari administration systems."; topics = ["Battle of Panipat", "Mansabdari rank military", "Akbar's religious tolerances", "Taj Mahal monument details"]; }
        else if (idx === 1) { name = "Ocean Currents & Deep Marine Tides"; description = "Analyzing warm Gulf Stream currents, low-high tides physics, and saline counts."; topics = ["Warm vs cold ocean currents", "Gravitational lunar tides", "Salinity ocean water graphs", "Marine shipping routes"]; }
        else if (idx === 2) { name = "Passing of Parliamentary Bills & Acts"; description = "Deconstructing ordinary bills, money bills, debate sessions, and committee hearings."; topics = ["Ordinary bill vs Money bill", "Three reading stages", "Joint session resolutions", "Veto powers of President"]; }
        else if (idx === 3) { name = "Commercial Farming & Cash Crops Mapping"; description = "Mapping cotton, tea, sugarcane plantations, and drip-irrigation networks."; topics = ["Black soil cotton zones", "Assam tea garden terracing", "Drip irrigation conservation", "Sugarcane milling hubs"]; }
        else if (idx === 4) { name = "Odisha Salt Satyagraha & Inchudi March"; description = "Understanding local Satyagraha movements, salt boiling, and Gopabandhu's arrests."; topics = ["Inchudi salt march leaders", "Women satyagrahis (Rama Devi)", "Swaraj ashram setups", "Boycotting foreign textiles"]; }
      } else if (classNum === 8) {
        if (idx === 0) { name = "Mughal Empire Decline & East India Co"; description = "Analyzing Battle of Plassey, Doctrine of Lapse, and British trading expand."; topics = ["Battle of Plassey 1757", "Doctrine of Lapse annexations", "Decline of Mughals Aurangzeb", "EIC trading factories"]; }
        else if (idx === 1) { name = "Earth's Internal Mantle & Core Layers"; description = "Studying Sial and Sima layers, plate boundaries, and seismograph recordings."; topics = ["Sial and Sima rock compositions", "Tectonic continental plates", "Seismograph Richter scale ratings", "Volcanic magma vent pipes"]; }
        else if (idx === 2) { name = "Supreme Court Judicial Review Power"; description = "Analyzing fundamental rights protections, writ petitions, and public interest litigation."; topics = ["Writ of Habeas Corpus", "Public Interest Litigation (PIL)", "Judicial review of laws", "District court structures"]; }
        else if (idx === 3) { name = "Mineral Mining Zones & Environmental Laws"; description = "Balancing industrial mining demands with forest tribal conservation laws."; topics = ["Coal mining environmental impacts", "Tribal lands forest acts", "Sustainable development laws", "Renewable solar wind grids"]; }
        else if (idx === 4) { name = "Odisha Paika Rebellion Leaders (1817)"; description = "Deconstructing Baxi Jagabandhu's Paika rebellion, and historical battles with British."; topics = ["Baxi Jagabandhu military general", "Paikas soldier class", "Khurda fort siege battles", "Paika rebellion triggers"]; }
      } else if (classNum === 9) {
        if (idx === 0) { name = "Rise of European Nationalism (Class 9)"; description = "French revolution, estate assemblies, Napoleonic codes, and Italian unifications."; topics = ["French Estates Assembly", "Fall of Bastille 1789", "Napoleonic civil codes", "Garibaldi Italian unification"]; }
        else if (idx === 1) { name = "Nationalism in India & Rowlatt Act"; description = "Detailed study of Mahatma Gandhi's return, Jallianwala Bagh, and Dandi salt march."; topics = ["Rowlatt Act 1919 clampdowns", "Jallianwala Bagh massacre", "Non-Cooperation Movement 1920", "Dandi Salt March 1930"]; }
        else if (idx === 2) { name = "Alluvial, Black and Red Soils Mapping"; description = "Soil classifications across Indian agricultural states and forest soils properties."; topics = ["Alluvial fertile riverbeds", "Black volcanic clay soils", "Red iron-oxide dry soils", "Soil erosion prevention"]; }
        else if (idx === 3) { name = "Belgian vs Sri Lankan Power Sharing"; description = "Comparing community government power sharing with majoritarian crisis."; topics = ["Belgian decentralization model", "Brussels shared council", "Sri Lankan majoritarian crisis", "Schedules of decentralization"]; }
        else if (idx === 4) { name = "GDP evaluation & Economy Sectors"; description = "Analyzing primary, secondary, and tertiary sectors, and NREGA employment guarantees."; topics = ["Primary agriculture sectors", "Secondary factories manufacturing", "Tertiary software services", "GDP estimation formulas"]; }
      }
    } else if (catKey === 'language') {
      name = `${ch.name} (Class ${classNum})`;
    } else if (['physics', 'chemistry', 'biology', 'history', 'geography'].includes(catKey)) {
      name = `${ch.name} (Class ${classNum})`;
      description = `Class ${classNum} graded curriculum focusing on standard ${ch.name.toLowerCase()} syllabus criteria and study blueprints.`;
      topics = ch.topics.map(t => `${t} (Class ${classNum} Concept)`);
    }

    return {
      name,
      weightage,
      description,
      topics
    };
  });
};

const buildSyllabusData = (): SyllabusData => {
  const data: SyllabusData = {
    odia: {},
    cbse: {},
    icse: {},
    china2070: {}
  };

  for (let c = 1; c <= 10; c++) {
    const cat = c <= 2 ? 'primary' : c <= 5 ? 'elementary' : c <= 8 ? 'middle' : 'high';

    // 1. BSE Odisha Medium
    data.odia[c] = BOARD_SUBJECTS.odia.map((subTemplate) => {
      let catKey = 'language';
      if (subTemplate.id === 'maths') catKey = 'maths';
      else if (subTemplate.id === 'science') catKey = 'science';
      else if (subTemplate.id === 'social') catKey = 'social';

      const chapters = getChaptersForClass(catKey, c, 'odia').map((ch) => {
        return {
          name: translateToOdia(ch.name),
          weightage: ch.weightage,
          description: translateToOdia(ch.description),
          topics: ch.topics.map(t => translateToOdia(t))
        };
      });

      const finalName = c === 10 ? (subTemplate.id === 'odia' ? 'Odia (Sahitya Sindhu)' : subTemplate.name)
                      : c === 9 ? (subTemplate.id === 'odia' ? 'Odia (Ama Sahitya)' : subTemplate.name)
                      : `${subTemplate.name} (Class ${c})`;

      const finalOdiaName = c === 10 ? (subTemplate.id === 'odia' ? 'ମାତୃଭାଷା (ସାହିତ୍ୟ ସିନ୍ଧୁ)' : subTemplate.odiaName)
                          : c === 9 ? (subTemplate.id === 'odia' ? 'ମାତୃଭାଷା (ଆମ ସାହିତ୍ୟ)' : subTemplate.odiaName)
                          : `${subTemplate.odiaName} (ଶ୍ରେଣୀ ${c})`;

      return {
        id: `${subTemplate.id}-odia-${c}`,
        name: finalName,
        odiaName: finalOdiaName,
        icon: subTemplate.icon,
        chapters: chapters,
        resources: [
          `BSE Odisha Class ${c} ${subTemplate.name} Textbook PDF`,
          `Model Question Paper (Odia Medium) Class ${c}`,
          `Revision MCQs Study Workbook`
        ]
      };
    });

    // 2. CBSE Board
    data.cbse[c] = BOARD_SUBJECTS.cbse.map((subTemplate) => {
      let catKey = 'language';
      if (subTemplate.id === 'maths') catKey = 'maths';
      else if (subTemplate.id === 'science') catKey = 'science';
      else if (subTemplate.id === 'social') catKey = 'social';

      const chapters = getChaptersForClass(catKey, c, 'cbse');

      return {
        id: `${subTemplate.id}-cbse-${c}`,
        name: `${subTemplate.name} (Class ${c})`,
        icon: subTemplate.icon,
        chapters: chapters,
        resources: [
          `NCERT Class ${c} ${subTemplate.name} Book PDF`,
          `CBSE Blueprints & Marking Scheme`,
          `Arohi Smart Online Study Packet`
        ]
      };
    });

    // 3. ICSE Board
    data.icse[c] = BOARD_SUBJECTS.icse.map((subTemplate) => {
      let catKey = subTemplate.id;
      if (subTemplate.id === 'english') catKey = 'language';

      const chapters = getChaptersForClass(catKey, c, 'icse');

      return {
        id: `${subTemplate.id}-icse-${c}`,
        name: `${subTemplate.name} (Class ${c})`,
        icon: subTemplate.icon,
        chapters: chapters,
        resources: [
          `Selina Concise Class ${c} ${subTemplate.name} Guide`,
          `ICSE Past 10 Years Solved Papers`,
          `Official Specimen Question Pack`
        ]
      };
    });

    // 4. Arohi 2070 Super Elite Track
    const eliteSubjects = [];

    // Subject 1: Abacus & Extreme Computational Logic (All Classes 1-10)
    let abacusChapters = [];
    if (c <= 3) {
      abacusChapters = [
        { name: "Mental Soroban Abacus Mechanics", weightage: "30 Marks", description: "Performing lightning-speed addition and subtraction of 3-digit figures using physical beads and mental projection arrays.", topics: ["Visual bead coordinate systems", "Single-digit flash numbers (0.5s intervals)", "Double-digit mental carry-overs", "Abacus tactile finger movements"] },
        { name: "Binary Representations & Boolean Switchings", weightage: "35 Marks", description: "Learning binary numbers, octals, and boolean AND, OR, NOT operations at an early age.", topics: ["Counting to 256 on fingers", "Boolean logic gates logic mapping", "LED transistor switches on paper", "Decoding simple binary words"] },
        { name: "Infinite Sequence Recognition & Patterns", weightage: "35 Marks", description: "Identifying complex recursive patterns, mathematical progression, and geometric symmetries.", topics: ["Fibonacci spiral grids", "Symmetrical rotation shapes", "Interlocking tessellations", "Arithmetic skip-counting variants"] }
      ];
    } else if (c <= 6) {
      abacusChapters = [
        { name: "Rapid Matrix Computations & Linear Solvers", weightage: "30 Marks", description: "Evaluating systems of equations using rapid matrix determinants, Cramer's shortcuts, and spatial coordinates.", topics: ["Cramer's Rule for 2x2 and 3x3 dimensions", "Determinants calculations in 3 seconds", "Gaussian row reduction puzzles", "Vector coordinates transformations"] },
        { name: "Asymptotic Complexity & Algorithmic Foundations", weightage: "35 Marks", description: "Analyzing speed constraints of standard search and sort routines.", topics: ["Big-O notation introduction", "Binary search vs Linear sweep", "Bubble and Quick-sort comparisons", "Recursive execution stack tracing"] },
        { name: "Combinatorics & Statistical Game Trees", weightage: "35 Marks", description: "Calculating risk ratios, Nash Equilibrium basics, and decision trees for multi-agent games.", topics: ["Permutations and combinations with rules", "Bayesian probability trees", "Nash Equilibrium game grids", "Expected value optimal action models"] }
      ];
    } else {
      abacusChapters = [
        { name: "Multi-variable Calculus & Coordinate Gradients", weightage: "30 Marks", description: "Using partial derivatives and gradient fields to model dynamic real-world environments.", topics: ["Partial differentiation rules", "Gradient vector flow fields", "Double integration over coordinate areas", "Line integrals & fluid circulation models"] },
        { name: "Fourier Analysis & Frequency Decompositions", weightage: "35 Marks", description: "Decomposing complex audio, electrical, and light wave patterns into sine and cosine vectors.", topics: ["Fourier Series expansion formulas", "Fast Fourier Transform (FFT) algorithms", "Signal noise filtering mechanics", "Spectral frequency amplitude charts"] },
        { name: "Advanced Linear Algebra & Eigenspace Transformations", weightage: "35 Marks", description: "Diagonalizing multidimensional matrices for hardware accelerated physics and neural-net engines.", topics: ["Eigenvalues and Eigenvectors", "Singular Value Decomposition (SVD)", "Vector space dimensions & basis", "Orthogonal projection transformations"] }
      ];
    }
    eliteSubjects.push({
      id: `abacus_math-china2070-${c}`,
      name: `Soroban Abacus & Extreme Math`,
      icon: '🧮',
      chapters: abacusChapters,
      resources: ["Elite Soroban Academy Practice Ledger", "Computational Matrix Cheat-Sheets", "Interactive Binary Logic Simulator"]
    });

    // Subject 2: Robotics, Microcontrollers & IoT (All Classes 1-10)
    let roboticsChapters = [];
    if (c <= 3) {
      roboticsChapters = [
        { name: "Gearboxes & Load-Bearing Assemblings", weightage: "30 Marks", description: "Interlocking multi-ratio gears, mechanical pulleys, and load-bearing drive systems.", topics: ["Axle gear ratio calculations", "Traction tire coefficients", "Motor placement load-distribution", "Chassis center-of-gravity balancing"] },
        { name: "Scratch Firmware Block-Programming", weightage: "35 Marks", description: "Writing structured logic loops, conditions, and sensor triggers inside block code interfaces.", topics: ["Conditional logic loops", "Delay and threshold variables", "Drag-and-drop functional nodes", "Digital output high/low signals"] },
        { name: "Proximity Sensor Calibration & Line Tracking", weightage: "35 Marks", description: "Programming robots to track light-reflection paths and avoid physical structures.", topics: ["Infrared light reflectance values", "Micro-switch touch trigger boundaries", "Dynamic calibration rules", "Emergency software loops"] }
      ];
    } else if (c <= 6) {
      roboticsChapters = [
        { name: "C++ Microcontroller Coding (Arduino)", weightage: "30 Marks", description: "Writing low-level Arduino script commands to toggle voltage pins and read analog sensor waves.", topics: ["pinMode() & digitalWrite() functions", "Serial port telemetry monitoring", "Global vs Local variable scopes", "Interrupt service routines (ISR)"] },
        { name: "Lidar Point-Clouds & Gyroscopic Controls", weightage: "35 Marks", description: "Integrating Lidar scanners and 6-axis gyroscope gyros to control self-balancing robots.", topics: ["Lidar range distance mapping", "Gyro angular rate calculations", "Proportional feedback loop structures", "Pulse-Width Modulation (PWM) speeds"] },
        { name: "ESP32 Wi-Fi & Distributed IoT Arrays", weightage: "35 Marks", description: "Networking multi-node microcontrollers to stream sensor arrays to local database dashboards.", topics: ["ESP32 network pairing protocols", "HTTP POST/GET packet assembly", "JSON payload parsing rules", "Web-socket instant notification grids"] }
      ];
    } else {
      roboticsChapters = [
        { name: "Robot Operating System (ROS) Architectures", weightage: "30 Marks", description: "Deploying multi-node publishers, subscribers, and coordinate systems for complex robot tasks.", topics: ["ROS Node initialization steps", "Topic publishers & Subscriber callbacks", "TF coordinate transformations", "ROS message serialization"] },
        { name: "Inverse Kinematics & Multi-Joint Arms", weightage: "35 Marks", description: "Calculating trigonometric joint angles required to position robotic grippers with sub-millimeter precision.", topics: ["Forward kinematics matrices", "Jacobian joint rate calculations", "Inverse kinematic constraints", "Torque load calculations"] },
        { name: "Autonomous SLAM Mapping & Path planning", weightage: "35 Marks", description: "Using laser scanners and visual cameras to generate map layouts and navigate around obstacles.", topics: ["Lidar SLAM point clouds", "Occupancy grid generation", "A* (A-Star) pathfinding", "Dynamic obstacle avoidance"] }
      ];
    }
    eliteSubjects.push({
      id: `micro_robotics-china2070-${c}`,
      name: `Microcontrollers, IoT & Robotics`,
      icon: '🤖',
      chapters: roboticsChapters,
      resources: ["Arohi 2070 Micro-Robotics Hardware Kit", "C++ Hardware API Specification", "SLAM Mapping ROS Sandbox Environment"]
    });

    // Subject 3: AI Engineering & Neural Cognition (Classes 4-10 only)
    if (c >= 4) {
      let aiChapters = [];
      if (c <= 7) {
        aiChapters = [
          { name: "Computer Vision Classifier Pipelines", weightage: "30 Marks", description: "Labeling, organizing, and training localized vision nodes to classify target structures.", topics: ["Bounding box marking", "Data augmentation techniques", "Train/Test dataset splits", "Precision metrics basic"] },
          { name: "Regression and Vector Fits", weightage: "35 Marks", description: "Fitting optimal algebraic lines and curves to complex multi-dimensional datasets.", topics: ["Linear scatter fits", "Gradient descent intuition", "Loss function mean-squared error", "Extrapolating values"] },
          { name: "Game Trees & Alpha-Beta Heuristics", weightage: "35 Marks", description: "Implementing deep logic trees for robotic game agents to outperform human competitors.", topics: ["Minimax decision formulas", "Heuristic board evaluations", "Max-depth limit parameters", "Alpha-Beta branch cuts"] }
        ];
      } else {
        aiChapters = [
          { name: "Convolutional Neural Networks (CNNs)", weightage: "30 Marks", description: "Building multi-layer digital neural synapses to identify objects inside digital video feeds.", topics: ["Convolution kernels & pooling layers", "Activation functions (ReLU, Sigmoid)", "Backpropagation weight tuning", "Overfitting dropout rates"] },
          { name: "Transformers & Attention Mechanism", weightage: "35 Marks", description: "Structuring models that parse text contexts using vector representations and attention layers.", topics: ["Self-Attention matrices math", "Tokenized text vectors", "Decoder block pipelines", "Fine-tuning weights parameters"] },
          { name: "Reinforcement Learning & Q-Tables", weightage: "35 Marks", description: "Training virtual software agents to solve intricate physics puzzles through progressive reward mechanics.", topics: ["Bellman equation updates", "Exploration vs Exploitation ratio", "Temporal difference learning", "Reward function design"] }
        ];
      }
      eliteSubjects.push({
        id: `ai_cognition-china2070-${c}`,
        name: `AI Engineering & Neural Cognition`,
        icon: '🧠',
        chapters: aiChapters,
        resources: ["Python PyTorch Neural Sandbox", "Dataset Annotation Workspace", "Arohi AI Model Hub Access API"]
      });
    }

    // Subject 4: Quantum Computing & Semiconductor Physics (Classes 5-10 only)
    if (c >= 5) {
      let quantumChapters = [];
      if (c <= 7) {
        quantumChapters = [
          { name: "Silicon Crystal Lattice Doping", weightage: "30 Marks", description: "Understanding pure silicon, N-type and P-type atomic doping, and diode paths.", topics: ["Valence electrons count", "Phosphorus/Boron doping", "Depletion layer behavior", "Forward vs reverse bias"] },
          { name: "MOSFET Transistor Architectures", weightage: "35 Marks", description: "Analyzing the molecular scale on-off switching mechanics of field-effect transistors.", topics: ["Gate, Source, and Drain fields", "Lithography process principles", "Voltage current thresholds", "Leakage current challenges"] },
          { name: "Universal Logic Processing Units", weightage: "35 Marks", description: "Designing logic processor circuits solely using combinations of NAND and NOR hardware grids.", topics: ["NAND equivalent logic", "Half-Adder circuits", "Flip-Flop memory latch", "CPU registers layout"] }
        ];
      } else {
        quantumChapters = [
          { name: "Quantum Qubits & Superposition", weightage: "30 Marks", description: "Harnessing physics states that exist as both 0 and 1 simultaneously until measured.", topics: ["Bloch Sphere representation", "Dirac bra-ket notation", "Probability amplitudes", "Measurement collapse physics"] },
          { name: "Entanglement & Quantum Circuits", weightage: "35 Marks", description: "Deploying quantum logic grids to entangle multiple qubits, accelerating computations exponentially.", topics: ["Hadamard phase splitter", "Pauli X, Y, Z gates", "Controlled-NOT (CNOT) entanglement", "Quantum telemetry registers"] },
          { name: "1nm Graphene Nanotube Technology", weightage: "35 Marks", description: "Designing next-generation microchips out of ultra-conductive graphene grids and carbon structures.", topics: ["Carbon nanotube conductivity", "Graphene quantum dots", "Lithography under 1nm scale", "Superheating thermal dissipation"] }
        ];
      }
      eliteSubjects.push({
        id: `quantum_phys-china2070-${c}`,
        name: `Quantum Computing & Semiconductor Physics`,
        icon: '⚛️',
        chapters: quantumChapters,
        resources: ["Solid-state Semiconductor Interactive Lab", "IBM Q-Experience Quantum Composer", "Graphene Nanotube Simulation SDK"]
      });
    }

    // Subject 5: CRISPR Bio-Hacking & Genetics (Classes 7-10 only)
    if (c >= 7) {
      let bioChapters = [
        { name: "DNA Molecular Sequencing & Code", weightage: "30 Marks", description: "Deconstructing the genomic data languages of A, T, C, and G nucleic pairs.", topics: ["DNA double-helix structure", "Transcription to RNA", "Codon amino-acid matching", "Genetic sequencing instruments"] },
        { name: "CRISPR-Cas9 Genome Editing", weightage: "35 Marks", description: "Configuring guide RNA strands to locate and mutate target genome regions with extreme precision.", topics: ["Cas9 endonuclease mechanism", "Guide RNA design templates", "Target-cut site repairs", "Genetic mutation prevention"] },
        { name: "Bioinformatic Query Arrays (BLAST)", weightage: "35 Marks", description: "Searching global nucleotide databases to identify similarities, lineages, and protein folding.", topics: ["NCBI gene string matching", "Phylogenetic tree creation", "Alignment scores analysis", "Protein fold predictions (AlphaFold)"] }
      ];
      eliteSubjects.push({
        id: `bio_tech-china2070-${c}`,
        name: `CRISPR Bio-Hacking & Genetics`,
        icon: '🧬',
        chapters: bioChapters,
        resources: ["Virtual CRISPR Strand Lab", "Biomedical Sequencing Database BLAST", "AlphaFold Protein Visualizer Workspace"]
      });
    }

    // Subject 6: Aerospace Engineering & Rocketry (Classes 8-10 only)
    if (c >= 8) {
      let spaceChapters = [
        { name: "Supersonic Aerodynamics & Wing Design", weightage: "30 Marks", description: "Calculating lift coefficients, drag indexes, and angle-of-attack limits for supersonic wings.", topics: ["Bernoulli and Newton principles", "Reynolds scale coefficient", "Boundary layer shear stress", "Wind-tunnel scale tests"] },
        { name: "Liquid Rocket Propulsion Nozzles", weightage: "35 Marks", description: "Modeling exhaust gas expansion speeds through converging-diverging De Laval nozzle tubes.", topics: ["Specific impulse equation", "Combustion chamber pressures", "De Laval nozzle expansion", "Fuel-to-Oxidizer mixing ratios"] },
        { name: "Orbital Ballistics & Spacecraft Dynamics", weightage: "35 Marks", description: "Formulating Keplerian satellite trajectories, orbit transfers, and orbital escape vectors.", topics: ["Keplerian orbit laws", "Hohmann transfer delta-v", "Low-earth satellite constellations", "Gravitational slingshot math"] }
      ];
      eliteSubjects.push({
        id: `space_rocketry-china2070-${c}`,
        name: `Aerospace Engineering & Rocketry`,
        icon: '🚀',
        chapters: spaceChapters,
        resources: ["Supersonic Aerodynamics Wind-Tunnel Lab", "Rocket Nozzle Design CAD Sandbox", "Orbital Gravity Trajectory Engine"]
      });
    }

    data.china2070[c] = eliteSubjects;
  }

  return data;
};

const SYLLABUS_DATA = buildSyllabusData();

function getChapterQuiz(board: string, subjectId: string, classNum: number, chapterName: string) {
  const nameClean = chapterName.toLowerCase();
  
  // Specific questions for Arohi 2070 Super Elite Technical/Advanced Track
  if (board === 'china2070') {
    if (subjectId.includes('abacus_math')) {
      if (nameClean.includes('abacus') || nameClean.includes('soroban')) {
        return {
          question: "When projecting a mental soroban bead system, which digit is represented by a single bead on the upper deck (above the beam)?",
          options: ["1 (One)", "5 (Five)", "10 (Ten)", "0 (Zero)"],
          correctIdx: 1,
          aiExplanation: "Correct! On a standard Soroban Abacus, the upper bead has a value of 5, while the four lower beads each represent 1. Projecting this deck configuration mentally allows students to perform lightning-speed 3-digit flash calculations."
        };
      }
      if (nameClean.includes('binary') || nameClean.includes('boolean')) {
        return {
          question: "How would you write the decimal number 13 in standard 4-bit binary notation?",
          options: ["1011", "1101", "1110", "1001"],
          correctIdx: 1,
          aiExplanation: "Perfect calculation! 13 is mapped as 8 + 4 + 0 + 1, which corresponds to active bits in positions (1 * 8) + (1 * 4) + (0 * 2) + (1 * 1) = 1101."
        };
      }
      if (nameClean.includes('sequence') || nameClean.includes('pattern')) {
        return {
          question: "Which mathematical sequence is represented by the recursive rule F(n) = F(n-1) + F(n-2) with starting values F(0)=0 and F(1)=1?",
          options: ["Arithmetic Progression", "Geometric Progression", "Fibonacci Sequence", "Prime-Number Distribution"],
          correctIdx: 2,
          aiExplanation: "Magnificent! The Fibonacci sequence defines each subsequent term as the sum of the previous two, forming the golden ratio spiral structures observed across biological systems."
        };
      }
      if (nameClean.includes('matrix') || nameClean.includes('linear')) {
        return {
          question: "What is the determinant of the 2x2 matrix [[4, 2], [1, 3]]?",
          options: ["10 (Ten)", "14 (Fourteen)", "12 (Twelve)", "6 (Six)"],
          correctIdx: 0,
          aiExplanation: "Spot on! The determinant of a 2x2 matrix [[a, b], [c, d]] is calculated as ad - bc. Thus, (4*3) - (2*1) = 12 - 2 = 10."
        };
      }
      if (nameClean.includes('asymptotic') || nameClean.includes('algorithm')) {
        return {
          question: "Which Big-O runtime represents the optimal average complexity for searching a sorted list of N items?",
          options: ["O(N)", "O(N log N)", "O(log N)", "O(1)"],
          correctIdx: 2,
          aiExplanation: "Correct! Binary search continually splits the search territory in half on each query step, resulting in a highly efficient O(log N) scale curve."
        };
      }
      if (nameClean.includes('combinatorics') || nameClean.includes('game')) {
        return {
          question: "In a symmetric multi-agent game, what is the state where neither player can gain by unilaterally changing their action?",
          options: ["Pareto Frontier", "Nash Equilibrium", "Minimax Threshold", "Bayes Optimal Bound"],
          correctIdx: 1,
          aiExplanation: "Brilliant! Named after John Nash, the Nash Equilibrium is the core theorem used to coordinate strategic game trees for multi-agent competitive engines."
        };
      }
      if (nameClean.includes('calculus') || nameClean.includes('gradient')) {
        return {
          question: "What mathematical operator finds the direction of maximum rate of increase of a multivariable density field f(x, y, z)?",
          options: ["Divergence (div ∇)", "Curl (curl ∇×)", "Gradient (grad / ∇)", "Laplacian (Δ)"],
          correctIdx: 2,
          aiExplanation: "Absolute genius! The gradient vector (denoted by del/nabla ∇) points directly along the path of steepest ascent of any multivariable scalar function."
        };
      }
      if (nameClean.includes('fourier') || nameClean.includes('frequency')) {
        return {
          question: "What mathematical transform is used to convert continuous temporal signal waves into distinct frequency spectrum values?",
          options: ["Laplace Transform", "Fourier Transform", "Z-Transform", "Taylor Expansion Series"],
          correctIdx: 1,
          aiExplanation: "Precisely! The Fourier Transform decomposes intricate mechanical, acoustic, or electrical waves into their base sinusoidal frequency vectors."
        };
      }
      if (nameClean.includes('linear algebra') || nameClean.includes('eigenspace')) {
        return {
          question: "What are the vectors that change only in scale (magnitude) but not direction during a linear transformation?",
          options: ["Orthogonal Basis Vectors", "Singular Vectors", "Eigenvectors", "Kernel Space Vectors"],
          correctIdx: 2,
          aiExplanation: "Correct! An eigenvector x under transformation matrix A satisfies Ax = λx, where λ is the scalar eigenvalue."
        };
      }
    }

    if (subjectId.includes('micro_robotics')) {
      if (nameClean.includes('gearbox') || nameClean.includes('gear')) {
        return {
          question: "If a motor's driving gear with 12 teeth meshes directly with a load gear with 36 teeth, what is the resulting gear ratio and torque multiplier?",
          options: ["1:3 ratio, 1/3x torque", "3:1 ratio, 3x torque", "1:4 ratio, 4x torque", "2:3 ratio, 1.5x torque"],
          correctIdx: 1,
          aiExplanation: "Correct! The gear ratio is calculated as driven teeth divided by driving teeth (36/12 = 3). This triples the torque capacity while reducing velocity to 1/3."
        };
      }
      if (nameClean.includes('scratch') || nameClean.includes('block')) {
        return {
          question: "Which block-programming component is used to execute hardware tasks repeatedly as long as a tactile switch is active?",
          options: ["If-Then condition block", "Forever repeat loop", "While conditional loop", "Set variable block"],
          correctIdx: 2,
          aiExplanation: "Spot on! The while loop repeatedly scans the digital value of the switch, executing code blocks exclusively when the conditional test returns high."
        };
      }
      if (nameClean.includes('proximity') || nameClean.includes('tracking')) {
        return {
          question: "What electromagnetic property does an infrared (IR) reflection sensor use to detect black floor paths?",
          options: ["Acoustic wave resonance", "Infrared light absorption/reflectance", "Ultrasonic echo flight-time", "Magnetic flux coefficients"],
          correctIdx: 1,
          aiExplanation: "Correct! Black surfaces absorb infrared light while white surfaces bounce it back, letting the transceiver trigger steering correction loops."
        };
      }
      if (nameClean.includes('c++') || nameClean.includes('arduino')) {
        return {
          question: "Which setup function in an Arduino microcontroller script executes exactly once when the device powers on?",
          options: ["loop()", "setup()", "main()", "init()"],
          correctIdx: 1,
          aiExplanation: "Exactly! setup() configures voltage input/output pins and serial rates once at power-up, and then loop() executes indefinitely."
        };
      }
      if (nameClean.includes('lidar') || nameClean.includes('gyro')) {
        return {
          question: "What physical measurements does a 6-axis gyroscope accelerometer node capture to maintain self-balancing robot torque?",
          options: ["Thermal expansion and lattice structures", "Angular velocity and linear acceleration", "Radio frequency signal dB levels", "Ambient atmospheric pressure"],
          correctIdx: 1,
          aiExplanation: "Correct! It continuously scans angular rotation rates and linear speed vectors to determine gravitational lean angles in real-time."
        };
      }
      if (nameClean.includes('esp32') || nameClean.includes('iot')) {
        return {
          question: "Which lightweight communication protocol is preferred for battery-powered IoT microcontrollers to stream sensor state metrics?",
          options: ["HTTP REST Client", "MQTT (Message Queuing Telemetry Transport)", "FTP Upload", "SMTP Client Link"],
          correctIdx: 1,
          aiExplanation: "Perfect! MQTT is a lightweight, low-overhead publish-subscribe model designed specifically for limited-bandwidth IoT networks."
        };
      }
      if (nameClean.includes('operating system') || nameClean.includes('ros')) {
        return {
          question: "In the Robot Operating System (ROS), what is the model used to dynamically exchange structured text messages among different nodes?",
          options: ["Client-Service calling", "Action Feedback logs", "Publisher-Subscriber on Topics", "Dynamic Reconfigure blocks"],
          correctIdx: 2,
          aiExplanation: "Correct! ROS nodes write messages to specified Topics (Publishers) which other nodes read concurrently (Subscribers)."
        };
      }
      if (nameClean.includes('kinematics') || nameClean.includes('joint')) {
        return {
          question: "What matrix system is used to mathematically translate and rotate joint coordinates of a robotic arm in 3D space?",
          options: ["Jacobian rate coordinates", "Homogeneous Transformation Matrix", "Eulerian Angle array", "Hermitian Operator"],
          correctIdx: 1,
          aiExplanation: "Outstanding! A 4x4 Homogeneous matrix integrates both 3D rotational matrices and translational vectors in unified algebra."
        };
      }
      if (nameClean.includes('slam') || nameClean.includes('navigation')) {
        return {
          question: "What navigational technique allows a robot to simultaneously build a map of an unknown environment and track its location within it?",
          options: ["Trilateral cell triangulation", "SLAM (Simultaneous Localization and Mapping)", "A* heuristic navigation", "PID loop calibration"],
          correctIdx: 1,
          aiExplanation: "Absolutely correct! SLAM coordinates laser range scanners (Lidar) or cameras to map the environment while pinpointing the robot's coordinates."
        };
      }
    }

    if (subjectId.includes('ai_cognition')) {
      if (nameClean.includes('classifier') || nameClean.includes('vision')) {
        return {
          question: "What is the primary benefit of applying artificial data augmentation (crops, flips, rotations) to image datasets?",
          options: ["Minimizing compute memory footprints", "Preventing model overfitting and boosting generalization", "Forcing all pixels to black-and-white", "Slowing down optimizer learning rates"],
          correctIdx: 1,
          aiExplanation: "Spot on! Data augmentation exposes the neural nodes to diverse orientations, teaching it to recognize shapes regardless of angle or position."
        };
      }
      if (nameClean.includes('regression') || nameClean.includes('vector')) {
        return {
          question: "Which loss function is minimized when training simple linear regression paths using gradient descent updates?",
          options: ["Mean Absolute Percentage Error", "Mean Squared Error (MSE)", "Cosine Similarity index", "Categorical Cross-Entropy"],
          correctIdx: 1,
          aiExplanation: "Excellent! MSE squares the distance residuals, disproportionately penalizing large outlier errors to quickly guide gradient descent pathways."
        };
      }
      if (nameClean.includes('minimax') || nameClean.includes('alpha-beta')) {
        return {
          question: "What is the primary function of Alpha-Beta pruning in recursive game decision trees?",
          options: ["To cap the maximum search depth permanently", "To skip evaluating sub-branches that are mathematically proven to be worse than already-explored options", "To add random noise to heuristic functions", "To train CNN models on game grids"],
          correctIdx: 1,
          aiExplanation: "Indeed! Pruning discards hopeless branches from exploration, allowing the decision logic to search twice as deep in real-time play."
        };
      }
      if (nameClean.includes('convolutional') || nameClean.includes('cnn')) {
        return {
          question: "What mathematical transformation takes a small kernel filter matrix and slides it across image pixels to extract edges?",
          options: ["Matrix Transposition", "2D Discrete Convolution", "Spatial Pooling Downsample", "Softmax Normalization"],
          correctIdx: 1,
          aiExplanation: "Correct! A convolution operation multiplies local sliding weights against image cells to extract features like edges and textures."
        };
      }
      if (nameClean.includes('transformer') || nameClean.includes('attention')) {
        return {
          question: "What mechanism allows Transformer neural networks to analyze context relations between distant tokens simultaneously?",
          options: ["Recurrent Feedback cells", "Self-Attention Mechanism", "Max-Pooling pipelines", "Convolutions arrays"],
          correctIdx: 1,
          aiExplanation: "Outstanding! Self-Attention maps vector correlations across all tokens in a text block, granting deep contextual grasp without sequential delay."
        };
      }
      if (nameClean.includes('reinforcement') || nameClean.includes('q-table')) {
        return {
          question: "Which mathematical equation calculates the temporal difference value updates inside offline Q-Learning agents?",
          options: ["Schrödinger Operator", "Bellman Optimality Equation", "Euler-Lagrange Equation", "Navier-Stokes equation"],
          correctIdx: 1,
          aiExplanation: "Precisely! The Bellman equation models the total expected reward as the current instant feedback plus the discounted maximum future utility."
        };
      }
    }

    if (subjectId.includes('quantum_phys')) {
      if (nameClean.includes('doping') || nameClean.includes('lattice')) {
        return {
          question: "What semiconductor charge type is established when pure silicon is doped with an element having five valence electrons (like Phosphorus)?",
          options: ["N-type (Negative free-electron carriers)", "P-type (Positive hole charge carriers)", "Intrinsic crystalline silicon", "Superconducting ceramic lattice"],
          correctIdx: 0,
          aiExplanation: "Exactly! The fifth valence electron is unbonded to the silicon lattice, easily exciting into the conduction band to form negative carriers."
        };
      }
      if (nameClean.includes('mosfet') || nameClean.includes('transistor')) {
        return {
          question: "What printing system is essential to carve sub-5nm transistor geometries on modern silicon wafers?",
          options: ["High-power ultrasonic printing", "Extreme Ultraviolet (EUV) lithography", "Electrochemical nano-spray", "Scanning electron microscopic etching"],
          correctIdx: 1,
          aiExplanation: "Correct! EUV light has a short wavelength of 13.5nm, allowing reflective mirror lenses to focus and pattern molecular transistor gates."
        };
      }
      if (nameClean.includes('logic') || nameClean.includes('universal')) {
        return {
          question: "Why is the NAND gate classified as a 'Universal logic gate' in computer architecture?",
          options: ["It functions at zero absolute Kelvin temperatures", "Any logical gate (AND, OR, NOT) can be constructed solely out of combinations of NAND gates", "It uses light photons instead of electrical voltages", "It contains zero transistor junctions"],
          correctIdx: 1,
          aiExplanation: "Splendid! NAND gates can recreate all boolean states (AND, OR, NOT, XOR), serving as the single building block of microprocessors."
        };
      }
      if (nameClean.includes('superposition') || nameClean.includes('qubit')) {
        return {
          question: "What quantum state does a qubit reside in before a physical measurement collapses its wave function?",
          options: ["An absolute classical 1 value", "A superposition of states existing as both 0 and 1 with specified probability amplitudes", "A purely static mechanical torque state", "A classical memory register value"],
          correctIdx: 1,
          aiExplanation: "Correct! Quantum qubits exist in a linear combination of states until measurement forces a collapse into a definitive classical bit."
        };
      }
      if (nameClean.includes('entanglement') || nameClean.includes('circuit')) {
        return {
          question: "Which quantum circuit gate is primarily deployed to entangle two independent qubits?",
          options: ["Hadamard split-phase gate", "Controlled-NOT (CNOT) gate", "Pauli-Z phase shifter", "Toffoli logical gate"],
          correctIdx: 1,
          aiExplanation: "Excellent! The CNOT gate acts conditionally: if the control qubit is 1, it flips the target qubit, establishing quantum entanglement."
        };
      }
      if (nameClean.includes('graphene') || nameClean.includes('nanotube')) {
        return {
          question: "Why are graphene carbon nanotubes researched as superior alternatives to traditional silicon for sub-1nm computing channels?",
          options: ["They act as complete insulators to electric currents", "They offer exceptional charge carrier mobility and atomic-scale thermal dissipation", "They can be grown easily on paper substrates", "They do not experience quantum tunneling issues"],
          correctIdx: 1,
          aiExplanation: "Spectacular! Graphene carbon nanotubes conduct electricity exceptionally well and avoid the atomic leakage and heating bounds of silicon."
        };
      }
    }

    if (subjectId.includes('bio_tech')) {
      if (nameClean.includes('dna') || nameClean.includes('sequence')) {
        return {
          question: "Which cellular component translates nucleotide sequences on mRNA strings into physical protein polypeptide chains?",
          options: ["Cell nucleus", "Ribosome", "Mitochondria", "Lysosome"],
          correctIdx: 1,
          aiExplanation: "Correct! Ribosomes read mRNA codons in triplets, matching them with tRNA anticodons to compile precise amino acid sequences."
        };
      }
      if (nameClean.includes('crispr') || nameClean.includes('cas9')) {
        return {
          question: "What is the primary role of the 'guide RNA' (gRNA) strand in CRISPR genetic engineering systems?",
          options: ["To physically slice the DNA strands", "To navigate the Cas9 endonuclease to a matching sequence address on target DNA", "To repair the cut DNA sequence", "To convert cells to synthetic proteins"],
          correctIdx: 1,
          aiExplanation: "Absolutely correct! The guide RNA is programmed to pair exactly with matching genomic base addresses, steering the Cas9 scissor enzyme."
        };
      }
      if (nameClean.includes('blast') || nameClean.includes('query')) {
        return {
          question: "What is the main utility of the BLAST algorithm in bioinformatic genetics?",
          options: ["To physically rewrite genetic material inside tubes", "To search sequence databases and align matching genes to evaluate evolutionary homology", "To predict physical protein structural bends via folding math", "To test rocket lift aerodynamics"],
          correctIdx: 1,
          aiExplanation: "Perfect! BLAST (Basic Local Alignment Search Tool) calculates sequence matching scores, identifying related genetic strings across database records."
        };
      }
    }

    if (subjectId.includes('space_rocketry')) {
      if (nameClean.includes('aerodynamics') || nameClean.includes('wing')) {
        return {
          question: "What aerodynamic boundary transition occurs when a vehicle's fluid speed exceeds the critical Reynolds number threshold?",
          options: ["The boundary layer transitions from laminar to turbulent flow", "Gravity pull drops to exactly zero", "Wings experience full thermal compression failures", "The aerodynamic lift coefficient drops to negative infinity"],
          correctIdx: 0,
          aiExplanation: "Splendid! Beyond critical Reynolds numbers, inertial forces dominate viscous forces, triggering turbulent micro-eddies."
        };
      }
      if (nameClean.includes('propulsion') || nameClean.includes('nozzle')) {
        return {
          question: "Why do chemical rocket engines utilize a converging-diverging De Laval nozzle shape?",
          options: ["To drop fuel combustion chamber temperatures", "To accelerate hot exhaust gases from subsonic speeds to supersonic velocities", "To stabilize flight roll oscillations", "To store oxidizer feeds"],
          correctIdx: 1,
          aiExplanation: "Superb! The convergent neck chokes exhaust gases to Mach 1, and the divergent body expands gases supersonic, maximizing specific impulse."
        };
      }
      if (nameClean.includes('ballistics') || nameClean.includes('orbit')) {
        return {
          question: "Which coplanar maneuver uses two rocket burns to transfer a satellite between two circular orbits of different altitudes with minimum fuel?",
          options: ["Bi-elliptic flyby", "Hohmann Transfer Orbit", "Keplerian Slingshot", "Lagrange Coordinate Drift"],
          correctIdx: 1,
          aiExplanation: "Correct! The Hohmann Transfer Orbit is the most fuel-efficient trajectory to migrate satellites between coplanar circular altitudes."
        };
      }
    }
  }

  // Fallback for school syllabi (odia, cbse, icse) based on keywords in chapter names
  if (nameClean.includes("equation") || nameClean.includes("algebra") || nameClean.includes("math") || nameClean.includes("arithmetic") || nameClean.includes("matrix")) {
    return {
      question: `Which mathematical procedure is central to finding coordinate intersection points in the algebra chapter: "${chapterName}"?`,
      options: [
        "Solving equations through substitution, elimination, or matrix determinants",
        "Measuring the gravity constant on high mountains",
        "Tracing magnetic field lines on a flat surface",
        "Decoding binary text using logic gate arrays"
      ],
      correctIdx: 0,
      aiExplanation: `Great job! Under Class ${classNum} mathematical standards, algebraic balance is resolved by substitution, elimination, or determinants (like Cramer's rule) to find system coordinates.`
    };
  }

  if (nameClean.includes("force") || nameClean.includes("energy") || nameClean.includes("physics") || nameClean.includes("light") || nameClean.includes("sound") || nameClean.includes("electricity") || nameClean.includes("circuit")) {
    return {
      question: `Which core physical law states that the total energy in an isolated system remains constant over time?`,
      options: [
        "First Law of Thermodynamics (Law of Conservation of Energy)",
        "Ohm's Law of Electrical Resistances (V=IR)",
        "Kepler's Second Law of Orbit Speeds",
        "Pascal's Law of Hydraulic Liquid Pressures"
      ],
      correctIdx: 0,
      aiExplanation: `Correct! The Conservation of Energy law guarantees that energy inside a closed system cannot be created or destroyed, only transformed from one form to another.`
    };
  }

  if (nameClean.includes("life") || nameClean.includes("cell") || nameClean.includes("bio") || nameClean.includes("plant") || nameClean.includes("animal") || nameClean.includes("genetics")) {
    return {
      question: `What biological structure is considered the basic building block and fundamental unit of life in all organisms?`,
      options: [
        "The Cell",
        "The Molecule",
        "The Mitochondrion",
        "The DNA Double-Helix"
      ],
      correctIdx: 0,
      aiExplanation: `Precisely! The cell is the smallest biological structure capable of self-replication and performing essential life processes.`
    };
  }

  // General fallback question
  return {
    question: `To master the learning goals of "${chapterName}" in Class ${classNum} under the ${board.toUpperCase()} syllabus, which approach is most effective?`,
    options: [
      "Memorizing text strings without practicing active problems",
      "Active recall, testing concepts with quizzes, and practicing homework problems",
      "Cramming the night before using guess papers",
      "Skipping core fundamentals to directly study post-graduate materials"
    ],
    correctIdx: 1,
    aiExplanation: `Correct! Conceptual clarity combined with active retrieval practice and self-testing guarantees deep retention and ultimate academic excellence.`
  };
}

export default function SchoolSyllabusPage() {
  const [activeBoard, setActiveBoard] = useState<'odia' | 'cbse' | 'icse' | 'china2070'>('odia');
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [expandedChapterName, setExpandedChapterName] = useState<string | null>(null);
  const [completedChapters, setCompletedChapters] = useState<{ [key: string]: boolean }>({});
  
  // Quiz and Reward states
  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('arohi_academic_points');
    return saved ? parseInt(saved, 10) : 350;
  });

  const [passedQuizzes, setPassedQuizzes] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem('school_passed_quizzes');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [submittedQuizChapters, setSubmittedQuizChapters] = useState<{ [key: string]: boolean }>({});
  const [quizAIFeedbacks, setQuizAIFeedbacks] = useState<{ [key: string]: string }>({});
  const [showPointsPopup, setShowPointsPopup] = useState<{ [key: string]: boolean }>({});

  const handleSelectQuizOption = (chapterName: string, optionIdx: number) => {
    const key = `${activeBoard}-${selectedClass}-${chapterName}`;
    setSelectedAnswers(prev => ({ ...prev, [key]: optionIdx }));
  };

  const handleSubmitQuiz = (chapterName: string, correctIdx: number, explanationText: string) => {
    const key = `${activeBoard}-${selectedClass}-${chapterName}`;
    const selectedIdx = selectedAnswers[key];
    if (selectedIdx === undefined) return;

    setSubmittedQuizChapters(prev => ({ ...prev, [key]: true }));
    
    const isCorrect = selectedIdx === correctIdx;
    
    // Custom simulated AI feedback with direct conversational flavor
    let aiFeedback = '';
    if (isCorrect) {
      aiFeedback = `🤖 AROHI EVALUATOR: ${explanationText} Splendidly executed! You have grasped the core mechanisms of this chapter perfectly. Keep up this momentum!`;
      
      // If not already passed, reward +50 Points!
      if (!passedQuizzes[key]) {
        const updatedQuizzes = { ...passedQuizzes, [key]: true };
        setPassedQuizzes(updatedQuizzes);
        localStorage.setItem('school_passed_quizzes', JSON.stringify(updatedQuizzes));
        
        const newPoints = userPoints + 50;
        setUserPoints(newPoints);
        localStorage.setItem('arohi_academic_points', newPoints.toString());

        // Trigger floating popup animation state
        setShowPointsPopup(prev => ({ ...prev, [key]: true }));
        setTimeout(() => {
          setShowPointsPopup(prev => ({ ...prev, [key]: false }));
        }, 3000);

        // Auto mark chapter completed!
        if (!completedChapters[key]) {
          const updatedChapters = { ...completedChapters, [key]: true };
          setCompletedChapters(updatedChapters);
          localStorage.setItem('school_completed_chapters', JSON.stringify(updatedChapters));
        }
      }
    } else {
      aiFeedback = `🤖 AROHI EVALUATOR: Ah, that is not quite correct. But do not worry! Studying is an iterative feedback loop. Let's think: the concepts require precise structural balancing. Give it another thought and review the topics above, then try again!`;
    }

    setQuizAIFeedbacks(prev => ({ ...prev, [key]: aiFeedback }));
  };

  const handleResetQuiz = (chapterName: string) => {
    const key = `${activeBoard}-${selectedClass}-${chapterName}`;
    setSelectedAnswers(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setSubmittedQuizChapters(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setQuizAIFeedbacks(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };
  
  // Arohi AI Student Tutor Simulator
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiAnswers, setAiAnswers] = useState<Array<{ q: string; a: string; time: string }>>([
    {
      q: 'Explain the weightage of BSE Odisha Class 10 Algebra chapters.',
      a: 'In BSE Odisha Class 10, the Mathematics (Ganita) syllabus allocates around 12 Marks to Linear Equations (ସରଳ ସହସମୀକରଣ), 12 Marks to Quadratic Equations (ଦ୍ଵିଘାତ ସମୀକରଣ), and 10 Marks to Arithmetic Progression (ସମାନ୍ତର ପ୍ରଗତି). Prepare these carefully for maximum scoring!',
      time: 'Just now'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Initialize first subject
  useEffect(() => {
    const subjects = SYLLABUS_DATA[activeBoard][selectedClass] || [];
    if (subjects.length > 0) {
      setActiveSubjectId(subjects[0].id);
    } else {
      setActiveSubjectId(null);
    }
    setExpandedChapterName(null);
  }, [activeBoard, selectedClass]);

  // Load completion status from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('school_completed_chapters');
    if (saved) {
      try {
        setCompletedChapters(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleChapterComplete = (chapterName: string) => {
    const updated = {
      ...completedChapters,
      [`${activeBoard}-${selectedClass}-${chapterName}`]: !completedChapters[`${activeBoard}-${selectedClass}-${chapterName}`]
    };
    setCompletedChapters(updated);
    localStorage.setItem('school_completed_chapters', JSON.stringify(updated));
  };

  const handleAskArohi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    const userQ = aiPrompt;
    setAiPrompt('');

    setTimeout(() => {
      let answerText = '';
      if (userQ.toLowerCase().includes('odia') || userQ.toLowerCase().includes('odisha') || userQ.toLowerCase().includes('bse')) {
        answerText = `ପ୍ରଣାମ! Regarding BSE Odisha Class ${selectedClass} curriculum, the key chapters focus deeply on classical literature, regional heritage, and robust mathematical logic. Make sure to complete the matriculation sample blueprints and practice the ଉପପାଦ୍ୟ (theorems) which carry high marks in standard BSE board papers.`;
      } else if (userQ.toLowerCase().includes('cbse') || userQ.toLowerCase().includes('ncert')) {
        answerText = `Hello student! For the CBSE Class ${selectedClass} board, standard NCERT textbooks are your primary bible. CBSE strictly tests conceptual understanding based on the latest board notification circulars. Make sure to complete standard NCERT exemplars and double-check key marking schemes.`;
      } else if (userQ.toLowerCase().includes('icse') || userQ.toLowerCase().includes('selina')) {
        answerText = `Greetings! ICSE Class ${selectedClass} follows a highly detailed, comprehensive curriculum which requires deep descriptive writing. Selina Concise textbooks and previous 10-year board questions are essential resources for score maximization. Practice mechanical force equations and standard commercial arithmetic (GST) regularly.`;
      } else if (userQ.toLowerCase().includes('arohi') || userQ.toLowerCase().includes('2070') || userQ.toLowerCase().includes('elite') || userQ.toLowerCase().includes('future')) {
        answerText = `Greetings! The 'Arohi 2070 Super Elite' curriculum is designed for hyper-accelerated learning: mental abacus computation from Class 1, real microcontroller C++ systems from Class 3, Machine Learning & CNN model building from Class 5, and Quantum physics, Semiconductor gate architectures, CRISPR molecular gene editing, and Aerospace orbital ballistics by Class 8. These courses prepare students to build, code, and lead the future mainstream tech economy!`;
      } else {
        answerText = `Hello! I have scanned the current curriculum for Board: ${activeBoard.toUpperCase()} (Class ${selectedClass}). To excel in your studies, create structured flashcards, resolve chapter-end textbook questions, and use our Study Planner checklists below. How else can I help you master your classes?`;
      }

      setAiAnswers(prev => [
        { q: userQ, a: answerText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev
      ]);
      setIsGenerating(false);
    }, 1200);
  };

  const currentSubjects = SYLLABUS_DATA[activeBoard][selectedClass] || [];
  
  const filteredSubjects = currentSubjects.filter(sub => {
    const q = searchQuery.toLowerCase();
    return sub.name.toLowerCase().includes(q) || (sub.odiaName && sub.odiaName.toLowerCase().includes(q));
  });

  const activeSubject = filteredSubjects.find(sub => sub.id === activeSubjectId) || filteredSubjects[0] || null;

  // Calculate syllabus completion percentage for the current subject
  const calculateProgress = (subject: Subject) => {
    if (!subject || subject.chapters.length === 0) return 0;
    const completedCount = subject.chapters.filter(ch => 
      completedChapters[`${activeBoard}-${selectedClass}-${ch.name}`]
    ).length;
    return Math.round((completedCount / subject.chapters.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#070510] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12 relative overflow-hidden" id="school-syllabus-root">
      
      {/* Decorative Ornaments - Odyssey Glow */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[180px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Top Feature Banner */}
        <div className="bg-gradient-to-r from-[#17113a] via-[#120a2e] to-[#1d1246] rounded-3xl border border-[#2d1b64] p-6 sm:p-10 shadow-[0_4px_30px_rgba(124,58,237,0.15)] relative overflow-hidden">
          
          {/* Accent Ribbon */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[9px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-violet-400/30 shadow-lg animate-pulse">
            ✨ SUPER SPECIAL PAGE
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-[#a78bfa] text-xs font-black uppercase tracking-wider">
                <GraduationCap className="w-5 h-5" />
                <span>Odisha & National Academic Renaissance Portal</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                Class 1–10 Curriculum <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-[#00e676]">Syllabus Courses</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Discover complete structural syllabi mapped exactly to <span className="text-white font-bold">BSE Odisha</span>, <span className="text-white font-bold">CBSE Board</span>, <span className="text-white font-bold">ICSE Board</span>, and the revolutionary <span className="text-emerald-400 font-extrabold animate-pulse">Arohi 2070 Super Elite Track</span>. Track chapter accomplishments, get mock textbooks, and consult our AI Academic Tutor instantly.
              </p>
            </div>

            {/* Quick Stats & Rewards Grid */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="grid grid-cols-4 gap-2 w-full lg:w-auto shrink-0">
                <div className="bg-[#090618]/80 p-3 rounded-2xl border border-[#2b1b64] text-center min-w-[70px]">
                  <span className="block text-lg font-black text-[#00e676]">BSE</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Odisha</span>
                </div>
                <div className="bg-[#090618]/80 p-3 rounded-2xl border border-[#2b1b64] text-center min-w-[70px]">
                  <span className="block text-lg font-black text-violet-400">CBSE</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">All India</span>
                </div>
                <div className="bg-[#090618]/80 p-3 rounded-2xl border border-[#2b1b64] text-center min-w-[70px]">
                  <span className="block text-lg font-black text-blue-400">ICSE</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">CISCE</span>
                </div>
                <div className="bg-[#0f1b14] p-3 rounded-2xl border border-emerald-500/20 text-center animate-pulse min-w-[70px]">
                  <span className="block text-lg font-black text-emerald-400">2070</span>
                  <span className="text-[8px] text-emerald-300 font-bold uppercase tracking-wider">Elite Tech</span>
                </div>
              </div>

              {/* IQ Reward Points Box */}
              <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/40 rounded-2xl p-3 shadow-lg shrink-0 w-full sm:w-auto">
                <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-400/30">
                  <Flame className="w-5 h-5 text-emerald-400 animate-bounce" />
                </div>
                <div>
                  <span className="block text-[8px] text-emerald-400 font-black uppercase tracking-widest leading-none">Your IQ Score</span>
                  <span className="text-lg font-black text-white leading-none">{userPoints} <span className="text-xs text-emerald-400 font-bold">PTS</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Board & Class Navigation Filters */}
        <div className="bg-[#0c0922] rounded-3xl border border-[#211b3d] p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-[#211b3d] pb-6">
            
            {/* Board Selector Tabs */}
            <div className="grid grid-cols-2 md:flex bg-[#070510] rounded-2xl p-1.5 border border-[#211b3d] w-full md:w-auto gap-1.5 md:gap-0">
              <button
                onClick={() => setActiveBoard('odia')}
                className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeBoard === 'odia'
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>BSE Odisha</span>
              </button>
              <button
                onClick={() => setActiveBoard('cbse')}
                className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeBoard === 'cbse'
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>CBSE India</span>
              </button>
              <button
                onClick={() => setActiveBoard('icse')}
                className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                  activeBoard === 'icse'
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>ICSE Board</span>
              </button>
              <button
                onClick={() => setActiveBoard('china2070')}
                className={`flex-1 md:flex-none px-3 md:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 relative ${
                  activeBoard === 'china2070'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 border border-emerald-400'
                    : 'text-emerald-400/90 hover:text-white border border-emerald-500/20 bg-emerald-500/5'
                }`}
              >
                <Bot className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Arohi 2070 Super Elite</span>
                <span className="sm:hidden">2070 Elite</span>
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[7px] uppercase px-1 py-0.5 rounded-full leading-none scale-90">
                  NEW
                </span>
              </button>
            </div>

            {/* Search Input Box */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search subjects or chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#070510] border border-[#211b3d] hover:border-[#3d326f] focus:border-purple-500 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 font-semibold focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Elegant Horizontal Class Filter Grid */}
          <div className="space-y-3">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block">Select Your Class / Standard</span>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedClass(num)}
                  className={`py-3 rounded-2xl text-xs font-black transition-all cursor-pointer border ${
                    selectedClass === num
                      ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-violet-400 shadow-[0_0_12px_rgba(124,58,237,0.3)] scale-105'
                      : 'bg-[#070510] text-slate-400 border-[#211b3d] hover:border-[#382b75] hover:text-white'
                  }`}
                >
                  <span className="block text-[8px] opacity-65 font-bold uppercase">Class</span>
                  <span className="text-base font-black">{num}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Layout Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Subject Lists Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0c0922] rounded-3xl border border-[#211b3d] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#211b3d] pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">
                  Subjects ({filteredSubjects.length})
                </h3>
                <span className="bg-[#7c3aed]/20 text-violet-300 text-[9px] font-black px-2 py-0.5 rounded-full border border-violet-500/20 uppercase">
                  Class {selectedClass}
                </span>
              </div>

              {filteredSubjects.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs text-slate-400 font-bold">No subjects match search</p>
                  <button onClick={() => setSearchQuery('')} className="text-[10px] text-violet-400 hover:underline">
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {filteredSubjects.map((sub) => {
                    const isSel = activeSubjectId === sub.id || (!activeSubjectId && activeSubject && activeSubject.id === sub.id);
                    const progress = calculateProgress(sub);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveSubjectId(sub.id);
                          setExpandedChapterName(null);
                        }}
                        className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between gap-4 cursor-pointer group ${
                          isSel
                            ? 'bg-[#18113c] border-[#5e41b9] shadow-md'
                            : 'bg-[#080514] border-[#1d1738] hover:border-[#362a6e] hover:bg-[#0c0920]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                            {sub.icon}
                          </span>
                          <div className="space-y-1">
                            {sub.odiaName && (
                              <h4 className="text-xs font-black text-emerald-400 leading-tight">
                                {sub.odiaName}
                              </h4>
                            )}
                            <h5 className="text-[11px] font-bold text-white leading-tight">
                              {sub.name}
                            </h5>
                            <span className="text-[9px] text-slate-400 block font-semibold">
                              {sub.chapters.length} Curriculum Units
                            </span>
                          </div>
                        </div>

                        {/* Progress radial display or checklist bar */}
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="text-[9px] font-black text-slate-400">
                            {progress}%
                          </span>
                          <div className="w-12 bg-slate-900 rounded-full h-1 overflow-hidden border border-slate-800">
                            <div 
                              className="bg-[#00e676] h-1 rounded-full transition-all duration-300" 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Tutor Chat Box specifically for this Board & Class */}
            <div className="bg-gradient-to-b from-[#110c2c] to-[#0a071d] rounded-3xl border border-[#261750] p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Arohi Syllabus AI-Tutor</h4>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">24/7 Homework Assistance</span>
                </div>
              </div>

              {/* Chat Log Panel */}
              <div className="bg-[#080515] border border-[#211840] rounded-2xl p-3 max-h-[220px] overflow-y-auto space-y-3">
                {aiAnswers.map((answer, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-[10px] text-slate-300 bg-[#161036] px-2.5 py-1.5 rounded-xl border border-slate-800 font-medium">
                      <span className="text-violet-400 font-bold block mb-0.5 text-[8px]">YOU ASKED:</span>
                      {answer.q}
                    </p>
                    <p className="text-[10px] text-[#00e676] bg-[#071911]/80 px-2.5 py-1.5 rounded-xl border border-emerald-950/40 font-medium">
                      <span className="text-emerald-400 font-bold block mb-0.5 text-[8px]">AROHI REPLY:</span>
                      {answer.a}
                    </p>
                  </div>
                ))}
              </div>

              {/* Submit Input */}
              <form onSubmit={handleAskArohi} className="relative">
                <input
                  type="text"
                  placeholder={`Ask Arohi about Class ${selectedClass} ${activeBoard.toUpperCase()} Syllabus...`}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  disabled={isGenerating}
                  className="w-full bg-[#080515] border border-[#221743] hover:border-violet-500 rounded-xl py-2 pl-3 pr-10 text-[10px] text-white focus:outline-none focus:border-violet-600 placeholder-slate-500 font-semibold disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="absolute inset-y-1.5 right-1.5 bg-violet-600 hover:bg-violet-500 text-white px-2.5 rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 text-[9px] font-black uppercase disabled:opacity-50"
                >
                  {isGenerating ? '...' : 'Ask'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Syllabus Detail Viewer */}
          <div className="lg:col-span-8 space-y-6">
            {activeSubject ? (
              <div className="space-y-6">
                
                {/* Subject Header */}
                <div className="bg-[#0c0922] rounded-3xl border border-[#211b3d] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-4">
                    <span className="text-4xl sm:text-5xl bg-[#1c1444] p-3 rounded-2xl border border-[#372675]">
                      {activeSubject.icon}
                    </span>
                    <div className="space-y-1">
                      {activeSubject.odiaName && (
                        <h2 className="text-lg sm:text-2xl font-black text-[#00e676] tracking-tight">
                          {activeSubject.odiaName}
                        </h2>
                      )}
                      <h3 className="text-sm sm:text-lg font-black text-white">
                        {activeSubject.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        Board: {activeBoard.toUpperCase()} • Class {selectedClass} Curriculum
                      </p>
                    </div>
                  </div>

                  {/* Subject Overall Progress Stats */}
                  <div className="text-left sm:text-right space-y-1 shrink-0 w-full sm:w-auto bg-[#070510] sm:bg-transparent p-3 sm:p-0 rounded-2xl border border-[#211b3d] sm:border-none">
                    <span className="text-[9px] text-slate-400 font-black uppercase block tracking-wider">Subject Progress</span>
                    <span className="text-xl font-black text-[#00e676]">
                      {calculateProgress(activeSubject)}% Complete
                    </span>
                    <span className="block text-[9px] text-slate-500 font-bold">
                      {activeSubject.chapters.filter(ch => completedChapters[`${activeBoard}-${selectedClass}-${ch.name}`]).length} / {activeSubject.chapters.length} units checked
                    </span>
                  </div>
                </div>

                {/* Sub-Tabs: Chapter Breakdown Accordion */}
                <div className="bg-[#0c0922] rounded-3xl border border-[#211b3d] p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-[#211b3d] pb-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="text-[#8a70f5] w-5 h-5 shrink-0" />
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                        Course Units & Syllabus Chapters
                      </h4>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Interactive Accordion
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeSubject.chapters.map((chapter, cIdx) => {
                      const isCompleted = completedChapters[`${activeBoard}-${selectedClass}-${chapter.name}`];
                      const isExpanded = expandedChapterName === chapter.name;

                      return (
                        <div 
                          key={cIdx}
                          className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                            isCompleted 
                              ? 'bg-[#0d161a] border-[#00e676]/30' 
                              : isExpanded 
                                ? 'bg-[#15103a] border-[#6849ca]' 
                                : 'bg-[#080515] border-[#221845] hover:border-[#342765]'
                          }`}
                        >
                          {/* Chapter Accordion Trigger */}
                          <div className="flex justify-between items-center px-4 py-3 sm:px-5 cursor-pointer select-none">
                            <div 
                              onClick={() => setExpandedChapterName(isExpanded ? null : chapter.name)}
                              className="flex items-center gap-3.5 flex-1 py-1"
                            >
                              <span className="text-[10px] font-black text-[#a78bfa] bg-[#1a113d] border border-[#2b1f5c] px-2.5 py-1 rounded-xl shrink-0">
                                Unit {cIdx + 1}
                              </span>
                              <div className="space-y-0.5">
                                <h5 className="text-[11px] sm:text-xs font-black text-white leading-tight">
                                  {chapter.name}
                                </h5>
                                <span className="inline-flex items-center gap-1.5 text-[9px] text-[#00e676] font-bold">
                                  <Star className="w-3 h-3 fill-[#00e676]" /> {chapter.weightage} Weightage
                                </span>
                              </div>
                            </div>

                            {/* Actions Right Side */}
                            <div className="flex items-center gap-3 shrink-0">
                              <button
                                onClick={() => toggleChapterComplete(chapter.name)}
                                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                                  isCompleted
                                    ? 'bg-[#00e676]/15 border-[#00e676] text-[#00e676]'
                                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
                                }`}
                                title={isCompleted ? "Mark Uncompleted" : "Mark Completed"}
                              >
                                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                <span className="hidden sm:inline">
                                  {isCompleted ? 'Checked' : 'Complete'}
                                </span>
                              </button>

                              <button
                                onClick={() => setExpandedChapterName(isExpanded ? null : chapter.name)}
                                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="border-t border-[#1f173f] bg-[#070512] p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
                              <div className="space-y-1.5">
                                <span className="text-[8px] text-[#8a70f5] font-black uppercase tracking-wider block">Unit Summary</span>
                                <p className="text-[10px] sm:text-xs text-slate-300 font-semibold leading-relaxed">
                                  {chapter.description}
                                </p>
                              </div>

                              {/* Topic-by-Topic Gist & Fundamental Clarity Section */}
                              <div className="space-y-3">
                                <span className="text-[8px] text-emerald-400 font-black uppercase tracking-wider block">Topic-by-Topic Gist & Fundamental Clarity</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {chapter.topics.map((topic, tIdx) => {
                                    const { gist, clarity } = getTopicEducationalData(activeBoard, activeSubject.id, chapter.name, topic);
                                    return (
                                      <div key={tIdx} className="bg-[#110c28] border border-[#221b47] hover:border-violet-500/50 rounded-2xl p-4 transition-all space-y-2.5 flex flex-col justify-between">
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2 min-w-0">
                                              <span className="w-2 h-2 rounded-full bg-[#00e676] shrink-0 animate-pulse" />
                                              <h6 className="text-[11px] sm:text-xs font-black text-white truncate">
                                                {topic}
                                              </h6>
                                            </div>
                                            <span className="bg-violet-500/10 text-violet-300 text-[8px] font-black px-2 py-0.5 rounded border border-violet-500/25 uppercase shrink-0">
                                              Topic {tIdx + 1}
                                            </span>
                                          </div>

                                          <div className="space-y-2 text-[10px] sm:text-xs text-slate-300 leading-relaxed font-semibold">
                                            <div className="bg-[#1a133d]/40 border-l-2 border-purple-500 pl-2.5 py-1 text-slate-200 rounded-r-lg">
                                              <span className="text-[8px] text-purple-400 font-black uppercase tracking-wider block mb-0.5">The Gist:</span>
                                              {gist}
                                            </div>
                                            <div className="pl-3 py-1 text-slate-300 border-l border-emerald-500/20 bg-emerald-500/[0.01]">
                                              <span className="text-[8px] text-emerald-400 font-black uppercase tracking-wider block mb-0.5">Fundamental Clarity:</span>
                                              {clarity}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Interactive Quiz Module */}
                              {(() => {
                                const quiz = getChapterQuiz(activeBoard, activeSubject.id, selectedClass, chapter.name);
                                const quizKey = `${activeBoard}-${selectedClass}-${chapter.name}`;
                                const isSubmitted = submittedQuizChapters[quizKey];
                                const currentSelected = selectedAnswers[quizKey];
                                const isPassed = passedQuizzes[quizKey];
                                const feedback = quizAIFeedbacks[quizKey];
                                const showPopup = showPointsPopup[quizKey];

                                return (
                                  <div className="mt-5 pt-5 border-t border-[#1d173d] space-y-4 font-sans">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                        <span className="text-[9px] text-amber-300 font-black uppercase tracking-wider block">
                                          AROHI CHAPTER ASSESSMENT
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-1.5 bg-[#121c16] border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                                        <Award className="w-3.5 h-3.5 text-[#00e676]" />
                                        <span className="text-[9px] font-black text-[#00e676] tracking-wider uppercase">
                                          {isPassed ? 'QUIZ COMPLETED (+50 XP)' : 'WIN +50 REWARD PTS'}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="bg-[#0b081e] border border-[#231b4d] rounded-2xl p-4 space-y-4 relative">
                                      {/* Float Success Reward Pop */}
                                      {showPopup && (
                                        <div className="absolute inset-0 bg-[#061c11]/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center space-y-2 animate-in fade-in zoom-in duration-300 z-10">
                                          <div className="bg-emerald-500/20 p-3 rounded-full border border-emerald-400/40">
                                            <Flame className="w-8 h-8 text-[#00e676] animate-bounce" />
                                          </div>
                                          <span className="text-xl font-black text-white tracking-tight block">
                                            +50 REWARD POINTS!
                                          </span>
                                          <p className="text-[10px] text-[#00e676] font-bold uppercase tracking-wider">
                                            IQ Level Boosted Successfully 🎉
                                          </p>
                                        </div>
                                      )}

                                      {/* Question */}
                                      <div className="space-y-1">
                                        <span className="text-[9px] text-slate-400 font-bold uppercase">Question:</span>
                                        <p className="text-xs text-white font-extrabold leading-relaxed">
                                          {quiz.question}
                                        </p>
                                      </div>

                                      {/* Options */}
                                      <div className="grid grid-cols-1 gap-2">
                                        {quiz.options.map((option, oIdx) => {
                                          const isChosen = currentSelected === oIdx;
                                          const showCorrect = isSubmitted && oIdx === quiz.correctIdx;
                                          const showWrong = isSubmitted && isChosen && oIdx !== quiz.correctIdx;
                                          
                                          return (
                                            <button
                                              key={oIdx}
                                              disabled={isSubmitted && !isPassed}
                                              onClick={() => handleSelectQuizOption(chapter.name, oIdx)}
                                              className={`w-full text-left px-3.5 py-3 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-between cursor-pointer ${
                                                showCorrect
                                                  ? 'bg-emerald-950/40 border-[#00e676] text-white shadow-[0_0_12px_rgba(0,230,118,0.15)]'
                                                  : showWrong
                                                    ? 'bg-rose-950/40 border-rose-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.15)]'
                                                    : isChosen
                                                      ? 'bg-[#1e164e] border-[#7c3aed] text-white'
                                                      : 'bg-[#0f0b27] border-[#22184d] text-slate-300 hover:bg-[#150f38] hover:border-[#38287e]'
                                              }`}
                                            >
                                              <span>{option}</span>
                                              {isChosen && !isSubmitted && (
                                                <span className="w-2 h-2 rounded-full bg-[#7c3aed] shadow-[0_0_6px_#7c3aed]"></span>
                                              )}
                                              {showCorrect && (
                                                <span className="text-[#00e676] text-[10px] font-black uppercase">Correct</span>
                                              )}
                                              {showWrong && (
                                                <span className="text-rose-400 text-[10px] font-black uppercase">Incorrect</span>
                                              )}
                                            </button>
                                          );
                                        })}
                                      </div>

                                      {/* Action Buttons & Feedback */}
                                      <div className="space-y-3 pt-1">
                                        {/* Feedback box */}
                                        {feedback && (
                                          <div className={`p-3 rounded-xl border text-[10px] font-bold leading-relaxed ${
                                            isSubmitted && currentSelected === quiz.correctIdx
                                              ? 'bg-[#071911]/80 border-emerald-500/30 text-emerald-300'
                                              : 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                                          }`}>
                                            {feedback}
                                          </div>
                                        )}

                                        <div className="flex gap-2">
                                          {!isSubmitted ? (
                                            <button
                                              disabled={currentSelected === undefined}
                                              onClick={() => handleSubmitQuiz(chapter.name, quiz.correctIdx, quiz.aiExplanation)}
                                              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                                currentSelected !== undefined
                                                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md'
                                                  : 'bg-[#15112e] border border-[#231b4e] text-slate-500 cursor-not-allowed'
                                              }`}
                                            >
                                              <span>Submit Assessment</span>
                                              <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                          ) : (
                                            <button
                                              onClick={() => handleResetQuiz(chapter.name)}
                                              className="flex-1 bg-[#1a133d] hover:bg-[#251b54] border border-[#2e2168] text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                              <span>Try Another Option</span>
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Free Resource Library Download Area */}
                <div className="bg-[#0c0922] rounded-3xl border border-[#211b3d] p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#211b3d] pb-3">
                    <Download className="w-4 h-4 text-violet-400 shrink-0" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                      Free Textbooks & Model Papers (PDF)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeSubject.resources.map((res, index) => (
                      <div 
                        key={index} 
                        className="bg-[#080515] border border-[#1a1332] hover:border-violet-500/40 p-4 rounded-2xl flex justify-between items-center gap-4 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">📂</span>
                          <div className="space-y-0.5">
                            <h5 className="text-[10px] font-black text-white leading-tight">{res}</h5>
                            <span className="text-[8px] text-slate-500 font-bold block uppercase">Official Reference Material</span>
                          </div>
                        </div>

                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Initializing download for: "${res}" reference packet in PDF format.`);
                          }}
                          className="bg-violet-600/10 hover:bg-violet-600 border border-violet-500/20 hover:border-violet-400 text-violet-400 hover:text-white p-2 rounded-xl transition-all active:scale-95 text-xs font-black flex items-center justify-center cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-[#0c0922] rounded-3xl border border-[#211b3d] py-16 px-4 text-center space-y-4">
                <p className="text-xs text-slate-400 font-bold">Select a subject from the sidebar to view full chapters.</p>
              </div>
            )}
          </div>

        </div>

        {/* Dynamic Study Plan Checklist Section */}
        <div className="bg-gradient-to-r from-[#17113a] to-[#0d0923] rounded-3xl border border-[#251854] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#211b3d] pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Your Dynamic Syllabus Checklist</h3>
              <p className="text-[10px] text-slate-400 font-medium">Any chapter marked checked is synchronized to your browser local store to visualize progress.</p>
            </div>
            
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all checked chapters progress?")) {
                  setCompletedChapters({});
                  localStorage.removeItem('school_completed_chapters');
                }
              }}
              className="text-[9px] font-black uppercase tracking-wider border border-red-500/30 hover:border-red-500 bg-red-500/5 hover:bg-red-500/10 text-red-400 px-3 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
            >
              Reset All Progress
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(completedChapters).length === 0 ? (
              <div className="col-span-full py-8 text-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                No checked chapters yet. Go ahead and study units to check them!
              </div>
            ) : (
              Object.keys(completedChapters).map((key) => {
                if (!completedChapters[key]) return null;
                const parts = key.split('-');
                const board = parts[0]?.toUpperCase();
                const standard = parts[1];
                const chName = parts.slice(2).join('-');
                return (
                  <div key={key} className="bg-[#0a071d] border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[8px] text-[#00e676] bg-[#00e676]/10 px-1.5 py-0.5 rounded font-black uppercase shrink-0 mr-1.5">
                        {board} {standard}
                      </span>
                      <p className="text-[10px] font-bold text-white truncate">{chName}</p>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = { ...completedChapters, [key]: false };
                        setCompletedChapters(updated);
                        localStorage.setItem('school_completed_chapters', JSON.stringify(updated));
                      }}
                      className="text-red-400 hover:text-red-300 text-[10px] cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
