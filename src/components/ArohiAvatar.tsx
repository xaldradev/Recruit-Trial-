import React from 'react';

interface ArohiAvatarProps {
  className?: string;
}

export default function ArohiAvatar({ className = 'w-full h-full' }: ArohiAvatarProps) {
  return (
    <div 
      className={`${className} relative select-none flex items-center justify-center`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-[0_0_20px_rgba(124,58,237,0.35)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main neon/cyber gradient for glow and accents */}
          <linearGradient id="arohi-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          {/* Core dark radial background */}
          <radialGradient id="arohi-bg-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#140f34" />
            <stop offset="70%" stopColor="#09051c" />
            <stop offset="100%" stopColor="#04020a" />
          </radialGradient>

          {/* Letter A glow filter */}
          <filter id="luminous-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Main Background Circle */}
        <circle cx="50" cy="50" r="46" fill="url(#arohi-bg-radial)" />

        {/* 2. Outer Deep Violet Cyber Ring */}
        <circle cx="50" cy="50" r="45" stroke="#4c1d95" strokeWidth="2" strokeOpacity="0.6" />
        <circle cx="50" cy="50" r="42" stroke="#7c3aed" strokeWidth="1" strokeOpacity="0.3" />

        {/* 3. Subtle Crosshair/Axes lines (radar look) */}
        <line x1="50" y1="12" x2="50" y2="88" stroke="#7c3aed" strokeWidth="0.75" strokeOpacity="0.25" />
        <line x1="12" y1="50" x2="88" y2="50" stroke="#7c3aed" strokeWidth="0.75" strokeOpacity="0.25" />

        {/* Axis tick marks */}
        <circle cx="50" cy="30" r="1.5" fill="#7c3aed" fillOpacity="0.4" />
        <circle cx="50" cy="70" r="1.5" fill="#7c3aed" fillOpacity="0.4" />
        <circle cx="30" cy="50" r="1.5" fill="#7c3aed" fillOpacity="0.4" />
        <circle cx="70" cy="50" r="1.5" fill="#7c3aed" fillOpacity="0.4" />

        {/* 4. Concentric Dashed Pink Ring (Rotating) */}
        <circle 
          cx="50" 
          cy="50" 
          r="34" 
          stroke="#ec4899" 
          strokeWidth="1.5" 
          strokeDasharray="4, 5" 
          strokeOpacity="0.75"
          className="animate-spin"
          style={{ transformOrigin: 'center', animationDuration: '24s' }}
        />

        {/* 5. Inner Orbit Paths (Neural network / Atom loops) */}
        {/* Loop 1 */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="25" 
          ry="10" 
          stroke="#ffffff" 
          strokeWidth="0.75" 
          strokeDasharray="2, 3" 
          strokeOpacity="0.35" 
          transform="rotate(45 50 50)" 
        />
        {/* Loop 2 */}
        <ellipse 
          cx="50" 
          cy="50" 
          rx="25" 
          ry="10" 
          stroke="#ffffff" 
          strokeWidth="0.75" 
          strokeDasharray="2, 3" 
          strokeOpacity="0.35" 
          transform="rotate(-45 50 50)" 
        />

        {/* 6. Colored Constellation Nodes with lines */}
        {/* Node A (Cyan - Top Left) */}
        <line x1="50" y1="50" x2="30" y2="30" stroke="#00f3ff" strokeWidth="1" strokeDasharray="1, 2" strokeOpacity="0.5" />
        <circle cx="30" cy="30" r="3" fill="#00f3ff" className="animate-pulse" />
        <circle cx="30" cy="30" r="5" stroke="#00f3ff" strokeWidth="1" strokeOpacity="0.3" />

        {/* Node B (Magenta - Top Right) */}
        <line x1="50" y1="50" x2="70" y2="30" stroke="#d946ef" strokeWidth="1" strokeDasharray="1, 2" strokeOpacity="0.5" />
        <circle cx="70" cy="30" r="3" fill="#d946ef" />
        <circle cx="70" cy="30" r="5" stroke="#d946ef" strokeWidth="1" strokeOpacity="0.3" />

        {/* Node C (Pink - Bottom Left) */}
        <line x1="50" y1="50" x2="30" y2="70" stroke="#ec4899" strokeWidth="1" strokeDasharray="1, 2" strokeOpacity="0.5" />
        <circle cx="30" cy="70" r="3" fill="#ec4899" />
        <circle cx="30" cy="70" r="5" stroke="#ec4899" strokeWidth="1" strokeOpacity="0.3" />

        {/* Node D (Cyan - Bottom Right) */}
        <line x1="50" y1="50" x2="70" y2="70" stroke="#00f3ff" strokeWidth="1" strokeDasharray="1, 2" strokeOpacity="0.5" />
        <circle cx="70" cy="70" r="3" fill="#00f3ff" />
        <circle cx="70" cy="70" r="5" stroke="#00f3ff" strokeWidth="1" strokeOpacity="0.3" />

        {/* 7. Center Glow Aura */}
        <circle cx="50" cy="50" r="15" fill="#7c3aed" fillOpacity="0.25" filter="url(#luminous-glow)" />

        {/* 8. Glowing Central Luminous "A" Emblem */}
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="26"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          filter="url(#luminous-glow)"
          className="select-none pointer-events-none"
        >
          A
        </text>

        {/* 9. Small orbiting green/cyan dot near the concentric ring */}
        <g className="animate-spin" style={{ transformOrigin: 'center', animationDuration: '6s' }}>
          <circle cx="74" cy="50" r="2" fill="#00e5ff" filter="url(#luminous-glow)" />
        </g>

        {/* 10. Glowing pulsing green active status light (integrated) */}
        <circle 
          cx="78" 
          cy="78" 
          r="6.5" 
          fill="#000000" 
        />
        <circle 
          cx="78" 
          cy="78" 
          r="5" 
          fill="#00e676" 
          className="animate-pulse"
        />
        <circle 
          cx="78" 
          cy="78" 
          r="5" 
          stroke="#090714" 
          strokeWidth="1.5" 
        />
      </svg>
    </div>
  );
}
