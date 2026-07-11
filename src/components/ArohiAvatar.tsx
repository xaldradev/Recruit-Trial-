import React from 'react';

interface ArohiAvatarProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ArohiAvatar({ className = 'w-full h-full' }: ArohiAvatarProps) {
  return (
    <div 
      className={`${className} rounded-full overflow-hidden select-none bg-[#0a061e] border-2 border-violet-500/30 shadow-lg relative transition-all duration-300 hover:scale-105`}
    >
      <img
        src="/Arohi.jpg"
        alt="Arohi"
        className="w-full h-full object-cover rounded-full"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

