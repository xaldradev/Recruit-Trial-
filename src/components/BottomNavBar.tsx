import { Landmark, Briefcase, Bot, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Language, getTranslation } from '../translations';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language: Language;
}

export default function BottomNavBar({ activeTab, onTabChange, language }: BottomNavBarProps) {
  const tabs = [
    { id: 'home', label: getTranslation('home', language), icon: Landmark },
    { id: 'jobs', label: getTranslation('jobs', language), icon: Briefcase },
    { id: 'arohi', label: 'AROHI AI', icon: Bot },
    { id: 'dashboard', label: getTranslation('dashboard', language), icon: User }
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#06040b]/95 backdrop-blur-xl border-t border-purple-500/15 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      {/* iOS Home Indicator Safe Area Offset spacer */}
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-2 relative group focus:outline-none"
            >
              {/* Active Backlight Glow */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-glow"
                  className="absolute -top-2 w-10 h-10 bg-purple-500/15 rounded-full blur-md pointer-events-none"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Active Accent Dot on Top */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-dot"
                  className="absolute top-0 w-1 h-1 bg-purple-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon Container */}
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-purple-400 scale-110 bg-purple-950/40 border border-purple-500/20'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5.5 h-5.5" />
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10px] font-extrabold mt-1 tracking-tight transition-all truncate max-w-[75px] ${
                  isActive ? 'text-purple-300 font-black' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
