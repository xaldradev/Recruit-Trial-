import React, { useState, useEffect, useRef } from 'react';

interface ArohiAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ArohiAvatar({ className = 'w-full h-full', size = 'md' }: ArohiAvatarProps) {
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('custom_arohi_avatar');
      setCustomAvatar(stored);
    };

    // Load initial avatar
    handleStorageChange();

    // Listen to storage changes across other tabs
    window.addEventListener('storage', handleStorageChange);
    // Listen to custom event for instantaneous same-window updates
    window.addEventListener('custom_arohi_avatar_update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom_arohi_avatar_update', handleStorageChange);
    };
  }, []);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem('custom_arohi_avatar', base64String);
          setCustomAvatar(base64String);
          window.dispatchEvent(new Event('custom_arohi_avatar_update'));
        } catch (e) {
          console.error("Failed to save avatar to localStorage (likely size limit)", e);
          alert("Image is too large. Please upload an image under 2MB.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    // Hidden developer backdoor: Double click or Shift-click triggers file selection
    if (e.detail === 2 || e.shiftKey) {
      fileInputRef.current?.click();
    }
  };

  const renderContent = () => {
    if (customAvatar) {
      return (
        <img
          src={customAvatar}
          alt="Arohi"
          className={`${className} object-cover rounded-full select-none filter drop-shadow-md`}
          referrerPolicy="no-referrer"
        />
      );
    }

    // A stunningly crafted, high-fidelity Pixar 3D style vector representation of Arohi.
    // Displays her trademark wavy dark brown hair, deep expressive brown eyes, small red bindi,
    // gold earrings, and white polo collar shirt featuring a purple graduation cap logo.
    return (
      <svg
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} select-none filter drop-shadow-md`}
      >
        <defs>
          {/* Gradients for 3D Shading */}
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#03001e" />
          </radialGradient>

          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c1a13" />
            <stop offset="50%" stopColor="#190e0a" />
            <stop offset="100%" stopColor="#0c0705" />
          </linearGradient>

          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4e3327" />
            <stop offset="100%" stopColor="#2c1a13" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffe6d5" />
            <stop offset="50%" stopColor="#ffd2b8" />
            <stop offset="100%" stopColor="#f5b393" />
          </linearGradient>

          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5a484" />
            <stop offset="100%" stopColor="#c88564" />
          </linearGradient>

          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a2e1b" />
            <stop offset="60%" stopColor="#301d10" />
            <stop offset="100%" stopColor="#1a0f08" />
          </linearGradient>

          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe57f" />
            <stop offset="50%" stopColor="#ffd740" />
            <stop offset="100%" stopColor="#ffb300" />
          </linearGradient>

          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>

          <linearGradient id="lipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff7a90" />
            <stop offset="50%" stopColor="#ff5270" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          {/* Soft Glow Filter for Highlight */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Circular Outer Badge Background */}
        <circle cx="256" cy="256" r="240" fill="url(#bgGrad)" stroke="#312e81" strokeWidth="8" />
        <circle cx="256" cy="256" r="230" stroke="url(#purpleGrad)" strokeWidth="2" opacity="0.4" strokeDasharray="8 6" />

        {/* 2. Back Hair (Behind Neck & Shoulders) */}
        <path
          d="M 120,280 C 90,340 100,420 120,480 C 140,490 200,500 256,500 C 312,500 372,490 392,480 C 412,420 422,340 392,280 C 360,250 150,250 120,280 Z"
          fill="url(#hairGrad)"
        />
        
        {/* 3. Shoulders and White Polo Shirt */}
        <path
          d="M 140,440 C 140,400 170,380 210,380 L 302,380 C 342,380 372,400 372,440 L 382,500 C 382,503 300,512 256,512 C 212,512 130,503 130,500 Z"
          fill="#f8fafc"
        />
        {/* Shoulder Shadows */}
        <path
          d="M 140,440 C 140,410 165,395 200,390 L 312,390 C 347,395 372,410 372,440 Z"
          fill="#e2e8f0"
          opacity="0.4"
        />

        {/* 4. Neck */}
        <path
          d="M 216,330 L 216,390 C 216,410 296,410 296,390 L 296,330 Z"
          fill="url(#skinShadow)"
        />
        <path
          d="M 220,330 C 220,360 292,360 292,330 L 288,380 C 288,395 224,395 224,380 Z"
          fill="url(#skinGrad)"
        />

        {/* Neck Shadows and Collar bone lines */}
        <path
          d="M 220,335 C 235,355 277,355 292,335"
          stroke="#e5a484"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* 5. Polo Shirt Collar */}
        {/* Left Collar Flap */}
        <path
          d="M 256,380 L 190,380 C 180,380 185,410 205,435 L 256,470 Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <path
          d="M 190,380 L 205,435"
          stroke="url(#purpleGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Right Collar Flap */}
        <path
          d="M 256,380 L 322,380 C 332,380 327,410 307,435 L 256,470 Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        <path
          d="M 322,380 L 307,435"
          stroke="url(#purpleGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Polo Shirt Placket Line & Buttons */}
        <line x1="256" y1="420" x2="256" y2="490" stroke="#cbd5e1" strokeWidth="2" />
        <circle cx="256" cy="410" r="3" fill="#cbd5e1" />
        <circle cx="256" cy="435" r="3" fill="#cbd5e1" />
        <circle cx="256" cy="460" r="3" fill="#cbd5e1" />

        {/* 6. Purple Graduation Cap Logo on the Shirt (Left Chest) */}
        <g transform="translate(182, 442) scale(0.65)" className="filter drop-shadow">
          {/* Diamond top */}
          <polygon points="20,8 35,14 20,20 5,14" fill="url(#purpleGrad)" />
          {/* Cap base */}
          <path d="M 10,15.5 L 10,21 C 10,24 30,24 30,21 L 30,15.5" fill="#4c1d95" />
          {/* Tassel */}
          <path d="M 20,14 L 32,17 L 33,23" fill="none" stroke="#ffe57f" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="33" cy="24" r="1.5" fill="#ffd740" />
        </g>

        {/* 7. Ears & Earrings */}
        {/* Left Ear */}
        <path
          d="M 172,240 C 158,240 158,275 172,285 Z"
          fill="url(#skinShadow)"
        />
        {/* Right Ear */}
        <path
          d="M 340,240 C 354,240 354,275 340,285 Z"
          fill="url(#skinShadow)"
        />

        {/* Left Earring (Gold dangling ball matching picture) */}
        <line x1="164" y1="275" x2="164" y2="288" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="164" cy="292" r="5" fill="url(#goldGrad)" />
        <circle cx="164" cy="292" r="2" fill="#fff" opacity="0.6" />

        {/* Right Earring (Gold dangling ball matching picture) */}
        <line x1="348" y1="275" x2="348" y2="288" stroke="url(#goldGrad)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="348" cy="292" r="5" fill="url(#goldGrad)" />
        <circle cx="348" cy="292" r="2" fill="#fff" opacity="0.6" />

        {/* 8. Face Structure */}
        <path
          d="M 170,220 C 170,140 342,140 342,220 C 342,310 256,350 256,350 C 256,350 170,310 170,220 Z"
          fill="url(#skinGrad)"
        />

        {/* Face Highlights and Cheeks Blush */}
        <ellipse cx="195" cy="285" rx="14" ry="8" fill="#ff4d6d" opacity="0.15" />
        <ellipse cx="317" cy="285" rx="14" ry="8" fill="#ff4d6d" opacity="0.15" />

        {/* 9. Forehead Bindi (Red Dot - Perfectly Centered) */}
        <circle cx="256" cy="195" r="5" fill="#dc2626" filter="url(#softGlow)" />
        <circle cx="256" cy="195" r="4" fill="#ef4444" />

        {/* 10. Eyebrows (Beautiful elegant feminine arches) */}
        <path
          d="M 195,215 C 205,203 225,205 235,212"
          stroke="#190e0a"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 317,215 C 307,203 287,205 277,212"
          stroke="#190e0a"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 11. Expressive Pixar Eyes */}
        {/* Left Eye Sclera (White) */}
        <path
          d="M 190,240 C 200,228 225,228 235,240 C 225,252 200,252 190,240 Z"
          fill="#ffffff"
          stroke="#190e0a"
          strokeWidth="1.5"
        />
        {/* Left Iris (Brown) */}
        <circle cx="213" cy="240" r="14" fill="url(#eyeGrad)" />
        {/* Left Pupil */}
        <circle cx="213" cy="240" r="8" fill="#0c0705" />
        {/* Left Reflections */}
        <circle cx="209" cy="236" r="4" fill="#ffffff" />
        <circle cx="217" cy="244" r="1.5" fill="#ffffff" />

        {/* Right Eye Sclera (White) */}
        <path
          d="M 277,240 C 287,228 312,228 322,240 C 312,252 287,252 277,240 Z"
          fill="#ffffff"
          stroke="#190e0a"
          strokeWidth="1.5"
        />
        {/* Right Iris (Brown) */}
        <circle cx="299" cy="240" r="14" fill="url(#eyeGrad)" />
        {/* Right Pupil */}
        <circle cx="299" cy="240" r="8" fill="#0c0705" />
        {/* Right Reflections */}
        <circle cx="295" cy="236" r="4" fill="#ffffff" />
        <circle cx="303" cy="244" r="1.5" fill="#ffffff" />

        {/* Thick Eyelashes */}
        <path
          d="M 188,238 C 198,223 228,223 237,238"
          stroke="#0c0705"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 275,238 C 284,223 314,223 324,238"
          stroke="#0c0705"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* 12. Nose */}
        <path
          d="M 251,248 C 251,248 256,275 256,278 C 256,281 251,283 256,283 C 261,283 256,281 256,278"
          stroke="#e5a484"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 251,281 C 253,283 259,283 261,281"
          stroke="#e5a484"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 13. Sweet Smiling Mouth */}
        {/* Lip Line */}
        <path
          d="M 226,305 C 236,322 276,322 286,305"
          fill="url(#lipGrad)"
        />
        <path
          d="M 224,304 C 238,318 274,318 288,304"
          stroke="#991b1b"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Upper Lip Shadow */}
        <path
          d="M 235,302 C 248,306 264,306 277,302"
          stroke="#ff7a90"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* 14. Beautiful Front Hair Bangs and Wavy Strands ( Pixaresque Depth Layer ) */}
        {/* Hair on Left Side of Face */}
        <path
          d="M 170,160 C 150,190 145,260 162,295 C 166,305 178,285 175,275 C 160,225 180,180 200,165 Z"
          fill="url(#hairGrad)"
        />
        {/* Hair on Right Side of Face */}
        <path
          d="M 342,160 C 362,190 367,260 350,295 C 346,305 334,285 337,275 C 352,225 332,180 312,165 Z"
          fill="url(#hairGrad)"
        />

        {/* Voluminous Main Bang Sweep (Stretches across forehead beautifully) */}
        <path
          d="M 220,135 C 170,145 150,190 155,230 C 160,250 175,260 178,235 C 185,185 210,165 250,160 C 290,155 330,175 350,225 C 355,240 365,225 360,210 C 340,150 290,125 220,135 Z"
          fill="url(#hairHighlight)"
        />

        <path
          d="M 256,120 C 200,120 160,160 160,210 C 160,230 170,240 172,215 C 175,165 215,145 256,145 C 297,145 337,165 340,215 C 342,240 352,230 352,210 C 352,160 312,120 256,120 Z"
          fill="url(#hairGrad)"
        />

        {/* Additional Wavy highlights for 3D bounce */}
        <path
          d="M 130,280 C 110,330 115,400 135,460 C 140,470 148,450 142,430 C 128,380 125,320 145,285 Z"
          fill="url(#hairHighlight)"
          opacity="0.8"
        />
        <path
          d="M 382,280 C 402,330 397,400 377,460 C 372,470 364,450 370,430 C 384,380 387,320 367,285 Z"
          fill="url(#hairHighlight)"
          opacity="0.8"
        />
      </svg>
    );
  };

  return (
    <div 
      onClick={handleAvatarClick}
      className={`${className} cursor-pointer group relative`}
    >
      {renderContent()}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
