import React from 'react';

interface SubManagerLogoProps {
  size?: number;
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const SubManagerLogo: React.FC<SubManagerLogoProps> = ({
  size = 36,
  showText = true,
  textColor,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon matching attachment logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        <defs>
          {/* Outer Card Gradient (Blue to Violet/Purple) */}
          <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>

          {/* Badge Gradient for Credit Card Circle */}
          <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          {/* Text Gradient */}
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Container Card */}
        <rect x="6" y="6" width="76" height="88" rx="20" fill="url(#logoBgGrad)" />
        
        {/* Subtle shadow layer behind white sheet */}
        <rect x="14" y="10" width="76" height="84" rx="18" fill="#4338CA" fillOpacity="0.3" />

        {/* White Inner Sheet */}
        <rect x="12" y="12" width="68" height="76" rx="16" fill="#FFFFFF" />

        {/* Top Dollar Symbol ($) */}
        <text
          x="28"
          y="34"
          fontSize="22"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          fill="#3B82F6"
          textAnchor="middle"
        >
          $
        </text>

        {/* Top Bill Lines */}
        <rect x="38" y="22" width="30" height="4" rx="2" fill="#93C5FD" />
        <rect x="38" y="29" width="22" height="4" rx="2" fill="#BFDBFE" />

        {/* Item 1 Checkmark & Line */}
        <circle cx="28" cy="46" r="6" fill="#10B981" />
        <path d="M25 46 L27 48 L31 44" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="44" width="34" height="4" rx="2" fill="#CBD5E1" />

        {/* Item 2 Checkmark & Line */}
        <circle cx="28" cy="60" r="6" fill="#3B82F6" />
        <path d="M25 60 L27 62 L31 58" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="58" width="22" height="4" rx="2" fill="#E2E8F0" />

        {/* Item 3 Checkmark & Line */}
        <circle cx="28" cy="74" r="6" fill="#8B5CF6" />
        <path d="M25 74 L27 76 L31 72" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="38" y="72" width="16" height="4" rx="2" fill="#E2E8F0" />

        {/* Circular Card Badge (Bottom-Right overlay) */}
        <circle cx="68" cy="68" r="24" fill="url(#badgeGrad)" stroke="#FFFFFF" strokeWidth="3" />

        {/* Circular Renewal Arrow */}
        <path
          d="M 52 68 A 16 16 0 1 1 78 79"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrowhead */}
        <polygon points="77,73 83,81 74,83" fill="#FFFFFF" />

        {/* Mini Credit Card Graphic inside badge */}
        <rect x="58" y="60" width="20" height="13" rx="2.5" fill="#FFFFFF" fillOpacity="0.95" />
        <rect x="58" y="63" width="20" height="2.5" fill="#3B82F6" />
        <rect x="61" y="69" width="4" height="1.8" rx="0.5" fill="#6366F1" />
      </svg>

      {/* Typography Label */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight text-base sm:text-lg ${textColor || 'text-neutral-900 dark:text-white'}`}>
            Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Manager</span>
          </span>
          <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase mt-0.5">
            Subscription Suite
          </span>
        </div>
      )}
    </div>
  );
};
