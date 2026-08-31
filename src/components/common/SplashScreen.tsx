import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, duration = 1800 }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadingOut(true);
    }, duration - 400);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative backdrop glow */}
      <div className="absolute w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -top-10" />
      <div className="absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -bottom-10" />

      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        <BrandLogo size="xl" showTagline={false} inverted={true} className="mb-4" />

        <div className="text-center mt-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            BHARAT <span className="text-orange-500">SCHOOLS</span> MANAGEMENT
          </h1>
          <p className="mt-2 text-sm sm:text-base font-medium text-slate-400 tracking-widest uppercase">
            Smart School Management
          </p>
        </div>

        {/* Minimal Indian saffron-green loading indicator */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
          <span className="text-xs text-slate-500 font-mono tracking-wider">
            Initializing Multi-School Cloud Platform...
          </span>
        </div>
      </div>
    </div>
  );
};
