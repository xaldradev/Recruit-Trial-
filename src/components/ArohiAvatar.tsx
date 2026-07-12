import React from 'react';

interface ArohiAvatarProps {
  className?: string;
}

export default function ArohiAvatar({ className = 'w-full h-full' }: ArohiAvatarProps) {
  return (
    <div 
      className={`${className} rounded-full overflow-hidden select-none bg-[#0a0625] border-2 border-violet-500/40 shadow-[0_0_20px_rgba(124,58,237,0.3)] relative transition-all duration-300 hover:scale-105 flex items-center justify-center`}
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full object-cover"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber gradients for maximum colorfulness & neon vibes */}
          <linearGradient id="cyber-neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" /> {/* Electric Cyan */}
            <stop offset="35%" stopColor="#d946ef" /> {/* Magenta */}
            <stop offset="70%" stopColor="#ff007f" /> {/* Hot Pink */}
            <stop offset="100%" stopColor="#7c3aed" /> {/* Royal Violet */}
          </linearGradient>

          <linearGradient id="core-glow-grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff00a0" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <radialGradient id="cyber-bg-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.45)" />
            <stop offset="60%" stopColor="rgba(16, 10, 48, 0.2)" />
            <stop offset="100%" stopColor="rgba(7, 3, 24, 0)" />
          </radialGradient>

          {/* Glowing filter */}
          <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong outer glow */}
          <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="1.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient Radial Glow Background */}
        <circle cx="50" cy="50" r="48" fill="url(#cyber-bg-glow)" />

        {/* High-tech Cyber Grid Background Pattern */}
        <circle cx="50" cy="50" r="45" fill="#08041c" stroke="rgba(124, 58, 237, 0.2)" strokeWidth="1" />
        
        {/* Decorative Grid Lines */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0, 243, 255, 0.08)" strokeWidth="0.8" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(217, 70, 239, 0.08)" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="30" stroke="rgba(0, 243, 255, 0.05)" strokeWidth="0.8" strokeDasharray="2 3" />

        {/* Outer Rotating Cyber HUD Ring 1 - Dash Pattern (Clockwise) */}
        <g>
          <circle 
            cx="50" 
            cy="50" 
            r="42" 
            stroke="url(#cyber-neon-grad)" 
            strokeWidth="1.5" 
            strokeDasharray="25 12 8 12" 
            opacity="0.85" 
            filter="url(#neon-glow)"
          />
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="0 50 50" 
            to="360 50 50" 
            dur="12s" 
            repeatCount="indefinite" 
          />
        </g>

        {/* Outer Rotating Cyber HUD Ring 2 - Dash Pattern (Counter-Clockwise) */}
        <g>
          <circle 
            cx="50" 
            cy="50" 
            r="37" 
            stroke="#ff007f" 
            strokeWidth="1" 
            strokeDasharray="4 6 12 6" 
            opacity="0.7"
          />
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            from="360 50 50" 
            to="0 50 50" 
            dur="8s" 
            repeatCount="indefinite" 
          />
        </g>

        {/* Neural Network Nodes and Connector Lines (Pulsing tech wires) */}
        <g opacity="0.65">
          {/* Connection Lines */}
          <line x1="50" y1="50" x2="28" y2="28" stroke="#00f3ff" strokeWidth="0.8" strokeDasharray="1 2" />
          <line x1="50" y1="50" x2="72" y2="28" stroke="#d946ef" strokeWidth="0.8" strokeDasharray="1 2" />
          <line x1="50" y1="50" x2="28" y2="72" stroke="#ff007f" strokeWidth="0.8" strokeDasharray="1 2" />
          <line x1="50" y1="50" x2="72" y2="72" stroke="#00f3ff" strokeWidth="0.8" strokeDasharray="1 2" />
          <line x1="50" y1="50" x2="50" y2="20" stroke="#7c3aed" strokeWidth="0.8" />
          <line x1="50" y1="50" x2="80" y2="50" stroke="#00f3ff" strokeWidth="0.8" />
          
          {/* Satellite Nodes */}
          <circle cx="28" cy="28" r="2.5" fill="#00f3ff" filter="url(#neon-glow)" />
          <circle cx="72" cy="28" r="2.5" fill="#d946ef" filter="url(#neon-glow)" />
          <circle cx="28" cy="72" r="2.5" fill="#ff007f" filter="url(#neon-glow)" />
          <circle cx="72" cy="72" r="2" fill="#00f3ff" />
          <circle cx="50" cy="20" r="3" fill="#7c3aed" filter="url(#neon-glow)">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="80" cy="50" r="2" fill="#00f3ff">
            <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Center Quantum AI Sphere Background Glow */}
        <circle cx="50" cy="50" r="16" fill="url(#core-glow-grad)" opacity="0.4" filter="url(#strong-glow)" />

        {/* Central Quantum AI Core Sphere */}
        <circle 
          cx="50" 
          cy="50" 
          r="13" 
          fill="url(#core-glow-grad)" 
          stroke="url(#cyber-neon-grad)" 
          strokeWidth="1.5" 
          filter="url(#neon-glow)" 
        />

        {/* Styled Futuristic "A" Icon representing AROHI AI */}
        <path 
          d="M44 58 L50 36 L56 58" 
          stroke="#ffffff" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.8))"
        />
        <path 
          d="M45.5 51 L54.5 51" 
          stroke="#ffffff" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          filter="drop-shadow(0px 0px 3px rgba(255, 255, 255, 0.8))"
        />

        {/* AI Thinking / Processing Orbit Rings (Tilted) */}
        <g stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.8" opacity="0.8">
          <ellipse cx="50" cy="50" rx="20" ry="6" transform="rotate(-30 50 50)" strokeDasharray="3 3" />
          <ellipse cx="50" cy="50" rx="20" ry="6" transform="rotate(30 50 50)" strokeDasharray="3 3" />
        </g>

        {/* Sparkles / Dynamic Energy Nodes */}
        <g>
          <circle cx="43" cy="42" r="1" fill="#ffffff" />
          <circle cx="57" cy="42" r="1" fill="#ffffff" />
          <circle cx="50" cy="46" r="1.5" fill="#ffffff" filter="url(#neon-glow)">
            <animate attributeName="r" values="0.8;2;0.8" dur="1s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

