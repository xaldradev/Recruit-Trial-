import { Flame, Play } from 'lucide-react';
import { Posting } from '../types';

interface MarqueeTickerProps {
  postings: Posting[];
  onSelectPosting: (posting: Posting) => void;
}

export default function MarqueeTicker({ postings, onSelectPosting }: MarqueeTickerProps) {
  // Take the latest 5 or 6 items with "isNew" flag or just the first few items
  const tickerItems = postings.slice(0, 8);

  return (
    <div className="bg-[#0b071e] border-y border-[#26175e] py-3 shadow-[0_4px_25px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-0 left-1/4 w-96 h-6 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 overflow-hidden relative z-10">
        {/* Flame Icon Badge */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse shrink-0 border border-rose-500/30 shadow-[0_0_12px_rgba(225,29,72,0.2)]">
          <Flame className="w-3.5 h-3.5 fill-current text-yellow-300" />
          <span className="tracking-wider">Hot Updates</span>
        </div>

        {/* Marquee Body */}
        <div className="relative flex-1 overflow-hidden h-6 select-none group">
          <div className="absolute top-0 flex items-center gap-16 animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
            {/* First Set */}
            {tickerItems.map((item) => (
              <button
                key={`${item.id}-m1`}
                onClick={() => onSelectPosting(item)}
                className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-200 hover:text-yellow-300 transition-all cursor-pointer"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#00e676] animate-ping"></span>
                <span>{item.title}</span>
                <span className="bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40 text-[9px] px-1.5 rounded animate-pulse font-mono leading-none py-0.5 ml-1 font-black">
                  NEW
                </span>
              </button>
            ))}
            {/* Duplicate Set for Seamless Loop */}
            {tickerItems.map((item) => (
              <button
                key={`${item.id}-m2`}
                onClick={() => onSelectPosting(item)}
                className="inline-flex items-center gap-2 text-[12px] font-extrabold text-slate-200 hover:text-yellow-300 transition-all cursor-pointer"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-[#00e676] animate-ping"></span>
                <span>{item.title}</span>
                <span className="bg-[#7c3aed]/20 text-[#c084fc] border border-[#7c3aed]/40 text-[9px] px-1.5 rounded animate-pulse font-mono leading-none py-0.5 ml-1 font-black">
                  NEW
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
