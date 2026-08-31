import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = true,
  inverted = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9', text: 'text-lg', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-sm' },
  };

  const s = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Abstract Emblem: Book + School Portal + Digital Sun/Ashoka Chakra Inspired node */}
      <div className={`relative ${s.icon} flex-shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-2 shadow-md border border-slate-700/50 group`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform group-hover:scale-105"
        >
          {/* Base Open Book Pedestal */}
          <path
            d="M6 36C12 33 18 33 24 36C30 33 36 33 42 36V14C36 11 30 11 24 14C18 11 12 11 6 14V36Z"
            fill="#F8FAFC"
            fillOpacity="0.15"
            stroke="#EA580C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Academic Pillar / Arch */}
          <path
            d="M24 14V36M16 19L24 14L32 19M18 25H30M19 31H29"
            stroke="#F97316"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Digital Smart Tech Ray / Indian Accent Sun */}
          <circle cx="24" cy="8" r="3.5" fill="#F97316" />
          <path d="M24 2V4M28 4L27 6M20 4L21 6" stroke="#FB923C" strokeWidth="1.8" strokeLinecap="round" />
          {/* Green Progress Leaf/Base */}
          <path
            d="M10 37.5C16 34.5 24 37 24 37C24 37 32 34.5 38 37.5"
            stroke="#22C55E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5 font-extrabold tracking-tight">
          <span className={`font-heading ${inverted ? 'text-white' : 'text-slate-900 dark:text-white'} ${s.text} font-black uppercase tracking-wider`}>
            BHARAT <span className="text-orange-600 dark:text-orange-500">SCHOOLS</span>
          </span>
        </div>
        {showTagline && (
          <span className={`font-sans font-medium tracking-wide uppercase ${inverted ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'} ${s.sub}`}>
            Smart School Management
          </span>
        )}
      </div>
    </div>
  );
};
