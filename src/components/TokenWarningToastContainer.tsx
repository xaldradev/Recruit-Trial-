import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, ArrowUpRight, Sparkles, Clock, Coins, ShieldAlert } from 'lucide-react';

interface WarningToast {
  id: string;
  pathId: string;
  title: string;
  usage: number;
  limit: number;
  percentage: number;
  timestamp: string;
  count: number;
  lastTriggered: string;
  pulse: boolean;
}

interface TokenWarningToastContainerProps {
  toasts: WarningToast[];
  onCloseToast: (pathId: string) => void;
  onUpgrade: (pathId: string) => void;
  nextReminderIn: number;
  warningInterval: number;
  warningEnabled: boolean;
}

export default function TokenWarningToastContainer({
  toasts,
  onCloseToast,
  onUpgrade,
  nextReminderIn,
  warningInterval,
  warningEnabled
}: TokenWarningToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-[120] flex flex-col gap-4 max-w-sm w-full pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isExtreme = toast.percentage >= 95;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: toast.pulse ? [1, 1.05, 1] : 1,
                boxShadow: toast.pulse 
                  ? '0 0 35px rgba(239, 68, 68, 0.5)' 
                  : '0 10px 30px rgba(0, 0, 0, 0.4)'
              }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1],
                scale: { duration: 0.4 }
              }}
              className={`pointer-events-auto rounded-[2rem] border-2 text-left p-5 flex flex-col justify-between overflow-hidden relative backdrop-blur-xl ${
                isExtreme
                  ? 'bg-[#1a080f]/95 border-rose-500/80 text-rose-100 shadow-[0_10px_30px_rgba(244,63,94,0.3)]'
                  : 'bg-[#1c120a]/95 border-amber-500/70 text-amber-100 shadow-[0_10px_30px_rgba(245,158,11,0.25)]'
              }`}
            >
              {/* Pulsing indicator light at top right */}
              <div className="absolute top-4 right-12 flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                <span className={`w-2 h-2 rounded-full ${isExtreme ? 'bg-rose-500 animate-ping' : 'bg-amber-500 animate-ping'}`}></span>
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-300 font-mono">
                  {toast.percentage}% Used
                </span>
              </div>

              {/* Title / Close button row */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex gap-2.5 items-center">
                  <div className={`p-2 rounded-xl shrink-0 ${isExtreme ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'}`}>
                    {isExtreme ? <ShieldAlert className="w-5 h-5 animate-bounce" /> : <AlertTriangle className="w-5 h-5 animate-pulse" />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                      QUOTA ALERT SYSTEM
                    </span>
                    <h4 className="text-xs font-black text-white leading-tight mt-0.5">
                      {toast.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => onCloseToast(toast.pathId)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  title="Acknowledge alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-3 mt-3.5">
                <div className="text-xs font-bold leading-relaxed text-slate-200">
                  You have consumed <span className="text-white font-black font-mono">{toast.usage}</span> out of <span className="text-white font-black font-mono">{toast.limit}</span> monthly tokens. 
                  {isExtreme ? (
                    <span className="text-rose-400 block mt-1">⚠️ Critical! Service will halt immediately at 100% capacity.</span>
                  ) : (
                    <span className="text-amber-400 block mt-1">Approaching limits! Upgrade to preserve AROHI neural query speeds.</span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isExtreme
                        ? 'bg-gradient-to-r from-red-500 to-rose-500'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${Math.min(100, toast.percentage)}%` }}
                  />
                </div>

                {/* Odisha/Fair-trade Transparent Margin callout */}
                <div className="p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl text-[9px] text-emerald-300 leading-snug font-bold flex gap-2 items-start">
                  <Coins className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span>Our transparent 50% gross business margin fuels cloud scaling servers and expert local counselors in Odisha. Upgrades keep operations sustainable!</span>
                  </div>
                </div>

                {/* Reminder Meta details */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2.5 mt-1">
                  <span className="flex items-center gap-1 font-bold">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Alert Count: <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">#{toast.count}</strong></span>
                  </span>
                  
                  {warningEnabled && (
                    <span className="text-[9px] font-extrabold text-[#c084fc] animate-pulse">
                      ⏰ Next reminder in {nextReminderIn}s
                    </span>
                  )}
                </div>

                {/* Upgrade Button */}
                <button
                  onClick={() => onUpgrade(toast.pathId)}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5 border ${
                    isExtreme
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg border-rose-400/20'
                      : 'bg-amber-500 hover:bg-amber-600 text-black shadow-lg border-amber-400/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Upgrade Plan Instantly <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
