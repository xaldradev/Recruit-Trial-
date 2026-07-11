import React, { useState } from 'react';

interface ArohiAvatarProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function ArohiAvatar({ className = 'w-full h-full' }: ArohiAvatarProps) {
  const [imgSrc, setImgSrc] = useState('/Arohi.jpg?v=5');
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount === 0) {
      // Try lowercase arohi.png with cache buster
      setImgSrc(`/arohi.png?t=${Date.now()}`);
      setRetryCount(1);
    } else if (retryCount === 1) {
      // Try lowercase arohi.jpg with cache buster
      setImgSrc(`/arohi.jpg?t=${Date.now()}`);
      setRetryCount(2);
    } else if (retryCount === 2) {
      // Try capitalised with fresh timestamp
      setImgSrc(`/Arohi.jpg?t=${Date.now()}`);
      setRetryCount(3);
    }
  };

  return (
    <div 
      className={`${className} rounded-full overflow-hidden select-none bg-[#0a061e] border-2 border-violet-500/30 shadow-lg relative transition-all duration-300 hover:scale-105 flex items-center justify-center`}
    >
      <img
        src={imgSrc}
        alt="Arohi"
        className="w-full h-full object-cover rounded-full"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
}

