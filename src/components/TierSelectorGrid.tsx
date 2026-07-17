import { useState } from 'react';
import { Check, CheckCircle2, Sparkles, AlertCircle, ShieldCheck, Phone, Cpu } from 'lucide-react';
import { PRICING_TIERS, PricingTier } from '../data/pricingData';

interface TierSelectorGridProps {
  pathId: string;
  pathMeta: {
    title: string;
    shortTitle: string;
    desc: string;
    icon: string;
  };
  onClose: () => void;
  setCheckoutPath: (path: { id: string; title: string; price: string } | null) => void;
  setPendingSubscriptionDetail: (detail: { tierName: string; price: number; margin: number } | null) => void;
}

export default function TierSelectorGrid({
  pathId,
  pathMeta,
  onClose,
  setCheckoutPath,
  setPendingSubscriptionDetail
}: TierSelectorGridProps) {
  const [selectedTierIndex, setSelectedTierIndex] = useState<number>(1); // Default to Professional Plan (index 1, ₹699)

  const selectedTier = PRICING_TIERS[selectedTierIndex];
  const limits = selectedTier.limits[pathId as 'path1' | 'path2' | 'path3' | 'path4'] as any;

  const handleProceed = () => {
    // Save pending subscription tier details
    setPendingSubscriptionDetail({
      tierName: selectedTier.name,
      price: selectedTier.price,
      margin: selectedTier.margin
    });

    // Open UPI Checkout Gateway
    setCheckoutPath({
      id: pathId,
      title: `${pathMeta.title} (${selectedTier.name})`,
      price: `₹${selectedTier.price}/Month`
    });

    onClose();
  };

  return (
    <div className="space-y-6 relative z-10">
      {/* 5 Tiers Horizontal / Vertical Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {PRICING_TIERS.map((tier, idx) => {
          const isSelected = selectedTierIndex === idx;
          const tierLimits = tier.limits[pathId as 'path1' | 'path2' | 'path3' | 'path4'] as any;

          return (
            <div
              key={idx}
              onClick={() => setSelectedTierIndex(idx)}
              className={`p-5 rounded-[2rem] border-2 text-left cursor-pointer transition-all duration-300 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-[#1b103c] to-[#0b061c] border-[#a78bfa] shadow-[0_0_25px_rgba(167,139,250,0.3)] scale-[1.02]'
                  : 'bg-[#100b28]/60 border-[#22174f] hover:border-[#3c2a85] hover:bg-[#130d32]/80'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg border border-violet-400/30">
                  Selected Plan
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                    {tier.name}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">₹{tier.price}</span>
                    <span className="text-[10px] text-slate-400 font-bold">/mo</span>
                  </div>
                </div>

                {/* Transparent platform support & Odisha server margin */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-2.5 text-[10px] text-emerald-300 leading-snug font-bold">
                  <div className="flex justify-between items-center text-[9px]">
                    <span>⚖️ 50% Gross Margin:</span>
                    <span className="font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded text-emerald-400">₹{tier.margin}</span>
                  </div>
                </div>

                {/* Plan limits preview */}
                <div className="space-y-2 border-t border-[#231a4d] pt-3.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Usage Limits:</span>
                  
                  {/* Shared standard Voice Call and Token Usage limits across all paths */}
                  <div className="space-y-1 bg-violet-500/10 p-2 rounded-xl border border-violet-500/20 mb-2">
                    <div className="flex items-center gap-1.5 text-[9px] text-violet-300 font-extrabold uppercase">
                      <span>⚡ Universal Allocations:</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-200 font-extrabold">
                      <Phone className="w-3 h-3 text-violet-400 shrink-0" />
                      <span>{tier.callHoursText}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-200 font-extrabold">
                      <Cpu className="w-3 h-3 text-violet-400 shrink-0" />
                      <span>{tier.tokenUsageText} Limit</span>
                    </div>
                  </div>

                  <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Path Specific Perks:</span>
                  <div className="space-y-1.5 text-[10px] text-slate-200 font-bold">
                    {pathId === 'path1' && (
                      <>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.atsScans}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.mockInterviews}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.jobMatches}</span></div>
                      </>
                    )}
                    {pathId === 'path2' && (
                      <>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.activeCourses}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.mentorHours}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.certificates}</span></div>
                      </>
                    )}
                    {pathId === 'path3' && (
                      <>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.msmeFilings}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.mudraChecks}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.startupReports}</span></div>
                      </>
                    )}
                    {pathId === 'path4' && (
                      <>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.chapterDownloads}</span></div>
                        <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-violet-400 shrink-0" /> <span className="truncate">{tierLimits.aiQueries}</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action indicator at bottom */}
              <div className="pt-4 border-t border-[#1a143b] mt-3.5">
                <span className={`text-[9px] font-black uppercase tracking-widest block text-center py-1.5 rounded-xl ${
                  isSelected 
                    ? 'bg-violet-500 text-white shadow-md' 
                    : 'text-violet-300 bg-white/5 hover:bg-white/10'
                }`}>
                  {isSelected ? 'Selected' : 'Select Tier'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Tier Deep-Dive Details */}
      <div className="bg-[#120e2a] border border-[#2d2163] p-6 rounded-[2rem] text-left grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
              ⚖️ Fully Transparent Platform Surcharges (50% Gross Margin)
            </span>
          </div>
          <h4 className="text-base font-black text-white flex items-center gap-1.5">
            <span>You have chosen: {selectedTier.name} (₹{selectedTier.price}/mo)</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-semibold">
            By dedicating 50% (₹{selectedTier.margin}) of each subscription strictly towards server workloads, continuous neural modeling for AROHI, state-level filing pipelines, and rural counselor salaries, Recruit.org.in operates with a completely fair and transparent 50% gross business margin.
          </p>
          
          <div className="pt-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Premium Perks included in {selectedTier.name}:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold text-slate-200">
              {/* Highlight Call Hours & Token Limit directly */}
              <div className="flex items-start gap-1.5 bg-violet-950/40 p-2 rounded-lg border border-violet-800/30">
                <Phone className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-extrabold">{selectedTier.callHoursText}</span>
                  <span className="text-[9px] text-slate-400">Included high-fidelity voice call duration</span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 bg-violet-950/40 p-2 rounded-lg border border-violet-800/30">
                <Cpu className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-extrabold">{selectedTier.tokenUsageText} Limit</span>
                  <span className="text-[9px] text-slate-400">Monthly AI language model allowance</span>
                </div>
              </div>

              {limits.highlights.map((highlight: string, idx: number) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col items-center sm:items-end justify-center w-full">
          <div className="bg-[#1a1435] border border-[#2e2365] p-5 rounded-[2rem] text-center w-full max-w-[280px] space-y-4">
            <div className="space-y-0.5">
              <span className="text-[9px] text-[#a855f7] uppercase font-black tracking-widest block">Total Checkout Amount</span>
              <span className="text-3xl font-black text-[#00e676]">₹{selectedTier.price}</span>
              <span className="text-[10px] text-slate-400 font-bold block">per month (includes GST)</span>
            </div>

            <button
              onClick={handleProceed}
              className="w-full py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#a855f7] hover:from-[#6d28d9] hover:to-[#9333ea] text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer border border-[#a78bfa]/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" /> Proceed with Gateway
            </button>
            <button
              onClick={onClose}
              className="text-[10px] text-slate-400 hover:text-slate-200 font-extrabold uppercase tracking-widest block mx-auto cursor-pointer"
            >
              Cancel Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
