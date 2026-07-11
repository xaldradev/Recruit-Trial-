import React, { useState, useEffect } from 'react';

interface ArohiAvatarProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ArohiAvatar({ className = 'w-full h-full' }: ArohiAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>('/arohi.png');
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

  // Load custom avatar from localStorage on mount if the user uploaded one previously
  useEffect(() => {
    const loadAvatar = () => {
      const saved = localStorage.getItem('arohi_custom_avatar');
      if (saved) {
        setCustomAvatar(saved);
      } else {
        setCustomAvatar(null);
      }
    };

    loadAvatar();

    // Listen for custom events so all avatars update in sync
    window.addEventListener('arohi-avatar-updated', loadAvatar);
    return () => {
      window.removeEventListener('arohi-avatar-updated', loadAvatar);
    };
  }, []);

  // Determine the final source to display
  const displaySrc = customAvatar || avatarUrl;

  return (
    <div 
      className={`${className} rounded-full overflow-hidden select-none bg-[#0a061e] border-2 border-violet-500/30 shadow-lg relative transition-all duration-300 hover:scale-105`}
    >
      {!hasError ? (
        <img
          src={displaySrc}
          alt="Arohi"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          onError={() => {
            setHasError(true);
          }}
        />
      ) : (
        // Gorgeous, high-end glowing placeholder if file is not found
        <div className="w-full h-full bg-gradient-to-tr from-[#12072b] via-[#2d1163] to-[#4c1d95] flex flex-col items-center justify-center text-center p-2">
          <div className="text-violet-300 font-mono font-bold text-[10px] tracking-wider uppercase animate-pulse">
            Arohi AI
          </div>
        </div>
      )}
    </div>
  );
}
