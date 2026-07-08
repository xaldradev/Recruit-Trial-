import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: number;
  name: string;
  city: string;
  service: string;
  emoji: string;
  timeAgo: string;
}

const ODIA_NAMES = [
  'Priyanath', 'Subhashree', 'Ansuman', 'Sujata', 'Debasish', 
  'Madhusmita', 'Chinmayee', 'Jyotiranjan', 'Biswajit', 'Lipsa', 
  'Swarnalata', 'Sambit', 'Itishree', 'Ranjan', 'Tanmay', 
  'Pratima', 'Satyabrata', 'Jyoti', 'Manas', 'Sailabala', 
  'Chandan', 'Ahalya'
];

const ODIA_CITIES = [
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur', 
  'Berhampur', 'Balasore', 'Baripada', 'Bhadrak', 'Jeypore', 
  'Jharsuguda'
];

const INDIAN_NAMES = [
  'Meera', 'Aarav', 'Rohan', 'Ananya', 'Karthik', 
  'Priya', 'Rahul', 'Sneha', 'Siddharth', 'Divya', 
  'Vikram', 'Neha', 'Amit', 'Deepika', 'Sanjay', 
  'Kiran', 'Arjun', 'Aditi', 'Vijay', 'Pooja'
];

const INDIAN_CITIES = [
  'Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 
  'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 
  'Patna', 'Kochi'
];

const SERVICES = [
  { text: 'chatted with AROHI for job help', emoji: '🎯' },
  { text: 'crafted a smart AI resume', emoji: '📝' },
  { text: 'analyzed Mudra Loan eligibility', emoji: '🏦' },
  { text: 'applied for Railway recruitment exam', emoji: '💼' },
  { text: 'checked PMKVY skill course details', emoji: '🎓' },
  { text: 'generated a personalized career roadmap', emoji: '🚀' },
  { text: 'practiced AI mock interview questions', emoji: '🗣️' },
  { text: 'verified State Board exam results', emoji: '🏆' },
  { text: 'booked an expert career counseling session', emoji: '✨' },
  { text: 'explored central government startup schemes', emoji: '💡' }
];

const TIMES = [
  'Just now', '3 seconds ago', '12 seconds ago', '30 seconds ago', 
  '1 minute ago', '2 minutes ago', 'Active now'
];

function generateRandomNotification(id: number): Notification {
  // 50% chance of Odia region vs other Indian regions
  const isOdia = Math.random() < 0.5;
  const name = isOdia 
    ? ODIA_NAMES[Math.floor(Math.random() * ODIA_NAMES.length)]
    : INDIAN_NAMES[Math.floor(Math.random() * INDIAN_NAMES.length)];
  const city = isOdia
    ? ODIA_CITIES[Math.floor(Math.random() * ODIA_CITIES.length)]
    : INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)];
  
  const serviceObj = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const timeAgo = TIMES[Math.floor(Math.random() * TIMES.length)];

  return {
    id,
    name,
    city,
    service: serviceObj.text,
    emoji: serviceObj.emoji,
    timeAgo
  };
}

export default function NotificationToast() {
  const [notification, setNotification] = useState<Notification>(() => generateRandomNotification(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setNotification(prev => generateRandomNotification(prev.id + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[76px] relative overflow-hidden w-full max-w-md select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[#120e2b]/95 border border-[#362772]/60 p-4 rounded-2xl shadow-xl flex items-center gap-3 w-fit transition-transform hover:scale-[1.02] duration-200"
        >
          <div className="bg-gradient-to-tr from-[#7c3aed] to-[#a855f7] text-white rounded-full p-2 h-10 w-10 flex items-center justify-center font-black text-xs shrink-0 shadow-lg">
            {notification.emoji}
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              {notification.name} from {notification.city}
            </h4>
            <p className="text-[11px] text-slate-300">
              {notification.service}
            </p>
            <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
              {notification.timeAgo}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
