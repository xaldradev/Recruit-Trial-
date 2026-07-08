import React from 'react';

interface ArohiAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ArohiAvatar({ className = 'w-full h-full', size = 'md' }: ArohiAvatarProps) {
  // A breathtakingly modern, premium, futuristic Neural AI Core construct.
  // This features concentric orbital data rings, a glowing holographic central neural node, 
  // particle flare coordinates, and professional deep-purple to emerald gradients.
  // Perfectly fits the cosmic, integrated smart classroom and career workspace theme.
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="ringGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Gradients */}
        <radialGradient id="spaceBg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1b124a" />
          <stop offset="60%" stopColor="#0d082c" />
          <stop offset="100%" stopColor="#050314" />
        </radialGradient>

        <linearGradient id="neonPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>

        <linearGradient id="neonEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00e676" />
          <stop offset="100%" stopColor="#05b35c" />
        </linearGradient>

        <linearGradient id="coreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00e676" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#09051d" />
        </linearGradient>
      </defs>

      {/* 1. Deep Space Cosmic Sphere Background */}
      <circle cx="256" cy="256" r="246" fill="url(#spaceBg)" stroke="#2e1a75" strokeWidth="4" />

      {/* 2. Outer Rotating Synchrotron Coordinates & Tickers */}
      <circle cx="256" cy="256" r="210" stroke="url(#neonPurple)" strokeWidth="1.5" strokeDasharray="16 48" opacity="0.4" />
      <circle cx="256" cy="256" r="195" stroke="url(#neonEmerald)" strokeWidth="1" strokeDasharray="4 8" opacity="0.3" />

      {/* 3. Orbital Ring Trajectories (Sleek tilted ellipses) */}
      <ellipse cx="256" cy="256" rx="160" ry="60" stroke="url(#neonPurple)" strokeWidth="2.5" strokeDasharray="300 20" transform="rotate(-30, 256, 256)" opacity="0.7" filter="url(#ringGlow)" />
      <ellipse cx="256" cy="256" rx="160" ry="60" stroke="url(#neonEmerald)" strokeWidth="2" strokeDasharray="150 15" transform="rotate(45, 256, 256)" opacity="0.6" filter="url(#ringGlow)" />
      <ellipse cx="256" cy="256" rx="170" ry="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 12" transform="rotate(110, 256, 256)" opacity="0.4" />

      {/* 4. Neural Network Core Mesh - Intersecting Constellation Lines */}
      <g stroke="url(#neonPurple)" strokeWidth="1" opacity="0.5">
        <line x1="176" y1="256" x2="256" y2="176" />
        <line x1="256" y1="176" x2="336" y2="256" />
        <line x1="336" y1="256" x2="256" y2="336" />
        <line x1="256" y1="336" x2="176" y2="256" />
        
        <line x1="206" y1="206" x2="306" y2="306" />
        <line x1="306" y1="206" x2="206" y2="306" />

        <line x1="256" y1="120" x2="256" y2="392" stroke="url(#neonEmerald)" strokeWidth="0.75" strokeDasharray="4 4" />
        <line x1="120" y1="256" x2="392" y2="256" stroke="url(#neonEmerald)" strokeWidth="0.75" strokeDasharray="4 4" />
      </g>

      {/* 5. Holographic Data Nodes */}
      <circle cx="176" cy="256" r="5" fill="#ffffff" filter="url(#ringGlow)" />
      <circle cx="336" cy="256" r="5" fill="#00e676" filter="url(#ringGlow)" />
      <circle cx="256" cy="176" r="5" fill="#00e676" filter="url(#ringGlow)" />
      <circle cx="256" cy="336" r="5" fill="#ffffff" filter="url(#ringGlow)" />
      
      <circle cx="206" cy="206" r="4" fill="#a78bfa" />
      <circle cx="306" cy="206" r="4" fill="#a78bfa" />
      <circle cx="206" cy="306" r="4" fill="#a78bfa" />
      <circle cx="306" cy="306" r="4" fill="#a78bfa" />

      {/* 6. Dynamic Central Pulsing AI Core */}
      <circle cx="256" cy="256" r="64" fill="url(#coreGrad)" opacity="0.15" filter="url(#coreGlow)" />
      <circle cx="256" cy="256" r="48" fill="url(#coreGrad)" opacity="0.3" filter="url(#coreGlow)" />
      <circle cx="256" cy="256" r="32" fill="url(#neonEmerald)" filter="url(#coreGlow)" />
      
      {/* 7. Core Spark Flares / Energy Rings */}
      <circle cx="256" cy="256" r="16" fill="#ffffff" />
      <polygon points="256,230 260,250 280,256 260,262 256,282 252,262 232,256 252,250" fill="#ffffff" filter="url(#ringGlow)" />

      {/* 8. Modern Digital Tech UI Accents */}
      <path d="M 230,100 A 156,156 0 0,1 282,100" fill="none" stroke="#00e676" strokeWidth="4" strokeLinecap="round" />
      <path d="M 230,412 A 156,156 0 0,0 282,412" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
