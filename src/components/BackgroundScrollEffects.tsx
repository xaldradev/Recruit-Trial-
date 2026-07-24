import React, { useEffect, useState } from 'react';

export default function BackgroundScrollEffects() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic parallax translate offsets based on scroll position
  const translateY1 = (scrollY * 0.15) % 100;
  const translateY2 = (scrollY * -0.2) % 120;
  const gridOffsetY = (scrollY * 0.4) % 60;
  const rotateDeg = (scrollY * 0.02) % 360;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none aria-hidden:true">
      {/* 1. Animated Radial Ambient Gradient Orbs (Shifting color depth on scroll) */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full opacity-30 blur-[130px] transition-transform duration-700 ease-out bg-gradient-to-br from-purple-700 via-indigo-800 to-cyan-600 animate-pulse-slow"
        style={{
          transform: `translate3d(0, ${translateY1}px, 0) rotate(${rotateDeg}deg)`
        }}
      />

      <div
        className="absolute top-[40%] -right-[15%] w-[65vw] h-[65vw] rounded-full opacity-25 blur-[140px] transition-transform duration-700 ease-out bg-gradient-to-bl from-teal-600 via-purple-900 to-emerald-700"
        style={{
          transform: `translate3d(0, ${translateY2}px, 0) rotate(${-rotateDeg}deg)`
        }}
      />

      <div
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full opacity-20 blur-[120px] transition-transform duration-1000 ease-out bg-gradient-to-tr from-fuchsia-700 via-purple-900 to-amber-600"
        style={{
          transform: `translate3d(0, ${translateY1 * -0.5}px, 0)`
        }}
      />

      {/* 2. Infinite Scrolling Cyber Mesh Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] bg-grid-cyber"
        style={{
          transform: `translate3d(0, ${gridOffsetY}px, 0)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* 3. Dynamic Animated Perspective Floor Grid (3D Depth Effect on scroll) */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] opacity-20 perspective-1000 overflow-hidden">
        <div 
          className="w-full h-[200%] bg-grid-cyber origin-bottom animate-grid-flow"
          style={{
            transform: `rotateX(60deg) translate3d(0, ${gridOffsetY * 1.5}px, 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Horizon fading vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030208] via-[#030208]/70 to-transparent" />
      </div>

      {/* 4. Drifting Floating Particles Starfield */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping shadow-[0_0_8px_#06b6d4]" style={{ animationDuration: '3s' }} />
        <div className="absolute top-[25%] right-[20%] w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_10px_#c084fc]" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[50%] left-[8%] w-1 h-1 bg-teal-300 rounded-full animate-ping shadow-[0_0_6px_#14b8a6]" style={{ animationDuration: '5s' }} />
        <div className="absolute top-[70%] right-[12%] w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#34d399]" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-[85%] left-[30%] w-2 h-2 bg-fuchsia-400 rounded-full animate-ping shadow-[0_0_10px_#e879f9]" style={{ animationDuration: '4.5s' }} />
      </div>

      {/* 5. Horizontal Floating Scanline Beam Effect */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scanline-beam" />
    </div>
  );
}
